---
layout: new-layouts/post
published: true
date: 2026-05-04 12:00:00
title: "Swift on Android: the Past, Present, and Future"
author: [marcprux]
category: "Developer Tools"
---

The [Swift 6.3 release][swift63] in March 2026 marked the arrival of an officially supported Swift SDK for Android.[^swift63android] Together with macOS, iOS, Linux, and Windows, the addition of Android finally brings Swift platform support to every major consumer-facing operating system.

Reactions to this development on various internet forums tended to be of the variety: "Swift for Android wasn't on my 2026 bingo card!" And yet, Swift/Android integration work is by no means a recent endeavor. It is the outcome of more than a decade of community experimentation and tinkering that has gradually coalesced into a single unified and focused effort.

This post looks back at how Swift arrived on Android, describes what you can do with it today, and outlines some of the work ahead.

[swift63]: https://www.swift.org/blog/swift-6.3-released/

[^swift63android]: The Android section of the Swift 6.3 release announcement: <https://www.swift.org/blog/swift-6.3-released/#android>. The companion announcement post introducing the SDK in nightly form was [Announcing the Swift SDK for Android](https://www.swift.org/blog/nightly-swift-sdk-for-android/), followed by [Exploring the Swift SDK for Android](https://www.swift.org/blog/exploring-the-swift-sdk-for-android/), which walked readers through the SDK in detail.

## A Decade of Community Effort

Swift was [open-sourced][swiftopen] in December 2015,[^swiftopen] but experiments aimed at running Swift on Android predate even that open-source release. As soon as a Swift compiler binary landed on developer machines, a small set of contributors began trying to make it work on Android. What followed was ten years of independent efforts, the "prehistory" before they all eventually converged.

[swiftopen]: https://www.swift.org/blog/welcome/

[^swiftopen]: "Welcome to Swift.org," December 3, 2015: <https://www.swift.org/blog/welcome/>. The compiler, standard library, and core libraries became open source on this date. The earliest Swift on Android experiments cited in this post predate the open-source release by several months.

### Pre-2015: Early Experiments

The earliest published account of Swift running on Android is Romain Goyet's October 2015 article, *Running Swift code on Android*,[^goyet] which cobbled together a custom toolchain built from the not-yet-open-source compiler to produce an ARM binary that could execute on a rooted device. The article documents getting `puts("Hello, world!")` to run from `adb shell` and stops there. Despite the post's conclusion of "That was fun, but is of course useless", it established two facts that shaped the coming decade: Swift's LLVM-based codegen was suited to Android's various target architectures, and, with a bit of jiggery-pokery, the Swift runtime could be made to run on top of Android's Bionic libc with some effort.

[^goyet]: Romain Goyet, "Running Swift code on Android," October 14, 2015: <https://romain.goyet.com/articles/running_swift_code_on_android/>. This article was published *before* Swift was open-sourced (December 3, 2015) and relied on toolchain bits extracted from the then-proprietary Xcode distribution. It is, to our knowledge, the first published demonstration of Swift code executing on an Android device.

### 2016–2020: Various Toolchains and the First Shipping Apps

