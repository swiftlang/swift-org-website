## Install Windows platform dependencies

Swift depends on a number of developer tools when running on Windows, including the C++ toolchain and the Windows SDK. On Windows, typically these components are installed with [Visual Studio](https://visualstudio.microsoft.com). 

The following Visual Studio components should be installed:

| Name | Component ID |
|-----------|------------------|
| MSVC v143 - VS 2022 C++ x64/x86 build tools (Latest)[^1] | Microsoft.VisualStudio.Component.VC.Tools.x86.x64 |
| MSVC v143 - VS 2022 C++ ARM64/ARM64EC build tools (Latest)[^1] | Microsoft.VisualStudio.Component.VC.Tools.ARM64 |
| Windows 11 SDK (10.0.22000.0)[^2] | Microsoft.VisualStudio.Component.Windows11SDK.22000 |

[^1]: At minimum, Swift requires the build tools that match your machine architecture. Installing other architectures is recommended in order to cross-compile Swift binaries to run on different machine architectures.

[^2]: You may install a newer SDK instead.

You should also install the following dependencies:

- [Python 3.10._x_](https://www.python.org/downloads/windows/) [^3]
- [Git for Windows](https://git-scm.com/downloads/win)

[^3]: You may install the latest `.x` patch release, but ensure you use the specified `major.minor` version of Python for optimal compatibility.

## Enable Developer Mode

Developer Mode enables debugging and other settings that are necessary for Swift development. Please see Microsoft’s [documentation](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development) for instructions about how to enable developer mode.

## Install Swift

After the above dependencies have been installed, [download and run the installer for the latest Swift stable release ({{ site.data.builds.swift_releases.last.name }}](/install/windows)). 

Alternatively, you may prefer to install a [development snapshot](/install/windows/#development-snapshots) for access to features that are actively under development. 

By default, the Swift binaries are installed to `%LocalAppData%\Programs\Swift`.

<hr>