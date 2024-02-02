---
redirect_from:
  - "/server/"
  - "server/guides/"
  - "/server-apis/"
layout: page
title: Swift on Server
---

## Overview
[**Swift**](https://www.swift.org) is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns. Originally developed by Apple for building iOS, macOS, watchOS, and tvOS applications, Swift’s project goal is to create the best available language for uses ranging from systems programming to mobile and desktop apps, scaling up to highly distributed cloud services. Swift’s rich ecosystem of libraries allows services to be developed and deployed on Linux or MacOS. Most importantly, Swift is designed to make writing and maintaining correct programs simple for developers.

**Swift on Server** refers to the ability to use the Swift programming language for server-side development. To deploy Swift applications on the server, developers can make use of web frameworks such as [Vapor](https://vapor.codes/) and [Hummingbird](https://swiftpackageindex.com/hummingbird-project/hummingbird) which provide a variety of tools and libraries to streamline the development process. These frameworks handle important aspects like routing, database integration, and request handling, allowing developers to focus on building the business logic of their applications.

Various companies and organizations have adopted Vapor and Hummingbird's server-side Swift web framework to power their production services.

Swift on Server is also used to power high-performance production services like [Amazon Prime Video](https://www.amazon.com/b/?node=2858778011).

## Why Swift on Server?

Swift on Server provides developers with a modern, safe, and efficient option for writing server-side code. Swift combines the simplicity and readability of a high-level language with the performance and safety features of a compiled language, allowing developers to leverage their existing Swift skills to build complete end-to-end solutions using a single programming language.

In addition to the characteristics of Swift that make it an excellent general-purpose programming language, it also has unique characteristics that make it specifically suitable for server applications due to its:

- Performance
- Quick start-up time
- Expressiveness and safety
- Supported ecosystem

### Performance
Swift offers fast performance, a low memory footprint, and quick startup. Instead of tracing garbage collection, it uses [Automatic Reference Counting (ARC)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/) and ownership features, which allows precise control over resources.

Swift’s performance is comparable to languages like C++ and Objective-C, making it well-suited for building high-performance server applications. Thanks to the modern and efficient design of the language, Swift server-side applications can handle large-scale workloads with high performance and low resource consumption.

These characteristics make Swift ideal for using modern cloud platforms when maximizing resource utilization is needed.

### Quick start-up time
Swift-based applications quickly start since there are almost no warm-up operations, making Swift a fit for cloud services, which are often rescheduled onto new virtual machines (VMs) or containers to address platform formation changes.

- Quick boot times make Swift ideal for serverless applications such as [Google Cloud Functions](https://cloud.google.com/functions#) or [AWS Lambda](https://aws.amazon.com/lambda/) with negligible cold start times. Additionally, the quick start-up time and low memory advantages make Swift a good choice for micro services that scale in the cloud.
- Using Swift helps streamline continuous delivery pipelines, incurring less wait time for new versions of the service fleet to go online.
- Swift allows you to rapidly respond to the need to scale-up where services are able to dynamically adjust their number of instances.

### Expressive and safe
Swift enforces strong-typing, optionals, and memory safety features that help prevent common programming errors and improve code reliability. Swift on the server also benefits from the robust type-safety and memory-safety features of the language, which make it less prone to crashes and security vulnerabilities.

Swift provides [built-in support for concurrency](https://developer.apple.com/documentation/swift/concurrency/), allowing developers to write scalable and responsive server applications. Additionally, Swift’s concurrency model makes it a suitable choice for developing highly-concurrent server applications.

### Supported ecosystem
Apple develops the Swift language, development environment, and library ecosystem. The Swift on Server ecosystem is growing rapidly, with the availability of frameworks, libraries, and tools specifically designed for server-side development.

Overall, Swift on Server opens up new opportunities for developers to build fast, scalable, and secure backend services. 

Developers unfamiliar with Swift may want to [start with the basics](https://developer.apple.com/swift/).


## Development guides

The Swift Server Workgroup and Swift on Server community have developed a number of guides for using Swift on the server.
They are designed to help teams and individuals running Swift Server applications on Linux and to provide orientation for those who want to start with such development.

They focus on how to compile, test, deploy and debug such application and provides tips in those areas.

- [Setup and code editing](/documentation/server/guides/setup-and-ide-alternatives.html)
- [Building](/documentation/server/guides/building.html)
- [Testing](/documentation/server/guides/testing.html)
- [Debugging Memory leaks](/documentation/server/guides/memory-leaks-and-usage.html)
- [Performance troubleshooting and analysis](/documentation/server/guides/performance.html)
- [Optimizing allocations](/documentation/server/guides/allocations.html)
- [Debugging multithreading issues and memory checks](/documentation/server/guides/llvm-sanitizers.html)
- [Deployment](/documentation/server/guides/deployment.html)
- [Packaging](/documentation/server/guides/packaging.html)

Additionally, there are specific guides for library developers:

* [Log Levels](/documentation/server/guides/libraries/log-levels.html)
* [Adopting Swift Concurrency](/documentation/server/guides/libraries/concurrency-adoption-guidelines.html)

_These guides are community effort, and all are invited to share their tips and know-how by submitting pull requests to the [Swift.org site](https://github.com/apple/swift-org-website)_.

## Swift Server Workgroup

The Swift Server workgroup is a steering team that promotes the use of Swift for developing and deploying server applications.
The Swift Server workgroup:

* Defines and prioritize efforts that address the needs of the Swift server community
* Defines and run an incubation process for these efforts to reduce duplication of effort, increase compatibility and promote best practices
* Channels feedback for Swift language features needed by the server development community to the Swift Core Team

Read more about the workgroup and server incubator it runs [here](/sswg "Swift Server Workgroup").
