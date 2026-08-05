---
layout: new-layouts/post
published: true
date: 2026-08-06 12:00
title: "What's new in Swift: July 2026 Edition"
author: [alexandersandberg, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

Swift is built by contributors working on far more than the language and compiler. Alex Sandberg reflects on what that kind of contribution looks like, and why there's a place for you too:

> Hi, I'm Alex. Four years ago I joined the Swift Website Workgroup to help care for the website you're likely reading this on. I was still fairly new to the Swift community then, but I wanted to get involved somehow and make a difference.
> 
> Contributing to Swift sounds like it should involve working on the compiler or writing and reviewing language evolution proposals, but there's a lot going on around the language itself too. What I actually spent my time doing was helping improve the site's content and navigation, taking part in the big redesign, writing release blog posts, reviewing pull requests, and answering issues and forum posts. All of it is work anyone can learn to do, and all of it ends up in front of everyone who comes to Swift.org—which made even the smallest fixes feel worth doing.
> 
> The Website Workgroup happened to be my way in, but there are groups like it across the project—server, testing, Windows, Android, and more—each a handful of people looking after their part of the ecosystem. Whatever you're good at or curious about, there's probably a corner of Swift that could use your help. The [community page](https://www.swift.org/community/) is a good place to start looking, and the people you'll meet are some of the friendliest I've come across in open source.
> 
> After four years, [I've stepped away to focus on other things in life](https://alexandersandberg.com/articles/leaving-the-swift-website-workgroup/). Thank you to everyone I got to work with over these years! I'm leaving the workgroup, but not the community, and I'll still be around helping push Swift forward where I can.

For more information about workgroups, the [How we work page](https://www.swift.org/community/how-we-work/) lists all workgroups. And on the [Swift forums](https://forums.swift.org) you'll often see workgroups sharing open meetings if you're looking to get involved!

Now on to other news about Swift:

## Videos to watch
* [Balancing High and Low-Level Programming in Swift](https://www.youtube.com/watch?v=MJBagt6Zp2g), presented by John McCall at PLDI 2026, digs into the ongoing work to bring explicit ownership and lifetime features to Swift for systems programming, and the tricky balance of fitting them into a language built around simple, low-friction application development without breaking source compatibility or ABI stability.
* Speaking of low-level Swift: [I Built a Timer for the Playdate in Swift](https://www.youtube.com/watch?v=Fs27ooAUbzk) and [I Built a 3D Renderer for the Playdate (in Swift)](https://www.youtube.com/watch?v=-uo-c9tzYnE) are a fun pair of videos on building for the handheld game console in Swift.
* Melbourne CocoaHeads has been uploading a great back catalog of past event talks to their YouTube channel, including [Christian Mitteldorf's 2023 talk on running Swift on the server](https://www.youtube.com/watch?v=V0G6hOwJPhw).

## Recent project changes

* **Google Summer of Code contributions are underway**: Ege Kaya is building a Task Registry for the Swift Concurrency runtime ([PR #90547](https://github.com/swiftlang/swift/pull/90547)), Filip Sakellariou is contributing to swift-syntax ([PR #3378](https://github.com/swiftlang/swift-syntax/pull/3378), [PR #3390](https://github.com/swiftlang/swift-syntax/pull/3390)), and Padmashree S S is working in sourcekit-lsp ([PR #2698](https://github.com/swiftlang/sourcekit-lsp/pull/2698), [PR #2729](https://github.com/swiftlang/sourcekit-lsp/pull/2729)).
* **Task Stealers, a new primitive in Swift Concurrency's runtime, [merged this month](https://github.com/swiftlang/swift/pull/86082)** after generating the liveliest discussion of any PR in July. They change how work gets distributed across the cooperative thread pool, an under-the-hood change worth watching if you write concurrency-heavy server or app code.
* **SwiftPM landed a [reference implementation](https://github.com/swiftlang/swift-package-manager/pull/10255) of the package registry service**, along with [basic auth support](https://github.com/swiftlang/swift-package-manager/pull/10258), a solid starting point if you're exploring self-hosting a registry.
* **Small but welcome fixes landed across tooling**: the VS Code extension now [fails loudly when a Swift installation is broken](https://github.com/swiftlang/vscode-swift/pull/2080) and gained a [clean build folder command](https://github.com/swiftlang/vscode-swift/pull/2280), while Swift Testing's event stream gained an ABI.Context API that [produces human-readable output](https://github.com/swiftlang/swift-testing/pull/1759) for CI tooling and dashboards.

## New package releases
* Need to tokenize text fast? [swift-gigatoken](https://github.com/1amageek/swift-gigatoken) is a zero-copy tokenizer hitting up to 670 MB/s, inspired by Marcel Roed's gigatoken, with NEON/CRC32 support and compatibility across WebAssembly and Embedded Swift.
* [any-error-swift](https://github.com/MFB-Technologies-Inc/any-error-swift) takes a different approach to error handling, offering a concrete, value-semantic, `Hashable` type that erases any Swift error, no Foundation required, and works on every platform Swift runs on.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals recently accepted for a future Swift release.

**Recently accepted:**
* [ST-0025](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0025-tag-based-test-execution-filtering.md) Tag-based Test Execution Filtering - Swift Testing lets you annotate tests with named tags, and separately lets you include or exclude tests by regex using the `--filter` and `--skip` options, but there's no way to combine the two and filter by tag. This proposal adds a `tag:` prefix to those options, so you can run commands like `swift test --skip tag:uiTest` to selectively run or skip tests based on their tags rather than relying on a consistent naming scheme.
* [SE-0513](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0513-commandline-executablepath.md) API to get the path to the current executable - There’s currently no portable, reliable way to get the path to the currently running executable in Swift. This proposal adds `CommandLine.executablePath`, a new property in the standard library that provides a consistent way to get this value across all platforms Swift supports.

**Recently accepted with modifications:**
* [SE-0526](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0526-deadline.md) `withDeadline` - Asynchronous operations in Swift can run indefinitely, and implementing time limits manually using task groups and clock sleep operations is verbose and error-prone. This proposal adds withDeadline, a function that executes an async operation with a composable absolute time limit specified as a clock instant, canceling the operation if it hasn’t completed in time. It also allows multiple nested operations to share the same deadline, avoiding the drift that accumulates when relative durations are passed through call layers.