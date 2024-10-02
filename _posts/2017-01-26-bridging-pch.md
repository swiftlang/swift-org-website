---
layout: new-layouts/blog
published: true
date: 2017-1-26 10:00:00
title: Faster Mix-and-Match Builds with Precompiled Bridging Headers
author: graydon
---

An examination of build times of Xcode projects that mix Objective-C and Swift, which can contain large bridging headers, shows that the Swift compiler spends a lot of time re-processing the same bridging headers for all the Swift files in a project.
In certain projects, each additional Swift file increases the overall build time noticeably, even when the Swift file is quite modest.

This post will discuss this compile-time cost, and how it is being addressed in Swift 3.1.

## The Problem

Every time a Swift file in a mixed-language target is compiled, the Swift compiler parses the project's bridging header in order to make Objective-C code visible to Swift code.
When the bridging header is large and the Swift compiler runs many times -- as in a debug configuration -- the cost of repeatedly parsing the bridging header can be a substantial part of the overall build time.

## The Solution

In Swift 3.1, the compiler has gained a new mode to reduce this cost: _precompiling_ bridging headers.
When this mode is enabled, instead of repeatedly parsing the bridging header for each Swift file in a mixed-language target, the bridging header is parsed only once, and the result (a temporary "precompiled header" or "PCH" file) is cached and reused across all Swift files in the target.
This leverages the same precompiled header technology that is used to precompile prefix headers in Objective-C and C++ code.

In the Swift project this mode was developed and tested against, it **reduced debug build time by 30%**. The speedup depends on the size of a project's bridging header, and the mode does not affect [whole-module-optimization builds](/blog/whole-module-optimizations).
But it can significantly improve compile times when iterating in debug configuration.

## Trying it out

This mode is part of Swift 3.1 and is available in [nightly snapshots on swift.org](/download/#snapshots), as well as in [Xcode 8.3 beta](https://developer.apple.com/download/).
It is currently experimental and must be manually enabled; in future releases, if developer feedback indicates it's working well and providing significant speedup, it will be enabled by default.
To try it out in the meantime, install a compiler that supports it, open the build settings for your project and set "Other Swift Flags" to contain the option `-enable-bridging-pch`:

![Enabling bridging PCH](/assets/images/bridging-pch-blog/build-setting.png)

## Reporting feedback

If you have a project with a large bridging header, please try using this new mode.
If you encounter problems, please file a bug in either [Swift.org's bug-tracking system](https://bugs.swift.org/) or [Apple's](https://bugreport.apple.com/).
General feedback is also welcome by emailing the [swift-users mailing list](https://lists.swift.org/pipermail/swift-users/) mailing list, or on [Twitter](https://twitter.com/swiftlang) (mention `#SwiftBridgingPCH`).

> Note: Swift mailing lists have been shut down, archived, and replaced with
> [Swift Forums](https://forums.swift.org). See
> [the announcement here]({% post_url 2018-01-19-forums %}). A place for general
> feedback is the [Using Swift](https://forums.swift.org/c/swift-users/)
> category on the forums.
