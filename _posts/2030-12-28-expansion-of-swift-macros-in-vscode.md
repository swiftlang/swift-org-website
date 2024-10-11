---
layout: post
published: true
date: 2030-12-28 11:59:59
title: Expansion of Swift Macros in Visual Studio Code
author: [lokeshtr, ahoppen, adam-fowler]
---

`/* DUMMY DATE TO BE CHANGED BEFORE PR MERGE */` We're excited to announce that, with Swift 6.1, you can finally view the generated contents of a Swift Macro in Visual Studio Code and other LSP-based editors such as Neovim using the all-new "Expand Macro" Code Action.

I'm Lokesh T. R. from India. I'm a sophomore currently pursuing my bachelor's degree in Computer Science and Engineering at Vel Tech University in Chennai. I'm thrilled to share with you, my Google Summer of Code 2024 Project which I worked on with my mentors, Alex Hoppen and Adam Fowler.

## Overview

Over the summer, we worked on adding support for expansion of Swift Macros in Visual Studio Code. Our project's main goal is to implement a code action in VS Code that allows users to view the generated contents of a Swift Macro.

Here's what it looks like to show the generated contents of a Swift Macro in a peeked editor when the "Expand Macro" Code Action is invoked by the user:

![Expand Macro Code Action in VS Code](/assets/images/expansion-of-swift-macros-in-vscode-blog/expand-macro-code-action.jpeg)
![Macro Expansion in Peeked Editor](/assets/images/expansion-of-swift-macros-in-vscode-blog/macro-expansion-in-peeked-editor.jpeg)

There were also some stretch goals which include:

1. Bringing Semantic Functionality (such as jump-to-defintion, quick help on hover, Syntax Highlighting, etc.) to the macro expansion being previewed.
2. Allowing to perform the "Expand Macro" Code Action on a macro that is present in the generated macro expansion to support the expansion of nested macros.

![Quick Help on Hover - Semantic Functionality](/assets/images/expansion-of-swift-macros-in-vscode-blog/quick-help-on-hover-semantic-functionality.jpeg)
![Expand Macro Code Action for Nested Macros](/assets/images/expansion-of-swift-macros-in-vscode-blog/expand-macro-code-action-for-nested-macros.jpeg)
![Nested Macro Expansion](/assets/images/expansion-of-swift-macros-in-vscode-blog/nested-macro-expansion.jpeg)

And as a bonus, we also worked on supporting macro expansions in other LSP-based editors which by default cannot make use of the LSP extensions that we introduced.

![Expand Macro Code Action in other LSP-based editors (Neovim)](/assets/images/expansion-of-swift-macros-in-vscode-blog/expand-macro-code-action-in-other-lsp-based-editors-neovim.jpeg)
![Macro Expansion in other LSP-based editors (Neovim)](/assets/images/expansion-of-swift-macros-in-vscode-blog/macro-expansion-in-other-lsp-based-editors-neovim.jpeg)

### When can you start using this feature?

This will be available with SourceKit-LSP bundled with **Swift 6.1 and the corresponding VS Code Swift Extension Release**. For the curious minds, This feature is available in the `main` branch of `sourcekit-lsp` and `vscode-swift` repositories, right now.

## Implementation Details

### How Swift Language Features work in LSP-based editors

Let's have a look at three key components that you use in your everyday life in an LSP-based editor (e.g. VS Code):

1. VS Code-Swift Extension (Client):
   - primarily acts as a bridge between VS Code and SourceKit-LSP
2. SourceKit-LSP (Server):
   - provides the necessary editor features to VS Code
   - communicates using Language Server Protocol (LSP)
3. SourceKitD (Background Service):
   - provides the raw data and operations to SourceKit-LSP
   - shares implementation details with the Swift compiler

### Main Goal

In order to achieve the main goal, we introduced two new LSP extensions and new custom URL scheme as follows:

```typescript
// NEW LSP EXTENSIONS (SPECIFICATIONS)
// -----------------------------------

// workspace/peekDocuments (sourcekit-lsp -> vscode-swift)
export interface PeekDocumentsParams {
  uri: DocumentUri;
  position: Position;
  locations: DocumentUri[];
}

export interface PeekDocumentsResult {
  success: boolean;
}

// workspace/getReferenceDocument (vscode-swift -> sourcekit-lsp)
export interface GetReferenceDocumentParams {
  uri: DocumentUri;
}

export interface GetReferenceDocumentResult {
  content: string;
}

// NEW CUSTOM URL SCHEME (SPECIFICATIONS)
// --------------------------------------

// Reference Document URL
("sourcekit-lsp://<document-type>/<display-name>?<parameters>");

// Reference Document URL with Macro Expansion Document Type
("sourcekit-lsp://swift-macro-expansion/LaCb-LcCd.swift?fromLine=&fromColumn=&toLine=&toColumn=&bufferName=&parent=");
```

#### Working of the "Expand Macro" Code Action

1. The `"workspace/peekDocuments"` request is sent from SourceKit-LSP to the editor and prompts it to show the the contents of `locations` inside the source file `uri` as a peek window at `position`. In VS Code, this executes the `"editor.action.peekLocations"` command to present a peeked editor.
2. Since the contents of the macro expansion are not represented by a file on disk, we introduce a custom `sourcekit-lsp://` URL scheme to represent the macro expansion buffers. In the future, this URL scheme can be represented for other use cases such as generated interfaces by using a `document-type` other than `swift-macro-expansion`.  
macro expansion contents.
3. To fetch the contents of this custom URL scheme, the editor client sends a `"workspace/getReferenceDocument"` to SourceKit-LSP.

