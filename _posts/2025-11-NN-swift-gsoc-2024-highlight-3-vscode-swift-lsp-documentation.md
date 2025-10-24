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

1. Showing the full documentation for a code completion item instead of the first paragraph only which we call “brief documentation”.

2. Implementing Language Server Protocol’s [signature help](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_signatureHelp) request showing the user which overloads are available along with their corresponding documentation.

### Progress**

During this summer, we have made great progress on this project that I want to share with you.

We have successfully implemented full documentation comment retrieval for completion items. We went with a lazy approach that retrieves the full documentation comment upon request to avoid having to compute all comments and cache them at once which will require a lot of time and memory. This involved making Swift declarations round-trippable to be able to restore them for cached completion items and retrieve the documentation comment.

Here’s what SourceKit-LSP currently provides in VS Code (brief documentation):

![Brief documentation demo in VS Code.|690x412](/assets/images/gsoc-25/brief.gif)

And here’s how it looks with full documentation:

![Full documentation demo in VS Code.|690x412](/assets/images/gsoc-25/full.gif)

We have also implemented a large portion of signature help support by retrieving the available overloads similar to the existing argument completion logic and refactoring the logic for creating the code completion string to be reusable in signature help. The current implementation returns a list of viable overloads along with their full documentation comment for functions, subscripts, initializers, and enum cases with associated values.

Here’s a quick demo of signature help in VS Code.

![Signature help demo in VS Code|690x441](/assets/images/gsoc-25/output.gif)

### Challenges

One of the interesting challenges we faced was reconstructing a declaration from its USR in order to retrieve full documentation comments for cached completion items. The challenging part is that there are many types of declarations (e.g. functions, properties, classes, etc), the most important distinction is Swift declarations vs. Clang-imported declarations. There are also different types of declaration contexts (e.g. a declaration might be declared as a top-level module item, or as a member of a nominal type declaration like a struct). And modules can be synthesized by the compiler or they can be regular modules. We needed to account for all such cases when implementing USR to declaration reconstruction.

Another interesting challenge we faced was an issue where a Clang-imported declaration and a compatibility type-alias for it produce the same USR. This breaks the assumption that a USR is unique to a certain declaration and would result in declaration reconstruction tests failing due to non-matching declarations (e.g. the original was for the actual declaration but the one returned was for a type-alias). We fixed this issue by changing the mangling for compatibility type-aliases to be mangled as a ClangImporter-synthesized declaration with the USR containing the its Swift-exposed name disambiguating the USR for the actual declaration vs. for a type-alias.

### Closing Thoughts

I'm incredibly grateful for this opportunity to contribute to the Swift project and I really learned a lot from this experience. I'd like to thank my mentor @hamishknight for his unwavering support and guidance throughout this summer. I’d also like to thank @ahoppen, @rintaro, and @bnbarham for their valuable feedback during code review.

---

If you'd like to learn more about this project, please [check out the full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-improve-the-display-of-documentation-during-code-completion-in-sourcekit-lsp/81976)!