The next milestone was practical. In July 2016, Geordie Jay ([`@geordie_j`](https://forums.swift.org/u/geordie_j)) published *How we put an app in the Android Play Store using Swift*,[^ephemer] documenting the experience of shipping a customer-facing Android application that used Swift for its core logic. The app, *flowkey: Learn piano*, shares a Swift core between iOS and Android, with the Android UI written in Java and bridged to Swift over JNI. This pattern, sometimes called a "shared model" approach, became the dominant production use of Swift on Android for years afterward.[^sharedmodel] With an install base of over [5 million](https://play.google.com/store/apps/details?id=com.flowkey.app), the app stands as the oldest and one of the most widely-installed instances of Swift on Android to date.

[^ephemer]: Geordie J., "How we put an app in the Android Play Store using Swift," July 8, 2016: <https://medium.com/@ephemer/how-we-put-an-app-in-the-android-play-store-using-swift-67bd99573e3c>. The author later contributed back under the GitHub handle [@ephemer](https://github.com/ephemer); the associated [SwiftJava](https://github.com/SwiftJava/SwiftJava) project explored Swift/Java interop several years before swift-java existed in its current form.

[^sharedmodel]: For a contemporary treatment of this pattern, see [Native Swift on Android, Part 3: Using a shared native Swift model to power separate SwiftUI iOS and Jetpack Compose Android apps](https://skip.dev/blog/shared-swift-model/). The pattern's appeal is that business logic is written once and platform UI is written twice; it remains a common entry point for teams considering Swift on Android in brownfield projects.

In 2018, Andriy Druk ([`@andriydruk`](https://forums.swift.org/u/andriydruk)) of Readdle published *Swift for Android: Our Experience and Tools*,[^readdle] a longer account of integrating Swift into the Android version of the *Spark* email client. Readdle's contribution was sustained engineering: maintaining Swift on Android in production across compiler versions, NDK updates, and Android API levels. The article, along with the open-source [`swift-android-toolchain`](https://github.com/readdle/swift-android-toolchain) it accompanied, gave subsequent contributors a baseline to build on. With [millions](https://play.google.com/store/apps/details?id=com.readdle.spark) of downloads, Spark stands as another long-standing application of Swift on Android.

[^readdle]: Andriy Druk, "Swift for Android: Our Experience and Tools," Readdle, March 28, 2018: <https://readdle.com/blog/swift-for-android-our-experience-and-tools>. The accompanying [readdle/swift-android-toolchain](https://github.com/readdle/swift-android-toolchain) project remained one of the more comprehensive open-source build infrastructures for Swift on Android for several years and is an ancestor (in spirit, and in places in code) of much of the official toolchain that shipped in 6.3.

A parallel and equally important effort was Vlad Gorlov's ([`@v.gorlov`](https://forums.swift.org/u/v.gorlov)) [`swift-everywhere-toolchain`][swifteverywhere],[^vgorloff] an automated workflow for compiling a Swift Android cross-compilation toolchain on macOS. Gorlov maintained the project across many compiler releases and documented the process in detail, providing another well-trodden path for developers building Swift libraries for Android during a period when no official SDK existed.

[swifteverywhere]: https://github.com/vgorloff/swift-everywhere-toolchain

[^vgorloff]: [vgorloff/swift-everywhere-toolchain](https://github.com/vgorloff/swift-everywhere-toolchain) and the companion [swift-everywhere-samples](https://github.com/vgorloff/swift-everywhere-samples). Gorlov also wrote up the toolchain process at <https://dev.to/vgorloff/swift-on-android-building-toolchain-13jn>.

The most durable effort to emerge from this era began in early 2019, when [`@finagolfin`](https://forums.swift.org/u/finagolfin) submitted [the first patch][finapr] to add native Android build support to the upstream Swift compiler.[^finapr] Rather than reconstruct the full Android dependency stack from source, this effort piggybacked on [Termux][termux],[^termux] the Linux-on-Android terminal emulator that ships its own Debian-style package repository for ARM and x86 Android devices. The first practical demonstration was a [Termux build script][termuxbuild] that finagolfin announced on the Swift Forums in February 2020, and by June 2021 the SDK had grown into a full cross-compilation toolchain capable of producing AArch64, armv7, and x86_64 Android binaries from a Linux host.[^crossandroid] Maintained patiently across many subsequent Swift releases, this unofficial SDK became the de facto path to Swift on Android, and a substantial fraction of the official 6.3 SDK's lineage can be traced directly to it.

[finapr]: https://github.com/swiftlang/swift/pull/23208
[termux]: https://termux.dev
[swiftandroidsdk]: https://github.com/finagolfin/swift-android-sdk

[^finapr]: [`[android] Add support for natively building on Android`](https://github.com/swiftlang/swift/pull/23208), submitted March 11, 2019, merged August 5, 2019. The PR description credits earlier Swift-on-Android contributors @modocache, @zhuowei, @compnerd, @amraboelela, @drodriguez, and @futurejones, whose work made it possible.

[^termux]: [Termux](https://termux.dev) is a free, open-source Android application that provides a Debian-derived Linux package environment running on top of the Android system, without root. It ships prebuilt packages for hundreds of common Linux libraries (libicu, libcurl, libxml2, and others) compiled against the Android API. Its existence made early Swift Android work substantially easier than it would otherwise have been, since Swift's runtime and corelibs depend on libraries (notably ICU) that are difficult to cross-compile from scratch for Android.

[termuxbuild]: https://forums.swift.org/t/swift-for-android-call-for-the-community/32766/11

[^termuxbuild]: finagolfin, "Swift for Android: Call for the Community" (post #11), February 11, 2020: <https://forums.swift.org/t/swift-for-android-call-for-the-community/32766/11>. The post characterized the build script as *"a first step towards running the Swift toolchain natively on Android by using the Termux app."* The corresponding Termux package landed in [termux-packages PR #4895](https://github.com/termux/termux-packages/pull/4895) on February 17, 2020.

[^crossandroid]: finagolfin, "Cross-compilation Swift SDKs for Android," June 1, 2021: <https://forums.swift.org/t/cross-compilation-swift-sdks-for-android/49101>: *"There are now Swift 5.4 cross-compilation SDKs for AArch64, armv7, and x86_64 available, which you can use with a prebuilt Swift toolchain to cross-compile packages like swift-crypto or swift-system for Android with the Swift package manager."*

### 2021–2025: Advancement and Refinement

For most of the late 2010s and early 2020s, Swift on Android lurked on the periphery of the Swift project: a forum category,[^androidforum] a handful of forks, and a dedicated set of contributors keeping their toolchains alive across compiler releases. Mainline Swift continued to add Android-related plumbing such as Bionic libc support in the standard library and ELF output in the linker driver, but a complete, easy-to-install SDK remained out of reach for casual users. Building the toolchain yourself, often from one of finagolfin's nightly artifacts, was the typical path.

[^androidforum]: The Android category on the Swift Forums has existed since the forums themselves: <https://forums.swift.org/c/development/android/>. It is the de facto coordination point for Swift on Android development discussions, both during the period described here and now under the Workgroup's stewardship.

Other contributors who deserve special mention from this period:

- [Andriy Druk (@andriydruk)](https://github.com/andriydruk) of Readdle, who turned the *Spark* port experience into a public toolchain that many later efforts depended on.
- [Vlad Gorlov (@vgorloff)](https://github.com/vgorloff), whose `swift-everywhere-toolchain` was a parallel community-maintained build pipeline and a useful reference for anyone debugging cross-compilation issues.
- [Saleem Abdulrasool (@compnerd)](https://github.com/compnerd), longtime maintainer of the [Swift on Windows](https://www.swift.org/blog/swift-everywhere-windows-interop/) port. His work on portable, non-Darwin Swift around Foundation, dispatch, and the toolchain driver has benefited every non-Apple Swift platform.[^compnerd]
- [Alexis Laferrière (@hyp)](https://github.com/hyp), whose work on the compiler driver and SDK packaging shaped the form factor that the official SDK eventually took.
- [Geordie Jay (@ephemer)](https://github.com/ephemer), who returned to the project after a hiatus and continues to contribute to interop tooling.
- [Mark Stoker (@mstokercricut)](https://github.com/mstokercricut) and his colleagues at Cricut, whose production deployment of Swift on Android validated improvements in the SDK.

[^compnerd]: Of particular note is [SE-0387: Swift SDKs for Cross-Compilation](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0387-cross-compilation-destinations.md), which landed in Swift 6.1 and provides the `.artifactbundle` mechanism that the Android SDK ships in alongside the WebAssembly and Static Linux SDKs. SE-0387 is one of the foundational pieces that made an official Android SDK feasible without requiring host-toolchain changes.

The pattern through these years was consistent: Swift on Android worked, but it worked because individuals chose to make it work, often without coordination and often duplicating each other's efforts. The toolchains were existent yet fragile, with no published release cadence and no obvious onboarding path for newcomers. Constant vigilance and patching was required in order to repair accidental breakage caused by upstream changes that didn't consider the Android platform or include it in their testing.

### 2025: Consolidation and Coordination

In February 2025, contributors from a number of organizations proposed a [Swift on Android Community Working Group][cwg] in the Swift forums.[^cwg] The proposal, spearheaded by Joannis Orlandos ([`@joannis_orlandos`](https://forums.swift.org/u/joannis_orlandos)), was straightforward: there was sustained activity but no coordination layer, and the community group would provide one. A few months later, the Swift Platform Steering Group elevated it to an [official Workgroup][awg].[^awg] At that point, Android became a chartered area of work within the Swift project itself.

[cwg]: https://forums.swift.org/t/swift-on-android-working-group/77780
[awg]: https://forums.swift.org/t/announcing-the-android-workgroup/80666

[^cwg]: "Swift on Android Working Group" (Community Showcase post), February 10, 2025: <https://forums.swift.org/t/swift-on-android-working-group/77780>. The post outlines initial scope: SDK packaging, toolchain CI, Foundation feature parity on Android, and coordination of upstreaming work. It explicitly framed the group as a *community* working group, since its creation predated Steering Group endorsement.

[^awg]: "Announcing the Android Workgroup," June 25, 2025: <https://forums.swift.org/t/announcing-the-android-workgroup/80666>. The transition from community group to officially chartered Workgroup, with a defined scope, governance structure, and permanent home at <https://www.swift.org/android-workgroup/>. The Workgroup meets regularly and posts notes to the [Android category](https://forums.swift.org/c/development/android/) on the forums.

What followed was the unglamorous work that does not make for an exciting blog post but is what gets platform support across the line: continuous integration, packaging cleanups, removing accreted dependencies that did not belong in a supported toolchain, harmonizing the SDK structure with the [Static Linux][slsdk] and [WebAssembly][wasmsdk] cross-compilation SDKs, and constant bug fixing. Much of the nuts-and-bolts work was contributed by finagolfin with help from [Skip.dev](https://skip.dev)'s Marc Prud'hommeaux ([`@marcprux`](https://forums.swift.org/u/marcprux)). By the time of the [nightly SDK announcement][nightly] in October 2025, the Android SDK was structurally indistinguishable from any other Swift SDK from a developer's perspective. The 6.3 release in March 2026 is where that work shipped.

[slsdk]: https://www.swift.org/blog/introducing-the-fully-static-linux-sdk-for-swift/
[wasmsdk]: https://www.swift.org/blog/webassembly-getting-started/
[nightly]: https://www.swift.org/blog/nightly-swift-sdk-for-android/

## What Swift on Android Supports Today

With Swift 6.3 shipped, the question shifts from "is Swift on Android possible?" to "what can it do today, and where are the boundaries?"

### What Works

The Swift SDK for Android is a [cross-compilation SDK][se0387]: a self-contained bundle of headers, libraries, and metadata that lets a Swift toolchain running on macOS or Linux produce binaries that execute on Android, in much the same way the iOS SDK lets macOS produce iOS binaries. It is distributed as an `.artifactbundle` consumed by the standard `swift build --swift-sdk` flow, building for `aarch64-unknown-linux-android28`, `armv7-unknown-linux-android28`, and `x86_64-unknown-linux-android28` targets.[^arches] It provides:

[se0387]: https://github.com/swiftlang/swift-evolution/blob/main/proposals/0387-cross-compilation-destinations.md

- The full Swift standard library.
- [`Foundation`][foundation], built on the [swift-foundation][sfoundation] reimplementation that is now the standard non-Darwin Foundation.
- [`Dispatch`][dispatch].
- [`Observation`][observation].
- Both the legacy `XCTest` and the new `Testing` frameworks.[^testing]
- An `Android` system module (analogous to `Glibc` or `Darwin`) for direct access to Bionic and the NDK.

[foundation]: https://github.com/swiftlang/swift-foundation
[dispatch]: https://github.com/swiftlang/swift-corelibs-libdispatch
[observation]: https://github.com/swiftlang/swift/tree/main/stdlib/public/Observation
[sfoundation]: https://www.swift.org/blog/foundation-preview-now-available/

[^arches]: The SDK currently targets Android API level 28 and above, corresponding to Android 9.0 (Pie) and newer. This covers the bulk of in-use Android devices but excludes some long-tail older devices. The rationale for target and API level support and ongoing discussion are tracked at [Android SDK packaging and build system considerations](https://forums.swift.org/t/android-sdk-packaging-build-system-considerations/79761).

[^testing]: Support for the new Swift Testing framework on Android landed during the 6.3 cycle and is tracked in [Testing on Android](https://forums.swift.org/t/testing-on-android/84300). Earlier preview SDKs supported only XCTest, which made porting test suites from Linux less straightforward than it should have been; that gap is now closed.

The SDK does not aim to provide anything outside of the core set of modules, such as Apple-specific iOS/macOS frameworks. As with Swift on other non-Darwin platforms, the rule of thumb is that if a framework is not available on Linux, it is not available on Android. So `CoreGraphics`, `CloudKit`, `HealthKit`, `UIKit`, and `SwiftUI` are not present, and the SDK does not attempt to reimplement them. The [getting-started guide][gsguide] on swift.org goes through the SDK shape in detail.

### Talking to the Android Platform

The [getting-started guide][gsguide] on swift.org goes through the process of installing and configuring the Swift SDK for Android, as well as demonstrating the creation of a simple command-line program that can be executed via the Android `adb shell` console.

A "Hello, world!" CLI is a milestone and a neat demo; but it is not a complete Android app. Real Android applications are packaged into an `.apk` archive and interface heavily with the Android SDK, which presents a Java/Kotlin API surface. Bridging between Swift and Java is therefore a central requirement for using Swift in a real Android app, and the Swift project's approach is the [`swift-java`][swiftjava] package,[^swiftjava] which is a nascent but maturing project.

[gsguide]: https://www.swift.org/documentation/articles/swift-sdk-for-android-getting-started.html
[swiftjava]: https://github.com/swiftlang/swift-java

[^swiftjava]: swift-java was originally introduced for server-side Swift/Java interop, where the use case is Swift code calling into established Java libraries (e.g., on the JVM). Android shares many of the underlying mechanics (JNI, classpath, references) but adds constraints that server-side use cases do not have, particularly around app packaging, resource management, and lifecycle. The Workgroup has been working with the swift-java team to ensure that Android's needs are reflected in the project's design. See the [Java Interoperability with swift-java](https://forums.swift.org/c/development/swift-java/) category for ongoing discussion.

`swift-java` provides bidirectional bridging. Swift code can call Java APIs (including the Android SDK), and Java code can call exposed Swift APIs. The ergonomics differ from the Objective-C interop on Darwin platforms because JNI is a more verbose foreign function interface than the Objective-C runtime, but the conceptual shape will be familiar to anyone who has used `@objc` or imported a C library.

Android adds specific considerations on top of the general Swift/Java interop story:

- **Lifecycle.** Android applications are managed by the system, not by `main()`. A Swift binary on Android is typically a shared library (`.so`) loaded into a host JVM process. Runtime initialization, signal handling, and process termination are all choreographed by the Android Runtime (ART).
- **Linkage.** Android imposes specific constraints on how shared libraries are loaded. `libc++_shared.so` must be packaged alongside Swift libraries; certain symbols from the NDK are versioned per API level; and ELF metadata such as `DT_HASH` and `DT_GNU_HASH` must be present in a form that the Android dynamic linker accepts.[^elflinker]
- **App size.** Swift's runtime, Foundation, and ICU contribute a meaningful baseline to the size of an Android app. The Workgroup is actively working on reducing this; it remains the most-asked-about characteristic of the SDK.[^appsize]
- **Debugging.** LLDB on Android is functional but not yet the seamless experience that LLDB on Darwin or Linux is. Improvements are tracked in the forums.[^debug]

[^elflinker]: A representative example: <https://github.com/finagolfin/swift-android-sdk/issues/67> documents how missing ELF hash sections caused `dlopen` failures in some Android versions, and Skip's documentation describes the corresponding [`doNotStrip`](/docs/dependencies/) Gradle workaround. Most users will never need to know any of this exists, but the SDK has to handle it.

[^appsize]: "Android app size and lib FoundationICU.so": <https://forums.swift.org/t/android-app-size-and-lib-foundationicu-so/78399>. The current proposed approach involves thinning ICU data, which is responsible for a disproportionate share of the Foundation install size.

[^debug]: "Swift debugging on Android: current state": <https://forums.swift.org/t/swift-debugging-on-android-current-state/84155>. Debugger support is a multi-quarter effort involving LLDB upstream, the Android NDK, and IDE integrations.

These are known issues, in scope for the Workgroup. None are blocking for the cases the SDK is designed to serve today.

### What the Workgroup Does and Doesn't Do

A frequent question from developers coming from Apple platforms is: "When will we get an official cross-platform `SwiftUI` for Android?" The Workgroup's [scope][awgscope] is intentionally narrower than that question implies.

[awgscope]: https://www.swift.org/android-workgroup/

The Android Workgroup is responsible for foundational platform support: the compiler, the standard library, Foundation, the SDK packaging, and integration with the broader Swift toolchain. It is not responsible for higher-level application frameworks. SwiftUI for Android, a Compose-bridged UI layer, an Android-aware analog to UIKit: these are all out of scope.

This is the same philosophy the Swift project has applied on Linux, Windows, and other non-Darwin platforms. The project ships the language, the standard library, and the SDK, and ecosystem projects build the application-development stories on top. On Linux that has meant projects like [Vapor][vapor]. On Windows it has meant projects like [SwiftWin32][swiftwin32]. On Android the analogous role is filled by [Skip.dev][skip],[^skip] which builds on the Swift SDK to provide a complete dual-platform Swift app development experience: SwiftUI on iOS rendered as native Jetpack Compose on Android, shared `@Observable` state, a unified `Package.swift`-based project layout, and Xcode integration.

[vapor]: https://vapor.codes
[swiftwin32]: https://github.com/compnerd/swift-win32
[skip]: https://skip.dev

[^skip]: Disclosure: this post's author is a co-founder of Skip and a founding member of the Android Workgroup. The Workgroup itself has [members from several organizations](https://www.swift.org/android-workgroup/), and the work described here is the result of contributions from many of them. Skip is referenced as the most fully developed example of a higher-level Swift application development environment on Android, and therefore the most useful concrete reference for "what becomes possible once the SDK exists." It is not the only consumer of the SDK.

The separation of concerns has worked well historically and we expect it to work well here. The separate layers are a symbiotic relationship: the Android workgroup progress unlocks new low-level capabilities, and ecosystem usage in production validates the SDK in the real world of app development.

### What's in the Ecosystem

A useful proxy for "is this platform real?" is the state of the package ecosystem. As of this writing, the [Swift Package Index][spi] reports more than 2,200 Swift packages building successfully for Android.[^spi] That includes most of the Swift Server Workgroup and [swift-system][systemwg] core packages, along with [Alamofire][alamofire], [SwiftSoup][swiftsoup], [swift-protobuf][swiftprotobuf], [flatbuffers][flatbuffers], [swift-collections][swiftcollections], [swift-crypto][swiftcrypto], [swift-log][swiftlog], and [Yams][yams], among many others.

[spi]: https://swiftpackageindex.com/search?query=platform%3Aandroid
[systemwg]: https://swiftpackageindex.com/apple/swift-system
[alamofire]: https://swiftpackageindex.com/Alamofire/Alamofire
[swiftsoup]: https://swiftpackageindex.com/scinfu/SwiftSoup
[swiftprotobuf]: https://swiftpackageindex.com/apple/swift-protobuf
[flatbuffers]: https://swiftpackageindex.com/google/flatbuffers
[swiftcollections]: https://swiftpackageindex.com/apple/swift-collections
[swiftcrypto]: https://swiftpackageindex.com/apple/swift-crypto
[swiftlog]: https://swiftpackageindex.com/apple/swift-log
[yams]: https://swiftpackageindex.com/jpsim/Yams

[^spi]: The Swift Package Index team's post [Adding Wasm and Android compatibility testing](https://swiftpackageindex.com/blog/adding-wasm-and-android-compatibility-testing) documents the infrastructure that produces this data; results update on each commit and are visible per-package. As of May 2026, roughly 30% of the ~9,000 packages indexed by SPI build successfully for Android.

Porting your own Swift packages to work on Android is a fairly rote task at this point. Assuming you are not dependent on any packages or frameworks that are unavailable for Android, the process typically requires just a few changes to imports. If your package already builds for Linux, adding Android support is often a trivial process[^porting]. And if your package is hosted on GitHub, you can add the [swift-android-action] workflow to your package's CI to ensure that future changes continue to build and pass testing against Android.

[^porting]: A porting guide for Swift can be seen at <https://skip.dev/docs/porting/>

[swift-android-action]: https://github.com/marketplace/actions/swift-android-action

## What's Next

Three threads of work define the Workgroup's near-term roadmap.

### Lowering the Cost of Adoption

The most common practical concern from developers evaluating Swift on Android is binary size. A trivial Swift app on Android currently carries around 60 MB of runtime, Foundation, and ICU baggage. This is a fixed cost that does not scale with app complexity, but it is unfamiliar to Java/Kotlin developers and can be hard to justify to product managers. Reducing it, principally by thinning ICU, is a priority.[^appsize2]

[^appsize2]: See the [Android app size](https://forums.swift.org/t/android-app-size-and-lib-foundationicu-so/78399) discussion. The work splits between data files we can omit by default and Foundation features that conditionally pull in ICU; both threads are progressing.

Build times are another adoption-cost issue. The Swift compiler is the same binary used for any other target, so most build-time improvements come for free with toolchain updates, but building native libraries for an Android app typically requires building the same target(s) for multiple architectures. Android-specific aspects (packaging, JNI shimming, Gradle integration) have opportunities for standardization and streamlining.

### Smoothing Interop

Interoperability efforts with `swift-java` and other projects is moving fast, but rough edges remain. Future iterations will invest in:

- Reducing the boilerplate required to expose Swift APIs to Java callers and vice versa.
- Improving error reporting when bindings drift from their declarations.
- Aligning the conventions used by Android-specific binding generators (such as those in projects like Skip) with what `swift-java` produces directly, so that there is one increasingly canonical way to bridge.

The eventual goal is parity of *expectation*: a Swift developer using a Java library on Android should have an experience comparable to a Swift developer using a C library or an Objective-C framework on Darwin platforms.

### An Open and Welcoming Community

The Android Workgroup welcome new outside contributors, and makes an effort to provide an open and inclusive environment. Useful entry points:

- The [Android category on the Swift Forums][androidforumlink] is the day-to-day coordination surface. Workgroup meeting notes, proposals, and discussion all happen there.
- The [Swift on Android Workgroup home][awgscope2] on swift.org lists current members, the charter, and standing meetings.
- The [Swift Open Source Slack](https://swift-open-source.slack.com/) has an `#android` channel with lively discussions.
- The [`swiftlang/swift`][swiftrepo], [`swiftlang/swift-foundation`][foundationrepo], and [`swiftlang/swift-java`][swiftjavarepo] repositories all accept Android-related issues and pull requests.
- For developers who want to *consume* Swift on Android rather than work on the SDK itself, the [Swift Package Index Android view][spi2] makes it easy to find packages to use, and to identify packages that do not yet build for Android and could use a contribution.

[androidforumlink]: https://forums.swift.org/c/platform/android/
[awgscope2]: https://www.swift.org/android-workgroup/
[swiftrepo]: https://github.com/swiftlang/swift
[foundationrepo]: https://github.com/swiftlang/swift-foundation
[swiftjavarepo]: https://github.com/swiftlang/swift-java
[spi2]: https://swiftpackageindex.com/search?query=platform%3Aandroid

We particularly welcome contributions from developers shipping production Swift code on Android. Bug reports from real apps help identify real-world usage patterns that contrived unit tests do not.

## The Final Frontier

When Swift was first inaugurated as an open-source project, the supported platform coverage was sparse: Darwin platforms plus Linux. Over the following decade that list grew to include Windows,[^win] WebAssembly,[^wasm] and a long tail of embedded targets, from the [Raspberry Pi][rpi] to the [Playdate][playdate] handheld. Android has long been one of the most conspicuous remaining absences: a major consumer operating system with a vast installed userbase, the second of the two dominant mobile platforms, and the one whose absence imposed the steepest cost on developers who wanted to ship multi-platform apps from a shared Swift codebase. With Swift 6.3 the list is now complete in the consumer-OS sense. Swift runs officially on macOS, iOS, Linux, Windows, and Android.

[rpi]: https://www.swift.org/blog/embedded-swift-examples/
[playdate]: https://www.swift.org/blog/byte-sized-swift-tiny-games-playdate/

[^win]: "Swift on Windows: Interop & Beyond," <https://www.swift.org/blog/swift-everywhere-windows-interop/>. The Windows port is an instructive precedent for the Android effort: a single dedicated maintainer (compnerd) carried the work across multiple Swift releases before it was institutionalized, and the SDK shape that emerged informed the design of the cross-compilation SDK format that Android now uses.

[^wasm]: "Getting Started with WebAssembly," <https://www.swift.org/blog/webassembly-getting-started/>. WebAssembly, like Android, ships as a Swift SDK in `.artifactbundle` form. The two SDKs share structural infrastructure despite targeting wildly different runtime environments.

Much still remains to be done: filling in the interoperability gaps, reducing app size, improving the debugging story, and onboarding the developers who have been waiting for this to be official before they took a closer look. But the foundational question — *Can I create an Android app in Swift?* — now has an answer: *Yes*.

We hope you will join in the effort, and consider expanding the reach of your Swift codebase to new and exciting frontiers!
