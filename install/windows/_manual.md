## 安装 Windows 平台依赖

Swift 在 Windows 上运行时依赖多个开发工具，包括 C++ 工具链和 Windows SDK。在 Windows 上，这些组件通常通过 [Visual Studio](https://visualstudio.microsoft.com) 安装。

需要安装以下 Visual Studio 组件：

| 名称 | 组件 ID |
|-----------|------------------|
| MSVC v143 - VS 2022 C++ x64/x86 构建工具（最新版）[^1] | Microsoft.VisualStudio.Component.VC.Tools.x86.x64 |
| MSVC v143 - VS 2022 C++ ARM64/ARM64EC 构建工具（最新版）[^1] | Microsoft.VisualStudio.Component.VC.Tools.ARM64 |
| Windows 11 SDK (10.0.22000.0)[^2] | Microsoft.VisualStudio.Component.Windows11SDK.22000 |

[^1]: Swift 至少需要与您的机器架构匹配的构建工具。建议安装其他架构的工具以便能够交叉编译 Swift 二进制文件以在不同机器架构上运行。

[^2]: 您可以安装更新版本的 SDK。

您还需要安装以下依赖：

- [Python 3.9._x_](https://www.python.org/downloads/windows/) [^3]
- [Git for Windows](https://git-scm.com/downloads/win)

[^3]: 您可以安装最新的 `.x` 补丁版本，但请确保使用指定的 Python `major.minor` 版本以获得最佳兼容性。

## 启用开发者模式

开发者模式启用了 Swift 开发所需的调试和其他设置。请参阅 Microsoft 的[文档](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development)了解如何启用开发者模式。

## 安装 Swift

安装完上述依赖后，[下载并运行最新的 Swift 稳定版安装程序 ({{ site.data.builds.swift_releases.last.name }}](/install/windows))。

或者，您也可以选择安装[开发快照版本](/install/windows/#development-snapshots)以使用正在积极开发中的功能。

默认情况下，Swift 二进制文件会安装到 `%LocalAppData%\Programs\Swift`。

<hr>