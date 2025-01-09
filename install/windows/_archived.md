## 旧版 Swift 发行版的安装说明

<div class="warning" markdown="1">
本页面介绍了 Swift 5.9 或更早版本的手动安装过程。后续版本已更新了依赖项并有[简化的安装流程](/install/windows/manual)。
</div>

旧版 Swift 已在 [Visual Studio](https://visualstudio.microsoft.com) 2019 上测试通过。你需要安装 Visual Studio 并包含以下组件。Swift 的旧版安装程序可在[下载](/download/#:~:text=Older%20Releases)部分找到。Windows 上的工具链通常安装在 `%SystemDrive%\Library\Developer\Toolchains` 目录下。

以下 Visual Studio 组件是**必需的**：

| 组件 | Visual Studio ID |
|-----------|------------------|
| MSVC v142 - VS 2019 C++ x64/x86 构建工具（最新版） | Microsoft.VisualStudio.Component.VC.Tools.x86.x64 |
| Windows 10 SDK (10.0.17763.0)[^2] | Microsoft.VisualStudio.Component.Windows10SDK.17763 |

[^2]: 你也可以安装更新版本的 SDK。

以下额外的 Visual Studio 组件是**推荐的**：

| 组件 | Visual Studio ID |
|-----------|------------------|
| Git for Windows | Microsoft.VisualStudio.Component.Git |
| Python 3 64位 (3.7.8) | Component.CPython.x64 |

以下额外的 Visual Studio 组件是**建议的**：

| 组件 | Visual Studio ID |
|-----------|------------------|
| C++ CMake tools for Windows | Microsoft.VisualStudio.Component.VC.CMake.Project |

安装 Visual Studio 和所需组件后：

0. 下载所需的[旧版 Swift 安装程序](/download/#:~:text=Older%20Releases)。

0. 运行安装包安装程序。

### 支持文件

<div class="info" markdown="1">
这仅适用于 5.4.2 之前的版本。
</div>

<div class="warning" markdown="1">
你必须以管理员身份使用 `x64 Native Tools for VS2019 Command Prompt` 运行以下命令。
`x64 Native Tools for VS2019 Command Prompt` 设置了查找系统头文件所需的环境变量。
修改 Visual Studio 安装需要管理员权限。
</div>

为了使 Windows SDK 能被 Swift 访问，需要将一些文件部署到 Windows SDK 中。

~~~ batch
copy /Y %SDKROOT%\usr\share\ucrt.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\ucrt\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.modulemap "%VCToolsInstallDir%\include\module.modulemap"
copy /Y %SDKROOT%\usr\share\visualc.apinotes "%VCToolsInstallDir%\include\visualc.apinotes"
copy /Y %SDKROOT%\usr\share\winsdk.modulemap "%UniversalCRTSdkDir%\Include\%UCRTVersion%\um\module.modulemap"
~~~

由于 Windows SDK 通常作为 Visual Studio 的一部分安装，每次更新 Visual Studio 时可能都需要重新复制这些文件。

### Visual Studio 更新后的修复

<div class="info" markdown="1">
这仅适用于 5.9.0 之前的版本。
</div>

如果更新了 Visual Studio，你可能需要修复安装。对于 5.4.2 之前的版本，需要[按上述说明](#support-files)重新安装支持文件。对于较新版本，请参阅 Microsoft 的[说明](https://support.microsoft.com/windows/repair-apps-and-programs-in-windows-10-e90eefe4-d0a2-7c1b-dd59-949a9030f317)来修复已安装的程序。

### Windows 上的代码签名

<div class="warning" markdown="1">
以下命令必须在 PowerShell 中运行。
</div>

0. 从 [GnuPG.org](https://gnupg.org/download/index.html) 安装 GPG

0. 如果你是**第一次**下载 Swift 包，请将 PGP 密钥导入你的密钥环：

{% assign all_keys_file = 'all-keys.asc' %}

   ~~~ powershell
   $ gpg.exe —keyserver hkp://keyserver.ubuntu.com `
             —receive-keys `
             'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561' `
             '8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA'
   ~~~

   或者：

   ~~~ powershell
   $ wget https://swift.org/keys/{{ all_keys_file }} -UseBasicParsing | Select-Object -Expand Content | gpg.exe —import -
   ~~~

   如果你之前已导入密钥，请跳过此步骤。

0. 验证 PGP 签名。

   Windows 的 `.exe` 安装程序使用 Swift 开源项目的密钥之一通过 GnuPG 进行签名。强烈建议所有人在使用软件之前验证签名。

   首先，刷新密钥以下载新的密钥撤销证书（如果有）：

   ~~~ powershell
   $ gpg.exe —keyserver hkp://keyserver.ubuntu.com —refresh-keys Swift
   ~~~

   然后，使用签名文件验证存档的完整性：

   ~~~ powershell
   $ gpg.exe —verify swift-<VERSION>-<PLATFORM>.exe.sig
   ...
   gpg: Good signature from "Swift Automatic Signing Key #3 <swift-infrastructure@swift.org>"
   ~~~

   如果由于没有公钥而导致 `gpg` 验证失败（`gpg: Can't check signature: No public key`），请按照下面[活动签名密钥](#active-signing-keys)中的说明将密钥导入你的密钥环。

   你可能会看到警告：

   ~~~ powershell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ~~~

   此警告表示在信任网络中，此密钥与你之间没有路径。只要你按照上述步骤从可信来源获取密钥，此警告就是无害的。

<div class="warning" markdown="1">
  如果 `gpg` 验证失败并报告"BAD signature"，请不要运行下载的安装程序。请发送电子邮件至 <swift-infrastructure@forums.swift.org>，并提供尽可能多的详细信息，以便我们调查问题。
</div>

<hr>