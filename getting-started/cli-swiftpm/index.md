---
layout: page
title: 构建命令行工具
---

> 本指南的源代码可以在 [GitHub](https://github.com/apple/swift-getting-started-cli) 上找到

{% include getting-started/_installing.md %}

## 初始化项目

让我们用我们的新 Swift 开发环境写一个小应用程序。
首先，我们将使用 SwiftPM 为我们创建一个新项目。在你选择的终端中运行:

~~~bash
$ mkdir MyCLI
$ cd MyCLI
$ swift package init --name MyCLI --type executable
~~~

这将生成一个名为 MyCLI 的新目录，包含以下文件:

~~~no-highlight
.
├── Package.swift
└── Sources
    └── main.swift
~~~

`Package.swift` 是 Swift 的配置清单文件。它用于保存项目的元数据和依赖项。

`Sources/main.swift` 是应用程序的入口点，也是我们将要编写应用程序代码的地方。

实际上，SwiftPM 已经为我们生成了一个 "Hello, world!" 项目！

我们可以在终端中运行 `swift run` 来运行程序。

~~~bash
$ swift run MyCLI
Building for debugging...
[3/3] Linking MyCLI
Build complete! (0.68s)
Hello, world!
~~~

## 添加依赖

Swift 应用程序通常由提供有用功能的库组成。

在这个项目中，我们将使用一个名为 [example-package-figlet](https://github.com/apple/example-package-figlet) 的包，它将帮助我们制作 ASCII 艺术字。

你可以在 [Swift Package Index](https://swiftpackageindex.com) - Swift 的非官方包索引 - 上找到更多有趣的库。

为此，我们需要在 `Package.swift` 文件中添加以下信息:

~~~swift
// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "MyCLI",
    dependencies: [
      .package(url: "https://github.com/apple/example-package-figlet", branch: "main"),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .executableTarget(
            name: "MyCLI",
            dependencies: [
                .product(name: "Figlet", package: "example-package-figlet"),
            ],
            path: "Sources"),
    ]
)
~~~

运行 `swift build` 将指示 SwiftPM 下载新的依赖项，然后继续构建代码。

运行此命令还会为我们创建一个新文件 `Package.resolved`。
这个文件是我们本地使用的依赖项的确切版本的快照。

## 一个小应用程序

首先删除 `main.swift`。我们将用一个名为 `MyCLI.swift` 的新文件替换它。在其中添加以下代码:

~~~swift
import Figlet

@main
struct FigletTool {
  static func main() {
    Figlet.say("Hello, Swift!")
  }
}
~~~

这为应用程序提供了一个新的入口点，如果需要的话可以是异步的。你可以使用 `main.swift` 文件或 `@main` 入口点，但不能同时使用两者。

通过 `import Figlet`，我们现在可以使用 `example-package-figlet` 包导出的 `Figlet` 模块。

保存后，我们可以用 `swift run` 运行我们的应用程序。
如果一切顺利，你应该看到你的应用程序在屏幕上打印出这个:

~~~no-highlight
  _   _          _   _                 ____               _    __   _     _ 
 | | | |   ___  | | | |   ___         / ___|  __      __ (_)  / _| | |_  | |
 | |_| |  / _ \ | | | |  / _ \        \___ \  \ \ /\ / / | | | |_  | __| | |
 |  _  | |  __/ | | | | | (_) |  _     ___) |  \ V  V /  | | |  _| | |_  |_|
 |_| |_|  \___| |_| |_|  \___/  ( )   |____/    \_/\_/   |_| |_|    \__| (_)
                                |/                                          
~~~

## 参数解析

大多数命令行工具需要能够解析命令行参数。

要为我们的应用程序添加这个功能，我们添加一个对 [swift-argument-parser](https://github.com/apple/swift-argument-parser) 的依赖。

为此，我们在 `Package.swift` 文件中添加以下信息:

~~~swift
// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "MyCLI",
    dependencies: [
      .package(url: "https://github.com/apple/example-package-figlet", branch: "main"),
      .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .executableTarget(
            name: "MyCLI",
            dependencies: [
                .product(name: "Figlet", package: "example-package-figlet"),
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
            ],
            path: "Sources"),
    ]
)
~~~

现在我们可以导入 `swift-argument-parser` 提供的参数解析模块并在我们的应用程序中使用它:

~~~swift
import Figlet
import ArgumentParser

@main
struct FigletTool: ParsableCommand {
  @Option(help: "指定输入")
  public var input: String

  public func run() throws {
    Figlet.say(self.input)
  }
}
~~~

有关 [swift-argument-parser](https://github.com/apple/swift-argument-parser) 如何解析命令行选项的更多信息，请参阅 [swift-argument-parser 文档](https://github.com/apple/swift-argument-parser)。

保存后，我们可以用 `swift run MyCLI --input 'Hello, world!'` 运行我们的应用程序。

注意在这种情况下我们需要指定可执行文件，这样我们才能将 `input` 参数传递给它。

如果一切顺利，你应该看到你的应用程序在屏幕上打印出这个:

~~~no-highlight
  _   _          _   _                                           _       _   _ 
 | | | |   ___  | | | |   ___         __      __   ___    _ __  | |   __| | | |
 | |_| |  / _ \ | | | |  / _ \        \ \ /\ / /  / _ \  | '__| | |  / _` | | |
 |  _  | |  __/ | | | | | (_) |  _     \ V  V /  | (_) | | |    | | | (_| | |_|
 |_| |_|  \___| |_| |_|  \___/  ( )     \_/\_/    \___/  |_|    |_|  \__,_| (_)
                                |/                                             
~~~

---

> 本指南的源代码可以在 [GitHub](https://github.com/apple/swift-getting-started-cli) 上找到
