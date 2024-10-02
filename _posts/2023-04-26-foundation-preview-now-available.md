---
layout: new-layouts/blog
published: true
date: 2023-04-26 10:30:00
title: Foundation Package Preview Now Available
author: [parkera]
---

I'm pleased to announce that a preview of the [future of Foundation](https://www.swift.org/blog/future-of-foundation/) is now available on [GitHub](https://github.com/swiftlang/swift-foundation)!

This preview provides a unified implementation of Foundation, written in Swift, that is faster, safer, and more approachable to new contributors.

A new Foundation Workgroup will run reviews of proposed Foundation API and coordinate the needs of the Swift community with Apple engineering.

While the new package is not yet complete, it provides the first building blocks of our unified Swift implementation and I am eager to provide it to the Swift community for early testing and contributions.

## Current State

The following types are available in the preview package, with more to come later. Many types, including `JSONEncoder`, `Calendar`, `TimeZone`, and `Locale` are all-new Swift implementations. `FormatStyle` and `ParseStyle` available as open source for the first time.

* **FoundationEssentials**
    * `AttributedString`
    * `Data`
    * `Date`
    * `DateInterval`
    * `JSONEncoder`
    * `JSONDecoder`
    * `Predicate`
    * `String` extensions
    * `UUID`
* **Internationalization**
    * `Calendar`
    * `TimeZone`
    * `Locale`
    * `DateComponents`
    * `FormatStyle`
    * `ParseStrategy`

For internationalization support on non-Darwin platforms, we created a separate package named *[FoundationICU](https://github.com/swiftlang/swift-foundation-icu)*. This repository contains the necessary ICU implementations and data from the upstream [Apple OSS Distribution ICU](https://github.com/apple-oss-distributions/ICU). Using a common version of ICU will result in more reliable and consistent results when formatting dates, times and numbers.

> Note: The Foundation Preview package depends on the under-development [Swift 5.9 toolchain](https://www.swift.org/download).

## Performance

Being written in Swift, this new implementation provides some major benefits over the previous C and Objective-C versions.

`Locale`, `TimeZone` and `Calendar` no longer require bridging from Objective-C. Common tasks like getting a fixed `Locale` are an order of magnitude faster for Swift clients. `Calendar`'s ability to calculate important dates can take better advantage of Swift’s value semantics to avoid intermediate allocations, resulting in over a 20% improvement in some benchmarks. Date formatting using `FormatStyle` also has some major performance upgrades, showing a massive 150% improvement in a benchmark of formatting with a standard date and time template.

Even more exciting are the improvements to JSON decoding in the new package. Foundation has a brand-new Swift implementation for `JSONDecoder` and `JSONEncoder`, eliminating costly roundtrips to and from the Objective-C collection types. The tight integration of parsing JSON in Swift for initializing `Codable` types improves performance, too. In benchmarks parsing [test data](https://www.boost.org/doc/libs/master/libs/json/doc/html/json/benchmarks.html), there are improvements in decode time from 200% to almost 500%.

## Governance

The success of the Swift language is a great example of what is possible when a community comes together with a shared interest.

For Foundation, our goal is to create the best fundamental data types and internationalization features, and make them available to Swift developers everywhere. It will take advantage of emerging features in the language as they are added, and enable library and app authors to build higher level API with confidence.

Moving Foundation into this future requires not only an improved implementation, but also an improved process for using it outside of Apple’s platforms. Therefore, Foundation now has a path for the community to add new API for the benefit of Swift developers on every platform.

The Foundation package is an independent project in its early incubation stages. Inspired by the workgroups in the Swift project, it will have a workgroup to (a) oversee [community API proposals](https://github.com/swiftlang/swift-foundation/blob/main/Evolution.md) and (b) to closely coordinate with developments in the Swift project and those on Apple’s platforms. In the future, we will explore how to sunset the existing [swift-corelibs-foundation](https://github.com/swiftlang/swift-corelibs-foundation) and migrate to using the new version of Foundation created by this project.

The workgroup will meet regularly to review proposals, look at emerging trends in the Swift ecosystem, and discuss how the library can evolve to best meet our common goals. The initial members of the workgroup will be announced in the coming weeks.

## Next Steps

Quality and performance are our two most important goals for the project. Therefore, the plans for the first half of 2023 are continuing refinement of the core API, adding to our suites of unit and performance tests, and expanding to other platforms where possible, using the most relevant code from [swift-corelibs-foundation](https://github.com/swiftlang/swift-corelibs-foundation).

As a secondary goal, the project requests community proposals to add new APIs with focused scope to round out existing API functionality in Foundation. This will pave the way to explore how to add significant new APIs as the project progresses. In 2023, we aim to accept a small number of proposals with corresponding Swift implementations. The experience from reviewing and accepting those new APIs will help to refine the API proposal process and facilitate scaling up to more API contributions in the future.

Later this year, the porting will continue with high-quality Swift implementations of additional Foundation API such as `URL`, `Bundle`, `FileManager`, `FileHandle`, `Process`, `SortDescriptor`, `SortComparator` and more.

## Contributions

Foundation welcomes contributions from the community. The project uses the [Swift forums for discussion](https://forums.swift.org/c/related-projects/foundation/99) and [GitHub Issues](https://github.com/swiftlang/swift-foundation/issues) for tracking bugs, feature requests, and other work. Please see the [CONTRIBUTING](https://github.com/swiftlang/swift-foundation/blob/main/CONTRIBUTING.md) document for more information, including the process for accepting community contributions for new API in Foundation.

I'm excited to start this new chapter in the development of Foundation.
