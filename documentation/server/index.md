---
redirect_from:
  - "/server/"
  - "server/guides/"
  - "/server-apis/"
layout: page
title: 在服务端使用 Swift
---

## 概述
[**Swift**](https://www.swift.org) 是一种通用编程语言，使用现代化的方法构建，注重安全性、性能和软件设计模式。最初由苹果公司开发，用于构建 iOS、macOS、watchOS 和 tvOS 应用程序，Swift 的项目目标是创造从系统编程到移动和桌面应用程序、再到高度分布式的云服务的最佳可用语言。Swift 丰富的生态系统允许在 Linux 或 macOS 上开发和部署服务。最重要的是，Swift 旨在使开发人员编写和维护正确的程序变得简单。

**Swift on Server**  指的是使用 Swift 编程语言进行服务端开发的能力。为了在服务器上部署 Swift 应用程序，开发人员可以利用诸如 [Vapor](https://vapor.codes/) 和 [Hummingbird](https://swiftpackageindex.com/hummingbird-project/hummingbird) 这样的 Web 框架，它们提供了各种工具和库来简化开发过程。这些框架处理如路由、数据库集成和请求处理等重要逻辑，可以让开发人员专注于构建他们应用程序的业务逻辑。

已经有很多公司和组织使用 Vapor 和 Hummingbird 来支持它们生产环境的服务。

## 为什么选择在服务端使用 Swift?

Swift on Server 为开发者提供了一种现代化、安全且高效的服务端代码编写选项。Swift 结合了高级语言的简单性和可读性以及编译语言的性能和安全特性，让开发者能够利用现有的 Swift 技能构建使用单一编程语言的完整端到端解决方案。

除了作为一种出色的通用编程语言的特性外，Swift 还具有特别适合服务端应用程序的独有特性，这些特性包括：

- 性能。
- 启动速度快。
- 富有表现力且安全。
- 生态系统的支持。

### 性能
Swift 提供快速的性能和低内存占用。Swift 使用[自动引用计数 (ARC)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/) 和所有权特性，而不是追踪式垃圾收集，这允许对资源进行精确控制。Swift 使用 ARC 和它不使用实时编译 (JIT) 的特性，在云服务领域提供了优势。

虽然追踪式垃圾收集技术已经得到改进，但它们仍然与应用程序争夺资源，引发非确定性的性能表现。调试非确定性性能和语言引起的非确定性性能可能会混淆和掩盖本来可以解决的应用程序级性能问题。

现代云平台的主要目标之一是通过将服务高效地打包到一台机器中来最大限度地提高资源利用率。与其他流行的具有自动内存管理的服务端语言相比，使用 Swift 构建的云服务具有更小的内存占用（以 MB 为单位）。鉴于 Swift 语言注重性能，使用 Swift 构建的服务在 CPU 效率方面也很高。

虽然 Java、PHP、Python 和 JavaScript 具有它们的优势和使用场景，但 Swift 与其他编程语言相比具有多项优势。例如，Swift 的性能与 C 和 C++ 这样的语言相媲美，使其非常适合构建高性能的服务端应用程序。由于语言的进步和高效的设计，Swift 服务端应用程序可以在处理大规模工作负载时保持高性能和低资源消耗。

这些特性使 Swift 在需要最大化资源利用时非常适合用于现代云平台。

### 启动速度快

由于 Swift 几乎没有预热操作，因此基于 Swift 的应用程序可以快速启动。云服务通常需要经常被重新部署到新的虚拟机 (VM) 或容器上，以应对平台形态的变化，在这种情况下 Swift 是理想选择。还有其他考虑因素包括：

- 启动速度快使 Swift 非常适合用于无服务应用程序，例如 [Google Cloud Functions](https://cloud.google.com/functions#) 或 [AWS Lambda](https://aws.amazon.com/lambda/) 冷启动时间几乎可以忽略不计。此外，快速的启动速度和低内存优势使 Swift 成为云端微服务的不错选择。
- 使用 Swift 有助于简化持续交付管道，从而减少新版本服务队列上线的等待时间。
- Swift 允许您快速响应扩展需求，服务可以动态调整其实例数量。

### 富有表现力且安全
Swift 强制实施类型安全、可选值和内存安全特性，帮助防止常见的编程错误并提高代码可靠性。Swift on Server 受益于这些强大的语言特性，使其不太容易出现崩溃和安全漏洞。

Swift 提供了[内置的并发支持](https://developer.apple.com/documentation/swift/concurrency/)，允许开发人员编写可扩展且响应迅速的服务端应用程序。Swift 的并发模型使其适合开发高并发的服务端应用程序。

Swift 的并发模型引入了新的语言特性和结构，使编写并发代码更容易和更安全。**Sendable** 特性用于声明已知可以在任务之间安全传递的类型。通过将类型指定为 Sendable，Swift 确保在多个并发任务之间共享和访问该类型是安全的，不会引起数据损坏或同步问题。这有助于防止常见的并发问题，例如竞态条件或访问过时数据。

Sendable 特性在 Swift 服务端上下文中特别有用，因为经常使用并发和并行。它提供了一种声明和实施多个任务同时访问的数据安全性的方法，有助于避免数据损坏并保持数据完整性。

### 生态系统的支持

Swift 的生态系统包含许多专门为服务端开发设计的有用的库和工具。

总体而言，Swift on Server 为开发者构建快速、可扩展且安全的后端服务提供了新的方式。Swift 结合了性能、可读性、互操作性、安全性以及现代语言特性，使其成为许多开发人员的不二之选。

### 开发指南

Swift Server 工作组和 Swift on Server 社区开发了许多[指南](/documentation/server/guides/)，用于在服务端使用 Swift。它们旨在帮助团队和个人在 Linux 上运行 Swift Server 应用程序，并为希望进行此类开发的人提供指导。

## Swift Server 工作组

Swift Server 工作组是一个指导团队，旨在促进使用 Swift 来开发和部署服务端应用程序。

工作组：

* 定义满足 Swift 服务端社区需求的工作并确定其优先级
* 为这些工作定义并运行孵化过程，以减少重复工作、提高兼容性并推广最佳实践。
* 将服务端开发社区对 Swift 语言特性需求的反馈传递给 Swift 核心团队。

了解更多有关[工作组](/sswg "Swift Server Workgroup")及其运行的服务端孵化器的更多信息[请到这里](/sswg/incubation-process.html "SSWG Incubation Process")。

