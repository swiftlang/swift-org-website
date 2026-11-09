---
layout: new-layouts/post
published: true
date: 2026-11-06 12:30:00
title: "What's new in Swift: October 2026 Edition"
author: [daveverwer, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

To start things off, our guest contributor shares a timely reminder for anyone relying on CocoaPods:

> Hi, I’m Dave Verwer, co-creator of the [Swift Package Index](https://swiftpackageindex.com/) and now part of a team at Apple working on a public package registry for cross-platform Swift. How developers find, share, and manage dependencies across the entire ecosystem is something we think about a lot.
>
> CocoaPods, a dependency manager for Swift and Objective-C Cocoa projects, has been part of the developer ecosystem since 2011, long before Swift and the Swift Package Manager (SwiftPM) existed. For many people who started developing with the iPhone SDK, it was a first look at what a dependency manager could do. Today, Swift has expanded across platforms, and SwiftPM has become the standard for managing dependencies everywhere Swift runs.
>
> Following a two-year sunset period, the [CocoaPods project will stop accepting new pods and pod versions on December 2nd](https://blog.cocoapods.org/CocoaPods-Specs-Repo/). With that date less than a month away, I wanted to make sure this milestone is on your radar, and to share what it means for your projects. If your project still uses CocoaPods, this change won’t immediately break your builds. All current pods and versions will still be available, just in a read-only state. However, with pod authors no longer able to publish updates, if you haven't switched to SwiftPM yet, now is the time.
>
> Most pods in your dependencies that are still being maintained will already be compatible with SwiftPM, and the easiest way to check is to look for them on [Swift Package Index](https://swiftpackageindex.com). Every package in the index is a SwiftPM package, and if you find any incompatible pods, you can search for an alternative so you don’t leave yourself with unmaintained dependencies.
>
> I'd like to extend a personal thank you to everyone who worked on CocoaPods for creating and maintaining it for the last fifteen years. Their work shaped how the community shares code, and it helped lay the groundwork for the modern, cross-platform package ecosystem Swift has today. I also want to express my admiration for how the team managed this sunset and communicated the transition so clearly.

Now on to other news about Swift:

## Videos to watch
* Tim Condon's ACCU 2026 talk, [Incrementally Migrating C++ to a Memory Safe Language with Swift](https://www.youtube.com/watch?v=LMQ21X6_2FQ), shows how Swift's C++ interoperability lets you adopt memory safety incrementally, without rewriting everything at once.
* [Building Android App with Swift: First-Hand Experience](https://www.youtube.com/watch?v=AibwYt3esbk) is a conversation with Pierluigi Cifani, who describes how his team shares business logic and ViewModels between iOS and Android, with native UI on each and Skip bridging the two, in apps like Polymarket.
* Want to build Minecraft mods in Swift? A recent iOSDC Japan lightning talk, [Creating a Minecraft Java mod with Swift](https://www.youtube.com/watch?v=r_A44OiLASw), shows how, using swift-java to interoperate with Minecraft Java Edition. The speaker's [blog post](https://note.com/1mash0/n/n107a49ec76a3) has the slides and more demo videos. The talk is in Japanese, with an auto-dubbed English track available on YouTube.

## Community highlights
* Did you know `Optional` has a `take()` method? John Sundell's [Interesting ways of using Swift optionals](https://www.swiftbysundell.com/articles/interesting-ways-of-using-swift-optionals/) goes beyond `if let`, with `take()`, switching directly on optional enums, and a small `isNil(or:)` helper that works with key paths.
* What happens when you let the compiler check your whole website? Sindre Sorhus [rebuilt his site in Swift](https://sindresorhus.com/blog/swift-website), moving off Astro so that broken links and bad metadata become build errors.
* Two server-side frameworks, one team's experience. [Don't Underestimate Swift](https://wearecommunity.io/communities/mobilepeople/articles/8881) shares what engineers at EPAM learned building backends with Hummingbird and Vapor, and how those services compared against FastAPI and Node.js.
* A [preview of Embedded Swift support in Swift Testing](https://forums.swift.org/t/preview-embedded-swift-support-in-swift-testing/90281) shows nearly the whole API, including `@Test`, `#expect()`, and custom traits, running in Embedded Swift. It has been tried on WASI in Safari, a Raspberry Pi Pico 2, a Playdate, and a Game Boy Advance SP.

## New package releases
* [Swift Kafka Client](https://github.com/swift-server/swift-kafka-client/releases/tag/1.0.0) has reached 1.0.0. The client for Apache Kafka, the event streaming platform, is built on librdkafka and works with structured concurrency, with built-in metrics through swift-metrics and static Linux builds.
* Robotics meets Swift. [swift-ros2](https://github.com/swift-ros2/swift-ros2) is a native client library for ROS 2, the robotics framework. It runs on Apple platforms, Linux, Windows, and Android, and version 3.1.0 recently added a topic graph API for discovering what's available on a robot network.
* [Perfect-NIO](https://github.com/PerfectlySoft/Perfect-NIO), the HTTP layer of the Perfect server framework, has been rewritten on SwiftNIO and Swift 6 concurrency. Version 0.1.0 uses async, `@Sendable` route handlers, and 0.2.0 adds WebSocket message size limits.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
- [SE-0559](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0559-unicode-bidi-class.md) Add `bidiClass` to `Unicode.Scalar.Properties` - If your code lays out or transforms text that mixes right-to-left and left-to-right scripts, you often need to know how specific characters behave. This proposal adds `bidiClass` to `Unicode.Scalar.Properties`, so you can look up a character's bidirectional class in Swift without needing to bridge to external libraries like ICU.
- [SE-0560](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0560-swiftpm-build-configuration-conditional-target-dependencies.md) Build configuration conditionals for target dependencies - This proposal would let you conditionally include SwiftPM dependencies based on whether you're building for debug or release. By adding a new `configuration` condition, you could link a debug menu only into your debug builds, or a crash reporter only into your release builds.

**Recently accepted:**
- [SE-0552](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0552-float-pi-rounding.md) Rounding of `Float.pi` - This proposal removes the requirement that `FloatingPoint.pi` round toward zero, so `Float.pi` can return the best approximation instead. This brings Swift in line with the IEEE 754 working group's guidance that implementations should return the best approximation they can.
- [SE-0545](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0545-build-debugging-options.md) SwiftPM Build Performance Debugging Options - If you're trying to speed up your package's build times, this proposal adds two new debugging options to help you understand where that time is going. It introduces trace event files that can be viewed in tools like Perfetto, and task backtraces that describe the sequence of events that caused each task to run. Both are available in nightly toolchains as experimental flags.
- [SE-0553](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0553-task-identity.md) Task Identity - This proposal introduces `Task.currentID`, a low-overhead, process-unique identifier for the current task. It's designed for performance-sensitive instrumentation, like structured logging and tracing, giving you a way to identify tasks without the overhead of `withUnsafeCurrentTask`.
- [SE-0551](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0551-span-of-one.md) `Span` over a single value - This proposal adds new initializers like `Span(ofOne:)` and `MutableSpan(ofOne:)` that let you borrow a single value in place. It provides a safe alternative to `withUnsafePointer(to:)`, and avoids unnecessary copying when passing single values to `Span`-taking APIs.

**Recently accepted with modifications:**
- [SE-0547](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0547-swiftpm-compilation-caching.md) SwiftPM Support for Compilation Caching - To speed up workflows that don't benefit from traditional incremental builds, like switching branches or running clean CI builds, this proposal lets SwiftPM configure a content-addressable compilation cache. You'll be able to manage this cache globally, per package, or per build using the new `swift package build-cache configure` command.