![Working of the Expand Macro Code Action](/assets/images/expansion-of-swift-macros-in-vscode-blog/working-of-getreferencedocumentrequest.jpeg)

### Stretch Goals

#### Achieving Semantic Functionality (jump-to-definition, quick help on hover, syntax highlighting, etc.)

   By default, SourceKit-LSP and SourceKitD are not equipped to handle our newly introduced Reference Document URLs. To enable semantic functionality, such as jump-to-definition, quick help on hover, and syntax highlighting, the build arguments of the file are required. To address this, we utilised the source file's build arguments and applied them to the reference documents. This effectively tricks sourcekitd into providing semantic functionality for these reference documents.

#### Achieving Nested Macro Expansion

   The flexible nature of Reference Document URLs simplifies the process of nested macro expansions. A key advantage of these URLs is their ability to allow nesting. To achieve nested macro expansion, we set the `parent` parameter of the macro expansion reference document URL to the source file if it represents a first-level macro expansion. For subsequent expansions, whether at the second, third, or n-th level, the `parent` parameter points to the reference document from which the macro expansion originates. This mechanism enables the efficient expansion of nested macros.

### Bonus

While the new LSP extensions which we introduced, don't work out-of-the-box in other LSP-based editors and requires the extension / plugin developers of respective editors to make use of it, we worked on providing a basic form of first level macro expansion support using the standard LSP Requests to support other LSP-based editors.

This works as follows:

1. SourceKit-LSP asks sourcekitd for macro expansions.
2. It then stitches all the macro expansions together in a single file.
3. It stores the file in some temporary location in the disk.
4. It then makes a `ShowDocumentRequest` to open and show the file in the editor.

## Conclusion

That wraps up our Google Summer of Code project successfully! 🎉

### Future Directions

#### 1. Feedback, Feedback, Feedback

   We put a great deal of attention to detail, ensuring that every decision in the design process was thoughtful and deliberate. However, we understand that you might have better ideas or come across issues we haven't anticipated, and we're always eager to improve this feature. If you have suggestions or encounter any bugs, we encourage you to file an issue in either the sourcekit-lsp or vscode-swift repository, depending on where you face the problem.

#### 2. Implementing Semantic Functionality and Nested Macro Expansions for all LSP-based editors

   With LSP 3.18 nearing finalization, there should be focus on unifying how macro expansions and reference documents are handled across LSP-based editors to enable semantic functionality and nested macro expansions.

   One of the key steps in this process is migrating from the custom `"workspace/getReferenceDocument"` request to the upcoming standardized `"workspace/textDocumentContent"` request. This will simplify the integration, removing the need for extension / plugin developers to handle custom requests and aligning with LSP specifications. Additionally, once LSP 3.18 is implemented, we can eliminate the reliance on temporary file storage by replacing it with the generated on-the-fly Reference Document URLs.

   A significant challenge will involve handling positional shifts in line and character numbers caused by macro expansions. When macros expand, they often change the layout of the file, causing subsequent macros to shift from their original positions. Implementing semantic functionality and nested macro expansions in macro expansion documents for all LSP-based editors should account for these shifts, ensuring that editors can accurately track and display the correct positions of expanded macros. This adjustment is crucial to providing smooth, error-free navigation and proper context across all LSP-based editors.

#### 3. Other Use Cases for the Reference Document URL

   Reference Document URLs were built from the ground up to encode the data necessary to display any form of content. This functionality allows anyone to present any content of their choice, whether in a peeked editor or a fully open document, as long as it is generated during compile time. One such example we discussed today is the `swift-macro-expansion` document type.

   Also, For instance, we can migrate `OpenInterfaceRequest` to Reference Document URLs to display the generated `.swiftinterface` files of modules. Additionally, we can show implicitly generated constructors and synthesized code related to `Equatable`, `Hashable`, and `Codable` conformances. Another use case involves previewing or rendering generated HTML from the Mustache template engine by integrating its CLI.

   These are just a few examples. The ability to present various document formats based on different code generation behaviors opens up a wide range of possibilities, encouraging you to bring your own ideas to life. With LSP 3.18, this functionality will be standardized across all editors, not just VS Code.

### Thanks & Gratitude

I offer my deepest gratitude to my mentors, Alex Hoppen (@ahoppen) and Adam Fowler (@adam-fowler) without whom this journey is impossible. Google Summer of Code is not only the work of myself as a contributor but also the work of my mentors in guiding me and helping me out whenever possible.

Thanks to you both for accepting my project proposal, spending hours setting up my environment, getting me started with PRs, your wonderful ideas and feedback on my ideas, attending the weekly meetings, allowing me to be flexible, detailed PR reviews, giving me directions and all the immediate and quick responses. I hope I gave you both a wonderful GSoC experience.

If not for you two people, this project wouldn't be a success. 💖

#### Special Thanks ❤️

- Thanks to Fredrik Wieczerkowski (@fwcd) for his initial proof-of-concept on Expansion of Swift Macros in Visual Studio Code and also for his Pull Request that migrates `workspace/getReferenceDocument` to the upcoming `workspace/textDocumentContent`.
- Thanks to Paul LeMarquand (@plemarquand) for testing out my project in its very early stages.
- Thanks to Douglas Gregor (@douglas_gregor) and Rintaro Ishizaki (@rintaro) for coming up with their own use cases with the generic LSP Requests that also laid the foundation for macro expansions.
- Thanks to Mateusz Bąk (@Matejkob) and Paris Pittman (@parispittman) for fueling me with positivity to present my project wherever possible.
- Thanks to the entire Swift Community for always being so welcoming and supportive.
