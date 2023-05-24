---
layout: page
title: Status of C++ Interoperability Support
official_url: https://swift.org/documentation/cxx-interop/status/
redirect_from: 
- /documentation/cxx-interop/status.html
---

<div class="info" markdown="1">
C++ interoperability is a new feature in the upcoming Swift 5.9 release.
The C++ interoperability support status page is going to be continously
updated until Swift 5.9 is released.
</div>

Swift supports bidirectional interoperability with C++.

C++ interoperability is an actively evolving feature of Swift.
This page is going to be updated
whenever a new release of Swift changes the supported set of C++
interoperability features.

## Platform Support

C++ interoperability is supported for development and deployment
on [all platforms that Swift supports](https://www.swift.org/platform-support/).

### C++ Standard Library Support

Swift compiler uses the platform's default C++ standard library when
interoperating with C++.
This table shows which C++ standard library is used when building Swift
code for a specific deployment platform:

| Platform running Swift application  | Default C++ Standard Library |
| ------------------------- | ------------- |
| **macOS, iOS, watchOS, tvOS**     | libc++  |
| **Ubuntu, CentOS, Amazon Linux**  | libstdc++ |
| **Windows**   | Microsoft C++ Standard Library (msvcprt)  |

Swift does not currently support selecting an alternative standard library for
platforms that support alternative standard libraries. For example, you can't use
libc++ when building Swift code for Ubuntu, even though libc++ can be used when
building C++ code for Ubuntu.

Mixed Swift and C++ code must use
the same C++ standard library.

## Supported C++ API and API patterns in Swift

Swift supports several APIs and API patterns.

## Supported Swift APIs in C++

C++ supports several Swift APIs and API patterns.
