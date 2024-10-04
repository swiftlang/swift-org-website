---
layout: new-layouts/base
title: Installation of Old Swift Releases
---

<div class="warning" markdown="1">
This page documents the manual installation process for versions of Swift 5.9 or older. Subsequent releases have updated dependencies and a [streamlined installation process](/install/windows/manual).
</div>

Older versions of Swift have been tested with [Visual Studio](https://visualstudio.microsoft.com) 2019. You will need to install Visual Studio with the following components. Older installers for Swift are available in the [Download](/download/#:~:text=Older%20Releases) section. The toolchain on Windows is typically installed to `%SystemDrive%\Library\Developer\Toolchains`.

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

After Visual Studio and the required components are installed:

0. Download the required [older Swift release installer](/download/#:~:text=Older%20Releases).

0. Run the package installer.

### Support Files

<div class="info" markdown="1">
This is only required for versions older than 5.4.2.
</div>

<div class="warning" markdown="1">
You must run the following commands using `x64 Native Tools for VS2019 Command Prompt` as administrator.
The `x64 Native Tools for VS2019 Command Prompt` sets up the necessary environment variables to find the system headers.
Administrator permission is required to modify the Visual Studio installation.
</div>

In order to make the Windows SDK accessible to Swift, it is necessary to deploy a few files into the Windows SDK.

~~~ batch
copy /Y %SDKROOT%\usr\share\ucrt.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\ucrt\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.modulemap "%VCToolsInstallDir%\include\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.apinotes "%VCToolsInstallDir%\include\visualc.apinotes"
copy /Y %SDKROOT%\usr\share\winsdk.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\um\module.modulemap"
~~~

Because the Windows SDK is typically installed as part of Visual Studio, these files may need to be copied each time Visual Studio is updated.

### Repairing after Visual Studio Updates

<div class="info" markdown="1">
This is only required for versions older than 5.9.0.
</div>

If Visual Studio is updated, you may have to repair the installation. For versions older than 5.4.2, reinstall support files [as mentioned above](#support-files). For newer versions, see Microsoft’s [instructions](https://support.microsoft.com/windows/repair-apps-and-programs-in-windows-10-e90eefe4-d0a2-7c1b-dd59-949a9030f317) for repairing installed programs.

### Code Signing on Windows

<div class="warning" markdown="1">
The following commands must be run in PowerShell.
</div>

0. Install GPG from [GnuPG.org](https://gnupg.org/download/index.html)

0. If you are downloading Swift packages **for the first time**, import the PGP keys into your keyring:

{% assign all_keys_file = 'all-keys.asc' %}

   ~~~ powershell
   $ gpg.exe —keyserver hkp://keyserver.ubuntu.com `
             —receive-keys `
             'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561' `
             '8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA'
   ~~~

   or:

   ~~~ powershell
   $ wget https://swift.org/keys/{{ all_keys_file }} -UseBasicParsing | Select-Object -Expand Content | gpg.exe —import -
   ~~~

   Skip this step if you have imported the keys in the past.

0. Verify the PGP signature.

   The `.exe` installer for Windows are signed using GnuPG with one of the keys of the Swift open source project. Everyone is strongly encouraged to verify the signatures before using the software.

   First, refresh the keys to download new key revocation certificates, if any are available:

   ~~~ powershell
   $ gpg.exe —keyserver hkp://keyserver.ubuntu.com —refresh-keys Swift
   ~~~

   Then, use the signature file to verify that the archive is intact:

   ~~~ powershell
   $ gpg.exe —verify swift-<VERSION>-<PLATFORM>.exe.sig
   ...
   gpg: Good signature from "Swift Automatic Signing Key #3 <swift-infrastructure@swift.org>"
   ~~~

   If `gpg` fails to verify because you don’t have the public key (`gpg: Can’t check signature: No public key`), please follow the instructions in [Active Signing Keys](#active-signing-keys) below to import the keys into your keyring.

   You might see a warning:

   ~~~ powershell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ~~~

   This warning means that there is no path in the Web of Trust between this key and you. The warning is harmless as long as you have followed the steps above to retrieve the key from a trusted source.

<div class="warning" markdown="1">
  If `gpg` fails to verify and reports "BAD signature", do not run the downloaded installer. Instead, please email <swift-infrastructure@forums.swift.org> with as much detail as possible, so that we can investigate the problem.
</div>

<hr>
