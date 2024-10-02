---
layout: new-layouts/blog
published: true
date: 2022-12-09 08:00:00
title: The Future of Foundation
author: [parkera]
---

The Foundation framework is used in nearly all Swift projects. It provides both a base layer of functionality for fundamentals like strings, collections, and dates, as well as setting conventions for writing great Swift code.

Today, we have some exciting announcements for the future of Foundation.

## Going Open
When Swift [began life as an open source project]({% post_url 2015-12-03-welcome %}), we wanted to open not just the language itself, but the ecosystem around it. Foundation has been instrumental in the success of decades of software and has been an integral part of the Swift developer experience from the beginning, and we knew it had to be included in the open source offering.

The [swift-corelibs-foundation](https://github.com/swiftlang/swift-corelibs-foundation) project helped launch the open source Swift version of Foundation in 2016, wrapping a Swift layer around the preexisting, open source C implementation of Foundation.

In the intervening years, Swift has grown both technologically (e.g. ABI stability), as well as socially, attracting a diverse community of participants bound together by their interest in Swift.

With that growth, the time has come to reevaluate the strategy of an open source Foundation.

## Going Further
Today, we are announcing a new open source Foundation project, written in Swift, for Swift.

This achieves a number of technical goals:
* **No more wrapped C code.** With a native Swift implementation of Foundation, the framework no longer pays conversion costs between C and Swift, resulting in faster performance. A Swift implementation, developed as a package, also makes it easier for Swift developers to inspect, understand, and contribute code.
* **Provide the option of smaller, more granular packages.** Rewriting Foundation provides an opportunity to match its architecture to evolving use cases. Developers want to keep their binary sizes small, and a new _FoundationEssentials_ package will provide the most important types in Foundation with no system dependencies to help accomplish this. A separate _FoundationInternationalization_ package will be available when you need to work with localized content such as formatted dates and time. Other packages will continue to provide XML support and networking. A new _FoundationObjCCompatibility_ package will contain legacy APIs which are useful for certain applications.
* **Unify Foundation implementations.** Multiple implementations of any API risks divergent behavior and ultimately bugs when moving code across platforms. This new Foundation package will serve as the core of a single, canonical implementation of Foundation, regardless of platform.

And this also achieves an important community goal:
* **Open contribution process.** Open source projects are at their best when the community of users can participate and become a community of developers. A new, open contribution process will be available to enable all developers to contribute new API to Foundation.

## Going Together
We're excited to start discussing these plans with everyone [on the Swift forums](https://forums.swift.org/t/what-s-next-for-foundation/61939). The project itself will launch on GitHub in 2023.
