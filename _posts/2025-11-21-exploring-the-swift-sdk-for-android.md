---
layout: new-layouts/post
published: false
date: 2025-11-21 10:00:00
title: "Exploring the Swift SDK for Android"
author: android-workgroup
category: "Developer Tools"
---

Since the announcement of [the preview Swift SDK for Android last month](/blog/nightly-swift-sdk-for-android/),
the Android workgroup has seen a lot of questions about how it works and what's next. Please read on for those answers.

### Swift in the World of Android

Swift is a natively-compiled language to machine code and Android is no different.
That renders it on par with C and C++ code built using the Android NDK, which are
languages more geared towards performance, while Swift essays a happier balance between
performance, safety, and usability. To enable that, Swift apps must bundle a native
runtime for Android that implements many of its features, including its standard library and
core libraries like Dispatch and [Foundation](/blog/foundation-preview-now-available/).

However, since most Android APIs are only made available through Java and Kotlin
in the Android Runtime (ART), a version of the Java Virtual Machine (JVM)
optimized for mobile, we need to use the Java Native Interface (JNI) and write
bindings both to call Swift from Java and go the other way. That is where the
swift-java project's `jextract` tool and its [new support for generating such
JNI bindings for you](/blog/gsoc-2025-showcase-swift-java/) comes in. Please
watch its author Mads Odgaard's [Server-Side Swift Conference talk from last month](https://www.youtube.com/watch?v=tOH6V1IvTAc)
and try out the tool for yourself with [this example Android app that he put together](https://github.com/swiftlang/swift-android-examples/tree/main/hello-swift-java).

### Swift in Android app stores

While Swift on Android may seem new, it's important to recognize that there are
already millions of Android devices running Swift today. Production apps with
substantial user bases have been shipping Swift on Android for years, proving
the viability of this approach:

- [Spark](https://play.google.com/store/apps/details?id=com.readdle.spark) - A popular email client using Swift to share code between mobile iOS/Android and desktop macOS/Windows versions
- [flowkey](https://play.google.com/store/apps/details?id=com.flowkey.app) - This interactive piano learning app has been built with Swift on Android since the open-source release
- [MediQuo](https://play.google.com/store/apps/details?id=com.mediquo.main) - A healthcare app leveraging Swift for cross-platform development
- [Naturitas](https://play.google.com/store/apps/details?id=com.naturitas.android) - An organic products marketplace running Swift in production

These aren't experimental apps or proofs of concept—they're real businesses serving
real users at scale. The fact that millions of people use Swift-powered Android apps
daily without knowing shows both the stability of Swift on Android and the
practical benefits it provides to development teams sharing code across platforms.

### Coming up Next

Swift on Android [first got started as soon as the language was open-sourced a decade ago](https://lists.swift.org/pipermail/swift-dev/Week-of-Mon-20151207/000171.html),
but it is by no means done. [The Android project board lists areas we are working on](https://github.com/orgs/swiftlang/projects/17)
and easy debugging is a high priority for us next. While it [mostly works in limited use now](https://github.com/swiftlang/llvm-project/issues/10831),
we need to test it more and make it easy to access. That will likely mean tying
the debugger and [Swift Language Server Protocol tool, sourcekit-lsp](/blog/gsoc-2025-showcase-code-completion/),
into editors like [Visual Studio Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/),
Android Studio, and [CodeEdit](https://www.codeedit.app/), another issue on our board.

### Sharing Logic Versus Sharing UI

A common concern is that we do not provide a cross-platform GUI toolkit. As we
write in [our draft vision document](https://github.com/swiftlang/swift-evolution/blob/807b844be42db582e434d1667fc907ae7a7a8775/visions/android.md),
the Android workgroup has no plans to create such a GUI toolkit, but will instead
curate a list of cross-platform UI tools. See our recent post in the Swift forums
listing several popular and in-progress options. (editor: add this link)

### Diving in

Finally, we intend to bring you interviews and information from those using Swift
on Android already, as pioneering companies like [Readdle](https://readdle.com/blog/swift-for-android-our-experience-and-tools)
and [Flowkey](https://medium.com/@ephemer/why-we-put-an-app-in-the-android-play-store-using-swift-96ac87c88dfc)
have written about using Swift on Android for the last decade. The Left Bit's Pierluigi Cifani
[wrote about their experiences recently](https://forums.swift.org/t/thoughts-on-swift-for-android/80961),
gave [a great talk at NSSpain 2025 a couple months ago](https://youtu.be/EIGl6GOo210),
and was [interviewed by Swift Toolkit last month](https://www.swifttoolkit.dev/posts/dc-pier).

Swift on Android has been a community effort for the last decade, snowballing
from that initial patch to many businesses and developers making their livelihood
with it today. Join us to make it even better!
