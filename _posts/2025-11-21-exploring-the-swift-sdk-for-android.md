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

## Swift in the World of Android

Swift compiles directly to native machine code on Android, the same way it does on other
platforms. This gives it similar performance to C and C++ code using the Android Native
Development Kit (NDK), while achieving a happier balance between performance, safety,
and usability. To make this possible, Swift apps on Android bundle a native runtime
that implements many of its features, including its standard library and core
libraries like Dispatch and [Foundation](/blog/foundation-preview-now-available/).

However, since most Android APIs are only made available through Java and Kotlin,
Swift must call into the Android Runtime (ART). That is where the [Java interoperability
project's](https://github.com/swiftlang/swift-java) `jextract` and `wrap-java`
tools come in. These tools automatically create bindings that enable you to call
Swift from Java or go the other way using the Java Native Interface (JNI), which
allows Swift to seamlessly integrate with the Android platform. The [`jextract`
tool gained a JNI mode recently](/blog/gsoc-2025-showcase-swift-java/):
please watch its author Mads Odgaard's [Server Side Swift Conference talk from last month](https://www.youtube.com/watch?v=tOH6V1IvTAc).
You can also check out [his hello-swift example in the Android examples repository](https://github.com/swiftlang/swift-android-examples/tree/main/hello-swift-java).

## Swift on Android in production

Android apps built with Swift have millions of downloads and have been in production
for many years. Here are some notable examples:

- [Spark](https://play.google.com/store/apps/details?id=com.readdle.spark) - A popular email client using Swift to share code between mobile iOS/Android and desktop macOS/Windows versions
- [flowkey](https://play.google.com/store/apps/details?id=com.flowkey.app) - An interactive piano learning app built with Swift for Android for almost a decade
- [MediQuo](https://play.google.com/store/apps/details?id=com.mediquo.main) - A healthcare app leveraging Swift for cross-platform development
- [Naturitas](https://play.google.com/store/apps/details?id=com.naturitas.android) - An organic products marketplace running Swift in production

## Coming up Next

Grassroots community efforts to run Swift on Android [began as soon as the language source was opened in 2015](https://lists.swift.org/pipermail/swift-dev/Week-of-Mon-20151207/000171.html),
and continue to this day. [The Android project board lists areas the workgroup determines important](https://github.com/orgs/swiftlang/projects/17),
such as easy debugging, now a high priority for us. While it [mostly works in limited use](https://github.com/swiftlang/llvm-project/issues/10831),
we need to test it more and make it easy to access. That will likely mean tying
the debugger and [Swift Language Server Protocol tool, sourcekit-lsp](/blog/gsoc-2025-showcase-code-completion/),
into editors like [Visual Studio Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/),
Android Studio, and [CodeEdit](https://www.codeedit.app/), another issue on our board.

### Sharing Logic Versus Sharing UI

A common concern is that we do not provide a cross-platform GUI toolkit. As we
write in [our draft vision document](https://github.com/swiftlang/swift-evolution/blob/807b844be42db582e434d1667fc907ae7a7a8775/visions/android.md),
the Android workgroup has no plans to create such a GUI toolkit, but will instead
curate a list of cross-platform UI tools. See [our recent post in the Swift forums](https://forums.swift.org/t/swift-gui-toolkits-for-android/83337)
listing a handful of popular and in-progress options.

### Diving in

Finally, we intend to bring you interviews and information from those using Swift
on Android already, as pioneers like [Readdle](https://readdle.com/blog/swift-for-android-our-experience-and-tools)
and [Flowkey](https://medium.com/@ephemer/why-we-put-an-app-in-the-android-play-store-using-swift-96ac87c88dfc)
have written about using Swift on Android for the last decade. The Left Bit's Pierluigi Cifani
[wrote about their experiences recently](https://forums.swift.org/t/thoughts-on-swift-for-android/80961),
gave [a great talk at NSSpain 2025 a couple months ago](https://youtu.be/EIGl6GOo210),
and was [interviewed by Swift Toolkit last month](https://www.swifttoolkit.dev/posts/dc-pier).

Swift on Android has been a community effort for the last decade, snowballing
from that initial patch to many businesses and developers making their livelihood
with it today. [Try out the preview SDK snapshots](/documentation/articles/swift-sdk-for-android-getting-started.html)
and help us make it even better!
