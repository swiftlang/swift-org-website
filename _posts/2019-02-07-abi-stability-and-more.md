---
layout: new-layouts/blog
date: 2019-02-07 10:00:00
title: ABI Stability and More
author: jrose

---

It has been a longstanding goal to stabilize Swift’s ABI on macOS, iOS, watchOS, and tvOS.  While a stable ABI is an important milestone for the maturity of any language, the ultimate benefit to the Swift ecosystem was to enable binary compatibility for apps and libraries.  This post describes what binary compatibility means in Swift 5 and how it will evolve in future releases of Swift.

You may ask: what about other platforms?  ABI stability is implemented for each operating system that it compiles and runs on. Swift's ABI is currently declared stable for Swift 5 on Apple platforms. As development of Swift on Linux, Windows, and other platforms matures, the Swift Core Team will evaluate stabilizing the ABI on those platforms.

Swift 5 provides binary compatibility for apps: a guarantee that going forward, an app built with one version of the Swift compiler will be able to talk to a library built with another version. This applies even when using the compatibility mode with older language versions (`-swift-version 4.2`).

![Take an app built with Swift 5, using a compiler that supports ABI stability.]({{ site.baseurl }}/assets/images/abi-stability-blog/abi-stability.png)

In this example, an app built with Swift 5.0 will run on systems that have a Swift 5 standard library installed, as well as those with a hypothetical Swift 5.1 or Swift 6.

_(all version numbers past Swift 5.0 in this post are hypothetical, of course)_

ABI stability for Apple OSes means that apps deploying to upcoming releases of those OSes will no longer need to embed the Swift standard library and “overlay” libraries within the app bundle, shrinking their download size; the Swift runtime and standard library will be shipped with the OS, like the Objective-C runtime.

More information on how this affects apps submitted to the App Store is available in the [Xcode 10.2 release notes][relnote].


[relnote]: https://developer.apple.com/documentation/xcode_release_notes/xcode_10_2_beta_release_notes/swift_5_release_notes_for_xcode_10_2_beta


## Module Stability

ABI stability is about mixing versions of Swift at *run time.* What about compile time? Right now, Swift uses an opaque archive format called "swiftmodule" to describe the interface of a library, such as a framework "MagicKit", rather than manually-written header files. However, the "swiftmodule" format is also tied to the current version of the compiler, which means an app developer can't `import MagicKit` if MagicKit was built with a different version of Swift. That is, the app developer and the library author have to be using the same version of the compiler.

To remove this restriction, the library author needs a feature currently being implemented called *module stability.* This involves augmenting the opaque format with a textual summary of a module, similar to what you see in Xcodeʼs "Generated Interface" view, so that clients can use a module without having to care what compiler it was built with. You can read more about that [on the Swift forums][module stability].

![Let's say support for module stability ships with Swift 6.]({{ site.baseurl }}/assets/images/abi-stability-blog/module-stability.png)

As an example, you could build a framework using Swift 6, and that framework's interface would be readable by both Swift 6 and a future Swift 7 compiler.

_Again, all Swift version numbers here are hypothetical._

[module stability]: https://forums.swift.org/t/plan-for-module-stability/14551

## Library Evolution

Up until now, we've been talking about changing the compiler but keeping the Swift code the same. What about changes to libraries that an app is using? Today, when a Swift library changes, any apps using that library have to be recompiled. This has some advantages: because the compiler knows the exact version of the library the app is using, it can make additional assumptions that reduce code size and make the app run faster. But those assumptions might not be true for the next version of the library.

This feature is *library evolution support:* shipping a new version of a library *without* having to recompile its clients. This happens when Apple updates the libraries in an OS, but it's also important when one company's binary framework depends on another company's binary framework. In this case, updating the second framework would ideally not require recompiling the first framework.

![When an app is built, it has an expectation of what APIs are available based on the compile-time interfaces of the framework it's using. Resilience allows the framework to change without disrupting that interface, allowing the app to run using different versions of the framework.]({{ site.baseurl }}/assets/images/abi-stability-blog/library-evolution.png)

In this example, the app is built against the original version of the framework, in yellow. With support for library evolution, it will run on systems that have the yellow version available, but also the newer, improved red version.

Swift already has an implementation of support for library evolution, informally termed "resilience". It's an opt-in feature for libraries that need it, and it uses not-yet-finalized annotations to strike a balance between performance and future flexibility, which you can see in the source code for the standard library. The first of these to go through the Swift Evolution Process was `@inlinable`, added in Swift 4.2 ([SE-0193](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0193-cross-module-inlining-and-specialization.md)). Look for more proposals about library evolution support in the future.

[fragile base class problem]: https://en.wikipedia.org/wiki/Fragile_base_class


## Summary

{% comment %}
This table has non-breaking spaces in it to prevent the first and last columns from being overly compressed by the site CSS.
{% endcomment %}

| When Swift has... | ...then you can change... | Status |
|--:|:-:|:--|
| ABI&nbsp;Stability | the Swift<br/>standard library | Swift 5 on macOS, iOS, watchOS, and tvOS |
| Module&nbsp;Stability<br/>_(and&nbsp;ABI&nbsp;stability)_ | compilers | Under&nbsp;active&nbsp;development |
| Library Evolution Support | your library's APIs | Largely implemented but needs to go through the Swift Evolution Process |

# Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/swift-org-blog-abi-stability-and-more/20250) on the [Swift forums][].

[Swift forums]: https://forums.swift.org
