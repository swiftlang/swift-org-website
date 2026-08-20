---
layout: new-layouts/post
published: false
date: 2026-08-20 12:00:00
title: "Embedded Swift Improvements Coming in Swift 6.4"
author: [doug_gregor]
category: "Language"
---

[Embedded Swift](/get-started/embedded/) is a subset of Swift that’s designed for low resource usage, making it capable of running on constrained environments like microcontrollers. Using a special compilation mode, Embedded Swift produces significantly smaller binaries than regular Swift. While a subset of the full language, the vast majority of the Swift language works exactly the same in Embedded Swift. Additional information is described in the [Embedded Swift vision document](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md).

Embedded Swift is evolving rapidly. Following our updates on [Embedded Swift improvements in Swift 6.3](/blog/embedded-swift-improvements-coming-in-swift-6.3/) late last year, this post describes a number of additional improvements made in the upcoming Swift 6.4 release. You can try them out today with a [Swift development snapshot](/install/).

## Language improvements

Embedded Swift continues to expand its subset of the language to include more aspects of “full” Swift, making it easier than ever to bring compatibility with Embedded Swift to existing Swift code bases. Many of these features have some dynamic aspect to them, meaning that they have an impact on runtime performance (for example, due to indirect calls) and code size (due to requiring additional metadata). However, this impact only occurs where these dynamic language features are actually used: code that is highly sensitive to code size and performance can choose to avoid them.

### Generalized support for existential (`any`) types

Embedded Swift previously only supported existential (`any`) types that had an `AnyObject` constraint, meaning they could only be used with class instances. Now, all `any` types are available in Embedded Swift, including `Any` itself. For example:

```
protocol P {
  func method()
}

extension Int: P {
  func method() { print("\(self) is here") }
}

let a: any P = 17
a.method() // prints "17 is here"
```

The Embedded Swift generics compilation model, which requires that all generic functions and types eventually be specialized, implies some limitations on the use of `any` types. Specifically, a generic function cannot be called on an `any` type:

```
extension P {
  func genericMethod<T: P>(_ other: T) { ... }
}

let a: any P = 17
a.genericMethod(a) // error: cannot use generic instance method 'genericMethod' on a value of type 'any P' in Embedded Swift
```

### Untyped throws

Embedded Swift previously only allowed throwing specific error types, like this:

```
func parseRecord() throws(ParsingError) -> Record { ... }
```

“Untyped” throws, which can throw any `Error`-conforming instance, was previously disallowed in Embedded Swift:

```
func loadImage() throws -> Image { ... } // previously disallowed in Embedded Swift
```

Untyped throws is equivalent to throwing a value of type `any Error`. With the generalization of `any` types, Embedded Swift now fully supports untyped throws. Throwing a value of `any Error` typically requires a heap allocation, so typed throws should still be preferred for code bases that want to avoid heap allocations.

### Metatypes

Embedded Swift has traditionally allowed metatypes (e.g., `Int.self`) only in very narrow places, for example when using them to specify argument types for generic functions:

```
rawPointer.bindMemory(to: Value.self, capacity: 1)
```

Swift 6.4 introduces complete support for metatypes in Embedded Swift: one can create and use instances of metatypes, including existential types like `any (DefaultInitializable.Type)`. For example, this is now permitted and works in the same way as full Swift:

```
protocol DefaultInitializable {
  init()
}

extension Int: DefaultInitializable { }

let factory: any (DefaultInitializable.Type) = Int.self
let aValue: any DefaultInitializable = factory.init()
```

## Library improvements

Additional features in the Swift standard library and associated libraries from full Swift are now available in Embedded Swift.

### Floating point parsing

Swift floating point values can be parsed from a string, like this:

```
let inputText: String = getInputText()
if let value = Double(inputText) {
  // value is a Double
}
```

As part of a [reimplementation of this functionality in Swift](https://github.com/swiftlang/swift/pull/85797), these floating-point parsing APIs are now available in Embedded Swift as well.

### Concurrency error handling

The Embedded Swift concurrency library now supports throwing operations, such as throwing tasks and task groups. For example:

```
let task = Task {
  if badThing {
    throw MyError.badThingHappened
  }

  return "ok"
}

print(try await task.value)
```

## Try it out!

Embedded Swift support is available in the [Swift development snapshots](/install/). The best way to get started is through the examples in the [Swift Embedded Examples](https://github.com/swiftlang/swift-embedded-examples) repository, which contains a number of sample projects to get Embedded Swift code building and running on various hardware.

If you have questions about the improvements described here, or want to discuss your own Embedded Swift work, we encourage you to join the conversation on the Swift forums. You can ask about this post in the [associated thread](https://forums.swift.org/t/embedded-swift-improvements-coming-in-swift-6-4/TODO), and share your experiences in the [Embedded Swift category](https://forums.swift.org/c/platform/embedded/). (TODO: post associated thread before publishing this)