## Installation via Windows Package Manager

[Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) (aka WinGet) comes pre-installed with Windows 11 (21H2 and later). It can also be found in the [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

0. Install required dependencies:

   ~~~ batch
   winget install Git.Git
   winget install Python.Python.3.10
   winget install Microsoft.VisualStudio.2019.Community —force —custom "—add Microsoft.VisualStudio.Component.Windows10SDK.19041 —add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
   ~~~

   Start up a new command-line shell (eg. Command Prompt, Windows PowerShell) and install the Python library `six`.

   ~~~ batch
   pip install six
   ~~~

0. Install Swift:

   ~~~ batch
   winget install Swift.Toolchain
   ~~~
