---
layout: post
published: true
date: NNNN-NN-NN 11:00:00
title: Swift 5.10 Released
author: [hborla]
---

Swift 5.10 is now available!

Swift 5.10 accomplishes full data isolation in the concurrency language model. The concurrency model was introduced in Swift 5.5 including `async`/`await`, actors, and structured concurrency, and Swift 5.7 introduced `Sendable` as the fundamental concept for state that is safe to be shared across isolation domains. Data isolation enforcement at compile time is gated behind complete concurrency checking, and the programming model with full data isolation covering all areas of the language has taken years of active development over many releases of Swift. Swift 5.10 reaches this important milestone.

Full data isolation in Swift 5.10 is the precursor to Swift 6. Swift 6 will enforce full data isolation by default, and we will embark upon the transition to eliminate data races across the Swift ecosystem.

Read on to learn about full data isolation in Swift 5.10, new unsafe opt outs for actor isolation checking, and the remaining concurrency evolution ahead of Swift 6.

## Data-race safety

### Full data isolation

Swift 5.10 rounds out the data-race safety semantics in all corners of the language, and fixes numerous bugs in `Sendable` and actor isolation checking to strengthen the guarantees of complete concurrency checking. When writing code against `-strict-concurrency=complete`, Swift 5.10 will diagnose the potential for data races at compile time except where an explicit unsafe opt out, such as `nonisolated(unsafe)` or `@unchecked Sendable`, is used.

For example, in Swift 5.9, the following code fails an isolation assertion at runtime due to a `@MainActor`-isolated initializer being evaluated outside the actor, but it was not diagnosed under `-strict-concurrency=complete`:

```swift
@MainActor
class MyModel {
  init() {
    MainActor.assertIsolated()
  }

  static let shared = MyModel()
}

func useShared() async {
  let model = MyModel.shared
}

await useShared()
```

The above code admits data races. `MyModel.shared` is a `@MainActor`-isolated static variable, which evaluates a `@MainActor`-isolated initial value upon first access. `MainActor.shared` is accessed synchronously from a `nonisolated` context inside the `useShared()` function, so the initial value is computed off the main actor. In Swift 5.10, compiling the code with `-strict-concurrency=complete` produces a warning that the access must be done asynchronously:

  ```
  warning: expression is 'async' but is not marked with 'await'
    let model = MyModel.shared
                ^~~~~~~~~~~~~~
                await
  ```

You can find more details about the changes and additions to the full data isolation programming model in the [Swift 5.10 release notes](https://github.com/apple/swift/blob/release/5.10/CHANGELOG.md).

### Unsafe opt outs

Swift 5.10 introduces a new `nonisolated(unsafe)` keyword to opt out of actor isolation checking for stored properties and variables. `nonisolated(unsafe)` can be used on any form of storage, including stored properties, local variables, and static or global variables.

`nonisolated(unsafe)` can be used as a more granular opt out for `Sendable` checking, eliminating the need for `@unchecked Sendable` wrapper types in many use cases:

```swift
import Dispatch

// 'MutableData' is not 'Sendable'
class MutableData { ... }

final class MyModel: Sendable {
  private let queue = DispatchQueue(...)

  // 'protectedState' is manually isolated by 'queue'
  nonisolated(unsafe) private var protectedState: MutableData
}
```

`nonisolated(unsafe)` also eliminates the need for `@unchecked Sendable` wrapper types that are used only to pass specific instances of non-`Sendable` values across isolation boundaries when there is no potential for concurrent access:

```swift
// 'MutableData' is not 'Sendable'
class MutableData { ... }

func processData(_: MutableData) async { ... }

@MainActor func send() async {
  nonisolated(unsafe) let data = MutableData()
  await processData(data)
}
```

Note that without correct implementation of a synchronization mechanism to achieve data isolation, dynamic analysis from exclusivity enforcement or tools such as the Thread Sanitizer may still identify failures.

## Next Steps

### Try out complete concurrency ahead of Swift 6

**The next major release of Swift will be Swift 6.** Swift 5.10 is a critical call-to-action in the Swift community; complete concurrency checking in Swift 5.10 conservatively closes all known holes in the data race safety model, and we need your help finding any remaining soundness holes. Please [try out complete concurrency checking](LINK to INSTRUCTIONS) in your project and [report issues](https://github.com/apple/swift/issues/new/choose) if you find corner cases where complete concurrency checking does not diagnose a data race at compile time.

The complete concurrency model in Swift 5.10 is conservative. Several Swift Evolution proposals are in active development to improve the usability of full data isolation by removing false postive data race errors. This work includes lifting limitations on passing non-`Sendable` values across isolation boundaries when the compiler determines there is no potential for concurrent access, and more effective `Sendable` inference. You can find the set of proposals that will round out Swift 6 at [Swift.org/swift-evolution](https://www.swift.org/swift-evolution/).

Your feedback on using full data isolation in Swift 5.10 will help shape the Swift 6 migration guide, which will be made available on Swift.org ahead of Swift 6.



### Downloads

Official binaries for Swift 5.10 are [available for download](https://swift.org/download/) from [Swift.org](http://swift.org/) for macOS, Windows, and Linux.

## Swift Evolution Appendix

The following language proposals were accepted through the [Swift Evolution](https://github.com/apple/swift-evolution) process and [implemented in Swift 5.10](https://www.swift.org/swift-evolution/#?version=5.10):

* SE-0327: [On Actors and Initialization](https://github.com/apple/swift-evolution/blob/main/proposals/0327-actor-initializers.md)
* SE-0383: [Deprecate @UIApplicationMain and @NSApplicationMain](https://github.com/apple/swift-evolution/blob/main/proposals/0383-deprecate-uiapplicationmain-and-nsapplicationmain.md)
* SE-0404: [Allow Protocols to be Nested in Non-Generic Contexts](https://github.com/apple/swift-evolution/blob/main/proposals/0404-nested-protocols.md)
* SE-0411: [Isolated default value expressions](https://github.com/apple/swift-evolution/blob/main/proposals/0411-isolated-default-values.md)
* SE-0412: [Strict concurrency for global variables](https://github.com/apple/swift-evolution/blob/main/proposals/0412-strict-concurrency-for-global-variables.md)