---
layout: page
title: Installation via Windows Package Manager
---

[Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) (aka WinGet) comes pre-installed with Windows 11 (21H2 and later). It can also be found in the [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

0. Setup all needed [dependencies](#dependencies).

0. Install required Visual Studio components:

   Install the latest MSVC toolset and Windows 11 SDK (10.0.22000) through Visual Studio 2022 Community installer. You may change the Visual Studio edition depending on your usage and team size.

   ~~~ batch
   winget install --id Microsoft.VisualStudio.2022.Community --exact --force --custom "--add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
   ~~~

0. Install Swift and other dependencies:

   Install the latest Swift developer package, as well as compatible Git and Python tools if they don't exist.

   ~~~ batch
   winget install --id Swift.Toolchain -e
   ~~~

{% include install/_windows_dependencies.md %}