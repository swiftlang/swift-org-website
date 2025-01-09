---
layout: page
title: Windows 安装选项
---

## 依赖项

Swift 需要以下基本依赖：

- Git (被 Swift Package Manager 使用)
- Python[^1] (被调试器 LLDB 使用)

[^1]: Windows 二进制文件是基于 Python 3.9 构建的

Swift 在 Windows 平台上还需要以下特定依赖：

- Windows SDK (提供 Windows 头文件和导入库)
- Visual Studio (提供用于额外头文件的 Visual C++ SDK/构建工具)

## 开发者模式

为了开发应用程序，特别是使用 Swift Package Manager 时，您需要启用开发者模式。请参阅 Microsoft 的[文档](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development)了解如何启用开发者模式的说明。

{% include_relative _winget.md %}
{% include_relative _scoop.md %}
{% include_relative _traditional.md %}
