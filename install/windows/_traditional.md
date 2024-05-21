## Traditional Installation

<div class="warning" markdown="1">
The traditional installation process is required for Swift older than 5.4.2.
</div>

If you plan to work with Swift on Windows, it's worth noting that the language has been tested with [Visual Studio](https://visualstudio.microsoft.com) 2019. However, to get started using traditional installation, you will need to install Visual Studio with certain components as outlined below.

The installer for Swift is available in the [Download Swift](/download) section. Once you have Swift installed, you will find the toolchain on Windows is typically installed in the `%SystemDrive%\Library\Developer\Toolchains` directory.

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

After Visual Studio and the required components are installed, you can:

0. Download the latest Swift release ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases)) or development [snapshot](/download/#snapshots) installer.

0. Run the package installer.

### Support Files

<div class="info" markdown="1">
This is only required for versions older than 5.4.2.
</div>

It’s important to note that you must run the following commands using the `x64 Native Tools for VS2019 Command Prompt` as **Administrator** for these reasons:

- The `x64 Native Tools for VS2019 Command Prompt` sets the necessary environment variables to find the system headers.
- Administrator permission is required to modify the Visual Studio installation.

To use Swift with Windows SDK, you need to deploy some files into the SDK. These files are installed in the Visual Studio image and need to be copied every time you update it to ensure uninterrupted access.

~~~ batch
copy /Y %SDKROOT%\usr\share\ucrt.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\ucrt\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.modulemap "%VCToolsInstallDir%\include\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.apinotes "%VCToolsInstallDir%\include\visualc.apinotes"
copy /Y %SDKROOT%\usr\share\winsdk.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\um\module.modulemap"
~~~

### Repairing after Visual Studio Updates

<div class="info" markdown="1">
This is only required for versions older than 5.9.0.
</div>

If you update Visual Studio, there is a possibility that you may need to repair the installation. If you are working with versions older than 5.4.2, you will need to reinstall the [Support Files](#support-files) as mentioned above. For more recent versions, see [Microsoft’s instructions](https://support.microsoft.com/windows/repair-apps-and-programs-in-windows-10-e90eefe4-d0a2-7c1b-dd59-949a9030f317) for repairing installed programs.

### Code Signing on Windows

<div class="warning" markdown="1">
You must run the following commands in PowerShell.
</div>

0. Install the GNU Privacy Guard (GPG) from [GnuPG.org](https://gnupg.org/download/index.html) to protect your data from unauthorized access and tampering.

0. If you are downloading Swift packages **for the first time**, import the Pretty Good Privacy (PGP) keys into your keyring using the following commands. *If you've previously imported the keys, you can skip this step and proceed to the next one.*

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

0. Verify the PGP signature to ensure the authenticity and integrity of the key or keyring.

   The `.exe` installer for Windows is signed using GPG with one of the keys of the Swift open-source project. To ensure the authenticity and integrity of the installation package, **we advise verifying the signatures** before using the software by running the following commands:

   a: Run this command to refresh the keys to download new key revocation certificates (if available):

   ~~~ powershell
   $ gpg.exe —keyserver hkp://keyserver.ubuntu.com —refresh-keys Swift
   ~~~

   b. Use the signature file to verify that the archive is intact by running this command:

   ~~~ powershell
   $ gpg.exe —verify swift-<VERSION>-<PLATFORM>.exe.sig
   ...
   gpg: Good signature from "Swift Automatic Signing Key #3 <swift-infrastructure@swift.org>"
   ~~~

   > Tip: If you get the error `gpg: Can’t check signature: No public key` while using `gpg` to verify a signature, you need to import the required keys into your keyring. Follow the instructions in the [Active Signing Keys](#active-signing-keys) documentation to do this. After importing the keys, you should be able to verify the signature without any issues.

    > Important: If you get the following warning message that states there is no path in the Web of Trust between the key and you, it means there is no established trust between the two. However, this warning can be safely ignored if you followed the necessary steps to retrieve the key from a trusted source. By doing so, you can ensure that the key is authentic and secure for your use.

   ~~~ powershell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ~~~

<div class="warning" markdown="1">
If `gpg` fails to verify and reports a *BAD signature* error, **do not** run the downloaded installer. Instead, send an email to <swift-infrastructure@forums.swift.org> with all the relevant details of the error. Our team will investigate the problem and provide you with a solution as soon as possible.
</div>
