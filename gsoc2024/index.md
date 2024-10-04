---
layout: new-layouts/base
title: Project Ideas for GSoC 2024
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [Google Summer of Code 2024](https://summerofcode.withgoogle.com/). If you would like to apply to GSoC as a contributor, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
3. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2024` tag](https://forums.swift.org/tag/gsoc-2024), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform with spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

To start things off, we recommend starting a new thread or joining an existing discussion about the project you are interested in on the dedicated [GSoC forums category](https://www.swift.org/gsoc2024/). You should also _tag_ your thread with the `gsoc-2024` tag. It is best if you start a thread after having explored the topic a little bit already, and come up with specific questions about parts of the project you are not sure about. For example, you may have tried to build the project, but not sure where a functionality would be implemented; or you may not be sure about the scope of the project.

Please use the forums to tag and communicate with the project's mentor to figure out the details of the project, such that when it comes to writing the official proposal plan, and submitting it on the Summer of Code website, you have a firm understanding of the project and can write a good, detailed proposal (see next section about hints on that).

If you would like to reach out to a mentor privately rather than making a public forum post, and the forums are not allowing you to send private messages yet, please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc2024]` tag in the email subject and describe the project you would like to work on. We will route you to the appropriate mentor. In general, public communications on the forums are preferred though, as this is closer to the normal open-source way of getting things done in the Swift project.

## Writing a proposal

Getting familiar with the codebase you are interested in working on during GSoC helps to write a good proposal because it helps you get a better understanding of how everything works and how you might best approach the project you are interested in. How you want to do that is really up to you and your style of learning. You could just clone the repository, read through the source code and follow the execution path of a test case by setting a breakpoint and stepping through the different instructions, read the available documentation or try to fix a simple bug in the codebase. The latter is how many open-source contributors got started, but it’s really up to you. If you do want to go and fix a simple bug, our repositories contain a label “good first issue” that marks issues that should be easy to fix and doable by newcomers to the project.

When it comes to writing the proposal, the [Google Summer of Code Guide](https://google.github.io/gsocguides/student/writing-a-proposal) contains general, good advice.

## Potential Projects

We are currently collecting project ideas on the forums in the dedicated [GSoC](https://forums.swift.org/tag/gsoc-2024).

Potential mentors, please feel free to propose project ideas to this page directly, by [opening a pull request](https://github.com/swiftlang/swift-org-website/edit/main/gsoc2024/index.md) to the Swift website.

You can browse previous year's project ideas here: [2023](https://www.swift.org/gsoc2023/), [2022](https://www.swift.org/gsoc2022/), [2021](https://www.swift.org/gsoc2021/), [2020](https://www.swift.org/gsoc2020/), [2019](https://www.swift.org/gsoc2019/).

### Create Real-World Swift Macro Examples

**Project size**: 90 hours

**Estimated difficulty**: Easy

**Recommended skills**

- Basic proficiency in Swift.
- Basic knowledge of SwiftSyntax.
- Optional: Experience with documentation tools, particularly Swift's DocC.

**Description**

Swift Macros offer a powerful way to transform source code during compilation, streamlining the code generation process and minimizing repetitive manual tasks. The swift-syntax repository features [several examples](https://github.com/swiftlang/swift-syntax/tree/main/Examples/Sources/MacroExamples) showcasing Swift Macros. These serve as a foundational starting point, illustrating various types of macros. However, they often present scenarios that may not directly align with everyday use cases encountered in real-world applications. Additionally, there is notable variability in how these examples handle diagnostics, with some macros requiring more detailed feedback mechanisms for incorrect usage. This situation highlights a valuable area for enhancement, aiming to provide more comprehensive guidance and practical applications for developers.

This project is set to enrich the Swift community by enhancing the current suite of Swift Macro examples with real-world applicability and by introducing new, meticulously crafted examples. It will expand upon the foundational work in the swift-syntax repository, infusing it with comprehensive documentation and interactive tutorials created using DocC. Each example, both new and enhanced, will be carefully designed to showcase the use of different types of Swift Macros, equipped with practical diagnostics, unit tests, and detailed documentation. The initiative will also include the creation of DocC tutorials for some of the most sought-after and impactful Macros, providing an invaluable educational resource for the Swift community. Our aim is to illuminate the diverse capabilities of Swift Macros, highlighting their power and flexibility while sharing best practices for diagnostics, error handling, and testing. By building upon the existing examples and introducing new insights and techniques, this project promises to elevate the collective knowledge and utility of Swift Macros, fostering innovation and excellence within the ecosystem.

**Expected outcomes/benefits/deliverables**

- A comprehensive set of real-world Swift Macro examples, demonstrating practical applications across different types of Macros.
- Detailed documentation for each example, including the rationale for using Macros, the problems they solve, and guides to their implementation, with an emphasis on diagnostics and error handling.
- A series of high-quality DocC tutorials covering the creation and application of popular and useful Macros, offering an interactive and engaging learning experience.

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen)
- [Mateusz Bąk](https://github.com/Matejkob)

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

There is a scope for the outermost curly braces of the function, in which the parameters `a` and `b` are visible. There's another scope introduced for the `if let` inside of that scope, which introduces a new name `b` (different from the parameter `b`) that is only visible within that `if let`. A lot of aspects of compilers and compiler-like tools depend on walking the scopes to find interesting things---for example, to figure out what names are introduced there (for name lookup, i.e., what do `a` and `b` refer to in the first `return` statement?), determine where `break` or `continue` go to, where a thrown error can be caught, and so on.

This project involves implementing a notion of lexical scopes as part of [swift-syntax](https://github.com/swiftlang/swift-syntax), with APIs to answer questions like "What does `b` refer to in `return a + b`?" or "What construct does this `break` escape out of?". These APIs can form the basis of IDE features like "edit all in scope" and are an important step toward replacing the [C++ implementation of scopes](https://github.com/swiftlang/swift/blob/main/include/swift/AST/ASTScope.h) within the Swift compiler.

**Expected outcomes/benefits/deliverables**

Introduce a new library for the swift-syntax package with an API to implement name and scope lookup for a given syntax node, with lots of tests for all of the fun corner cases in Swift (e.g, `guard let`, implicit names like `self`, `error` in a catch block, `newValue` in a setter). From there, the sky's the limit: there are many scope-based queries to build APIs for, or you could start building on top of these APIs for something like IDE support in [SourceKit-LSP](https://github.com/swiftlang/sourcekit-lsp).

**Potential mentors**

- [Doug Gregor](https://github.com/DougGregor)

### Code Completion for Keywords using swift-syntax

**Project size**: 175 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift
- Knowledge of C++ is advantageous but not required

**Description**

The swift-syntax tree has structural information about Swift’s grammar. For example, it knows all the different declaration nodes and which keywords they start with. This should allow us to perform code completion of keywords (such as `struct`) and punctuation (such as `->`) by determining the cursor’s position in the syntax tree and figuring out the possible keywords at that position by iterating the syntax tree’s structure. For example, when invoking code completion at the top level, code completion should determine that a declaration is allowed at the top level, iterate over all the declaration nodes and collect the keywords they start with.

The tricky part is that the SwiftSyntax tree is an over-approximation of the Swift language. For example, accessors such as `get { 42 }` are modelled as declarations, but are only valid inside accessor blocks. We should need to perform some filtering and prevent `get` from being suggested at the top level.

[swiftlang/swift-syntax#1014](https://github.com/swiftlang/swift-syntax/pull/1014) is a draft pull request that implements the collection of possible keywords but performs none of the filtering. The project’s goal is to determine the contextual filters that need to be added to get good results with few or no invalid suggestions. Additionally, it should connect the new keyword completion implementation with [sourcekitd](https://github.com/swiftlang/swift/tree/main/tools/SourceKit) to provide these results to Xcode, SourceKit-LSP.

The advantage of keyword completion based on swift-syntax is that its results are produced by the syntax tree’s and are thus guaranteed to be complete. It removes the need to manually maintain a [list of keyword completions](https://github.com/swiftlang/swift/blob/72486c975f0e69e642db53482c9c15329aefa139/lib/IDE/CodeCompletion.cpp#L662-L1119) and provide previously missing completions like `->` after the parameters in a function declaration.

**Expected outcomes/benefits/deliverables**

Provide all keyword or punctuator completions that are valid at a certain position in a SwiftSyntax tree with a very low ratio of invalid completions.

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen)

### Expansion of Swift Macros in Visual Studio Code

**Project size**: 175 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift
- Proficiency in TypeScript and JavaScript
- Experience in writing Visual Studio Code extensions is beneficial but not required

**Description**

Swift Macros allow the generation of source code at compile time. While this provides concise code and avoids repetition of common paradigms, understanding the source code can become harder if it is unknown what the macro expands to.

Visual Studio Code using the [Swift Extension](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang) currently has limited ability to show the code generated by a macro by invoking a code action that replaces the macro by its generated code inside the current source file.

The project's goal is to implement a code action to show the macro-generated code without modifying the current source file. This includes the implementation of a request in [sourcekit-lsp](https://github.com/swiftlang/sourcekit-lsp) to compute the contents of the macro expansion and support in the Visual Studio Swift Extension to display that content. Some initial discussion of how the design could look like can be found in [this thread](https://github.com/swiftlang/sourcekit-lsp/pull/892#discussion_r1358428808).

As a stretch goal, Visual Studio Code should also offer semantic functionality like jump-to-definition inside the macro expansion and allow the expansion of nested macros.

**Expected outcomes/benefits/deliverables**

An end-to-end implementation that allows the display of a macro’s contents in Visual Studio Code.

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen) and [Adam Fowler](https://github.com/adam-fowler)

### Introduce Swift Distributed Tracing support to AsyncHTTPClient

**Project size**: 90 hours

**Difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift and Swift Concurrency
- Basic proficiency in HTTP concepts

**Description**

During an earlier Summer of Code edition, the [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing) library was kicked off. The development of the library continued ever since, and now we'd like to include support for tracing in some of the core server libraries.

The recommended HTTP client for server applications in Swift is [async-http-client](https://github.com/swift-server/async-http-client), and this project is about introducing first-class support for distributed tracing inside this project. The work needed to be done is going to be [similar to the work done in swift-grpc](https://github.com/grpc/grpc-swift/pull/1756).

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

- [Konrad 'ktoso' Malawski](https://github.com/ktoso)

### Re-implement property wrappers with macros

**Project size**: 350 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift and C++

**Description**

[Property wrappers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md) feature is currently implemented purely within the compiler but with the addition of [Swift Macros](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0389-attached-macros.md) and [init accessors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0400-init-accessors.md) it's now possible to remove all ad-hoc code from the compiler and implement property wrappers by using existing features.

This work would remove a lot of property wrapper-specific code throughout the compiler - parsing, semantic analysis, SIL generation etc. which brings great benefits by facilitating code reuse, cleaning up the codebase and potentially fixing implementation corner cases. Macros and init accessors in their current state might not be sufficient to cover all of the property wrapper use scenarios, so the project is most likely going to require improving and expanding the aforementioned features as well.


**Expected outcomes/benefits/deliverables**

The outcome of this project is the complete removal of all property wrappers-specific code from the compiler. This benefits the Swift project in multiple areas - stability, testability and code health.

**Potential mentors**

- [Pavel Yaskevich](https://github.com/xedin)

### etcd client

**Project size**: 175 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift and Swift Concurrency
- Basic proficiency with gRPC
- Optional: Experience with using etcd

**Description**

`etcd` is a strongly consistent, distributed key-value store that provides a reliable way to store data that needs to be accessed by a distributed system or cluster of machines. It gracefully handles leader elections during network partitions and can tolerate machine failure, even in the leader node. Furthermore, `etcd` is a [CNCF graduated](https://www.cncf.io/projects/) project powering Kubernetes which stores all cluster information in `etcd`.

Swift is a great programming language for implementing complex distributed systems and having an `etcd` client enables such systems to store their data reliably. The latest revisions of `etcd` exposes a [gRPC](https://grpc.io) API that clients can use to communicate with the `etcd` server to update and query stored data.

**Expected outcomes/benefits/deliverables**

- Create a brand new `swift-etcd-client` package
- Connect and communicate with an `etcd` server using [etcd gRPC APIs](https://etcd.io/docs/v3.5/learning/api/)
- Implement the following `etcd` APIs
  - [Authentication](https://etcd.io/docs/v3.5/learning/design-auth-v3/) to the `etcd` server
  - [Key value operations](https://etcd.io/docs/v3.5/learning/api/#key-value-api)
  - [Watch operations](https://etcd.io/docs/v3.5/learning/api/#watch-api) for monitoring changes to keys
  - Strech goal [lease operations](https://etcd.io/docs/v3.5/learning/api/#lease-api)
- All publicly exposed APIs should feel native to Swift and use Concurrency concepts such as `AsyncSequence`

**Potential mentors**

- [Franz Busch](https://github.com/FranzBusch)

### Add a `deploy` SwiftPM plugin and a Swift-based DSL to the Swift runtime for AWS Lambda

**Project size**: 90 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift

**Description**

[AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) templates provide a short-hand syntax, optimized for defining Infrastructure as Code (IaC) for serverless applications.

I [started exploring the possibilities](https://github.com/swift-server/swift-aws-lambda-runtime/pull/291) to represent a SAM template in Swift, using a DSL. The current code has three components:

- a [set of data structures](https://github.com/sebsto/swift-aws-lambda-runtime/blob/sebsto/deployerplugin_dsl/Sources/AWSLambdaDeploymentDescriptor/DeploymentDescriptor.swift) to represent a YAML SAM template
- a [DSL definition](https://github.com/sebsto/swift-aws-lambda-runtime/blob/sebsto/deployerplugin_dsl/Sources/AWSLambdaDeploymentDescriptor/DeploymentDescriptorBuilder.swift) (build with `@resultBuilder`) to express a SAM template using the Swift programming language
- a [SwiftPM plugin](https://github.com/sebsto/swift-aws-lambda-runtime/tree/sebsto/deployerplugin_dsl/Plugins/AWSLambdaDeployer) allowing to generate a SAM template and deploy it to the cloud.

The existing code has a significant challenge: to be useful for developers, the set of data structures and DSL must be aligned with the SAM template definition.

This project is aimed at simplifying the alignment with an ever-evolving SAM template definition by writing a code generator. The code generator will consume [the SAM template definition](https://github.com/aws/serverless-application-model/blob/develop/samtranslator/validator/sam_schema/schema.json) and generate an API-stable set of Swift data structures. As a second step, a manually designed and coded DSL would consume these data structures to generate the YAML SAM template from the DSL.

**Expected outcomes/benefits/deliverables**

- a Swift data structure generator. This new, yet-to-be-created piece of code will read and parse the [JSON SAM template definition](https://github.com/aws/serverless-application-model/blob/develop/samtranslator/validator/sam_schema/schema.json) and generate a set of API-stable Swift `Codable` data structures to generate a valid SAM YAML template. The generated code must be similar to [these existing data structures](https://github.com/sebsto/swift-aws-lambda-runtime/blob/sebsto/deployerplugin_dsl/Sources/AWSLambdaDeploymentDescriptor/DeploymentDescriptor.swift) (these were created manually)

- a manually designed and coded Swift-based DSL that exposes in a developer-friendly way the SAM template definition (it can/should be based on [this existing code](https://github.com/sebsto/swift-aws-lambda-runtime/blob/sebsto/deployerplugin_dsl/Sources/AWSLambdaDeploymentDescriptor/DeploymentDescriptorBuilder.swift))

- these two components must be callable from [an existing SwiftPM plugin](https://github.com/sebsto/swift-aws-lambda-runtime/tree/sebsto/deployerplugin_dsl/Plugins/AWSLambdaDeployer)

**Potential mentors**

- [Sebastien Stormacq](mailto:stormacq@amazon.com), ([GitHub](https://github.com/sebsto))

### Building Swift Macros with WebAssembly

**Project size**: 350 hours

**Difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift, C++
- Interest in compilers and WebAssembly

**Description**

Swift [macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros) are built as host programs that make use of the [swift-syntax](https://github.com/swiftlang/swift-syntax) package to process Swift syntax and produce new syntax. One of the downsides of this approach is that the build process for each macro can take a significant amount of time, and pre-building macro binaries is complicated by the fact that the binaries need to be built for multiple host platforms (e.g., Linux, Windows, and macOS) and architectures (e.g., x86 and ARM). Moreover, macros are aggressively sandboxed to prevent errors in macros from affecting the Swift compiler itself.

[WebAssembly](https://webassembly.org/) provides a portable compilation target that can be executed on any platform and architecture. [SwiftWasm](https://swiftwasm.org/) can compile Swift to WebAsssembly, and [WasmKit](https://github.com/swiftwasm/WasmKit) provides a runtime that can execute WebAssembly programs. WebAssembly could provide a way to build Swift macros into binaries that can be distributed and run anywhere, eliminating the need to rebuild them continually. This project involves getting swift-syntax and macros implemented on top of it building to WebAssembly, teaching the Swift compiler to communicate with these macro implementations, and extending the [Swift Package Manager](https://github.com/swiftlang/swift-package-manager) with support for building and using macros with WebAssembly.

**Expected outcomes/benefits/deliverables**

The ideal outcome of this project would be for Swift macros to be able to opt into being built with WebAssembly and have the Swift Package Manager do so without further intervention from the user.

**Potential mentors**

- [Doug Gregor](https://github.com/DougGregor)


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

Description of expected outcomes, like some specific feature being implemented, a performance improvement, or a guide being written.
This will be the basis for passing the Summer of Code assignment and the final submission of the project.

**Potential mentors**

- Your name (and link to GitHub, or other means of reaching you)
- Optionally: additional mentors

