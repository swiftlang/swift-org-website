---
layout: new-layouts/post
published: true
date: 2026-11-05 12:30:00
title: "What's new in Swift: October 2026 Edition"
author: [daveverwer, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

> TODO: add @daveverwer's guest contribution

Now on to other news about Swift:

## Videos to watch
* Tim Condon's ACCU 2026 talk, [Incrementally Migrating C++ to a Memory Safe Language with Swift](https://www.youtube.com/watch?v=LMQ21X6_2FQ) shows how Swift's C++ interoperability lets you adopt memory safety incrementally, without rewriting everything at once.
* [Building Android App with Swift: First-Hand Experience](https://www.youtube.com/watch?v=AibwYt3esbk) is a conversation with Pierluigi Cifani, who describes how his team shares business logic and ViewModels between iOS and Android, with native UI on each and Skip bridging the two, in apps like Polymarket.
* Want to build Minecraft mods in Swift? A recent iOSDC Japan lightning talk, [Creating a Minecraft Java mod with Swift](https://www.youtube.com/watch?v=r_A44OiLASw), shows how, using swift-java to interoperate with Minecraft Java Edition. The speaker's [blog post](https://note.com/1mash0/n/n107a49ec76a3) has the slides and more demo videos. The talk is in Japanese, with an auto-dubbed English track available on YouTube.

## Community highlights
* Did you know `Optional` has a `take()` method? John Sundell's [Interesting ways of using Swift optionals](https://www.swiftbysundell.com/articles/interesting-ways-of-using-swift-optionals/) goes beyond `if let`, with `take()`, switching directly on optional enums, and a small `isNil(or:)` helper that works with key paths.
* What happens when you let the compiler check your whole website? Sindre Sorhus [rebuilt his site in Swift](https://sindresorhus.com/blog/swift-website), moving off Astro so that broken links and bad metadata become build errors.
* Two server-side frameworks, one team's experience. [Don't Underestimate Swift](https://wearecommunity.io/communities/mobilepeople/articles/8881) shares what engineers at EPAM learned building backends with Hummingbird and Vapor, and how those services compared against FastAPI and Node.js.
* A [preview of Embedded Swift support in Swift Testing](https://forums.swift.org/t/preview-embedded-swift-support-in-swift-testing/90281) shows nearly the whole API, including `@Test`, `#expect()`, and custom traits, running in Embedded Swift. It has been tried on WASI in Safari, a Raspberry Pi Pico 2, a Playdate, and a Game Boy Advance SP.

## New package releases
* [Swift Kafka Client](https://github.com/swift-server/swift-kafka-client/releases/tag/1.0.0) has reached 1.0.0. The client for Apache Kafka, the event streaming platform, is built on librdkafka and works with structured concurrency, with built-in metrics through swift-metrics and static Linux builds.
* Robotics meets Swift. [swift-ros2](https://github.com/swift-ros2/swift-ros2) is a native client library for ROS 2, the robotics framework. It runs on Apple platforms, Linux, Windows, and Android, and version 3.1.0 adds a topic graph API for discovering what's available on a robot network.
* [Perfect-NIO](https://github.com/PerfectlySoft/Perfect-NIO), the HTTP layer of the Perfect server framework, has been rewritten on SwiftNIO and Swift 6 concurrency. Version 0.1.0 uses async, `@Sendable` route handlers, and 0.2.0 adds WebSocket message size limits.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
- [SE-0559](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0559-unicode-bidi-class.md) Add `bidiClass` to `Unicode.Scalar.Properties` - `Unicode.Scalar.Properties` exposes many Unicode properties but not `Bidi_Class`, which drives the Unicode Bidirectional Algorithm. Code that lays out or transforms bidirectional text, such as deciding whether a string needs isolate controls before being embedded in text of the opposite direction, currently has to reach for ICU. This proposal adds a `bidiClass` property and a `Unicode.BidiClass` type.
- [SE-0560](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0560-swiftpm-build-configuration-conditional-target-dependencies.md) Build configuration conditionals for target dependencies - Package manifests can already condition build settings on build configuration, but not target dependencies. This proposal adds a `configuration` condition so a debug menu can be linked only into debug builds, or a crash reporter only into release builds, completing the part of SE-0273 that was never implemented.

**Recently accepted:**
- [SE-0552](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0552-float-pi-rounding.md) Rounding of `Float.pi` - `FloatingPoint.pi` is no longer required to round toward zero, so `Float.pi` becomes the nearest representable value, matching where the IEEE 754 working group has landed.
- [SE-0545](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0545-build-debugging-options.md) SwiftPM Build Performance Debugging Options - Adds options to help package authors understand where build time goes, including a trace events file and task backtraces. Available in nightly snapshots via experimental flags.
- [SE-0553](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0553-task-identity.md) Task Identity - Adds `Task.currentID`, a cheap, process-unique identifier for the current task that costs about as much as a thread-local read. It is aimed at always-on instrumentation such as tracing and structured logging, where `withUnsafeCurrentTask` is too expensive on the hot path. The acceptance asked the authors to document intended use and pitfalls, which they have done.
- [SE-0551](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0551-span-of-one.md) `Span` over a single value - Adds initializers such as `Span(ofOne:)` and `MutableSpan(ofOne:)` that borrow a single value in place, acting as safe versions of `withUnsafePointer(to:)` and friends, including for noncopyable values.

**Recently accepted with modifications:**
- [SE-0547](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0547-swiftpm-compilation-caching.md) SwiftPM Support for Compilation Caching - Lets SwiftPM configure the compiler's content-addressable compilation cache globally, per package, or per build with `swift package build-cache configure`. It targets workflows that don't benefit from incremental builds, like switching branches, building across git worktrees, and clean CI builds. It was accepted with remote caching carved out into a later proposal.