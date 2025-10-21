---
layout: new-layouts/post
published: true
date: 2024-02-NN 10:00:00
title: 'Swift GSoC 2024 highlight: Swiftly (Swift installer) support in Visual Studio Code
author: [ktoso, priyambada]
category: "Community"
---

Another year of successful Swift participation in [Google Summer of Code](https://summerofcode.withgoogle.com) 2025 came to an end recently, and this year we'd like to shine some light on the projects and work acomplished during the summer!

Summer of Code is an annual program, organized by Google, which provides hands-on experience for newcomers contributing
to open source projects. Participants usually are students, but do not have to be.

In this series of four posts, we'll highlight each of the Summer of Code contributors and their projects.
You can navigate between the posts using these convenient links:

- Bringing Swiftly support to VS Code (this post)
- [JNI mode for swift-java’s source jextract tool](./2025-11-NN-swift-gsoc-2024-highlight-2-swift-java-jextract-jni-mode.md)
- [Improve the display of documentation during code completion in SourceKit-LSP](./2025-11-NN-swift-gsoc-2024-highlight-3-vscode-swift-lsp-documentation.md)
- [Improved Console Output for Swift Testing](./2025-11-NN-swift-gsoc-2024-highlight-4-swift-testing-output.md)

What follows, is a shortened writeup about their project and experience by the GSoC contributors. 
If you'd like to learn more, please check out the full version of their posts on the Swift forums (linked below)!

---

## Bringing Swiftly support to VS Code

Hi Swift community! 👋

I am Priyambada Roul. I'm incredibly excited to share what I've been working on over the past three months as part of Google Summer of Code 2025 with Swift.org, alongside my mentors, @cmcgee1024 @matthewbastien

My project focused on integrating **Swiftly** (Swift's toolchain manager) into the **VS Code Swift extension.**

## The Problem We Solved

We've made switching toolchains easier with Swiftly, allowing you to install and switch between Swift versions without leaving VS Code.

1. **Switch Swift versions** with a single click

2. **Install new toolchains** without leaving VS Code

3. **See real-time progress** during installations

4. **Automatically sync** with project-specific Swift versions

## What's New for Swift Developers

### Swiftly VS Code Integration

The VS Code extension now provides an entirely **seamless toolchain management experience**:

* We now support macOS too!

* See your current Swift version in the VS Code status bar.

* Click the version to switch between installed toolchains instantly.

* Install any Swift version directly from VS Code with real-time progress.

* Automatic detection of .swift-version files with prompts to switch

### Enhanced Swiftly CLI

* Swiftly now supports a machine-readable JSON output format.

* Swiftly now reports toolchain installation progress updates in **JSONL format**

* We have polished error reporting.

![](/assets/images/gsoc-25/swiftly-1.jpg)

![](/assets/images/gsoc-25/swiftly-2.jpg)

![](/assets/images/gsoc-25/swiftly-3.jpg)

### Things I learnt

* Making a VS Code extension. While I have experience with TypeScript from web development, the VS Code extension API and its development workflow are different from what I'm used to.

* I understood the structure and distribution of Swift toolchains, as well as how different versions can coexist on the same system using symlinks, environment variables, and PATH manipulation, across both macOS and Linux.

* The extension spawns Swiftly processes and reads their JSON output streams in real-time. This involved learning about IPC mechanisms, stdin/stdout buffering and process lifecycle management.

Want to see what we built? Check out the repositories:

* **VS Code Swift Extension**: [github.com/swiftlang/vscode-swift](https://github.com/swiftlang/vscode-swift)

* **Swiftly CLI**: [github.com/swiftlang/swiftly](https://github.com/swiftlang/swiftly)

I have linked all pull requests and technical details in my **[detailed project report](https://docs.google.com/document/d/1Mnb9ybmVkpL6pAgrpMbSg6EV3owA2rz_FgltvAXdnUE/edit?tab=t.0)**, which provides an in-depth look into the specific changes.

This GSoC experience has been transformative. I came in as someone intimidated by large codebases, and I'm leaving with the confidence to tackle complex, multi-tool integrations. I'm excited to continue contributing to Swift community!

Thank you.

---

If you'd like to learn more about this project, please [check out the full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-bringing-swiftly-support-to-vs-code/81886)!