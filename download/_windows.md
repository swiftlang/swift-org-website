## Windows

### Dependencies

Swift has the following general dependencies:

- Git (used by Swift Package Manager)

- Python[^1] (used by the debugger - lldb)

[^1]: The windows binaries are built against Python 3.7.8

Windows has the following additional platform specific dependencies:

- Windows SDK (provides the Windows headers and import libraries)

- Visual Studio (provides the Visual C++ SDK/Build Tools for additional headers)

### Installation Instructions

#### Install using the Windows Package Manager

The [Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) can be found in the [App Store](https://www.microsoft.com/en-us/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

The platform dependencies cannot be installed through the Windows Package Manager as the install rules do not install the components necessary.

~~~ cmd
winget install Git.Git
winget install Python.Python.3 --version 3.7.8150.0

curl -sOL https://aka.ms/vs/16/release/vs_community.exe
start /w vs_community.exe --passive --wait --norestart --nocache ^
  --installPath "%ProgramFiles(x86)%\Microsoft Visual Studio\2019\Community" ^
  --add Microsoft.VisualStudio.Component.Windows10SDK.19041 ^
  --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64
del /q vs_community.exe

winget install Swift.Toolchain
~~~

#### Traditional Installation

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

The following additional Visual Studio components are **suggested** for Swift 5.3:

| Component | Visual Studio ID |
|-----------|------------------|
| C++ CMake tools for Windows | Microsoft.VisualStudio.Component.VC.CMake.Project |

#### Support Files

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

#### Repairing after Visual Studio Updates

If Visual Studio is updated, you may have to repair the installation.  See Microsoft's [instructions](https://support.microsoft.com/en-us/windows/repair-apps-and-programs-in-windows-10-e90eefe4-d0a2-7c1b-dd59-949a9030f317) for repairing installed programs.

### Code Signing on Windows

1. Install GPG from [GnuPG.org](https://gnupg.org/download/index.html)

1. If you are downloading Swift packages **for the first time**, import the PGP keys into your keyring:

   ~~~ cmd
   $ gpg.exe --keyserver hkp://keyserver.ubuntu.com `
         --receive-keys `
         'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561' `
         '8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA'
   ~~~

   or:

   ~~~ cmd
   $ wget https://swift.org/keys/{{ all_keys_file }} -UseBasicParsing | `
   Select-Object -Expand Content | gpg.exe --import -
   ~~~

   Skip this step if you have imported the keys in the past.

2. Verify the PGP signature.

   The `.exe` installer for Windows are signed using GnuPG with one of the keys of the Swift open source project.  Everyone is strongly encouraged to verify the signatures before using the software.

   First, refresh the keys to download new key revocation certificates, if any are available:

   ~~~ shell
   $ gpg.exe --keyserver hkp://keyserver.ubuntu.com --refresh-keys Swift
   ~~~

   Then, use the signature file to verify that the archive is intact:

   ~~~ shell
   $ gpg.exe --verify swift-<VERSION>-<PLATFORM>.exe.sig
   ...
   gpg: Good signature from "Swift Automatic Signing Key #3 <swift-infrastructure@swift.org>"
   ~~~

   If `gpg` fails to verify because you don't have the public key (`gpg: Can't check signature: No public key`), please follow the instructions in [Active Signing Keys](#active-signing-keys) below to import the keys into your keyring.

   You might see a warning:

   ~~~ shell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ~~~

   This warning means that there is no path in the Web of Trust between this key and you.  The warning is harmless as long as you have followed the steps above to retrieve the key from a trusted source.

   <div class="warning" markdown="1">
   If `gpg` fails to verify and reports "BAD signature", do not use the downloaded toolchain.  Instead, please email <swift-infrastructure@forums.swift.org> with as much detail as possible, so that we can investigate the problem.
   </div>

### Active Signing Keys

The Swift project uses one set of keys for snapshot builds, and separate keys for every official release.  We are using 4096-bit RSA keys.

The following keys are being used to sign toolchain packages:

* `Swift Automatic Signing Key #3 <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/{{ automatic_signing_key_file }}>

  Fingerprint
  : `8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA`

  Long ID
  : `FAF6989E1BC16FEA`

  To import the key, run:

  ~~~ shell
  $ gpg.exe --keyserver hkp://keyserver.ubuntu.com `
        --receive-keys `
        '8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA'
  ~~~

  Or:

  ~~~ shell
  $ wget https://swift.org/keys/{{ automatic_signing_key_file }} -UseBasicParsing | `
   Select-Object -Expand Content | gpg.exe --import -
  ~~~

* `Swift 5.x Release Signing Key <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/release-key-swift-5.x.asc>

  Fingerprint
  : `A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561`

  Long ID
  : `925CC1CCED3D1561`

  To import the key, run:

  ~~~ shell
  $ gpg.exe --keyserver hkp://keyserver.ubuntu.com `
        --receive-keys `
        'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561'
  ~~~

  Or:

  ~~~ shell
  $ wget https://swift.org/keys/release-key-swift-5.x.asc -UseBasicParsing | `
   Select-Object -Expand Content | gpg.exe --import -
  ~~~
