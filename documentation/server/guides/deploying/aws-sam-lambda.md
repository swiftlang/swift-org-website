---
redirect_from: "server/guides/deploying/aws-sam-lambda"
layout: page
title: 使用 Serverles 应用程序模型（SAM）部署到 AWS Lambda
---

本指南说明了如何使用 Serverless 应用程序模型（SAM） 在 AWS 上部署一个服务器端 Swift 工作负载。 [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/) 工具包。该工作负载是一个用于跟踪待办事项列表的 REST API。它使用 AWS Lambda 部署该 API，并通过 Amazon API Gateway 提供访问。 [Amazon API Gateway](https://aws.amazon.com/api-gateway/)。API 方法通过使用 AWS SDK for Swift 将数据存储和检索到[Amazon DynamoDB](https://aws.amazon.com/dynamodb) 数据库中。 [AWS Lambda](https://aws.amazon.com/lambda/) 函数。

## 架构

![Architecture](/assets/images/server-guides/aws/aws-lambda-sam-arch.png)

- Amazon API Gateway 接收 API 请求
- API Gateway 调用 Lambda 函数以处理 PUT 和 GET 事件
- Lambda 函数使用 [AWS SDK for Swift](https://aws.amazon.com/sdk-for-swift/) 和 [Swift AWS Lambda Runtime](https://github.com/swift-server/swift-aws-lambda-runtime) 来从数据库检索和保存数据项。


## 先决条件

要构建此示例应用程序，您需要：

- [AWS Account](https://console.aws.amazon.com/)
- [AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) - 安装 CLI 并 [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) 将其配置为使用您的 AWS 账户凭证。
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started.html) - 一个用于在 AWS 上创建无服务器工作负载的命令行工具。
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - 将您的 Swift 代码编译为 Docker 镜像。

## 步骤 1：创建一个新的 SAM 项目 

SAM 项目会在您的 AWS 账户中创建资源（Lambda 函数、API Gateway 和 DynamoDB 表）。您需要在 YAML 模板中定义这些资源。

为您的项目创建一个文件夹，并创建一个新的 **template.yml** 文件。

```
mkdir swift-lambda-api && cd swift-lambda-api
touch template.yml
```

打开 **template.yml** 文件，并添加以下代码。查看代码中的注释，以了解每个部分创建了什么内容。

```yml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  # DynamoDB 表用于存储你的数据
  SwiftAPITable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String

  # Lambda 函数将项目插入到数据库
  PutItemFunction:
    Type: AWS::Serverless::Function
    Properties:
      # 将函数打包为 Docker 镜像
      PackageType: Image
      Policies:
        # 允许函数读取和写入数据库表
        - DynamoDBCrudPolicy:
            TableName: !Ref SwiftAPITable
      Environment:
        # 将数据库表名存储为环境变量
        Variables:
          TABLE_NAME: !Ref SwiftAPITable
      Events:
        # 处理 REST API 中的 POST /item 方法
        Api:
          Type: HttpApi
          Properties:
            Method: post
            Path: /item
    Metadata:
      # 函数代码和 Docker 文件的位置
      DockerContext: ./src/put-item
      Dockerfile: Dockerfile
      DockerBuildArgs:
        TARGET_NAME: put-item

  # Lambda 函数从数据库中检索项目
  GetItemsFunction:
    Type: AWS::Serverless::Function
    Properties:
      # 将函数打包为 Docker 镜像
      PackageType: Image
      Policies:
        # 允许函数读取和写入数据库表
        - DynamoDBCrudPolicy:
            TableName: !Ref SwiftAPITable
      Environment:
        # 将数据库表名存储为环境变量
        Variables:
          TABLE_NAME: !Ref SwiftAPITable
      Events:
        # 处理 REST API 中的 GET /items 方法
        Api:
          Type: HttpApi
          Properties:
            Method: get
            Path: /items
    Metadata:
      # 函数代码和 Docker 文件的位置
      DockerContext: ./src/get-items
      Dockerfile: Dockerfile
      DockerBuildArgs:
        TARGET_NAME: get-items

# 打印 API 端点和数据库表名
Outputs:
  SwiftAPIEndpoint:
    Description: "API Gateway endpoint URL for your application"
    Value: !Sub "https://${ServerlessHttpApi}.execute-api.${AWS::Region}.amazonaws.com"
  SwiftAPITable:
    Description: "DynamoDB Table Name"
    Value: !Ref SwiftAPITable
```
## 步骤 2：使用 SwiftPM 初始化 Lambda 函数

用 Swift 编写的 Lambda 函数用于处理 API 事件。 *PutItem* 函数处理 *POST* 请求，将项目添加到数据库。
GetItems 函数处理 *GET* 请求，从数据库检索项目。

使用 Swift Package Manager 为每个函数初始化一个项目，并为每个文件夹添加一个 *Dockerfile* 文件。

```bash
mkdir -p src/put-item
cd src/put-item
swift package init --type executable
touch Dockerfile

cd ../..

mkdir -p src/get-items
cd src/get-items
swift package init --type executable
touch Dockerfile
```

## Step 3: 更新 Dockerfile 文件

Docker 用于编译您的 Swift 代码并将镜像部署到 Lambda。将以下代码复制到您在每个函数文件夹中创建的 *Dockerfile* 中。

```Dockerfile
# 用于编译 Swift 代码的镜像
FROM --platform=linux/amd64 public.ecr.aws/docker/library/swift:5.7.2-amazonlinux2 as builder

ARG TARGET_NAME

RUN yum -y install git jq tar zip openssl-devel
WORKDIR /build-lambda
RUN mkdir -p /Sources/$TARGET_NAME/
RUN mkdir -p /Tests/$TARGET_NAME/
ADD /Sources/ ./Sources/
ADD /Tests/ ./Tests/
COPY Package.swift .
RUN cd /build-lambda && swift package clean && swift build --static-swift-stdlib -c release

# image deplpoyed to AWS Lambda with your compiled executable
FROM public.ecr.aws/lambda/provided:al2-x86_64

ARG TARGET_NAME

RUN mkdir -p /var/task/
RUN mkdir -p /var/runtime/
COPY --from=builder /build-lambda/.build/release/$TARGET_NAME /var/task/lambdaExec
RUN chmod 755 /var/task/lambdaExec
RUN ln -s /var/task/lambdaExec /var/runtime/bootstrap
RUN chmod 755 /var/runtime/bootstrap
WORKDIR /var/task
CMD ["/var/task/lambdaExec"]
```

## 步骤 4：更新 Swift 依赖项

您的项目需要 3 个库
- swift-aws-lambda-runtime
- swift-aws-lambda-events
- aws-sdk-swift

您可以在 *Package.swift* 文件中定义它们。将每个函数文件夹中的 *Package.swift* 文件内容替换为以下代码。

**src/put-item/Sources/put-item/Package.swift**
```swift
// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "put-item",
    platforms: [.macOS(.v12)],
    dependencies: [
        .package(url: "https://github.com/swift-server/swift-aws-lambda-runtime", branch: "main"),
        .package(url: "https://github.com/swift-server/swift-aws-lambda-events", branch: "main"),
        .package(url: "https://github.com/awslabs/aws-sdk-swift", from: "0.9.1")
    ],
    targets: [
        .executableTarget(
            name: "put-item",
            dependencies: [
                .product(name: "AWSLambdaRuntime",package: "swift-aws-lambda-runtime"),
                .product(name: "AWSLambdaEvents", package: "swift-aws-lambda-events"),
                .product(name: "AWSDynamoDB", package: "aws-sdk-swift")
            ]),
        .testTarget(
            name: "put-itemTests",
            dependencies: ["put-item"]),
    ]
)
```

**src/get-items/Sources/get-items/Package.swift**
```swift
// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "get-items",
    platforms: [.macOS(.v12)],
    dependencies: [
        .package(url: "https://github.com/swift-server/swift-aws-lambda-runtime", branch: "main"),
        .package(url: "https://github.com/swift-server/swift-aws-lambda-events", branch: "main"),
        .package(url: "https://github.com/awslabs/aws-sdk-swift", from: "0.9.1")
    ],
    targets: [
        .executableTarget(
            name: "get-items",
            dependencies: [
                .product(name: "AWSLambdaRuntime",package: "swift-aws-lambda-runtime"),
                .product(name: "AWSLambdaEvents", package: "swift-aws-lambda-events"),
                .product(name: "AWSDynamoDB", package: "aws-sdk-swift")
            ]),
        .testTarget(
            name: "get-itemsTests",
            dependencies: ["get-items"]),
    ]
)
```

## 步骤 5：更新 Lambda 函数的源代码

将每个 Swift 项目主代码文件的内容替换为以下代码。

**src/put-item/Sources/put-item/put_item.swift**

```swift
// import the packages required by our function
import Foundation
import AWSLambdaRuntime
import AWSLambdaEvents
import AWSDynamoDB

// define Codable struct for function response
struct Item : Codable {
    var id: String?
    let itemName: String
}

enum FunctionError: Error {
    case envError
}

@main
struct PutItemFunction: SimpleLambdaHandler {

    // Lambda Function handler
    func handle(_ event: APIGatewayV2Request, context: LambdaContext) async throws -> Item {

        print("event received:\(event)")

        // create a client to interact with DynamoDB
        let client = try await DynamoDBClient()

        // obtain DynamoDB table name from function's environment variables
        guard let tableName = ProcessInfo.processInfo.environment["TABLE_NAME"] else {
            throw FunctionError.envError
        }

        // decode data from APIGateway POST into a codable struct
        var item = try JSONDecoder().decode(
            Item.self,
            from: event.body!.data(using: .utf8)!
        )

        // generate a unique id for the key of the item
        item.id = UUID().uuidString

        // use SDK to put the item into the database and return the item with key value
        let input = PutItemInput(item: ["id": .s(item.id!), "itemName": .s(item.itemName)], tableName: tableName)

        _ = try await client.putItem(input: input)

        return item
    }
}
```

**src/get-items/Sources/get_items/get_items.swift**

```swift
// import the packages required by our function
import Foundation
import AWSLambdaRuntime
import AWSLambdaEvents
import AWSDynamoDB

// define Codable struct for function response
struct Item : Codable {
    var id: String = ""
    var itemName: String = ""
}

enum FunctionError: Error {
    case envError
}

@main
struct GetItemsFunction: SimpleLambdaHandler {

    // Lambda Function handler
    func handle(_ event: APIGatewayV2Request, context: LambdaContext) async throws -> [Item] {

        print("event received:\(event)")

        // create a client to interact with DynamoDB
        let client = try await DynamoDBClient()

        // obtain DynamoDB table name from function's environment variables
        guard let tableName = ProcessInfo.processInfo.environment["TABLE_NAME"] else {
            throw FunctionError.envError
        }

        // use SDK to retrieve items from table
        let input = ScanInput(tableName: tableName)
        let response = try await client.scan(input: input)

        // return items in an array
        return response.items!.map() {i in
            var item = Item()

            if case .s(let value) = i["id"] {
                item.id = value
            }

            if case .s(let value) = i["itemName"] {
                item.itemName = value
            }

            return item
        }
    }
}
```

## 步骤 6：构建 SAM 项目

构建 SAM 项目需要使用你机器上的 Docker 将 Swift 代码编译为 Docker 镜像。在项目的根文件夹 *(swift-lambda-api)* 中运行以下命令。

```bash
sam build
```

## 部署 SAM 项目

部署你的 SAM 项目会在你的 AWS 账户中创建 Lambda 函数、API Gateway 和 DynamoDB 数据库。

```bash
sam deploy --guided
```

对每个提示接受默认响应，但以下两个例外：

```bash
PutItemFunction may not have authorization defined, Is this okay? [y/N]: y
GetItemsFunction may not have authorization defined, Is this okay? [y/N]: y
```

该项目会创建一个公开可访问的 API 端点。这些警告是为了告知您该 API 没有授权。如果您有兴趣为 API 添加授权，请参考以下内容： [SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-httpapi.html)。


## 第 8 步：使用你的 API

在部署结束时，SAM 会显示你 API Gateway 的端点：

```bash
Outputs
----------------------------------------------------------------------------------------
Key                 SwiftAPIEndpoint
Description         API Gateway endpoint URL for your application
Value               https://[your-api-id].execute-api.[your-aws-region].amazonaws.com
----------------------------------------------------------------------------------------
```

使用 cURL 或类似的工具，如 [Postman](https://www.postman.com/) ，与您的 API 进行交互。将 **[your-api-endpoint]** 替换为部署输出中的 SwiftAPIEndpoint 值。

添加一个待办事项项

```bash
curl --request POST 'https://[your-api-endpoint]/item' --header 'Content-Type: application/json' --data-raw '{"itemName": "my todo item"}'
```

检索待办事项列表项

```bash
curl https://[your-api-endpoint]/items
```

## 清理

完成应用程序后，使用 SAM 将其从您的 AWS 账户中删除。对所有提示回答 **Yes (y)**。

```bash
sam delete
```
