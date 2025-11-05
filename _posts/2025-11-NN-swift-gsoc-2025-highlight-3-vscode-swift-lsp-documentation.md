---
layout: new-layouts/post
published: true
date: 2025-02-NN 10:00:00
title: 'Swift GSoC 2025 highlight: Improve the display of documentation during code completion in SourceKit-LSP
author: [ktoso, ahmedelrefaey, hamish]
category: "Community"
---

Another year of successful Swift participation in [Google Summer of Code](https://summerofcode.withgoogle.com) 2025 came to an end recently, and this year we'd like to shine some light on the projects and work accomplished during the summer!

Summer of Code is an annual program, organized by Google, which provides hands-on experience for newcomers contributing
to open source projects. Participants usually are students, but do not have to be.

In this series of four posts, we'll highlight each of the Summer of Code contributors and their projects.

- [Bringing Swiftly support to VS Code](2025-11-NN-swift-gsoc-2025-highlight-1-vscode-swiftly.md)
- [JNI mode for swift-java’s source jextract tool](2025-11-NN-swift-gsoc-2025-highlight-2-swift-java-jextract-jni-mode.md)
- Improve the display of documentation during code completion in SourceKit-LSP (this post)
- [Improved Console Output for Swift Testing](2025-11-NN-swift-gsoc-2025-highlight-4-swift-testing-output.md)

---

## Improve the display of documentation during code completion in SourceKit-LSP

Hi everyone!

This is Ahmed Elrefaey. I’m excited to share with you an update on my GSoC project, Improve the display of documentation during code completion in SourceKit-LSP, mentored by Hamish Knight.

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

![Signature help demo in VS Code|690x441](/assets/images/gsoc-25/output.gif)

### Closing Thoughts

I'm incredibly grateful for this opportunity to contribute to the Swift project, and I really learned a lot from this experience. I'd like to thank my mentor, Hamish Knight, for his unwavering support and guidance throughout this summer. I’d also like to thank Alex Hoppen, Rintaro Ishizaki, and Ben Barham for their valuable feedback during code review.

---

If you'd like to learn more about this project, please [check out the full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-improve-the-display-of-documentation-during-code-completion-in-sourcekit-lsp/81976)!