---
layout: new-layouts/blog
date: 2020-10-01 14:00:00
title: Introducing Swift Atomics
author: lorentey
---

I'm delighted to announce Swift Atomics, a new open source package that enables direct use of low-level atomic operations in Swift code. The goal of this library is to enable intrepid systems programmers to start building synchronization constructs (such as concurrent data structures) directly in Swift.

As a quick taste, this is what atomic operations look like using this new package:

~~~swift
import Atomics
import Dispatch

let counter = ManagedAtomic<Int>(0)

DispatchQueue.concurrentPerform(iterations: 10) { _ in
  for _ in 0 ..< 1_000_000 {
    counter.wrappingIncrement(by: 1, ordering: .relaxed)
  }
}
counter.load(ordering: .relaxed) // ⟹ 10_000_000
~~~

You may have noticed that the atomic operations in this example do not follow the exclusivity rules that govern normal Swift variables. Atomic operations may be performed from multiple concurrent threads of execution, so long as the value is only accessed via atomic operations.

This is enabled by [SE-0282], a recently accepted Swift Evolution proposal that explicitly adopted a C/C++-style memory model for Swift, and (informally) described how regular Swift code interoperates with atomic operations. In fact, most APIs in this new package come from previous incarnations of the SE-0282 proposal: they were originally developed by an extremely productive collaborative effort on the [Evolution forum][pitch]. I am deeply grateful to all contributors to these discussions, and I hope the package will continue the collaboration in similarly high spirits!

[SE-0282]: https://github.com/swiftlang/swift-evolution/blob/master/proposals/0282-atomics.md
[pitch]: https://forums.swift.org/t/low-level-atomic-operations/34683

## Proceed at Your Own Risk

The `Atomics` package provides carefully considered API for atomic operations that follows established design principles for Swift APIs. However, the underlying operations work on a very low level of abstraction. Atomics -- even more than other low-level concurrency constructs -- are notoriously difficult to use correctly.

These APIs enable systems programming use cases that were previously out of reach for Swift programmers. In particular, atomics enable the creation of higher-level, easier-to-use constructs for managing concurrency without resorting to importing their implementation from another language.

Like unsafe APIs in the Standard Library, we recommend using this package very sparingly -- preferably not at all! If it's necessary, though, it is a good idea to:

* Implement existing published algorithms rather than inventing new ones,
* Isolate atomic code to small, easily reviewable units,
* And avoid passing around atomic constructs as interface types.

Approach atomic code with extreme caution. Use copious amounts of Thread Sanitizer after every contact!

## Supported Atomic Types

The package implements atomic operations for the following Swift types, all of which conform to the public `AtomicValue` protocol:

- Standard signed integer types (`Int`, `Int64`, `Int32`, `Int16`, `Int8`)
- Standard unsigned integer types (`UInt`, `UInt64`, `UInt32`, `UInt16`, `UInt8`)
- Booleans (`Bool`)
- Standard pointer types (`UnsafeRawPointer`, `UnsafeMutableRawPointer`, `UnsafePointer<T>`, `UnsafeMutablePointer<T>`), along with their optional-wrapped forms (such as `Optional<UnsafePointer<T>>`)
- Unmanaged references (`Unmanaged<T>`, `Optional<Unmanaged<T>>`)
- A special `DoubleWord` type that consists of two `UInt` values, `low` and `high`, providing double-wide atomic primitives
- Any `RawRepresentable` type whose `RawValue` is in turn an atomic type (such as simple custom enum types)
- Strong references to class instances that opted into atomic use (by conforming to the `AtomicReference` protocol)

Of particular note is full support for atomic strong references. This provides a convenient memory reclamation solution for concurrent data structures that fits perfectly with Swift's reference counting memory management model. (Atomic strong references are implemented in terms of `DoubleWord` operations.)

One common use case for an atomic strong reference is to create a lazily initialized (but otherwise constant) variable of some class type. Using general atomic references would be unreasonably expensive in this simple case, so we also provide a separate set of more efficient constructs (`ManagedAtomicLazyReference` and `UnsafeAtomicLazyReference`) that are optimized specifically for lazy initialization. This can be a useful replacement for `lazy var` stored properties in class contexts, which aren't safe to use in concurrent contexts.

## Memory Management

