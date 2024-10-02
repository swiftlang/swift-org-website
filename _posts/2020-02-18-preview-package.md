---
layout: new-layouts/blog
title: Standard Library Preview Package
author: natecook1000
date: 2020-02-18 09:00:00
---

I'm excited to announce a new open-source package and an enhancement to the Swift Evolution process: the [Standard Library Preview package](https://github.com/apple/swift-standard-library-preview)! The preview package provides access to functionality that has been accepted into the Swift standard library through the [Swift Evolution process](https://github.com/swiftlang/swift-evolution/blob/master/process.md), but has not yet shipped as part of an official Swift release. This will allow us to incorporate feedback informed by real-world usage and remove many of the technical obstacles to contributing to the standard library.

We've seeded the preview package with the functionality from the recently approved [SE-0270](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0270-rangeset-and-collection-operations.md) proposal, which includes operations on subranges of collections, such as `subranges(where:)` and `moveSubranges(_:to:)`, as well as the supporting `RangeSet` type.

> **Note**: The Standard Library Preview package itself is a product of the Swift Evolution process! For more information, including the criteria for inclusion in the preview package, see [SE-0264](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0264-stdlib-preview-package.md).

## Using the Preview Package

To use the Standard Library Preview package in a Swift Package Manager project, add it to your `Package.swift` file as a package dependency and a target dependency:

~~~swift
let package = Package(
    name: "MyPackage",
    dependencies: [
       .package(url: "https://github.com/apple/swift-standard-library-preview.git", from: "0.0.1"),
    ],
    targets: [
        .target(
            name: "MyTarget",
            dependencies: [.product(name: "StandardLibraryPreview", package: "swift-standard-library-preview")]),
    ]
)
~~~

... and take SE-0270 for a spin:

~~~swift
import StandardLibraryPreview

var numbers = [10, 12, -5, 14, -3, -9, 15]
let negatives = numbers.subranges(where: { $0 < 0 })
// numbers[negatives].count == 3

numbers.moveSubranges(negatives, to: 0)
// numbers == [-5, -3, -9, 10, 12, 14, 15]
~~~

As new additions to the standard library are approved, they'll be added to the preview package as part of the Swift Evolution process.

Even though all additions go through a thorough review, *there is no substitute for feedback informed by real-world usage*. Sometimes we discover that an API is not quite as good as it might have been. The preview package will help us address such discoveries, by creating an opportunity for feedback to lead to changes before APIs are locked in and shipped in an official Swift release.

## Using Standalone Packages

The Standard Library Preview package is under continuous development, and maintains a major version of `0` to indicate that it is not intended to be source stable. If you require source stability in your project, each approved standard library proposal is also available as a standalone package. The preview package is actually an umbrella library, which re-exports each of these individual packages.

For example, the functionality for SE-0270 is available as the standalone [SE0270_RangeSet](https://github.com/apple/swift-se0270-range-set/) package. So if you only ever want SE-0270, you can add it to your `Package.swift` file as a package dependency and a target dependency:

~~~swift
let package = Package(
    name: "MyPackage",
    dependencies: [
       .package(url: "https://github.com/apple/swift-se0270-range-set.git", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "MyTarget",
            dependencies: [.product(name: "SE0270_RangeSet", package: "swift-se0270-range-set")]),
    ]
)
~~~

... and import just SE-0270:

~~~swift
import SE0270_RangeSet

var numbers = [10, 12, -5, 14, -3, -9, 15]
let negatives = numbers.subranges(where: { $0 < 0 })
// numbers[negatives].count == 3

numbers.moveSubranges(negatives, to: 0)
// numbers == [-5, -3, -9, 10, 12, 14, 15]
~~~

## Proposing as a Package

We require each standard library feature proposal to include a full implementation before the review process begins. However, we realize that not everyone has the time and resources to build the whole stack—including LLVM, Clang, and the Swift compiler—just to change a part of the standard library.

Going forward, you can provide your implementation as a standalone SwiftPM package by opening a pull request against the new [Swift Evolution staging](https://github.com/swiftlang/swift-evolution-staging) repository. This more approachable way of proposing a feature should eliminate many of the technical obstacles to contributing to the standard library.

Once a proposal is approved, it will be made available as part of the Standard Library Preview package in order to garner feedback before being included in an official Swift release.

## Get Involved!

If you're interested in participating in the review process and determining the direction of Swift, please visit the [Evolution section of the Swift forums](https://forums.swift.org/c/evolution). Everyone is welcome to propose, discuss, and review ideas to improve the Swift language and standard library!

### Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/swift-org-blog-standard-library-preview-package/33916) on the [Swift forums][].

[Swift forums]: https://forums.swift.org
