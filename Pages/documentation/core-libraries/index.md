---
template: page
title: Swift Core Libraries
redirect_from: /core-libraries/
---

The Swift Core Libraries project provides higher-level functionality than the
Swift standard library. These libraries provide powerful tools that developers
can depend upon across all the platforms that Swift supports. The Core Libraries
have a goal of providing stable and useful features in the following key areas:

* Commonly needed types, including data, URLs, character sets, and specialized collections
* Unit testing
* Networking primitives
* Scheduling and execution of work, including threads, queues, and notifications
* Persistence, including property lists, archives, JSON parsing, and XML parsing
* Support for dates, times, and calendrical calculations
* Abstraction of OS-specific behavior
* Interaction with the file system
* Internationalization, including date and number formatting and language-specific resources
* User preferences


### Project Status

These libraries are part of our ongoing work to extend the cross-platform capabilities of Swift.  We chose to make them part of our open source release so that we can work on them together with the community.

Writing code that provides all of this functionality from scratch would be an enormous undertaking. Therefore, we've decided to bootstrap this project by taking advantage of great work that has already been done in these areas. Specifically, we will reuse the API and as much implementation as is possible from three existing libraries: `Foundation`, `libdispatch`, and `XCTest`. In addition to these there is `Swift Testing`, a new testing library designed from the ground up for Swift.

* * *

## Foundation

The Foundation framework defines a base layer of functionality that is required for almost all applications. It provides primitive classes and introduces several paradigms that define functionality not provided by the language or runtime. It is designed with these goals in mind:


* Provide a small set of basic utility classes.
* Make software development easier by introducing consistent conventions.
* Support internationalization and localization, to make software accessible to users around the world.
* Provide a level of OS independence, to enhance portability.


Swift 6 unifies the implementation of key [Foundation](https://developer.apple.com/documentation/foundation/) API across all platforms. Foundation's modern, portable Swift implementation provides consistency across platforms, is more robust, and is open source.

If your app is particularly sensitive to binary size, you can import the `FoundationEssentials` library, which provides a more targeted subset of Foundation’s features that omits internationalization and localization data.

More information about this work is available on our [GitHub project page](https://github.com/swiftlang/swift-foundation).

## libdispatch

Grand Central Dispatch (GCD or libdispatch) provides comprehensive support for concurrent code execution on multicore hardware.

libdispatch is currently available on all Darwin platforms. This project aims to make a modern version of libdispatch available on all other Swift platforms. To do this, we will implement as much of the portable subset of the API as possible, using the existing open source C implementation.

More information about libdispatch for Linux is available on our [GitHub project page](https://github.com/swiftlang/swift-corelibs-libdispatch).

## Swift Testing

Swift Testing is a package with expressive and intuitive APIs that make testing your Swift code a breeze.

It provides detailed output when a test fails using macros like `#expect`. And it scales to large codebases with features like parameterization to easily repeat a test with different arguments.

If you already have tests written using XCTest, you can run them side-by-side with newer tests written using Swift Testing. This helps you migrate tests incrementally, at your own pace.

More information about Swift Testing is available on our [GitHub project page](https://github.com/swiftlang/swift-testing).

## XCTest

The XCTest library provides a common framework for writing unit tests in Swift, for Swift packages and applications.

This version of XCTest uses the same API as the XCTest you may be familiar with from Xcode. Our goal is to enable your project's tests to run on all Swift platforms without having to rewrite them.

While XCTest remains supported, [Swift Testing](https://github.com/swiftlang/swift-testing) is the recommended framework for writing new tests. Swift Testing offers a modern, expressive, and extensible approach to testing in Swift, and represents the direction of future development.

If you already have tests written using XCTest, you can run them side-by-side with newer tests written using Swift Testing.

More information about XCTest on Linux is available on our [GitHub project page](http://www.github.com/swiftlang/swift-corelibs-xctest).


* * *
