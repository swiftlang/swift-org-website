---
redirect_from: "/gsoc2025/"
layout: page
title: Google Summer of Code 2025
---

Swift participated in Google Summer of Code 2025 with four accepted projects, focused on SourceKit-LSP, Swift Testing and VS Code. Here are the accepted projects and the project ideas we offered that year. Browse the other years on the [GSoC page](/community/gsoc/).

Discussions from this year are tagged [`gsoc-2025`](https://forums.swift.org/tag/gsoc-2025) on the Swift forums.

## Accepted projects

Projects accepted for Swift in Google Summer of Code 2025, as [announced on the Swift forums](https://forums.swift.org/t/79810).

### Improve the display of documentation during code completion in SourceKit-LSP

**Contributor**: Ahmed Elrefaey

**Mentor**: Hamish Knight

**Blog**: [GSoC 2025 Showcase: Improved Code completion for Swift](https://www.swift.org/blog/gsoc-2025-showcase-code-completion/)

**Results**: [Improve the display of documentation during code completion in SourceKit-LSP](https://forums.swift.org/t/81976)

### JNI mode for swift-java's source jextract tool

**Contributor**: Mads Odgaard

**Mentor**: Konrad Malawski

**Blog**: [GSoC 2025 Showcase: Extending Swift-Java Interoperability](https://www.swift.org/blog/gsoc-2025-showcase-swift-java/)

**Results**: [New JNI mode added to swift-java jextract tool!](https://forums.swift.org/t/81858)

### Swiftly integration in VS Code

**Contributor**: Priyambada Roul

**Mentors**: Matthew Bastien, Chris McGee

**Blog**: [GSoC 2025 Showcase: Swiftly support in VS Code](https://www.swift.org/blog/gsoc-2025-showcase-swiftly-support-in-vscode/)

**Results**: [Bringing Swiftly support to VS Code](https://forums.swift.org/t/81886)

### Improved console output for Swift Testing

**Contributor**: Tien Quoc Bui

**Mentor**: Stuart Montgomery

**Blog**: [GSoC 2025 Showcase: Improved Console Output for Swift Testing](https://www.swift.org/blog/gsoc-2025-showcase-swift-testing-output/)

**Results**: [Improved Console Output for Swift Testing](https://forums.swift.org/t/82060)

## Project ideas

### Re-implement property wrappers with macros

**Project size**: 350 hours (large)

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



### Improve the display of documentation during code completion in SourceKit-LSP

**Project size**: 175 hours (medium)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift and C++

**Description**

The Language Server Protocol ([LSP](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)) offers two rich ways of displaying documentation while invoking code completion: Every code completion item can have documentation associated with it and while completing a function signature, the editor can display the available overloads, parameter names and their documentation through [signature help](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_signatureHelp). Currently, SourceKit-LSP only displays the first line of an item’s documentation in the code completion results and does not provide any signature help.

This project would implement functionality to return the entire documentation for all code completion items and also implement the LSP signature help request. Both of these will require functionality to be added in [SourceKit-LSP](http://github.com/swiftlang/sourcekit-lsp) and the [compiler’s code base](https://github.com/swiftlang/swift/blob/main/lib/IDE/CodeCompletion.cpp), which determines the list of feasible code completion results.

**Expected outcomes/benefits/deliverables**

SourceKit-LSP will display more information and documentation about the code completion items it offers, allowing developers to pick the item that they are interested in more easily.

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen)



### Refactor sourcekitd to use Swift Concurrency

**Project size**: 175 hours (medium)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift, including Swift 6’s concurrency model
- Basic proficiency in C++

**Description**

[sourcekitd](https://github.com/apple/swift/tree/main/tools/SourceKit) is implemented in the Swift compiler’s repository to use the compiler’s understanding of Swift code to provide semantic functionality. It is currently implemented in C++. By refactoring its [request handling](https://github.com/swiftlang/swift/blob/main/tools/SourceKit/tools/sourcekitd/lib/Service/Requests.cpp) and [AST manager](https://github.com/swiftlang/swift/blob/main/tools/SourceKit/lib/SwiftLang/SwiftASTManager.cpp) to Swift, we can take advantage of Swift’s concurrency safety, improving its data race safety, making it easier to reason about and maintain.

On macOS, sourcekitd is run as an XPC service, while on all other platforms, sourcekitd is run in the sourcekit-lsp process. As a stretch goal, refactoring the request handling would allow us to run sourcekitd in a separate process on Linux and Windows as well improving SourceKit-LSP's resilience as crashes inside sourcekitd would not cause a crash of the LSP process itself.

**Expected outcomes/benefits/deliverables**

Improved concurrency-safety of sourcekitd and better maintainability.

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen)



### Add more refactoring actions to SourceKit-LSP

**Project size**: 90 hours (small)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift

**Description**

Refactoring actions assist a developer by automatically performing repetitive and mechanical tasks, such as renaming a variable. SourceKit-LSP already provides refactoring actions and this project would add new actions to SourceKit-LSP. A few new refactoring actions have already been [proposed](https://github.com/swiftlang/sourcekit-lsp/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22code%20action%22) but this project is not necessarily limited to those ideas.

**Expected outcomes/benefits/deliverables**

A richer set of refactorings in SourceKit-LSP that aid developers in performing mechanical tasks.

**Potential mentors**

- [Alex Hoppen](https://github.com/ahoppen)

### Qualified name lookup for swift-syntax

**Project size**: 350 hours (large)

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

- [Doug Gregor](https://github.com/DougGregor)

### Swiftly Integration in VS Code

**Project size**: 175 hours (medium)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.
- Basic proficiency in TypeScript.
- Basic proficiency in VS Code extension development.

**Description**

[Swiftly](https://github.com/swiftlang/swiftly) is a toolchain manager written in and built for Swift. In order to aid adoption in the Swift community, it would be beneficial to provide a rich editor integration with the existing [Swift extension for VS Code](https://github.com/swiftlang/vscode-swift). This editor integration should aid the user in installing Swiftly itself as well as with installing and selecting Swift toolchains. This will require some effort in Swiftly itself to provide a machine readable interface that any editor could use to manage Swift toolchain installations.

**Expected outcomes/benefits/deliverables**

- Editor integration API in Swiftly for querying available toolchains
- VS Code should be able to install Swiftly for the user
- VS Code should be able to install Swift toolchains via Swiftly
- VS Code should be able to select the active Swift toolchain via Swiftly
- VS Code should show the version of the Swift toolchain in use

**Potential mentors**

- [Chris McGee](https://github.com/cmcgee1024)
- [Matthew Bastien](https://github.com/matthewbastien)

### DocC Language Features in SourceKit-LSP

**Project size**: 175 hours (medium)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.

**Description**

SourceKit-LSP has recently added a feature to support DocC Live Preview for editors such as VS Code. This feature could be further improved by providing language features such as go to definition as well as diagnostics for invalid/missing symbol names.

**Expected outcomes/benefits/deliverables**

- Syntax highlighting for DocC markdown and tutorial files
- Go to definition for symbols that appear in DocC documentation
- Diagnostics that report missing/invalid symbol names in DocC documentation

**Potential mentors**

- [Matthew Bastien](https://github.com/matthewbastien)
- [Alex Hoppen](https://github.com/ahoppen)

### Tutorial mode for the VS Code Swift extension

**Project size**: 90 hours (small)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift
- Basic proficiency in TypeScript
- Basic proficiency in VS Code extension development

**Description**

_This project can possibly be combined with the Swiftly Integration in VS Code project and the Tutorial mode for Swift project. When submitting project application for both together, please then mark it as a medium (175 hours) project._

Right now there isn't a whole lot of guidance on how to use the [Swift extension for VS Code](https://github.com/swiftlang/vscode-swift) once it is installed. Apart from reading [an article about it](https://www.swift.org/documentation/articles/getting-started-with-vscode-swift.html) and the "Details" tab of the Swift extension in VS Code it's up to the user to realize that a Swift toolchain will have to be installed and figure out the workflow to Build, Run, Test and Debug code. As well, people who are installing the extension could be new to programming and Swift in general. A tutorial mode that will show the features of the extension will be greatly beneficial for first time users.

The feature can possibly be implemented with [VS Code Walkthrough](https://code.visualstudio.com/api/ux-guidelines/walkthroughs) mode or something similar to the [CodeTour](https://github.com/microsoft/codetour) extension.

**Expected outcomes/benefits/deliverables**

- A better onboarding experience for first time users of the VS Code Swift extension
- Users learn about the features of the extension

**Potential mentors**

- Either [Adam Ward](https://github.com/award999) or [Paul Lemarquand](https://github.com/plemarquand) or [Matthew Bastien](https://github.com/matthewbastien)
- [Rishi Benegal](https://github.com/rbenegal)

### Tutorial mode for Swift in the VS Code Extension

**Project size**: 90 hours (small)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift
- Basic proficiency in TypeScript
- Basic proficiency in VS Code extension development

**Description**

_This project can possibly be combined with the Swiftly Integration in VS Code project and the Tutorial mode for VS Code Swift project._

Many users who install the VS Code swift extension could be new to Swift and programming in general. A tutorial mode that will show features of the programming language could allow users to experiment with their programs interactively and greatly enhance their learning experience. This tutorial mode can include examples from the [Swift Book](https://docs.swift.org/swift-book), a VS Code version of the [DocC tutorials](https://developer.apple.com/documentation/xcode/slothcreator_building_docc_documentation_in_xcode), [swift-testing](https://developer.apple.com/documentation/testing/) tutorials and code formatting tutorials using [swift-format](https://github.com/swiftlang/swift-format).

The feature can possibly be implemented with [VS Code Walkthrough](https://code.visualstudio.com/api/ux-guidelines/walkthroughs) mode or something similar to the [CodeTour](https://github.com/microsoft/codetour) extension.

**Expected outcomes/benefits/deliverables**

- A better onboarding experience for users who want to learn more about Swift
- Users learn about the features of the Swift programming language

**Potential mentors**

- Either [Adam Ward](https://github.com/award999) or [Paul Lemarquand](https://github.com/plemarquand) or [Matthew Bastien](https://github.com/matthewbastien)
- [Rishi Benegal](https://github.com/rbenegal)

### Improved console output for Swift Testing

**Project size**: 175 hours (medium)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.

**Description**

Enhance Swift Testing's reporting of test results to the console/terminal. Consider adding features like live progress reporting, nested output reflecting suite hierarchy, test metadata (display names, tags), parameterized test arguments, and more terminal colors. Perhaps include user-configurable options. If time allows, implement several alternatives and present them to the community (and the Testing Workgroup) for consideration. Factor code as portably as possible to support many platforms, and so it could be incorporated into a supervisory “harness” process in the future.

**Expected outcomes/benefits/deliverables**

- Add a new component in the [swift-testing](https://github.com/swiftlang/swift-testing) repository which receives events from the testing library and decides how to reflect them in console output.
- Modify supporting tools such as Swift Package Manager to allow enabling or configuring this functionality.
- Land the changes behind an experimental feature flag initially.
- Submit a proposal to the community and the Testing Workgroup to formally enable the feature.
- Summarize your effort with a demo of the new functionality including screenshots or recordings.

**Potential mentors**

- [Stuart Montgomery](https://github.com/stmontgomery)

### Improved command line tool documentation 

**Project size**: 175 hours (medium)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.

**Description**

Swift Argument Parser recently added a [command plugin](https://github.com/apple/swift-argument-parser/pull/694) to generate documentation markup for a command line tool.
This plugin could be improved by providing support for generating separate pages for each command and by leveraging additional markdown syntax to organize command line flags into sections and display possible values and default values.

Beyond the markdown output, this plugin could be further improved by generating a ["symbol graph"](https://github.com/swiftlang/swift-docc-symbolkit/tree/main) that describe each command and its flags, options, and subcommands. By describing the commands' structure, tools like [Swift DocC](https://github.com/swiftlang/swift-docc/tree/main) can further customize the display of command line tool documentation, support links to individual flags, and allow developers to extend or override the documentation for individual flags in ways that isn't overwritten when regenerating the documentation markup from the plugin. If time allows, prototype some enhancement to command line documentation in Swift DocC that leverage the information from the command symbol graph file.

**Expected outcomes/benefits/deliverables**

- A richer markdown output from the plugin.
- Support for generating separate pages for each command.
- Output a supplementary symbol graph file that describe the commands' structure.

**Potential mentors**

- [David Rönnqvist](https://github.com/d-ronnqvist)

### Documentation coverage

 **Project size**: 90 hours (small)

 **Estimated difficulty**: Intermediate

 **Recommended skills**

 - Basic proficiency in Swift.

 **Description**

 Enhance Swift DocC's experimental documentation coverage feature to write coverage metrics in a new extensible format that other tools can read and display. 
 Define a few types of metrics—for example Boolean (has documentation: true/false), Fraction (2/3 parameters are documented), Percentage, etc.—for this format. 
 Explore ideas for what documentation coverage information would be useful to emit. Explore ideas for how another tool could display that coverage information. 

 **Expected outcomes/benefits/deliverables**

 - Land the documentation coverage output format changes for the experimental feature in DocC.
 - Submit a pitch to the community and the Documentation Workgroup to formally enable the documentation coverage feature in DocC.
 - Summarize your effort with a demo of the new metrics and examples of how another tool could display that information.

 **Potential mentors**

 - [David Rönnqvist](https://github.com/d-ronnqvist)

### OpenAPI integration with DocC

**Project size**: 350 hours (large)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.
- Basic knowledge in HTTP APIs.

**Description**

[OpenAPI](https://www.openapis.org/) is a standard for documenting HTTP services. It allows creating documents in YAML or JSON format that can be utilized by various tools to automate workflows, such as generating the required code for sending and receiving HTTP requests.

OpenAPI is known for its tooling to generate documentation, but in the Swift ecosystem, developers are already familiar with how [DocC](https://github.com/swiftlang/swift-docc) renders documentation for Swift and Objective-C APIs. To enhance consistency and improve the developer experience, we aim to extend DocC’s support to OpenAPI documents.

**Expected outcomes/benefits/deliverables**

As part of the Google Summer of Code project, the student will develop a library/tool that can generate DocC documentation from an OpenAPI document.

Strech goals:

* Integrate the tool into the [Swift OpenAPI Generator](https://github.com/apple/swift-openapi-generator).
* Create OpenAPI Doc to DocC Live Preview plugin for VS Code.

**Potential mentors**

- [Sofía Rodríguez](https://github.com/sofiaromorales)
- [Si Beaumont](https://github.com/simonjbeaumont)
- [Honza Dvorsky](https://github.com/czechboy0)

### JNI mode for swift-java's source jextract tool

**Project size**: 350 hours (large)

**Estimated difficulty**: Intermediate

**Recommended skills**

- Basic proficiency in Swift.
- Basic proficiency in Java, since the source generator will be emitting both Java and Swift code.

**Description**

The existing [swift-java](https://github.com/swiftlang/swift-java) Java interoperability project currently supports both JNI and Java's new Foreign Function & Memory API's, 
however the latter source generator which works by analysis of existing Swift code, and emitting Java "accessors" to these
currently only works with JDK 22+ because it uses FFM for its implementation. It would be possible–and beneficial for platforms
where JDK 22+ is not available–to allow the `jextract` tool also operate in a limited functionality JNI mode.

This project would kickstart the work on a JNI mode for the `jextract` tool, allowing for calling for any Swift APIs
from Java, using these generated Java accessor classes.

**Expected outcomes/benefits/deliverables**

- Provide a new JNI mode for the `jextract`
- Achieve feature parity with the current day FFM mode of jextract
- The project can be stretched to provide more features and continue work on jextract, providing more flexibility in the tool 

**Potential mentors**

- [Konrad 'ktoso' Malawski](https://github.com/ktoso)
