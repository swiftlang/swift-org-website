---
layout: new-layouts/post
published: true
date: NNNN-NN-NN 10:00:00
title: Swift 6.3 Released
author: [hborla, heckj]
category: "Language"
---

Swift 6.3 is here, a release that expands Swift into new domains and improves developer ergonomics across the board. This release features:

* An official Swift SDK for Android
* Improvements for using Swift in embedded environments
* More flexible C interoperability
* Improvements to cross-platform build tooling

Swift is designed to be the language you reach for at every layer of the software stack. Whether you're building embedded firmware, internet-scale services, or full-featured mobile apps, Swift delivers strong safety guarantees, performance control when you need it, and expressive language features and APIs. Swift 6.3 lowers the barrier to getting these benefits across more of the stack.

Read on for an overview of the changes and next steps to get started.

## Language and Standard Library

### C interoperability

Swift 6.3 introduces the `@c` attribute, which lets you expose Swift functions and enums to C code in your project. Annotating a function or enum with `@c` prompts Swift to include a corresponding declaration in the generated C header that you can include in your C/C++ files:

```swift
@c
func callFromC() { ... }
```

```c
// Generated C header

void callFromC(void);
```

You can provide a custom name to use for the generated C declaration:

```swift
@c(MyLibrary_callFromC)
func callFromC() { ... }
```

```c
// Generated C header

void MyLibrary_callFromC(void);
```

`@c` also works together with `@implementation`, to let you provide a Swift implementation for a function declared in a C header:

```c
// C header

void callFromC(void);
```

```swift
// Implementation written in Swift

@c @implementation
func callFromC() { ... }
```

### Module name selectors

Swift 6.3 introduces *module selectors* to specify which imported module Swift should look in for an API used in your code. If you import more than one module that provides API with the same name, module selectors let you disambiguate which API to use:

```swift
import ModuleA
import ModuleB

let x = ModuleA::getValue() // Call 'getValue' from ModuleA
let y = ModuleB::getValue() // Call 'getValue' from ModuleB
```

Swift 6.3 also enables using the `Swift` module name to access concurrency and String processing library APIs:

```swift
let task = Swift::Task {
  // async work
}
```

### Performance control for library APIs

Swift 6.3 introduces new attributes that give library authors finer-grained control over compiler optimizations for clients of their APIs:

* **Function specialization:** Provide pre-specialized implementations of a generic API for common concrete types using `@specialize`.
* **Inlining:** Guarantee inlining — a compiler optimization that expands the body of a function at the call-site — for direct calls to a function with `@inline(always)`. Use this attribute only when you’ve determined that the benefits of inlining outweigh any increase in code size.
* **Function implementation visibility:** Expose the implementation of a function in an ABI-stable library to clients with `@export(implementation)`. This allows the function to participate in more compiler optimizations.

