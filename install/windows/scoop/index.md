---
layout: new-layouts/base
title: Installation via Scoop
---

[Scoop](https://scoop.sh) is a command-line installer for Windows. It can be installed through the following PowerShell commands.

~~~ powershell
# Optional: Needed to run a remote script the first time
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# Command for installing Scoop
Invoke-RestMethod get.scoop.sh | Invoke-Expression
~~~

0. Install general dependencies:

   ~~~ batch
   scoop bucket add versions
   scoop install python39
   ~~~

0. Install Windows platform dependencies:

   The required C++ toolchain and Windows SDK are installed as part of Visual Studio 2022. The instructions below are for the Community edition, but you may want to [use a different Visual Studio edition](https://visualstudio.microsoft.com/vs/compare/) based on your usage and team size.

   <div class="warning" markdown="1">
   This code snippet must be run in a traditional Command Prompt (`cmd.exe`).
   </div>

   ~~~ batch
   curl -sOL https://aka.ms/vs/17/release/vs_community.exe
   start /w vs_community.exe --passive --wait --norestart --nocache --add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.Tools.ARM64
   del /q vs_community.exe
   ~~~

0. Install Swift:

   ~~~ batch
   scoop install swift
   ~~~
