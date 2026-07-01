---
layout: new-layouts/post
published: true
date: 2026-07-02 12:00
title: "What's new in Swift: June 2026 Edition"
author: [mikaelacaron, swifteves, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

June was an exciting month for Swift, featuring announcements at WWDC and community-organized events around the globe. We invited the organizers of one of the many community events to share with us:

> Hey, it’s Mikaela and Adrian. We are organizers of [CommunityKit](https://communitykit.social), a community-organized conference that takes place the same week as WWDC, and [iOSDevHappyHour](https://links.iosdevhappyhour.com), a monthly online meetup that keeps the community connected year-round. This is our fifth year coming out to Cupertino, and we love being able to create a place for the community to thrive, no matter where developers live.
> 
> At CommunityKit, we brought together over 250 developers in real life to geek over the announcements, stay for the community and vibes, see what everyone is creating, and learn from each other. Some of the highlights from this year’s event were the Indie Fair, where developers showcased their apps; the Watch Party, our annual gathering to watch the keynotes together; and Make Something, Ship Nothing, a hands-on postcard-making hangout to close the week. This year we also introduced workshops, including “Inclusive by Design” by Danielle Lewis, and for the Swift community: “Write Faster, Smarter Swift” by Paul Hudson.
> 
> We can’t wait to hear about what you’ve built and hope to see you at CommunityKit and iOSDevHappyHour next year!

Now on to other news about Swift:

## WWDC26 highlights

At its WWDC26 conference, Apple provided an update on its adoption of Swift and made a variety of new Swift-related announcements. Some highlights:

* Apple shared Swift-related updates in its [Platforms State of the Union](https://www.youtube.com/watch?v=yl2jsIoMfDU&t=2118s), and for upcoming releases, it has started writing parts of the core operating system kernel in Swift.
* [What’s new in Swift](https://www.youtube.com/watch?v=ssppiors2Ak) featured changes in Swift since last year, including a preview of what's coming in Swift 6.4, like URL parsing up to 4x faster and async code in defer blocks.
* The QUIC transport layer in Apple's networking stack was rewritten in Swift. The [project has been open sourced](https://github.com/apple/swift-nio-quic) and is available for cross-platform use through SwiftNIO integration.
* A new Swift package, [Foundation Models framework utilities](https://github.com/apple/foundation-models-utilities), was released with tools for working with LLMs via the Foundation Models framework, including custom skills and context management helpers. It runs on Apple platforms and select Linux distributions.
* The Foundation Models framework itself will be open sourced in the future, meaning the same Swift APIs you use in your app could run on your server.
* [Container Machine](https://github.com/apple/container/blob/main/docs/container-machine.md) is a new tool included in [Container](https://github.com/apple/container) that provides a lightweight, persistent Linux environment on a Mac with images that can be shared across environments. And it's written in Swift!

## Videos to watch
* [Build real-time apps and services with gRPC and Swift](https://www.youtube.com/watch?v=CCFxlFF9XRI) walks through integrating an iOS app and gRPC service using live race data from a go-karting league. See if you can spot where the track is located. 👀
* Want to learn about Swift macros with hands-on tutorials? Stewart Lynch published two videos and sample code to follow along: [Swift Macros Demystified: Build a Freestanding Expression Macro](https://www.youtube.com/watch?v=7W6R2TIoEW8), and [Swift Attached Macros: Build a Real-World Member Macro from Scratch](https://www.youtube.com/watch?v=iQYEG3tPWpw).
* A new [10-minute Embedded Swift demo](https://www.youtube.com/watch?v=_YwwTJ3TDpE) uses an accelerometer and the XIAO ESP32-C6 to control a Swift bird that glides across a mini OLED screen. No soldering required!

## Community highlights
* [Swift Package Index joined Apple](https://swiftpackageindex.com/blog/swift-package-index-joins-apple) and remains open source. The team says they're working together to build a comprehensive package registry for the Swift community.
* Yeo Kheng Meng blogged about [bringing Swift to the Apple II](https://yeokhengmeng.com/2026/06/swift-on-apple-ii/), complete with a REPL, compiler, file browser, and editor. It's a subset of Swift and was built with AI assistance.
* Apple published a new Swift adoption story: [Migrating the TrueType Hinting Interpreter](https://www.swift.org/blog/migrating-truetype-hinting-to-swift/), covering how the TrueType hinting interpreter in macOS and iOS was rewritten in Swift from C. It runs 13% faster on average.
* The Swift Ecosystem Steering Group [announced the creation of the Networking workgroup](https://www.swift.org/blog/announcing-networking-workgroup/). This group will work on a unified networking stack for Swift, layered from low-level I/O primitives, through common protocols, to a modern HTTP client and server API.

## New package releases
* New [Swift bindings for the OkHttp Java library](https://forums.swift.org/t/swift-okhttp-swift-bindings-for-okhttp-on-android-java/87128) were released, if you're using Swift on Android and looking for an HTTP client this may be useful. The project was generated with [swift-java](https://github.com/swiftlang/swift-java).
* [Kiln](https://forums.swift.org/t/kiln-a-documentation-engine-written-in-swift/87287) is a new documentation engine written in Swift, built to replace MkDocs-based documentation sites. For the Swift community, it gives even more options for rendering docs, in addition to the [DocC](https://www.swift.org/documentation/docc/) project which is used for the official Swift documentation. You can see Kiln in action, it's being used by the [Vapor documentation](https://docs.vapor.codes).
* Version 0.4.0 of [Elementary UI](https://github.com/elementary-swift/elementary-ui) was released, a frontend framework for running Swift applications natively in the browser.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [SE-0526](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0526-deadline.md) `withDeadline` - Asynchronous operations in Swift can run indefinitely, and implementing time limits manually using task groups and clock sleep operations is verbose and error-prone. This proposal adds `withDeadline`, a function that executes an async operation with a composable absolute time limit specified as a clock instant, canceling the operation if it hasn't completed by that time, and allowing multiple nested operations to share the same deadline without the drift that accumulates when relative durations are passed through call layers.

**Recently accepted:**
* [SE-0474](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0474-yielding-accessors.md) Yielding Accessors - When you call a mutating method on a computed property, Swift creates the illusion of in-place mutation by getting a copy, mutating it, then setting it back. This causes unnecessary copy-on-write buffer duplication for types like `String`, and is impossible for noncopyable types, which can't be copied out at all. This proposal adds `yielding borrow` and `yielding mutate`, two new ways to implement computed properties and subscripts that instead lend the caller direct access to the underlying value without copying it.

**Recently accepted with modifications:**
* [SE-0529](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0529-filepath-in-stdlib.md) Add `FilePath` to the Standard Library - `FilePath` in the swift-system package parses platform-specific path syntax on the developer's behalf, provides a normalized view of path components, and enables filesystem resolution. However, shipping in an external package means the standard library, Swift runtime, and toolchain libraries such as Foundation cannot depend on it. This proposal adds `FilePath` and its associated types to the `Swift` module, alongside essential functionality for construction, decomposition, resolution, and C interoperability.
* [SE-0527](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0527-rigidarray-uniquearray.md) `UniqueArray` - Swift's `Array` can't store noncopyable elements without compromising its copy-on-write semantics or performance predictability. This proposal adds two new types to a new Containers module: `RigidArray`, a fixed-capacity array that traps on overflow, and `UniqueArray`, a dynamically growing array that enforces unique ownership by being noncopyable itself.