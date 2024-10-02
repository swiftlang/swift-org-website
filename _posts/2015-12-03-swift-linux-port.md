---
layout: new-layouts/blog
published: true
date: 2015-12-03 11:01:01
title: The Swift Linux Port
---

With the launch of the open source Swift project, we are also releasing
a port that works with the Linux operating system! You can build it from
the Swift sources or [download pre-built binaries for Ubuntu]. The port
is still a work in progress but we're happy to say that it is usable
today for experimentation. Currently x86_64 is the only supported
architecture on Linux.

Here are a few highlights of what's working in the port today:

* **Swift without the Objective-C Runtime**: Swift on Linux does not
  depend on the Objective-C runtime nor includes it. While Swift was
  designed to interoperate closely with Objective-C when it is present,
  it was also designed to work in environments where the Objective-C
  runtime does not exist.

* **The core Swift Language and [Standard Library]** on Linux shares most of
  the same implementation and APIs as on Apple platforms. There are some
  slight differences of behavior because of the absence of the
  Objective-C runtime on Linux (noted below).

* **The Glibc Module**: Most of the Linux C standard library is available
  through this module similar to the Darwin module on Apple platforms.
  Some headers aren't yet imported into the module, such as tgmath.h.

  To try it out, just `import Glibc`.

* **Swift Core Libraries**: The [Core Libraries] provide implementations
  of core APIs from Foundation and XCTest to be used on Linux without
  Objective-C . The intention is that these APIs are available in a
  cross-platform manner regardless of whether you are using Swift on
  Apple's platforms or Swift on Linux.

* **LLDB Swift debugging and the REPL**: You can [debug your Swift
  binaries] and [experiment in the REPL] just like you do on macOS.

* **The Swift Package Manager** is a first class citizen as it is on
  Apple's platforms.

Here are some things that aren't quite working yet or are planned for
the future:

* **libdispatch**: Part of the Core Libraries, updated Linux support is
  in progress. You can follow development on the [libdispatch project on
  GitHub].

* **Some C APIs**: Although this is generally true for all of our
  supported platforms, a few constructs in C aren't imported yet into
  Swift. This will cause some APIs to be unavailable, such as those that
  contain varargs / `va_list`. However, in recent months Swift's
  interoperability with C has significantly advanced, gaining support
  for named and anonymous unions, anonymous structs, and bitfields.

* **Some `String` APIs**: The Standard Library's `String` is missing implementations
  of several important APIs because they are currently tied to the
  implementation of `NSString` on Apple's platforms.

* **Runtime Introspection**: When a Swift class on Apple's platforms is
  marked `@objc` or subclasses `NSObject` you can use the Objective-C
  runtime to enumerate available methods on an object or call methods
  using selectors. Such capabilities are absent because they depend on
  the Objective-C runtime.

* `Array<T> as? Array<S>`: Some mechanisms, such as casting
  containers with different associated types, currently do not work as
  they relied on bridging mechanisms with Objective-C.

We're really excited to be able to release the open source project with
a great head start for Linux support that you can try right now! There
is still plenty of work to be done, so we hope to see you [contribute to
Swift] to make the Linux port even more complete.

[Standard Library]: /documentation/standard-library/
[Core Libraries]: /documentation/core-libraries/
[libdispatch project on GitHub]: https://github.com/apple/swift-corelibs-libdispatch
[download pre-built binaries for Ubuntu]: /download/
[contribute to Swift]: /contributing/
[debug your Swift binaries]: /getting-started/#using-the-lldb-debugger
[experiment in the REPL]: /getting-started/#using-the-repl
