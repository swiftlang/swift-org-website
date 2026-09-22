---
layout: new-layouts/post
published: true
date: 2025-11-12 17:05:00
title: "GSoC 2025 Showcase: Improved Code completion for Swift"
author: [ahmedelrefaey, ktoso]
category: "Community"
---

Our blog post series showcasing the Swift community’s participation in [Google Summer of Code](https://summerofcode.withgoogle.com) 2025 continues with our third update. Learn more about the projects and work accomplished:

- [Bringing Swiftly support to VS Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/)
- [Extending Swift-Java Interoperability](/blog/gsoc-2025-showcase-swift-java/)
- Improved code completion for Swift _(this post)_
- [Improved console output for Swift Testing](/blog/gsoc-2025-showcase-swift-testing-output/)

Each GSoC contributor has shared a writeup about their project and experience in the program on the forums. Today’s featured project improved how documentation is displayed during code completion in IDEs, contributed by Ahmed Elrefaey.

To learn more, you can read the [full post on the Swift Forums](https://forums.swift.org/t/gsoc-2025-improve-the-display-of-documentation-during-code-completion-in-sourcekit-lsp/81976)!

The project enhances SourceKit-LSP, an implementation of the Language Server Protocol (LSP) for Swift and C-based languages. Now you can see full documentation during code completion instead of just brief summaries, as well as what arguments are available to pass when calling functions.

Editors that support the Language Server Protocol all benefit from these improvements to SourceKit-LSP, bringing these features to editors like VS Code, Neovim, IntelliJ IDEA, Vim, and more.

This work has landed in the SourceKit-LSP project, and will be included in a future Swift toolchain release.

---

## Improve the display of documentation during code completion in SourceKit-LSP

Hi everyone!

This is Ahmed Elrefaey. I’m excited to share with you an update on my GSoC project which improved the display of documentation during code completion for Swift. I worked on improvements to [SourceKit-LSP](https://github.com/swiftlang/sourcekit-lsp), which is an implementation of the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) for Swift and C-based languages. My GSoC project was mentored by Hamish Knight.

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
We have also implemented a large portion of signature help support, showing the available overloads and their corresponding documentation while editing.
We reused the existing argument completion logic to determine the overloads and refactored the code completion item description implementation to reuse it in signature help.

Here’s a quick demo of signature help in VS Code.

![Signature help demo in VS Code.|690x441](/assets/images/gsoc-25/output.gif)
To try this out in VS Code for yourself, you can [download a main development snapshot from swift.org](https://swift.org/download). If using Swiftly you can run `swiftly install main-snapshot`. Then, in VS Code you can pick "Select Toolchain" from the Command Palette and select the newly downloaded toolchain.

### Closing Thoughts

I'm incredibly grateful for this opportunity to contribute to the Swift project, and I really learned a lot from this experience. I'd like to thank my mentor, Hamish Knight, for his unwavering support and guidance throughout this summer. I’d also like to thank Alex Hoppen, Rintaro Ishizaki, and Ben Barham for their valuable feedback during code review.
