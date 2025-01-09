---
layout: page
title: 通过 Scoop 安装
---

[Scoop](https://scoop.sh) 是一个 Windows 命令行安装工具。可以通过以下 PowerShell 命令进行安装。

~~~ powershell
# 可选：首次运行远程脚本时需要
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# 安装 Scoop 的命令
Invoke-RestMethod get.scoop.sh | Invoke-Expression
~~~

0. 安装基本依赖：

   ~~~ batch
   scoop bucket add versions
   scoop install python39
   ~~~

0. 安装 Windows 平台依赖：

   所需的 C++ 工具链和 Windows SDK 是作为 Visual Studio 2022 的一部分安装的。以下说明适用于社区版，但根据您的使用情况和团队规模，您可能想要[使用不同的 Visual Studio 版本](https://visualstudio.microsoft.com/vs/compare/)。

   <div class="warning" markdown="1">
   此代码片段必须在传统命令提示符 (`cmd.exe`) 中运行。
   </div>

   ~~~ batch
   curl -sOL https://aka.ms/vs/17/release/vs_community.exe
   start /w vs_community.exe --passive --wait --norestart --nocache --add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.Tools.ARM64
   del /q vs_community.exe
   ~~~

0. 安装 Swift：

   ~~~ batch
   scoop install swift
   ~~~
