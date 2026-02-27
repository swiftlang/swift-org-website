---
layout: new-layouts/post
published: true
date: 2026-02-27 15:30:00
title: "What's new in Swift: February 2026 Edition"
author: [karenchu, davelester]
category: "Digest"
---

[FOSDEM](https://fosdem.org/2026/) is the largest open source conference in the world, and this year Swift showed up in a big way. We invited the lead organizer of a pre-conference Swift event to share their experience:

> Hey there! Karen Chu here. 👋 I help grow and support the Swift open source community, and one of my favorite things has been increasing Swift’s participation in open source events.
>
> As a follow-up to Swift’s presence at FOSDEM last year, this year we expanded our approach by running our own [Pre-FOSDEM fringe event](https://swiftlang.github.io/event-fosdem/), which included 11 talks across various non-Apple platforms, in addition to [four Swift talks across various devroom tracks](https://swiftlang.github.io/event-fosdem/#swift-talks-at-fosdem).
>
> Though it was my first year at FOSDEM, it was delightful to meet several people who attended the Swift devroom last year and also came through again this year. With the vast array of attendee backgrounds (I met recent grads, former Swift mentees, Swift WG members, folks from the Swift Core Team, and more) and talks covering different platforms (embedded, server, BSD, Android, and more), that weekend showed me just how much momentum Swift has gained as a general purpose language that can benefit everyone.
>
> I wanted to highlight Simon Leeb’s talk, [Swift in the Browser with ElementaryUI](https://www.youtube.com/watch?v=OmQ881sOTIc&list=PLeb93j_rsErO182fdoJ4m1p_suKAOcBnM&index=6), as a popular talk from the event which showed how to run Swift applications natively in the browser with WebAssembly.
>
> FOSDEM may be over (for now) but I’m already excited about how the Swift community will show up next year!

To catch up on _all_ the talks at the Pre-FOSDEM event, check out the [YouTube playlist](https://www.youtube.com/watch?v=jAgydnnjj0Y&list=PLeb93j_rsErO182fdoJ4m1p_suKAOcBnM).

Now onto what's new in Swift this month:

## New package releases
* Originally developed for searching financial databases for strings like stock tickers, [FuzzyMatch](https://github.com/ordo-one/FuzzyMatch) brings high-performance fuzzy string matching to Swift.
* Now you can expose GraphQL APIs in your applications with new [Vapor and Hummingbird packages](https://forums.swift.org/t/introducing-graphql-vapor-hummingbird-packages/84758).
* Using Microsoft SQL Server? [SQLClient-Swift](https://github.com/vkuttyp/SQLClient-Swift) is a native client for iOS, macOS, and Linux that's built using modern Swift Concurrency.
* Developers now have more options to create terminal-based Swift applications with [TuiKit](https://tuikit.dev), a declarative, SwiftUI-like framework for building Terminal User Interfaces. TuiKit joins [Noora](https://noora.tuist.dev) which provides themeable components for CLIs.
* [BeautifulMermaid](https://github.com/lukilabs/beautiful-mermaid-swift) allows you to parse and render Mermaid diagrams as SVGs or ASCII art without WebViews or JavaScript. It currently works on iOS and macOS.

Lastly, [Swift System Metrics 1.0](https://www.swift.org/blog/swift-system-metrics-1.0-released/) was announced, making the collection of process-level metrics easy.

## Videos to watch
* Ever wanted to control microcontrollers in Swift? [CoreAVR + ArduinoKit: Swift on the Arduino, the Swift way](https://www.youtube.com/watch?v=1ofoMAFq8ak&list=PLeb93j_rsErO182fdoJ4m1p_suKAOcBnM&index=6) introduces ArduinoKit, which acts as the Arduino standard library for Swift, and CoreAVR, a hardware abstraction layer for AVR microcontrollers written in Swift.
* [Introducing the Swift SDK for Android](https://www.youtube.com/watch?v=mZNIAuQ7s7k&list=PLeb93j_rsErO182fdoJ4m1p_suKAOcBnM&index=8) covered the current state of Swift on Android, how to call Java and Kotlin APIs from Swift, UI strategies, and what's actively being worked on.
* [SwiftCrossUI: Swift apps, everywhere](https://www.youtube.com/watch?v=EC9qVCYBVyk&list=PLeb93j_rsErO182fdoJ4m1p_suKAOcBnM&index=9) presented a UI solution for Swift applications that run on Android, Linux, and Windows, using native UI components on each platform. The project also recently published a [development update](https://www.youtube.com/watch?v=HgRO7eIHkyE) in video form, covering contributions and recent changes.
* Interested in writing Swift using agents? At Swift Barcelona, a talk on [Building Agentic Apps with MCP in Swift](https://www.youtube.com/watch?v=ekOzNd1_vo8) demonstrated several open source tools. And if you're an Xcode user, check out a recent [code-along covering coding intelligence in Xcode 26](https://www.youtube.com/watch?v=U1WM3ALwQX8).

## Community highlights
* Swift was accepted to Google Summer of Code in 2026! 🎉 A recent [forums post announced the process](https://forums.swift.org/t/swift-google-summer-of-code-2026/85007) and outlined key dates to learn more. This is a great opportunity if you're a student interested in contributing to Swift!
* A community member recently blogged about their experience [profiling Swift applications on Windows and macOS with Tracy](https://compositorapp.com/blog/2026-02-07/Tracy/), covering how to visualize and analyze their application performance.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [SE-0514](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0514-hashable-conformance-for-dictionarykeys-collectionofone-emptycollection.md) Hashable Conformance for Dictionary.Keys, CollectionOfOne and EmptyCollection - Three standard library collection types can't currently be used in sets or as dictionary keys. This proposal adds Hashable conformance to all three, for consistency with the rest of the standard library.
* [SE-0513](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0513-commandline-executablepath.md) API to get the path to the current executable - There's currently no portable, reliable way to get the path to the currently running executable in Swift. This proposal adds CommandLine.executablePath, a new property in the standard library that provides a consistent way to get this value across all platforms Swift supports.

**Recently accepted:**
* [SE-0506](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0506-advanced-observation-tracking.md) Advanced Observation Tracking - `@Observable` types automatically track when their properties change. However, advanced use cases like developing middleware infrastructure or widgeting systems require more control and features. This proposal adds options to the existing withObservationTracking to control when/which changes are observed, and a continuous variant that re-observes automatically after coalesced events.
* [SE-0502](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0502-exclude-private-from-memberwise-init.md) Exclude private initialized properties from memberwise initializer -  When you define a struct in Swift, an initializer is automatically generated that takes each property as an argument. Currently, adding a private property with a default value to a struct forces that auto-generated initializer to become private, breaking callers outside the type. This proposal fixes that behavior.