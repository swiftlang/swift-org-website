## Installation via Windows Package Manager

[Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) (aka WinGet) comes pre-installed with Windows 11 (21H2 and later). It can also be found in the [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

0. Install required dependencies:

   ~~~ batch
   winget install --id Git.Git -e
   winget install --id Python.Python.3.9 -e
   winget install --id Microsoft.VisualStudio.2022.Community --exact --force --custom "--add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
   ~~~

   Start up a new command-line shell (eg. Command Prompt, Windows PowerShell) and install the Python library `six`.

   ~~~ batch
   pip install six
   ~~~

0. Install Swift:

   ~~~ batch
   winget install --id Swift.Toolchain -e
   ~~~
