---
layout: default
title: Windows Installation Options
---

# Windows Installation Options

## Dependencies

Swift has the following general dependencies:

- Git (used by Swift Package Manager)
- Python[^1] (used by the debugger - LLDB)

[^1]: The Windows binaries are built against Python 3.10

Windows has the following additional platform specific dependencies:

- Windows SDK (provides the Windows headers and import libraries)
- Visual Studio (provides the Visual C++ SDK/Build Tools for additional headers)

{% include_relative _winget.md %}
{% include_relative _scoop.md %}
{% include_relative _traditional.md %}
