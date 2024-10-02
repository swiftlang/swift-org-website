---
layout: new-layouts/blog
date: 2020-10-07 9:00:00
title: Announcing Swift Algorithms
author: natecook1000
---

I'm excited to announce [Swift Algorithms](https://github.com/apple/swift-algorithms), a new open-source package of sequence and collection algorithms, along with their related types.

Algorithms are powerful tools for thought because they encapsulate difficult-to-read and error-prone raw loops. The `Algorithms` package includes a host of powerful, generic algorithms frequently found in other popular programming languages. We hope this new package will help people [embrace algorithms](https://developer.apple.com/videos/play/wwdc2018/223/), improving the correctness and performance of their code.

## A Brief Tour

With the `Algorithms` package's initial set of sequence and collection operations, you can cycle over a collection's elements, find combinations and permutations, create a random sample, and more.

One inclusion is a pair of `chunked` methods, each of which break a collection into consecutive subsequences. One version tests adjacent elements to find the breaking point between chunks — you can use it to quickly separate an array into ascending runs:

~~~swift
let numbers = [10, 20, 30, 10, 40, 40, 10, 20]
let chunks = numbers.chunked(by: { $0 <= $1 })
// [[10, 20, 30], [10, 40, 40], [10, 20]]
~~~

The other version looks for a change in the transformation of each successive value. You can use that to separate a list of names into groups by the first character:

~~~swift
let names = ["Cassie", "Chloe", "Jasmine", "Jordan", "Taylor"]
let chunks = names.chunked(on: \.first)
// [["Cassie", "Chloe"], ["Jasmine", "Jordan"], ["Taylor"]]
~~~

You can read more about `chunked` or any of the other components in the `Algorithms` package in the included guides:

- [Combinations](https://github.com/apple/swift-algorithms/blob/main/Guides/Combinations.md)
- [Permutations](https://github.com/apple/swift-algorithms/blob/main/Guides/Permutations.md)
- [Product](https://github.com/apple/swift-algorithms/blob/main/Guides/Product.md)
- [Chunked](https://github.com/apple/swift-algorithms/blob/main/Guides/Chunked.md)
- [Chain](https://github.com/apple/swift-algorithms/blob/main/Guides/Chain.md)
- [Cycle](https://github.com/apple/swift-algorithms/blob/main/Guides/Cycle.md)
- [Unique](https://github.com/apple/swift-algorithms/blob/main/Guides/Unique.md)
- [Random Sampling](https://github.com/apple/swift-algorithms/blob/main/Guides/RandomSampling.md)
- [Indexed](https://github.com/apple/swift-algorithms/blob/main/Guides/Indexed.md)
- [Partition](https://github.com/apple/swift-algorithms/blob/main/Guides/Partition.md)
- [Rotate](https://github.com/apple/swift-algorithms/blob/main/Guides/Rotate.md)

## Relation to the Swift Standard Library

It's our ambition for the standard library to include a rich, pragmatic set of generic algorithms. We think the `Algorithms` package can help realize this goal by serving as a low-friction venue to build out new families of related algorithms—giving us an opportunity to iteratively explore the problem space and learn how different algorithms connect and interact—before graduating them into the standard library.

Packages like Swift Algorithms (and [Swift Numerics](https://github.com/apple/swift-numerics)) complement the Swift Evolution process by providing a means to:

* Engage the community earlier in the development process
* Channel contributions towards active areas of focus
* Solicit feedback informed by real-world usage
* Coherently tackle large tracts of missing functionality

The `Algorithms` package is, in part, a response to the lengthy [SE-0270](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0270-rangeset-and-collection-operations.md) review and follow-up [Evolution process discussion](https://forums.swift.org/t/evolution-process-discussion/33272). With SE-0270, we faced a tension in providing a proposal small enough to make effective use of the Swift discussion forums, but large enough to motivate and ensure the consistency of the additions. Going forward, we plan to experiment with chopping up families of related algorithms into multiple, smaller Evolution proposals, using the presence of the `Algorithms` package to provide additional context.

However, just because an addition might be a good candidate for inclusion in the `Algorithms` package, it doesn't need to begin its life there. This is _not_ a change to the [Swift Evolution process](https://github.com/swiftlang/swift-evolution/blob/main/process.md). Well-supported pitches will continue to be considered, as always.

## Contribution Criteria

The immediate focus of the package is to incubate a pragmatic set of algorithms generalized over the `Sequence` and `Collection` family of protocols for eventual inclusion in the Swift standard library—the kind of functionality you might find in the Python [itertools](https://docs.python.org/3/library/itertools.html) module or the C++ [algorithms](https://en.cppreference.com/w/cpp/algorithm) library.

There are many interesting and useful abstractions that _don't_ meet this criteria. For example:

* Currency types (e.g. `Result`) and data structures (e.g. `OrderedDictionary`)
* One-off conveniences (e.g. `Dictionary.subscript(key:default:)`) that don't generalize over `Sequence` or `Collection`
* Classic algorithms (e.g. quicksort, merge sort, heapsort, insertion sort, etc.) with more pragmatic alternatives
* Algorithms over non-linear data structures

For any addition to the `Algorithms` package, an effort should be made to gather use cases and examine the way the topic has been explored in other languages and on other platforms. To evaluate its suitability, we should ask:

* Does it aid readability?
* Is it a common operation?
* Is it consistent with existing abstractions?
* Does it help avoid a correctness trap?
* Does it help avoid a performance trap?

... or conversely:

* Is it trivially composable? (e.g. `!isEmpty`)
* Might it encourage misuse?

## Get Involved!

Your experience, feedback, and contributions are greatly encouraged!

* Get started by trying out the [Swift Algorithms library on GitHub](https://github.com/apple/swift-algorithms),
* Discuss the library and get help in the [Swift Algorithms forum](https://forums.swift.org/c/related-projects/algorithms),
* [Open an issue](https://github.com/apple/swift-algorithms/issues) with problems you find or ideas you have for improvements,
* And as noted above, [pull requests are welcome](https://github.com/apple/swift-algorithms/pulls) for fixes or for new algorithms that meet the criteria of the package!

## Questions?

Please feel free to ask questions about this post in the [associated thread](https://forums.swift.org/t/introducing-swift-algorithms/40997) on the [Swift forums](https://forums.swift.org/).
