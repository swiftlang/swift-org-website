## Installing Swift

The first step to using Swift is to download and install
the compiler and other required components.
Go to the [Download](/download) page
and follow the instructions for your target platform.

In order to follow along with the examples below,
make sure to add Swift to your `$PATH`.

### On macOS

The default location for the downloadable toolchain on macOS is
`/Library/Developer/Toolchains`.
You can make the latest installed toolchain available for use from the terminal with the following command:

~~~ shell
$ export TOOLCHAINS=swift
~~~

To select any other installed toolchain, use its identifier in the `TOOLCHAINS`
variable. The identifier can be found in toolchain's `Info.plist` file.

~~~ shell
$ /usr/libexec/PlistBuddy -c "Print CFBundleIdentifier:" /Library/Developer/Toolchains/swift-4.0-RELEASE.xctoolchain/Info.plist
org.swift.4020170919

$ export TOOLCHAINS=org.swift.4020170919
~~~

### On Linux

0. Install required dependencies:

{% include linux/table.html %}

If you installed the Swift toolchain on Linux
to a directory other than the system root,
you will need to run the following command,
using the actual path of your Swift installation:

~~~ shell
$ export PATH=/path/to/Swift/usr/bin:"${PATH}"
~~~

### On Windows

#### Dependencies

Swift has the following general dependencies:

- Git (used by Swift Package Manager)

- Python[^1] (used by the debugger - lldb)

[^1]: The windows binaries are built against Python 3.10.2

Windows has the following additional platform specific dependencies:

- Windows SDK (provides the Windows headers and import libraries)

- Visual Studio (provides the Visual C++ SDK/Build Tools for additional headers)

#### Enabling Developer Mode

In order to develop applications, particularly with the Swift Package Manager, you will need to enable developer mode. Please see Microsoft's [documentation](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) for instructions for enabling developer mode.

#### Installation Instructions

##### Install using the Windows Package Manager

The [Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) can be found in the [Microsoft Store](https://www.microsoft.com/en-us/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

#### Install using Scoop

~~~ pwsh
# Optional: Needed to run a remote script the first time
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# Command for installing scoop
Invoke-RestMethod -Url 'get.scoop.sh' | Invoke-Expression
~~~

0. Install required dependencies:

   The platform dependencies cannot be installed through the currently supported package managers as the install rules do not install the components necessary.  They will be installed through the Visual Studio installer.

   #### With Winget (Windows Package Manager):
   ~~~ cmd
   winget install Git.Git
   winget install Python.Python.3.10

   winget install Microsoft.VisualStudio.2019.Community --force --custom "--add Microsoft.VisualStudio.Component.Windows10SDK.19041 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
   ~~~

   #### With Scoop:
   > **NOTE:** This code snippet MUST be run in a traditional Command Prompt (`cmd.exe`)

   ~~~ cmd
   # Scoop already comes pre-installed with Git, so no need to re-install it.
   scoop bucket add versions
   scoop install python310

   curl -sOL https://aka.ms/vs/16/release/vs_community.exe
   start /w vs_community.exe --passive --wait --norestart --nocache --installPath "%ProgramFiles(x86)%\Microsoft Visual Studio\2019\Community" --add Microsoft.VisualStudio.Component.Windows10SDK.19041 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64
   del /q vs_community.exe
   ~~~

   Start up a new Command Prompt/Powershell Prompt and install the Python library six.

   ~~~ cmd
   pip install six
   ~~~

1. Install Swift:

   Swift can be installed through the official installer directly, or using the Windows Package Manager as well.  Notice that Windows Package Manager release may be behind the official release.

   * Using the official installer:
     1. Download the [latest package release](/download).
     2. Run the package installer.

   * Using the Windows Package Manager:
     ~~~ cmd
     winget install Swift.Toolchain
     ~~~
   * Using Scoop:
     ~~~ cmd
     scoop install swift
     ~~~

A Swift toolchain will be installed at `%SystemDrive%\Library\Developer\Toolchains\unknown-Asserts-development.xctoolchain`.  A compatible Swift SDK will be installed at `%SystemDrive%\Library\Developer\Platforms\Windows.platform\Developer\SDKs\Windows.sdk`.

##### Traditional Installation

> **NOTE:** The traditional installation process is required for Swift older than 5.4.2.

Swift has been tested with [Visual Studio 2019](https://visualstudio.microsoft.com).  You will need to install Visual Studio with the following components.  The installer for Swift is available in the [Download](/download) section.  The toolchain on Windows is installed to `%SystemDrive%\Library\Developer\Toolchains`.

The following Visual Studio components are **required**:

| Component | Visual Studio ID |
|-----------|------------------|
| MSVC v142 - VS 2019 C++ x64/x86 build tools (Latest) | Microsoft.VisualStudio.Component.VC.Tools.x86.x64 |
| Windows 10 SDK (10.0.17763.0)[^2] | Microsoft.VisualStudio.Component.Windows10SDK.17763 |

[^2]: You may install a newer SDK instead.

The following additional Visual Studio components are **recommended**:

| Component | Visual Studio ID |
|-----------|------------------|
| Git for Windows | Microsoft.VisualStudio.Component.Git |
| Python 3 64-bit (3.7.8) | Component.CPython.x64 |

The following additional Visual Studio component is **suggested**:

| Component | Visual Studio ID |
|-----------|------------------|
| C++ CMake tools for Windows | Microsoft.VisualStudio.Component.VC.CMake.Project |

##### Support Files

> **NOTE:** This is only required for versions older than 5.4.2

You must use the `x64 Native Tools for VS2019 Command Prompt` to run the following steps. The `x64 Native Tools for VS2019 Command Prompt` runs the `DevEnv` script from Visual Studio that sets up the necessary environment variables to find the system headers.

In order to make the Windows SDK accessible to Swift, it is necessary to deploy a few files into the Windows SDK. The following will modify your Visual Studio Installation, and as such will require to be run from an (elevated) "Administrator" `x86 Native Tools for VS2019 Command Prompt`.

~~~ cmd
copy /Y %SDKROOT%\usr\share\ucrt.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\ucrt\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.modulemap "%VCToolsInstallDir%\include\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.apinotes "%VCToolsInstallDir%\include\visualc.apinotes"
copy /Y %SDKROOT%\usr\share\winsdk.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\um\module.modulemap"
~~~

Because it is installing the files into the Visual Studio image, the files will need to be copied each time Visual Studio is updated.

##### Repairing after Visual Studio Updates

If Visual Studio is updated, you may have to repair the installation.  See Microsoft's [instructions](https://support.microsoft.com/en-us/windows/repair-apps-and-programs-in-windows-10-e90eefe4-d0a2-7c1b-dd59-949a9030f317) for repairing installed programs.

* * *

### Swift Version

You can verify that you are running the expected version of Swift
by entering the `swift` command and passing the `--version` flag:

~~~ shell
$ swift --version
Apple Swift version 2.2-dev (LLVM ..., Clang ..., Swift ...)
~~~

The `-dev` suffix on the version number
is used to indicate that it's a *development* build,
not a released version.
