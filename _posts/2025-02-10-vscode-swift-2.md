---
layout: new-layouts/post
published: true
date: 2025-02-10 16:00:00
title: Updating the Visual Studio Code extension for Swift
author: [adam-ward]
category: "Developer Tools"
---

Today, we are excited to announce a new version of the Swift extension for
Visual Studio Code -- now [published to the extension
marketplace](https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode)
as an official supported release of the Swift team. The aim of this extension is
to provide a high-quality, feature-complete extension that makes developing Swift
applications on all platforms a seamless experience.

![VS Code running with the Swift extension](/assets/images/vscode-extension-blog/vscode-swift-2.png)

As we continue to invest in Swift as a first-class language for cross-platform
development, both Apple and the broader developer community are rapidly
iterating on the VS Code extension to expand its capabilities for server and
cloud, embedded, and Linux and Windows app development. The original extension
was developed by members of the Swift Server Working Group, and with its broader
scope, they have graciously supported this transition to the [GitHub /swiftlang
organization](https://github.com/swiftlang) and the creation of a new publisher
for the extension.

For existing Swift developers using VS Code, the transition should be seamless:
the old release should automatically install the new extension and disable
itself, and moving forward all language features will be provided by the new
extension. You’re welcome to uninstall the original extension, which has been
renamed to reflect its deprecated status. 

Further details about the migration can be found on the [Swift
Forums](https://forums.swift.org/t/vs-code-swift-extension-migration/77795). If
you have any issues migrating, please [file an
issue](https://github.com/swiftlang/vscode-swift/issues) or comment on the forum
post.