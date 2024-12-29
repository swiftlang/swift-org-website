---
redirect_from: "server/guides/deploying/aws-copilot-fargate-vapor-mongo"
layout: page
title: 使用 Fargate Vapor 和 MongoDB Atlas 部署到 AWS
---

本指南说明了如何在 AWS 上部署 Server-Side Swift 工作负载。该工作负载是一个用于管理待办事项列表的 REST API。它使用 [Vapor](https://vapor.codes/) 框架来编写 API 方法，这些方法将数据存储到 [MongoDB Atlas](https://www.mongodb.com/atlas/database) 云数据库中，并支持数据的检索。 Vapor 应用被容器化并通过 [AWS Copilot](https://aws.github.io/copilot-cli/) 工具部署到 AWS 的 AWS Fargate 服务上。

## 架构

![Architecture](/assets/images/server-guides/aws/aws-fargate-vapor-mongo.png)

- Amazon API Gateway 接收 API 请求
- API Gateway 通过由 AWS Cloud Map 管理的内部 DNS 定位在 AWS Fargate 中的应用容器
- API Gateway 将请求转发到容器
- 容器运行 Vapor 框架，并提供 GET 和 POST 项目的方法
- Vapor 将项目存储到 MongoDB Atlas 云数据库，并从中检索数据，数据库运行在由 MongoDB 管理的 AWS 账户中

## 先决条件

要构建此示例应用程序，您需要：

- [AWS Account](https://console.aws.amazon.com/)
- [MongoDB Atlas Database](https://www.mongodb.com/atlas/database)
- [AWS Copilot](https://aws.github.io/copilot-cli/) - 用于在 AWS 上创建容器化工作负载的命令行工具
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - 将 Swift 代码编译为 Docker 镜像
- [Vapor](https://vapor.codes/) - 用于编写 REST 服务
- [AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) - 安装 CLI 并 [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) 将其与您的 AWS 账户凭证关联

## 步骤 1：创建您的数据库

如果您是 MongoDB Atlas 的新用，请按照以下步骤操作 [Getting Started Guide](https://www.mongodb.com/docs/atlas/getting-started/)。您需要创建以下内容：

- Atlas 账户
- 集群
- 数据库用户名/密码
- 数据库
- 集合

在后续步骤中，您将为这些项提供值以配置应用程序。

## 步骤 2：初始化一个新的 Vapor 项目

为您的项目创建一个文件夹。

```
mkdir todo-app && cd todo-app
```

Initialize a Vapor project named *api*.

```
vapor new api -n
```

## 步骤 3：添加项目依赖项

Vapor 为项目依赖项初始化一个 *Package.swift* 文件。您的项目需要一个额外的库，  [MongoDBVapor](https://github.com/mongodb/mongodb-vapor)。将 MongoDBVapor 库添加到 *Package.swift* 文件的项目和目标依赖项中。

更新后的文件应如下所示：

**api/Package.swift**
```swift
// swift-tools-version:5.6
import PackageDescription

let package = Package(
    name: "api",
    platforms: [
       .macOS(.v12)
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor", .upToNextMajor(from: "4.7.0")),
        .package(url: "https://github.com/mongodb/mongodb-vapor", .upToNextMajor(from: "1.1.0"))
    ],
    targets: [
        .target(
            name: "App",
            dependencies: [
                .product(name: "Vapor", package: "vapor"),
                .product(name: "MongoDBVapor", package: "mongodb-vapor")
            ],
            swiftSettings: [
                .unsafeFlags(["-cross-module-optimization"], .when(configuration: .release))
            ]
        ),
        .executableTarget(name: "Run", dependencies: [.target(name: "App")]),
        .testTarget(name: "AppTests", dependencies: [
            .target(name: "App"),
            .product(name: "XCTVapor", package: "vapor"),
        ])
    ]
)
```

## Step 4: 更新 Dockerfile

您将 Swift 服务端代码作为 Docker 镜像部署到 AWS Fargate。Vapor 为您的应用程序生成了一个初始 Dockerfile。您的应用程序需要对该 Dockerfile 进行以下几项修改：

- 从以下来源拉取 *build* 和 *run* 镜像： [Amazon ECR Public Gallery](https://gallery.ecr.aws)  容器存储库
- 安装 *libssl-dev* 在构建镜像中
- 安装 *libxml2* and *curl* 在运行镜像中

将 Vapor 生成的 Dockerfile 内容替换为以下代码：

**api/Dockerfile**
```Dockerfile
# ================================
# Build image
# ================================
FROM public.ecr.aws/docker/library/swift:5.6.2-focal as build

# Install OS updates
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true \
    && apt-get -q update \
    && apt-get -q dist-upgrade -y \
    && apt-get -y install libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up a build area
WORKDIR /build

# First just resolve dependencies.
# This creates a cached layer that can be reused
# as long as your Package.swift/Package.resolved
# files do not change.
COPY ./Package.* ./
RUN swift package resolve

# Copy entire repo into container
COPY . .

# Build everything, with optimizations
RUN swift build -c release --static-swift-stdlib

# Switch to the staging area
WORKDIR /staging

# Copy main executable to staging area
RUN cp "$(swift build --package-path /build -c release --show-bin-path)/Run" ./

# Copy resources bundled by SwiftPM to staging area
RUN find -L "$(swift build --package-path /build -c release --show-bin-path)/" -regex '.*\.resources$' -exec cp -Ra {} ./ \;

# Copy any resources from the public directory and views directory if the directories exist
# Ensure that by default, neither the directory nor any of its contents are writable.
RUN [ -d /build/Public ] && { mv /build/Public ./Public && chmod -R a-w ./Public; } || true
RUN [ -d /build/Resources ] && { mv /build/Resources ./Resources && chmod -R a-w ./Resources; } || true

# ================================
# Run image
# ================================
FROM public.ecr.aws/ubuntu/ubuntu:focal

# Make sure all system packages are up to date, and install only essential packages.
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true \
    && apt-get -q update \
    && apt-get -q dist-upgrade -y \
    && apt-get -q install -y \
      ca-certificates \
      tzdata \
      curl \
      libxml2 \
    && rm -r /var/lib/apt/lists/*

# Create a vapor user and group with /app as its home directory
RUN useradd --user-group --create-home --system --skel /dev/null --home-dir /app vapor

# Switch to the new home directory
WORKDIR /app

# Copy built executable and any staged resources from builder
COPY --from=build --chown=vapor:vapor /staging /app

# Ensure all further commands run as the vapor user
USER vapor:vapor

# Let Docker bind to port 8080
EXPOSE 8080

# Start the Vapor service when the image is run, default to listening on 8080 in production environment
ENTRYPOINT ["./Run"]
CMD ["serve", "--env", "production", "--hostname", "0.0.0.0", "--port", "8080"]
```

## 步骤 5：更新 Vapor 源代码

Vapor 还会生成编写 API 所需的示例文件。您需要使用代码自定义这些文件，以公开您的待办事项列表 API 方法并与 MongoDB 数据库交互。

*configure.swift* 文件用于初始化一个面向整个应用的 MongoDB 数据库连接池。它在运行时从环境变量中获取 MongoDB 数据库的连接字符串。

将该文件的内容替换为以下代码：

**api/Sources/App/configure.swift**
```swift
import MongoDBVapor
import Vapor

public func configure(_ app: Application) throws {

    let MONGODB_URI = Environment.get("MONGODB_URI") ?? ""

    try app.mongoDB.configure(MONGODB_URI)

    ContentConfiguration.global.use(encoder: ExtendedJSONEncoder(), for: .json)
    ContentConfiguration.global.use(decoder: ExtendedJSONDecoder(), for: .json)

    try routes(app)
}
```

*routes.swift* 文件定义了您的 API 方法。这些方法包括一个 *POST Item* 方法，用于插入新项，以及一个 *GET Items* 方法，用于检索所有现有项的列表。请参阅代码中的注释以理解每个部分的功能。

将该文件的内容替换为以下代码：

**api/Sources/App/routes.swift**
```swift
import Vapor
import MongoDBVapor

// define the structure of a ToDoItem
struct ToDoItem: Content {
    var _id: BSONObjectID?
    let name: String
    var createdOn: Date?
}

// import the MongoDB database and collection names from environment variables
let MONGODB_DATABASE = Environment.get("MONGODB_DATABASE") ?? ""
let MONGODB_COLLECTION = Environment.get("MONGODB_COLLECTION") ?? ""

// define an extension to the Vapor Request object to interact with the database and collection
extension Request {

    var todoCollection: MongoCollection<ToDoItem> {
        self.application.mongoDB.client.db(MONGODB_DATABASE).collection(MONGODB_COLLECTION, withType: ToDoItem.self)
    }
}

// define the api routes
func routes(_ app: Application) throws {

    // an base level route used for container healthchecks
    app.get { req in
        return "OK"
    }

    // GET items returns a JSON array of all items in the database
    app.get("items") { req async throws -> [ToDoItem] in
        try await req.todoCollection.find().toArray()
    }

    // POST item inserts a new item into the database and returns the item as JSON
    app.post("item") { req async throws -> ToDoItem in

        var item = try req.content.decode(ToDoItem.self)
        item.createdOn = Date()

        let response = try await req.todoCollection.insertOne(item)
        item._id = response?.insertedID.objectIDValue

        return item
    }
}
```

*main.swift* 文件定义了应用程序的启动和关闭代码。修改代码以包含一个 *defer* 语句，用于在应用程序结束时关闭与 MongoDB 数据库的连接。

将该文件的内容替换为以下代码：

**api/Sources/Run/main.swift**
```swift
import App
import Vapor
import MongoDBVapor

var env = try Environment.detect()
try LoggingSystem.bootstrap(from: &env)
let app = Application(env)
try configure(app)

// shutdown and cleanup the MongoDB connection when the application terminates
defer {
  app.mongoDB.cleanup()
  cleanupMongoSwift()
  app.shutdown()
}

try app.run()
```

## 步骤 6：初始化 AWS Copilot

[AWS Copilot](https://aws.github.io/copilot-cli/) Copilot 是一个命令行工具，用于在 AWS 中生成容器化应用程序。您使用 Copilot 来构建和部署您的 Vapor 代码作为 Fargate 中的容器。Copilot 还会为您的 MongoDB 连接字符串的值创建并跟踪一个 AWS Systems Manager 秘密参数。您将此值存储为秘密，因为它包含您的数据库的用户名和密码。您绝不希望将其存储在源代码中。最后，Copilot 会创建一个 API Gateway，公开您的 API 的公共端点。

初始化一个新的 Copilot 应用程序。

```bash
copilot app init todo
```

添加一个新的 Copilot *后台服务*。该服务引用您 Vapor 项目的 Dockerfile，以获取如何构建容器的指令。

```bash
copilot svc init --name api --svc-type "Backend Service" --dockerfile ./api/Dockerfile
```

为您的应用程序创建一个 Copilot 环境。一个环境通常与一个阶段对应，例如开发（dev）、测试（test）或生产（prod）。当提示时，选择您通过 AWS CLI 配置的 AWS 凭证配置文件。

```bash
copilot env init --name dev --app todo --default-config
```

Deploy the *dev* environment:

```bash
copilot env deploy --name dev
```

## 步骤 7：为数据库凭证创建一个 Copilot 秘密参数

您的应用程序需要凭证来验证 MongoDB Atlas 数据库的身份。您绝不应将这些敏感信息存储在源代码中。创建一个 Copilot *secret* 来存储这些凭证。这会将您的 MongoDB 集群的连接字符串存储在 AWS Systems Manager 秘密参数中。

从 MongoDB Atlas 网站获取连接字符串。在集群页面上选择 Connect 按钮，然后选择 *Connect your application*.

![Architecture](/assets/images/server-guides/aws/aws-fargate-vapor-mongo-atlas-connection.png)

选择 *Swift version 1.2.0* 作为驱动程序，并复制显示的连接字符串。它看起来像这样：

```bash
mongodb+srv://username:<password>@mycluster.mongodb.net/?retryWrites=true&w=majority
```

连接字符串包含您的数据库用户名和密码的占位符。将 *\<password\>**  部分替换为您的数据库密码。然后，创建一个新的 Copilot 秘密参数，命名为 MONGODB_URI，并在提示输入值时保存您的连接字符串。

```bash
copilot secret init --app todo --name MONGODB_URI
```

Fargate 会在运行时将秘密值作为环境变量注入到您的容器中。在上面的步骤 5 中，您在*api/Sources/App/configure.swift* 文件中提取了该值，并用它来配置您的 MongoDB 连接。

## 步骤 8：配置后台服务

Copilot 为您的应用程序生成了一个 *manifest.yml* 文件，该文件定义了服务的属性，例如 Docker 镜像、网络、秘密参数和环境变量。修改 Copilot 生成的清单文件以添加以下属性：

- 配置容器镜像的健康检查
- 添加对 MONGODB_URI 秘密参数的引用
- 将服务网络配置为 private（私有）
- 添加用于 MONGODB_DATABASE 和 MONGODB_COLLECTION 的环境变量

要实现这些更改，请将 *manifest.yml* 文件的内容替换为以下代码。根据您在 MongoDB Atlas 中为此应用程序创建的数据库和集合的名称，更新 MONGODB_DATABASE 和 MONGODB_COLLECTION 的值。

如果您在 **Mac M1/M2** 机器上构建此解决方案，请取消注释 *manifest.yml* 文件中的 **platform** 属性，以指定 ARM 构建。默认值为 *linux/x86_64*。

**copilot/api/manifest.yml**
```yaml
# The manifest for the "api" service.
# Read the full specification for the "Backend Service" type at:
#  https://aws.github.io/copilot-cli/docs/manifest/backend-service/

# Your service name will be used in naming your resources like log groups, ECS services, etc.
name: api
type: Backend Service

# Your service is reachable at "http://api.${COPILOT_SERVICE_DISCOVERY_ENDPOINT}:8080" but is not public.

# Configuration for your containers and service.
image:
  # Docker build arguments. For additional overrides: https://aws.github.io/copilot-cli/docs/manifest/backend-service/#image-build
  build: api/Dockerfile
  # Port exposed through your container to route traffic to it.
  port: 8080
  healthcheck:
    command: ["CMD-SHELL", "curl -f http://localhost:8080 || exit 1"]
    interval: 10s
    retries: 2
    timeout: 5s
    start_period: 0s

# Mac M1/M2 users - uncomment the following platform line
# the default platform is linux/x86_64

# platform: linux/arm64

cpu: 256       # Number of CPU units for the task.
memory: 512    # Amount of memory in MiB used by the task.
count: 2       # Number of tasks that should be running in your service.
exec: true     # Enable running commands in your container.

# define the network as private. this will place Fargate in private subnets
network:
  vpc:
    placement: private

# Optional fields for more advanced use-cases.
#
# Pass environment variables as key value pairs.
variables:
 MONGODB_DATABASE: home
 MONGODB_COLLECTION: todolist

# Pass secrets from AWS Systems Manager (SSM) Parameter Store.
secrets:
 MONGODB_URI: /copilot/${COPILOT_APPLICATION_NAME}/${COPILOT_ENVIRONMENT_NAME}/secrets/MONGODB_URI

# You can override any of the values defined above by environment.
#environments:
#  test:
#    count: 2               # Number of tasks to run for the "test" environment.
#    deployment:            # The deployment strategy for the "test" environment.
#       rolling: 'recreate' # Stops existing tasks before new ones are started for faster deployments.
```

## 步骤 9：为您的 API Gateway 创建一个 Copilot 附加服务

Copilot 无法直接为您的应用程序添加 API Gateway。然而，您可以使用 addons 功能为应用程序添加其他 AWS 资源。 [Copilot "Addons"](https://aws.github.io/copilot-cli/docs/developing/additional-aws-resources/#how-to-do-i-add-other-resources).

通过在您的 Copilot 服务文件夹下创建一个 *addons* 文件夹，并编写一个 CloudFormation YAML 模板来定义您希望创建的服务，从而定义一个附加组件。

为附加组件创建文件夹：

```bash
mkdir -p copilot/api/addons
```

创建一个文件来定义 API Gateway：

```bash
touch copilot/api/addons/apigateway.yml
```

创建一个文件，将参数从主服务传递到附加服务：

```bash
touch copilot/api/addons/addons.parameters.yml
```

将以下代码复制到 *addons.parameters.yml* 文件中。它将 Cloud Map 服务的 ID 传递到附加堆栈中：

**copilot/api/addons/addons.parameters.yml**
```yaml
Parameters:
   DiscoveryServiceARN:  !GetAtt DiscoveryService.Arn
```

将以下代码复制到 *addons/apigateway.yml* 文件中。它使用 DiscoveryServiceARN 创建一个 API Gateway，并与 Copilot 为您的 Fargate 容器创建的 Cloud Map 服务集成：

**copilot/api/addons/apigateway.yml**
```yaml
Parameters:
  App:
    Type: String
    Description: Your application's name.
  Env:
    Type: String
    Description: The environment name your service, job, or workflow is being deployed to.
  Name:
    Type: String
    Description: The name of the service, job, or workflow being deployed.
  DiscoveryServiceARN:
    Type: String
    Description: The ARN of the Cloud Map discovery service.

Resources:
  ApiVpcLink:
    Type: AWS::ApiGatewayV2::VpcLink
    Properties:
      Name: !Sub "${App}-${Env}-${Name}"
      SubnetIds:
        !Split [",", Fn::ImportValue: !Sub "${App}-${Env}-PrivateSubnets"]
      SecurityGroupIds:
        - Fn::ImportValue: !Sub "${App}-${Env}-EnvironmentSecurityGroup"

  ApiGatewayV2Api:
    Type: "AWS::ApiGatewayV2::Api"
    Properties:
      Name: !Sub "${Name}.${Env}.${App}.api"
      ProtocolType: "HTTP"
      CorsConfiguration:
        AllowHeaders:
          - "*"
        AllowMethods:
          - "*"
        AllowOrigins:
          - "*"

  ApiGatewayV2Stage:
    Type: "AWS::ApiGatewayV2::Stage"
    Properties:
      StageName: "$default"
      ApiId: !Ref ApiGatewayV2Api
      AutoDeploy: true

  ApiGatewayV2Integration:
    Type: "AWS::ApiGatewayV2::Integration"
    Properties:
      ApiId: !Ref ApiGatewayV2Api
      ConnectionId: !Ref ApiVpcLink
      ConnectionType: "VPC_LINK"
      IntegrationMethod: "ANY"
      IntegrationType: "HTTP_PROXY"
      IntegrationUri: !Sub "${DiscoveryServiceARN}"
      TimeoutInMillis: 30000
      PayloadFormatVersion: "1.0"

  ApiGatewayV2Route:
    Type: "AWS::ApiGatewayV2::Route"
    Properties:
      ApiId: !Ref ApiGatewayV2Api
      RouteKey: "$default"
      Target: !Sub "integrations/${ApiGatewayV2Integration}"
```

## 步骤 10：部署 Copilot 服务

在部署您的服务时，Copilot 执行以下操作：

- 构建您的 Vapor Docker 镜像
- 将该镜像部署到您 AWS 账户中的 Amazon Elastic Container Registry (ECR)
- 创建并部署一个 AWS CloudFormation 模板到您的 AWS 账户中。CloudFormation 会创建应用程序中定义的所有服务。

```bash
copilot svc deploy --name api --app todo --env dev
```

## 步骤 11：配置 MongoDB Atlas 网络访问

MongoDB Atlas 使用 IP 访问列表来限制访问数据库的源 IP 地址。在您的应用程序中，来自容器的流量来源于应用程序网络中 NAT 网关的公共 IP 地址。您必须配置 MongoDB Atlas 以允许来自这些 IP 地址的流量。

要获取 NAT 网关的 IP 地址，请运行以下 AWS CLI 命令：

```bash
aws ec2 describe-nat-gateways --filter "Name=tag-key, Values=copilot-application" --query 'NatGateways[?State == `available`].NatGatewayAddresses[].PublicIp' --output table
```

Output:

```bash
---------------------
|DescribeNatGateways|
+-------------------+
|  1.1.1.1          |
|  2.2.2.2          |
+-------------------+
```

使用这些 IP 地址在您的 MongoDB Atlas 账户中为每个地址创建一个网络访问规则。

![Architecture](/assets/images/server-guides/aws/aws-fargate-vapor-mongo-atlas-network-address.png)

## 步骤 12：使用您的 API

要获取您的 API 的端点，请使用以下 AWS CLI 命令：

```bash
aws apigatewayv2 get-apis --query 'Items[?Name==`api.dev.todo.api`].ApiEndpoint' --output table
```

Output:

```bash
------------------------------------------------------------
|                          GetApis                         |
+----------------------------------------------------------+
|  https://[your-api-endpoint]                             |
+----------------------------------------------------------+
```

使用 cURL 或类似的工具，如 [Postman](https://www.postman.com/) 与您的 API 交互：

添加一个待办事项列表项

```bash
curl --request POST 'https://[your-api-endpoint]/item' --header 'Content-Type: application/json' --data-raw '{"name": "my todo item"}'
```

检索待办事项列表项

```bash
curl https://[your-api-endpoint]/items
```

## 清理

完成应用程序后，使用 Copilot 删除它。这将删除您 AWS 账户中创建的所有服务。

```bash
copilot app delete --name todo
```
