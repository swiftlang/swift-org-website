---
layout: new-layouts/blog
published: true
date: 2019-03-25 12:00:00
title: Swift 5 Released!
author: tkremenek
---

Swift 5 is now officially released!

Swift 5 is a major milestone in the evolution of the language.  Thanks to ABI stability, the Swift runtime is now included in current and future versions of Apple's platform operating systems: macOS, iOS, tvOS and watchOS.  Swift 5 also introduces new capabilities that are building blocks for future versions, including a reimplementation of String, enforcement of exclusive access to memory during runtime, new data types, and support for dynamically callable types.

You can try out some of the new features in this [playground](https://github.com/twostraws/whats-new-in-swift-5-0) put together by Paul Hudson.

### Language Updates

#### Stable ABI and Binary Compatibility

The ABI is now declared stable for Swift 5 on Apple platforms.  As a result, the Swift libraries are now incorporated into every macOS, iOS, tvOS, and watchOS release going forward. Your apps will be easier to build and smaller because they won't have to include those libraries.

See these blog posts for more details:

 * [ABI Stability and More](/blog/abi-stability-and-more/)
 * [Evolving Swift On Apple Platforms After ABI Stability](/blog/abi-stability-and-apple/)

#### Standard Library Updates

The standard library in Swift 5 includes the following new features:

* String reimplemented with UTF-8 encoding which can often result in faster code (See the [UTF-8 String](/blog/utf8-string/) blog post for more background on this change)
* Improved support for raw text in string literals (See the [String Literals](/blog/behind-se-0200/) blog post for more background on this refinement)
* Result and SIMD vector types added to the Standard Library
* Enhancements to String interpolation, adding more flexibility to construct text from data
* Performance improvements to Dictionary and Set

Swift 5 implements the following Standard Library proposals from the Swift Evolution process:

* [SE-0200 Enhancing String Literals Delimiters to Support Raw Text](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0200-raw-string-escaping.md)
* [ SE-0211 Add Unicode Properties to Unicode.Scalar](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0211-unicode-scalar-properties.md)
* [ SE-0214 Renaming the DictionaryLiteral type to KeyValuePairs](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0214-DictionaryLiteral.md)
* [ SE-0215 Conform Never to Equatable and Hashable](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0215-conform-never-to-hashable-and-equatable.md)
* [ SE-0218 Introduce compactMapValues to Dictionary](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0218-introduce-compact-map-values.md)
* [ SE-0221 Character Properties](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0221-character-properties.md)
* [SE-0225 Adding isMultiple to BinaryInteger](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0225-binaryinteger-iseven-isodd-ismultiple.md)
* [SE-0228 Fix ExpressibleByStringInterpolation](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0228-fix-expressiblebystringinterpolation.md)
* [SE-0229 SIMD Vectors](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0229-simd.md)
* [SE-0232 Remove Some Customization Points from the Standard Library's Collection Hierarchy](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0232-remove-customization-points.md)
* [SE-0233 Make Numeric Refine a new AdditiveArithmetic Protocol](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0233-additive-arithmetic-protocol.md)
* [SE-0234 Remove Sequence.SubSequence](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0234-remove-sequence-subsequence.md)
* [SE-0235 Add Result to the Standard Library](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0235-add-result.md)
* [SE-0237 Introduce withContiguous{Mutable}StorageIfAvailable methods](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0237-contiguous-collection.md)
* [ SE-0239 Add Codable conformance to Range types](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0239-codable-range.md)
* [SE-0241 Deprecate String Index Encoded Offsets](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0241-string-index-explicit-encoding-offset.md)

#### Additional Language and Compiler Updates

Swift 5 defaults to enforcing exclusive access to memory for both debug and release builds (See the [Swift 5 Exclusivity Enforcement](/blog/swift-5-exclusivity/) blog post for more information about this update). And Swift 5 supports dynamically callable types that help improve interoperability with dynamic languages such as Python, JavaScript and Ruby.

Swift 5 also implements the following language proposals from the Swift Evolution process:

* [SE-0192 Handling Future Enum Cases](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0192-non-exhaustive-enums.md)
* [SE-0213 Literal initialization via coercion](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0213-literal-init-via-coercion.md)
* [ SE-0216 Introduce user-defined dynamically "callable" types](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0216-dynamic-callable.md)
* [SE-0224 Support 'less than' operator in compilation conditions](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0224-ifswift-lessthan-operator.md)
* [ SE-0227 Identity key path](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0227-identity-keypath.md)
* [ SE-0230 Flatten nested optionals resulting from 'try?'](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0230-flatten-optional-try.md)


### Package Manager Updates

Swift Package Manager includes a number of new features in Swift 5, including dependency mirroring, target-specific build settings, customized deployment targets, and the ability to generate code coverage data.  Additionally, the `swift run` command now includes the ability to import libraries in a REPL without needing to build an executable.

Swift 5 implements the following Package Manager proposals from the Swift Evolution process:

* [ SE-0219 Package Manager Dependency Mirroring](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0219-package-manager-dependency-mirroring.md)
* [SE-0236 Package Manager Platform Deployment Settings](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0236-package-manager-platform-deployment-settings.md)
* [ SE-0238 Package Manager Target Specific Build Settings](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0238-package-manager-build-settings.md)

### Migrating to Swift 5

Swift 5 is source compatible with Swift 4, Swift 4.1 and Swift 4.2.

To help with moving to Swift 5 from earlier releases of Swift, Apple’s Xcode 10.2 contains a code migrator that can automatically handle many of the needed source changes. There is also a [migration guide](/migration-guide-swift5/) available to guide you through many of the changes — especially through the ones that are less mechanical and require more direct scrutiny.

### Documentation

An updated version of [The Swift Programming Language](https://docs.swift.org/swift-book/) for Swift 5 is now available on Swift.org. It is also available for free on the [Apple Books store](https://itunes.apple.com/us/book/the-swift-programming-language/id881256329?mt=11).

### Platforms

#### Linux

Official binaries for Ubuntu 18.04, Ubuntu 16.04 and Ubuntu 14.04 are
[available for download](/download/).

#### Apple (Xcode)

For development on Apple’s platforms, Swift 5 ships as part of [Xcode 10.2](https://itunes.apple.com/app/xcode/id497799835).

A toolchain is also [available for download](/download/) from Swift.org.

### Sources

Development on Swift 5 was tracked in the swift-5.0-branch on the following repositories on GitHub:

* [swift](https://github.com/apple/swift)
* [swift-clang](https://github.com/apple/swift-clang)
* [swift-clang-tools-extra](https://github.com/apple/swift-clang-tools-extra)
* [swift-cmark](https://github.com/swiftlang/swift-cmark)
* [swift-corelibs-foundation](https://github.com/swiftlang/swift-corelibs-foundation)
* [swift-corelibs-libdispatch](https://github.com/apple/swift-corelibs-libdispatch)
* [swift-corelibs-xctest](https://github.com/swiftlang/swift-corelibs-xctest)
* [swift-libcxx](https://github.com/apple/swift-libcxx)
* [swift-llbuild](https://github.com/swiftlang/swift-llbuild)
* [swift-lldb](https://github.com/apple/swift-lldb)
* [swift-llvm](https://github.com/apple/swift-llvm)
* [swift-package-manager](https://github.com/swiftlang/swift-package-manager)
* [swift-stress-tester](https://github.com/swiftlang/swift-stress-tester)
* [swift-syntax](https://github.com/swiftlang/swift-syntax)
* [swift-xcode-playground-support](https://github.com/apple/swift-xcode-playground-support)
* [swift-compiler-rt](https://github.com/apple/swift-compiler-rt)
* [swift-integration-tests](https://github.com/swiftlang/swift-integration-tests)

The tag `swift-5.0-RELEASE` designates the specific revisions in those repositories that make up the final version of Swift 5.

The `swift-5.0-branch` will remain open, but under the same release management process, to accumulate changes for a potential future bug-fix “dot” release.
