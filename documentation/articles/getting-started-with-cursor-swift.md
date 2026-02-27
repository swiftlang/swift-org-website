---
layout: page
date: 2026-02-05 12:00:00
title: Setting up Cursor for Swift Development
author: [gbraden]
---

[Cursor](https://cursor.com/home) is a popular AI-native editor. It offers [coding agents](https://cursor.com/product) and [AI-powered autocomplete](https://cursor.com/product/tab). Cursor becomes [a bicycle for the developer's mind](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.youtube.com/watch%3Fv%3DNjIhmzU0Y8Y&ved=2ahUKEwiu48qq9tSSAxU3KFkFHZJyHdcQkPEHegQIGRAB&usg=AOvVaw1eoZQFor8WUGf_KT7O16EI) if it's given the right tools and context. 

Since Cursor is a fork of VS Code, [the Swift VS Code extension](https://www.swift.org/documentation/articles/getting-started-with-vscode-swift.html) works with Cursor. The extension includes: 

{% include_relative _shared-extension-features.md %}

## Install the Extension

{% include_relative _shared-install-extension.md editor_name="Cursor" editor_download_link="https://cursor.com/home" marketplace_name="Open VSX marketplace" marketplace_link="https://open-vsx.org/extension/swiftlang/swift-vscode" marketplace_extra_text="You can also install it from the Extensions pane in Cursor (⇧⌘X opens the pane; `Ctrl + Shift + X` if you're not on macOS)" installation_image="/assets/images/getting-started-with-cursor-swift/installation.png" walkthrough_image="/assets/images/getting-started-with-cursor-swift/swift-welcome.png" %}

## Create a New Swift Project

{% include_relative _shared-create-project.md %}

## Language Features

{% include_relative _shared-language-features.md editor_name="Cursor" code_actions_intro="⌘ + . opens the code actions menu. The menu changes depending on where your cursor is. In this example, since the cursor is on an incomplete switch, the code action adds the missing switch case:" code_actions_image="/assets/images/getting-started-with-cursor-swift/language/code-action.png" %}

## Swift Tasks

{% include_relative _shared-swift-tasks.md editor_name="Cursor" %}

## Debugging

{% include_relative _shared-debugging.md editor_name="Cursor" editor_intro="Cursor provides a rich debugging experience where the coding agent helps you to find the root cause of your bug. See the [debugging](https://cursor.com/for/debugging) documentation for more information." lldb_dap_link="https://open-vsx.org/extension/llvm-vs-code-extensions/lldb-dap" debugging_image="/assets/images/getting-started-with-cursor-swift/debugging/debugging.png" %}

## Testing

{% include_relative _shared-testing.md editor_name="Cursor" sidebar_position="right sidebar" run_tests_image="/assets/images/getting-started-with-cursor-swift/testing/run-tests.png" test_explorer_extra="Open the explorer by selecting the arrow in the top right corner:" test_explorer_image="/assets/images/getting-started-with-cursor-swift/testing/open-testing.gif" %}

## Give Context
The Cursor coding agent might not be aware of the nuances of the Swift language, so it's important to provide context. The best way to do this is to create a set of "skills" that conform to the [Agent Skills open format](https://agentskills.io/specification). From the [agentskills.io home page](https://agentskills.io/home):

> _Agent Skills are folders of instructions, scripts, and resources that agents can discover and use to do things more accurately and efficiently_. 

You can import Agent Skills into a project in Cursor, and the coding agent will reference the content to improve its code. 

### Install skills.sh
Use [skills.sh](https://skills.sh) to add the Agent Skill to Cursor. To install skills.sh:

1. [Install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
2. Use `nvm` to install node.js: `nvm install node`. `nvm` installs `npm` during the node installation.

### Install a Skill
Open the project you want to add a skill to in Cursor, then open the terminal (<code>Ctrl+\`</code>), and run 

```bash
npx skills add <skill-repo> --skill <name-of-skill>
```

For the [Swift Concurrency skill](https://github.com/AvdLee/Swift-Concurrency-Agent-Skill), the command would be:

```bash
npx skills add https://github.com/avdlee/swift-concurrency-agent-skill --skill swift-concurrency
```

Once the package installs, you will be prompted to choose an agent. Start typing `Cursor` to search for the Cursor coding agent.

![Search Cursor](/assets/images/getting-started-with-cursor-swift/context/search-cursor.png)

Press the space bar to select Cursor (the circle should turn green). 

![Select Cursor](/assets/images/getting-started-with-cursor-swift/context/select-cursor.png)

Select "Project" for the installation scope if you want Cursor to use the skill only for the project you are currently in. If you want the skill to be used for every project you open with Cursor, select "Global".

Select "Symlink" for the installation method. When you edit a skill, Symlink propagates that change to all agents using that skill.

Once the installation is finished, skills.sh will print the location of the skill, and confirm the skill was installed:

![Successful Install](/assets/images/getting-started-with-cursor-swift/context/successful-install.png)

The `.agent` and `.cursor` folders should appear in the root of your project's structure. 

### Confirm Skill Use
Now the skill has been added to the Cursor project that is currently open (assuming you selected the "Project installation scope"). The agent is presented with available skills and decides when they are relevant based on context. You don't have to tell the agent to use a skill.

To confirm whether your Cursor coding agent referenced your skill, check the log of the agent's thought:

![Agent Thought](/assets/images/getting-started-with-cursor-swift/context/agent-thought.png)

## Advanced Toolchain Selection

{% include_relative _shared-toolchain-selection.md editor_name="Cursor" %}

## Learn More and Contribute
Cursor's Swift extension is derived from [VS Code's Swift extension](https://code.visualstudio.com/docs/languages/swift). All the docs about the VS Code extension apply to Cursor.

{% include_relative _shared-learn-more.md %}
