---
layout: new-layouts/base
title: Project Ideas for GSoC 2022
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [GSoC 2022](https://summerofcode.withgoogle.com/). If you would like to apply as a GSoC student, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
2. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2022` tag](https://forums.swift.org/tag/gsoc-2022), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform which also has a number of spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct-message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

If you would like to reach out to a mentor privately, rather than making a public forums post, and the forums are not allowing you to send private messages (yet), please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc2022]` tag in the email subject and describe the project you would like to work on – and we'll route you to the appropriate mentor.

## Potential Projects

### SwiftSyntax

#### Use SwiftSyntax itself to generate SwiftSyntax’s source code

**Project Size**: Large (350 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Python knowledge is beneficial but not necessary

**Expected difficulty**: Medium

**Description**:

[SwiftSyntax](http://github.com/swiftlang/swift-syntax) heavily relies on code-generation for its syntax node definitions. These files are currently being generated using gyb, a Python-based code generation tool developed as part of the Swift compiler. SwiftSyntax itself also has code generation capabilities, which have recently been significantly improved by the introduction of [SwiftSyntaxBuilder](https://github.com/swiftlang/swift-syntax/tree/main/Sources/SwiftSyntaxBuilder).

During the Google Summer of Code project, the student will migrate the current gyb-based code generation to use SwiftSyntaxBuilder, dogfooding SwiftSyntaxBuilder inside SwiftSyntax itself. To perform the migration, the student will also make further improvements to SwiftSyntaxBuilder, with the goal of transitioning SwiftSyntaxBuilder from its current development state to be production-ready.


**Expected outcomes/benefits/deliverables**:

Valuable real-world experience of using SwiftSyntaxBuilder and a production-ready Swift library to generate Swift code.

**Potential mentors**:

Alex Hoppen

### Swift on Linux and Server

#### Native Linux Swift installer packages (RPMs, Debs) for Swift

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift and scripting languages
- Proficient with RPMs, Debian packages and software packaging on Linux.

**Expected difficulty**: Medium

**Description**:

Installing Swift toolchain on Linux today is done by downloading tarballs, and installing the required dependencies manually. Supporting native packages like RPMs and Debian packages would make using Swift on Linux dramatically easier.  Prototype versions of such packages exist, but there is further work that needs to be done to turn them into a high quality product that the Swift community could use in production use cases.

**Expected outcomes/benefits/deliverables**:

High quality RPMs and Debian packages that follow RPM and Debian best practices.

**Potential mentors**:

Tom Doron, Mishal Shah


#### Backtraces support for Swift on Linux

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with backtrace mechanisms in C++ or other languages
- Optionally, some familiarity with libraries like backtrace_symbols, libbacktrace, backward-cpp etc.
- Basic proficiency with C++ and Swift

**Expected difficulty**: Medium / Hard

**Description**:

Today, Swift does not produce backtraces when a process crashes on Linux, which could hinder users ability to troubleshoot production issues. To address the need, the Swift server workgroup has created a library which relies on private APIs and is a stop gap solution. The goal of this project is to design and prototype a high quality solution that can be integrated into the Swift runtime.

**Expected outcomes/benefits/deliverables**:
Swift produces quality backtraces when a process crashes on Linux.

**Potential mentors**:

Tom Doron, or Dario Rexin

#### Kafka client package

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Nice to have: Kafka experience
- Nice to have: experience with wrapping C APIs from Swift

**Expected difficulty**: Medium

**Description**:

Kafka is a widely used distributed event streaming platform for high-performance data pipelines. Since the Swift on Server ecosystem is becoming more mature and with the recent introduction of Concurrency features in the language, we want to provide a Kafka client in Swift that allows to produce and consume messages. This client should vend native Swift APIs that leverage the new Concurrency features. Furthermore, the client should use librdkafka (https://github.com/edenhill/librdkafka) and wrap its C APIs.

**Expected outcomes/benefits/deliverables**:

Implementation of a native Swift package wrapping librdkafka that vends Swift APIs using Concurrency features.

**Potential mentors**:

Franz-Joseph Busch

### Swift Package Manager

#### Improve CLI User Experience

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Experience with CLI based systems

**Expected difficulty**: Easy

**Description**:

SwiftPM is used in two main ways: As a library integrated into Xcode and as a command line tool. The CLI user experience can be improved by adopting modern presentation techniques about concurrent processes such as build, tests and download progress. SwiftPM already has most of the required information available for presentation, and this work is focused on the design and implementation of a better UX/UI for this information.

**Expected outcomes/benefits/deliverables**:

Better user experience of using SwiftPM as a CLI tool.

**Potential mentors**:

Boris Beugling, Anders Bertelrund, Tom Doron


### Software Bill of Materials

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Experience with dependency management systems

**Expected difficulty**: Medium

**Description**:

Software Bill of Material (aka SBOM) is a technique for sharing dependency versions between different projects. This technique is useful for larger systems that span across multiple repositories, share same core dependencies, and need to align the versions of these core dependencies system wide.

See more:

* [https://en.wikipedia.org/wiki/Software_bill_of_materials](https://en.wikipedia.org/wiki/Software_bill_of_materials)
* [https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)

**Expected outcomes/benefits/deliverables**:

* Support BOM as new dependency type in SwiftPM, helping companies that build large systems with Swift.
* Produce BOM artifact from a resolved dependencies graph.


**Potential mentors**:

Boris Beugling, Anders Bertelrund, Tom Doron


#### Package creation command and templates support for SwiftPM

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift

**Expected difficulty**: Easy

**Description**: SwiftPM includes a simple system for creating new packages, which is good for trivial use cases, but not flexible enough for more sophisticated development scenarios. To extend this feature, we can adopt a template driven system, potentially based on SwiftPM's plugin system.

See more:

* [https://forums.swift.org/t/pitch-new-command-for-package-creation-and-package-templates](https://forums.swift.org/t/pitch-new-command-for-package-creation-and-package-templates/47874)

**Expected outcomes/benefits/deliverables**:

Users can define their own templates or plugins for deciding how the package creation sub-system works.

**Potential mentors**:

Boris Beugling, Anders Bertelrund, Tom Doron

### Swift-DocC

Swift-DocC is the documentation compiler for Swift, read more about it here: [Swift-DocC is Now Open Source](/blog/swift-docc/).

#### Swift-DocC support for diffing documentation archives

**Project Size**: Large (350 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Familiarity with Swift-DocC and developer tooling.

**Expected difficulty**: Medium

**Description**:

Currently, DocC supports publishing documentation for a single version of a framework. However, as frameworks evolve, their APIs and documentation content do as well. To help framework authors and users better keep track of changes in a framework, this project explores new functionality to produce diff data that can be used by DocC’s web renderer to present API changes and documentation changes UI. The participant will take part in collaborative technical design and Swift-DocC compiler development.

**Expected outcomes/benefits/deliverables**:

Technical design and implementation for emitting diff data when compiling documentation.


**Potential mentors**:

Franklin Schrans


#### Quick navigation in DocC Render

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Proficient with web technologies such as JavaScript and CSS
- Basic familiarity with Swift-DocC and developer tooling

**Expected difficulty**: Medium


**Description**:

The new Swift-DocC sidebar provides an easy to get a bird’s-eye of a framework’s documentation content, this project explores adding a quick navigation UI to jump to a symbol using keyboard shortcuts, similar to how IDEs support jumping to symbols. The participant will take part in collaborative UI/UX design and Swift-DocC Render web development.

**Expected outcomes/benefits/deliverables**:

UX design, technical design, and implementation for a quick navigation UI in documentation websites.

**Potential mentors**:

Marina Aisa, Beatriz Magalhaes


### Swift Standard Library / Packages

#### Swift ArgumentParser: Interactive mode

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift
- An interest in command line tools

**Expected difficulty**: Medium

**Description**:

ArgumentParser provides a straightforward way to declare command-line interfaces in Swift, with the dual goals of making it (1) fast and easy to create (2) high-quality, user-friendly CLI tools. For this project, we would design and implement an interactive mode for tools built using ArgumentParser that prompts for any required arguments not given in the initial command. This work would need to allow partial initialization of types, and could include features like validation and auto-completion for user input.

**Expected outcomes/benefits/deliverables**:
Design, implementation, and tests of an interactive CLI.


**Potential mentors**:

Nate Cook

### Swift

#### Improving Debug Output Of The Type Inference Algorithm

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with C++

**Expected difficulty**: Medium


**Description**:

Swift’s type inference algorithm, implemented by the constraint solver, supports printing of debug information while type-checking an expression. This data in intended to help compiler developers to understand how/when/what types have been inferred, what restrictions have been applied, and what overload choices have been used in each attempt to reach a solution. Unfortunately, for a complex expression, the constraint solver would produce a lot of output which makes it very hard or sometimes impossible to work with, even for experienced compiler developers, because there were too many choices that the solver had to make and a lot of irrelevant information provided for each one of them.

The goal of this project is to make the output of the constraint solver human friendly by including only the important information for understanding the source of each inferred type and errors that were encountered, and changing the format and presentation of the output in general and for each of its components.

**Expected outcomes/benefits/deliverables**:

The new and improved debug output of the constraint solver which is much easier to work with for both experienced compiler developers and newcomers to the project.

**Potential mentors**:

Pavel Yaskevich


### Swift and C++ Interoperability

Swift and C++ interoperability is an ongoing open-source project that aims to make Swift APIs convenient to use from C++ (and vice versa). It's spearheaded
by the [Swift and C++ interoperability workgroup](https://forums.swift.org/c/development/c-interoperability/82).

#### Bridging Swift Error Handling Model to C++

**Project Size**: Large (350 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Basic proficiency with C++ (advanced knowledge of C++ is not required)

**Expected difficulty**: Medium

**Description**:

This project builds upon the ongoing open-source effort for exposing Swift APIs to C++, by adding support for exposing functions that `throw` Swift errors to C++, and by providing C++ classes that let users handle Swift `Error` values from C++.

This project has two primary aspects. At first, the participant will need to extend the C++ interface generator for a Swift module to emit C++ interfaces for Swift
functions that `throw`, and a C++ class that represents Swift's `Error` type. Then, the participant will need to implement a C++ exception class that wraps around
the `Error` type, and a C++ class that resembles the proposed [std::expected class](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2017/p0323r4.html), to provide error handling for clients that don't use C++ exceptions. The participant will need to write test cases to verify the implementation. The participant will also need to interact with the Swift open-source community when working on the implementation.


**Expected outcomes/benefits/deliverables**:

- The participant will learn more about Swift's error handling model, C++ error handling model, and working with an open-source compiler codebase.
- Enable C++ users to call Swift functions that can throw. Enable C++ users to examine error values produced by Swift.


**Potential mentors**:

Alex Lorenz


#### Bridging Swift Enums With Associated Values to C++

**Project Size**: Medium (175 hours)

**Recommended skills**:

- Basic proficiency with Swift
- Basic proficiency with C++ (advanced knowledge of C++ is not required)

**Expected difficulty**: Medium

**Description**:

This project builds upon the ongoing open-source effort for exposing Swift APIs to C++, by adding support for exposing enumerations with associated values to C++. These enumerations are [documented in the Swift language guide](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html#ID148).

The participant will need to extend the C++ interface generator for a Swift module to emit a C++ class that represents Swift enumerations with associated types. The generator will also need to be extended to emit the C++ member functions that allow the following operations in C++:

- switch over the enumeration cases
- check if the enum is of a specific case
- extract the payload of the associated value of the case

The participant will need to write test cases to verify the implementation. The participant will also need to interact with the Swift open-source community when working on the implementation.


**Expected outcomes/benefits/deliverables**:

- The participant will learn more about Swift's enums with associated types, and working with an open-source compiler codebase.
- Enable C++ users to create and examine Swift enumerations with associated values.
- Enable C++ users to pass Swift enumerations with associated values to C++, and vice versa.

**Potential mentors**:

Alex Lorenz

#### Providing Swift overlays for C++ standard library types

**Project Size**: Medium (175 hours)

**Skills required**:

- Basic proficiency with Swift
- Basic proficiency with C++ (advanced knowledge of C++ is not required)

**Expected difficulty**: Medium

**Description**:

Swift and C++ interoperability is an ongoing open-source initiative
that aims to make C++ APIs convenient to use from Swift (and vice versa). It's spearheaded
by the Swift and C++ interoperability workgroup (https://forums.swift.org/g/cxx-interop-workgroup, https://forums.swift.org/c/development/c-interoperability/82).
This project builds upon the ongoing effort for exposing C++ APIs to Swift,
by providing some Swift overlays for the C++ standard library types, like std::string
and std::vector.

The participant will need to write Swift code to provide conformances to standard Swift protocols such as Collection for several C++ standard library types, like the following ones:

- `std::string`
- `std::vector`
- `std::map`
- `std::set`

These conformances should be built as a separate overlay module, similar to the Darwin overlay and made available in Swift toolchains. The participant will need to modify the CMake build scripts to enable building and packaging the overlay module.
The participant will need to write test cases to verify the implementation and also need to interact with the Swift open-source community to obtain and respond to code reviews while working on the implementation.

**Expected outcomes/benefits/deliverables**:

The participant will learn more about Swift's type system, the Swift standard library protocols, and the C++ standard library types like `std::string` and `std::vector`. The participant will also learn more about  working with an open-source compiler codebase.

Successful implementation of this project would enable Swift users to use certain C++ standard library types such as std::vector with APIs vended by the Swift standard library. E.g., this would enable iterating over a `std::vector` with a Swift for-in loop or invoking a compactMap method on it.

**Potential mentors**:
Egor Zhdan and Alex Lorenz

