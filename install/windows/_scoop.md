## Install via Scoop

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
   scoop install python310
   ~~~

   Start up a new Command Prompt/Powershell Prompt and install the Python library six.

   ~~~ batch
   pip install six
   ~~~

0. Install platform dependencies:

   The platform dependencies cannot be installed through Scoop as the install rules cannot install all required components. They will be installed through the Visual Studio installer.

   > **NOTE:** This code snippet MUST be run in a traditional Command Prompt (`cmd.exe`)

   ~~~ batch
   curl -sOL https://aka.ms/vs/16/release/vs_community.exe
   start /w vs_community.exe —passive —wait —norestart —nocache —add Microsoft.VisualStudio.Component.Windows10SDK.19041 —add Microsoft.VisualStudio.Component.VC.Tools.x86.x64
   del /q vs_community.exe
   ~~~

0. Install Swift:

   ~~~ batch
   scoop install swift
   ~~~
