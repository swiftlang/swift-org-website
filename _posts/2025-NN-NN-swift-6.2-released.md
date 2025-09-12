---
layout: post
published: true
date: 2025-NN-NN 10:00:00
title: Swift 6.2 Released
author: [hborla]
---

# Swift 6.2 Released

We’re excited to announce Swift 6.2, a release aimed at making every Swift developer more productive, regardless of where or how you write code. From improved tooling and libraries to enhancements in concurrency and performance, Swift 6.2 delivers a broad set of features designed for real-world development at every layer of the software stack.

Read on for a deep dive into changes to the language, libraries, workflows, platform support, and next steps for getting started with Swift 6.2.

## Approachable Concurrency

Swift 6.2 lowers the barrier to concurrent programming with a set of changes designed to reduce boilerplate and let you write safe concurrent code more naturally:

* **Single-threaded by default:** Run your code on the main thread without explicit `@MainActor` annotations using the new option to isolate code to the main actor by default. This option is ideal for scripts, UI code, and other executable targets.
* **Intuitive `async` functions:** Write async code without concurrent access to mutable state. Previously, `nonisolated async` methods always switched to the global executor that manages the concurrent thread pool, which made it difficult to write async methods for class types without data-race safety errors. In Swift 6.2, you can migrate to an [upcoming feature](https://docs.swift.org/compiler/documentation/diagnostics/nonisolated-nonsending-by-default/) where `async` functions run in the caller’s execution context, even when called on the main actor.
* **Opting into concurrency with `@concurrent`:** Introduce code that runs concurrently using the new `@concurrent` attribute. This makes it clear when you want code to remain serialized on actor, and when code may run in parallel.

```
TODO: code example
```

Together, these improvements let you write data-race free code with less annotation overhead, provide more predictable behavior for async code, while still allowing you to introduce concurrency when you need it.

## Safe Systems Programming

Swift 6.2 includes features designed to maximize performance without compromising safety. These features help you write safe, low-level code with predictable performance and minimal overhead.

[`InlineArray`](https://developer.apple.com/documentation/swift/inlinearray) is a new fixed-size array with inline storage for elements, which can be stored on the stack or directly within other types without additional heap allocation. You can introduce an inline array by writing the size in angle brackets before the element, or by using the `of` shorthand syntax:

```swift
struct Game {
  // Shorthand for InlineArray<40, Sprite>
  var bricks: [40 of Sprite]

  init(_ brickSprite: Sprite) {
    bricks = .init(repeating: brickSprite)
  }
}
```

The new [`Span`](https://developer.apple.com/documentation/swift/span?changes=_8) type offers safe, direct access to contiguous memory. Span maintains memory safety by ensuring the memory remains valid while you’re using it. These guarantees are checked at compile time with no runtime overhead, and define away the memory safety problems inherent to pointers, such as use-after-free bugs.

Swift 6.2 enhances its capabilities for low-level and security-critical projects beyond new APIs:

* **Embedded Swift:** Embedded Swift now includes Swift’s full `String` APIs, `any` types for class-constrained protocols, and the new `InlineArray` and `Span` types.
* **Safe C++ interoperability:** Projects that mix Swift and C++ can [take advantage of Swift’s safe abstractions](/documentation/cxx-interop/safe-interop/) like `Span` for C++ APIs through header annotations.
* **Opt-in strict memory safety:** Swift has provided memory safety since its inception, while allowing use of unsafe constructs like unsafe pointers when needed, such as using a C API that accepts pointers. Swift 6.2 introduces *opt-in strict memory safety*, which flags uses of unsafe constructs, so you can replace them with safe alternatives or explicitly acknowledge them in source code. It’s opt-in because the majority of projects don’t need this level of enforcement — strict memory safety is best left for projects with the strongest security requirements.

## Streamlined Workflows

Beyond language improvements, Swift 6.2 smooths the day-to-day iteration cycle of editing, building, and debugging code.

### VS Code Swift extension

The [Swift extension for VS Code](https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode) is now officially verified and distributed by Swift.org. The latest version of the extension includes:

* **Background indexing by default:** Write code with fast, always-up-to-date editor features like jump-to-definition and code completion.
* **Built-in LLDB debugging:** Step through Swift code, set breakpoints, and inspect state using LLDB right inside VS Code.
* **Swift project panel:** Navigate your Swift project’s targets, dependencies, and tasks in the Explorer view.
* **Live DocC preview:** Preview your rendered documentation side-by-side with your code, updated live as you type.

These workflow improvements make it easier to work on Swift projects in your environment of choice with first-class tooling.

### Precise warning control

Swift 6.2 introduces enhances how you manage compiler warnings by allowing control at the *diagnostic group* level. A diagnostic group is a category of warnings identified by a name. You can specify the desired behavior of warnings in a diagnostic group in a Swift package manifest using the [`treatWarning`](https://docs.swift.org/swiftpm/documentation/packagedescription/swiftsetting/treatwarning(_:as:_:)/) method on `SwiftSetting`, or promote all warnings to errors using the [`treatAllWarnings`](https://docs.swift.org/swiftpm/documentation/packagedescription/swiftsetting/treatallwarnings(as:_:)) method. For example, you can promote all warnings to errors except for warnings about uses of deprecated APIs:

```swift
.target(
  name: "MyLibrary",
  swiftSettings: [
    .treatAllWarnings(as: .error),
    .treatWarning("DeprecatedDeclaration", as: .warning),
  ]
)
```

### Macro build performance

Swift 6.2 significantly improves clean build times for projects that use macro-based APIs. Previously, the build system had to first fetch and build the swift-syntax package from source before building the macro project, which noticeably lengthened compile times, especially in CI environments. SwiftPM now supports pre-built swift-syntax dependencies, completely eliminating an expensive build step.

### Enhanced async debugging

Swift 6.2 makes it much easier to follow what’s happening in concurrent code when debugging with LLDB:

* **Robust `async` stepping:** Reliably step into asynchronous functions in LLDB, even when the async call requires switching threads.
* **Surfacing task context:** See which task a piece of code is running on when stopped at a breakpoint and when viewing the backtrace for the current thread.
* **Named tasks:** Assign human-readable names when creating tasks, which are surfaced in the task context in debugging and profiling tools.

### Migration to upcoming features

Swift 6.2 includes *migration tooling* to help you adopt upcoming language features:

* **Identify source incompatibility:** Identify code patterns that will no longer compile or change behavior when the upcoming feature is enabled through warnings from migration tooling.
* **Automate code changes:** Apply fix-its to update your code to preserve its existing behavior.

This streamlines the process of enabling upcoming features by eliminating the tedious task of manual code changes. You can learn more about migration tooling in the [Swift migration guide](/migration/documentation/swift-6-concurrency-migration-guide/featuremigration).

## Core Library Updates

Whether you're managing external processes, reacting to state changes, or writing test suites, the Swift 6.2 libraries are evolving to help you write cleaner and safer code.

### Subprocess

Swift 6.2 introduces a new `Subprocess` package that offers a streamlined, concurrency‑friendly API for launching and managing external processes. This includes APIs built with async/await, fine-grained control over process execution, platform-specific configuration, and more—ideal for scripting, automation, and server‑side tasks:

```swift
import Subprocess

let swiftPath = FilePath("/usr/bin/swift")
let result = try await run(
  .path(swiftPath),
  arguments: ["--version"]
)

let swiftVersion = result.standardOutput
```

Explore the full API surface for version 0.1 in the [swift-subprocess repository](https://github.com/swiftlang/swift-subprocess), and feedback from your adoption will inform the API that is released in version 1.0.

### Foundation

In Swift 6.2, the Foundation library includes a modern `NotificationCenter` API that uses concrete notification types instead of relying on strings and untyped dictionaries for notification names and payloads. This means you can define a notification struct with stored properties, and observers can use the type without error-prone indexing and dynamic casting. Notification types also specify whether they’re posted synchronously on the main actor or asynchronously through a conformance to [`MainActorMessage`](https://developer.apple.com/documentation/foundation/notificationcenter/mainactormessage) or [`AsyncMessage`](https://developer.apple.com/documentation/foundation/notificationcenter/asyncmessage), which eliminates concurrency errors when working with main actor notifications.

### Observation

Swift 6.2 enables streaming transactional state changes of observable types using the new [`Observations`](https://developer.apple.com/documentation/observation/observations) async sequence type. Updates include all synchronous changes to the observable properties, and the transaction ends at the next `await` that suspends. This avoids redundant UI updates, improves performance, and ensures that your code reacts to a consistent snapshot of the value.

### Swift Testing

Swift Testing in Swift 6.2 adds new APIs for enhanced expressivity in your tests and test results:

* [**Exit testing**](https://developer.apple.com/documentation/testing/exit-testing) lets you verify that code terminates under specific conditions, such as a failed precondition. Your exit tests run in a new process and validate that the exit behavior is what you expect, making it possible to exercise critical failure paths like you would in any other test.
* [**Attachments**](https://developer.apple.com/documentation/testing/attachments) let you include additional context in test results, including  strings, images, logs, and other artifacts, surfaced in test reports or written to disk. This makes it easier to diagnose failures with concrete evidence—whether that’s a screenshot of a UI state, a JSON payload, or a trace of steps leading up to the issue.
* [**Raw identifier display names**](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0451-escaped-identifiers.md) let you customize the names of test functions and suite types with less code:

    ```diff
    -@Test("square() returns x * x")
    -func squareIsXTimesX() {
    +@Test func `square() returns x * x`() {
       #expect(square(4) == 4 * 4)
     }
    ```

## WebAssembly Support

Swift 6.2 gains support for WebAssembly, also known as Wasm. WebAssembly is a virtual machine platform focused on portability, security, and high performance. You can build both client and server applications for Wasm and deploy to the browser or other runtimes. Learn more about Wasm in the [vision for WebAssembly support in Swift](https://github.com/swiftlang/swift-evolution/blob/main/visions/webassembly.md).

## Thank you

Thank you to everyone who shared their experiences, frustrations, and insights that guided the design of Swift 6.2, especially the approachable concurrency model. Your feedback made it clear where the language could be friendlier, where safety needed to feel more natural, and where the tools could make you more productive. The improvements in Swift 6.2 are only possible because of your voices.

If you’re excited about where Swift is headed, there’s no better time to get involved in the Swift community. From participating in Swift Evolution, to contributing code on GitHub, or sharing feedback on how the language feels in real-world projects, every voice helps shape Swift’s future. Whether you’re a seasoned programmer or just starting out, our community thrives on collaboration and welcomes new perspectives. Join in, learn from others, and help make Swift a better language.

## Next Steps

You can find a complete list of language proposals that were accepted through the [Swift Evolution](https://github.com/swiftlang/swift-evolution) process and implemented in Swift 6.2 on the [Swift Evolution dashboard](/swift-evolution/#?version=6.2).

Ready to upgrade? Install the latest toolchain using Swiftly `swiftly install 6.2` or [Swift.org/install](/install) and start exploring Swift 6.2 today.
