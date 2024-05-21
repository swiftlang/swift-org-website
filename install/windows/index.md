---
layout: page
title: Windows Installation Options
---

Although Swift is primarily designed and supported for development on macOS and Linux, running Swift on Windows can be useful in specific scenarios such as learning, experimentation, and contributing to the development of Swift on non-native platforms. 

To avoid potential limitations and challenges when using Swift on Windows, we recommend installing Swift using the Windows Package Manager or through the traditional installation method for Swift versions older than 5.4.2.

{% include_relative _winget.md %}

### Dependencies

Swift contains the following general dependencies:

- Git (used by Swift Package Manager)
- Python[^1] (used by the debugger - LLDB)

[^1]: The Windows binaries are built against Python 3.9

Swift on Windows contains the following additional platform specific dependencies:

- Windows SDK (provides the Windows headers and import libraries)
- Visual Studio (provides the Visual C++ SDK/Build Tools for additional headers)

{% include_relative _traditional.md %}
