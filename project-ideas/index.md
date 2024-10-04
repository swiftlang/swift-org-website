---
layout: new-layouts/base
title: Project Ideas
---

This page contains a list of potential project ideas that we are keen to develop during GSoC 2018. If you would like to apply as a GSoC student, please follow these two steps to get started:

1. Read through this page and identify the project ideas you find interesting.
2. Check out the [Development forum](https://forums.swift.org/c/development) to connect with potential mentors.

## Potential Projects

### Fuzzing/stress-testing tool

**Description**

Build a tool, in Swift code, which uses libSyntax to parse/mutate Swift projects for possible problems related to parser, type-checker, SIL generation, code-completion, refactoring actions, and sourcekitd's cursor-info functionality. The goal of the project is to stress-test the compiler pipeline and sourcekitd and catch crashers or hangs with mutations leading to invalid code, and invoking functionality like code-completion and refactoring at random points.

**Expected outcomes/benefits/deliverables**

Testing and improvements to the robustness of the compiler pipeline and sourcekitd infrastructure.

**Skills required**

* Swift (familiar)

**Potential mentors**

Nathan Hawes

**Expected difficulty**

Medium

### libSyntax-based indentation mechanism

**Description**

Replace existing Swift indentation mechanism with a new mechanism based on using libSyntax. Also part of this project will be to address the cases where the existing indentation results are sub-par.

**Expected outcomes/benefits/deliverables**

A more robust and easier to maintain Swift indentation mechanism, along with improved indentation results.

**Skills required**

* C++

**Potential mentors**

Xi Ge

**Expected difficulty**

Medium

### Swift compiler integration with external tools

**Description**

Add a compiler option that provides the path to an external tool for the compiler to execute and communicate with. The communication could be done via stdin/stdout using a JSON format. The compiler should pass the compiler arguments and the libSyntax tree of the currently compiling source file, allowing the tool to return custom diagnostics that the compiler includes along with the rest of the compiler diagnostics.

**Expected outcomes/benefits/deliverables**

A convenient mechanism for development and integration of custom linters, formatters, or other tools, during a build operation.

**Skills required**

* C++
* Swift (familiar)

**Potential mentors**

Rintaro Ishizaki

**Expected difficulty**

Easy

### Integration of libSyntax with the rest of the compiler pipeline.

**Description**

This project is for integrating the libSyntax tree and making use of it across the rest of the compiler pipeline (typechecker, diagnostics, etc.). It would involve:
- Having the parser generate only a libSyntax tree
- Derive the AST nodes from the libSyntax tree and have the AST nodes point to libSyntax nodes for source information
- It should be possible to provide a serialized libSyntax tree to the compiler and have typechecking and code-generation functionality without needing to parse code.

**Expected outcomes/benefits/deliverables**

A robust architecture with a clean separation of the parsing functionality from the rest of the compiler pipeline, and enabling future work for implementing incremental re-parsing.

**Skills required**

* C++
* Compiler-pipeline Basics

**Potential mentors**

Rintaro Ishizaki

**Expected difficulty**

Hard

### SwiftPM: Autogenerate `LinuxMain.swift` file for Linux

**Description**

Swift package authors are required to list their test cases in
a `LinuxMain.swift` file to run tests on Linux. This is because, it is not
possible (yet) to get a list of methods at runtime on Linux. However, we can use
`SourceKit` to find the test methods and then autogenerate this file as part of
the build process.

This project will involve:
- Add a feature in SwiftPM to generate compiler arguments for `SourceKit`.
- Write (minimal) Swift bindings for SourceKit's C API.
- Write a tool that will use `SourceKit` to generate the `LinuxMain.swift` file.
- Integrate the above tool as part of the SwiftPM build process.

**Expected outcomes/benefits/deliverables**

`LinuxMain.swift` file is auto-generated on Linux as part of SwiftPM build process.

**Skills required**

* Swift
* C/C++
* Build process knowledge will be helpful but not required.

**Potential mentors**

Ankit Aggarwal

**Expected difficulty**

Medium

### SwiftPM: Build a tool to suggest the next semver tag of a package.

**Description**

SwiftPM follows [semver](https://semver.org/) for dependency management. It is
easily possible for a package author to release a new version that violates the
semver conventions. A tool that can suggest the next version of a package will
be incredibly useful for package developers. This can be done by comparing
public API of the last released version and the current state of the API.
`SourceKit` provides an option to generate module interface of a Swift module. We
should be able to leverage that to build this tool. It is possible that new
functionality needs to be added to `SourceKit`.

**Expected outcomes/benefits/deliverables**

SwiftPM should have a command to will suggest the next semver tag. E.g.:

$ swift package next-version --after 1.4.3
Next tag should be 2.0.0 because of the following API changes:
+ public func foo() -> Int
- public func foo() -> String

**Skills required**

* Swift
* C/C++

**Potential mentors**

Ankit Aggarwal

**Expected difficulty**

Hard

### SwiftPM: Improve command line status reporting

**Description**

SwiftPM is a set of command line utilities that perform several interesting
tasks, e.g. dependency resolution, compiling, testing. The progress/status of
these tasks is reported in a mundane and serial fashion. Improving status
reporting using terminal based animations (and maybe emojis!) will lead to
a delightful experience for a package developer. As an example, see how buck
reports compilation progress: https://buckbuild.com/static/buck-build-15fps.gif

**Expected outcomes/benefits/deliverables**

swift package resolve, swift build and swift test should have improved CLI output.

**Skills required**

* Swift
* Terminal/Shell

**Potential mentors**

Ankit Aggarwal

**Expected difficulty**

Medium

### SwiftPM: Mechanically edit `Package.swift` manifest file

**Description**:

A Swift package uses a `Package.swift` manifest file to declare the package
specifications. This file should be manually edited in order to modify
dependencies, targets, products, etc. It would be really nice if package
developers can perform these operations using CLI. For e.g., adding a new target
requires creating a new directory, a source file and an entry in
`Package.swift`. If we can edit the manifest file mechanically, we can automate
such operations and make the process much easier. This would require using
`SourceKit` to figure out the cursor positions where the new entries should be
inserted in `Package.swift`.

**Expected outcomes/benefits/deliverables**

SwiftPM has ability to mechanically edit the `Package.swift` manifest file.

**Skills required**

* Swift
* C/C++

**Potential mentors**

* Ankit Aggarwal

**Expected difficulty**

Hard
