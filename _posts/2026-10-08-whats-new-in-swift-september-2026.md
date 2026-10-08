---
layout: new-layouts/post
published: true
date: 2026-10-08 13:30:00
title: "What's new in Swift: September 2026 Edition"
author: [0xTim, davelester]
category: "Digest"
---

Welcome to "What's new in Swift," a curated digest of releases, videos, and discussions in the Swift project and community.

The [Vapor](https://www.vapor.codes) web framework recently turned ten and celebrated with Vapor Week! We've invited one of the authors of Vapor as this month's guest contributor:

> Hi, I'm Tim from the Vapor Core Team! 10 years ago, in September, Vapor 1.0 was released, and over the years Vapor has matured into a comprehensive framework for building backends and APIs in Swift.
>
> On the anniversary we released the [first beta of Vapor 5](https://blog.vapor.codes/posts/vapor-5-beta/), the next major version of Vapor, which is a complete rewrite, removing 6 years of tech debt, adding full structured concurrency support, and (finally!) saying goodbye to `EventLoopFuture`s.
>
> From the very beginning, Vapor's goals haven't changed: an expressive, easy-to-use and powerful framework for building server applications in Swift. With Vapor 5 we can make use of the new Swift HTTP Server to handle the actual HTTP parts and concentrate on being a great web framework, using the latest Swift features where they make sense.
>
> It's amazing to see the range of people using Vapor, from indie developers to large companies. You can find the full story, including our updated, localised and more accessible docs, in [Vapor Week](https://blog.vapor.codes/posts/ten-years-of-vapor/).
>
> If you're curious about server-side Swift, give the Vapor 5 beta a try and let us know what you think!

Now on to other news about Swift:

## Swift 6.4 release
In September, the project's headline story was the [release of Swift 6.4](/blog/swift-6.4-released/), which brings deeper interoperability, stronger platform support, and easier everyday code.

In the weeks leading up to the release we also shared two deep dives into some features it includes:

* [Module Tracking in Swift Debug Info](/blog/module-tracking-in-debug-info/) explains how precise, path-based module imports make LLDB lookups more reliable and shrink dSYMs and binaries. Build-system maintainers (Bazel, Buck, CMake) will want to replace `-modulewrap`/`-add_ast_path` with `-debug-module-path`.
* [Embedded Swift Improvements Coming in Swift 6.4](/blog/embedded-swift-improvements-coming-in-swift-6.4/) rounds up what's ahead for Swift on microcontrollers and other constrained environments.

## Community highlights
* Solbach Leads [shared their Swift adoption story](https://itnext.io/from-spring-boot-to-swift-the-business-logic-was-the-cheap-part-2068281d7f0b), including how they migrated a production AI data pipeline from Kotlin and Spring Boot to Swift and Vapor. Six months in, it handles over 52 million tasks a month.
* Curious what it takes to run Swift with no OS at all? [A minimal kernel in Swift running in QEMU](https://carette.xyz/posts/minimal_swift_kernel_on_qemu/) uses Embedded Swift and the `@c` attribute to boot a kernel that prints a message and echoes typed input.
* [Stop Sleeping: Deterministic Tests for Concurrent Swift Code](https://raska.io/blog/testing-concurrent-code/) shows how to replace `Task.sleep` in tests with test spies, so Swift Testing tests can check timeouts, errors, and cancellation without waiting on the clock.
* The monthly Swift for Wasm update is out. [September 2026 updates](https://forums.swift.org/t/swift-for-wasm-september-2026-updates/89836) highlights experimental threads support in the Wasm Swift SDK (currently in nightly snapshots), JavaScriptKit's new uWASI option, and custom elements in ElementaryUI.

## New package releases
* [WasmKit](https://github.com/swiftwasm/WasmKit) is a WebAssembly runtime written in Swift. The [0.4 release](https://katei.dev/blog/2026/09/18/wasmkit-0-4-0/) doubles interpreter speed, and it can now run on ESP32-C6 microcontrollers and the Playdate.
* [Swift AWS Lambda Runtime](https://github.com/awslabs/swift-aws-lambda-runtime) 3.0 was released, adding SwiftPM plugins for init, build, and deploy. With build you can now package as a zip or OCI image, and choose how you compile: with Docker, Apple's `container`, or cross-compile using the Swift Static Linux SDK.

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
- [SE-0554](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0554-deployment-target-conditional-compilation.md) Deployment target conditional compilation - Swift can test whether an API is available at runtime with `if #available(...)`, but that cannot select between imports, type aliases, conformances, stored properties, or complete declarations; those choices have to be made while the module is being compiled. This proposal adds `#if deploymentTargetAtLeast(...)`, so a library can compile different source for different minimum OS versions without maintaining a separate build-system flag.

**Recently accepted:**
- [SE-0546](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0546-memberwise-init-extensions.md) Same-file memberwise initializer extensions - When a struct's memberwise initializer is meant to be `public`, it is only possible to define it in its base declaration; defining it in an extension is a redeclaration error, and for macro-generated structs there is no way to publicize their memberwise initializers. This proposal allows memberwise initializers, and default `init()`, to be defined in same-file extensions.
- [SE-0548](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0548-resign-remote-id.md) `resignRemoteID` for remote distributed actor references - Today, a `DistributedActorSystem` observes the lifecycle of local distributed actors through `assignID(_:)` / `resignID(_:)`, and participates in creating remote references through `resolve(id:as:)`, but there is no way to observe when a remote reference has been deinitialized. This proposal adds `resignRemoteID(_:)`, invoked when a remote distributed actor proxy is deinitialized, so systems can keep connections alive only while at least one remote reference still uses them.
- [ST-0029](https://github.com/swiftlang/swift-evolution/blob/main/proposals/testing/0029-add-issue-metadata-event-stream.md) Include additional issue metadata in event stream - Tools such as Xcode and VS Code consume Swift Testing's JSON event stream, but there isn't enough structured information to distinguish between different kinds of issues, for example a thrown error versus a manual `Issue.record` call. This proposal adds new fields to the issue event type, including error, confirmation miscount, exceeded time limit, and expression, so tools can show richer failure context.

**Recently accepted with modifications:**
- [SE-0540](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0540-default-target-settings.md) Default Target Settings (reviewed as Default Package Settings) - It is very common for Swift packages to use the same settings flags across all their targets, which today means duplicating them per target or mutating `package.targets` after the package has been defined. This proposal lets default settings be defined as part of the Package initializer (`defaultSwiftSettings`, `defaultCSettings`, `defaultCXXSettings`, and `defaultLinkerSettings`), with a `.defaults` placeholder that controls how each target inherits them.