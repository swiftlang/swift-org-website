## Foundation

The Foundation framework defines a base layer of functionality that is required for almost all applications. It provides primitive classes and introduces several paradigms that define functionality not provided by the language or runtime. It is designed with these goals in mind:


* Provide a small set of basic utility classes.
* Make software development easier by introducing consistent conventions.
* Support internationalization and localization, to make software accessible to users around the world.
* Provide a level of OS independence, to enhance portability.


More information about the Foundation framework in general is available
[from Apple's documentation](https://developer.apple.com/reference/foundation).  The Swift.org version of Foundation makes use of many
of the same underlying libraries (e.g. ICU and CoreFoundation) as Apple's
implementation, but has been built to be completely independent of the
Objective-C runtime.  Because of this, it is a substantial reimplementation of
the same API, using pure Swift code layered on top of these common underlying
libraries.  Much more information about this work is available on our
[GitHub project page](http://www.github.com/swiftlang/swift-corelibs-foundation).
