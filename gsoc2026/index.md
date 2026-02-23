---
layout: page
title: Project Ideas for GSoC 2026
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [Google Summer of Code 2026](https://summerofcode.withgoogle.com/). If you would like to apply to GSoC as a contributor, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
3. Check out the [Development forum](https://forums.swift.org/c/development/gsoc/98) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2026` tag](https://forums.swift.org/tag/gsoc-2026), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform with spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

To start things off, we recommend starting a new thread or joining an existing discussion about the project you are interested in on the dedicated [GSoC forums category](https://forums.swift.org/c/development/gsoc/98). You should also _tag_ your thread with the `gsoc-2026` tag. It is best if you start a thread after having explored the topic a little bit already, and come up with specific questions about parts of the project you are not sure about. For example, you may have tried to build the project, but not sure where a functionality would be implemented; or you may not be sure about the scope of the project.

Please use the forums to tag and communicate with the project's mentor to figure out the details of the project, such that when it comes to writing the official proposal plan, and submitting it on the Summer of Code website, you have a firm understanding of the project and can write a good, detailed proposal (see next section about hints on that).

If you would like to reach out to a mentor privately rather than making a public forum post, and the forums are not allowing you to send private messages yet, please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc2026]` tag in the email subject and describe the project you would like to work on. We will route you to the appropriate mentor. In general, public communications on the forums are preferred though, as this is closer to the normal open-source way of getting things done in the Swift project.

## Writing a proposal

Getting familiar with the codebase you are interested in working on during GSoC helps to write a good proposal because it helps you get a better understanding of how everything works and how you might best approach the project you are interested in. How you want to do that is really up to you and your style of learning. You could just clone the repository, read through the source code and follow the execution path of a test case by setting a breakpoint and stepping through the different instructions, read the available documentation or try to fix a simple bug in the codebase. The latter is how many open-source contributors got started, but it's really up to you. If you do want to go and fix a simple bug, our repositories contain a label "good first issue" that marks issues that should be easy to fix and doable by newcomers to the project.

When it comes to writing the proposal, the [Google Summer of Code Guide](https://google.github.io/gsocguides/student/writing-a-proposal) contains general, good advice.

The best proposals include a detailed timeline, specific milestones and goals as well as an outline the technical challenges you foresee. It is best if you engage with your potential project mentor on the forums before contriburing, and have them clarify the goals and steps that they think are necessary for the project to be successful. Your proposal should have a clear goal, which can be successfully achieved as part of the weeks you'll be working it. Provide details about your approach, significant milestones you wish to achieve, and clarify with your potential mentor if they agree those seem reasonable. The time before proposal submissions is there for you to reach out and polish your proposal, so make sure you use it well! Good luck!

## Potential Projects

We are currently collecting project ideas on the forums in the dedicated [GSoC category](https://forums.swift.org/c/development/gsoc/98).

Potential mentors, please feel free to propose project ideas to this page directly, by [opening a pull request](https://github.com/swiftlang/swift-org-website/edit/main/gsoc2026/index.md) to the Swift website.

You can browse previous year's project ideas here: [2025](https://www.swift.org/gsoc2025/), [2024](https://www.swift.org/gsoc2024/), [2023](https://www.swift.org/gsoc2023/), [2022](https://www.swift.org/gsoc2022/), [2021](https://www.swift.org/gsoc2021/), [2020](https://www.swift.org/gsoc2020/), [2019](https://www.swift.org/gsoc2019/).


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

### Qualified name lookup for swift-syntax

**Project size**: 350 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.

**Description**

Qualified name lookup is the process by which a compiler resolves a reference  `A.f` into a lookup for entities named `f` within `A`. In Swift, this can mean looking into the type `A` and all of its extensions, superclass, protocols, and so on to find visible members. The project involves building a new library to be integrated into the [swift-syntax package](https://github.com/swiftlang/swift-syntax) that implements Swift's qualified name lookup semantics, making it easy to build source tools that resolve names. The library will likely include a symbol table implementation that provides efficient lookup of a given name within a given type. It should also integrate with last year's [unqualified name lookup library project](https://forums.swift.org/t/gsoc-2024-swiftlexicallookup-a-new-lexical-name-lookup-library/75889), to provide complete support for name lookup on Swift code processed with swift-syntax.

**Expected outcomes/benefits/deliverables**

- Swift library providing APIs for qualified name lookup in swift-syntax
- Documentation and tutorial for the library
- Integration of the Swift library with the `SwiftLexicalLookup` library that implements unqualified name lookup

**Potential mentors**

- [Pavel Yaskevich](https://github.com/xedin)


### Task and TaskGroup tracking for Swift Concurrency

**Project size**: 160 hours

**Estimated difficulty**: Advanced

**Recommended skills**

- Proficiency in C/C++ and Swift
- Understanding of atomics and memory ordering

**Description**

The Concurrency runtime presently does not provide a way to keep track of which `Task`s and `TaskGroup`s are executing.  This information is especially useful for debugging programs that use Swift Concurrency; without it, it's possible to end up in situations where no progress is being made but you cannot see which tasks are outstanding since none of them are actually executing on a thread (so they don't show up in backtraces).

An easy solution might be to have a global linked list of `Task`s and `TaskGroup`s, but that would cause unnecessary synchronization (or, for atomics, contention) between threads, which is highly undesirable.

The goal of this project is to investigate data structures we might use to track `Task`s and `TaskGroup`s and to measure their overhead to make sure that it is acceptable.  A stretch goal might be to implement the necessary support to provide a list of extant `Task`s and `TaskGroup`s in Swift's on-crash backtraces, and to provide some Python macros for LLDB that can list `Task`s and `TaskGroup`s.

**Expected outcome/benefits/deliverables**

- An implementation of `Task`/`TaskGroup` tracking for the Concurrency runtime
- A document detailing the design of the data structures used in the implementation and characterising their overheads, possibly by comparison to the naïve global list approach
- (Stretch) Support for dumping the list of `Task`s and `TaskGroup`s in the on-crash backtracer
- (Stretch) A Python module for LLDB to allow inspection of Concurrency runtime state

**Potential mentors**

- [Alastair Houghton](https://github.com/al45tair)
- [Mike Ash](https://github.com/mikeash)

### WebAssembly Reference Types (`externref`) Support in Swift Compiler

**Project size**: 200-300 hours

**Estimated difficulty**: Advanced

**Recommended skills**

- Proficiency in C/C++, Swift, and WebAssembly;
- Basic understanding of SIL and LLVM IR.

**Description**

Core WebAssembly supports primitive scalar and vector types, such as `i32`/`i64`/`f32`/`f64`, and `v128`. For bridging high-level types that have reference semantics, WebAssembly host environment usually maintains an ad-hoc table that maps indices in this table to references stored in it.

For example, to bridge a garbage-collected JavaScript value to WebAssembly, a naive implementation can allocate a JavaScript array that holds a reference to this value, while an index in this array is passed to Swift compiled to Wasm that it can operate on. While these ad-hoc tables are the primary means to interoperate with JavaScript from Swift, they're not optimal from binary size and performance perspective.

[Recent WebAssembly standard text defines a new built-in `externref` type](https://www.w3.org/TR/2025/CRD-wasm-core-2-20250616/#reference-types①) that can be stored in built-in WebAssembly tables and passed around on WebAssembly stack. It can't be stored in Wasm linear memory, which only supports basic numeric types, integer indices in the built-in table are used for that instead. To support this, LLVM represents `externref` as a pointer in a reserved address space, while Clang at a higher level represents this as a built-in `__externref_t` type lowered to LLVM pointer type in the reserved address space.

We're looking for a prototype of an experimental feature in the Swift compiler that allows easier interoperability with C and C++ code that uses `__externref_t` values. As a stretch goal, Swift standard library should facilitate easier interop with host environments for [WebAssembly embedding](https://www.w3.org/TR/2025/CRD-wasm-core-2-20250616/#a1-embedding).

**Expected outcome/benefits/deliverables**

- `WasmExternref` experimental feature that enables `WasmExternref` type in the Swift standard library;
- Lowering of operations on this type to [correct LLVM IR address space](https://discourse.llvm.org/t/rfc-webassembly-reference-types-in-clang/66939);
- Type checker semantics that corresponds to [existing `__externref_t` type in Clang](https://github.com/swiftlang/swift-for-wasm-examples/blob/main/DOMRefTypes/Sources/externref/bridge.c);
- (Stretch) Availability of Wasm `externref` table builtins in the Swift standard library for future use corresponding to `__builtin_wasm_table_*` available in Clang
- (Stretch) `WasmExternrefIndex` for wrapping `externref` table indices in types available in common Swift values address space.

**Potential mentors**

- [Max Desiatov](https://github.com/MaxDesiatov)

### WebAssembly Swift SDK with Support for Multi-threading

**Project size**: 100-160 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift and WebAssembly;
- Basic understanding of Python and Swift compiler build system.

**Description**

Multi-threading support in WebAssembly requires building code against `wasm32-unknown-wasip1-threads` triple, which is already supported in WASI-libc dependency of the Swift standard library.

Swift toolchain `build-script` infrastructure written in Python needs minor updates that will build and package artifacts built for this triple in existing Swift SDK bundle that's distributed on swift.org.

As a stretch goal, we'd like this project to include a review of the existing test suite to ensure that the newly supported triple is well tested and supported by the core Swift libraries.

**Expected outcome/benefits/deliverables**

- New Swift SDK with `wasm32-unknown-wasip1-threads` triple added to the existing Wasm Swift SDK bundle;
- Running Swift stdlib tests compiled for the new triple;
- (Stretch) CI setup for core Swift libraries building with the new Swift SDK.

**Potential mentors**

- [Max Desiatov](https://github.com/MaxDesiatov)

### DocC Language Features in SourceKit-LSP

**Project size**: 200 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.
- Basic proficiency in TypeScript.

**Description**

SourceKit-LSP has recently added DocC Live Preview support that can be used in editors such as VS Code. It allows users to view a real time side-by-side preview of their documentation directly in their editor.

Live preview could be further improved by providing language features such as go to definition as well as diagnostics for invalid/missing symbol names within DocC markdown and tutorial files. It would also be useful to have the links within the preview window take the user to the relevant symbol or documentation file within the code base.

**Expected outcomes/benefits/deliverables**

- Syntax highlighting for DocC markdown and tutorial files
- Go to definition for symbols that appear in DocC documentation
- Diagnostics that report missing/invalid symbol names in DocC documentation
- Clicking on links within live preview should take the user to the symbol

**Potential mentors**

- [Matthew Bastien](https://github.com/matthewbastien)
- [Prajwal Nadig](https://github.com/snprajwal)

### SwiftPM System Executables for Enhanced Plugin User Experience

**Project size**: 200 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift
- Basic proficiency in SwiftPM packages

**Description**

SwiftPM is somewhat unique as a package manager because it supports marking dependencies on packages from foreign package managers, such as apt, yum, and homebrew. Today this is mainly used for libraries to be linked into SwiftPM products.

SwiftPM plugins can depend on executable tools, built from source, to help generate code and resources. If a tool cannot be built from source using SwiftPM then the plugin can invoke it using an absolute path. But, how will it know if the tool is present at that path? Also, how will the user be guided to install the package if it is missing?

The idea is to implement a system executable target, similar to system library targets where package names can be specified based on different package managers. Plugins can then depend on system executable targets so that warnings are emitted if the tool cannot be found on the path, along with the recommended remedy (e.g. "apt-get install foo") for any build errors. Since package manager may place tools in different locations based on the platform, there would be a SwiftPM plugin API for a plugin to specify the tool name and then it can discover the full path location. Add in some popular language-specific package manager support to gain access to many more tools (e.g. npm, and pip).

**Expected outcomes/benefits/deliverables**

- Complete SwiftPM proposal and working pull request


**Potential mentors**

- [Chris McGee](https://github.com/cmcgee1024)

### Sysroot Support in Swift's build-script

**Project size**: 160 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic understanding of CMake, Python 
- Experience with the Swift compiler build system is a plus


**Description**

Extend Swift‘s `build-script` with an experimental flag which
provides the path to the sysroot of the target triple. This enables
[cross-compiling](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0387-cross-compilation-destinations.md)
to other sysroots, meaning the host triple is different to the target triple.
[Wasm](https://github.com/swiftlang/swift/blob/main/utils/swift_build_support/swift_build_support/products/wasmswiftsdk.py)
already uses a [sysroot](https://github.com/swiftlang/swift/blob/main/utils/swift_build_support/swift_build_support/products/wasmswiftsdk.py).
The approach is to generalize the mechanism by splitting out the Swift core library builds into separate build products to be used for cross-compiling.


**Expected outcomes/benefits/deliverables**
- New build products for cross-compiling Swift core libraries (reuse from Wasm).
- The new experimental flag from `build-script` is propagated to the new build products.
- Cross-compilation succeeds and tests run successfully on target system.
- Benefit is to be able to cross-compile to various Linux distros from one host system.
    It enables generation of Swift SDKs for cross-compilation.

**Potential mentors**

- [Max Desiatov](https://github.com/MaxDesiatov)

---


### Example project name

**Project size**: N hours

**Estimated difficulty**: ???

**Recommended skills**

- Basic proficiency in Swift.
- ...

**Description**

Description of the project goes here.

**Expected outcomes/benefits/deliverables**

- Expected deliverables of the project go here

**Potential mentors**

- Mentor name and link to their github

