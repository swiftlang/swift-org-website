---
redirect_from: "server/guides/testing"
layout: page
title: Testing
---

SwiftPM 集成了 [XCTest, Apple’s unit test framework](https://developer.apple.com/documentation/xctest). 在终端运行 `swift test` 或者在 IDE（如 Xcode 或类似工具）中触发测试操作，会运行所有 XCTest 测试用例。测试结果会显示在 IDE 中，或者打印到终端。

在 Linux 上进行测试的一种便捷方式是使用 Docker。例如：

`$ docker run -v "$PWD:/code" -w /code swift:latest swift test`

上述命令使用最新的 Swift Docker 镜像运行测试，同时利用绑定挂载访问文件系统中的源代码。

Swift 支持特定架构的代码。默认情况下，Foundation 会导入架构相关的库，如 Darwin 或 Glibc。在 macOS 上开发时，可能会使用在 Linux 上不可用的 API。由于云服务通常部署在 Linux 上，因此在 Linux 上进行测试至关重要。

关于 Linux 测试的一个历史细节是 `Tests/LinuxMain.swift` 文件：

- 在 Swift 5.4 及更高版本中，所有平台都能自动发现测试，无需额外的文件或标志。
- 在 Swift 5.1 至 5.4 版本之间，可使用`swift test --enable-test-discovery` 标志在 Linux 上自动发现测试。

- 在 Swift 5.1 之前的版本中，`Tests/LinuxMain.swift` 文件为 SwiftPM 提供了所有需要在 Linux 上运行的测试索引。添加新的单元测试后，务必保持该文件的更新。可以通过运行 `swift test --generate-linuxmain` 重新生成此文件。建议将此命令作为持续集成设置的一部分。


### 生产环境测试

- 对于 Swift 5.1 至 5.4 版本之间，请始终使用 `--enable-test-discovery` 进行测试，以避免在 Linux 上遗漏测试。

- 利用检测工具。在代码部署到生产环境之前（最好作为 CI 过程的常规部分），执行以下操作：
    * 使用 TSan（线程检测器）运行测试套件： `swift test --sanitize=thread`
    *  使用 ASan（地址检测器）运行测试套件： `swift test --sanitize=address` 和 `swift test --sanitize=address -c release -Xswiftc -enable-testing`

- 通常，在测试期间，可以使用 `swift build --sanitize=thread` 构建代码。生成的二进制文件运行速度较慢，不适合生产环境，但可以在早期捕获线程问题——在部署软件之前。线程问题往往难以调试和重现，并可能引发随机问题。TSan 能够帮助尽早发现这些问题。
