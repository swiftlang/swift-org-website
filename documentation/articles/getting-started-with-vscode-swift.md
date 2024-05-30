---
layout: page
date: 2024-05-28 12:00:00
title: Getting started with Swift in VS Code
author: [matthewbastien]
---

Visual Studio Code is a powerful editing tool that provides a modern and
feature-rich development environment suitable for developers working with Swift
and other programming languages. It strikes a balance between usability,
flexibility, and performance. In addition, VS Code offers IDE features,
cross-platform support, and benefits from an active community and support.

Installing the Swift extension adds Swift language features to VS Code. This
guide will help you get set up with the following features:

- Language features such as code completion, jump to definition, find all
  references, etc.
- Package dependency view
- VS Code tasks for Swift Package Manager
- Debugging Swift code
- Test Explorer view

The extension is developed by members of the Swift Community and maintained by
the [Swift Server Working Group](https://www.swift.org/sswg/). Its aim is to
provide a first-class, feature complete extension to make developing Swift
applications on all platforms a seamless experience.

## Installation

You must have Swift installed for the extension to function. Please see the
[Getting Started Guide on Swift.org](https://www.swift.org/getting-started/) for
details on how to install Swift on your system. You will also need to download
and install [Visual Studio Code](https://code.visualstudio.com/Download).

You can then install the Swift extension from the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang)
or from within the VS Code extensions view:

![Install the vscode-swift extension](/assets/images/getting-started-with-vscode-swift/vscode-swift.png)

## Language Features

<div class="warning" markdown="1">
You **must** run a build before Swift language features will be available.
</div>

The Swift extension uses [SourceKit LSP](https://github.com/apple/sourcekit-lsp)
as the underlying Language Server to power language features.

## Swift Tasks

VS Code provides tasks as a way to run external tools. You can read more about
how tasks work in
[the VS Code Documentation](https://code.visualstudio.com/docs/editor/tasks).

The Swift extension provides some basic tasks that you can use to build via
Swift Package Manager. You can also configure custom tasks to, for example,
change to building in release mode:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "swift",
      "label": "Swift Build All (Release)",
      "detail": "swift build --build-tests",
      "args": ["build", "--build-tests", "-c", "release"],
      "env": {},
      "cwd": "${workspaceFolder}",
      "problemMatcher": ["$swiftc"],
      "group": "build"
    }
  ]
}
```

## Debugging

<div class="warning" markdown="1">
The Swift extension will prompt you to configure settings for LLDB the first
time you launch VS Code. You will need to either apply the configuration
globally (user settings) or to your workspace (workspace settings) for the
debugger to work properly.
</div>

![Configure the Debugger](/assets/images/getting-started-with-vscode-swift/debugger-configuration.png)

VS Code provides a very rich debugging experience that you can read about in
[the VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).
The Swift extension relies on the
[Code-LLDB extension](https://github.com/vadimcn/vscode-lldb) to enable
debugging.

By default, the extension will create a launch configuration for any binaries in
your Swift package that you can configure yourelf to add command line arguments,
environment variables, etc:

```json
{
  "configurations": [
    {
      "type": "lldb",
      "name": "Debug swift-executable-1",
      "request": "launch",
      "sourceLanguages": ["swift"],
      "args": [],
      "cwd": "${workspaceFolder:swift-executable-1}",
      "program": "${workspaceFolder}/.build/debug/swift-executable",
      "preLaunchTask": "swift: Build Debug swift-executable"
    }
  ]
}
```

## Test Explorer

![Inline test errors](/assets/images/getting-started-with-vscode-swift/inline_assertion_failures.png)

![Filtering tests by custom tags](/assets/images/getting-started-with-vscode-swift/filtering_tests_by_custom_tags.png)
