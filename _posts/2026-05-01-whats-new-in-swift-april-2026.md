---
layout: new-layouts/post
published: true
date: 2026-05-01 10:30:00
title: "What's new in Swift: April 2026 Edition"
author: [adam-fowler, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

The 1.0 release of valkey-swift was recently [announced on the Valkey blog](https://valkey.io/blog/valkey-swift-1.0/). We've invited one of the authors to be this month's guest contributor:

> Hi, I'm Adam Fowler, an open source developer working in the Swift on server ecosystem. I am excited to announce the 1.0 release of [valkey-swift](https://github.com/valkey-io/valkey-swift) - a production-grade Swift client for [Valkey](https://valkey.io).
>
> Valkey is a high-performance datastore commonly used as a caching layer or message broker in server applications. It is an open source fork of Redis. 
> 
> Valkey-swift is a client library targeted at Valkey servers but is equally capable of working with Redis. It is built from the ground up with Swift 6 and structured concurrency. Every Valkey command returns typed responses checked at compile time, and strict concurrency checking is enabled throughout so that data races are caught by the compiler, not in production. Connections and subscriptions are all scoped through structured concurrency, so resources clean up automatically.
> 
> The client covers every standard Valkey command, auto-generated from Valkey's own command specifications to stay in sync as the server evolves. 
> 
> Previously, the de facto client library for Redis was RediStack, which was built on top of pre-concurrency concepts. Retrofitting structured concurrency would have been awkward and some of the new features in valkey-swift infeasible. Around the same time Redis changed its licensing structure and the open source fork Valkey was created. So it felt like a good time to make a clean break and build a new library.
> 
> If you're building server-side Swift and need a fast key-value store, add valkey-swift via Swift Package Manager, and you're ready to go. If you are using RediStack to connect with a Redis server, we have a [guide](https://swiftpackageindex.com/valkey-io/valkey-swift/1.3.0/documentation/valkey/migrating-from-redistack) to help you migrate to valkey-swift. Complete [documentation is available](https://swiftpackageindex.com/valkey-io/valkey-swift/documentation/valkey), and contributions are welcome on [GitHub](https://github.com/valkey-io/valkey-swift).

Now on to other news about Swift:

## Videos to watch
* The try! Swift Tokyo 2026 conference featured not one, but **two** exciting talks about Embedded Swift:
    * [Getting started with Embedded Swift](https://www.youtube.com/watch?v=0OcOFBe0jbQ) is a short and accessible introductory talk. Learn about writing Swift using embedded simulators, along with code examples to run Swift code on devices including the Game Boy Advance!
    * [Learn by Building: Bare-Metal Programming with Embedded Swift](https://www.youtube.com/watch?v=vDQ_yxD6JZ4) is a deeper look at Embedded Swift. Follow along by trying the [sample code for five bare-metal Raspberry Pi Pico examples](https://github.com/kishikawakatsumi/tryswift2026) that are featured in the talk.
* Want to learn more about Swift concurrency from engineers who have designed and used its features? Check out this [live online Q&A on Swift concurrency](https://www.youtube.com/watch?v=E95agtPgaa0).
* Nil Coalescing published a new video on some of the lesser known options for working with optionals in [Advanced Techniques for Working with Optionals in Swift](https://www.youtube.com/watch?v=qgDIOrKnmuw).

## New package releases
* [IndustrialKit](https://github.com/MalkarovPark/IndustrialKit) is a framework for designing, programming, and controlling robotic systems that was recently [discussed on the Swift forums](https://forums.swift.org/t/industrialkit-a-swift-framework-for-design-and-control-of-robotic-means-of-production/86168).
* [swift-tar](https://forums.swift.org/t/swift-tar-a-pure-swift-tar-archive-read-write-extract-library/85844) is a pure Swift library for reading, writing, and extracting TAR archives. swift-tar is cross-platform, works without requiring any system framework or Foundation, and supports GNU & PAX extensions.
* [Xylem](https://github.com/compnerd/xylem) is a pure Swift XML parser with zero dependencies, covering SAX, DOM, and XPath 1.0.

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