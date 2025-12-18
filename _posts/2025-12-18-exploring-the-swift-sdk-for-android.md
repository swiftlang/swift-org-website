---
layout: new-layouts/post
published: false
date: 2025-12-18 10:00:00
title: "Exploring the Swift SDK for Android"
author: android-workgroup
category: "Developer Tools"
---

Since the announcement of [the preview Swift SDK for Android](/blog/nightly-swift-sdk-for-android/),
the Android workgroup has seen a lot of questions about how it works and what's next.
Please read on for some answers to common questions about the technology and its
future, and try out the new Swift 6.3 SDK nightly previews.

## How Swift works on Android

Swift compiles directly to native machine code on Android, the same way it does on most
other platforms. This approach produces similar performance to C and C++ code built using the
Android Native Development Kit (NDK), while achieving a happier balance between performance,
safety, and usability. To make this possible, Swift apps on Android bundle a native runtime
that implements many of its features, including its standard library and core
libraries, like Dispatch and [Foundation](/blog/foundation-preview-now-available/).

However, since most Android APIs are only made available through Java and Kotlin,
Swift must call into the Android Runtime (ART). That is where the [Java interoperability
project's](https://github.com/swiftlang/swift-java) `jextract` and `wrap-java`
tools come in. These tools automatically create bindings that enable you to call
Swift from Java or go the other way using the Java Native Interface (JNI), which
allows Swift to seamlessly integrate with the Android platform.

The [`jextract` tool gained a JNI mode this summer](/blog/gsoc-2025-showcase-swift-java/):
you can watch its author Mads Odgaard's [Server Side Swift Conference talk from a couple months ago](https://www.youtube.com/watch?v=tOH6V1IvTAc)
and try out [the new weather app he submitted in the Android examples repository](
https://github.com/swiftlang/swift-android-examples/tree/main/swift-java-weather-app).

## Swift on Android in production

While work is still ongoing on official Java interoperability, Android apps built using Swift
have been in production for many years employing homegrown Java interop, with these apps
collectively downloaded millions of times. Here are some notable examples:

- [Spark](https://play.google.com/store/apps/details?id=com.readdle.spark) - A popular email client using Swift to share code between mobile iOS/Android and desktop macOS/Windows versions
- [flowkey](https://play.google.com/store/apps/details?id=com.flowkey.app) - An interactive piano learning app built with Swift for Android for almost a decade
- [MediQuo](https://play.google.com/store/apps/details?id=com.mediquo.main) - A healthcare app leveraging Swift for cross-platform development
- [Naturitas](https://play.google.com/store/apps/details?id=com.naturitas.android) - An organic products marketplace running Swift in production

## Ongoing work

Grassroots community efforts to run Swift on Android [began as soon as the language source was opened in 2015](https://lists.swift.org/pipermail/swift-dev/Week-of-Mon-20151207/000171.html),
and continue to this day. [The Android project board lists areas the workgroup determines important](https://github.com/orgs/swiftlang/projects/17),
such as easy debugging, now a high priority for us. While it [may work for small examples](https://github.com/swiftlang/llvm-project/issues/10831),
we need to expand and test it more and make it easy to configure and access. That will likely
mean tying the debugger and [Swift Language Server Protocol tool, sourcekit-lsp](/blog/gsoc-2025-showcase-code-completion/),
into Integrated Development Environments (IDEs) like [Visual Studio Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/)
and Android Studio, another issue on our board.

[An Android workflow](https://github.com/swiftlang/github-workflows/pull/172) was
added to the official Swift workflows for GitHub months ago, allowing you to easily
try building your Swift packages with the Swift SDK for Android, and work is underway to let you
[run your tests in an Android emulator](https://github.com/swiftlang/github-workflows/pull/215)
too.

We are looking to onboard more contributors and have set up [a video call this
weekend to discuss](https://forums.swift.org/t/swift-on-android-new-contributors-call/83729).
We hope to make these contributor calls a recurring event moving forward, as more people
pitch in to improve these Swift tools themselves.

## Sharing Logic Versus Sharing UI

Swift allows you to target many platforms with the same business logic, and Swift
on Android expands that much more, but we do not provide a cross-platform GUI toolkit.
As we write in [our draft vision document](https://github.com/swiftlang/swift-evolution/blob/807b844be42db582e434d1667fc907ae7a7a8775/visions/android.md),
 a prominent use case we’re focused on is sharing core business logic, algorithms, and data models across applications.
The workgroup is not providing a single GUI solution, however a number of nascent community projects have approached the challenge in different ways.

Our [recent post in the Swift forums](https://forums.swift.org/t/swift-gui-toolkits-for-android/83337)
lists a handful of popular and in-progress options. 
While the workgroup has not validated the claims on individual projects, we plan to add
more info on using compatible GUI tools with the Swift SDK for Android in the coming months.

## Android API versioning

Until recently, Swift on Android did not support targeting multiple Android API levels
in the same app, but recent preview releases bring the familiar `@available`
attribute and `#available` runtime check that you know from Apple platforms to Android:

```swift
#if canImport(Android)
import Android
import Dispatch
#endif

@available(Android 33, *)
func backtrace() {
    withUnsafeTemporaryAllocation(of: UnsafeMutableRawPointer.self, capacity: 1) { address in
        _ = backtrace(address.baseAddress!, 1)
    }
}

@main
struct ExecutableDemo {
    static func main() {
        #if os(Android)
          print("Hello from Android API 28 or later")
          if #available(Android 33, *) {
            // The following code is only run on Android 33+ devices.
            backtrace()
            print("Hello from Android API 33+")
          }
        #endif
    }
}
```
Try this new feature on Android and let us know how it works for you.

## Learn from the community

Those using Swift on Android for many years have been sharing their experiences,
as founding contributors like [Readdle](https://readdle.com/blog/swift-for-android-our-experience-and-tools)
and [flowkey](https://medium.com/@ephemer/why-we-put-an-app-in-the-android-play-store-using-swift-96ac87c88dfc)
have written about their work for the last decade.

The Left Bit's Pierluigi Cifani [recently wrote about their experiences](https://forums.swift.org/t/thoughts-on-swift-for-android/80961),
gave [a great talk at NSSpain 2025 a couple months ago](https://youtu.be/EIGl6GOo210),
and was [interviewed by Swift Toolkit last month](https://www.swifttoolkit.dev/posts/dc-pier).

A [community member recently contributed an example app](https://github.com/swiftlang/swift-android-examples/tree/main/hello-cpp-swift)
that builds C++ using CMake and links it with Swift, using Swift's automated JNI bridging
to Java instead.

## Swift 6.3 SDK nightly previews

Finally, we are happy to announce that [an official Swift 6.3 SDK CI](https://ci.swift.org/job/oss-swift-6.3-package-swift-sdk-for-android/)
has been set up, and it is producing [nightly preview releases of the Swift 6.3 SDK for Android](/install/macos/#swift-sdk-buindles-dev).
Please follow the [Getting Started guide](/documentation/articles/swift-sdk-for-android-getting-started.html)
to install and use it.

Swift on Android has been a community effort for the last decade, growing
from that initial patch to apps in production and an active group of developers.
Try out the new preview releases of the Swift 6.3 SDK for Android and help us
make it even better!
