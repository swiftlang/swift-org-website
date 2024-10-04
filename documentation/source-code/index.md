---
redirect_from: "/source-code/"
layout: new-layouts/base
title: Source Code
---

The code for the Swift project is divided into several open-source repositories, all hosted on [GitHub](https://github.com/apple/).

## Compiler and Standard Library

[swift](https://github.com/swiftlang/swift)
: The main Swift repository, which contains the source code for the Swift compiler, standard library, and SourceKit.

[swift-evolution](https://github.com/swiftlang/swift-evolution)
: Documents related to the continued evolution of Swift, including goals for upcoming releases proposals for changes to and extensions of Swift.

Directions for building the Swift compiler and standard library, along
with its prerequisites, are provided by the [main Swift repository's
README
file](https://github.com/swiftlang/swift/blob/main/README.md).

## Core Libraries

[swift-corelibs-foundation](https://github.com/swiftlang/swift-corelibs-foundation)
: The source code for Foundation, which provides common functionality for all applications.

[swift-corelibs-libdispatch](https://github.com/apple/swift-corelibs-libdispatch)
: The source code for libdispatch, which provides concurrency primitives for working on multicore hardware.

[swift-corelibs-xctest](https://github.com/swiftlang/swift-corelibs-xctest)
: The source code for XCTest, which provides fundamental testing infrastructure for Swift apps and libraries.

## Package Manager

[swift-package-manager](https://github.com/swiftlang/swift-package-manager)
: The source code for the Swift package manager.

[swift-llbuild](https://github.com/swiftlang/swift-llbuild)
: The source code for llbuild, a low-level build system used by the Swift package manager.

[swift-tools-support-core](https://github.com/swiftlang/swift-tools-support-core)
: Contains common infrastructural code for both SwiftPM and llbuild.

## Xcode Playground Support

[swift-xcode-playground-support](https://github.com/apple/swift-xcode-playground-support)
: The source code to enable playground integration with Xcode.

## Source Tooling

[swift-syntax](https://github.com/swiftlang/swift-syntax)
: The source code for SwiftSyntax, which enables Swift tools to parse, inspect, generate, and transform Swift source code.

[swift-format](https://github.com/swiftlang/swift-format)
: The source code for the formatting technology for Swift source code.

## SourceKit-LSP Service

[sourcekit-lsp](https://github.com/swiftlang/sourcekit-lsp)
: The source code for the SourceKit-LSP language service.

[indexstore-db](https://github.com/swiftlang/indexstore-db)
: The source code for the index database library.


## Swift.org Website

[swift-org-website](https://github.com/swiftlang/swift-org-website)
: The source code for the Swift.org website.

## Cloned Repositories

Swift builds upon several other open-source projects, most notably
[the LLVM Compiler Infrastructure](http://llvm.org). Swift's clones of
the repositories of those open-source projects contain Swift-specific
changes and are merged regularly from their upstream sources. For more information about the clone of LLVM repository, see the section on [LLVM and Swift](/contributing/#llvm-and-swift).

[llvm-project](https://github.com/swiftlang/llvm-project)
: The source code for [LLVM](http://llvm.org), with a handful of Swift-specific additions. Merged regularly from the [LLVM sources at llvm.org](https://github.com/llvm/llvm-project).

[swift-cmark](https://github.com/swiftlang/swift-cmark)
: The source code for [CommonMark](https://github.com/jgm/cmark), which is used in the Swift compiler.

Directions
for building LLDB for Swift are present in the [llvm-project/lldb repository's
README file][lldb-readme].

* * *

[lldb-readme]: https://github.com/swiftlang/llvm-project/blob/next/lldb/README.md "LLDB README"
