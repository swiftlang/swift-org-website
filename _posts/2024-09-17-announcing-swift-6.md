---
layout: new-layouts/blog
published: true
date: 2024-09-17 10:00:00
title: Announcing Swift 6
author: [hborla]
---

We're delighted to announce the general availability of Swift 6. This is a major new release that expands Swift to more platforms and domains.

Many people know of Swift as a language for app development, with a million apps on the App Store. But Swift is great for more than just apps. Swift’s safety, speed, and approachability make it a great choice for many other use cases including libraries, internet-scale services, and the most performance-critical and secure code.

Swift 6 scales even further through new low-level programming features, an embedded Swift language subset, expanded Linux and Windows support, new cross-platform APIs including the new Swift Testing library, and more.

Read on for a deep dive into changes to the language, standard libraries, debugging, platform support, and next steps for getting started with Swift 6.

## Language and Standard Library

### Concurrency

Swift has long offered memory safety, ensuring that variables are initialized before they’re used, memory isn’t accessed after it’s been deallocated, and array indices are checked for out-of-bounds errors.  Swift 6 now includes a new, opt-in language mode that extends Swift’s safety guarantees to prevent data races in concurrent code by diagnosing potential data races in your code as compiler errors.

Data-race safety checks were previously available as warnings in Swift 5.10 through the `-strict-concurrency=complete` compiler flag. Thanks to improved `Sendable` inference and new compiler analysis for transferring mutable state from one actor to another, Swift 6 warnings about data-race safety have fewer false positives. You can find more information about the Swift 6 language mode and how to migrate at [Swift.org/migration](http://swift.org/migration).

Swift 6 marks the start of the journey to make data-race safety dramatically easier. The usability of data-race safety remains an area of active development, and your feedback will help shape future improvements.

Swift 6 also comes with a new [Synchronization library](https://developer.apple.com/documentation/synchronization) for low-level concurrency APIs, including atomic operations and a new mutex API.

### Typed throws

Swift 6 enables functions to specify the type of error that they throw as part of their signature. This feature is useful in generic code that forwards along errors thrown in client code, or in resource-constrained environments that cannot allocate memory, such as in embedded Swift code.

For example:

```swift
func parseRecord(from string: String) throws(ParseError) -> Record {
  // ...
}
```

A call to `parseRecord(from:)` will either return a `Record` instance or throw an error of type `ParseError`. A `do..catch` block will infer `ParseError` as the type of the `error` variable:

```swift
do {
  let record = try parseRecord(from: myString)
} catch {
  // 'error' has type 'ParseError'
}
```

Typed throws generalizes over throwing and non-throwing functions. A function that is specified as `throws` (without a specific error type) is equivalent to one that specifies `throws(any Error)`, whereas a non-throwing function is equivalent to one that specifies `throws(Never)`. Calls to functions that are `throws(Never)` are non-throwing and don’t require error handling at the call site.

Typed throws can also be used in generic functions to propagate error types from parameters, in a manner that is more precise than `rethrows`. For example, the `Sequence.map` method can propagate the thrown error type from its closure parameter, indicating that it only throws the same type of errors as the closure:

```swift
extension Sequence {
  func map<T, E>(_ body: (Element) throws(E) -> T) throws(E) -> [T] {
    // ...
  }
}
```

When given a closure that throws `ParseError`, `map` will throw `ParseError`. When given a non-throwing closure, `E` is inferred to `Never` and `map` will not throw.

### Ownership

Swift 5.9 introduced non-copyable types with the `~Copyable` syntax for modeling resources with unique ownership, and writing performance-conscious code by eliminating the runtime overhead associated with copying. Swift 6 now supports these types with the generics system, making it possible to write generic code that works with both copyable and non-copyable types.

For example:

```swift
protocol Drinkable: ~Copyable {
  consuming func use()
}

struct Coffee: Drinkable, ~Copyable { /* ... */ }
struct Water: Drinkable { /* ... */ }

func drink(item: consuming some Drinkable & ~Copyable) {
  item.use()
}

drink(item: Coffee())
drink(item: Water())
```

The `Drinkable` protocol has no requirement that its conforming types are `Copyable`. This means both the non-copyable type `Coffee` and copyable type `Water` can be passed into the generic `drink` function.

Switch statements can now be written to avoid copying within enum pattern-matching operations. This means that switch statements can be used with non-copyable payloads and can also provide performance benefits for copyable payloads, especially those based on copy-on-write containers like `Array` and `Dictionary`.

Non-copyable types are already used throughout the standard libraries. For instance, the new `Atomic` type in the Synchronization library is based on `~Copyable`, `Optional` and `Result` can now wrap non-copyable types, and the unsafe buffer pointer types can now point to non-copyable elements. C++ interoperability also uses non-copyable types to expose C++ move-only types to Swift.

### C++ interoperability

Swift 5.9 introduced bidirectional interoperability with C++ to seamlessly bring Swift to more existing projects. Swift 6 expands interoperability support to C++ move-only types, virtual methods, default arguments, and more standard library types including `std::map` and `std::optional`.

C++ types that do not have a copy constructor can now be accessed from Swift 6 as non-copyable types with `~Copyable`. And for those times when it’s useful to expose a C++ type with a copy constructor as `~Copyable` in Swift for better performance, a new `SWIFT_NONCOPYABLE` annotation can be applied to the C++ type.

Swift now also supports calls of C++ virtual methods on types annotated as `SWIFT_SHARED_REFERENCE` or `SWIFT_IMMORTAL_REFERENCE`.

When calling C++ functions or methods that have default argument values for some of their parameters, Swift now respects these default values, rather than requiring you to explicitly pass an argument.

### Embedded Swift

Swift 6 includes a preview of [Embedded Swift](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md), a language subset and compilation mode suitable for embedded software development, such as programming microcontrollers. The toolchain supports ARM and RISC-V bare-metal targets.

Embedded Swift produces small and standalone binaries by relying on generic specialization. Since it doesn’t rely on a runtime or type metadata, Embedded Swift is suitable for platforms with tight memory constraints as well as use in low-level environments with limited runtime dependencies.

Embedded Swift remains an experimental feature, with ongoing development before stable support in a future Swift release.

### 128-bit Integers

Swift 6 rounds out the set of low-level integer primitives with the addition of signed and unsigned [128-bit integer types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0425-int128.md). These are available on all Swift platforms, and provide the same API as other fixed-width integer types in the standard library.

### Productivity enhancements

Swift 6 introduces a number of productivity enhancements, including [`count(where:)`](https://developer.apple.com/documentation/swift/sequence/count(where:)) to streamline counting the number of elements in a sequence that satisfy a predicate, [pack iteration](https://www.swift.org/blog/pack-iteration/) for writing natural `for`-loops over the elements in a value parameter pack, access control for imports to keep implementation details from leaking into your public APIs, `@attached(body)` macros for synthesizing and augmenting function implementations, expression macros as default arguments, and more.

You can find a complete list of language proposals that were accepted through the [Swift Evolution](https://github.com/swiftlang/swift-evolution) process and implemented in Swift 6 on the [Swift Evolution dashboard](https://www.swift.org/swift-evolution/#?version=6.0).

## Debugging

### Custom LLDB summaries with @DebugDescription

Swift 6 provides a new debugging macro to easily customize how an object is displayed in LLDB when using the `p` command, and in the variables view in Xcode and VSCode, by using a formatting scheme that does not run arbitrary code.

Types that conform to `CustomDebugStringConvertible` provide a `debugDescription` property that returns a string describing the object. In LLDB, the `po` command calls this computed property on an object. In contrast, the `p` command uses LLDB’s type summary formatters to directly format the object using its stored property values.

[`@DebugDescription`](https://developer.apple.com/documentation/swift/debugdescription()) is a new macro in the standard library which lets you specify LLDB type summaries for your own types directly in code. The macro processes the `debugDescription` property, translating simple string interpolations involving stored properties into LLDB type summaries. This allows LLDB to use your custom formatting even when using `p`, and also in Xcode or VSCode’s variable display windows. The macro can use an existing conformance to `CustomDebugStringConvertible`, or you can provide a separate string interpolation only for use in LLDB’s `p` command. Providing a separate LLDB description string is useful if your `CustomDebugStringConvertible` implementation doesn’t meet the requirements of the `@DebugDescription` macro, or if you’re familiar with the [LLDB Summary String syntax](https://lldb.llvm.org/use/variable.html#summary-strings) and you want to use it directly.

For example, the following code customizes how `po` in LLDB displays the `Organization` type with a conformance to `CustomDebugStringConvertible`, and the `@DebugDescription` macro exposes this custom formatting to the `p` command and the variables view:

```swift
@DebugDescription
struct Organization: CustomDebugStringConvertible {
  var id: String
  var name: String
  var manager: Person
  // ... and more

  var debugDescription: String {
    "#\(id) \(name) [\(manager.name)]"
  }
}
```

```
(lldb) p myOrg
(Organization) myOrg = "`#100 Worldwide Travel [Jonathan Swift]`"
```

### Improved startup performance with explicit modules

Swift 6 dramatically improves startup performance in the debugger when you use explicit module builds. When debugging locally-built code, LLDB can now import explicitly-built Swift and Clang modules directly from the project build artifacts. This avoids the need to recompile implicit Clang module dependencies from source, which can take a long time, and it’s very sensitive to issues with header search paths. If the first `p` or `po` command in LLDB takes a long time due to Clang module compilation, or if your debugging is frequently blocked by Clang header import problems, consider adopting explicit modules in your project!

## Libraries

### Foundation

Swift 6 unifies the implementation of [Foundation](https://developer.apple.com/documentation/foundation/) across all platforms. The modern, portable Swift implementation provides consistency across platforms, it’s more robust, and it’s open source. macOS and iOS started using the Swift implementation of Foundation alongside Swift 5.9, and Swift 6 brings these improvements to Linux and Windows.

Core types like `JSONDecoder`, `URL`, `Calendar`, `FileManager`, `ProcessInfo`, and more have been completely reimplemented in Swift. These types share their implementation with macOS 15 and iOS 18, providing a new level of cross-platform consistency, reliability, and performance. Recently released APIs like `FormatStyle`, `ParseStrategy`, `Predicate`, and `JSON5`, from past macOS and iOS releases are now available on all Swift platforms. New Foundation APIs like `Expression`, calendar enumeration improvements, calendar recurrence rules, format style enhancements, and more are available simultaneously on macOS, iOS, Linux, and Windows - and they were built with community involvement.

If your Linux or Windows app imports the `Foundation` library from the Swift toolchain today, you get all of these improvements for free. And if your app is particularly sensitive to binary size, you can now import the `FoundationEssentials` library, which provides a more targeted subset of Foundation’s features that omits internationalization and localization data.

### Swift Testing

Swift 6 introduces Swift Testing, a new testing library designed from the ground up for Swift. It includes expressive APIs that make it easy to write and organize tests. It provides detailed output when a test fails using macros like `#expect`. And it scales to large codebases with features like parameterization to easily repeat a test with different arguments.

For example:

```swift
@Test("Continents mentioned in videos", arguments: [
  "A Beach",
  "By the Lake",
  "Camping in the Woods"
])
func mentionedContinents(videoName: String) async throws {
  let videoLibrary = try await VideoLibrary()
  let video = try #require(await videoLibrary.video(named: videoName))
  #expect(video.mentionedContinents.count <= 3)
}
```

Swift Testing takes full advantage of macros. Its `@Test` and `@Suite` attached macros declare test functions and suite types respectively, and they accept arguments (known as traits) to customize various behaviors. The `#expect` and `#require` expression macros validate expected behaviors, and capture rich representation of expressions and their sub-values to produce detailed failure messages.

Since Swift Testing is included directly in Swift 6 toolchains, you can `import Testing` without needing to declare a package dependency. This means your tests do not need to build Swift Testing or its dependencies (including swift-syntax), and its macro implementation comes prebuilt. The package manager in Swift 6 automatically builds and runs Swift Testing tests in addition to XCTests (if present), and shows results from both libraries in log output. Swift Testing supports all platforms that Swift officially supports, including all Apple platforms, Linux, and Windows.

To learn more about this new open source project, visit the [swift-testing](https://github.com/swiftlang/swift-testing) repository on GitHub, and get involved with its ongoing development [on the forums](https://forums.swift.org/c/related-projects/swift-testing/103).

## Platform Support

Swift is designed to support development and execution on all major operating systems, and platform consistency and expansion underpins Swift’s ability to reach new programming domains. Swift 6 brings major improvements to Linux and Windows across the board, including support for more Linux distributions and Windows architectures. Toolchains for all of the following platforms are available for download from [Swift.org/install](https://www.swift.org/install/).

### Fully static SDK for Linux

Swift 6 supports building fully statically linked executables for Linux; these have no external dependencies, so they are ideal for situations where you want to copy a program directly onto a system or into a container and run it without installing any extra software. The SDK can also be used to cross-compile to Linux from other platforms. Learn how to [get started with the static SDK for Linux](https://www.swift.org/documentation/articles/static-linux-getting-started.html) on [Swift.org](http://swift.org/).

### New Linux distributions

Swift 6 adds official support and testing for Debian and Fedora, as well as on Ubuntu 24.04.

### Windows build performance

Prebuilt toolchains are now available for the arm64 architecture, which provides improved compiler performance for Windows on ARM hosts. In Swift 6, the Swift package manager also parallelizes builds across multiple cores on Windows by default. On a 10-core machine, this can improve build performance by up to a factor of 10!

## Next Steps

### Download Swift 6

You can try out these exciting new developments in Swift 6 today! Install the official Swift 6 toolchains for macOS, Linux, and Windows at [Swift.org/install](https://www.swift.org/install/).

### Get started with Swift

[The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/) book has been updated to reflect the latest Swift 6 syntax and features. It serves as the official Swift guide and an excellent starting point for learning the language.

To help kickstart your Swift journey, [Swift.org/getting-started](https://www.swift.org/getting-started/) offers tutorials for various use cases, including building a cross-platform library, a web service using Vapor, and an embedded application for a microcontroller. There are also articles for diving deeper into some of Swift’s most popular features.

### Explore the package ecosystem

The Swift package ecosystem is continuously growing with new technologies to help you with a variety of tasks in your projects. You can explore package highlights at [Swift.org/packages](https://www.swift.org/packages/), which features popular package categories and a selection of new and notable packages that are hand-curated from an open nomination process every month.

### Get involved

Your experience with Swift 6 and your feedback can help shape the future evolution of the language, the tools, the package ecosystem, and the community. You can get involved by sharing your packages, documentation improvements, educational content, bug reports and enhancement requests, code contributions, and participating in forum discussions. Learn more at [Swift.org/contributing](http://swift.org/contributing).

Swift 6 is the culmination of countless contributions from members across the Swift community, and it marks a decade of building this incredible language, ecosystem, and community together. Thank you to everyone who participated in development and provided feedback. Your contributions make Swift a better language.
