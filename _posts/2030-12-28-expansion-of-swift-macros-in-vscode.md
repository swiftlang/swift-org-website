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

This will be available with SourceKit-LSP bundled with Swift 6.1 and the corresponding VS Code Swift Extension Release.

For the curious minds, This feature is available in the `main` branch of `sourcekit-lsp` and `vscode-swift` repositories, right now.

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
   - baked into the swift compiler

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

- `"workspace/peekDocuments"` allows the SourceKit-LSP Server to show the the contents stored in the `locations` inside the source file `uri` as a peek window
- Reference Document URL Scheme `sourcekit-lsp://` so that we can use it to encode the necessary data required to generate any form of content to which the URL corresponds to.
- We introduce the very first `document-type` of the Reference Document URL which is `swift-macro expansion`. This will encode all the necessary data required to generate the macro expansion contents.
- `"workspace/getReferenceDocument"` is introduced so that the Editor Client can make a request to the SourceKit-LSP Server with the Reference Document URL to fetch its contents.

The way this works is that, we generate the Reference Document URLs from the macro expansions generated using sourcekitd and make a `"workspace/peekDocuments"` request to the Editor Client. In VS Code, this executes the `"editor.action.peekLocations"` command to present a peeked editor.

![Working of PeekDocumentsRequest](/assets/images/expansion-of-swift-macros-in-vscode-blog/working-of-peekdocumentsrequest.jpeg)

Since VS Code can't resolve the contents of Reference Document URL, it makes a `"workspace/getReferenceDocument"` request to the SourceKit-LSP Server, thereby retrieveing the contents and successfully displaying it in the peeked editor.

![Working of GetReferenceDocumentRequest](/assets/images/expansion-of-swift-macros-in-vscode-blog/working-of-getreferencedocumentrequest.jpeg)

### Stretch Goals

1. Achieving Semantic Functionality (jump-to-definition, quick help on hover, syntax highlighting, etc.):
   - SourceKit-LSP and SourceKitD by default doesn't know how to handle Reference Document URLs.
   - The build arguments of a file is needed to provide semantic functionality.
   - We used the source file's build arguments as build arguments of the reference documents to trick sourcekitd to provide Semantic Functionality for the reference documents.
2. Achieving Nested Macro Expansion:
   - Due to the flexible nature of the Reference Document URLs, nested macro expansions becomes trivial.
   - The beauty of the Reference Document URLs is that we can nest the Reference Document URLs.
   - We set the `parent` parameter of the macro expansion reference document URL to the source file if it's a first level macro expansion or to the reference document from which the macro expansion originates if it was second or third or n-th level macro expansion. This allows us to expand nested macros efficiently.

### Bonus

While the new LSP Extensions which we introduced, doesn't work out-of-the-box in other LSP-based editors and requires the extension / plugin developers of respective editors to make use of it, We worked on providing a basic form of first level macro expansion support using the standard LSP Requests to support other LSP-based editors.

This works as follows:

1. SourceKitLSP asks SourceKitD for macro expansions.
2. It then stitches all the macro expansions together in a single file.
3. It stores the file in some temporary location in the disk.
4. It then makes a `ShowDocumentRequest` to open and show the file in the editor.

That wraps up the GSoC project successfully!

### What's left to do?

- I will be working on implementing a test case that encompasses all the semantic features in all nested macro levels in sourcekit-lsp.
- I will also implement some end-to-end test cases in the vscode-swift side which ensures that they really work as intended in a real world situation.

Test cases for freestanding macros, attached macros and nested macros are already in place.
Code Documentation is also in place for everything that we have implemented so far.

### Future Directions

1. Feedback, Feedback, Feedback!

   - We had put so much attention to detail and ensured that every decision made in the design process was thoughtful.
   - But, you may have a better idea, or you may find some issues, and we would love to improve this feature.
   - Please file an issue to suggest an idea or report bugs in the sourcekit-lsp or vscode-swift repository wherever you face the issue.

2. Migrating the non-standard `"workspace/getReferenceDocument"` to the new standard `"workspace/textDocumentContent"` Request

   - We should be able to perform this migration when the specifications of LSP 3.18 gets finalised.
   - With this, the custom request need not be handled by the extension / plugin developer of an LSP-based editor.

3. Migrate from generating temporary files in the Disk to Reference Document URLs for other LSP-based editors

   - We are currently unable to generate macro expansions on-the-fly in other LSP-based editors since we don't have our LSP Extension for getting the contents of the reference document.
   - Building on top of the previous idea, when LSP 3.18 gets finalised, we should be able to completely eliminate temporary file storage in favour of the standard `"workspace/textDocumentContent"` Request.

4. Adding Semantic Functionality & Nested Macro Expansion support for other LSP-based editors

   - This is tricky to implement since the temporary file (or reference document after LSP 3.18) will have all the macro expansions of a given macro in a single file.
   - Although the same approach can be used such as passing the source file's build arguments and `parent` to be the macro's originating file, there will be line and character position shifts that should be taken into consideration.
   - For example, the third macro expansion of a given attached macro will be expected to start at `0:0` but its actual location will be shifted by the first and second macro expansion's content length and three lines of comments that describes where the macro will be present in the original file

5. Other Use Cases for the Reference Document URL

   - Reference Document URLs where built from the ground up to allow for encoding the data required to show any form of content, one such example which we discussed today is `swift-macro-expansion` document type.
   - This should allow anyone to show any content of their choice, in a peeked editor or a fully open document, as long as its generated during compile time.
   - The following use cases are not related to macro expansions but uses the Reference Document URL that we created to show other document types:
     - Migrating `OpenInterfaceRequest` to Reference Document URLs to show Swift Generated Interfaces
     - Showing Implicitly generated constructors and Synthesized code upon `Equatable`, `Hashable` and `Codable` Conformances.
     - Showing a preview of generated HTML or rendering the generated HTML from the Mustache template engine by hooking up its CLI.
   - These are just few examples, and the fact that you can show various document formats based on various code generation behaviours brings a wide range of possibilities, and hence, you can bring your own idea.
   - And with LSP 3.18, this will be standardised across all editors, not just VS Code.

## Thanks & Gratitude

I offer my deepest gratitude to my mentors, Alex Hoppen (@ahoppen) and Adam Fowler (@adam-fowler) without whom this journey is impossible. Google Summer of Code is not only the work of myself as a contributor but also the work of my mentors in guiding me and helping me out whenever possible.

Thanks to you both for accepting my project proposal, spending hours setting up my environment, getting me started with PRs, your wonderful ideas and feedback on my ideas, attending the weekly meetings, allowing me to be flexible, detailed PR reviews, giving me directions and all the immediate and quick responses. I hope I gave you both a wonderful GSoC experience.

If not for you two people, this project wouldn't be a success.

### Special Thanks

- Thanks to Fredrik Wieczerkowski (@fwcd) for his initial proof-of-concept on Expansion of Swift Macros in Visual Studio Code and also for his Pull Request that migrates `workspace/getReferenceDocument` to the upcoming `workspace/textDocumentContent`.
- Thanks to Paul LeMarquand (@plemarquand) for testing out my project in its very early stages.
- Thanks to Douglas Gregor (@douglas_gregor) and Rintaro Ishizaki (@rintaro) for coming up with their own use cases with the generic LSP Requests that also laid the foundation for macro expansions.
- Thanks to Mateusz Bąk (@Matejkob) and Paris Pittman (@parispittman) for fueling me with positivity to present my project wherever possible.
- Thanks to the entire Swift Community always being so welcoming and supportive.
