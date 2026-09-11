---
layout: new-layouts/post
published: false
date: 2026-11-04 17:00:00
title: "GSoC 2026 Showcase: DocC Language Features in SourceKit-LSP"
author: [padmashree, samkhouri, ktoso]
category: "Community"
---

Another successful year of Swift participation in [Google Summer of Code](https://summerofcode.withgoogle.com) recently came to an end, and we'd like to shine some light on the projects and work accomplished!

Summer of Code is an annual program, organized by Google, which provides hands-on experience for newcomers contributing
to open source projects.

In this series of three blog posts, we'll highlight each of the Summer of Code contributors and their projects.
You can navigate between the posts using these convenient links:

- DocC language features in SourceKit-LSP (this post)
- [Task and TaskGroup tracking for Swift Concurrency](/blog/gsoc-2026-showcase-task-tracking/)
- [Qualified name lookup for swift-syntax](/blog/gsoc-2026-showcase-qualified-name-lookup/)

Each GSoC contributor has shared a writeup about their project and experience in the program on the forums. 
The first project we're featuring on the blog added DocC language features to SourceKit-LSP, contributed by Padmashree S S.
To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2026-docc-language-features-in-sourcekit-lsp/89281).

---

## DocC Language Features in SourceKit-LSP

Hello everyone,
I am Padmashree S S, I have been working on implementing the **DocC Language Features in SourceKit-LSP** as a part of GSoC along with my mentors Matthew and Prajwal.

## Project

This project extends **SourceKit-LSP** by adding **DocC Language Features** including:

1. **Go-to-definition** for symbol links in DocC comments, Tutorial and Markdown files.
2. **Diagnostics** for broken and invalid symbol links.
3. **Interactive documentation preview** allowing users to click symbol links in the DocC preview and navigate to their definition in the editor.
4. **Syntax highlighting** for DocC Markdown and Tutorial files.

## Impact

Now developers can use **IDE features for their documentation** as well, making it easier for them to write and maintain high-quality documentation. Previously, broken symbol links and typos in links could only be identified after the entire documentation was built, but with these features, such issues can be **identified and resolved during development itself**, making it easier for developers to write and maintain their documentation.

Making documentation easier to write and maintain can encourage developers to create **better documentation and tutorials** for their iOS products. This makes their products easier for others to understand and use, leading to **wider adoption** and, in turn, help improve the overall iOS development experience. Since these features are part of **SourceKit-LSP**, they are not limited to a single editor and can be used across editors such as **VS Code, Vim and others**.

## Implemented features

1. Add Go-to-Definition for Symbol links in DocC Comments, Markdown and Tutorial files

   Go-to-definition combines the Swift Parser, which locates the DocC comment block, with a Markdown parser that pinpoints the exact symbol link within it. The resolved link is then matched against candidates from IndexStore and the module's symbol graph to find the right declaration to jump to.

   ![](/assets/images/gsoc-26/docc-lsp-goto-definition-1.png)
   ![](/assets/images/gsoc-26/docc-lsp-goto-definition-2.png)

2. Emit Diagnostics for Broken/Invalid Symbol Links

   Symbol links are extracted from comments and validated against the index, and the diagnostics are surfaced through both the pull and push diagnostic models supported by the LSP.

   ![](/assets/images/gsoc-26/docc-lsp-diagnostics.png)

3. Make Symbol Links in Documentation Preview Clickable

   Existing SourceKit-LSP requests all resolved definitions based on cursor position in the editor, which doesn't work for a rendered documentation preview. To support clicking a link directly in the preview, I added a new custom request, `textDocument/doccSymbolLinkDefinition`, that resolves a symbol link independent of any cursor position.

   ![](/assets/images/gsoc-26/docc-lsp-clickable-1.png)
   ![](/assets/images/gsoc-26/docc-lsp-clickable-2.png)

4. Add Syntax highlighting for DocC Tutorial and Markdown files

   Highlighting covers DocC directives such as `@Step` and `@Tutorial`, `@Comment` blocks, and auto-closing of braces, quotes and backticks while typing.

   ![](/assets/images/gsoc-26/docc-lsp-syntax-highlighting-1.png)
   ![](/assets/images/gsoc-26/docc-lsp-syntax-highlighting-2.png)

## Challenges

A few things made this project trickier than it first looked. SourceKit-LSP needed a new `FallThroughToNextLanguageService` error so that the Swift and Documentation language services could cooperate on a single request instead of one swallowing it. The Swift Parser and the Markdown parser also disagreed on offsets, one uses UTF-16 and the other UTF-8, so reconciling positions between them took care. Early versions of go-to-definition generated a full module symbol graph on every request, which was far too slow, so I switched to resolving candidates directly from the index on a per-symbol basis instead. Finally, since diagnostics now come from two separate language services, I had to merge their output into a single, coherent diagnostics list for the client.

---

## Current Status

All four features are **working locally** and are currently being **upstreamed** across the SourceKit-LSP, vscode-swift and swift-tools-protocols repositories. The PRs are at different stages of review, with the next steps being to add the remaining test cases, address mentor feedback and get the changes merged upstream.

### Acknowledgements

I am really thankful to my mentors [@matthewbastien](https://forums.swift.org/u/matthewbastien) and [@snprajwal](https://forums.swift.org/u/snprajwal) for all their guidance and feedback throughout the project. I am also grateful to [@ahoppen](https://forums.swift.org/u/ahoppen) for the detailed code reviews and for providing valuable insights into SourceKit-LSP.

It has been amazing working on this project and being a part of the Swift community.
Thank you everyone for being so welcoming and making this such a wonderful experience! :)

---

Continue reading a more detailed version of Padmashree's writeup on the [Swift forums](https://forums.swift.org/t/gsoc-2026-docc-language-features-in-sourcekit-lsp/89281).
