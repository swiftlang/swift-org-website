---
layout: new-layouts/blog
date: 2020-09-25 9:00:00
title: Swift System is Now Open Source
author: milseman
---

In June, Apple introduced Swift System, a new library for Apple platforms that provides idiomatic interfaces to system calls and low-level currency types. Today, I’m excited to announce that we’re open-sourcing [System](https://github.com/apple/swift-system) and adding Linux support! Our vision is for System to eventually act as the single home for low-level system interfaces for all supported Swift platforms.

## Goodbye Imported C Interfaces

Most operating systems today support some flavor of system interfaces written in C that have existed for decades. While it is possible to use these APIs directly from Swift, these weakly-typed system interfaces imported from C can be error-prone and unwieldy. For example, the `open` system call (available on UNIX-like operating systems such as Linux and Apple platforms) imports as a pair of global functions:

~~~swift
func open(_ path: UnsafePointer<CChar>, _ oflag: Int32) -> Int32
func open(_ path: UnsafePointer<CChar>, _ oflag: Int32, _ mode: mode_t) -> Int32
~~~

These weakly-typed functions suffer from several shortcomings and fail to utilize the expressivity and type safety of Swift:

* File descriptors, alongside options, commands, errno, and other values, are imported as ordinary `Int32`s.

* The `oflag` argument is actually a logical OR-ing of exactly one file access mode and any number of flags, but this is not captured in the type of `oflag`.

* Callers of `open` have to remember to check for a negative return value indicating an error, and if so check the value of the global variable `errno` to know what error occurred. Additionally, some system calls may be canceled if a signal occurred, requiring callers to remember to write a loop around such calls checking for `EINTR` errors.

* File paths are unmanaged pointers, and if they are derived from a managed object (e.g. `Array<CChar>`), then callers must ensure that array is always null-terminated.

None of these semantic rules are captured in the API's signature, preventing the programming language from guiding the user towards correct usage of the API.

## Hello Idiomatic Swift Interfaces

The `System` module brings various language features to bear to improve expressivity and eliminate these opportunities for error.  For example, `System` defines the `open` system call as a static function with defaulted arguments in the `FileDescriptor` namespace:

~~~swift
extension FileDescriptor {
  /// Opens or creates a file for reading or writing.
  ///
  /// - Parameters:
  ///  - path: The location of the file to open.
  ///  - mode: The read and write access to use.
  ///  - options: The behavior for opening the file.
  ///  - permissions: The file permissions to use for created files.
  ///  - retryOnInterrupt: Whether to retry the open operation
  ///    if it throws `Errno.interrupted`.
  ///    The default is `true`.
  ///    Pass `false` to try only once and throw an error upon interruption.
  /// - Returns: A file descriptor for the open file
  ///
  /// The corresponding C function is `open`.
  public static func open(
    _ path: FilePath,
    _ mode: FileDescriptor.AccessMode,
     options: FileDescriptor.OpenOptions = FileDescriptor.OpenOptions(),
     permissions: FilePermissions? = nil,
     retryOnInterrupt: Bool = true
  ) throws -> FileDescriptor
}
~~~

When one compares this version of `open` to the original version from C, several significant differences stand out:

* `System` pervasively uses raw representable structs and option sets.  These strong types help catch mistakes at compile time and are trivial to convert to and from the weaker C types.

* Errors are thrown using the standard language mechanism and cannot be missed.  Further, all system calls interruptible by a signal take a defaulted-true `retryOnInterrupt` argument, causing them to retry on failure.  When combined, these two changes dramatically simplify error and signal handling.

* `FilePath` is a managed, null-terminated bag-of-bytes that conforms to `ExpressibleByStringLiteral` — far safer to work with than a `UnsafePointer<CChar>`.

The result is code that reads and behaves like idiomatic Swift. For example, this code creates a file path from a string literal and uses it to open and append to a log file:

~~~swift
let message: String = "Hello, world!" + "\n"
let path: FilePath = "/tmp/log"
let fd = try FileDescriptor.open(
  path, .writeOnly, options: [.append, .create], permissions: .ownerReadWrite)
try fd.closeAfter {
  _ = try fd.writeAll(message.utf8)
}
~~~

## A Multi-platform Library

`System` is a multi-platform library, not a cross-platform one. It provides a separate set of APIs and behaviors on every supported platform, closely reflecting the underlying OS interfaces. A single `import` will pull in the native platform interfaces specific for the targeted OS.

Our immediate goal is to simplify building cross-platform libraries and applications such as [SwiftNIO](https://github.com/apple/swift-nio) and the [Swift Package Manager](https://github.com/swiftlang/swift-package-manager). `System` does not eliminate the need for `#if os()` conditionals to implement cross-platform abstractions, but it does make it safer and more expressive to fill out the platform-specific parts.

## What's Next?

System is only in its infancy—it currently includes a small number of system calls, currency types, and convenience functionality. As part of the effort to increase the API coverage, we'll be working to adopt System in the Swift Package Manager. This will include [enhancements to FilePath](https://github.com/apple/swift-system/pull/2) and adding support for the recently announced [Swift on Windows](/blog/swift-on-windows/).

There's a ton of exciting work left to do. System (especially the forthcoming Windows support!) is a fantastic opportunity to get involved in the Swift project and help it grow into a strong, vibrant, cross-platform ecosystem.

## Get Involved

Your experience, feedback, and contributions are greatly encouraged!

* Get started by trying out the [System package on GitHub](https://github.com/apple/swift-system),

* Discuss the library and get help in the [Swift System forum](https://forums.swift.org/c/related-projects/system),

* [Open an issue](https://github.com/apple/swift-system/issues) with problems you find or ideas you have for improvements,

* And as always, [pull requests](https://github.com/apple/swift-system/pulls) are welcome!

## Questions?

Please feel free to ask questions about this post in the [associated thread](https://forums.swift.org/t/swift-system-is-now-open-source) on the [Swift forums](https://forums.swift.org/).
