---
redirect_from:
  - "/server/"
  - "server/guides/"
  - "/server-apis/"
layout: new-layouts/base
title: Swift on Server
---

## Overview
[**Swift**](https://www.swift.org) is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns. Originally developed by Apple for building iOS, macOS, watchOS, and tvOS applications, Swift’s project goal is to create the best available language for uses ranging from systems programming to mobile and desktop apps, scaling up to highly distributed cloud services. Swift’s rich ecosystem of libraries allows services to be developed and deployed on Linux or macOS. Most importantly, Swift is designed to make writing and maintaining correct programs simple for developers.

**Swift on Server** refers to the ability to use the Swift programming language for server-side development. To deploy Swift applications on the server, developers can make use of web frameworks such as [Vapor](https://vapor.codes/) and [Hummingbird](https://swiftpackageindex.com/hummingbird-project/hummingbird) which provide a variety of tools and libraries to streamline the development process. These frameworks handle important aspects like routing, database integration, and request handling, allowing developers to focus on building the business logic of their applications.

Various companies and organizations have adopted Vapor and Hummingbird to power their production services.

## Why Swift on Server?

Swift on Server provides developers with a modern, safe, and efficient option for writing server-side code. Swift combines the simplicity and readability of a high-level language with the performance and safety features of a compiled language, allowing developers to leverage their existing Swift skills to build complete end-to-end solutions using a single programming language.

In addition to the characteristics of Swift that make it an excellent general-purpose programming language, it also has unique characteristics that make it specifically suitable for server applications due to its:

- Performance.
- Quick start-up time.
- Expressiveness and safety.
- Supported ecosystem.

### Performance
Swift offers fast performance and a low memory footprint. Instead of tracing garbage collection, it uses [Automatic Reference Counting (ARC)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/) and ownership features, which allows precise control over resources. Swift’s use of ARC and its lack of just-in-time (JIT) compilation provides an edge in the cloud services space.

While tracing garbage collection technologies have improved, they still compete with the application for resources, triggering non-deterministic performance. Debugging non-deterministic performance and language-induced non-deterministic performance can confuse and mask application-level performance issues that can otherwise be addressed.

One of the main goals of a modern cloud platform is to maximize resource utilization by efficiently packing services into a single machine. Cloud services built with Swift have a small memory footprint (measured in MB), especially compared to other popular server languages with automatic memory management. Services built with Swift are also CPU-efficient, given the language’s focus on performance.

While Java, PHP, Python, and JavaScript have their strengths and use cases, Swift offers several advantages over other programming languages. For example, Swift’s performance is comparable to languages like C and C++, making it well-suited for building high-performance server applications. Thanks to the progressive and efficient design of the language, Swift server-side applications can handle large-scale workloads with high performance and low resource consumption.

These characteristics make Swift ideal for use in modern cloud platforms when maximizing resource utilization is needed.

### Quick start-up time
Swift-based applications quickly start since there are almost no warm-up operations, making Swift an ideal fit for cloud services, which are often rescheduled onto new virtual machines (VMs) or containers to address platform formation changes. Other considerations include:

- Quick boot times make Swift ideal for serverless applications such as [Google Cloud Functions](https://cloud.google.com/functions#) or [AWS Lambda](https://aws.amazon.com/lambda/) with negligible cold start times. Additionally, the quick start-up time and low memory advantages make Swift a good choice for microservices that scale in the cloud.
- Using Swift helps streamline continuous delivery pipelines, incurring less wait time for new versions of the service fleet to go online.
- Swift allows you to rapidly respond to the need to scale up where services can dynamically adjust their number of instances.


### Expressive and safe
Swift enforces type-safety, optionals, and memory safety features that help prevent common programming errors and improve code reliability. Swift on Server benefits from these robust language features, making it less prone to crashes and security vulnerabilities.

Swift provides [built-in support for concurrency](https://developer.apple.com/documentation/swift/concurrency/), allowing developers to write scalable and responsive server applications. Swift’s concurrency model makes it suitable for developing highly concurrent server applications.

Swift's concurrency model introduces new language features and constructs to make it easier and safer to write concurrent code. The **Sendable** attribute is used to annotate types that are known to be safe to pass between tasks. By designating a type as Sendable, Swift ensures that it is safe to share and access that type across multiple concurrent tasks without causing data corruption or synchronization issues. This helps to prevent common concurrency problems, such as race conditions or access to stale data.

The Sendable attribute is particularly useful in the context of Swift on the server, where concurrency and parallelism are frequently utilized. It provides a way to declare and enforce the safety of data accessed by multiple tasks simultaneously, helping to avoid data corruption and maintain data integrity.

### Supported ecosystem
The Swift ecosystem contains many useful libraries and tools specifically designed for server-side development.

Overall, Swift on Server opens up new opportunities for developers to build fast, scalable, and secure backend services. Swift's combination of performance, readability, interoperability, safety, and modern language features make it a compelling choice for many developers.

### Development guides

The Swift Server Workgroup and Swift on Server community have developed a number of [guides](/documentation/server/guides/) for using Swift on the server. They are designed to help teams and individuals running Swift Server applications on Linux and to provide orientation for those who want to start with such development.


## Swift Server Workgroup

The Swift Server workgroup is a steering team that promotes the use of Swift for developing and deploying server applications.
The workgroup:

* Defines and prioritizes efforts that address the needs of the Swift server community.
* Defines and runs an incubation process for these efforts to reduce duplication of effort, increase compatibility, and promote best practices.
* Channels feedback for Swift language features needed by the server development community to the Swift Core Team.

Read more about the [workgroup](/sswg "Swift Server Workgroup") and server incubator it runs [here](/sswg/incubation-process.html "SSWG Incubation Process").

