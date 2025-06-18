## Foundation

The Foundation framework defines a base layer of functionality that is required for almost all applications. It provides primitive classes and introduces several paradigms that define functionality not provided by the language or runtime. It is designed with these goals in mind:


* Provide a small set of basic utility classes.
* Make software development easier by introducing consistent conventions.
* Support internationalization and localization, to make software accessible to users around the world.
* Provide a level of OS independence, to enhance portability.


Swift 6 unifies the implementation of [Foundation](https://developer.apple.com/documentation/foundation/) across all platforms. Foundation's modern, portable Swift implementation provides consistency across platforms, is more robust, and is open source.

If your app is particularly sensitive to binary size, you can import the `FoundationEssentials` library, which provides a more targeted subset of Foundation’s features that omits internationalization and localization data.

More information about this work is available on our [GitHub project page](https://github.com/swiftlang/swift-foundation).
