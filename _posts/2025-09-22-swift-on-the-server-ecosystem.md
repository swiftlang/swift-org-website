---
layout: new-layouts/post
published: true
date: 2025-09-22 10:00:00
title: "10 Year of Swift Server"
author: [0xTim]
category: "Community"
---

It's been nearly ten years since Swift was open sourced and an official runtime for Linux was released. In that time Swift has come a long way, with stability across platforms, a burgeoning ecosystem and many success stories. Having been involved with Swift on the server from almost the very beginning, I've seen it grow and mature and continue to go from strength to strength. In this post, I'll cover how Swift:

* is seeing a growing number of success stories in production
* has evolved to be a powerful language for server development
* has a thriving ecosystem of frameworks and libraries
* has a growing and passionate community - including a dedicated server conference coming up in October!

## Running in Production

There have been some really awesome success stories emerge over the last few years, reinforcing the strength of Swift on the server. The award-winning Things app [explained how they migrated their backend](/blog/how-swifts-server-support-powers-things-cloud/) from Python to Swift, seeing a 4x increase in performance, whilst costing a third of the original price!

Apple's Password Monitoring Service also [underwent a similar transition](/blog/swift-at-apple-migrating-the-password-monitoring-service-from-java/) migrating from Java to Swift. As well as an improved codebase from Swift's ergonomics, they saw similar gains with a 40% increase in throughput, a 50% reduction in hardware utilization and a **90% decrease** in memory usage, freeing up server capacity for other workloads.

From my vantage point working on Vapor, I've seen more and more companies adopt Swift on the server. I no longer get asked if Swift is 'ready for production'. All the questions are about what can it do and "how can I use Swift for my use case", which is awesome to see. There are even a number of talks lined up for this year's server conference with success stories of running Swift on the server.

## Language strengths and improvements

Swift has grown a lot since Swift 3! The languages has seen a huge number of changes heavily adopted, and in some cases driven, by the server world. Native UTF-8 strings, `Codable`, keypaths and property wrappers all saw quick adoption by server packages. Swift Concurrency has been a game changer, making it significantly easier for developers to write asynchronous code, which is especially helpful in an environment where almost everything is asynchronous! Task local values make it simple to introduce distributed tracing to applications without the need to pass contexts around everywhere. More recently, features such as package traits, build plugins and macros have already started to be adopted by server libraries, to provide more performant and efficient code to end users.

One of the big changes in recent years is the introduction of [`Sendable`](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency#Sendable-Types), which has eliminated many cases of data race issues. A great showcase of this is Vapor, which used to see one or two issues created a month reporting data race crashes that were impossible to reproduce and extremely hard to resolve. Since Vapor adopted `Sendable` there hasn't been **a single report** of a data race crash, which is astonishing! This just goes to show how using Swift makes it easier to write safe server applications. 

[Foundation](https://github.com/swiftlang/swift-foundation) has also undergone a significant journey. Gone are the days of an entirely separate implementation for Linux. With Swift 6, the same Foundation code runs on Linux as on Apple platforms. This makes it far easier for developers to build on different platforms. Speaking of which, the recent cross-compilation SDKs make it super simple to build Linux binaries on macOS.

One of the emerging strengths of Swift is its ability to interoperate with other languages. Swift was introduced with great C interoperability and has since expanded to include C++ and Java. This opens up the packages available, and packages such as [Swift Kafka](https://github.com/swift-server/swift-kafka-client) have been quickly released because they can use an existing, battle-tested libraries from C or C++ with little effort.

The new Swift Java interop also makes it possible to work with existing Java libraries in Swift projects and begin to incrementally migrate large, existing Java codebases to Swift, without the need for major rewrites that are often risky. This was spoken about at the package's introduction at [ServerSide.swift 2024](https://www.youtube.com/watch?v=wn6C_XEv1Mo).

Overall, Swift has evolved to be a great language for server development. Have a look at the [Cloud Services page](https://www.swift.org/get-started/cloud-services/) on swift.org for getting started tutorials, language benefits and more information about the server ecosystem. 

## The Ecosystem

As great as Swift is as a language, Swift on the server is nothing without an ecosystem. Over the last decade, [Vapor](https://vapor.codes) continues to evolve and grow, newer frameworks like [Hummingbird](https://hummingbird.codes) are taking advantage of modern Swift features, and a swathe of packages have been released to support all kinds of APIs, libraries and databases. I'm always amazed at the weird and wonderful ways people are using Swift in server environments and how much of the ecosystem is driven by the community.

The [areweserveryet.org](https://areweswiftyyet.org/) website has a great list of different packages available, and the [Swift Package Index](https://swiftpackageindex.com/) has been instrumental in propelling the package ecosystem on Linux, with build results for every single package submitted.

We're seeing Swift pick up more acceptance in the server world and the recent [Valkey announcement for Swift](https://valkey.io/blog/valkey-swift/) is a testament to the efforts of the community in making Swift a first-class citizen on the server.

Swift is also building an awesome observability ecosystem. It has API packages for each of the three pillars (logging, metrics, and tracing), that mean you can plug in any backend you want and all the packages in your dependency tree will work it. And the growing list of backends already includes options for many popular open-source projects, such as [Prometheus](https://github.com/swift-server/swift-prometheus), [Statsd](https://github.com/apple/swift-statsd-client) and [Open Telemetry](https://github.com/swift-otel/swift-otel).

The ecosystem continues to be an early adopter of Swift technologies. gRPC Swift 2 [introduced earlier this year](/blog/grpc-swift-2/) introduced first-class concurrency support was a particular highlight of the next generation of server packages emerging to take full advantage of structured concurrency. This has been heavily driven by the [Swift Server Workgroup](https://www.swift.org/sswg/), which is comprised of members from across the ecosystem and industry and continues to work to ensure that the ecosystem works together as well as driving improvements to the language, and tooling, such as the recently adopted [Swiftly](https://www.swift.org/blog/introducing-swiftly_10/) CLI tool, originally developer by the workgroup.

## A growing community

The last 10 years has seen the community grow and grow. There's even a dedicated conference! The [ServerSide.swift conference](https://www.serversideswift.info) I organize, is hosting it's 5th year this year in London. The schedule has recently been announced with talks on gRPC, containers, concurrency and success stories. Previous years have seen really great talks, such as the [success story of using Swift on the server](https://www.youtube.com/watch?v=oJArLZIQF8w) by Cultured Code, the company behind Things. Other standout sessions include talks on [the OpenAPI generator](https://www.youtube.com/watch?v=n1PRYVveLd0), the announcement of the new [Swift Foundation](https://www.youtube.com/watch?v=EUKSZiOaWKk) and technical language talks on [structured concurrency](https://www.youtube.com/watch?v=JmrnE7HUaDE).

Tickets for the this year's conference are still available on the [website](https://www.serversideswift.info). We even have a day of workshops, including a workshop from Apple on how to get started with Swift on the server, which is a great opportunity for anyone wanting to learn more.

Swift has come a long way on the server since the early days. The adoption of Swift on the server is ever-increasing as the language proves its benefits for safe, performant backends. The ecosystem continues to grow, with more frameworks, libraries, and tools being developed to support server-side Swift applications. I can't believe it's 'only' been ten years since it started, and I'm excited to see how Swift on the server grows over the next decade!