---
layout: new-layouts/post
published: true
date: 2025-10-30 10:00:00
title: "What's new in Swift: October 2025 Edition"
author: [heckj]
category: "Community"
---

# **What's new in Swift: October 2025 Edition**

*Editor Note: This is the first of a new series, Swift Digest, a monthly digest featuring what's new in the Swift project and ecosystem, with insights from community voices. This October edition covers highlights from the Server Side Swift conference, major package releases, and the latest Swift Evolution proposals.*

*Thanks to Joe Heck for sharing his conference experience and insights as our inaugural guest contributor.*

## Guest contributor highlights

>At the beginning of October, I attended the [Server Side Swift conference](https://www.serversideswift.info/), my second year attending. I love that it focuses on using Swift both with and beyond Apple devices. This makes the conference a bit different from others you’ll see talked about by the community.

> The [keynote](https://www.youtube.com/watch?v=jz3hCRSPrdo), by Ben Cohen, talked about language performance and the balancing act of the advances and continued work on the Swift language to enable you to reach for extremely high code performance. Having developed server and infrastructure apps in the past myself, I highly value the combination of the ease of developing in Swift and its impressive safety guarantees while also being able to drive out that “goes brrr” code performance.

>In addition to low-level code performance, the conference had a great talk [Observability in Swift-Side Swift](https://www.youtube.com/watch?v=HSxIFLsoODc) on how to keep an eye on the performance of your service as part of a bigger system. I’ve long been a fan of distributed tracing, and the 1.0 release of [swift-otel](https://github.com/swift-otel/swift-otel) enables server apps to provide logs, metrics, and traces using the [OpenTelemetry](https://opentelemetry.io/) standard to system observability tools. The 1.29.0 release of [async-http-client](https://github.com/swift-server/async-http-client) just makes that process even easier, and I’ll briefly note that the new [Valkey client for Swift](https://github.com/valkey-io/valkey-swift/) also now includes full support for distributed tracing.

- Joe Heck


Joe's conference experience highlights some of the exciting developments we're seeing across the Swift ecosystem. Let's dive into the broader picture of what's been happening in the Swift community this month.


## What’s new in Swift

**Featured community projects**

* [Swift SDK for Android](https://forums.swift.org/t/announcing-the-swift-sdk-for-android/82845) - The Android workgroup [announced in the blog](https://www.swift.org/blog/nightly-swift-sdk-for-android/) a preview release of an SDK supporting Android, and a [dedicated Android platforms category](https://forums.swift.org/c/platform/android/115) in the Forums.
* The [Swift Extension of VS Code](https://docs.swift.org/vscode/documentation/userdocs/) - Useful for developing server apps in Swift, the Swift Extension of VS Code is rapidly evolving and [just released v2.12.0 featuring swiftly integration and a new walkthrough for first-time users](https://forums.swift.org/t/vs-code-swift-extension-2-12-0-release-now-available/82947).
* [Swift Build and Packaging Workgroup](https://www.swift.org/build-and-packaging-workgroup/) - A new workgroup under the [ecosystem steering group](https://www.swift.org/ecosystem-steering-group/) with a focus on building, composing, and sharing Swift packages.
* [Swift Package Manager documentation](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) - The documentation for the Package Manager is refreshed and now published, including the API references, on docs.swift.org.


**Talks and Presentations**
Talks from the Server Side Swift conference, hosted in London at the beginning of October, are now being published online. The following are two talks that stood out to me, which I'd like to share to encourage you to investigate the [Service Side Swift playlist of talks](https://youtu.be/eqeDPIK2Msc).

* [Unlock Generative AI for Swift Server-Side Development](https://www.youtube.com/watch?v=eDkbXNleMnA) - Mona walked through using a library she helped create that uses large language models with her server side code.
* [Building Networking Libraries with Span and Concurrency](https://youtu.be/bVCY2m8ytXM) - Joannis talks about how Swift concurrency can support network libraries for heavily concurrent data flows and the new Span feature from Swift 6.2 to provide efficient access for network buffers.


**The Swift package ecosystem**

* [Swift OTel](https://github.com/swift-otel/swift-otel) - recent update 1.0.1 : An Open Telemetry exporter for a service to publish logs, metrics, and tracing to an OTel collector.
* [Swift Configuration](https://github.com/apple/swift-configuration) - new release 0.2.0 : A new package, using the same pattern as swift-log and swift-metrics, to load configuration that supports a variety of loaders include JSON, Yaml, and environment variables.
* [Swift Profile Recorder](https://github.com/apple/swift-profile-recorder) - new release 0.3.8 : An in-process profiler to help you capture what your code is spending time doing, so you can optimize its performance.
* [Swift Collections](https://github.com/apple/swift-collections/) - recent update 1.3 : Among other updates, this adds UniqueArray to the collections provided - a high-performance collection type that takes advantage of the Swift’s performance advances with the types Span, InlineArray, and non-copyable types in Swift.
* [swiftly](https://github.com/swiftlang/swiftly/releases/tag/1.1.0) - recent update 1.1.0 : This adds deeper integration to help with developing Swift using VS Code.


**Swift Evolution**

The Swift project adds new language features to the language through the [Swift Evolution process](https://github.com/swiftlang/swift-evolution/blob/main/process.md). These are some of the proposals currently under discussion or recently accepted for a future Swift release.

Under active review:

* [SE-0497](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0497-definition-visibility.md) Controlling function definition visibility in clients - The [@inlinable attribute](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0193-cross-module-inlining-and-specialization.md) in Swift allows function definitions to be visible to callers, enabling optimizations like specialization and inlining. This proposal introduces explicit control over whether a function generates a callable symbol and makes its definition available for optimization purposes.

Recently completed:

* [SE-0495](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0495-cdecl.md) C compatible functions and enums (**accepted**) - This proposal introduces the @c attribute to mark Swift functions and enums as callable and representable in C, respectively. It aims to formalize and extend the experimental @_cdecl attribute.
* [SE-0496](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0496-inline-always.md)  @inline(always) attribute (**accepted**) - The Swift compiler uses inlining to optimize code by expanding function bodies into callers, but it may not always inline functions due to size concerns. The @inline(always) attribute allows developers to force inlining for specific functions.


**Working on something of your own? Drop us a line.**
If you’re making something available that you’d like to highlight, create a thread on the [Swift Forums Community Showcase](https://forums.swift.org/c/community-showcase/66). Please also [nominate packages that you find interesting](https://forums.swift.org/t/nominations-for-the-packages-community-showcase-on-swift-org/68168) for potential inclusion into the [Package Showcase](https://www.swift.org/packages/showcase.html) hosted on [Swift.org](http://swift.org/)
