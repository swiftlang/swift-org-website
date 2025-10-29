---
layout: new-layouts/post
published: true
date: 2024-02-NN 10:00:00
title: 'Swift GSoC 2024 highlight: Improve the display of documentation during code completion in SourceKit-LSP
author: [ktoso, ahmedelrefaey, hamish]
category: "Community"
---

Another year of successful Swift participation in [Google Summer of Code](https://summerofcode.withgoogle.com) 2025 came to an end recently, and this year we'd like to shine some light on the projects and work acomplished during the summer!

Summer of Code is an annual program, organized by Google, which provides hands-on experience for newcomers contributing
to open source projects. Participants usually are students, but do not have to be.

In this series of four posts, we'll highlight each of the Summer of Code contributors and their projects.

- [Bringing Swiftly support to VS Code](./2025-11-NN-swift-gsoc-2024-highlight-1-vscode-swiftly.md)
- [JNI mode for swift-java’s source jextract tool](./2025-11-NN-swift-gsoc-2024-highlight-2-swift-java-jextract-jni-mode.md)
- Improve the display of documentation during code completion in SourceKit-LSP (this post)
- [Improved Console Output for Swift Testing](./2025-11-NN-swift-gsoc-2024-highlight-4-swift-testing-output.md)

---

## Improve the display of documentation during code completion in SourceKit-LSP

Hi everyone!

This is Ahmed Elrefaey, I’m excited to share with you an update on my GSoC project, Improve the display of documentation during code completion in SourceKit-LSP, mentored by Hamish Knight.

### Project Goals

The aim of this project is to enhance how documentation is displayed in SourceKit-LSP during code completion by:

1. Showing the full documentation for a code completion item instead of the first paragraph only, which we call “brief documentation”.
2. Implementing Language Server Protocol’s [signature help](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_signatureHelp) request showing the user which overloads are available, along with their corresponding documentation.

### Progress

During this summer, we have made great progress on this project that I want to share with you.

We have successfully implemented full documentation comment retrieval for completion items by lazily retrieving the full documentation comment upon request to avoid having to fetch all documentation comments at once.

Here’s what SourceKit-LSP currently provides in VS Code (brief documentation):

![Brief documentation demo in VS Code.|690x412](/assets/images/gsoc-25/brief.gif)

And here’s how it looks with full documentation:

![Full documentation demo in VS Code.|690x412](/assets/images/gsoc-25/full.gif)

We have also implemented a large portion of signature help support by retrieving the available overloads similar to the existing argument completion logic and refactoring the logic for creating the code completion string to be reusable in signature help. The current implementation returns a list of viable overloads along with their full documentation comment for functions, subscripts, initializers, and enum cases with associated values.

Here’s a quick demo of signature help in VS Code.

![Signature help demo in VS Code|690x441](/assets/images/gsoc-25/output.gif)

### Challenges

#### Retrieving declarations for cached completion items

An interesting challenge we faced with full documentation comment retrieval in code completion was retrieving the comment for cached code completion items. We use the completion item's associated declaration to get the comment, but some completion items can be cached, and we can't cache their associated declarations.

To tackle this issue, we cache the declaration's Swift Unified Symbol Resolution (USR), which is a string that identifies a declaration, and then we use it to look up the declaration when we need to fetch its documentation comment.

The challenging part is that there are many types of declarations (e.g., functions, properties, classes). Some declarations are defined in Swift, others are imported from languages like Objective-C and C++, which are imported through Clang. There are also different types of declaration contexts (e.g., a declaration can be a top-level module item, a member of a struct, etc). And modules can be synthesized by the compiler, or they can be regular modules. We needed to account for all such cases when implementing the USR-to-declaration lookup.

#### Conflicting USRs for Clang-imported declarations

Another challenge we faced was an issue where a declaration imported through Clang (e.g., a declaration defined in Objective-C) and a compatibility type-alias for it had the same USR, which broke the assumption about a USR being unique to a specific declaration, making the USR-to-declaration lookup logic fail in some cases.

To fix this, we changed the mangling for compatibility type-aliases to use their Swift-exposed names, disambiguating the USR for the actual declaration vs. for a type-alias.

### Closing Thoughts

I'm incredibly grateful for this opportunity to contribute to the Swift project, and I really learned a lot from this experience. I'd like to thank my mentor, Hamish Knight, for his unwavering support and guidance throughout this summer. I’d also like to thank Alex Hoppen, Rintaro Ishizaki, and Ben Barham for their valuable feedback during code review.

---

If you'd like to learn more about this project, please [check out the full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-improve-the-display-of-documentation-during-code-completion-in-sourcekit-lsp/81976)!