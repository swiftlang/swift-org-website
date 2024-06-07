---
layout: page
date: 2024-05-28 12:00:00
title: Getting started with Swift in VS Code
author: [matthewbastien]
---

Visual Studio Code (VS Code) is a powerful editing tool that provides a modern and
feature-rich development environment suitable for developers working with Swift
and other programming languages. It strikes a balance between usability,
flexibility, and performance. In addition, VS Code offers IDE features,
cross-platform support, and benefits from active community support.

Installing the Swift extension adds Swift language features to VS Code. Its aim is to
provide a first-class, feature complete extension to make developing Swift
applications on all platforms a seamless experience.

This guide will help you get set up with the following features:

- Language features such as code completion, jump to definition, find all
  references, etc.
- Package dependency view
- VS Code tasks for Swift Package Manager
- Debugging Swift code
- Running tests

<div class="warning" markdown="1">
The Swift extension for Visual Studio Code only supports Swift Package Manager
projects and will not work with projects based on .xcodeproj files.
</div>

## Installation

You must have Swift installed for the extension to function. See the
[Getting Started Guide on Swift.org](https://www.swift.org/getting-started/) for
details on how to install Swift on your system. You will also need to download
and install [Visual Studio Code](https://code.visualstudio.com/Download).

You can then install the Swift extension from the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang)
or from within the VS Code extensions view:

![Install the vscode-swift extension](/assets/images/getting-started-with-vscode-swift/installation.png)

## Creating a new Swift project

You can use the `Swift: Create New Project...` command provided by the Swift
extension to create a new Swift project. Simply open the Command Palette
(`CMD + Shift + P` on macOS and `Ctrl + Shift + P` on other platforms) and
search for the `Swift: Create New Project...` command which will guide you
through the process.

![Create New Project command showing available project templates](/assets/images/getting-started-with-vscode-swift/create-new-project/select-project-template.png)

1. Choose the type of project you'd like to create from the list of templates.
2. Choose the directory where the project will be stored.
3. Give your project a name.
4. Open the newly created project. You will be prompted to open the project in the
   current window, a new window, or add it to the current workspace. The default
   behaviour can be configured by using the `swift.openAfterCreateNewProject`
   setting.

## Language Features

<div class="warning" markdown="1">
You **must** run a build before Swift language features will be available.
</div>

The Swift extension uses [SourceKit LSP](https://github.com/apple/sourcekit-lsp)
to power language features.

![Package swift actions](/assets/images/getting-started-with-vscode-swift/language-features/package_actions.png)

## Swift Tasks

VS Code provides tasks as a way to run external tools. You can read more about
how tasks work in
[the VS Code Documentation](https://code.visualstudio.com/docs/editor/tasks).

The Swift extension provides some basic tasks that you can use to build via
Swift Package Manager. You can also configure custom tasks by creating a `tasks.json` file in the root folder of your project. For example, this `tasks.json` builds of your Swift targets in release mode:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "swift",
      "label": "Swift Build All - Release",
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

![Run build task menu](/assets/images/getting-started-with-vscode-swift/tasks/build-tasks.png)

## Debugging

Visual Studio Code provides a rich debugging experience that you can read about in
[the VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).
The Swift extension relies on the
[Code-LLDB extension](https://github.com/vadimcn/vscode-lldb) to enable
debugging support.

<div class="warning" markdown="1">
The Swift extension will prompt you to configure settings for LLDB the first
time you launch VS Code. You will need to either apply the configuration
globally (user settings) or to your workspace (workspace settings) for the
debugger to work properly.

![Configure the Debugger](/assets/images/getting-started-with-vscode-swift/debugging/configure-lldb.png)

</div>

By default, the extension creates a launch configuration for each executable
target in your Swift package. You may configure these yourself by adding a `launch.json` file to the root folder of your project. For example, this `launch.json` launches a Swift executable with custom arguments:

```json
{
  "configurations": [
    {
      "type": "lldb",
      "name": "Debug swift-executable",
      "request": "launch",
      "sourceLanguages": ["swift"],
      "args": ["--hello", "world"],
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/.build/debug/swift-executable",
      "preLaunchTask": "swift: Build Debug swift-executable"
    }
  ]
}
```

You can launch a debugging session via the Debug view in VS Code. Select the
launch configuration you wish to debug and then click on the green play button
to launch it. The executable will be launched and you can set breakpoints in
your Swift code that will be hit as code executes.

The screenshot below depicts an example of debugging a Hello World program. It
is paused on a breakpoint and you can see that the Debug View shows the values
of variables in scope. You can also hover over identifiers in the editor to see
their variable values:

![Debugging](/assets/images/getting-started-with-vscode-swift/debugging/debugging.png)

## Test Explorer

Visual Studio Code provides a Test Explorer view in the left sidebar which can be used to
navigate to, run, and debug tests. The Swift extension supports
[XCTest](https://developer.apple.com/documentation/xctest) as well as
[swift-testing](https://swiftpackageindex.com/apple/swift-testing/main/documentation/testing)
tests. As you write tests they are automatically added to the Test Explorer.

![Inline test errors](/assets/images/getting-started-with-vscode-swift/testing/inline_assertion_failures.png)

To debug a test, set a breakpoint and then run the test, suite, or entire test target with the `Debug Test` profile.

The `Run Test with Coverage` profile instruments the code under test and opens a
code coverage report when the test run completes. As you browse covered files line numbers
that were executed during a test appear green, and those that were missed appear red. Hovering
over a line number shows how many times covered lines were executed. Line execution counts can be shown or hidden using the `Test: Show Inline Coverage` command.


Swift-testing tests annotated with
[tags](https://swiftpackageindex.com/apple/swift-testing/main/documentation/testing/addingtags)
can be filtered in the Test Explorer using `@TestTarget:tagName`, and then this
filtered list of tests can be run, or debugged.

## Advanced Toolchain Selection

The Swift extension automatically detects your installed Swift toolchain.
However, it also provides a command called `Swift: Select Tooclhain...` which
can be used to select between toolchains if you have multiple installed.

<div class="warning" markdown="1">
This is an advanced feature used to configure VS Code with a toolchain other
than the default on your machine. It is recommended to use `xcode-select` on
macOS or `swiftly` on Linux to switch between toolchains globally.
</div>

You may be prompted to select where to configure this new path. Your options are to:

- Save it in User Settings
- Save it in Workspace Settings

Keep in mind that Workspace Settings take precedence over User Settings:

![Settings selection](/assets/images/getting-started-with-vscode-swift/toolchain-selection/configuration.png)

The Swift extension will then prompt you to reload the extension in order to
pick up the new toolchain. You must do so otherwise the extension will not
function correctly:

![Reload VS Code warning](/assets/images/getting-started-with-vscode-swift/toolchain-selection/reload.png)

## Contributors

The extension is developed by members of the Swift Community and maintained by
the [Swift Server Working Group](https://www.swift.org/sswg/).
