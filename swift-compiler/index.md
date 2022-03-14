---
layout: page
title: Swift Compiler
redirect_from: 
  - /compiler-stdlib/
---

The [main Swift repository][swift-repo] contains the source code for
the Swift compiler and standard library, as well as related components
such as SourceKit (for IDE integration), the Swift regression test
suite, and implementation-level documentation.

The [Swift driver repository][swift-driver-repo] contains a new
implementation of the Swift compiler's "driver", which aims to be a
more extensible, maintainable, and robust drop-in replacement for the
existing compiler driver.

{% include_relative _compiler-architecture.md %}

[bugtracker]:  https://bugs.swift.org
[swift-repo]: https://github.com/apple/swift "Swift repository"
[swift-driver-repo]: https://github.com/apple/swift-driver "Swift driver repository"
