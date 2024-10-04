---
layout: new-layouts/base
title: Installation via Windows Package Manager
---

[Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) (aka WinGet) comes pre-installed with Windows 11 (21H2 and later). It can also be found in the [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

0. Enable Developer Mode:

   In order to develop applications, particularly with the Swift Package Manager, you will need to enable developer mode. Please see Microsoft’s [documentation](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development) for instructions about how to enable developer mode.

0. Install Windows platform dependencies:

   The required C++ toolchain and Windows SDK are installed as part of Visual Studio 2022. The instructions below are for the Community edition, but you may want to [use a different Visual Studio edition](https://visualstudio.microsoft.com/vs/compare/) based on your usage and team size.

   ~~~ batch
   winget install --id Microsoft.VisualStudio.2022.Community --exact --force --custom "--add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.Tools.ARM64"
   ~~~

0. Install Swift and other dependencies:

   Install the latest Swift developer package, as well as compatible Git and Python tools if they don't exist.

   ~~~ batch
   winget install --id Swift.Toolchain -e
   ~~~
