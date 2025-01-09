## 通过Windows包管理器安装

[Windows包管理器](https://docs.microsoft.com/windows/package-manager/)（又称WinGet）在Windows 11（21H2及更新版本）中预装。你也可以从[微软商店](https://www.microsoft.com/p/app-installer/9nblggh4nns1)下载，或者[直接安装](ms-appinstaller:?source=https://aka.ms/getwinget)。

0. 设置所有必需的[依赖项](/install/windows/#dependencies)。

0. 安装Windows平台依赖：

   所需的C++工具链和Windows SDK都包含在Visual Studio 2022中。以下说明是针对社区版的，但根据你的使用情况和团队规模，你可能想要[使用不同的Visual Studio版本](https://visualstudio.microsoft.com/vs/compare/)。

   ~~~ batch
   winget install --id Microsoft.VisualStudio.2022.Community --exact --force --custom "--add Microsoft.VisualStudio.Component.Windows11SDK.22000 --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.Tools.ARM64"
   ~~~

0. 安装Swift和其他依赖：

   安装最新的Swift开发者包，如有必要，还需安装兼容的Git和Python工具。

   ~~~ batch
   winget install --id Swift.Toolchain -e
   ~~~
