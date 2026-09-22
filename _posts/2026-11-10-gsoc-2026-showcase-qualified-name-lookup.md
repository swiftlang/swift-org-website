---
layout: new-layouts/post
published: false
date: 2026-11-10 17:00:00
title: "GSoC 2026 Showcase: Qualified Name Lookup for swift-syntax"
author: [filipsakel, samkhouri, ktoso]
category: "Community"
---

The Swift community participated in [Google Summer of Code](https://summerofcode.withgoogle.com) 2026, and we've recently been showcasing all of the projects and work accomplished here on the Swift blog. 
You can learn more by following these convenient links:

- [DocC language features in SourceKit-LSP](/blog/gsoc-2026-showcase-docc-language-features/)
- [Task and TaskGroup tracking for Swift Concurrency](/blog/gsoc-2026-showcase-task-tracking/)
- Qualified name lookup for swift-syntax (this post)

Each GSoC contributor has shared a writeup about their project and experience in the program. 
The third and last post in this year's series, contributed by Filip Sakel, 
added qualified name lookup to swift-syntax, making it possible for source tools to resolve a type reference to its declaration and locate that type's members.
To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2026-qualified-name-lookup-for-swift-syntax/89331).

---

## Qualified Name Lookup for swift-syntax

## Introduction

As part of Google Summer of Code 2026, I implemented a preliminary version of qualified name lookup in swift-syntax under the mentorship of Pavel Yaskevich ([@xedin](https://forums.swift.org/u/xedin)). Building on Jakub Florek's GSoC 2024 [*un*qualified-name-lookup project](https://forums.swift.org/t/gsoc-2024-swiftlexicallookup-a-new-lexical-name-lookup-library/75889), this effort exposes syntactic queries formerly confined to the Swift compiler as an easy-to-use API in the swift-syntax package. Now, swift-syntax can find definitions of types and type members, like a simplified version of an editor's "jump to definition" function. Namely, developers of build tools, such as linters, code generators and macros, can determine which declaration a `TypeSyntax` refers to, or find that type's members.

## Motivation

The proposed qualified lookup narrows the gap between *SwiftSyntax*'s currently limited parsing facilities and more advanced AST queries, which build-tool developers usually outsource to the [*SourceKitten*](https://github.com/jpsim/SourceKitten) library, a tool primarily geared to Integrated Development Environments.

The 2024 project's *SwiftLexicalLookup* *swift-syntax* module is already powering certain features in build tools such as [*SwiftLint*](https://github.com/realm/SwiftLint/blob/d4dc4663c43a308364a2d0fd438cf8dd1497d8cb/Source/SwiftLintBuiltInRules/Rules/Lint/UnneededEscapingRule.swift#L4) and [*swift-java*](https://github.com/swiftlang/swift-java/pull/336). I hope these projects and additional build tools can leverage the new qualified lookup queries. To illustrate the novel functionality, consider this code:

```swift
struct MyView {
  var model: MyModel // <- Resolve 'Model' and find members named 'sayHi()'
}
final class MyModel {
  func sayHi() { print("Hi") } // <- Returns the function declaration
}

```

In the example above, *SwiftLexicalLookup* can now resolve the `MyModel` type and find members matching the name "sayHi()".

## Challenges

Swift is extremely expressive, so finding a type's extensions turned out to be one of the harder parts of the project. Swift's type aliases make finding extensions a global problem: to resolve `A`, I couldn't just find `extension A {}`, I also needed to find, say, `extension AliasedA {}`. Instead, I had to bind all accessible extensions to determine which ones actually resolve to `A`. Swift also lets you extend a type declared inside an extension, which makes extension binding incremental: one by one, each unbound extension has to be resolved, admitted into a dependency graph, and any dependent extensions evicted if that resolution changes. I spent the remaining six weeks of GSoC designing the dependency graph that powers this extension binding.

## Future Directions

I still need to upstream a lot of the type-resolution and extension-binding features. Then, the new API needs to be formally proposed through the RFC process.

I think validating against the compiler's outputs is also crucial for correctness and consistency. Further, supertype lookup, filtering by access-control modifiers, expanding attached macros, and performing lookup in the current and imported modules would make for incredibly useful additions. More abstractly, this library could also be benchmarked and optimized for performance and memory usage. I think an arena allocator for ephemeral allocations during type resolution and extension binding is a promising direction.

## Reflection

I found designing a novel system for qualified lookup quite challenging. The design space was big, and I was overwhelmed at first. I had to remind myself to start small and implement a minimum viable product: the preliminary `findDirectMembers` API. I also learned to ask my mentor and other community members for guidance, who, in turn, helped me simplify the target interface to the `ValueDeclSyntax` result type. Of course, `ValueDeclSyntax` came to fruition because I was working on related issues in the compiler, receiving helpful comments from PR reviews, and reading the documentation as part of my research. With `ValueDeclSyntax` in my toolbox, the rest of the project became dramatically simpler. Hence, I discovered that system design is about sketching ideas by drawing on others' perspectives, working on adjacent problems, and reading documentation.

The same idea of focusing on the minimum viable product helped me devise the different pieces of type resolution. Namely, I found it incredibly helpful to write tests at different levels of complexity and to focus on getting the simple tests to pass first. By writing code that passed the simple tests, the basic components of type resolution, like handling leaf type-syntax nodes, naturally emerged. Granted, some tests were inappropriate for that level of the system, for instance, I had tests with extensions while still working on type resolution. However, test-driven development gave me a concrete target and tangibly marked my successes.

Finally, mapping out extension binding taught me the importance of assertions and comprehensive logging. It's really easy to mess up extension binding. So, by investing in extensive and intuitive logging, I gained a lot of visibility into what my code was doing. What's more, assertions helped me identify erroneous code faster. Especially when working with extensions that contain nested types, breaking up each graph operation into smaller parts, like "remove this nested type" or "unbind this type's extensions", and enforcing invariants at every step tremendously simplified debugging.

In sum, I now better understand the challenges of system design and have developed communication, organizational, and code-reasoning skills to aid me in the future.

### Acknowledgements

Solving an interesting problem in a real-world codebase with Pavel’s exceptional mentorship made GSoC an incredibly fulfilling experience. Moreover, I want to thank Jakub Florek, Douglas Gregor, Alex Hoppen, Rintaro Ishizaki, and Slava Pestov for participating in the community discussions, providing helpful pointers, and thoroughly reviewing my code. I extend my utmost gratitude to Pavel, the Swift organizers, and the GSoC admins for this opportunity. I hope to continue working on Swift and related open-source projects in the future.

---

Continue reading a more detailed version of Filip's writeup on the [Swift forums](https://forums.swift.org/t/gsoc-2026-qualified-name-lookup-for-swift-syntax/89331).
