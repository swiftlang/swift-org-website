---
layout: new-layouts/post
published: true
date: 2025-05-05 11:55:00
title: "ICYMI: Memory Safety, Ecosystem Talks, and Java Interoperability at FOSDEM 2025"
author: [parispittman]
---

The Swift community had a strong presence at FOSDEM 2025, the world’s largest independently run open source conference, held every year in Brussels, Belgium. FOSDEM highlighted a range of Swift-related talks related to memory safety, a broad ecosystem around Swift including using it to develop web services and embedded projects, and new areas of the project including Java interoperability.

In case you missed it, here are a few highlights from the event:

## Memory Safety in Swift

The main track of the conference featured a talk presented by Doug Gregor on memory safety: [“Incremental Memory Safety in an Established Software Stack: Lessons Learned from Swift.”](https://fosdem.org/2025/schedule/event/fosdem-2025-6176-incremental-memory-safety-in-an-established-software-stack-lessons-learned-from-swift/)

![Slide from a presentation at FOSDEM 2025 titled 'Incremental Memory Safety in an Established Software Stack: Lessons Learned from Swift' by Doug Gregor.](/assets/images/fosdem-2025-memory-and-java-blog/fosdem2025-1.png)

If you’re interested in learning more about Swift’s memory safe features, this talk is a great place to start; it walks through the different dimensions of memory safety in Swift, the language’s safe interoperability with C(++), and reflects on lessons learned for both programming language design and adopting Swift in an established software codebase.

To learn more about memory safety in Swift, see the [Swift documentation page on memory safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/), as well as the [vision document on memory safety](https://github.com/swiftlang/swift-evolution/blob/main/visions/memory-safety.md).

## Swift DevRoom

FOSDEM is primarily organized into DevRooms, volunteer-organized conference tracks around technical communities and topics. This year Swift celebrated its inaugural DevRoom organized by a local community member, Steven Van Impe, with contributions from a large group of volunteers including proposal reviewers, speakers, and day-of-operations support. 

Swift’s first Swift DevRoom was a hit! 🎉 The room was packed with 12 talks, covering a wide range of topics and demos from the Swift ecosystem: talks related to running Swift on Linux, showcasing various IDEs like VS Code, and a whole hour dedicated to embedded content. A few talks to highlight from the event:

* [Building a Ferrofluidic Music Visualizer with Embedded Swift](https://fosdem.org/2025/schedule/event/fosdem-2025-5284-building-a-ferrofluidic-music-visualizer-with-embedded-swift/)
* [Building container images with swift-container-plugin](https://fosdem.org/2025/schedule/event/fosdem-2025-5116-how-to-put-swift-in-a-box-building-container-images-with-swift-container-plugin/)
* [Distributed Tracing in Server-Side Swift](https://fosdem.org/2025/schedule/event/fosdem-2025-5218-distributed-tracing-in-server-side-swift/)

Check out the [complete lineup](https://fosdem.org/2025/schedule/track/swift/) to learn more!

## Java Interoperability

In the Free Java DevRoom, Konrad 'ktoso' Malawski presented on Java interoperability in Swift: [“Foreign Function and Memory APIs and Swift/Java interoperability.“](https://fosdem.org/2025/schedule/event/fosdem-2025-4886-foreign-function-and-memory-apis-and-swift-java-interoperability/)

![Slide from a presentation at FOSDEM 2025 titled 'Foreign Function and Memory APIs and Swift/Java interoperability' by Konrad 'ktoso' Malawski](/assets/images/fosdem-2025-memory-and-java-blog/fosdem2025-2.png)

Konrad’s talk was a technical deep dive into the [Java interoperability effort](https://forums.swift.org/t/java-interoperability-effort/74969) that launched in 2024, demonstrating the bridges and bindings needed to integrate systems written in Swift and Java while still maintaining great performance. Catch up on this talk to see how you can leverage existing libraries without complete rewrites.

Work in early development has been [released on GitHub](https://github.com/swiftlang/swift-java) for feedback and contributions, and your feedback is welcome on the [forums](https://forums.swift.org/c/development/java-interoperability/109).
