---
layout: post
published: false
date: 2022-11-20 10:00:00
title: Swift Summer of Code 2022 Summary
author: [ktoso]
---

[Google Summer of Code](https://summerofcode.withgoogle.com) is long running a mentoring program focused on introducing new contributors to the wild world of open source development, and year marks the 5th time the Swift project has participated in it. Each year our GSoC mentors work with Summer of Code projects to improve Swift in various aspects of the project, be it in libraries, the standard library or even the compiler itself.

This year we were lucky to work with 5 great contributors, all of which completed their assigned projects successfully. We would like to thank all contributors–Amritpan, Felix, Fredrik, Kth and Sofía–for their time and passion poured into these projects! In addition to that, this year we also decided to post short summaries of the projects on the blog, so what follows is short descriptions of the results of this year’s Summer of Code projects.


>For more information, project summaries, as well as previous year’s projects, you can refer to the following: 
- Summer of Code project sites: ([2022](https://summerofcode.withgoogle.com/programs/2022/organizations/swift)) [2021](https://summerofcode.withgoogle.com/archive/2021/organizations/4908645044715520), [2020](https://summerofcode.withgoogle.com/archive/2020/organizations/4543471290941440), [2019](https://summerofcode.withgoogle.com/archive/2019/organizations/6407128493850624), [2018](https://summerofcode.withgoogle.com/archive/2018/organizations/5146674678726656) 
- as well as the corresponding ([gsoc-2022](https://forums.swift.org/tag/gsoc-2022)), [gsoc-2021](https://forums.swift.org/tag/gsoc-2021), [gsoc-2020](https://forums.swift.org/tag/gsoc-2020), [gsoc-2019](https://forums.swift.org/tag/gsoc-2019), [gsoc-2018](https://forums.swift.org/tag/gsoc-2018) tags on the Swift Forums.


Once again, thank you to all the mentors, participants, and a warm “we look forward to working with you in the future” to any future participants!

## Bootstrapping SwiftSyntaxBuilder

> Author: Fredrik Wieczerkowski <br/>
> Mentor: Alex Hoppen

[The `SwiftSyntax` library](https://github.com/apple/swift-syntax), which lets users represent, parse and generate Swift source code in Swift, received major updates. In particular, the result builder-based `SwiftSyntaxBuilder` Domain-Specific Language (DSL) was improved, inconveniences in the (quite large) API surface fixed and thoroughly tested. During this process the previously [`gyb`](https://github.com/apple/swift/blob/main/utils/gyb.py)-based templates that generated part of `SwiftSyntaxBuilder`'s sources were ported to type-safe Swift code based on `SwiftSyntaxBuilder`. In other words: **The library now uses itself to generate its own code**! 

The result of this bootstrapping process is a robust and ergonomic API for generating Swift code that has proven to be useful in the context of a medium-sized codebase. A specific example of how `SwiftSyntaxBuilder` uses Swift's expressiveness to express Swift source code are trailing builder closures, which closely resemble the generated source code. For example, consider the following snippet of Swift code:

```swift
struct Point {
  let x: Int
  let y: Int
}
```

In `SwiftSyntaxBuilder` this would be expressed as:

```swift
StructDecl(identifier: "Point") {
  VariableDecl(.let, name: "x", type: "Int")
  VariableDecl(.let, name: "y", type: "Int")
}
```

For more information, check out [the project's writeup](https://gist.github.com/fwcd/b70cc91a27a4d00baf869785a3bf8a6d).

## Improving the Debug Output Of The Type Inference Algorithm

> Author: Amritpan Kaur <br/>
> Mentor: Pavel Yaskevich

Swift’s type inference algorithm allows us to write source code without explicit type notations. It is implemented via a constraint-based type checker that gathers available type context from the source code and attempts to solve for a concrete type for any parts of the source code that is missing type information to produce a final, and hopefully valid, fully-typed Swift expression. The type inference algorithm also produces a debug output that shows this process and is especially helpful for debugging invalid expressions. However, this output has been difficult to understand and unwieldy. This summer, I worked with my mentor, Pavel Yaskevich, to make this output more human-friendly and welcoming to compiler developers of all experience levels.

The output in its previous form had repetitive elements, seemed disjointed, and did not show essential type and process details. Over the last few months, we reworked and reformatted the output to improve its readability. To make it easier to follow how an expression or subexpression is type checked, the output now closely tracks constraint solver steps by showing constraint simplification and solver scope changes. The output also explicitly states important type information in context to show how the constraint solver’s path changes type variable bindings and relationships. Additionally, a redesigned layout groups together type properties, simplification process, and nested constraint solver scopes for a more visually friendly format.

[You can read more about the specifics of the new type inference algorithm debug output here](https://forums.swift.org/t/improving-the-debug-output-of-the-type-inference-algorithm-an-update/60521).

I hope the Swift community finds these changes to be an improvement to the type inference algorithm debug output and that the new output is more accessible for other compiler beginners!

## Interactive mode for swift CLI tool ArgumentParser

> Author: Kth <br/>
> Mentor: Nate Cook

[swift-argument-parser](https://github.com/apple/swift-argument-parser) provides a straightforward way to declare command-line interfaces in Swift, with the dual goals of making it (1) fast and easy to create (2) high-quality, user-friendly CLI tools.

The GSoC project this year, was about kicking off work on the upcoming interactive mode which advances these goals by prompting for missing required inputs, guiding users through unfamiliar command line tools. The interactive mode continues ArgumentParser’s approach of providing a a lightweight coding experience, building on the metadata CLI tool authors already provide. 

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

The interactive mode will be included in a future ArgumentParser release — you can try it out right now on the [`feature/interactive` branch](https://github.com/apple/swift-argument-parser/tree/feature/interactive). We hope you like it!


## Quick navigation in DocC websites

> Author: Sofía Rodríguez <br/>
> Mentors: Marina Aísa, Franklin Schrans, Beatriz Magalhaes

This feature creates an accessible, easy and fast way to navigate and discover symbols in DocC documentation websites. Quick navigation aims to bring a similar experience to what you achieve using Open Quickly in Xcode and other search tools in IDEs or web-based documentation.

![image]({{ site.url }}/assets/images/gsoc-2022/quick-navigation.png)


### 
Key functionalities

* **Fuzzy search** - Quick navigation allows approximate match between the user input and the symbol names, returning results relevant to the user.
* **Symbols ranking** - Results are sorted in a way that the most relevant ones are at the top of the list. This is done using similarity metrics, such as the length difference between the input and the match, the length of the symbol name, and how far from the beginning of the string the match occurs.
* **Keyboard navigation** - This feature is fully accessible via keyboard shortcuts, making it easy to perform queries even when the navigation sidebar is collapsed.

[You can read more about this feature here.](https://forums.swift.org/t/pitch-quick-navigation-in-docc-render/59550/)

## Kafka Client Package for Swift

> Author: Felix Schlegel <br/>
> Mentor: Franz Busch

[SwiftKafka](https://github.com/swift-server/swift-kafka-gsoc) is a new Swift package that provides a convenient way to communicate with [Apache Kafka](https://kafka.apache.org/) servers. During the package development, the main goal was to create an API that leverages [Swift's new concurrency features](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html). Under the hood, this package uses the [librdkafka](http://github.com/edenhill/librdkafka) C library and we made sure during the development to wrap the provided unsafe and blocking APIs into safe and nice to use Swift APIs.
The examples below show how to use our new package to produce messages to and consume messages from a Kafka server.

### **Producer API**

The `sendAsync(_:)` method of `KafkaProducer` returns a message-id that can later be used to identify the corresponding acknowledgement. Acknowledgements are received through the `acknowledgements` `AsyncSequence`. Each acknowledgement indicates that producing a message was successful or returns an error.

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

### **Consumer API**

After initializing the `KafkaConsumer` with a topic-partition pair to read from, messages can be consumed using the `messages` `AsyncSequence`.


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

