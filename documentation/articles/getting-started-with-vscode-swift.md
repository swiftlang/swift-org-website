---
layout: page
date: 2024-05-28 12:00:00
title: Getting started with Swift in VS Code
author: [matthewbastien]
---

<div class="warning" markdown="1">
The Swift extension for Visual Studio Code only supports Swift Package Manager
projects and will not work with xcodeproj files.
</div>

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

## Creating a new Swift project

You can use the `Swift: Create New Project...` command provided by the Swift
extension to create a new Swift project. Simply open the Command Palette
(`CMD + Shift + P` on macOS and `Ctrl + Shift + P` on other platforms) and
search for the `Swift: Create New Project...` command which will guide you
through the process. You will first be asked to select from a list of project
types:

![Create new project](/assets/images/getting-started-with-vscode-swift/create_new_swift_project.png)

Then you will have to select a directory where the project will be stored in and
give it a name:

![Name the new project](/assets/images/getting-started-with-vscode-swift/name_the_swift_project.png)

Finally, the extension will ask you if you want to open the project in the
current window, a new window, or add it to the current workspace. The default
behaviour can be configured by using the `swift.openAfterCreateNewProject`
setting:

![Open newly created project](/assets/images/getting-started-with-vscode-swift/open_newly_created_project.png)

## Language Features

<div class="warning" markdown="1">
You **must** run a build before Swift language features will be available.
</div>

The Swift extension uses [SourceKit LSP](https://github.com/apple/sourcekit-lsp)
to power language features.

![Package swift actions](/assets/images/getting-started-with-vscode-swift/package_swift_actions.png)

## Swift Tasks

VS Code provides tasks as a way to run external tools. You can read more about
how tasks work in
[the VS Code Documentation](https://code.visualstudio.com/docs/editor/tasks).

The Swift extension provides some basic tasks that you can use to build via
Swift Package Manager. You can also configure custom tasks to, for example,
build all of your Swift targets in release mode:

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

The above task is configured to be in the `build` group. This means it will
appear in the `run build tasks` menu that can be opened with `CMD + Shift + B`
on macOS or `Ctrl + Shift + B` on other platforms:

![Run build task menu](/assets/images/getting-started-with-vscode-swift/build_task_menu.png)

## Debugging

<div class="warning" markdown="1">
The Swift extension will prompt you to configure settings for LLDB the first
time you launch VS Code. You will need to either apply the configuration
globally (user settings) or to your workspace (workspace settings) for the
debugger to work properly.

![Configure the Debugger](/assets/images/getting-started-with-vscode-swift/debugger-configuration.png)

</div>

VS Code provides a rich debugging experience that you can read about in
[the VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).
The Swift extension relies on the
[Code-LLDB extension](https://github.com/vadimcn/vscode-lldb) to enable
debugging support.

By default, the extension will create a launch configuration for any binaries in
your Swift package that you can configure yourelf to add command line arguments,
environment variables, etc:

```json
{
  "configurations": [
    {
      "type": "lldb",
      "name": "Debug swift-executable",
      "request": "launch",
      "sourceLanguages": ["swift"],
      "args": [],
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/.build/debug/swift-executable",
      "preLaunchTask": "swift: Build Debug swift-executable"
    }
  ]
}
```

![Debugging](/assets/images/getting-started-with-vscode-swift/debugging.png)

## Test Explorer

VS Code provides a Test Explorer view in the left sidebar which can be used to
view, run, and debug tests. The extension supports [XCTest](https://developer.apple.com/documentation/xctest)
as well as [swift-testing](https://swiftpackageindex.com/apple/swift-testing/main/documentation/testing) tests. As you write tests
they are automatically added to the Test Explorer.

![Inline test errors](/assets/images/getting-started-with-vscode-swift/inline_assertion_failures.png)

Swift-testing tests annotated with [tags](https://swiftpackageindex.com/apple/swift-testing/main/documentation/testing/addingtags)
can be filtered in the Test Explorer using `@TestTarget:tagName`, and then this filtered list of tests can be run, or debugged.

![Filtering tests by custom tags](/assets/images/getting-started-with-vscode-swift/filtering_tests_by_custom_tags.png)

## Advanced Toolchain Selection

<div class="warning" markdown="1">
This is an advanced feature used to configure VS Code with a toolchain other
than the default on your machine. It is recommended to use `xcode-select` on
macOS or `swiftly` on Linux to switch between toolchains.
</div>

The Swift extension will automatically detect your installed Swift toolchain.
However, it also provides a command called `Swift: Select Tooclhain...` which
can be used to select between toolchains if you have multiple installed.

![Toolchain selection](/assets/images/getting-started-with-vscode-swift/toolchain_selection.png)

You may be prompted to select where to configure this new path. The options are
to save it in User Settings or Workspace Settings. Keep in mind that Workspace
Settings take precedence over User Settings:

![Settings selection](/assets/images/getting-started-with-vscode-swift/settings_selection.png)

The Swift extension will then prompt you to reload the extension in order to
pick up the new toolchain. You must do so otherwise the extension will not
function correctly:

![Swift path change warning](/assets/images/getting-started-with-vscode-swift/swift_path_change.png)
