---
layout: page
date: 2024-05-28 12:00:00
title: Configuring VS Code for Swift Development
author: [matthewbastien, plemarquand]
---

[Visual Studio Code](https://code.visualstudio.com/) (VS Code) is a popular general purpose editor that supports a
variety of languages through extensibility. The Swift extension brings Swift
language-specific features to the editor, providing a seamless experience for
developing Swift applications on all platforms.

The Swift extension includes:

{% include_relative _shared-extension-features.md %}

## Install the Extension

{% include_relative _shared-install-extension.md editor_name="Visual Studio Code" editor_download_link="https://code.visualstudio.com/Download" marketplace_name="VS Code Marketplace" marketplace_link="https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode" installation_image="/assets/images/getting-started-with-vscode-swift/installation.png" walkthrough_image="/assets/images/getting-started-with-vscode-swift/walkthrough.png" %}

## Creating a new Swift project

{% include_relative _shared-create-project.md %}

## Language Features

{% include_relative _shared-language-features.md editor_name="VS Code" code_actions_image="/assets/images/getting-started-with-vscode-swift/language-features/package_actions.png" %}

## Swift Tasks

{% include_relative _shared-swift-tasks.md editor_name="Visual Studio Code" %}

## Debugging

{% include_relative _shared-debugging.md editor_name="VS Code" lldb_dap_link="https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.lldb-dap" debugging_image="/assets/images/getting-started-with-vscode-swift/debugging/debugging.png" %}

## Test Explorer

{% include_relative _shared-testing.md editor_name="Visual Studio Code" sidebar_position="left sidebar" test_explorer_image="/assets/images/getting-started-with-vscode-swift/testing/inline_assertion_failures.png" %}

## Advanced Toolchain Selection

{% include_relative _shared-toolchain-selection.md editor_name="VS Code" reload_image="/assets/images/getting-started-with-vscode-swift/toolchain-selection/reload.png" %}

## Learn More and Contribute

{% include_relative _shared-learn-more.md %}
