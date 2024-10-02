---
layout: new-layouts/blog
published: true
date: 2024-02-13 10:00:00
title: Swift Summer of Code 2023 Summary
author: [ktoso, FranzBusch, ahoppen, xedin]
---

The Swift project regularly participates in [Google Summer of Code](https://summerofcode.withgoogle.com) in order to help people new to the open source ecosystem dip their toes in contributing to Swift and its growing ecosystem.

During the 2023 edition of the program, we ran three projects, all of which completed their assigned projects successfully.

The projects in this edition were:

* Swift Memcache Library
* Incremental Parsing in SwiftParser
* Key Path Inference and Diagnostic Improvements

We’d like to extend our sincere thanks to the participants and mentors who poured their time and passion into these projects, and use this post to highlight their work to the wider community. Below, each project is described in a small summary.

Let's take a look at each project, in the words of the mentees and mentors themselves:

### Swift Memcache

* Mentee: [Delkhaz Ibrahimi](https://github.com/dkz2)
* Mentor: [Franz Busch](https://github.com/FranzBusch)

The goal of the project was to develop a native [Memcached](https://memcached.org) connection abstraction for the Swift on Server ecosystem. This connection was implemented using `SwiftNIO,` offers native Swift Concurrency APIs and integrates well with the rest of the server ecosystem. The benefit of using Swift Concurrency for building such client is that it can make use of [structured concurrency](https://developer.apple.com/videos/play/wwdc2023/10170/) which brings cancellation, executor awareness, and simple integration with [distributed tracing](https://github.com/apple/swift-distributed-tracing) in the future.

The focus during the project was implementing the Memcache [meta command protocol](https://github.com/memcached/memcached/wiki/MetaCommands) and offering basic `get` and `set` functionalities.

Below is a short example how the new `MemcacheConnection` type can be used to `set` and `get` a value for a given key:


```swift
// Instantiate a new MemcacheConnection with host, port, and event loop group
let memcacheConnection = MemcacheConnection(host: "127.0.0.1", port: 11211, eventLoopGroup: .singleton)

// Initialize the service group
let serviceGroup = ServiceGroup(services: [memcacheConnection], logger: logger)

try await withThrowingTaskGroup(of: Void.self) { group in
    group.addTask { try await serviceGroup.run() }

    // Set a value for a key.
    let setValue = "bar"
    try await memcacheConnection.set("foo", value: setValue)

    // Get the value for a key.
    // Specify the expected type for the value returned from Memcache.
    let getValue = try await memcacheConnection.get("foo", as: String.self)
}
```


After finishing the foundational work to implement the `get` and `set` commands, support for `delete`, `append`, `prepend`, `increment` and `decrement` was added. Lastly, support for checking and updating the time-to-live for keys was added.

The new `MemcacheConnection` type lays the ground work to implement a higher-level `MemcacheClient` that offers additional functionality such as connection pooling, retries, key distribution across nodes and more. However, implementing such a client was out of scope for this year’s GSoC project.

If you’d like to learn more about this project and Delkhaz’s experience, see [this thread](https://forums.swift.org/t/gsoc-2023-swift-memcache-gsoc-project-kickoff/64932) on the Swift forums.

### Implement Incremental Re-Parsing in SwiftParser

* Mentee: [Ziyang Huang](https://github.com/StevenWong12)
* Mentor: [Alex Hoppen](https://github.com/ahoppen)

This project aimed to improve the performance of the [SwiftParser](https://github.com/swiftlang/swift-syntax/tree/main/Sources/SwiftParser) for scenarios like editor syntax highlighting, where minor edits are applied to the file. By adding incremental parsing and re-using parts of the syntax tree that remain unchanged, large performance improvements can be made.

The most challenging part of this project was to make sure we parse the source files correctly. Considering the code snippet below:

```swift
foo() {}
someLabel: switch x {
    default: break
}
```

This source is parsed as a `FunctionCallExprSyntax` and a `LabeledStmtSyntax`. When we remove the "`switch x`" part of this code, a naïve implementation could reuse `foo() {}` as a function call since the edit didn’t touch it. But this is not correct since the `someLabel` block now became a labeled trailing closure of `foo() {}`.

To solve this problem, we collect some additional information for every syntax node during the initial parse to mark the potentially affected range for each node. That information is used to correctly re-parse the `foo()` function call and include `someLabel` as a labeled trailing closure in the call.

The implementation speeds up parsing by about **10x** when we parse source incrementally while **only incurring a 2~3% of performance loss** during normal parsing.

If you’d like to read more about this project and Ziyang’s experience in his own words, head over to [his GSoC experience post](https://forums.swift.org/t/gsoc-2023-my-gsoc-experience/67340) on the Swift forums.

### Key Path Inference and Diagnostic Improvements

* Mentee: [Amritpan Kaur](https://github.com/amritpan)
* Mentor: [Pavel Yaskevich](https://github.com/xedin?tab=repositories)

This project was focused on performance and diagnostic improvements to type-checking of key path literal expressions as well as improvements to new features such as keypaths-as-functions introduced to the language by [SE-0249](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0249-key-path-literal-function-expressions.md).

During compilation, the key path expression root and value were type-checked sequentially to resolve a key path type from this context. However, the design of the type-checker's evaluation of key path component types, their relationships to each other, and key path capabilities results in hard to understand compiler errors and even failures to type-check some valid Swift code.

Some of the problems with this approach can be illustrated by the following code example:

```swift
struct User {
  var name: Name
}
struct Name {
  let firstName: String
}

func test(_: WritableKeyPath<User, String>) {}

test(\.name.firstName)
```

The compiler produces the following error:

```swift
error: key path value type 'WritableKeyPath<User, String>' cannot be converted to contextual type 'KeyPath<User, String>'
test(\.name.firstName)
     ^
```

There are multiple issues with this error diagnostic: contextual type is actually `WritableKeyPath`  and key path should be inferred as read-only, the source information is lost and the compiler is unenable to point out a problem with an argument to a call to the function `test`.

To address these and other issues, we explored a different design for key path literal expression type-checking: infer the root type of the key path first and propagate that information to the components and infer capability based on the components before setting the type for the key path expression. This made it a lot easier to diagnose contextual type failures and support previously failing conversions. This approach improves the performance as well because the literal is resolved only if the context expects a key path and root type is either provided by the developer explicitly or is able to be inferred from the context.

With the new approach implemented the compiler now produces the following diagnostic:

```swift
error: cannot convert value of type 'KeyPath<User, String>' to expected argument type 'WritableKeyPath<User, String>'
test(\.name.firstName)
     ^
```

If you’d like to learn more about the details of this project, we recommend having a look at this excellent and [very detailed writeup written by Amritpan](https://forums.swift.org/t/key-path-inference-and-diagnostic-improvements-an-update/69632) on the forums.

## Mentee Impressions

It’s great to see what projects our GSoC participants accomplished this year! Even better though is seeing participants enjoy their time working with the Swift project, as a big part of Summer of Code is giving mentees (and mentors) a space to grow and learn about open source development.

Here are a few impressions of the mentees about their experience:

**Delkhaz (Swift Memcache):**

> As we wrap up this technical update, it's a bittersweet moment for me to share that my formal journey as a Google Summer of Code student has reached its conclusion, but what an incredible journey it's been. This transformative experience has enriched my understanding of open source development and honed my skills as a developer. I want to extend a heartfelt thank you to everyone who has been a part of this adventure with me.
>
> While this chapter may be closing, I'm thrilled to announce that I will remain actively involved in the project. I'm particularly excited about contributing toward taking this project to its v1 or production stage. So, this isn't a goodbye; it's just the beginning of a new chapter. Looking forward to staying in touch and continuing this journey with all of you.
>
> Special thanks are in order for my mentor Franz, for his exceptional mentorship during my time in the program. His wisdom and insights in our weekly sessions have been nothing short of transformative for me as a developer. Whether it was navigating the complexities of open-source contributions or striving for the highest standards in our API development, Franz’s guidance has been indispensable. I've gained a multifaceted understanding of software development thanks to his continued support. I couldn't have asked for a more impactful mentorship experience, and for that, I am deeply grateful.


**Ziyang (Implement Incremental Re-Parsing in SwiftParser):**

> After measurement, our implementation speed up parsing about 10 times when we parse source incrementally while only bring 2~3% of performance loss to normal parsing. 🎉 🎉
>
> I also bring this feature to sourcekit-lsp and swift-stress-tester, it is really exciting to see my work can be actually put into use.
>
> Special thanks to my mentor Alex for the quick response, detailed reviews and inspiring ideas.


**Amritpan (Key Path inference and diagnostic improvements):**

> I enjoyed working on this project this year, primarily because it was a challenge that allowed me to deepen my understanding of the solver implementation, utilize improvements I made last year to the debug output, and make more impactful changes to the compiler codebase.
>
> Refactoring the debug output last year helped me understand how the various pieces of information that the type checker collected were then evaluated to assign types from context. Taking a look at key path expression type checking failures revealed some of the fallibilities of the constraint system and solver and how various design decision choices could solve certain issues while causing others.
>

We hope this writeup inspires you to either apply to work with us or become a mentor on the Swift project in a future!

We are always looking for ideas, mentors, and general input about how we can make Swift’s ecosystem more inclusive and easier to participate in. If you have some ideas, would like to become a mentor in future editions, or if you’re just curious about other project ideas that were floated during previous editions, visit the [dedicated GSoC category](https://forums.swift.org/c/development/gsoc/98) on the Swift forums. You can also check out [last year’s GSoC summary blog post](https://www.swift.org/blog/swift-summer-of-code-2022-summary/), where we highlighted last year’s projects.

If you’re interested in participating as a mentee, keep an eye on the official [GSoC schedule](https://summerofcode.withgoogle.com/) and on the Swift forum’s [GSoC category](https://forums.swift.org/c/development/gsoc/98).
