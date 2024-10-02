---
layout: new-layouts/blog
published: true
date: 2016-1-29
title: "It's Coming: the Great Swift API Transformation"
author: dabrahams
---

Cocoa, the Swift standard library, maybe even your own types and
methods—it's all about to change, and you can help determine how.

Ever since before Swift was released, there's been a style gap between
Cocoa interfaces and APIs in the Swift standard library; lots of
things just look *different*, often needlessly so. This is no mere
aesthetic concern; non-uniformity and lack of predictability make
everything harder, from coding to debugging to maintenance.
Fortunately Swift developers created tons of great code in spite of
that gap, and along the way, there evolved a sense of what
“Swifty” code looks and feels like.

Informed by that experience, when looking at our APIs, it's easy to
see there's room for improvement, both in the way the compiler imports
Objective-C APIs—where the results just don't seem quite comfortable
in Swift—and in the Swift standard library, which lacks a level of
regularity and coherence that Cocoa users have come to expect. So we
at Apple decided to do something about it.

In order to converge Cocoa and the standard library, we needed a
target to shoot for: a unified, written approach to API design that
everyone could follow.  We started by going back and questioning all
our old assumptions.  Existing guidelines were fantastic, but much of
the material was geared to Objective-C, didn't cover Swift-specific
features such as default arguments, and more importantly, were not
informed by the emergent sense of “Swiftiness” that we felt was so
important to capture.

As we developed these guidelines we applied them to the standard
library, all of Cocoa, and a couple of sample projects. We evaluated
the results, refined, and repeated.  Before Swift went open source,
we'd have done this all behind closed doors, and presented you with
the results in the next release, but a new era has dawned on Swift:
it's time to show the world what we've been up to.  Here's a tiny
example of how code looks before transformation:

~~~swift
class UIBezierPath : NSObject, NSCopying, NSCoding { ... }
...
path.addLineToPoint(CGPoint(x: 100, y: 0))
path.fillWithBlendMode(kCGBlendModeMultiply, alpha: 0.7)
~~~

and after:

~~~swift
class UIBezierPath : Object, Copying, Coding { ... }
...
path.addLineTo(CGPoint(x: 100, y: 0))
path.fillWith(kCGBlendModeMultiply, alpha: 0.7)
~~~

We've put three parts of this proposed transformation up for public
review in [Swift's evolution group](/community/#mailing-lists):
[changes to how Cocoa is imported](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0005-objective-c-name-translation.md),
[changes to the surface of the standard library](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0006-apply-api-guidelines-to-the-standard-library.md),
and the
[API guidelines](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0023-api-guidelines.md)
that tie this all together. Suggestions for improvement have already
started coming in
from participants, and we're able to see how they
[affect APIs](https://github.com/apple/swift-3-api-guidelines-review/pull/5/files).

For example,
[one suggestion](http://news.gmane.org/find-root.php?message_id=3C5040B3%2dA205%2d46FA%2d98D3%2d5696D678EB39%40gmail.com)
we've
[explored](http://news.gmane.org/find-root.php?message_id=18A8335F%2d65F3%2d46A1%2dA494%2dAA89AC10836B%40apple.com)
changes this call:

~~~swift
path.addArcWithCenter(
  origin, radius: 20.0,
  startAngle: 0.0, endAngle: CGFloat(M_PI) * 2.0, clockwise: true)
~~~

into this:

~~~swift
path.addArc(
  center: origin, radius: 20.0,
  startAngle: 0.0, endAngle: CGFloat(M_PI) * 2.0, clockwise: true)
~~~

Will we make this change? The jury is out, but this is the time to
make your voice heard.  The review period has been extended through
**Friday, February 5th**.  If you'd like to help shape the future of your
language and frameworks,
[join the discussion](/contributing/#participating-in-the-swift-evolution-process).
The proposals and associated review threads are here:

* [API Design Guidelines](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0023-api-guidelines.md) — [discussion](http://news.gmane.org/find-root.php?message_id=ABB71FFD%2d1AE8%2d43D3%2dB3F5%2d58225A2BAD66%40apple.com)
* [Better Translation of Objective-C APIs Into Swift](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0005-objective-c-name-translation.md) — [discussion](http://news.gmane.org/find-root.php?message_id=CC036592%2d085D%2d4095%2d8D73%2d1DA9FC90A07B%40apple.com)
* [Apply API Guidelines to the Standard Library](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0006-apply-api-guidelines-to-the-standard-library.md) — [discussion](http://news.gmane.org/find-root.php?message_id=73E699B0%2dFAD2%2d46DA%2dB74E%2d849445A2F38A%40apple.com)

