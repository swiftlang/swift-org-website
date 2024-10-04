---
redirect_from: "server/guides/setup-and-ide-alternatives"
layout: new-layouts/base
title: Installing Swift and using with IDEs
---

## Installing Swift

The [supported platforms](/platform-support/) for running Swift on the server and the [ready-built tools packages](/download/) are all hosted here on swift.org together with installation instructions. There's also the [language reference documentation](/documentation/) section for viewing more information about Swift.

## IDEs/Editors with Swift Support

A number of editors you may already be familiar with have support for writing Swift code. Here we provide a non-exhaustive list of such editors and relevant plugins/extensions, sorted alphabetically.

* [Atom IDE support](https://atom.io/packages/ide-swift)
    * [Atomic Blonde](https://atom.io/packages/atomic-blonde) a SourceKit based syntax highlighter for Atom.

* [Emacs plugin](https://github.com/swift-emacs/swift-mode)

* [VIM plugin](https://github.com/keith/swift.vim)

* [Visual Studio Code](https://code.visualstudio.com)
    * [Swift for Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang)

* [Xcode](https://developer.apple.com/xcode/ide/)

## Language Server Protocol (LSP) Support

The [SourceKit-LSP project](https://github.com/swiftlang/sourcekit-lsp) provides a Swift implementation of the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), which provides features such as code completion and jump-to-definition in supported editors.

The project has both an [extensive list of editors that support it](https://github.com/swiftlang/sourcekit-lsp/tree/main/Editors) and setup instructions for those editors, including many of those listed above.

_Do you know about another IDE or IDE plugin that is missing? Please submit a PR to add them here!_
