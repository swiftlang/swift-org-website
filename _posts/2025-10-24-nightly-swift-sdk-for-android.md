---
layout: new-layouts/post
published: true
date: 2025-10-24 10:00:00
title: "Announcing the Swift SDK for Android"
author: joannis
category: "Developer Tools"
featured-image:
  url: '/assets/images/swift-sdk-for-android-blog/blog-hero@2x.png'
  alt: 'Featured blog image with the screenshot of Android Studio with Swift code'
featured-image-dark:
  url: '/assets/images/swift-sdk-for-android-blog/blog-hero-dark@2x.png'
  alt: 'Featured blog image with the screenshot of Android Studio with Swift code'
---

Swift has matured significantly over the past decade — extending from cloud services to Windows applications, browser apps, and microcontrollers. Swift powers apps and services of all kinds, and thanks to its great interoperability, you can share code across platforms.

The [Android workgroup](/android-workgroup/) is an open group, free for anyone to join, that aims to expand Swift to Android. Today, we are pleased to announce nightly preview releases of the [Swift SDK for Android](/install/macos/#swift-sdk-buindles-dev).

This milestone reflects months of effort by the Android workgroup, building on many years of grassroots community effort. With the SDK, developers can begin developing Android applications in Swift, opening new avenues for cross-platform development and accelerating innovation across the mobile ecosystem.

The Swift SDK for Android is available today, bundled with the [Windows installer](/install/windows/) or downloadable separately for use on Linux or macOS.

## Getting Started

We've published a [Getting Started guide](/documentation/articles/swift-sdk-for-android-getting-started.html) to help you set up your first native Swift code on an Android device. The [Swift for Android Examples](https://github.com/swiftlang/swift-android-examples) help demonstrate end‑to‑end application workflows on Android.

With the Swift SDK for Android, you can now start porting your Swift packages to Android. [Over 25% of packages in the Swift Package Index](https://swiftpackageindex.com/blog/adding-wasm-and-android-compatibility-testing) already build for Android, and [the Community Showcase](/packages/showcase.html) now indicates Android compatibility.

The [swift-java project](https://github.com/swiftlang/swift-java) enables you to interoperate between Java and Swift. It is both a library and a code generator, enabling you to integrate Swift and Java in both directions by automatically generating safe and performant bindings. To learn about generating bindings to bring your business logic to Android, check out the [recent Swift Server Side meetup talk](https://www.youtube.com/watch?v=96IQAA7Nl8E&t=982s) by Mads Odgaard.

## Next Steps

This preview release opens many new opportunities to continue improving these tools. We encourage you to discuss your experiences, ideas, tools and apps on the [Swift Forums](https://forums.swift.org) in the [Android Category](https://forums.swift.org/c/platform/android/115).

The Android workgroup is drafting [a vision document](https://github.com/swiftlang/swift-evolution/pull/2946), currently under review, for directing future work regarding Swift on Android. This vision will outline priority areas and guide community efforts to maximize impact across the ecosystem. In addition, we maintain a [project board](https://github.com/orgs/swiftlang/projects/17) that tracks the status of major efforts, as well as [official CI for the Swift SDK for Android](https://ci.swift.org/job/oss-swift-package-swift-sdk-for-android/).

If you're as excited as we are, join us and help make this ecosystem even better!
