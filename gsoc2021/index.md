---
layout: new-layouts/base
title: Project Ideas for GSoC 2021
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [GSoC 2021](https://summerofcode.withgoogle.com/). If you would like to apply as a GSoC student, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
2. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.
    - Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2021` tag](https://forums.swift.org/tag/gsoc-2021), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform which also has a number of spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct-message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

If you would like to reach out to a mentor privately, rather than making a public forums post, and the forums are not allowing you to send private messages (yet), please reach out to Konrad Malawski at `ktoso @ apple.com` directly via email with the `[gsoc2021]` tag in the email subject and describe the project you would like to work on – and we'll route you to the appropriate mentor.

## Potential Projects

### Tracking for typechecker’s type inference

**Description**

Swift uses compile-time type inference to achieve clear and concise syntax. Sometimes, it’s not obvious to the programmer why Swift inferred a particular type in their source code. A tool to explore the source of type inference would clear up confusion when the type checker inferred a type that the programmer did not expect, and it would greatly enhance their understanding of the language.

See also:

- [GSoC 2020 page](/gsoc2020/#tracking-for-typecheckers-type-inference), minus the interactive command line tool part due to shorter coding period)

**Expected outcomes/benefits/deliverables**

- Gain insight into how Swift’s constraint system for type inference works.
- Implement tracking of constraints that caused the solver to infer a type, along with a compiler flag for writing the solution with detailed type inference sources to a file.

**Skills required**

Familiarity with the concept of static type checking.

**Potential mentor(s)**

Holly Borla, Pavel Yaskevich

### Referencing enclosing self in a property wrapper type
**Description**

Property wrappers are a powerful feature in Swift for abstracting common property patterns into libraries. One of these common patterns involves manually-written property accessors that refer to the self instance of the enclosing type of that property. Swift has an experimental design and implementation of a feature that allows this pattern to be abstracted into a property wrapper. However, the design and implementation need to be evolved before Swift officially supports this feature. This project will help you develop skills in collaborative language design, technical writing, and compiler development!

See also:

- Future directions section of the Property Wrappers Swift Evolution proposal: [Referencing the enclosing 'self' in a wrapper type](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md#referencing-the-enclosing-self-in-a-wrapper-type)

**Skills required**
Proficient with Swift. Familiarity with property wrappers is a plus!

**Expected difficulty**

Though this isn’t a simple feature, I think this might be a good GSoC project because it’s a highly requested feature that’s unlikely to be rejected in Swift Evolution, there’s an experimental implementation in place to help point the student toward the parts of the code that will need to change, and there are some better design ideas floating around so the student won’t need to start from scratch. A language feature is also a good way to attract folks enthusiastic about the Swift language who aren’t as confident in/don’t have much experience with compiler development.

**Potential mentor(s)**

Holly Borla

### Transparent logs system for protecting the Swift package ecosystem

**Description**

[Transparent logs](https://research.swtch.com/tlog) are a novel approach to supply-chain security, adopted by Certificate Transparency and the [trillian](https://github.com/google/trillian) projects. In this project we will explore applying such principals to protect the Swift package ecosystem from supply-chain attacks. Participants will participate in collaborative design, technical writing, and server-side development.

**Skills required**

Proficient with Swift or similar C based languages. Familiarity with Merkel trees, certificate transparency and supply-chain security is a plus.

**Potential mentor(s)**

Yim Lee, Tom Doron

### Scripting in Swift

**Description**

Swift is a fun and powerful language, and folks often want to use it also for their scripting needs. While writing simple scripts in Swift is possible today, it is not possible to use Swift packages in such scripts, which takes away from the full robustness of the language. In this project we will define a user friendly syntax for expressing package dependencies in a script, a methodology to resolve such dependencies, and integrate the resolution into the Swift command line tools and REPL. Participants will participate in collaborative design, technical writing, and software development.

See also:

- The [SwiftPM support for Swift scripts](https://forums.swift.org/t/swiftpm-support-for-swift-scripts/33126) thread has an initial design that could be used as the basis of this work. It may need some polish, figuring out the details the project cound aim for implementing a basic version of it.

**Skills required**

Proficient with Swift and SwiftPM. Familiarity with scripting languages is a plus.

**Potential mentor(s)**

Boris Beugling, Anders Bertelrud, Tom Doron

### Increase differentiable programming’s language coverage

**Description**

Differentiable programming is an experimental language feature that allows developers to create differentiable closures, define differentiable protocol requirements, and take the derivative of functions. Today, there is a number of common language features unsupported by differentiable programming. To increase differentiable programming’s coverage of these language features, the student will design and implement differentiation features such as default implementations of differentiable protocol requirements, key path expressions as differentiable functions, differentiable throwing functions, enum differentiation, etc.

**Skills required**

Familiarity with basic differential calculus and compiler frontends.

**Potential mentor(s)**

Richard Wei

### Swift Numerics: Decimal64

Add Decimal64 to the Swift Numerics package (with a stretch goal of also adding Decimal128). These types will bind the IEEE 754 decimal floating-point types (https://en.wikipedia.org/wiki/Decimal_floating_point). Depending on the mentee’s interests, we could pursue targeted micro-optimizations for arithmetic on specific architectures, develop test vectors for this and other decimal libraries, or begin work on transcendental functions for these types.

**Skills required**
Interest in numerical computing, familiarity with Swift or C.

**Potential mentor(s)**
Steve (Numerics) Canon

### Swift ArgumentParser: Interactive mode

ArgumentParser provides a straightforward way to declare command-line interfaces in Swift, with the dual goals of making it (1) fast and easy to create (2) high-quality, user-friendly CLI tools. For this project, we would design and implement an interactive mode for tools built using ArgumentParser that prompts for any required arguments not given in the initial command. This work would need to allow partial initialization of types, and could include features like validation and auto-completion for user input.

**Skills required**

Proficient with Swift and interest in command line tools.

**Potential mentor(s)**

Nate Cook

### Swift data structure implementation (priority queue, weak set/dictionary, or other useful data structure)

The Swift Standard Library currently implements just three general-purpose data structures: Array, Set and Dictionary. While these cover a huge amount of use cases, and they are particularly well-suited for use as currency types, they aren't universally the most appropriate choice -- in order to efficiently solve problems, Swift programmers need access to a larger library of data structures.

In this project, the student will create a production-quality Swift implementation for a general-purpose data structure, for use in even the most demanding applications. This is not an easy task — implementing a general-purpose collection type requires the student to gain in-depth experience in the following areas and more:

* API design (learning about subtle aspects of the Collection protocol hierarchy, getting deeply familiar with Swift naming conventions, achieving as much as possible with as little API surface as possible, discouraging common mistakes through API design, designing for future changes)
* Low-level Swift implementation concepts & techniques (unsafe memory management, ManagedBuffer, _modify accessors, @inlinable and similar attributes)
* Testing (writing maintainable tests that cover every edge case of every method, and verify semantic requirements of protocol conformances)
* Performance (writing and analyzing benchmarks, solving performance issues, understanding and verifying(!) performance guarantees such as O(1) or O(log(n)) complexity)
* Documentation (including documenting preconditions, performance guarantees and common gotchas, if any)

A successful project will deliver an open source data structure implementation as a Swift package, with an eye towards eventual inclusion in the Swift Standard Library. The data structure is chosen through negotiations between the student and the mentor — we’d like to set up the student for success by making sure the problem can be meaningfully tackled in the time available.

**Skills required**

Proficiency with Swift, interest in data structures.

**Potential mentor(s)**

Karoy Lorentey

### Tooling for swiftmodule Files
Today, the .swiftmodule format is fairly opaque, and the best insight our tooling can provide is a complete dump of the entire module with llvm-bc-analyzer. Providing a native tool that allows for exploring the contents of a Swift module would be an incredible debugging aid and teaching tool. It would also expose the student to a very central component of the Swift compiler.

**Skills required**

Cursory knowledge of C++, familiarity with Swift

**Potential mentor(s)**

Robert Widmann


### Show Swift inferred types in VSCode using SourceKit-LSP
Some IDEs have capability to show inferred types inline within the source code. Recently, similar support has been added for Rust inside VSCode by [rust-analyser](https://github.com/rust-analyzer/rust-analyzer). We would like to offer similar functionality also for Swift. In the project, the student will extend SourceKit-LSP to offer functionality as described in [this LSP proposal](https://github.com/microsoft/language-server-protocol/issues/956). Furthermore, they will extend the [SourceKit-LSP VSCode plugin](https://github.com/swiftlang/sourcekit-lsp/tree/main/Editors/vscode) to show the type hints in the editor. The changes to the editor can follow the same approach as the [rust-analyzer implementation](https://github.com/rust-analyzer/rust-analyzer/blob/master/editors/code/src/inlay_hints.ts).

**Skills required**

Knowledge of the Swift language; interest in developer tools

**Potential mentor(s)**

Alex Hoppen

### Alive2 for SIL

[Alive2](https://github.com/AliveToolkit/alive2) is a tool that enables the verification of the correctness of LLVM optimization passes. The tool uses the Z3 constraint solver to produce counterexamples for unsound optimizer passes. While the implementation is bound to LLVM IR, the principles behind Alive2 apply equally to SIL. The candidate would produce a tool that parses SIL and integrates SIL’s semantics into a set of constraints to submit to Z3 to verify the soundness of SIL optimization passes. This can be accomplished in a number of ways, including a pure Swift tool or a C++ tool that integrates directly with the Swift compiler libraries. The tool does not need to be complete - merely being able to verify even a subset of SIL would be a huge benefit.

**Skills required**

Knowledge of Swift, Cursory knowledge of [SIL](https://github.com/swiftlang/swift/blob/main/docs/SIL.rst)

**Potential mentor(s)**

Robert Widmann




### More ideas

We are still collecting ideas from various teams inside and outside Apple.

If you have an idea of your own, you can propose it on the [Development forum](https://forums.swift.org/c/development) and connect with potential mentors.

Projects must have a tangible result, and be possible to successfully complete by a student within the allocated ~175 hours for the project.
New project ideas will need to find a mentor to endorse the project in order to be accepted.

When posting on the forums about GSoC this year, please use the [`gsoc-2021` tag](https://forums.swift.org/tag/gsoc-2021), so it is easy to identify.
