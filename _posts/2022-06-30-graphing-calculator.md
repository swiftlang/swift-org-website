---
layout: new-layouts/blog
published: true
date: 2022-06-30 16:00:00
title: "Developer Spotlight: Porting Graphing Calculator from C++ to Swift"
author: [ronavitzur]
---

*Developer Spotlight is a series highlighting interesting Swift developers from around the world. This post is authored by Ron Avitzur, author of the [Pacific Tech Graphing Calculator](http://PacificT.com/Story).*

***

![Erica Sadun on stage giving a talk on property wrappers](/assets/images/graphing-calculator-blog/gc-screenshot.png){: style="float: right; margin-right: 1em; max-width: 50%"}

Graphing Calculator began in 1985 in C for the 128K Macintosh in the days of 16-bit ints, black & white Quickdraw, and the 8 MHz 68000 CPU with no MMU, FPU, nor GPU. It was a simpler time. A lot has changed since then.

I have long adhered to the philosophy of “If it ain’t broke, don’t fix it”, so the code carries many vestiges of its past – design choices which made sense at the time, but no longer serve. It has seen the CPU change from the Motorola 68K to the IBM PowerPC family, to Intel, and to ARM. It was originally written to the classic Mac API of Inside Macintosh, then Carbon, then Cocoa, AppKit & UIKit, and now SwiftUI.

It is easier to write new code adding new functionality and hide ancient legacy code under layers of abstraction. Eventually, decades of accumulated technical debt make new development fraught. Graphing Calculator still uses the Classic Mac OS 9 cooperative threading APIs in order to run code frozen in the 1980s which is not thread-safe. Rewriting everything from scratch, aka taking off and nuking the entire site from orbit, is almost never a Good Idea. Legacy code embodies decades of hard-learned lessons which the current developers never experienced, and even the original developers, if they are still around, have long since forgotten. While a fresh start can be aesthetically satisfying, it creates an enormous surface area for bugs. In a typical dot release, focusing testing on new features is easy. With a complete rewrite, everything is new. Nonetheless, after thirty-five years of shoving problems under the rug, I decided the best way forward was to review everything and rewrite it from the ground up.

C++ is and always has been an effective language for managing complexity in large projects, so why did I change languages? I was incredibly impressed with Apple’s Augmented Reality technology. After adding AR support to our iOS product, I built a prototype app exploring how AR could be used in math education, inspired by the use of AR in children’s storybooks. You can see videos at [http://PacificT.com/AR/](http://PacificT.com/AR/) and [https://twitter.com/RonAvitzur/status/1250520615993270272](https://twitter.com/RonAvitzur/status/1250520615993270272). The app was largely C++ and ObjectiveC++. The prototype used ARKit for vision and machine learning, which, while possible in Objective-C, would have been easier in Swift. It was clear that would continue to be true of new Apple technologies.

I learned Swift by porting Graphing Calculator's core computer algebra system. It started as a learning exercise, then became a feasibility study. The pandemic played a role in that decision, as this became my pandemic shelter-in-place project. The refactoring could have been done in C++ and Objective-C++, but it would not have been as effective, nor as much fun. The port conflates many transitions:

| From          | To  |
| --------------- | ----------- |
| C++/ObjC/ObjC++ | Swift  |
| Lex/YACC 		| Swift  |
| pthreads		| Swift structured concurrency  |
| C++ char  		| Swift String  |
| AppKit/UIKit 		| SwiftUI  |
| OpenGL		| SceneKit & Metal  |

It also involved refactoring and rewriting core algorithms that had become unwieldy through piecewise evolution of their functionality.

I’ve worked the last [18 months](https://twitter.com/search?q=%22C%2B%2B%20%E2%86%92%20Swift%22%20from%3Aronavitzur&f=live) rewriting everything. Here’s what I’ve learned.

I love Swift’s syntax. So much of the repetitive boilerplate code that was necessary for C++ melted away in Swift, leaving only code necessary to represent the logic, making the meaning clearer. Swift’s use of value types in collection classes make reasoning about them simpler; the syntactic sugar makes using them incredibly easy, and they’re yet backed by an implementation which uses automatic reference counting with copy-on-write to make them performant for nearly all uses. (Discovering the limits of that statement continues to be a significant issue optimizing Graphing Calculator’s performance.) Using Swift String with its built-in Unicode support replaced a confusing mess of C++ char, UTF-8, and UTF-16 representations, improving code organization and making reasoning about the code easier. ARC, type inference, optionals, closures, enumerations with associated values, the lack of a need for header files, and Swift Concurrency all contributed significantly to writing concise, expressive code as well.

In the end, the port is vastly more maintainable, readable, and compact. When I ported individual sections of functionality, the Swift source typically measured 30% the size of the corresponding C++ code. (While lines-of-code is not a very informative metric, it is an easy thing to measure.) Less code means less to debug, less to read and understand, and that alone makes the port easier to maintain. Using SwiftUI, view controllers go away entirely: a big win for declarative programming over imperative. All together, the source code dropped from 152,000 lines to 29,000 lines with no significant loss of functionality or performance.

The biggest challenge of the port was achieving comparable speed. Decades of iterative refinement and low-level optimization on every release set a high bar for performance. Navigating Swift’s myriad Unsafe APIs in performance-critical code was [difficult](https://twitter.com/RonAvitzur/status/1445084851367931904), but effective. The biggest remaining [challenge](https://twitter.com/RonAvitzur/status/1462573727766310914) is minimizing ARC retain/release overhead navigating expression trees. Relying on ARC eliminated a great deal of code complexity. The C++ code handled expression memory management manually, which was both extremely fragile but also very fast. The Swift version is smaller, easier to write correct code and reason about, but has performance-critical sections where I know that traversing a tree will not change any reference counts but have no way to communicate to the compiler that the ARC retain/release overhead is unnecessary. The Swift language, libraries, and runtime have excellent documentation, and one can even inspect the open source implementation in a pinch. In contrast, the SwiftUI framework is closed source. When SwiftUI works it is a nigh-magical delight, but when it behaves unexpectedly or when behavior outside the prescribed path is desired, it can be difficult to understand and work around its limitations.

Was it worth my time to port to Swift? I’ve enjoyed learning Swift and am much happier with the state of the code now. Writing in Swift is pure joy. Since the ‘80s, I’ve intended to eventually open source my code. As I considered doing that with the C++ code base, I realized that would not be a useful contribution due to the decades of accumulated technical debt making the C++ code unmaintainable. I am confident now that the new code can be made into useful stand-alone Swift Packages for mathematical typesetting, editing, numeric and symbolic computation, and graphing.

Swift has lived up to its promise of enabling safe, fast, and expressive code. SwiftUI has lived up to its promise of enabling a great user experience across Apple platforms with minimal code. I’d like to thank everyone who has contributed to Swift for all their hard work. Programming in Swift really is so much more fun. Special thanks to everyone who spends time answering noob questions on Swift Forums and on Twitter. I cannot begin to express my gratitude for your patient and professional help throughout this process.

*Graphing Calculator is available on [macOS](https://apps.apple.com/us/app/graphing-calculator-4/id522175477?mt=12) and [iOS](https://apps.apple.com/us/app/pacific-tech-graphing-calculator/id1135478998?ls=1).*
