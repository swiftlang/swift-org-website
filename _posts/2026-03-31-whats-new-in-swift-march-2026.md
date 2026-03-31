---
layout: new-layouts/post
published: true
date: 2026-03-31 14:30:00
title: "What's new in Swift: March 2026 Edition"
author: [owen-voorhees, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

[Swift 6.3 has been released](https://www.swift.org/blog/swift-6.3-released/), expanding Swift into new domains and improving developer ergonomics. A highlight of its release is work to improve cross-platform build tooling. Owen Voorhees shares an update on that effort:

> Hi! I’m Owen, a lead engineer on the Core Build team at Apple. Last year we [shared our goal](https://www.swift.org/blog/the-next-chapter-in-swift-build-technologies/) to bring Swift Build to Swift Package Manager, in an effort to deduplicate build technologies within the Swift ecosystem and deliver a consistent build experience across all platforms that Swift supports.
> 
> Since the announcement, we’ve been working in the open, landing hundreds of patches to improve Swift Build’s support across various platforms including Linux and Windows, and to integrate it deeply in Swift Package Manager. With Swift 6.3, developers have the [option](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/swiftbuildpreview/) to enable this integration and try it out with their packages. To validate parity with the previous build system, we’ve used the package list from swiftpackageindex.com, testing thousands of open source packages with Swift Build.
> 
> Most recently, [the main branch of Swift started using Swift Build as its default build system](https://github.com/swiftlang/swift-package-manager/pull/9661), paving the way for Swift Build to be the out of the box option for Swift developers in a future Swift release.
> 
> Over the coming months, we’ll continue sharing our progress and driving down the remaining bugs to bring the build system to parity. We encourage you to [give it a try](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/swiftbuildpreview/) and [file bugs that you encounter](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/swiftbuildpreview/#Reporting-issues). We’re excited by this progress, and look forward to building future tooling improvements across all platforms and project models that will benefit from this single build system.

Now on to other news about Swift:

## Videos to watch
* Interested in Swift for systems programming? [The -ization of Containerization](https://www.youtube.com/watch?v=TRw0bsrtCjA&t=12052s), presented at SCaLE, covers the Containerization team's experience building it in Swift.
* [Swift community meetup #8](https://www.youtube.com/watch?v=wCdE8sPJwTo) featured two talks: real-time computer vision on NVIDIA Jetson, and a production AI data pipeline built with Vapor.
* A new interview with Matt Massicotte, answering questions about Swift Concurrency: [Swift Concurrency Explained](https://www.youtube.com/watch?v=cUu0M5ewpPM).

## Community highlights
* How can you gradually deprecate APIs ahead of a major release? Point-Free blogged [Hard Deprecations and Soft Landings with SwiftPM Traits](https://www.pointfree.co/blog/posts/203-hard-deprecations-and-soft-landings-with-swiftpm-traits), a clever approach to API deprecation, worth trying out.
* Daniel Jilg shared [TelemetryDeck's adoption story](https://www.swift.org/blog/building-privacy-first-analytics-with-swift/) on the Swift blog, including how they use Swift for backend services.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [SE-0522](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0522-source-warning-control.md) Source-Level Control Over Compiler Warnings - Swift lets you configure warning behavior at the module level using compiler flags, but that's an all-or-nothing approach. This proposal adds fine-grained warning control: a `@warn` attribute that lets you override warning behavior for a specific diagnostic group within the scope of a single declaration, with support for escalating it to an error, downgrading it to a warning, or suppressing it entirely, without affecting the rest of your module.

**Recently accepted:**
* [SE-0509](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0509-swift-sboms-via-swiftpm.md) Software Bill of Materials (SBOM) Generation for Swift Package Manager - An SBOM is a standardized inventory of all the software components in a project, increasingly required for security auditing and regulatory compliance. This proposal adds native SBOM generation to SwiftPM as both a `--sbom-spec` flag on `swift build`, and a separate `swift package generate-sbom` subcommand, with support for the CycloneDX and SPDX formats.
* [ST-0021](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0021-targeted-interoperability-swift-testing-and-xctest.md) Targeted Interoperability between Swift Testing and XCTest - When migrating from XCTest to Swift Testing, it's common to call existing XCTest helper functions from new Swift Testing tests. Today, an `XCTAssert` failure inside a Swift Testing test is silently ignored. This proposal fixes that: XCTest APIs will work as expected when called in Swift Testing, and Swift Testing APIs will work as expected when called in XCTest, if XCTest already provides similar functionality.
* [SE-0515](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0515-noncopyable-reduce.md) Allow `reduce` to produce noncopyable results - Swift's `reduce` currently requires its initial value to be copyable, making it incompatible with noncopyable types. This proposal updates `reduce` to support noncopyable initial values and results, and changes it to consume rather than borrow the initial value, eliminating an unnecessary copy even for copyable types.