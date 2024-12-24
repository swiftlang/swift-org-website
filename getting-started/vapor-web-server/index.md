---
layout: page
title: 使用 Vapor 构建 Web 服务
---

> 本指南的源代码可以在 [GitHub](https://github.com/vapor/swift-getting-started-web-server) 上找到

{% include getting-started/_installing.md %}

## 选择 Web 框架

多年来，Swift 社区创建了几个用于构建 Web 服务的框架。本指南重点介绍 [Vapor](https://vapor.codes) Web 框架，这是社区中的一个流行选择。

## 安装 Vapor

首先，你需要安装 Vapor 工具箱。
如果你已经在 macOS 上安装了 Homebrew，运行：

```bash
brew install vapor
```

如果你使用其他操作系统或想从源代码安装工具箱，请参阅 [Vapor 文档](https://docs.vapor.codes/install/linux/#install-toolbox) 了解具体方法。

## 创建项目

然后，在终端中进入你想创建新项目的目录，运行：

```bash
vapor new HelloVapor
```

这会下载一个模板并询问你一系列问题来创建一个包含所有必需内容的简单项目。本指南将创建一个简单的 REST API，你可以向其发送和接收 JSON 数据。所以对其他问题都回答"否"。你会看到项目成功创建：

![新建 Vapor 项目]({{site.url}}/assets/images/getting-started-guides/vapor-web-server/new-project.png)

进入创建的目录并在你选择的 IDE 中打开项目。例如，要使用 VSCode，运行：

```bash
cd HelloVapor
code .
```

对于 Xcode，运行：

```bash
cd HelloVapor
open Package.swift
```

Vapor 的模板已经为你设置了许多文件和函数。**configure.swift** 包含配置应用程序的代码，**routes.swift** 包含路由处理代码。

## 创建路由

首先，打开 **routes.swift** 并在 `app.get("hello") { ... }` 下面创建一个新路由，向访问你网站的任何人说hello：

```swift
// 1
app.get("hello", ":name") { req async throws -> String in
    // 2
    let name = try req.parameters.require("name")
    // 3
    return "Hello, \(name.capitalized)!"
}
```

代码说明：

1. 声明一个新的路由处理程序，注册为对 `/hello/<NAME>` 的 **GET** 请求。`:` 表示 Vapor 中的动态路径参数，它会匹配任何值并允许你在路由处理程序中检索它。`app.get(...)` 的最后一个参数是一个闭包，可以是异步的，必须返回 `Response` 或符合 `ResponseEncodable` 的类型，如 `String`。
2. 从参数中获取名字。默认情况下，这返回一个 `String`。如果你想提取其他类型，比如 `Int` 或 `UUID`，你可以写 `req.parameters.require("id", as: UUID.self)`，Vapor 会尝试将其转换为该类型，如果无法转换则自动抛出错误。
3. 返回 `Response`，在这个例子中是一个 `String`。注意，你不需要设置状态码、响应体或任何头部信息。Vapor 会为你处理这些，同时也允许你在需要时控制返回的 `Response`。

保存文件并构建运行应用：

```bash
$ swift run
Building for debugging...
...
Build complete! (59.87s)
[ NOTICE ] Server starting on http://127.0.0.1:8080
```

向 `http://localhost:8080/hello/tim` 发送 **GET** 请求。你会收到响应：

```bash
$ curl http://localhost:8080/hello/tim
Hello, Tim!
```

试试用不同的名字，看看它是如何自动改变的！

## 返回 JSON

Vapor 在底层使用 [`Codable`](https://developer.apple.com/documentation/foundation/archives_and_serialization/encoding_and_decoding_custom_types)，通过一个名为 `Content` 的包装协议来添加一些额外功能，使发送和接收 JSON 变得容易。接下来，你将在 Hello! 路由中返回带有消息的 JSON 主体。首先，在 **routes.swift** 底部创建一个新类型：

```swift
struct UserResponse: Content {
    let message: String
}
```

这定义了一个新的符合 `Content` 的类型，匹配你想要返回的 JSON。

在 `app.get("hello", ":name") { ... }` 下面创建一个新路由来返回这个 JSON：

```swift
// 1
app.get("json", ":name") { req async throws -> UserResponse in
    // 2
    let name = try req.parameters.require("name")
    let message = "Hello, \(name.capitalized)!"
    // 3
    return UserResponse(message: message)
}
```

代码说明：

1. 定义一个新的路由处理程序，处理对 `/json` 的 **GET** 请求。重要的是，闭包的返回类型是 `UserResponse`。
2. 像之前一样获取名字并构造消息。
3. 返回 `UserResponse`。

再次保存并构建运行应用，向 `http://localhost:8080/json/tim` 发送 GET 请求：

```bash
$ curl http://localhost:8080/json/tim
{"message":"Hello, Tim!"}
```

这次，你得到了 JSON 响应！

## 处理 JSON

最后，我们将介绍如何接收 JSON。在 **routes.swift** 底部，创建一个新类型来模型化你将发送到服务器应用的 JSON：

```swift
struct UserInfo: Content {
    let name: String
    let age: Int
}
```

这包含两个属性：名字和年龄。然后，在 JSON 路由下面，创建一个新路由来处理带有此主体的 POST 请求：

```swift
// 1
app.post("user-info") { req async throws -> UserResponse in
    // 2
    let userInfo = try req.content.decode(UserInfo.self)
    // 3
    let message = "Hello, \(userInfo.name.capitalized)! You are \(userInfo.age) years old."
    return UserResponse(message: message)
}
```

这个新路由处理程序的重要区别是：

1. 使用 `app.post(...)` 而不是 `app.get(...)`，因为这个路由处理程序是一个 **POST** 请求。
2. 从请求主体解码 JSON。
3. 使用 JSON 主体中的数据创建新消息。

发送带有有效 JSON 主体的 POST 请求，看看你的响应：

```bash
$ curl http://localhost:8080/user-info -X POST -d '{"name": "Tim", "age": 99}' -H "Content-Type: application/json"
{"message":"Hello, Tim! You are 99 years old."}
```

恭喜！你已经用 Swift 构建了你的第一个 Web 服务器！

> 本指南的源代码可以在 [GitHub](https://github.com/vapor/swift-getting-started-web-server) 上找到
