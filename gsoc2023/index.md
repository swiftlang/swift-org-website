---
layout: new-layouts/base
title: Project Ideas for GSoC 2023
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [GSoC 2023](https://summerofcode.withgoogle.com/). If you would like to apply as a GSoC student, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
3. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2023` tag](https://forums.swift.org/tag/gsoc-2023), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform which also has a number of spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct-message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

If you would like to reach out to a mentor privately, rather than making a public forums post, and the forums are not allowing you to send private messages (yet), please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc2023]` tag in the email subject and describe the project you would like to work on – and we'll route you to the appropriate mentor.

## Potential Projects

### Swift Dev Experience

#### Implement Incremental Re-Parsing in SwiftParser

**Project size**: Medium

**Recommended skills**

- Proficiency in Swift
- Knowledge of parsers is a bonus, but can be acquired during the project

**Description**

The Swift parser written in C++ was able to incrementally re-parse a syntax tree after an edit, re-using syntax nodes that have not changed. This functionality was not implemented when we [re-implemented the parser to Swift](https://github.com/swiftlang/swift-syntax/tree/main/Sources/SwiftParser).

The goal of this project is to port the old incremental re-parsing design to Swift, set up unit tests that make sure incremental re-parsing produces the same result as parsing the tree from scratch, and to expand the old incremental re-parsing design to re-use more syntax nodes.

Note that the ability to incrementally re-parse a syntax tree has been removed from the C++ code base after SwiftParser was implemented. Check out the release/5.6 branch to view the last version of incremental parsing. This [pull request](https://github.com/swiftlang/swift/pull/16340) initially implemented incremental parsing in C++.

**Expected outcomes/benefits/deliverables**

The goal of this project is to implement incremental re-parsing of Swift code in the new parser with a strong focus on performance to keep parsing times well below 10ms, even for files with multiple thousand lines of code

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen)

### Swift/C++  Interop

#### Expand the Swift overlay for the C++ Standard Library

**Project size**: Medium

**Recommended skills**

- Proficiency in Swift
- Basic knowledge in C++

**Description**

Swift and C++ interoperability is an ongoing open-source initiative that aims to make C++ APIs convenient and safe to use from Swift (and vice versa). An important part of the project is to surface C++ standard library to Swift users through APIs that are natural to use from Swift and at the same time are safe and performant.

The Swift overlay for the C++ standard library is a Swift module that contains Swift extensions for the C++ standard library types. In particular, it provides initializers that allows clients to convert between std types in C++ to corresponding ones in Swift e.g.  std::string to Swift.String and vice versa. As part of this project, the participant will identify more APIs where such conversion initializers can be provided and implement them. For instance, an initializer could be added to std::map that takes an instance of Swift.Dictionary as a parameter.

They will also review the API surface of commonly used C++ standard library types and improve their ergonomics when used from Swift.

**Expected outcomes/benefits/deliverables**

Design and implementation of new C++ standard library overlay functionality that allows converting between more C++ types and Swift types, and expand the C++ std APIs that can be accessed from Swift.

**Potential mentors**

- [Egor Zhdan](https://github.com/egorzhdan)

### Swift Package Manager

#### Scripting in Swift

**Project size**: Medium

**Recommended skills**

- Proficient with Swift and SwiftPM
- Familiarity with scripting languages is a plus

**Description**

Swift is a fun and powerful language, and people often want to use it also for their scripting needs. While writing simple scripts in Swift is possible today, it is not possible to use Swift packages in such scripts, which takes away from the full robustness of the language. In this project we will define a user-friendly syntax for expressing package dependencies in a script, a methodology to resolve such dependencies, and integrate the resolution into the Swift command line tools and REPL. Participants will participate in collaborative design, technical writing, and software development.

- See also:

There's a [pitch](https://forums.swift.org/t/pitch-swiftpm-support-for-swift-scripts-revision/46717) which outlines an initial design from a previous GSoC proposal that could be used as the basis of this work. It may need some polish, figuring out the details the project could aim for implementing a basic version of it.

**Expected outcomes/benefits/deliverables**

The goal of this project is to implement basic support for defining package dependencies for use in a script.

**Potential mentors**

- [Boris Bügling](https://github.com/neonichu)

#### Customizable package templates

**Project size**: Medium

**Recommended skills**

- Proficient with Swift and SwiftPM

**Description**
SwiftPM currently supports a handful of hardcoded templates that can act as a starting point for user projects. Since there are many different needs for such templates, there should be a way to customize these templates and share them with others without having to make changes to the SwiftPM codebase itself. It could also be useful to make templates interactive, so e.g. users can pick between including tests by default or choose a set of dependencies to include. In this project, we will define a format for templates, design an API for making them interactive and integrate these into the SwiftPM commandline tool in a user-friendly way.

**Expected outcomes/benefits/deliverables**

- The goal of this project is to implement support for customizable package templates in the SwiftPM commandline tool.

**Potential mentors**

- [Boris Bügling](https://github.com/neonichu)


### Swift on Server

#### Memcached Client

**Project size**: Medium

**Recommended skills**

- Basic proficiency with Swift
- Familiarity with SwiftNIO or other event loop systems

**Description**

We would like to create a Swift native implementation of a [Memcached Client](https://github.com/memcached/memcached) using [SwiftNIO](https://github.com/apple/swift-nio) for the networking stack. The goal is to implement the [meta command protocol](https://github.com/memcached/memcached/wiki/MetaCommands) of Memcached to send commands and receives responses. To achieve this we need to implement the request encoding and response decoding. Furthermore, our client should support request pipelining to improve its performance.

**Expected outcomes/benefits/deliverables**

The goal is to support the fundamental commands and expose as an asynchronous-first Swift API.

**Potential mentors**

- [Franz Bunsh](https://github.com/FranzBusch)


### Swift-DocC

#### Swift-DocC Authoring Localization Support

**Project Size**: Medium

**Recommended skills**

- Basic proficiency with Swift

**Expected difficulty**: Medium

**Description**

Swift-DocC-Render recently added support for rendering localized documentation. However, Swift-DocC currently only supports authoring documentation in a single language.

The goal of this project is to design and implement support for writing localized documentation by enhancing the Swift-DocC compiler to support localized DocC catalog inputs and produce an output that's compatible with Swift-DocC-Render's existing localization support. The participant will take part in collaborative technical design and Swift-DocC development.

**Expected outcomes/benefits/deliverables**

Technical design and implementation for authoring localized documentation.

**Potential mentors**

- [Bina Maniar](https://github.com/binamaniar)
- [Marina Aísa](https://github.com/marinaaisa)
