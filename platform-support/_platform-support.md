Swift 可以在不同的平台上使用。以下信息记录了每个平台当前的支持级别。

每个 Swift 平台根据以下两个类别进行分类：

* **[部署和开发](#部署和开发)**：Swift 程序可以构建并在此平台上运行，同时 Swift 的开发工具（如 Swift 编译器）也可以在此平台上运行。

* **[仅部署](#仅部署)**：Swift 程序可以构建并在此平台上运行，但用于构建这些程序的开发工具本身可能无法在此平台上运行。

以下描述了当前支持的开发和部署平台。

### 部署和开发

这些是可用于 Swift 开发工具的平台。下表显示了在给定平台上使用工具时可以针对哪些平台进行开发。例如，macOS 上的工具可以构建在 iOS 上运行的 Swift 应用程序。

| 运行开发工具的平台                        | 可部署的目标平台                 |
|:--------------------------------------:|:-----------------------------:|
| **macOS**                              |  Apple 平台                    |
| **Ubuntu**                             |  Ubuntu                       |
| **Debian**                             |  Debian                       |
| **Fedora**                             |  Fedora                       |
| **Amazon Linux**                       |  Amazon Linux                 |
| **Red Hat Universal Base Image**       |  Red Hat Universal Base Image |
| **Windows**                            |  Windows                      |

#### 最低部署版本

下表显示了 Swift 应用程序可以部署的最低操作系统版本。例如，Swift 应用程序可以在 iOS 7.0 或更高版本上运行，但不能在 iOS 6 上运行。

| 运行 Swift 应用程序的平台        | 最低部署版本               |
|:-------------------------------:|:-------------------------:|
| **macOS**                       | 10.13                     |
| **iOS**                         | 11.0                      |
| **watchOS**                     | 4.0                       |
| **tvOS**                        | 11.0                      |
| **Ubuntu**                      |20.04                      |
| **Debian**                      |12                         |
| **Fedora**                      |39                         |
| **Amazon Linux**                | 2                         |
| **Red Hat Universal Base Image**| 9                         |
| **Windows**                     | 10.0                      |

#### 开发工具

Swift 编译器和调试器可在支持开发的平台上运行。Swift Package Manager 和 [SourceKit-LSP] 目前在大多数（但不是全部）支持工具的平台上都可用。下表提供了各个平台上可用工具的当前明细。

| 运行开发工具的平台              | [Swift Package Manager] | [SourceKit-LSP] |
|:------------------------------:|:----------------------:|:---------------:|
| **macOS**                      | ✓                      | ✓               |
| **Ubuntu**                     | ✓                      | ✓               |
| **Debian**                     | ✓                      | ✓               |
| **Fedora**                     | ✓                      | ✓               |
| **Amazon Linux**               | ✓                      | ✓               |
| **Red Hat Universal Base Image**| ✓                     | ✓               |
| **Windows**                    | ✓                      | ✓               |

### 仅部署

每个支持运行 Swift 应用程序的平台都需要提供入门文档。该文档应包含有关安装 Swift、使用 REPL、使用 Swift Package Manager 和使用调试器的信息。除非另有明确说明，否则每个平台都应具有核心运行时、标准库支持和核心库。

下表列出了每个平台上运行 Swift 应用程序的可用功能：

| 运行 Swift 应用程序的平台       | 调试器 | REPL |
|:------------------------------:|:------:|:----:|
| **macOS**                      | ✓      | ✓    |
| **iOS**                        | ✓      |      |
| **watchOS**                    | ✓      |      |
| **tvOS**                       | ✓      |      |
| **Ubuntu**                     | ✓      | ✓    |
| **Debian**                     | ✓      | ✓    |
| **Fedora**                     | ✓      | ✓    |
| **Amazon Linux**               | ✓      | ✓    |
| **Red Hat Universal Base Image**| ✓      | ✓    |
| **Windows**                    | ✓      |      |

## 平台维护者

Swift 开源社区的不同成员支持在各种平台上开发和运行 Swift 应用程序。每个平台都有一个称为"平台维护者"的负责人，作为维护给定平台支持的主要管理者。

平台维护者帮助促进 Swift 项目的贡献者合作，并继续致力于推进特定平台的发展。这些人也能够指导在平台上移植特定的更改。平台维护者在 [forums.swift.org](https://forums.swift.org) 上有专门的版块，并每两周召开会议讨论平台上的活跃开发和未解决的问题。

### 当前平台维护者

|                    | 入门指南                          | 工具链提供者                                    | 需要拉取请求测试 |
|:-----------------:|:--------------------------------:|:---------------------------------------------:|:-------------:|
| **Apple 平台**     | [文档](/getting-started/#on-macos) | [Apple Inc.](https://www.apple.com)           | ✓             |
| **Linux**         | [文档](/getting-started/#on-linux) | [Apple Inc.](https://www.apple.com)           | ✓             |
| **Windows**       | [文档](/getting-started/#on-windows)| [Apple Inc.](https://www.apple.com)           | ✓             |

* Apple 平台包括 macOS、iOS、tvOS 和 watchOS。
* Linux 包括 Ubuntu、Debian、Fedora、Amazon Linux 和 Red Hat Universal Base Image 平台。

### 平台的持续集成

持续集成是维护 Swift 项目健康的关键方面。拉取请求支持（对于官方支持的平台）要求在合并拉取请求之前通过构建和测试。

各个平台的拉取请求测试硬件由社区的各个成员提供。平台维护者负责监控 Swift 社区托管的 CI 或单独的持续集成系统上的主分支和发布分支的持续测试。平台维护者负责提供或确保硬件以支持 Swift 社区托管的 CI 上的持续测试。

### 可下载构建的代码签名

平台维护者将在提供给 Apple 之前构建和签名工具链。然后，Apple 将使用 [swift.org](/) 证书重新签名工具链并在网站上分发。只有在不是由 Apple 构建的情况下，才会重新签名构建。将进行随机审核以验证平台维护者和 Apple 之间的签名。

### 平台审查

Swift 社区成员可以通过在 forums.swift.org 上请求审查来提议将新平台添加到表格中。Swift 核心团队将审查此类提案。

[Swift Package Manager]: https://github.com/swiftlang/swift-package-manager
[IndexStoreDB]: https://github.com/swiftlang/indexstore-db
[SourceKit-LSP]: https://github.com/swiftlang/sourcekit-lsp
[LLBuild]: https://github.com/swiftlang/swift-llbuild 