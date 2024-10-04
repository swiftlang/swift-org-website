---
layout: new-layouts/base
title: Windows Installation Options
---

## Dependencies

Swift has the following general dependencies:

- Git (used by Swift Package Manager)
- Python[^1] (used by the debugger - LLDB)

[^1]: The Windows binaries are built against Python 3.9

Swift on Windows has the following additional platform specific dependencies:

- Windows SDK (provides the Windows headers and import libraries)
- Visual Studio (provides the Visual C++ SDK/Build Tools for additional headers)

## Developer Mode

In order to develop applications, particularly with the Swift Package Manager, you will need to enable developer mode. Please see Microsoft’s [documentation](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development) for instructions about how to enable developer mode.

{% include_relative _winget.md %}
{% include_relative _scoop.md %}
{% include_relative _traditional.md %}
