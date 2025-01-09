---
layout: page
title: 通过 Windows 包管理器安装
---

[Windows 包管理器](https://docs.microsoft.com/windows/package-manager/)（又称 WinGet）在 Windows 11（21H2 及更新版本）中预装。您也可以从 [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) 下载，或[直接安装](ms-appinstaller:?source=https://aka.ms/getwinget)。

0. 启用开发者模式：

   为了开发应用程序，特别是使用 Swift 包管理器时，您需要启用开发者模式。请参阅 Microsoft 的[文档](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development)了解如何启用开发者模式。

0. 安装 Windows 平台依赖：

   所需的 C++ 工具链和 Windows SDK 会作为 Visual Studio 2022 的一部分安装。以下说明适用于社区版，但根据您的使用情况和团队规模，您可能想要[使用不同的 Visual Studio 版本](https://visualstudio.microsoft.com/vs/compare/)。

   ~~~ batch
   winget install --id Microsoft.VisualStudio.2022.Community --exact --force --custom "--add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.Tools.ARM64"
   ~~~

0. 安装 Swift 和其他依赖：

   安装最新的 Swift 开发者包，如果尚未安装，还需要安装兼容的 Git 和 Python 工具。

   ~~~ batch
   winget install --id Swift.Toolchain -e
   ~~~
