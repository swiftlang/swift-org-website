---
layout: new-layouts/blog
published: true
date: 2022-03-24 11:00:00
title: Introducing Swift Async Algorithms
author: parkera
---

As part of Swift's move toward safe, simple, and performant asynchronous programming, we are pleased to introduce a new package of algorithms for `AsyncSequence`. It is called **Swift Async Algorithms** and it is available now [on GitHub](https://github.com/apple/swift-async-algorithms).

This package has three main goals:

- First-class integration with `async/await`
- Provide a home for time-based algorithms
- Be cross-platform and open source

## Motivation

AsyncAlgorithms is a package for algorithms that work with *values over time*. That includes those primarily about *time*, like `debounce` and `throttle`, but also algorithms about *order* like `combineLatest` and `merge`. Operations that work with multiple inputs (like `zip` does on `Sequence`) can be surprisingly complex to implement, with subtle behaviors and many edge cases to consider. A shared package can get these details correct, with extensive testing and documentation, for the benefit of all Swift apps.

The foundation for AsyncAlgorithms is already included in Swift 5.5 in [AsyncSequence](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0298-asyncsequence.md). Swift 5.5 also brings the ability to use a natural `for/in` loop with `await` to process the values in an `AsyncSequence` and `Sequence`-equivalent API like `map` and `filter`. Structured concurrency allows us to write code where intermediate state is simply a local variable, `try` can be used directly on functions that `throw`, and generally treat the logic for asynchronous code similar to that of synchronous code.

We believe an open source package will provide a great home for these APIs. A package gives developers flexibility in deploying across both platforms and OS versions. Development and API design will take place on [GitHub](https://github.com/apple/swift-async-algorithms) and the [Swift Forums](https://forums.swift.org/c/related-projects/swift-async-algorithms/86).

## A Brief Tour

The package includes `AsyncSequence` versions of familiar algorithms such as:

* Zip
* CombineLatest
* Merge
* Chain
* Buffer
* Debounce
* Throttle

-----

Let's start with a look at `zip`. Like its `Sequence` counterpart, `zip` produces tuples made up of values from two different `AsyncSequence`s:

```swift
for await (number, letter) in zip(numbers, letters) {
    print(number, letter)
}
```

-----

`AsyncSequence` supports `rethrows`, which means that error handling is as simple as using `try` -- the same as any other Swift code:

```swift
do {
    for try await (number, letter) in zip(numbers, lettersWithErrors) {
        print(number, letter)
    }
} catch {
    // Handle error
}
```

Other algorithms like `combineLatest` and `merge` also combine the output of several `AsyncSequence`s. Each offers a different kind of control over the type and timing of the output.

-----

A fundamental difference between `Sequence` and `AsyncSequence` is the introduction of the variable of *time*. Building on top of [proposals to standardize Clock and Duration](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0329-clock-instant-duration.md), the package adds algorithms like `debounce` and `throttle`. They provide easy, out-of-the-box solutions for common operations like throwing away values that arrive too fast:

```swift
for await value in input.debounce(for: .seconds(0.5)) {
    // Handle input, at most once per 0.5 seconds.
}
```

-----

It is often useful to wait for the collection of all values in a finite asynchronous sequence. This package provides initializers that do this with a single line of code:

```swift
let result = await Array(input)
```

-----

The `async` function is useful for combining synchronous `Sequence`s with `AsyncSequence`. Here, we use it alongside the `chain` function to add a preamble to the contents of a file:

```swift
let preamble = [
    "// This source file is part of the Swift.org open source project"
    "//"
    ""
].async

let lines = chain(preamble, URL(fileURLWithPath: "/tmp/Sample.swift").lines)

for try await line in lines {
    print(line)
}
```

## Combine

Apple introduced the [Combine](https://developer.apple.com/documentation/combine/) framework in the iOS 13 and macOS 10.15 SDKs. Since then, we've had the opportunity to learn how Combine has been used in real-world scenarios. With AsyncAlgorithms, we are applying these lessons as well as embracing the new structured concurrency features of Swift.

Combine's API is based on the `Publisher` and `Subscriber` interfaces, with *operators* to connect between them. Its design focuses on providing a way to declaratively specify a chain of these operators, transforming data as it moves from one end to the other. This requires thinking differently about intermediate state. Sometimes this leads to call sites that are more complex than one might expect -- especially when working with single values, errors, or data that needs to be shared. `async/await`'s [Structured Concurrency](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0304-structured-concurrency.md) provides us with a new way to express this kind of logic. We can now write asynchronous code that is split into smaller pieces and reads from top-to-bottom instead of as a series of chained transforms.

We're excited about the possibilities that `async/await` and `AsyncSequence` bring to the language. We believe this package will be a great place to explore future development and evolution of higher-level APIs in this space.

## What's Next

Today we are releasing a prototype version of the **Swift Async Algorithms** package. Our intent is to kickstart the project with a working implementation, then move forward with detailed design discussions on the Swift Forums. We welcome community involvement in:

* Early adoption of the package and feedback on the design
* Implementation of the package
* Implementation of the tests
* Pitches and evolution for the future of the package

We are using [GitHub Issues](https://github.com/apple/swift-async-algorithms/issues) to track bugs, feature requests, and starter tasks.
### References

#### Documentation

* [Combine](https://developer.apple.com/documentation/combine/)

#### Related Proposals

* [Structured Concurrency](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0304-structured-concurrency.md)
* [Async / Await](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0296-async-await.md)
* [AsyncSequence](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0298-asyncsequence.md)
* [AsyncStream](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0314-async-stream.md)
* [Clock / Duration](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0329-clock-instant-duration.md)

#### Companion Packages

* [Swift Algorithms](https://github.com/apple/swift-algorithms)
* [Swift Collections](https://github.com/apple/swift-collections)
