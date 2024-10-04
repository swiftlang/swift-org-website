---
layout: new-layouts/base
title: Project Ideas for GSoC 2020
---

This page contains a list of potential project ideas that we are keen to develop during [GSoC 2020](https://summerofcode.withgoogle.com/). If you would like to apply as a GSoC student, please follow these two steps to get started:

1. Read through this page and identify the project ideas you find interesting.
2. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.

## Potential Projects

### Localization of Compiler Diagnostic Messages

**Description**

Diagnostics play a very important role in a programming language experience. It’s vital for developer productivity that the compiler can produce proper guidance in any situation, especially incomplete or invalid code.

Currently diagnostic messages are only available in English which limits their usefulness to anybody who is proficient enough with the language. We’d like for people from any background to be able to learn and be productive with Swift programming language, so as a step towards this goal, compiler should be able to produce diagnostic messages in any language familiar to the user.

**Expected outcomes/benefits/deliverables**

* Extend existing diagnostic engine to be able to accept preferred locale (e.g. via compiler flag and/or configuration file)
* Implement a new storage format for diagnostic messages which easily extends to support different languages
* Allow to modify diagnostic messages without having to re-build the compiler (as an added benefit this allows to extend the scope of non-code contributions to the project)


**Skills required**

Knowledge of C++

**Potential mentors**

Pavel Yaskevich

**Expected difficulty**

Easy/Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/development/compiler/9), with tag `gsoc-2020`, for more information

### Swift Module Explorer

**Description**

Today, the `.swiftmodule` format is fairly opaque, and the best insight our tooling can provide is a complete dump of the entire module with `llvm-bc-analyzer`. Providing a native tool that allows for exploring the contents of a Swift module would be an incredible debugging aid and teaching tool. It would also expose the student to a very central component of the Swift compiler.

**Expected outcomes/benefits/deliverables**

* Additional insight into the serialization mechanism, especially when and why it fails.
* Deliver a command line/GUI tool for visualizing the contents of a swift module


**Skills required**

Cursory knowledge of C++
Familiarity with Swift

**Potential mentors**

Robert Widmann, Alexis Laferriere

**Expected difficulty**

Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/development/compiler/9), with tag `gsoc-2020`, for more information


### Tracking for Typechecker's Type Inference

**Description**

Swift uses compile-time type inference to achieve clear and concise syntax. Sometimes, it’s not obvious to the programmer why Swift inferred a particular type in their source code. A tool to explore the source of type inference would clear up confusion when the type checker inferred a type that the programmer didn’t expect, and it would greatly enhance their understanding of the language.

**Expected outcomes/benefits/deliverables**

* Gain insight into how Swift’s constraint system for type inference works.
* Implement tracking of constraints that caused the solver to infer a type, along with a compiler flag for writing the solution with detailed type inference sources to a file.
* Deliver an interactive command-line tool for visualizing the source of type inference. This will be a separate command-line tool that reads in the detailed type inference information and allows the user to query the source of type inference for a particular type in the solution.


**Skills required**

Familiarity with the concept of static type checking

**Potential mentors**

Holly Borla

**Expected difficulty**

Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/development/compiler/9), with tag `gsoc-2020`, for more information


### LTO Support for Swift

**Description**

Swift supports multiple levels of optimizations, including whole module
optimization which allows for optimizations across source files.  Extending
support for optimizations to enable LTO optimizations would allow more
aggressive inlining, dead code stripping, and outlining optimizations.

**Expected outcomes/benefits/deliverables**

* Gain insight into the Swift compiler pipeline
* Implement an `lld` plugin to allow link time optimizations
	* The lld plugin would deserialize the LLVM IR emitted by the compiler, invoke the Swift LTO pipeline, and perform at least one optimization pass over the unified LLVM module.
* Integrate the LTO optimizations into the compilation pipeline under a flag
* Benchmark results for Linux or Windows build with LTO on the standard library


