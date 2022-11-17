---
layout: post
published: true
date: 2022-11-17 10:00:00
title: Swift development focus areas for the next year
author: [rjmccall]
---

There's a lot of exciting work going on in the Swift project right now, and it's hard to keep track of it all because it's happening in many different repositories, pull requests, and forum threads.  To give the community a better view of the big picture, the Core Team recently surveyed workgroups and developers across the project, collecting information about what they're focused on over the next year.

Please keep in mind that nothing here is a lock for any particular release of the project; plans and priorities can change over time.  This also isn't an exhaustive list of everything happening in the project.  But we hope that you find this interesting and informative, and if you have questions about any of these areas, please feel free to reach out and ask for more details.

## Community organization

For a long time, Swift has had a relatively centralized structure, with the Core Team directly overseeing many different areas of the project.  The Core Team has [recently begun reorganizing this](https://www.swift.org/blog/language-workgroup/) so that a lot more responsibility is held by dedicated workgroups for different areas.  Among other benefits, this makes it much easier for people to contribute by joining a workgroup that they're interested in.  The newly created workgroups are:

* the [Language Workgroup](https://www.swift.org/language-workgroup/), which manages the evolution of the Swift language and standard library;
* the [Website Workgroup](https://www.swift.org/website/), which manages the web content on `swift.org`;
* the [Documentation Workgroup](https://www.swift.org/documentation-workgroup/), which organizes the development of documentation tools and libraries for Swift programming; and
* the [C++ Interoperability Workgroup](https://www.swift.org/cxx-interop-workgroup/), which incubates language proposals for improving Swift's interoperability with C++.

These new workgroups join the longstanding [Swift on Server](https://www.swift.org/server/) and [Diversity](https://www.swift.org/diversity/) workgroups.  The Core Team is investigating creating several more workgroups, including one dedicated to improving Swift's usability across platforms.

## Language development

The Language Workgroup is focused on making progress in five major language areas:

* For [concurrency](https://forums.swift.org/t/swift-concurrency-roadmap/41611), completing the language support for the strict data isolation provided by [`Sendable`](https://github.com/apple/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md) and [actors](https://github.com/apple/swift-evolution/blob/main/proposals/0306-actors.md). This includes closing a number of known thread-safety holes, including around global variables and certain cross-actor calls. It also includes the possibility of adding language features to solve some usability problems that come up with strict isolation, for example to allow non-`Sendable` values to be moved between isolation domains in restricted situations.

* For [generics](https://forums.swift.org/t/manifesto-completing-generics/1656), starting work in earnest on the variadic generics language feature. This is a major feature that is expected to take multiple years to complete. The initial focus is on designing the core language model and implementing the basic compiler and runtime infrastructure to support it. One early milestone will be to allow tuple types to conditionally conform to protocols like `Equatable` when their elements do.

* For [ownership](https://forums.swift.org/t/manifesto-ownership/5212), two things:

  - Developing features to give programmers explicit control over the ownership of values in memory. This includes features to prohibit implicit copies, transfer ownership between contexts, and explicitly “borrow” values without copying them.

  - Adding basic support for non-copyable types. This will provide new ways to achieve high performance by restricting the lifecycle of critical values. These controls will in turn enable new ways to work with data in memory, combining the performance of current “unsafe” constructs with the safety of Swift’s standard library features.

* To further empower the creation of rich libraries and DSLs, developing the basics of a [procedural macro system](https://forums.swift.org/t/a-possible-vision-for-macros-in-swift/60900).  This effort will start with the creation of a vision document that will lay out a design for what macros can achieve in Swift and how they might fit into the language.

* Introducing support for [C++ interoperability](https://forums.swift.org/t/report-swift-and-c-interoperability-project-progress-in-the-swift-5-7-time-frame/61005) under the auspices of the new dedicated C++ Interoperability Workgroup:

  - Writing documents laying out the design visions for how C++ APIs will be made usable from Swift and vice-versa.

  - Stabilizing the currently prototyped interoperability features for using C++ from Swift, which include owned value types, trivial value types, API patterns such as foreign reference types and iterators, and some of the fundamental questions around methods, pointers, and l-value and r-value references.

  - Stabilizing the currently prototyped interoperability features for using Swift from C++, including how Swift value types, reference types, and functions are exposed to C++.

Any language changes arising from any of this work will be pitched and reviewed as normal under the [Swift evolution process](https://github.com/apple/swift-evolution/blob/main/process.md).  The Language Workgroup is also focused on improving and clarifying the evolution process, starting by publishing detailed documentation of the process the workgroup uses when managing an evolution proposal, which will be followed by guidelines for proposal authors and reviewers.

Finally, the Language Workgroup is planning to settle on the expected language changes for the upcoming Swift 6 language mode.  Swift periodically introduces new language modes so that the language can make progress without breaking source compatibility for existing code; the current language mode is Swift 5.  In addition to enabling strict isolation checking for Swift Concurrency, Swift 6 will include a number of small consistency fixes, as well as some changes that should improve the experience and productivity of programming in Swift.

## Build system integration and improvements

Compiler development teams are also working on improving several aspects of how the compiler interacts with the build system and other invocations of itself:

- Allowing build systems to integrate more deeply with the Swift compiler, which should give them more flexibility on how they build Swift programs and make builds more robust. This work includes moving the Swift compiler towards explicit module loading, including separating the discovery and compilation of module dependencies (both Swift and Clang) into separate compiler invocations. It also includes adding the ability to discover a module's link-time dependencies, permitting the build system to directly invoke the linker itself instead of requiring it to be invoked through the Swift compiler.

- Enhancing the quality of automatically generated Swift textual interfaces and the binary module infrastructure to help library authors to ship their Swift APIs more reliably and efficiently. Related diagnostics will also be added to nurture good engineering practices on that regard.

- Developing features to enable flexible software integration, allowing software components developed by different teams at different cadence to be integrated smoothly, both at compile time and at run time.

## Package registry

Development on the Swift package manager is focused on starting work on an open source package registry server implementation in concert with the community. The goal is to create the technical components required to transition Swift packages ecosystem from source control based dependencies to registry based ones, enhancing the security and reliability of the ecosystem. We will work with community-run projects such as the Swift Package Index to ensure great package discovery alongside the benefits that the registry brings.

## Implementation improvements

In addition to the feature work above, compiler developers are focused on several improvements at the implementation level:

- Developing a Swift parser that's written in pure Swift and feature-complete with the current C++ implementation.  This opens up a lot of new directions in tooling development and, once at feature parity, will supplant the C++ parser.

- Improving the type checking performance of result builders by migrating the type inference implementation over to a new, more scalable infrastructure that supports multi-statement closure inference.

- Improving the reliability of code completion and lookup-dependent tools such as Quick Help and Jump to Definition, especially in incomplete or ambiguous code, by integrating them more closely with the type checker.

- Generating less code when converting functions by removing the need for conversion thunks in some cases, particularly when passing closures to generic and imported functions.

- Generating less code when copying and destroying complex structs and enums by interpreting a compact encoding of the type layout instead of emitting specialized functions.

- Adding SIL optimizer support for new language features and predictable optimization related to object lifetimes and copies. A new suite of low-level SIL utilities are being designed to maintain ownership invariants throughout the existing optimization pipeline. This will result in reliable diagnostics and predictable performance.

- Rewriting the current interprocedural side-effect and escape analyses in Swift, replacing the current C++ implementations. The new implementations provide more accurate results and are significantly simpler.

## Documentation Workgroup

The [newly-formed Documentation Workgroup](https://www.swift.org/blog/documentation-workgroup/) is excited to drive efforts towards a better documentation experience across the Swift ecosystem. Over the next year, the workgroup will evolve tooling to address documentation needs and guide new efforts to contribute to the Swift project’s documentation.

To encourage more and better documentation in the Swift ecosystem, the workgroup’s initiatives will be twofold:

- Simplifying the process to get started with writing and publishing documentation using Swift-DocC. A goal is to move towards a model where developers can generate documentation for their projects without needing to configure an additional plugin.

- Expanding the scope of Swift-DocC to support multi-target project configurations and long-form prose content. For packages that are composed of multiple libraries, the goal is to support publishing documentation for a package as a whole rather than each of its libraries individually.

The workgroup will also support the development of the newly open-sourced “The Swift Programming Language” book (TSPL for short), with a goal of replacing the existing TSPL publication pipeline with the contents of the new repository. As part of this, the workgroup will work towards defining guidelines for writing great documentation for the Swift language. The longer-term goal will be to use these as a starting point for defining documentation guidelines for the Swift ecosystem at large, similar to the API naming guidelines.

## Website Workgroup

The [newly-formed website workgroup](https://www.swift.org/blog/website-open-source/) is focused on its mission to improve the swift.org website by:

- Improving the content on the website’s most visited pages, including the home page, the getting started guide, and the install and downloads pages. These pages are the ones most Swift users, or potential users, visit in order to quickly get started with Swift, and it is important to make sure they are intuitive to use and include just the right information to achieve that goal. As a stretch goal, the workgroup also wants to improve the discoverability of documentation, which is another area visitors of the website often seek.

- Iterating on layout design and navigation. As the website continues to grow and include domain specific information, such as guides for Swift on Server, the ability to navigate between different content types will become increasingly important. The workgroup plans to roll out the foundation of a visual design system that can help iterate faster and clear the way for the community to contribute in these areas.

- Encouraging the participation of the broader Swift community in the evolution of Swift.org, including making it easier to contribute to the website and Swift documentation.

- Encouraging the publishing of community-driven blog posts, including streamlining the process and clarifying the guidelines for such posts.

- Continuing to explore Swift-based technologies for generating the website.

## Swift on Server Workgroup

The Swift on Server Workgroup continues to focus on advancing the state of Swift on the server and on Linux, working with the community to create high quality libraries and tools, and increasing awareness in the industry. The workgroup's is focused on:

- Driving full adoption of Swift concurrency model across the server ecosystem, adopting async/await API as the standard for of user facing APIs.

- Promoting standardization of higher level server side functionality, for example: tracing, middleware, http common types, basic routing/http server types.

- Increasing awareness for how SwiftPM plugins can be used to advance the state of tooling for server use cases, including deployment to cloud platforms, and help incubate them.

- Increasing the coverage and consistency of the toolchain, libraries, and tooling across all platforms officially supported by the Swift project.

- Expanding the server focused guides available on swift.org.

- Advancing the support of Swift in popular industry tools such as Dependabot, GitHub Security Advisory DB, and others.

## Differentiable Swift

Work continues on supporting AI/ML applications with Differentiable Swift, focused on a number of improvements:

- Improving robustness by fixing issues in differentiable Swift that impact production applications as they are encountered. Fewer and fewer of these issues are being observed over time, but there are still some known issues (many with simple reproducers) in the issue tracker.

- Significantly improving the performance of compiled code using differentiable Swift. One example concerns the compiler-generated "backwards pass" through a Swift function. In principle, executing this pass should be nearly as fast as the original ("forward") version of the function. At present, the backwards pass is orders of magnitude slower in many cases; there are some planned optimizations over the next year that should make the backwards pass much faster.

- Implementing performance improvements to `KeyPath`s. While this is not strictly a part of differentiable Swift, when optimizing strongly typed models in Swift, key paths become extremely important for introspection of these models. Fast key path traversal is vital for many uses of strongly-typed models, so the hope is to upstream performance improvements in this area. As a first step, there’s been an effort to add a robust set of key path benchmarks to the compiler suite.

## Core Team addition

The Swift Core Team will continue to focus on building out the community and supporting the growth of the Swift ecosystem.  [Mishal Shah](https://github.com/shahmishal) will join the Core Team to bring additional leadership to that critical direction.  As a lead and advocate for much of the underlying infrastructure that supports the Swift project, Mishal has played an essential role in supporting the Swift project's growth for some time.

## Summary

That's it for now!  We've tried to cover the most important work happening across the project, but there are a lot of smaller things going on, too, that we just didn't have space to cover.  We hope that putting this information together in one place like this has been useful.

If you're interested in getting involved, there are a lot of ways to do it.  Language changes will be going through the normal evolution process, so keep an eye out for [discussion threads, pitches, and proposal reviews](https://forums.swift.org/c/evolution/18) about the work that you're interested in.  If you have questions or feedback about any of the items in this post, you can reach out to the appropriate workgroup, or, if you're not sure what that is, on the forums thread associated with this post (<link here>).
