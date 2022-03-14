---
layout: page
title: About Swift
---

Swift is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns.

The goal of the Swift project is to create the best available language for uses ranging from systems programming, to mobile and desktop apps, scaling up to cloud services.  Most importantly, Swift is designed to make writing and maintaining *correct* programs easier for the developer. To achieve this goal, we believe that the most obvious way to write Swift code must also be:

**Safe.**  The most obvious way to write code should also behave in a safe manner.  Undefined behavior is the enemy of safety, and developer mistakes should be caught before software is in production. Opting for safety sometimes means Swift will feel strict, but we believe that clarity saves time in the long run.

**Fast.**  Swift is intended as a replacement for C-based languages (C, C++, and Objective-C). As such, Swift must be comparable to those languages in performance for most tasks.  Performance must also be predictable and consistent, not just fast in short bursts that require clean-up later.  There are lots of languages with novel features — being fast is rare.

**Expressive.**  Swift benefits from decades of advancement in computer science to offer syntax that is a joy to use, with modern features developers expect.  But Swift is never done.  We will monitor language advancements and embrace what works, continually evolving to make Swift even better.

Tools are a critical part of the Swift ecosystem. We strive to integrate well within a developer's toolset, to build quickly, to present excellent diagnostics, and to enable interactive development experiences. Tools can make programming so much more powerful, like Swift-based playgrounds do in Xcode, or a web-based REPL can when working with Linux server-side code.

## Features

Swift includes features that make code easier to read and write, while giving the developer the control needed in a true systems programming language.  Swift supports inferred types to make code cleaner and less prone to mistakes, and modules eliminate headers and provide namespaces. Memory is managed automatically, and you don’t even need to type semi-colons. Swift also borrows from other languages, for instance named parameters brought forward from Objective-C are expressed in a clean syntax that makes APIs in Swift easy to read and maintain.

The features of Swift are designed to work together to create a language that is powerful, yet fun to use. Some additional features of Swift include:

* Closures unified with function pointers
* Tuples and multiple return values
* Generics
* Fast and concise iteration over a range or collection
* Structs that support methods, extensions, and protocols
* Functional programming patterns, e.g., map and filter
* Powerful error handling built-in
* Advanced control flow with `do`, `guard`, `defer`, and `repeat` keywords


### Safety

Swift was designed from the outset to be safer than C-based languages, and eliminates entire classes of unsafe code. Variables are always initialized before use, arrays and integers are checked for overflow, and memory is managed automatically. Syntax is tuned to make it easy to define your intent — for example, simple three-character keywords define a variable (`var`) or constant (`let`).

Another safety feature is that by default Swift objects can never be `nil`, and trying to make or use a `nil` object results in a compile-time error. This makes writing code much cleaner and safer, and prevents a common cause of runtime crashes. However, there are cases where `nil` is appropriate, and for these situations Swift has an innovative feature known as **optionals**. An optional may contain `nil`, but Swift syntax forces you to safely deal with it using ``?`` to indicate to the compiler you understand the behavior and will handle it safely.

{% include_relative _open-source.md %}
{% include_relative _platform-support.md %}
