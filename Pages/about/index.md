---
template: page
title: About Swift
---

Swift is a general-purpose programming language that's approachable for newcomers and powerful for experts. It is fast, modern, safe, and a joy to write.

* Swift is general-purpose and modern. Suitable for everything from systems programming, through mobile and desktop apps, to cloud services.
* Swift is safe. Undefined behavior is the enemy of safety, and it’s best to catch mistakes before software goes into production. Swift makes the obvious path the safest.
* Swift is fast to run and quick to write. It comes with predictable and consistent performance that is on-par with C-based languages without sacrificing developer friendliness.
* Swift is approachable and powerful. From a single-line “Hello, World!” to large-scale apps with hundreds of thousands of lines. Swift scales with your needs.

## Tools

Tools are a critical part of the Swift ecosystem. We strive to integrate well within a developer's toolset, to build quickly, to present excellent diagnostics, and to enable interactive development experiences. Tools can make programming so much more powerful, like Swift-based playgrounds do in Xcode, or a web-based REPL can when working with Linux server-side code.

## Features

Swift includes features that make code easier to read and write, while giving the developer the control needed in a true systems programming language.  Swift supports inferred types to make code cleaner and less prone to mistakes, and modules eliminate headers and provide namespaces. Memory is managed automatically, and you don’t even need to type semi-colons. Swift also borrows from other languages, for instance named parameters brought forward from Objective-C are expressed in a clean syntax that makes APIs in Swift easy to read and maintain.

The features of Swift are designed to work together to create a language that is powerful, yet fun to use. Some additional features of Swift include:

* Closures unified with function pointers
* Tuples and multiple return values
* Generics
* Fast and concise iteration over a range or collection
* Structs that support methods, extensions, and protocols
* Functional programming patterns, e.g., map and filter
* Powerful error handling built-in
* Advanced control flow with `do`, `guard`, `defer`, and `repeat` keywords

### Safety

Swift was designed from the outset to be safer than C-based languages, and eliminates entire classes of unsafe code. Variables are always initialized before use, arrays and integers are checked for overflow, and memory is managed automatically. Syntax is tuned to make it easy to define your intent — for example, simple three-character keywords define a variable (`var`) or constant (`let`).

Another safety feature is that by default Swift objects can never be `nil`, and trying to make or use a `nil` object results in a compile-time error. This makes writing code much cleaner and safer, and prevents a common cause of runtime crashes. However, there are cases where `nil` is appropriate, and for these situations Swift has an innovative feature known as **optionals**. An optional may contain `nil`, but Swift syntax forces you to safely deal with it using ``?`` to indicate to the compiler you understand the behavior and will handle it safely.

## Platform Support

One of the most exciting aspects of developing Swift in the open is knowing that it is now free to be ported across a wide range of platforms, devices, and use cases.

Our goal is to provide source compatibility for Swift across all platforms, even though the actual implementation mechanisms may differ from one platform to the next. The primary example is that the Apple platforms include the Objective-C runtime, which is required to access Apple platform frameworks such as UIKit and AppKit. On other platforms, such as Linux, no Objective-C runtime is present, because it isn't necessary.

The [Swift core libraries project](/documentation/core-libraries/) aims to
extend the cross-platform capabilities of Swift by providing portable
implementations of fundamental Apple frameworks (such as Foundation)
without dependencies on the Objective-C runtime. Although the core
libraries are in an early stage of development, they will eventually
provide improved source compatibility for Swift code across all
platforms.

### Apple Platforms

Open-source Swift can be used on the Mac to target all of the Apple
platforms: iOS, macOS, watchOS, and tvOS. Moreover, binary builds of
open-source Swift integrate with the Xcode developer tools, including
complete support for the Xcode build system, code completion in the
editor, and integrated debugging, allowing anyone to experiment with
the latest Swift developments in a familiar Cocoa and Cocoa Touch
development environment.


### Linux

Open-source Swift can be used on Linux to build Swift libraries and
applications. The open-source binary builds provide the Swift compiler and standard library, Swift REPL and debugger (LLDB), and the [core libraries](/documentation/core-libraries/), so one can jump right in to Swift development.


### Windows

Open source Swift can be used on Windows to build Swift libraries and applications. The open source binary builds provide C/C++/Swift toolchains, the standard library, and debugger (LLDB), as well as the [core libraries](/documentation/core-libraries/), so one can jump right in to Swift development. SourceKit-LSP is bundled into the releases to enable developers to be quickly productive with the IDE of their choice.

### New Platforms

We can't wait to see the new places we can bring Swift---together.  We truly believe that this language that we love can make software safer, faster, and easier to maintain.  We'd love your help to bring Swift to even more computing platforms.

## Swift.org and Open Source

On December 3, 2015, the Swift language, supporting libraries, debugger, and package manager were published under the [Apache 2.0 license with a Runtime Library Exception](/LICENSE.txt), and Swift.org was created to host the project. The source code is [hosted on GitHub](http://github.com/apple) where it is easy for anyone to get the code, build it themselves, and even create pull requests to contribute code back to the project. Everyone is welcome, even just to [file a bug report](/contributing/#reporting-bugs). There are excellent [Getting Started](/getting-started/) guides available here on the site as well.

The project is governed by a core team of engineers that drive the strategic direction by working with the community, and a collection of code owners responsible for the day-to-day project management. Technical leaders come from the community of contributors and anyone can earn the right to lead an area of Swift.  The [Community Overview](/community/) includes detailed information on how the Swift community is managed.


### Projects

The Swift language is managed as a collection of projects, each with its own repositories.  The current list of projects includes:

* The [Swift compiler](/documentation/swift-compiler/) command line tool
* The [standard library](/documentation/standard-library/) bundled as part of the language
* [Core libraries](/documentation/core-libraries/) that provide higher-level functionality
* The [LLDB debugger](/documentation/lldb/) which includes the Swift REPL
* The [Swift package manager](/documentation/package-manager/) for distributing and building Swift source code
* [Xcode playground support](/documentation/lldb/#xcode-playground-support) to enable playgrounds in Xcode.

