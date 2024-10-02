---
layout: new-layouts/blog
date: 2019-02-11 10:00:00
title: Evolving Swift On Apple Platforms After ABI Stability
author: jckarter

---

With the release of Swift 5.0, Swift is now ABI stable and is delivered as a core component of macOS, iOS, tvOS, and watchOS. ABI stability has been a goal for Swift since its inception, and brings with it many benefits for developers and users of these platforms:

* Most obviously, applications written in Swift no longer need to be distributed with the Swift runtime libraries, reducing download size.
* The Swift runtime can be more deeply integrated and optimized with these host operating systems, allowing Swift programs to launch faster, get better runtime performance, and use less memory.
* Apple will be able to deliver platform frameworks using Swift in future OSes.
* When a future version of Swift also provides [module stability](/blog/abi-stability-and-more/#module-stability), third parties will also be able to ship binary frameworks written in Swift.

However, as a result of this, the Swift runtime is now *a component of the user's target operating system* rather than part of the developer's toolchain. As a consequence, in the future, for a Swift project to adopt new Swift runtime and standard library functionality, it may also have to require new OS versions that include an updated Swift runtime supporting the added features. This tradeoff between adopting new language features and frameworks or maintaining compatibility with older OS versions has always existed for Objective-C and Apple system frameworks, and will now be a factor for Swift as well.

**What kinds of language features and evolution proposals may be limited to future OS versions?**

Any feature that requires new Swift runtime or standard library support may be subject to OS availability restrictions. This includes:

* Additions to the standard library, including new types, protocols, protocol conformances, functions, methods, or properties.
* Changes to Swift's type system, such as new kinds of types, new modifiers to existing types (such as function type attributes), new bridging, subtyping, and/or dynamic casting relationships, etc.

The Core Team will consider the backward compatibility impact of new proposals as they go under review going forward.

**Does ABI stability affect my ability to use Swift 4.0 or 4.2 mode to maintain source compatibility with my existing code? Will it affect my ability to change to new language modes in the future?**

No. The language compatibility setting is a purely compile-time feature that is used to control source compatibility. It does not affect ABI. You do not need to migrate Swift 4 code to Swift 5 mode in order to use Swift 5's stable ABI, and going forward, new language modes can be adopted without imposing a newer OS requirement if language features that require new runtime features are not used.

**Will I have to recompile my existing Swift apps with Xcode 10.2 to run on the latest operating systems?**

Existing Swift binaries with bundled Swift runtime libraries will continue to run on macOS 10.14.4, iOS 12.2, tvOS 12.2, watchOS 5.2, and future OS versions. These apps will continue to run using their bundled Swift runtime, since these older Swift runtimes are not compatible with the stable Swift ABI. The Swift runtime in the OS is designed to be mutually ignorant of any bundled Swift runtimes, so it will see classes defined by the app's bundled Swift runtime as plain Objective-C classes, and the bundled Swift runtime will likewise see Swift classes from the OS as plain Objective-C classes. Apps using bundled runtimes will however not get the benefits of App Store app thinning.

**Will an app built with Swift 5 run on any version of macOS before 10.14.4?**

Swift 5 does not require apps to raise their minimum deployment target.

Apps deploying back to earlier OS releases will have a copy of the
Swift runtime embedded inside them.  Those copies of the runtime will be
ignored — essentially inert — when running on OS releases that ship with the
Swift runtime.

**Can I choose to bundle a newer Swift runtime with my apps going forward to be able to use new runtime features without requiring a new OS?**

This will not be possible for a number of reasons:

* The coexistence functionality that is used to maintain compatibility with pre-stable Swift runtimes depends on there being no more than two Swift runtimes active in a single process, and that all Swift code using the pre-stable runtime is self-contained as part of the app. If the same mechanism were used to allow a newer Swift runtime to be bundled to run alongside the OS Swift runtime, the new runtime would have no access to Swift libraries in the OS or ABI-stable third-party Swift libraries linked against the OS runtime.
* Outright replacing the OS runtime with a bundled runtime would circumvent the security of the system libraries, which are code-signed based on their using the OS version of the runtime.
* Furthermore, if the OS Swift runtime could be replaced, this would add a dimension to the matrix of configurations that the OS, Swift runtime, and third-party libraries and apps all have to be tested against. "DLL hell" situations like this make testing, qualifying, and delivering code more difficult and expensive.
* By being in the OS, the Swift runtime libraries can be tightly integrated with other components of the OS, particularly the Objective-C runtime and Foundation framework. The OS runtime libraries can also be incorporated into the dyld shared cache so that they have minimal memory and load time overhead compared to dylibs outside the shared cache. Eventually, it may be impossible for a runtime built outside the OS to fully replicate the behavior of the OS runtime, or doing so may come with significant performance costs when constrained to using stable API.

**Is there anything that can be done to allow runtime support for new Swift features to be backward deployed to older OSes?**

It may be possible for some kinds of runtime functionality to be backward deployed, potentially using techniques such as embedding a "shim" runtime library within an app.  However, this may not always be possible.  The ability to successfully backward-deploy functionality is fundamentally constrained by the limitations and existing bugs of the shipped binary artifact in the old operating system. The Core Team will consider the backward deployment implications of new proposals under review on a case-by-case basis going forward.
