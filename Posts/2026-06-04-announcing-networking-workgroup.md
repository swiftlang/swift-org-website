---
layout: new-layouts/post
published: true
date: 2026-06-04 10:00:00
title: "Announcing the Networking Workgroup"
author: [ecosystem-steering-group, FranzBusch]
category: "Community"
description: "The Swift Ecosystem Steering Group is excited to announce the creation of the Networking workgroup! The primary goal is to guide the evolution of networking libraries, protocols, and APIs in the Swift ecosystem."
---

The Swift Ecosystem Steering Group is excited to announce the creation of the [Networking workgroup](/networking-workgroup/)! Workgroups are community-led efforts, formally recognized by the project, to advance key areas of Swift.

The primary goal is to guide the evolution of networking libraries, protocols, and APIs in the Swift ecosystem, making networking in Swift excellent everywhere: high-level and safe by default, modular and interoperable, cross-platform, and observable.

Networking is one of the most common entry points for Swift developers, and the ecosystem has matured significantly over the years. Foundational libraries like [SwiftNIO](https://github.com/apple/swift-nio), [AsyncHTTPClient](https://github.com/swift-server/async-http-client), and [swift-http-types](https://github.com/apple/swift-http-types), alongside platform stacks such as URLSession and Network.framework, power networking across apps, servers, and beyond. The workgroup will build upon these efforts and pursue the long-term directions outlined in the [Networking vision](https://github.com/swiftlang/swift-evolution/blob/main/visions/networking.md), focusing on work to:

* Define a unified networking stack with a coherent layered architecture, from shared I/O primitives at the foundation, through common protocol implementations, to ergonomic client and server APIs at the top.
* Define currency types that let libraries interoperate without coupling to specific implementations, such as IP addresses, hostnames, ports, and HTTP requests and responses.
* Evolve HTTP APIs by designing and guiding a modern, unified HTTP client and server API built on structured concurrency.
* Guide the evolution of shared protocol implementations (TLS, HTTP/1.1, HTTP/2, HTTP/3, QUIC, WebSockets) so improvements benefit the entire ecosystem rather than being duplicated across libraries.

The new Networking workgroup joins a growing list of Swift workgroups, including the [Android workgroup](/android-workgroup/), [Windows workgroup](/windows-workgroup/), and [Build and Packaging workgroup](/build-and-packaging-workgroup/), which were all added in the past year.

To learn more and get involved:

* [Discuss this announcement](https://forums.swift.org/t/announcing-the-networking-workgroup/87116) on the forums, and share ideas in the [Networking](https://forums.swift.org/c/development/networking/129) category.
* Learn more about the Networking workgroup by reading its [charter](/networking-workgroup/).
* The workgroup meets biweekly. A regular meeting time is being finalized and will be announced on the forums ahead of the first public meeting.
    * Workgroup membership and meetings are open to those who wish to participate, and contributors are welcome!
    * To receive an invite, send a message to [@networking-workgroup](https://forums.swift.org/new-message?groupname=networking-workgroup) on the Swift forums.