For a full list of language evolution proposals in Swift 6.3, see the [Swift Evolution dashboard](https://www.swift.org/swift-evolution/#?version=6.3).

## Package and Build Improvements

Swift 6.3 includes a preview of Swift Build integrated into Swift Package Manager. This preview brings a unified build engine for SwiftPM across all supported platforms for a more consistent cross-platform development experience. To learn more, check out [Preview the Swift Build System Integration.](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/swiftbuildpreview) We encourage you to try it out in your own packages and [report any issues](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/swiftbuildpreview/#Reporting-issues) you encounter.

Swift 6.3 also brings the following Swift Package Manager improvements:

* **Prebuilt Swift Syntax for shared macro libraries:** Factor out shared macro implementation code into a library with support for swift-syntax prebuilt binaries in libraries that are only used by macros.
* **Flexible inherited documentation:** Control whether inherited documentation is included in command plugins that generate symbol graphs.
* **Discoverable package traits:** Discover the traits supported by a package using the new `swift package show-traits` command.

For more information on changes to Swift Package Manager, see the [SwiftPM 6.3 Release Notes](https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/ReleaseNotes/6.3.md).

## Core Library Updates

### Swift Testing

Swift Testing has a number of improvements, including warning issues, test cancellation, and image attachments.

* **Warning issues**: Specify the severity of a test issue using the new `severity` parameter to `Issue.record`. You can record an issue as a warning using `Issue.record("Something suspicious happened", severity: .warning)`. This is reflected in the test’s results, but doesn’t mark the test as a failure.
* **Test cancellation**: Cancel a test (and its task hierarchy) after it starts using `try Test.cancel()`. This is helpful for skipping individual arguments of a parameterized test, or responding to conditions during a test that indicate it shouldn’t proceed.
* **Image attachments**: Attach common image types during a test on Apple and Windows platforms. This is exposed via several new cross-import overlay modules with UI frameworks like UIKit.

The list of Swift Testing evolution proposals included in Swift 6.3 are [ST-0012](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0012-exit-test-value-capturing.md), [ST-0013](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0013-issue-severity-warning.md), [ST-0014](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0014-image-attachments-in-swift-testing-apple-platforms.md), [ST-0015](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0015-image-attachments-in-swift-testing-windows.md), [ST-0016](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0016-test-cancellation.md), [ST-0017](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0017-image-attachment-consolidation.md), and [ST-0020](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0020-sourcelocation-filepath.md).

### DocC

Swift 6.3 adds three new experimental capabilities to DocC:

* **Markdown output:** Generate Markdown versions of your documentation pages alongside the standard rendered JSON covering symbols, articles, and tutorials. Try it out by passing `--enable-experimental-markdown-output` to `docc convert`.
* **Per-page static HTML content:** Embed a lightweight HTML summary of each page — including title, description, availability, declarations, and discussion — directly into the index.html file within a `<noscript>` tag. This improves discoverability by search engines and accessibility for screen readers without requiring JavaScript. Try it out by passing `--transform-for-static-hosting --experimental-transform-for-static=hosting-with-content` to `docc convert`.
* **Code block annotations:** Unlock new formatting annotations for code blocks, including `nocopy` for disabling copy-to-clipboard, `highlight` to highlight specific lines by number, `showLineNumbers` to display line numbers, and `wrap` to wrap long lines by column width. Specify these options in a comma-separated list after the language name on the opening fence line:

  ````
  ```swift, nocopy
  let config = loadDefaultConfig()
  ```
  ````

  ````
   ```swift, highlight=[1, 3]
  let name = "World"       // highlighted
  let greeting = "Hello"
  print("\(greeting), \(name)!")  // highlighted
  ```
  ````

  ````
  ```swift, showLineNumbers, wrap=80
  func example() { /* ... */ }
  ```
  ````

  DocC validates line indices and warns about unrecognized options. Try out the new code block annotations with `--enable-experimental-code-block-annotations`.

## Platforms and Environments

### Embedded Swift

Embedded Swift has a wide range of improvements in Swift 6.3, from enhanced C interoperability and better debugging support to meaningful steps toward a complete linkage model. For a detailed look at what’s new in embedded Swift, see [Embedded Swift Improvements coming in Swift 6.3](https://www.swift.org/blog/embedded-swift-improvements-coming-in-swift-6.3/).

### Android

Swift 6.3 includes the first official release of the Swift SDK for Android. With this SDK, you can start developing native Android applications in Swift, update your Swift packages to support building for Android, and use [Swift Java](https://github.com/swiftlang/swift-java) to integrate Swift code into existing Android applications written in Kotlin/Java. This is a significant milestone that opens new opportunities for cross-platform development in Swift.

To learn more and try out Swift for Android development in your own projects, see [Getting Started with the Swift SDK for Android](https://www.swift.org/documentation/articles/swift-sdk-for-android-getting-started.html).

## Thank You

Swift 6.3 reflects the contributions of many people across the Swift community — through code, proposals, forum discussions, and feedback from real-world experience. A special thank you to the Android Workgroup, whose months of effort — building on many years of grassroots community work — brought the Swift SDK for Android from nightly previews to an official release in Swift 6.3. 

If you'd like to get involved in what comes next, the [Swift Forums](http://forums.swift.org/) are a great place to start.

## Next Steps

Try out Swift 6.3 today! The easiest way to install the standalone Swift 6.3 toolchain is using [swiftly](https://www.swift.org/swiftly/documentation/swiftlydocs/), a Swift version manager that runs on macOS and Linux. If you’re building apps for Apple platforms, Swift 6.3 is included in Xcode 26.4. Additional installation methods, including for Windows and Android, are included on the [Install Swift](https://www.swift.org/install/) page.