Atomic access is implemented in terms of dedicated atomic storage representations that are kept distinct from the corresponding regular (non-atomic) type. (E.g., the actual integer value underlying the counter above isn't directly accessible.) This has several advantages:

- it helps prevent accidental non-atomic access to atomic variables,
- it enables certain atomic values to use a custom storage representation separate from their regular layout (such as the one used by atomic strong references), and
- it is a better fit with the standard C atomics library that is used under the hood to implement the actual operations.

[SE-0282]: https://github.com/swiftlang/swift-evolution/blob/master/proposals/0282-atomics.md

While the underlying pointer-based atomic operations are exposed as static methods on the corresponding `AtomicStorage` types, we strongly recommend the use of higher-level atomic wrappers to manage the details of preparing/disposing atomic storage. This version of the library provides two wrapper types:

- an easy to use, memory-safe `ManagedAtomic<T>` generic class, and
- a less convenient, but more flexible `UnsafeAtomic<T>` generic struct, with manual memory management.

`ManagedAtomic` requires a class instance allocation for every atomic value, and it relies on reference counting to manage memory. This makes it very convenient, but the allocation/reference counting overhead may not be appropriate for every use case. On the other hand, `UnsafeAtomic` can be used to perform an atomic operations over any memory location (of the appropriate storage type) to which you can retrieve a pointer, including memory you allocate yourself, a slice of `ManagedBuffer` storage, etc. In exchange of this flexibility, you need to manually ensure that the pointer remains valid while you're accessing it.

Both constructs provide the following atomic operations on all `AtomicValue` types:


~~~swift
func load(ordering: AtomicLoadOrdering) -> Value
func store(_ desired: Value, ordering: AtomicStoreOrdering)
func exchange(_ desired: Value, ordering: AtomicUpdateOrdering) -> Value

func compareExchange(
    expected: Value,
    desired: Value,
    ordering: AtomicUpdateOrdering
) -> (exchanged: Bool, original: Value)

func compareExchange(
    expected: Value,
    desired: Value,
    successOrdering: AtomicUpdateOrdering,
    failureOrdering: AtomicLoadOrdering
) -> (exchanged: Bool, original: Value)

func weakCompareExchange(
    expected: Value,
    desired: Value,
    successOrdering: AtomicUpdateOrdering,
    failureOrdering: AtomicLoadOrdering
) -> (exchanged: Bool, original: Value)
~~~

Integer types come with additional atomic operations for incrementing or decrementing values and bitwise logical operations. `Bool` provides a few boolean operations in the same vein.

The ordering enumerations correspond to `std::memory_order` in the C/C++ standard, except this package doesn't expose a consuming memory ordering. (`memory_order_consume` isn't implemented by any C/C++ compiler, and while it isn't explicitly deprecated, its semantics are being revised, and its use is discouraged in the current version of the C++ standard.) The `Atomics` package provides three separate enumerations for orderings, each representing the subset of orderings that apply to a load, store or update operation, respectively.

## Lock-Free vs Wait-Free Operations

All atomic operations exposed by this package are guaranteed to have lock-free implementations. Lock-freedom means that the atomic operations are non-blocking -- they don't ever need to wait on the progress of some other thread to complete their own task.

However, we do not guarantee wait-free operation: depending on the capabilities of the target platform, some of the exposed operations may be implemented by compare-and-exchange loops. When multiple threads are repeatedly competing for access to the same atomic variable, this may result in unfair scheduling where some threads may get repeatedly preempted by others, forcing them to retry their operation an arbitrary number of times. That said, all atomic operations map directly to dedicated, wait-free CPU instructions where available -- to the extent supported by LLVM & Clang.

## What's Next?

In the near term, we'd like to round out the package by adding even more atomic types and operations, as well as to validate our assumptions about correctness and performance by improving the existing test suite.

* [Tagged atomics](https://github.com/apple/swift-atomics/issues/1) would provide a useful tool for solving common problems with concurrent data structures. This would likely be built on top of the double-wide atomic primitives that are already exposed by the library, but inventing the right API for tagging is an interesting API design challenge.

* Support for some [atomic floating point operations](https://github.com/apple/swift-atomics/issues/2) is a commonly requested feature.

## Get Involved

Your experience, feedback, and contributions are greatly encouraged!

* Get started by trying out the [`Atomics` library on GitHub](https://github.com/apple/swift-atomics),
* Discuss the library and get help in the [Atomics forum](https://forums.swift.org/c/related-projects/swift-atomics),
* [Open an issue](https://github.com/apple/swift-atomics/issues) with problems you find or ideas you have for improvements,
* And as always, [pull requests](https://github.com/apple/swift-atomics/pulls) are welcome!

## Questions?

Please feel free to ask questions about this post in the [associated thread](https://forums.swift.org/t/introducing-swift-atomics) on the [Swift forums](https://forums.swift.org/).
