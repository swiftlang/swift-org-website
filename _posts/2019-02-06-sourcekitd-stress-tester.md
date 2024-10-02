---
layout: new-layouts/blog
date: 2019-02-06 12:00:00
title: Introducing the sourcekitd Stress Tester
author: nathawes
---

Sourcekitd provides the data backing key editor features like code completion, semantic highlighting, and refactoring for Swift files in both Xcode and the recently announced [SourceKit-LSP](https://forums.swift.org/t/introducing-sourcekit-lsp/17964). To help improve its robustness, we're introducing a new tool, the sourcekitd stress tester, that over the past few months has helped find 91 reproducible sourcekitd crashes, assertion failures, and hangs. This post covers the stress tester's implementation, its deployment in Swift's CI and PR testing, and how Swift developers can run it over their own projects to help improve the Swift editing experience for everyone.

### Some background on sourcekitd

Sourcekitd is designed to work as a service and uses a request-response model to communicate with Xcode and other clients about a set of Swift source files. Before diving into how sourcekitd is being stress tested, it's helpful to understand the types of requests sourcekitd supports, the information they return, and what client features typically rely on that information. This is summarized for the subset of requests currently exercised by the stress tester in the table below:

| Request type | Behavior and response | Editor features |
|:-------------|:----------------------|:--------------------------|
| EditorOpen   | Opens a Swift document with either the content provided, or the content of a file at a given path. Returns syntactic highlighting and structure information. | Syntax highlighting, code folding |
| EditorReplaceText | Replaces a range of text in an open document with a given (possibly empty) string. Returns the updated syntactic highlighting and structure information | Syntax highlighting, code folding |
| EditorClose | Closes an open document, freeing associated resources | |
| CursorInfo | Returns information about a symbol occurrence at a given source position in an open document, including its type, associated documentation and applicable refactoring kinds, when compiled with the provided compiler arguments | Jump to definition, quick help, refactoring |
| CodeComplete | Returns code completion results for a given source position in an open document when compiled with the provided compiler arguments | Code completion |
| RangeInfo | Returns the applicable refactoring kinds for a given source range in an open document when compiled with the provided compiler arguments | Refactoring |
| SemanticRefactoring | Returns the edits to perform for a provided refactoring kind applied at a given source position in an open document when compiled with the provided compiler arguments | Refactoring |

Within this set there are two main classes of requests: syntactic and semantic.

*Syntactic requests* include EditorOpen, EditorReplaceText and EditorClose. These are used to keep the state of a set of Swift documents the client cares about in sync with sourcekitd. Clients send them to update sourcekitd with the textual content of these documents as they are opened and edited, and in response, sourcekitd supplies up-to-date syntactic range and structure information that is typically used to implement syntax highlighting, code folding, and other syntax-aware features.

*Semantic requests* include the remainder of the requests listed in the table above. These provide information about a particular source range (RangeInfo) or position (CursorInfo, CodeComplete, SemanticRefactoring) in one of the open documents, and require a semantic understanding of the document and its related files and modules. This is why they all take compiler arguments as input. These requests back a range of editor features including jump-to-definition, code completion, quick help and refactoring.

### Stress testing sourcekitd

To help find crashes, assertion failures, hangs and other failures in sourcekitd, the latest [swift.org](/download/#snapshots) trunk development snapshot for macOS now includes the sourcekitd stress tester. If you look in the usr/bin directory, though, you'll see there are actually two new executables:

- *sk-stress-test*: the stress tester itself, and
- *sk-swiftc-wrapper*: a helper utility that makes it easier to run the stress tester over all the files in an entire Swift project.

This section describes how these two utilities work to help find and report issues in sourcekitd. Note: while these executables are only available in the macOS toolchain at present, there are no fundamental blockers to Linux support. It just hasn't happened yet.

#### The sourcekitd stress tester: sk-stress-test


`$ sk-stress-test <options> <source-file> swiftc <compiler-arguments>`


The stress tester takes a single Swift source file as input, along with the compiler arguments used to compile it. Based on these, it generates a sequence of sourcekitd requests to open, modify, query, and close a single Swift document. Each of these requests is sent synchronously, one after the other, failing on the first that causes sourcekitd to crash, hang, or give back a response that fails basic checks, and succeeding otherwise. When an issue is found, it outputs the necessary details to reproduce the problem, including the triggering request and the state of the open document before it was sent, as earlier EditorReplaceText requests may have modified it.

Since the goal of the stress tester is to find a request that triggers a sourcekitd failure, the most interesting part of its implementation is how it decides on the sequence of requests to send. At present it generates requests based purely on the syntactic information of the provided source file according to one of four supported strategies. Which one is used is controlled by the  `--rewrite-mode` option. A common trait of these initial strategies is that they're all based around rewriting the input Swift source file in various ways or using it as-is. This has the nice effect that the issues they find happen in source code that still looks like something a Swift programmer would write and so, ostensibly, would be more likely to run into in practice. That said, we'd love to see more approaches added in future, so if it's an area that interests you, please take a look at the [project readme](https://github.com/swiftlang/swift-stress-tester/blob/master/SourceKitStressTester/README.md) for instructions on contributing.

The currently supported strategies are:

1. **Default (`--rewrite-mode=none`)**

    In this mode an EditorOpen request is sent to open a Swift document with the input file's content. No EditorReplaceText requests are made, so all subsequent requests happen against the file in its original state. CursorInfo requests are made at the start of every identifier in the file, and for each request that succeeds, a SemanticRefactoring request is made at the same location for each refactoring kind (local rename, convert to trailing closure, etc.) it reports as available. RangeInfo requests are then made on the uniqued ranges of every syntactic structure in the file above the token level, i.e. every (sub-)expression, pattern, statement, clause, declaration, etc. As with CursorInfo, SemanticRefactoring requests are made in the same locations for each refactoring kind reported as being available in the response. Finally, CodeComplete requests are sent at the beginning and end of each identifier and higher-level expression, before the document is released with an EditorClose request.

    The animation below visualizes this process for a small example file. Note that SemanticRefactoring requests are not shown, as they coincide with the locations and timing of the CursorInfo and RangeInfo requests.

    > ![Animated visualization of the default rewrite mode](/assets/images/stress-tester-blog/default.gif){:width="100%"}

    This strategy never modifies the input Swift source file, so assuming that file compiles, any failures it reports may affect users simply browsing and navigating unmodified, valid Swift code. These are generally higher-priority issues.

 2. **`--rewrite-mode=basic`**

    In this mode an EditorOpen request is also sent, but with no file content. EditorReplaceText requests are instead made to introduce the content of the input Swift source file token by token from top to bottom, with various semantic requests being made before and after each token insertion based on the token's type and what higher level syntactic structures it is a part of. CursorInfo requests, for example, are made at the start positions of all identifier tokens as soon as they are introduced, while CodeComplete requests are sent immediately before inserting identifiers, and immediately after inserting identifiers and tokens that end expressions. RangeInfo requests, meanwhile, are sent for all higher-level syntactic structures, as soon as their first and last tokens have been inserted. As with the default mode, SemanticRefactoring requests are sent for each available refactoring returned from the CursorInfo and RangeInfo requests.

    > ![Animated visualization of the basic rewrite mode](/assets/images/stress-tester-blog/basic.gif){:width="100%"}

    While browsing and navigating valid code is important, many sourcekitd requests like CodeComplete, are primarily invoked on Swift source files in an invalid, incomplete state. This is the simplest strategy that exercises sourcekitd on source with incomplete syntax and unresolvable identifiers.

3. **`--rewrite-mode=concurrent`**

    This mode works like the basic mode, but as if it was being run for each top-level declaration in the file concurrently. It inserts a single token of the first top-level declaration, then of the next top-level declaration, then of the next, and so on, in a round-robin-like scheme, until all tokens have been placed. Semantic requests, like CursorInfo and CodeComplete, are performed before and/or after each token is inserted, according to the same rules as the basic mode, above.

    > ![Animated visualization of the concurrent rewrite mode](/assets/images/stress-tester-blog/concurrent.gif){:width="100%"}

    As well as producing incomplete syntax, this approach also results in declarations later in the file being temporarily nested inside earlier declarations, often giving them invalid contexts.

4. **`--rewrite-mode=insideOut`**

    As with the previous two modes, an initial EditorOpen request is sent with no file content, and tokens are inserted gradually via EditorReplaceText requests. The ordering in this case, though, is from the most deeply nested token in syntactic structure of the provided file, to the least. This depth is based on SwiftSyntax's syntax tree, so is quite fine-grained. In the expression `(1-2)+3`, for example, the tokens would be inserted in the following temporal order: `1`, `2`, `-`, `(`, `)`, `3`, `+`. Beyond the different insertion order, this mode otherwise works similarly the concurrent and basic modes, sending semantic requests as tokens are introduced based on both their type and the higher level structures they complete.

    > ![Animated visualization of the insideOut rewrite mode](/assets/images/stress-tester-blog/insideOut.gif){:width="100%"}

    This approach results in fairly incomprehensible modifications and file states in its early stages, but has been quite useful in finding issues in SwiftSyntax and the recently introduced incremental parsing logic that sourcekitd uses to provide the syntactic information in the EditorOpen and EditorReplaceText requests.

#### Running the stress tester over an entire project: sk-swiftc-wrapper

`$ sk-swiftc-wrapper <compiler arguments>`

The stress tester executable itself isn't very convenient to run over an existing project because it can only be run per file and takes explicit compiler arguments. To simplify this the toolchain includes the `sk-swiftc-wrapper` executable. This wraps and serves as drop-in replacement for the Swift compiler, `swiftc`. When invoked, it passes the compiler arguments it's given through to swiftc to compile as normal, but if the compilation succeeds, it additionally invokes the stress tester on each of the Swift source files that were compiled. To speed things up, a number of these invocations may be run in parallel, depending on the number of available processors. If any of these stress tester invocations fail, the invocation as a whole also fails.  This makes running the sourcekitd stress tester over a project as simple as setting `sk-swiftc-wrapper` as the swift compiler to use, and building. If the stress tester finds an issue, the build fails and details on the issue are included in the build output.

### Regression and pull request testing via Swift CI

To help catch sourcekitd failures as they're introduced, the stress tester is now being run over the 78 open source projects in the [Swift source compatibility suite](/source-compatibility/) as part of Swift's continuous integration testing. The Swift source compatibility suite was put together to help ensure the compatibility of Swift source code as the language and compiler evolve, but its mix of Xcode and Swift Package Manager projects across a variety of domains make it a great corpus of real-world Swift code to run the stress tester over too. Swift CI is currently running the stress tester over the full suite once per week due to its long runtime, and over a smaller subset that has a faster turnaround on a continuous basis whenever sourcekitd and compiler changes are made.

Running over the Swift source compatibility suite has found 91 issues affecting sourcekitd so far, including several regressions caused by fixes to earlier issues the stress tester reported. To make it easier to catch such regressions before changes are merged, we've also added pull request testing support for running the stress tester over a subset of the source compatibility suite. Swift project contributors can run the stress tester against their changes before merging by including the @swift-ci mention below in a comment on their PR:


> **@swift-ci** please stress test

To date 72 of the 91 sourcekitd issues detected by the stress tester have been fixed. These fixes of course improve the quality of sourcekitd and the editing experience, but in many cases are also improving the Swift compiler itself. This is because sourcekitd shares a lot of common code with the compiler, and exercises it over a far greater range of invalid Swift source code. Code completion, for example, is regularly invoked in the middle of making changes to one or more files, while a build is usually only triggered once those changes near completion. For the compiler, fixing these issues is often the difference between getting useful diagnostics and a segmentation fault.

### Find and report sourcekitd crashes in your own Projects

The projects in the source compatibility suite are a great start, but the more projects the stress tester is run over, the more issues it will be able find. It's for this reason the sourcekitd stress tester is now included in the [swift.org](/download/#snapshots) trunk development toolchains. If you work on any Swift projects (and if you're reading this blog you probably do) please try running it over them and report any failures it finds using the instructions below.  This will not only improve your own Swift editing experience in future releases, but also everyone else's.

#### Xcode projects

To run the stress tester over an Xcode project:

1. Download and install the latest trunk development snapshot of the Swift toolchain from [swift.org](/download/#snapshots)
2. Open Xcode and select the downloaded toolchain via Xcode > Toolchains in the menu
3. Open your project and navigate to the Build Settings view for your project or the particular target you would like to stress test
4. Add a user-defined build setting `SWIFT_EXEC` with the value set to `$(TOOLCHAIN_DIR)/usr/bin/sk-swiftc-wrapper` as shown below:

    ![Add the SWIFT_EXEC custom build setting](/assets/images/stress-tester-blog/xcode.png){:width="100%"}

5. Start a build (⌘B) of the target you'd like to stress test and look at the build log in the Report Navigator for details on any issues it detects. Stress testing sourcekitd is an expensive operation, so expect the build to take significantly longer than usual.
6. If any issues are detected, please follow the filing instructions below.


#### Swift package manager projects

To run the stress tester over a Swift package manager project, you can either generate an Xcode project via `swift package --generate-xcodeproj` and follow the instructions above, or use the following instructions to run on the command line:

1. Download and install the latest development snapshot of the Swift toolchain from [swift.org](/download/#snapshots)
2. Determine the path to the installed toolchain's bin directory. Depending on the installation options you chose this should be under `Library/Developer/Toolchains/<toolchain>/usr/bin` in either your home directory or the root directory.

    `$ TOOLCHAIN_BIN=/Library/Developer/Toolchains/swift-DEVELOPMENT-SNAPSHOT-2019-01-21-a.xctoolchain/usr/bin`

3. Invoke the toolchain's swift executable with the build command and additionally set the `SWIFT_EXEC` environment variable to the path to `sk-swiftc-wrapper`.

    `$ SWIFT_EXEC=$TOOLCHAIN_BIN/sk-swiftc-wrapper $TOOLCHAIN_BIN/swift build`

4. Check the command output for progress and detected failures. Stress testing sourcekitd is an expensive operation, so expect the build to take significantly longer than usual.
5. If any issues are detected, see below for filing instructions.


#### Filing reports for issues found by the stress tester

When the stress tester detects an issue it reports details about the failure in Xcode's build log, or in the swift build invocation's command-line output. A typical issue will look something like the below, found when stress testing the SwiftSyntax project:

<pre>
Detected unexpected failure: Sourcekitd crashed
  request: CursorInfo in /tmp/swift-syntax/.../ByteTreeDeserialization.swift (modified: concurrent)
    at offset 2694 with args: -incremental -module-name SwiftSyntax ...

-- begin file content --------
//===----- ByteTreeDeserialization.swift - Reading the ByteTree format ----===//
//
// This source file is part of the Swift.org open source project
//

...

/// Helper object for reading objects out a ByteTree. Keeps track that fields
/// are not read out of order and discards all trailing fields that were present
/// in the binary format but were not handled when reading the object.
struct ByteTreeObjectReader {

...

  fileprivate init(reader: UnsafeMutablePointer&lt;ByteTreeReader&gt;,
                   <em><strong>&lt;cursor-offset&gt;</strong></em>numFields

struct ByteTreeProtocolVersion {
  let major: Int
  let minor: Int
}

...
-- end file content ----------
</pre>

If the stress tester detects an unexpected failure like the above when running over a project, please follow the steps below to report it:

1. Go to [bugs.swift.org](http://bugs.swift.org/), sign up or log in to your existing account, and create a new issue.
2. In the form that appears, include the type of failure detected and the request type that triggered it in the Summary field. For the example above this would be something like “Sourcekitd crashed making a CursorInfo request”.
3. Copy and paste the stress tester output from the 'Detected unexpected failure' line to the 'end file content' line into the Description field.
4. For Component, enter “Tooling”.
5. For Environment, be sure to include the [swift.org](http://swift.org/) toolchain version and (if applicable) Xcode version you used. If you can, please also include details on how to access the project you ran the stress tester over (e.g. by providing a Git url to clone, or attaching the Xcode project) and any steps to take to reproduce the issue (e.g. the swift build invocation or the target and run destination you used when running the stress tester).
6. In the attachment field, include the project if you can, as mentioned above, but if the failure was a crash, please also attach any recent crash logs under `~/Library/Logs/DiagnosticReports/SourceKitService*`
7. Click the "Create" button to finish filing the issue, and navigate to it via the notification that appears or under "Recent Issues" in the "Issues" menu.
8. In the "Details" section please add the label "FoundByStressTester" to help us track the quantity and kinds of issues the stress tester is finding.

### Conclusion

The sourcekitd stress tester is a relatively simple new testing tool for sourcekitd, but based on the issues found running over the Swift source compatibility suite and its inclusion as part of Swift's CI testing, we expect it to have a big impact on the reliability of the Swift editing experience in Xcode and SourceKit-LSP going forward. Knowing that code completion, local refactorings, and many other sourcekitd features work reliably on every token of every file of every project in the Swift source compatibility suite provides much greater confidence that changes to sourcekitd and the compiler aren't regressing this functionality. The stress tester's inclusion in the [swift.org](http://swift.org/) toolchains provides an avenue for yet further coverage too, as Swift developers now have a simple way to find and report sourcekitd failures in their own projects.

# Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/swift-org-blog-introducing-the-sourcekitd-stress-tester/20228) on the Swift forums.
