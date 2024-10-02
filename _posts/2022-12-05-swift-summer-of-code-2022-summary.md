---
layout: new-layouts/blog
published: true
date: 2022-12-05 10:00:00
title: Swift Summer of Code 2022 Summary
author: [ktoso]
---

Google Summer of Code (also known as [GSoC](https://summerofcode.withgoogle.com)) is a long-running mentorship program focused on introducing contributors to the world of open source development. This year marks the fifth time the Swift project has participated in GSoC.

During the 2022 edition of the program, we were lucky to work with five great contributors, all of which completed their assigned projects successfully. We would like to thank all the contributors – Amritpan, Felix, Fredrik, Kth and Sofía – for the time and passion they poured into their projects:

 * Bootstrapping SwiftSyntaxBuilder
 * Improving the debug output of the type inference algorithm
 * Interactive mode for ArgumentParser
 * Quick navigation in Swift-DocC websites
 * Kafka client package for Swift

To shine a light on their exceptional work and to inspire future participants, let's take a closer look at their accomplishments.

## Bootstrapping SwiftSyntaxBuilder

> Author: [Fredrik Wieczerkowski](https://github.com/fwcd) <br/>
> Mentor: [Alex Hoppen](https://github.com/ahoppen)

[The `SwiftSyntax` library](https://github.com/swiftlang/swift-syntax), which lets users represent, parse, and generate Swift source code using Swift, received major updates. The result builder-based `SwiftSyntaxBuilder` Domain-Specific Language (DSL) was improved and inconveniences in the API surface were fixed and thoroughly tested.

During this process, the templates that generated part of `SwiftSyntaxBuilder`'s sources were ported from [`gyb`](https://github.com/apple/swift/blob/main/utils/gyb.py) to type-safe Swift code based on `SwiftSyntaxBuilder`. In other words, the library now **uses itself** to generate its own code!

The result of this bootstrapping process is a more robust and ergonomic API for generating Swift code.

Here's an example of how Swift's expressiveness allows for builder closures which closely resemble the generated source code. For the following snippet of Swift code:

```swift
struct Point {
  let x: Int
  let y: Int
}
```

The corresponding `SwiftSyntaxBuilder` DSL would be:

```swift
StructDecl(identifier: "Point") {
  VariableDecl(.let, name: "x", type: "Int")
  VariableDecl(.let, name: "y", type: "Int")
}
```

For more information, check out [the project's writeup](https://gist.github.com/fwcd/b70cc91a27a4d00baf869785a3bf8a6d).

## Improving the debug output of the type inference algorithm

> Author: [Amritpan Kaur](https://github.com/amritpan)<br/>
> Mentor: [Pavel Yaskevich](https://github.com/xedin)

Swift’s type inference algorithm is at the heart of the Swift developer experience. It is the algorithm that allows us to write source code without always providing explicit type information to the compiler.

The algorithm is implemented via a constraint-based type checker that gathers available type context from the source code and attempts to solve for a concrete type for those parts of the source code that are missing type information, resulting in a valid, fully-typed Swift expression.

The type inference algorithm produces an output for debugging that is especially helpful when working with invalid expressions. However, this output has been difficult to understand and unwieldy:

```
$T0 [lvalue allowed] [noescape allowed] delayed bindings={} @ locator@0x1258ee200 [OverloadedDeclRef@/…]
$T1 [noescape allowed] delayed literal=3 bindings={} @ locator@0x1258f0ac0 [IntegerLiteral@/…]
$T2 [noescape allowed] delayed literal=3 bindings={} @ locator@0x1258f0b78 [StringLiteral@/…]
$T3 [noescape allowed] delayed bindings={} @ locator@0x1258f0c40 [Binary@/… -> function result]
```

This output has repetitive elements, seems disjointed, and does not show essential type and process details.

Over the last few months, debug output was reworked and reformatted the output to improve its readability. To make it easier to follow how an expression or subexpression is type checked, the output now closely tracks constraint solver steps by showing constraint simplification and solver scope changes. The output also explicitly states important type information in context to show how the constraint solver’s path changes type variable bindings and relationships. Additionally, a redesigned layout groups together type properties, simplification process, and nested constraint solver scopes for a more visually friendly format:

```
$T0 [allows bindings to: lvalue, noescape] [attributes: delayed] [with possible bindings: <empty>]) @ locator@0x13ca3e400 [OverloadedDeclRef@/…]
$T1 [allows bindings to: noescape] ($T1 [attributes: delayed, [literal: integer]] [with possible bindings: (default type of literal) Int]) @ locator@0x13ca3f398 [IntegerLiteral@/…]
$T2 [allows bindings to: noescape] [attributes: delayed, [literal: string]] [with possible bindings: (default type of literal) String]) @ locator@0x13ca42e68 [StringLiteral@/…]
$T3 [allows bindings to: noescape] [attributes: delayed] [with possible bindings: <empty>]) @ locator@0x13ca42f30 [Binary@/… -> function result]
```

Check out Amritpan's [forum post](https://forums.swift.org/t/improving-the-debug-output-of-the-type-inference-algorithm-an-update/60521) for more information.

## Interactive mode for ArgumentParser

> Author: [Kth](https://github.com/KeithBird)<br/>
> Mentor: [Nate Cook](https://github.com/natecook1000)

[swift-argument-parser](https://github.com/apple/swift-argument-parser) provides a fast and easy way to create high-quality, user-friendly command-line tools in Swift.

The upcoming interactive mode can prompt for missing inputs to help guide users through unfamiliar command line tools. The interactive mode continues ArgumentParser’s approach of providing a lightweight coding experience, building on the metadata tool authors already provide.

```bash
$ roll --help
USAGE: roll --times <n> --sides <m> [--verbose]

OPTIONS:
  --times <n>             Rolls the dice <n> times.
  --sides <m>             Rolls an <m>-sided dice.
  -v, --verbose           Show all roll results.
  -h, --help              Show help information.

$ roll --verbose --times 3
? Please enter 'sides': 6
Roll 1: 1
Roll 2: 6
Roll 3: 3
Total: 10
```

Interactive mode will be included in a future ArgumentParser release, but you can try it out now on the [`feature/interactive` branch](https://github.com/apple/swift-argument-parser/tree/feature/interactive).

## Quick navigation in Swift-DocC websites

> Author: [Sofía Rodríguez](https://github.com/sofiaromorales) <br/>
> Mentors: [Marina Aísa](https://github.com/marinaaisa), [Franklin Schrans](https://github.com/franklinsch), [Beatriz Magalhaes](https://github.com/biamx3)

This feature creates a fast and accessible way to navigate and discover symbols in Swift-DocC documentation websites, similar to Open Quickly in Xcode.

![Swift-DocC quick navigation](/assets/images/gsoc-2022/quick-navigation.png)

### Key features

* **Fuzzy search** - Find symbol names through an fuzzy match of search terms.
* **Symbol ranking** - Results are sorted so the most relevant ones are at the top. This is done using similarity metrics such as the length difference between the input and the match, the length of the symbol name, and how far from the beginning of the string the match occurs.
* **Keyboard navigation** - This feature is fully accessible via keyboard shortcuts, making it easy to perform queries even when the navigation sidebar is collapsed.

Check out Sofía’s [forum post](https://forums.swift.org/t/pitch-quick-navigation-in-docc-render/59550/) for more information.

## Kafka client package for Swift

> Author: [Felix Schlegel](https://github.com/felixschlegel)<br/>
> Mentor: [Franz Busch](https://github.com/FranzBusch)

[SwiftKafka](https://github.com/swift-server/swift-kafka-gsoc) is a new Swift package that provides a convenient way to communicate with [Apache Kafka](https://kafka.apache.org/) servers. During the package development, the main goal was to create an API that leverages [Swift's new concurrency features](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html). Under the hood, this package uses the [librdkafka](http://github.com/edenhill/librdkafka) C library, wrapping the unsafe and blocking APIs into safer, more ergonomic Swift APIs.

Here are examples showing how to use the new package to produce and consume messages from a Kafka server:

**Producer API**

The `sendAsync(_:)` method of `KafkaProducer` returns a `message-id` that can be used to identify the corresponding acknowledgement. Acknowledgements are received through the `acknowledgements` `AsyncSequence`. Each acknowledgement indicates that producing a message was either successful or returns an error.

```swift
let producer = try await KafkaProducer(
    config: .init(),
    logger: logger
)
let messageID = try await producer.sendAsync(
     KafkaProducerMessage(topic: "topic-name", value: "Hello, World!")
)
for await acknowledgement in producer.acknowledgements {
    /// ...
}
```

**Consumer API**

After initializing the `KafkaConsumer` with a topic-partition pair, messages can be consumed using the `messages` `AsyncSequence`.

```swift
let consumer = try KafkaConsumer(
    topic: "topic-name",
    partition: KafkaPartition(rawValue: 0),
    config: .init(),
    logger: logger
)
for await messageResult in consumer.messages {
    // ...
}
```


## Wrap up

For more information, as well as previous year’s projects, check out:

- Summer of Code project sites: [2022](https://summerofcode.withgoogle.com/programs/2022/organizations/swift), [2021](https://summerofcode.withgoogle.com/archive/2021/organizations/4908645044715520), [2020](https://summerofcode.withgoogle.com/archive/2020/organizations/4543471290941440), [2019](https://summerofcode.withgoogle.com/archive/2019/organizations/6407128493850624), [2018](https://summerofcode.withgoogle.com/archive/2018/organizations/5146674678726656)

- Swift forum tags: [gsoc-2022](https://forums.swift.org/tag/gsoc-2022), [gsoc-2021](https://forums.swift.org/tag/gsoc-2021), [gsoc-2020](https://forums.swift.org/tag/gsoc-2020), [gsoc-2019](https://forums.swift.org/tag/gsoc-2019), [gsoc-2018](https://forums.swift.org/tag/gsoc-2018)
