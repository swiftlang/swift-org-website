---
layout: new-layouts/post
published: true
date: 2025-12-19 16:00:00
title: "What's new in Swift: December 2025 Edition"
author: [timsneath, davelester]
category: "Digest"
---


Welcome to the latest digest of news from the Swift project. 

Each edition we share updates that we hope will be useful to you whether you're writing code with Swift or contributing to the language as a whole, and we start with an introduction from this edition's guest contributor:

> As we near the end of the year, it's a time for reflection and gratitude. We're profoundly grateful for the energy, creativity, and dedication of our community: the hundreds of contributors who submit code to improve Swift, those who create and steward ecosystem packages with thoughtfulness, and the developers building remarkable things with this language. 
>
> Indeed, it has been a monumental twelve months for Swift as an open source project. 
>
> From its relatively humble roots as an open source project, starting with [a simple blog post](https://www.swift.org/blog/welcome) ten years ago this month, the [Swift project now comprises over 70 repositories](https://github.com/swiftlang), with hundreds of contributors every week bringing fresh perspectives, performance improvements, and tooling enhancements to the ecosystem.
> 
> The [release of Swift 6.2](https://www.swift.org/blog/swift-6.2-released/) brings more approachable concurrency with defaults that align with a philosophy of progressive disclosure: making advanced features available when you need them, but keeping them out of your way when you don't. Swift 6.2 also adds [WebAssembly support](https://www.swift.org/documentation/articles/wasm-getting-started.html), deep C++ interoperability, and improved memory safety features. 
> 
> This year proved that Swift truly runs everywhere, across a variety of platforms and use cases:
> 
> - **Embedded**: Embedded Swift is [rapidly evolving](https://www.swift.org/blog/embedded-swift-improvements-coming-in-swift-6.3/), moving from experimental to practical use cases, with significant updates targeted for the upcoming 6.3 release.
> - **Android**: The workgroup is making strides with [daily snapshot builds](https://www.swift.org/blog/nightly-swift-sdk-for-android/) and end-to-end demos, bringing native Swift development closer to reality on Android devices.
> - **Windows**: Support is maturing fast, with richer tooling via the VS Code extension and a growing library of packages that support Windows out of the box.
> - **BSD**: The [Swift on FreeBSD Preview](https://forums.swift.org/t/swift-on-freebsd-preview/83064) is now available in preview for FreeBSD 14.3 and later, and will be featured in a FOSDEM 2026 talk about [Porting Swift to FreeBSD](https://fosdem.org/2026/schedule/event/swift-on-freebsd/).
> - **AI**: The ecosystem is evolving quickly, with MLX providing a Swift-friendly API for machine learning on Apple Silicon, and numerous packages from [Hugging Face](https://github.com/huggingface?q=&type=all&language=swift) for Swift development.
> - **Server**: Backend development remains a major growth area. At the recent AWS re:Invent conference, Amazon announced [integrated support for Swift in Amazon Linux](https://docs.aws.amazon.com/linux/al2023/release-notes/relnotes-2023.9.20251110.html#release-summary-2023.9.20251110) and adoption of the [AWS Lambda Runtime](https://aws.amazon.com/blogs/opensource/the-swift-aws-lambda-runtime-moves-to-awslabs/), signaling that the cloud is ready for Swift’s memory safety and speed.
> 
> And of course, Swift remains the unrivaled language of choice for building apps across all Apple platforms, whether you're building an app or a game for iPhone, iPad, Mac, Apple Watch, Apple TV or Apple Vision Pro!
>
> So thank you, once more, on behalf of all of us working on Swift: there would be no Swift community without you!
>
> &mdash; Tim Sneath

 To end this milestone year, let's take a look at some of the things that caught our attention this month.

## Swift at FOSDEM 2026
Get ready for [FOSDEM](http://fosdem.org), the world’s largest independently run open source conference, taking place in Brussels in late January / early February. The Swift community will be there, including a [Pre-FOSDEM Community Event](http://swiftlang.github.io/event-fosdem/) that has been announced along with its CFP for 20-min talks, open through 05 January (23:59 CET).

Outside of the pre-conference event, Swift talks will appear in several FOSDEM devrooms including Containers, BSD, LLVM, and SBOMs. Hope to see you there!

## Talks worth watching
* [Beyond Web Services: Swift for Low-Level Container infrastructure](https://www.youtube.com/watch?v=I72qyQbXQgM) - Eric introduces us to Apple's Containerization and Container open source projects, built entirely in Swift.
* [Separate code from configuration with Swift Configuration](https://www.youtube.com/watch?v=I3lYW6OEyIs) - Swift Configuration provides a unified approach to handling configuration in your Swift applications. For more information, also check out the [Swift Configuration 1.0 announcement](https://www.swift.org/blog/swift-configuration-1.0-released/) from last week.
* [Getting started with gRPC Swift](https://www.youtube.com/watch?v=yo-7ipiQwNs) - A deep dive into the Swift package for gRPC, a key building block of performant cloud services.

## Behind the scenes interviews
* [Running Swift in AWS Lambda &#124; Serverless Office Hours](https://www.youtube.com/watch?v=RlG71WUZa7Q) - Sebastien Stormacq answered developer questions and was live coding with Swift on AWS Lambda. Also check out the related [Swift AWS Lambda Runtime package](https://github.com/awslabs/swift-aws-lambda-runtime).
* [Observability in Server Side Swift, with Moritz Lang - Dev Conversations #16](https://www.youtube.com/watch?v=G5QA4XEORuU) - This interview covers all things distributed tracing and Swift OTel.
* [Code-along: Start building with Swift and SwiftUI](https://www.youtube.com/watch?v=XapwQYZwmic) - Originally live streamed, a developer code-along that walks you through building a complete iOS interface using Swift and SwiftUI, followed by a Q&A session to answer developer questions.

## Swift blog highlights
In case you missed it, here are several recent blog posts you'll want to check out:

* [Exploring the Swift SDK for Android](https://www.swift.org/blog/exploring-the-swift-sdk-for-android/) - Common questions about Swift on Android are answered by the Android workgroup, and new Swift 6.3 SDK nightly previews were announced.
* [Temporal Swift SDK introduced](https://www.swift.org/blog/swift-temporal-sdk/) - Temporal has also blogged about [using Swift with Temporal](https://temporal.io/blog/temporal-now-supports-swift).
* 2025 Google Summer of Code contributors had posts featuring work related to several Swift-related projects, everything from [Bringing Swiftly support to VS Code](https://www.swift.org/blog/gsoc-2025-showcase-swiftly-support-in-vscode/), [Extending Swift-Java Interoperability](https://www.swift.org/blog/gsoc-2025-showcase-swift-java/), [Improved code completion for Swift](https://www.swift.org/blog/gsoc-2025-showcase-code-completion/), and [Improved console output for Swift Testing](https://www.swift.org/blog/gsoc-2025-showcase-swift-testing-output/).

## Swift everywhere
As this month's guest contribution shared, Swift continues to expand the platforms where it runs. Here are a few recent examples from the community:

* [Using Swift SDKs with Raspberry PIs](https://xtremekforever.substack.com/p/using-swift-sdks-with-raspberry-pis) - Did you know Swift can run on a Raspberry PI? This blog post does a deep dive, it's time to open your terminal and follow along!
* [Swift for WASM December 2025 updates](https://forums.swift.org/t/swift-for-wasm-december-2025-updates/83778) - The most recent update on work related to Swift for WASM. In December the community also had an online meetup including talks.
* [AWS blog post about AWS Lambda runtime](https://aws.amazon.com/blogs/opensource/the-swift-aws-lambda-runtime-moves-to-awslabs/) - The Swift AWS Lambda Runtime moved to the official AWS Labs GitHub organization. Swift not only runs on Linux, it runs on AWS Lambda as well!
* [Swift on a Pebble watch](https://x.com/lucaslovexoxo/status/1987516793372524727) - A developer used Embedded Swift to build a "hello world" example on a 10-year-old Pebble Time Round watch.

## Swift Evolution
The Swift project adds new language features to the language through the Swift Evolution process. These are some of the proposals currently under discussion or recently accepted for a future Swift release.

**Under Active Review:**
* [SE-0501](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0501-swiftpm-html-coverage-report.md) HTML Coverage Report - This proposal adds HTML coverage report generation to Swift Package Manager's swift test command. Currently, SwiftPM only generates JSON coverage reports, which are useful for automated tools but not human-readable for developers. The new --coverage-format option would allow generating HTML reports alongside or instead of JSON, enabling visual inspection in CI systems and faster feedback during development.

**Recently completed:**
* [SE-0497](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0497-definition-visibility.md) Controlling function definition visibility in clients - The @inlinable attribute in Swift allows function definitions to be visible to callers, enabling optimizations like specialization and inlining. This proposal introduces explicit control over whether a function generates a callable symbol and makes its definition available for optimization purposes.
* [SE-0493](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0493-defer-async.md) Support async calls in defer bodies - Swift's defer statements provide scope-based cleanup but currently cannot perform asynchronous work, forcing developers to either manually insert cleanup on every exit path or spawn detached tasks. This proposal allows await calls within defer bodies when the enclosing context is async, with the defer statements implicitly awaited at scope exit to ensure proper cleanup completion.

*Editor Note: With this update, we’re going to take a break from the blog for the next couple of weeks. Wishing everyone a restful end to 2025!*