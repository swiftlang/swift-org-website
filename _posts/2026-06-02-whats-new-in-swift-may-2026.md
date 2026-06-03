---
layout: new-layouts/post
published: true
date: 2026-06-03 15:30:00
title: "What's new in Swift: May 2026 Edition"
author: [davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community. This month, we're featuring the many local meetup groups that are showcasing great Swift content:

> As I’ve contributed to these digest posts, I’ve been keen to follow the many local meetup groups and conferences featuring Swift content around the world. Some of these groups predate even Swift itself, while others are much newer. I wanted to highlight a few of them and encourage others to follow in their footsteps.
> 
> Several meetup groups have YouTube channels and have shared videos from their events that you can tune into remotely. In May the SF Swift meetup hosted a talk by Dan Federman, [Agentify Your Swift Repo](https://vimeo.com/1195418169?autoplay=1&muted=1&stream_id=Y2xpcHN8MjM2NTA1NDQ2fGlkOmRlc2N8W10%3D) which covers building an agent for CI and review feedback. [Swift Barcelona](https://www.youtube.com/@SwiftBarcelona) has a dedicated YouTube presence, while some groups like the new MLX India meetup have playlists of their events, which include an [MLX Swift talk about using MLX Swift in iOS apps](https://www.youtube.com/watch?v=EIwP73vV2a0&list=PLW4mt_1SMN_kQiK-HaZIoe-p5SNg8ocGU&index=3) that's worth checking out. And there’s even a community-organized [Swift Community Meetups YouTube channel](https://www.youtube.com/@SwiftCommunityMeetups) which hosts meetups online and is home to a series of cross-platform Swift talks.
> 
> It’s great to see the many ways developers are using Swift, and I’m encouraged by these groups:
> 
> * Local community: they’re building local connections among Swift developers and organizations.
> * Variety of talks: I appreciate how meetups sometimes feature works in progress, which conference talks often lack. Having spaces to explore and get feedback on ideas and to improve and to learn is really valuable.
> 
> I want to encourage more folks to not only get involved in their local Swift meetup but also to get in touch if your local group starts publishing content, and videos, I’ll definitely follow!
> 
> &mdash; Dave Lester

Now on to other news about Swift:

## Videos to watch
* Interested in using Swift for backend server development? Mohammad Azam recorded an [Introduction to Hummingbird](https://www.youtube.com/watch?v=BKMaXnSK5Kc) livestream focused on the Hummingbird web framework written in Swift. The video walks through installation and basics of developing with it.
* [Meet the Temporal Swift SDK](https://www.youtube.com/watch?v=LaU7z77cc2s&t=24s), from Replay 2026, introduces the SDK that brings Temporal's durable workflows (long-running processes that survive crashes, retries, and restarts without losing state) to Swift. The SDK recently reached its 1.0.0 release.
* Sébastien Stormacq shares a great introduction to what's possible with AWS Lambda and Swift, presenting [Swift, Server-side, & Serverless](https://www.youtube.com/watch?v=qcp99G6JGIU) on the DevStandup YouTube channel.

## Community highlights
* Swift and WebAssembly continues to be an exciting part of the project, with regular activity shared on the Swift forums, including the most recent [Swift for Wasm May 2026 Updates](https://forums.swift.org/t/swift-for-wasm-may-2026-updates/86981). And if you missed it, check out the new [blog post by Goodnotes](/blog/bringing-goodnotes-to-web-with-swift/) about how they brought Goodnotes to the web with Swift and WebAssembly.
* The [2026 Swift Mentorship Program](https://www.swift.org/mentorship/) was announced, and there's still time until June 15, 2026, to complete the interest survey to be a mentee. Working on contributions is a great way to learn. And on that note, [three Swift projects were accepted for GSoC 2026](https://forums.swift.org/t/gsoc-2026-accepted-projects/86398). 
* [Training an LLM in Swift, Part 1](https://www.cocoawithlove.com/blog/matrix-multiplications-swift.html) - Matt Gallagher takes handwritten matrix multiplication for a Swift port of llm.c from 2.8 Gflop/s to 1.1 Tflop/s — a 382x speedup — using Swift 6.2's `MutableSpan` and `InlineArray`, `Relaxed.multiplyAdd` from Swift Numerics, `DispatchQueue.concurrentPerform`, and finally AMX and Metal. A thorough tour of performance optimization in modern Swift.
* Members of the community using and contributing to the VS Code Swift Extension met in May during the [Swift Extension Community Office Hours](https://forums.swift.org/t/swift-extension-community-office-hours-agenda-may-21-2026/86279/2), featuring demonstrations of using Kiro and more.

## New package releases
* You can build an AI agent in Swift? The [Swift Bedrock Library](https://github.com/build-on-aws/swift-bedrock-library) gives you a native library for Amazon Bedrock foundation models.
* [SwiftOSC](https://github.com/orchetect/swift-osc) is an Open Sound Control (OSC) toolkit written in Swift which recently became cross-platform, now supporting Apple platforms, Linux, and Android. It's music to our ears! Steffan Andrews, who developed SwiftOSC, has also released other music-related Swift packages including [SwiftMIDI](https://github.com/orchetect/swift-midi) and [SwiftTimecode](https://github.com/orchetect/swift-timecode).
* Ordo One shipped version 1.33.0 of [Benchmark](https://github.com/ordo-one/benchmark), a package for creating sophisticated Swift performance benchmarks for a [wide variety of metrics](https://swiftpackageindex.com/ordo-one/benchmark/1.33.0/documentation/benchmark/metrics).

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [SE-0532](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0532-optional-noncopyable-improvements.md) `Optional` noncopyable improvements and generalizations - Swift's `Optional` can wrap noncopyable types, but unwrapping with `if let` consumes the optional, leaving it unusable afterward. This proposal adds `borrow()` and `mutate()` to `Optional`, returning `Ref<Wrapped>?` and `MutableRef<Wrapped>?` to inspect or modify the payload without consuming it, and generalizes `map`, `flatMap`, and `unsafelyUnwrapped` to support noncopyable wrapped types.

**Recently accepted:**
* [SE-0528](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0528-noncopyable-continuation.md) `Continuation` Safe and Performant Async Continuations - When bridging callback-based APIs to Swift's structured concurrency, developers today must choose between `UnsafeContinuation`, where misuse is silent and undefined, and `CheckedContinuation`, which catches mistakes at the cost of allocation and atomic operations. This proposal adds `Continuation<Success, Failure>`, a `~Copyable` type that makes double-resume a compile-time error and a missing resume a runtime trap, with no overhead on the fast path.
* [SE-0519](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0519-ref-mutableref-types.md) `Ref` and `MutableRef` types for safe, first-class references - Storing a reference to part of a data structure in Swift today requires either a class, which adds heap allocation and reference-counting overhead, or `UnsafePointer`, which is unsafe and requires extreme care to use properly. This proposal adds `Ref<T>` and `MutableRef<T>` to the standard library: safe types that hold shared and exclusive references to a value, usable as local variables, struct members, and generic type parameters.
* [ST-0024](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0024-per-test-case-repetitions.md) Test case repetition - Swift Testing can repeat tests for a set number of iterations, or until a specific failure/success condition is reached, which is useful for tracking down flaky failures. Currently, if any single test case triggers the condition, all tests in the target are re-run, even ones that passed. This proposal changes repetition to apply per test case and adds `--maximum-repetitions` and `--repeat-until` flags to `swift test`.