**Skills required**

C++ experience is required as this will involve working with large C++
codebases.

**Potential mentors**

Saleem Abdulrasool

**Expected difficulty**

Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/development/compiler/9), with tag `gsoc-2020`, for more information


### Implement Semantic Highlighting for SourceKit-LSP

**Description**

[SourceKit-LSP](https://github.com/swiftlang/sourcekit-lsp) is an implementation of the Language Server Protocol for Swift and C-based languages. There is a [proposal](https://github.com/microsoft/vscode-languageserver-node/blob/324d1039fef2b9622a9784c5cc49d9f6dfc11b65/protocol/src/protocol.sematicTokens.proposed.ts) to add semantic highlighting support to the protocol.  The project is to implement the new semantic highlighting API  in SourceKit-LSP using the semantic highlighting support from sourcekitd for Swift.

**Expected outcomes/benefits/deliverables**

* Implement proposed semantic highlighting LSP API for Swift with an eye to performance and robustness
* Ensure SourceKit-LSP’s semantic highlighting functionality works well when used from within Visual Studio Code.


**Skills required**

* Swift (familiar)

**Potential mentors**

Ben Langmuir

**Expected difficulty**

Easy/Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/development/sourcekit-lsp/47), with tag `gsoc-2020`, for more information


### Swift debugging support on Linux

**Description**

LLDB is the debugger of choice for Swift. Debuggers depend more on the underlying platform than compilers, and as a consequence it’s more challenging to maintain parity of implementation among operating systems. The meta-goal of the project is that of delivering the same debugging experience on Linux that we have on macOS.

**Expected outcomes/benefits/deliverables**

* Several tests are disabled on Linux (for historical reasons, or because the original author of the commit didn’t have time to investigate), those should be audited and reenabled.
* LLDB uses Swift Remote Mirrors (stdlib/Reflection) for aspects of dynamic type resolution. This works well on macOS, but it requires some work to be fully functional on Linux. That would help simplifying/make more robust a critical codepath and fully supporting Library Evolution (resilience) on Linux.
* Many data structures in Foundation differ between Linux and macOS. We could write data formatters (pretty printers) for them.
* Ubuntu is the only fully supported operating system right now. People have reported successes in running swift-lldb on other distributions, it would be nice if we could fix bugs due to difference in libraries, etc..


**Skills required**

Knowledge of C++. Knowledge of how debuggers work is a plus. Knowledge of swift object memory layout is a plus, but can be gained during the bonding period.

**Potential mentors**

Davide Italiano/Adrian Prantl

**Expected difficulty**

Easy/Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/development/lldb/13), with tag `gsoc-2020`, for more information


### Server Distributed Tracing in Swift

**Description**

Building large scale distributed systems in Swift requires solutions that are quite different from those of traditional Swift programs designed to run on iOS or macOS. Server systems must scale to handle millions of concurrent requests, and the team is designing libraries and tools that allow users to write and inspect such highly concurrent systems in an expressive and safe manner.

**Expected outcomes/benefits/deliverables**

* Implement distributed tracing library based on the [OpenTracing specification](https://github.com/opentracing/specification/blob/master/specification.md).
* Demonstrate the implementations can be used in the context of [Dispatch](https://developer.apple.com/documentation/DISPATCH) and [SwifNIO](https://github.com/apple/swift-nio).
* Demonstrate exporting data emitted by the library to observability tools e.g. [Zipkin](https://zipkin.io/).


**Skills required**

* Knowledge of concurrency models and distributed systems.
* Familiarity with Swift.
* Familiarity with OpenTracing or other observability specifications.
* Experience with distributed tracing systems like Zipkin or Honeycomb is a plus.


**Potential mentors**

Konrad Malawski, Tom Doron

**Expected difficulty**

Medium

**Contact**

Post in the [swift forums](https://forums.swift.org/c/server/serverdev/14), with tag `gsoc-2020`, for more information
