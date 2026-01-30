---
layout: new-layouts/post
published: true
date: 2026-01-30 14:00:00
title: "What's new in Swift: January 2026 Edition"
author: [nicksloan, davelester]
category: "Digest"
---

Earlier this month, a Reddit discussion asked: [Has anyone built web apps with Swift?](https://www.reddit.com/r/swift/comments/1qhhiod/) Yes, many developers and companies! For this edition of "What's new in Swift", we invited one to share their adoption story:

> Hi, I'm Nick Sloan. I'm the head of engineering at [Studioworks](https://studioworks.app/), a platform that makes it easy and fun to run your creative studio, agency or freelance business.
> 
> We chose Swift for Studioworks because of how easy it is to write safe and reliable code with great performance. Our Swift project makes use of [Hummingbird 2](https://hummingbird.codes), [Soto](https://soto.codes/) (for its incredible DynamoDB Codable support), [Hummingbird MacroRouting](https://github.com/sloatescoan/hummingbird-macrorouting/), and [Elementary](https://github.com/elementary-swift/elementary). Studioworks is a big and growing project. We are the largest Elementary codebase, and I suspect we are among the biggest projects using Hummingbird as well.
> 
> We've already processed millions of dollars in invoices for our customers, and after 20 years of shipping web applications, I have never seen fewer crashes and bugs make it to production. Performance has also been excellent, especially after moving our templates to Elementary. Our heaviest pages make it to the browser in less than 100ms.
> 
> We've been deploying web applications with PHP and Python for decades, and getting started with a Swift web project was certainly a bit slower. We had to recreate some of the build, deployment and chat tooling we had been relying on in our Python projects for years, and it took us a bit of experimenting to realize that Elementary was the best choice for templating. Once we got past those hurdles we've been able to build about as fast as we ever did with Python, and the quality is much better.
> 
> Swift on the web has been a resounding success for us, and I hope we'll see this part of the community continue to grow!
> 
> &mdash; Nick Sloan

Learn more about Swift on Linux and server-based use cases by checking out our [October edition](/blog/whats-new-in-swift-october-2025/), which featured highlights from the Server-Side Swift Conference. The swift.org website also has a use case page dedicated to [cloud services](/get-started/cloud-services/), including a [tutorial](https://docs.swift.org/getting-started-swift-server/tutorials/getting-started-swift-server/) to get started.

And now for what's new in Swift this month.

## Videos to watch

* [On Progressive Disclosure in Swift](https://www.youtube.com/watch?v=opqKGgJavkw) - Doug Gregor's must-watch talk explores how Swift lets you progressively use more language features as your experience and codebase evolves.
* A new episode of NSScreencast dives into livecoding the [Billion Row Challenge](https://nsscreencast.com/episodes/604-brc-part1), with Matt Massicotte as a guest.

## New package releases
* Want to build 3D models with code? [Cadova](https://github.com/tomasf/Cadova) is a programmable alternative to traditional CAD tools, with a focus on 3D printing.
* [Feather Database](https://github.com/feather-framework/feather-database) provides a database-agnostic layer that can be shared by multiple database drivers. And it's designed for modern Swift concurrency.
* Miguel de Icaza has ported the .NET Foundation mail stack, originally created by Jeffrey Stedfast (MailKit/MimeKit), to Swift. Hello [MailFoundation](https://github.com/migueldeicaza/MailFoundation) and [MimeFoundation](https://github.com/migueldeicaza/MimeFoundation)!

## Community highlights
* [Introduction to Building Swift for Yocto](https://xtremekforever.substack.com/p/introduction-to-building-swift-for) - Check out this embedded Linux guide to using meta-swift to build Swift for a Raspberry Pi Zero 2.
* Registration is open for several Swift community conferences, including [SwiftCraft](https://swiftcraft.uk) and [try! Swift Tokyo](https://tryswift.jp/en/). The Call for Proposals (CFP) is still open for try! Swift Tokyo. 

## Swift Evolution
The Swift project adds new language features through the [Swift Evolution process](https://www.swift.org/swift-evolution/). These are some of the proposals currently under review or recently accepted for a future Swift release.

**Under active review:**
* [SE-0506](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0506-advanced-observation-tracking.md) Advanced Observation Tracking - `@Observable` types automatically track when their properties change. However, advanced use cases like developing middleware infrastructure or widgeting systems require more control and features. This proposal adds options to the existing `withObservationTracking` to control when/which changes are observed, and a continuous variant that re-observes automatically after coalesced events.
* [SE-0507](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0507-borrow-accessors.md) Borrow and Mutate Accessors - When you read or write a Swift property, the code that handles that access currently either makes a copy of the value or uses coroutines, which have performance overhead. This proposal adds new `borrow` and `mutate` keywords that let properties provide direct access to their stored values and enables properties that hold values that can't be copied.

**Recently accepted:**
* [SE-0498](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0498-runtime-demangle.md) Expose demangle function in Runtime module - The Swift compiler uses name mangling, turning Swift symbols into strings like `$sSS7cStringSSSPys4Int8VG_tcfC` which show up in backtraces and profiling tools. There are times, however, that a human-readable format is preferable. This proposal introduces a new API that allows calling out to the Swift runtime's demangler, without leaving the process.