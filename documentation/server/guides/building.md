---
redirect_from: "server/guides/building"
layout: page
title: 构建系统
---

推荐使用 [Swift 包管理器](/documentation/package-manager/)来构建服务端应用程序。SwiftPM 提供了一个跨平台的基础架构来构建 Swift 代码，并且非常适合把一个代码库编辑和运行在多个 Swift 平台上。

## 构建
SwiftPM 可以从命令行工作，同时也集成在 Xcode 中。

你可以通过在终端运行 `swift build` 来构建你的代码，或者在 Xcode 中触发构建操作。

### 通过 Docker 使用
Swift 二进制文件是特定于架构的，因此在 macOS 上运行构建命令将创建一个 macOS 二进制文件，类似地，在 Linux 上运行命令将创建一个 Linux 二进制文件。

许多 Swift 开发者使用 macOS 进行开发，这使他们能够利用 Xcode 中提供的出色工具。然而，大多数服务端应用程序被设计为在 Linux 上运行。

如果你在 macOS 上开发，Docker 是一个用于在 Linux 上构建并创建 Linux 二进制文件的有用工具。苹果官方发布了 Swift Docker 镜像到 [Docker Hub](https://hub.docker.com/_/swift)。

例如，使用最新的 Swift Docker 镜像构建你的应用程序：

`$ docker run -v "$PWD:/code" -w /code swift:latest swift build`

注意，如果你想在 Apple Silicon (M1) Mac 上为 Intel CPU 运行 Swift 编译器，请在命令行中添加 `--platform linux/amd64 -e QEMU_CPU=max` 。例如

`$ docker run -v "$PWD:/code" -w /code --platform linux/amd64 -e QEMU_CPU=max swift:latest swift build`

上述命令将使用最新的 Swift Docker 镜像运行构建，并使用绑定安装到 Mac 上的源代码。

### 调试与发布模式
默认情况下，SwiftPM 将构建应用程序的调试版本。请注意，调试版本不适合在生产环境中运行，因为它们的速度要慢得多。要构建应用程序的发布版本，请运行 `swift build -c release`。

### 查找二进制文件
可以部署的二进制文件在 Linux 上位于 `.build/x86_64-unknown-linux`，在 macOS 上位于 `.build/x86_64-apple-macosx`。

SwiftPM 可以使用 `swift build --show-bin-path -c release` 来显示完整的二进制路径。

### 针对生产环境构建

- 通过使用  `swift build -c release` 在发布模式下构建生产环境代码。运行以调试模式编译的代码将严重损害性能。

- 为了在 Swift 5.2 或更高版本中获得最佳性能，请添加参数 `-Xswiftc -cross-module-optimization`（这在 Swift 5.2 之前的版本中不起作用）- 启用这个功能后需要像做了性能优化变动一样进行性能测试，因为它有时可能会导致性能下降。

- 将 [`swift-backtrace`](https://github.com/swift-server/swift-backtrace) 集成到你的应用程序中，以确保在崩溃时打印回溯信息。回溯功能在 Linux 上不是开箱即用的，这个库有助于填补这个空白。最终这将成为一项语言特性，不再需要一个单独的库。