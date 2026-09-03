---
layout: new-layouts/post
published: true
date: 2026-09-03 13:30
title: "What's new in Swift: August 2026 Edition"
author: [sliemeobn, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

Here's an update on efforts to bring Swift to the web:

> Hi, Simon here! I am the creator of the [elementary-swift](https://github.com/elementary-swift) project, a collection of packages born from a simple wish: I want to build web UIs in Swift and ultimately help Swift become a first-class choice for the web.
> 
> This journey began after I started using server-side Swift for backend services. The web frontend, however, still lived in a separate ecosystem, and I really wanted it to feel as ergonomic, safe, and efficient as the Swift I was writing everywhere else.
> 
> That led to the creation of [Elementary](https://github.com/elementary-swift/elementary): a modern and efficient HTML rendering library with a familiar declarative API, built for the web. It integrates easily with frameworks like Vapor and Hummingbird, and has become a practical option for server-rendered web UIs.
> 
> Around that same time, years of community work in the [swift-wasm](https://swiftwasm.org/) project made compiling Swift to WebAssembly increasingly viable, while Embedded Swift was taking its first experimental steps. This made me wonder: "How hard can it be to use Embedded Swift and build a state-driven web UI framework that produces tiny WebAssembly binaries?" Turns out: quite hard, actually!
> 
> But it was too late. Despite my better judgment, I was in the middle of creating what is now known as [ElementaryUI](https://elementary.codes/). Where Elementary renders HTML on the server, ElementaryUI runs in the browser itself. You can watch my [talk at Swift@FOSDEM 2026](https://www.youtube.com/watch?v=OmQ881sOTIc) if you want to know more about the why, what, and how.
> 
> To showcase where the project is heading, I recently posted a small [Full-Stack Swift on Cloudflare demo](https://forums.swift.org/t/edge-of-tomorrow-full-stack-swift-on-both-sides-of-fetch/89175). It features Swift in the browser communicating with a Swift backend on an edge worker through shared message types. I hope it gives people a concrete sense of how much the core technologies and the surrounding tooling have advanced.
> 
> ElementaryUI is still young, with plenty left to build. Visit [elementary.codes](https://elementary.codes/) to try it, share feedback, contribute, or sponsor its development. I am convinced that if we just want it badly enough, we can make Swift a first-class choice for the web!

Now on to other news about Swift:

## Videos to watch
* Saleem Abdulrasool joined the Empower Apps podcast to discuss [Swift on Windows](https://www.youtube.com/watch?v=ZIC-Q1B7FHM), server-side Swift, SwiftWin32, Swift's C++ interop, and how to get started.
* Building memory-safe software? [Write security-sensitive code in Swift](https://www.youtube.com/watch?v=nBuUinlZuow) covers how Swift guarantees safety across bounds, lifetimes, types, initialization, and concurrency, with primitives like `Span` and non-copyable types, plus how to audit `unsafe` code with Strict Memory Safety and incrementally migrate existing C modules.
* Two short videos about running Embedded Swift on Raspberry Pi Pico: a video on getting started on macOS called [Let it blink!](https://www.youtube.com/watch?v=p2e_RPgMo5g) and [Fun with traffic lights in 60 seconds](https://www.youtube.com/watch?v=Ht_gejbvAHA).

## Community highlights
* [Building scalable backend apps in Swift](https://theswiftdev.com/building-scalable-backend-apps-in-swift/) shares an approach to structuring server-side Swift codebases, separating business logic from database and framework details so the code stays easier to test and change over time.
* The Swift Package Index blog explains [what a package registry actually is](https://swiftpackageindex.com/blog/what-is-a-package-registry), how it fits alongside SwiftPM and package indexes, and walks through an example of switching a dependency managed from Git to a Swift registry.
* [Embedded Swift Improvements Coming in Swift 6.4](/blog/embedded-swift-improvements-coming-in-swift-6.4/) rounds up what's ahead for Swift on microcontrollers and other constrained environments.
* The Browser Company's [Swift on Windows: A year of refinement](https://speakinginswift.substack.com/p/swift-on-windows-a-year-of-refinement) reflects on a year of work making Swift on Windows more predictable.

## New package releases
* Write an interface once with [SwiftTUI](https://swifttui.sh) using a declarative, state-driven syntax, then ship it as a terminal app, as a native macOS or iOS app, as an Android app, or as a WASI build for the browser.
* Tired of hand-writing `RawRepresentable` and `LosslessStringConvertible` conformances? [lexic](https://github.com/ordo-one/lexic) generates them for you via macros, and runs the same on Linux as on Apple platforms.
* [StructuredQueries](https://github.com/pointfreeco/swift-structured-queries), Point-Free's SQLite query builder, now has fully type-safe support for JSON and JSONB columns, including a `json_each` table function, so nested data can be queried and updated by key path without leaving Swift's type system.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [ST-0029](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0029-add-issue-metadata-event-stream.md) Include additional issue metadata in event stream - Today, Swift Testing's JSON event stream reports only bare-bones details when an issue occurs, making it hard to tell a thrown error apart from a manual `Issue.record` call. This proposal adds structured fields, including `error`, `confirmationMiscount`, `exceededTimeLimit`, and `expression`, so tools like Xcode and VS Code can show richer, more specific failure information.

**Recently accepted:**
* [SE-0544](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0544-mutate-or-consume-in-deinit.md) Mutation and consumption in non-copyable type `deinit`s - Non-copyable types that manage a resource, like a file handle or buffer, often need to run the same cleanup logic in their `deinit` that they use elsewhere, but until now `self` inside a `deinit` could only be borrowed, not mutated or consumed. This proposal lets a `deinit` mutate or consume its own stored properties directly, so existing cleanup methods can be reused instead of duplicated.
* [ST-0028](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0028-revise-attachment-encodable-interfaces.md) Revise Swift Testing's `Attachment`/`Encodable` interop - Swift Testing lets you attach extra data, like a screenshot or JSON snapshot, to a test for inspecting after a failure, but attaching custom types previously required extra setup code and offered no way to choose the encoding format. This proposal adds new `Attachment` initializers that let you attach `Encodable` or `NSSecureCoding` values directly, picking the format or supplying your own encoder.

**Recently accepted with modifications:**
* [SE-0536](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0536-registry-search.md) Package Registry Search - To use a package from a registry today, you already have to know its exact identifier, since there's no standard way to discover packages within a registry the way other package ecosystems allow. This proposal adds an optional `/search` endpoint to the registry specification and a `swift package-registry search` subcommand, letting you find packages by name, scope, author, and other criteria, with support for qualifiers like `author:"Mona Lisa Octocat"` and searches that span every configured registry at once.
* [SE-0516](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0516-borrowing-sequence.md) `Iterable` - Looping over a collection in Swift traditionally means copying out one element at a time, which doesn't work for newer types that can't be copied, like `Span` and `InlineArray`. This proposal introduces `Iterable`, a new way to loop over data without copying, and was renamed from `BorrowingSequence` and given support for typed throws before acceptance.
* [ST-0026](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0026-task-local-test-trait.md) TaskLocal test trait - Task-local values are like settings, such as a feature flag, that apply only within a single task. Overriding one in a test previously meant writing a custom trait from scratch, but this proposal adds a `.taskLocal(_:_:)` trait that does it in one line, like `@Suite(.taskLocal(FeatureFlags.$isEnabled, true))`.