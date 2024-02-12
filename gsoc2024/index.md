---
layout: page
title: Project Ideas for GSoC 2024
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [Google Summer of Code 2024](https://summerofcode.withgoogle.com/). If you would like to apply to GSoC as a contributor, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
3. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2024` tag](https://forums.swift.org/tag/gsoc-2024), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform which also has a number of spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct-message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

If you would like to reach out to a mentor privately, rather than making a public forums post, and the forums are not allowing you to send private messages (yet), please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc2024]` tag in the email subject and describe the project you would like to work on – and we'll route you to the appropriate mentor.

## Potential Projects

We are currently collecting project ideas on the forums in the dedicated [GSoC](https://forums.swift.org/tag/gsoc-2024).

Potential mentors, please feel free to propose project ideas to this page directly, by [opening a pull request](https://github.com/apple/swift-org-website/edit/main/gsoc2024/index.md) to the Swift website. 

You can browse previous year's project ideas here: [2023](https://www.swift.org/gsoc2023/), [2022](https://www.swift.org/gsoc2022/), [2021](https://www.swift.org/gsoc2021/), [2020](https://www.swift.org/gsoc2020/), [2019](https://www.swift.org/gsoc2019/).

### Lexical scopes for swift-syntax

**Project size**: 175 hours

**Difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift, willingness to read C++ for inspiration
- Interest in parsers and compilers

**Description**

Swift source code is organized into a set of scopes, each of which can introduce names that can be found in that scope and other scopes nested within it. For example, in a function like this:

```swift
func f(a: Int, b: Int?) -> Int {
  if let b = b {
    return a + b
  }

  return a
}
```

There is a scope for the outermost curly braces of the function, in which the parameters `a` and `b` are visible. There's another scope introduced for the `if let` inside of that scope, which introduces a new name `b` (different from the parameter `b`) that is only visible within that `if let`. A lot of aspects of a compilers and compiler-like tools depend on walking the scopes to find interesting things---for example, to figure out what names are introduced there (for name lookup, i.e., what do `a` and `b` refer to the in the first `return` statement?), determine where `break` or `continue` go to, where a thrown error can be caught, and so on.

This project involves implementing a notion of lexical scopes as part of [swift-syntax](https://github.com/apple/swift-syntax), with APIs to answer questions like "what does `b` refer to in `return a + b`?" or "what construct does this `break` escape out of?". These APIs can form the basis of IDE features like "edit all in scope" and are an important step toward replacing the [C++ implementation of scopes](https://github.com/apple/swift/blob/main/include/swift/AST/ASTScope.h) within the Swift compiler.

**Expected outcomes/benefits/deliverables**

Introduce a new library for the swift-syntax package with an API to implement name lookup for a given syntax node, with lots of tests for all of the fun corner cases in Swift (e.g, `guard let`, implicit names like `self`, `error` in a catch block, `newValue in a setter) `error`, . From there, the sky's the limit: there are many scope-based queries to build APIs for, or you could start building on top of these APIs for something like IDE support in [SourceKit-LSP](https://github.com/apple/sourcekit-lsp).

**Potential mentors**

- [Doug Gregor](https://github.com/DougGregor)


### Introduce Swift Distributed Tracing support to AsyncHTTPClient

**Project size**: 90 hours

**Difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift and Swift Concurrency
- Basic proficiency in HTTP concepts

**Description**

During an earlier Summer of Code edition, the [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing) library was kicked off. The development on the library continued ever since, and now we'd like to include support for tracing in some of the core server libraries.

The recommended HTTP client for server applications in Swift is [async-http-client](https://github.com/swift-server/async-http-client), and this project is about introducing first class support for distributed tracing inside this project. The work needed to be done is going to be [similar to the work done in swift-grpc](https://github.com/grpc/grpc-swift/pull/1756).

Distributed tracing allows correlating "spans" (start time, end time, and additional information) of traces, made across nodes in a distributed system. In HTTP, this means attaching extra trace headers to outgoing HTTP requests. 

As an end result, the following code should emit trace information to the configured backend:

```swift
import AsyncHTTPClient
import Tracing

let httpClient = HTTPClient(eventLoopGroupProvider: .singleton)

try await tracer.withSpan("Prepare dinner") { span in
  let carrotsRequest = HTTPClientRequest(url: "https://example.com/shop/vegetable/carrot?count=2")
  let carrots = try await httpClient.execute(request, timeout: .seconds(30))

  let meatRequest = HTTPClientRequest(url: "https://example.com/shop/meat?count=1")
  let meat = try await httpClient.execute(request, timeout: .seconds(30))

  print("Dinner ready: \(makeDinner(carrots, meat))")
}
```

The above should result in 3 spans being recorded:
- the overall "Prepare dinner" span
- one client span for the duration of the carrots HTTP request
- one client span for the duration of the meat HTTP request

You can read more about tracing in the documentation of these libraries: [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing), [swift-otel](https://github.com/slashmo/swift-otel).


**Expected outcomes/benefits/deliverables**

- Introduce built-in support for distributed tracing in AsyncHTTPClient
- It should be possible to bootstrap a tracing backend and have the HTTP client pick trace headers and propagate them in any requests made.
- In addition, there should be a small "demo" docker example prepared, such that developers can quickly try out the functionality.

**Potential mentors**

- [Konrad 'ktoso' Malawski](https://github.com/DougGregor)

### Re-implement property wrappers with macros

**Project size**: 350 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift and C++

**Description**

[Property wrappers](https://github.com/apple/swift-evolution/blob/main/proposals/0258-property-wrappers.md) feature is currently implemented purely within the compiler but with addition of [Swift Macros](https://github.com/apple/swift-evolution/blob/main/proposals/0389-attached-macros.md) and [init accessors](https://github.com/apple/swift-evolution/blob/main/proposals/0400-init-accessors.md) it's now possible to remove all ad-hoc code from the compiler and implement property wrappers by using existing features.

This work would remove a lot of property wrapper specific code throughout the compiler - parsing, semantic analysis, SIL generation etc. which brings great benefits by facilitating code reuse, cleaning up the codebase and potentially fixing implementation corner cases. Macros and init accessors in their current state might not be sufficient to cover all of the property wrapper uses scenarios, so the project is most likely going to require improving and expanding aforementioned features as well.


**Expected outcomes/benefits/deliverables**

The outcome of this project is the complete removal of all property wrappers specific code from the compiler. This benefits the Swift project in multiple areas - stability, testability and code health.

**Potential mentors**

- [Pavel Yaskevich](https://github.com/xedin)


### Project topic proposal template 

### Project name

**Project size**: 90 hours / 175 hours / 350 hours

**Estimated difficulty**: Easy / Intermediate / Hard

**Recommended skills**

- E.g. Proficiency in Swift, and/or C++
- Knowledge of ...
- Optional, experience in ... 

**Description**

Brief description of the project, its goals and what areas of the Swift project it relates to.

**Expected outcomes/benefits/deliverables**

Description of expected outcomes. Like some specific feature being implemented, or a performance improvement, or guide being written.
This will be the basis for passing the Summer of Code assignment and the final submission of the project. 

**Potential mentors**

- Your name (and link to github, or other means of reaching you)
- Optionally: additional mentors

