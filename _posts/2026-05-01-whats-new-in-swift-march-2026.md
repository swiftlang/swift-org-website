---
layout: new-layouts/post
published: true
date: 2026-05-01 10:30:00
title: "What's new in Swift: April 2026 Edition"
author: [adamfowler, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

The 1.0 release of valkey-swift was recently announced on the Valkey blog. We've invited one of the authors to be this month's guest contributor:

> Will insert a guest contribution written by Adam Fowler.

Now on to other news about Swift:

## Videos to watch
* The try! Swift Tokyo 2026 conference featured not one, but **two** exciting talks about Embedded Swift:
    * [Getting started with Embedded Swift](https://www.youtube.com/watch?v=0OcOFBe0jbQ) is a short and accessible introductory talk. Learn about writing Swift using embedded simulators, along with code examples to run Swift code on devices including the Game Boy Advance!
    * [Learn by Building: Bare-Metal Programming with Embedded Swift](https://www.youtube.com/watch?v=vDQ_yxD6JZ4) is a deeper look at Embedded Swift. Follow along by trying the [sample code for five bare-metal Raspberry Pi Pico examples](https://github.com/kishikawakatsumi/tryswift2026) that are featured in the talk.
* Want to learn more about Swift concurrency from engineers who have designed and used its features? Check out this [live online Q&A on Swift concurrency](https://www.youtube.com/watch?v=E95agtPgaa0).
* Nil Coalescing published a new video on some of the lesser known options for working with optionals in [Advanced Techniques for Working with Optionals in Swift](https://www.youtube.com/watch?v=qgDIOrKnmuw).

## New package releases
* [IndustrialKit](https://github.com/MalkarovPark/IndustrialKit) is a framework for building to design, program, and control robotic systems that was recently [discussed on the Swift forums](https://forums.swift.org/t/industrialkit-a-swift-framework-for-design-and-control-of-robotic-means-of-production/86168).
* [swift-tar](https://forums.swift.org/t/swift-tar-a-pure-swift-tar-archive-read-write-extract-library/85844) is a pure Swift library for reading, writing, and extracting TAR archives. swift-tar is cross-platform, works without requiring any system framework or Foundation, and supports GNU & PAX extensions.
* [Xylem](https://github.com/compnerd/xylem) is pure Swift XML parser with zero dependencies, covering SAX, DOM, and XPath 1.0.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [SE-0529](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0529-filepath-in-stdlib.md) Add `FilePath` to the Standard Library - `FilePath` in the swift-system package parses platform-specific path syntax on the developer's behalf, provides a normalized view of path components, and enables filesystem resolution. However, shipping in an external package means the standard library, Swift runtime, and toolchain libraries such as Foundation cannot depend on it. This proposal adds `FilePath` and its associated types to the `Swift` module, alongside essential functionality for construction, decomposition, resolution, and C interoperability.

**Recently accepted:**
* [Vision for Networking](https://github.com/swiftlang/swift-evolution/blob/main/visions/networking.md) - Swift's networking ecosystem is getting an overhaul. This vision document proposes three initial areas of focus: evolve HTTP APIs including new HTTP client and server implementations, define currency types to reduce duplicated effort and integration friction, and define a unified networking stack.
* [SE-0517](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0517-uniquebox.md) `UniqueBox` - Sometimes in Swift it's necessary to manually put something on the heap that wouldn't otherwise live there. This proposal introduces a new type in the standard library, UniqueBox, which is a smart pointer type that uniquely owns a value on the heap. 
* [ST-0022](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0022-customtestreflectable.md) Custom reflection during testing - When a test fails, Swift Testing reflects the values involved to help diagnose the failure, but types have no way to customize what appears in that output. This proposal adds a customization point, `CustomTestReflectable`, for developers to specify exactly what should be included in test output, whether they want to simplify, obscure, extend, or reformat that information.

## One more thing

Have you recently looked at the [Swift.org community page](/community/)? It includes updated content, plus a new [How we work](/community/how-we-work/) page that describes opportunities to get involved.