## Installation via Windows Package Manager

Here are the general steps for installing Swift using the Windows Package Manager. 

0. **Install Windows Package Manager.** [Windows Package Manager](https://docs.microsoft.com/windows/package-manager/), also known as WinGet, comes pre-installed with Windows 11 (21H2 and later). It can also be found in the [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) or be installed directly.
0. **Turn on developer mode.** Enable developer mode to develop applications, particularly with the Swift Package Manager. 
    See Microsoft’s [instructions](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development) to enable developer mode.
0. **Install required Visual Studio components.** Install the latest Microsoft Visual C++ (MSVC) toolset and Windows 11 SDK (10.0.22000) using the Visual Studio 2022 Community installer command:
   ~~~ batch
   winget install --id Microsoft.VisualStudio.2022.Community --exact --force --custom "--add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
   ~~~

    > Tip: You can change the Visual Studio edition depending on your usage and team size.

0. **Install Swift and other dependencies.** Install the latest Swift developer package using the command below:
   ~~~ batch
   winget install --id Swift.Toolchain -e
   ~~~

    > Important: Be sure to install the compatible Git and Python tools if they don’t exist.
