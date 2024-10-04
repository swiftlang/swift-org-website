---
layout: new-layouts/base
title: About Swift
---

Swift is a general-purpose programming language that's approachable for newcomers and powerful for experts. It is fast, modern, safe, and a joy to write.

* Swift is general-purpose and modern. Suitable for everything from systems programming, through mobile and desktop apps, to cloud services.
* Swift is safe. Undefined behavior is the enemy of safety, and it’s best to catch mistakes before software goes into production. Swift makes the obvious path the safest.
* Swift is fast to run and quick to write. It comes with predictable and consistent performance that is on-par with C-based languages without sacrificing developer friendliness.
* Swift is approachable and powerful. From a single-line “Hello, World!” to large-scale apps with hundreds of thousands of lines. Swift scales with your needs.

## Tools

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

{% include_relative _platform-support.md %}
{% include_relative _open-source.md %}
