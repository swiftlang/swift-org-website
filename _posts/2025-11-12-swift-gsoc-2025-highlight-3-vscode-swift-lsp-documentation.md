---
layout: new-layouts/post
published: true
date: 2025-11-12 10:00:00
title: "Swift GSoC 2025 highlight: Improved code completion for Swift"
author: [ahmedelrefaey, hamish, ktoso]
category: "Developer Tools"
---

Another successful year of Swift participation in [Google Summer of Code](https://summerofcode.withgoogle.com) recently came to an end, and we'd like to shine some light on the projects and work accomplished!

Summer of Code is an annual program, organized by Google, which provides hands-on experience for newcomers contributing
to open source projects.

In this series of four blog posts, we'll highlight each of the Summer of Code contributors and their projects.
You can navigate between the posts using these convenient links:


- [Bringing Swiftly support to VS Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/)
- [Extending Swift-Java Interoperability](/blog/gsoc-2025-showcase-swift-java/)
- Improved code completion for Swift _(this post)_
- Improved console output for Swift Testing _(coming soon)_

Each GSoC contributor has shared a writeup about their project and experience in the program on the forums. The first project we're featuring on the blog brought Swiftly support to Visual Studio Code, contributed by Priyambada Roul.
To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-bringing-swiftly-support-to-vs-code/81886).

Summer of Code is an annual program, organized by Google, which provides hands-on experience for newcomers contributing
to open source projects. Participants usually are students, but do not have to be.

The third project we're featuring on the Swift blog improved how documentation is displayed by SourceKit-LSP and IDEs which make use of it, such as VS Code, contributed by Ahmed Elrefaey. To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-improve-the-display-of-documentation-during-code-completion-in-sourcekit-lsp/81976)!


---

## Improve the display of documentation during code completion in SourceKit-LSP

Hi everyone!

This is Ahmed Elrefaey. I’m excited to share with you an update on my GSoC project, Improve the display of documentation during code completion in SourceKit-LSP, mentored by Hamish Knight.

### Project Goals

The aim of this project is to enhance how documentation is displayed in SourceKit-LSP during code completion by:

1. Showing the full documentation for a code completion item instead of the first paragraph only, which we call “brief documentation”.
2. Implementing Language Server Protocol’s [signature help](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_signatureHelp) request showing the user which overloads are available, along with their corresponding documentation.

Editors that support the Language Server Protocol all benefit from these improvements to SourceKit-LSP, bringing these features to editors like VS Code, Neovim, IntelliJ IDEA, Vim, and more.
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
