---
layout: new-layouts/post
published: true
date: 2026-03-05 10:00:00
title: Building a Privacy-First Analytics Business based entirely on Swift
author: [danieljilg]
category: 'Adopters'
---

TelemetryDeck is an [app analytics service](https://telemetrydeck.com) specifically for developers, designed to manage usage analytics that are anonymized, privacy-focused, and really easy to use. TelemetryDeck is touching the lives of over 16 million people every month, helping thousands of app publishers improve their products, and we're doing it all with a Swift-based infrastructure.

The decision to go with Swift brought a lot of unexpected advantages for us. We come from a world of iOS in the frontend, Python, Node, or Ruby in the backend for server-based applications. Compared to these languages and frameworks, Swift is just as easy to use, and its compiled nature allows us to catch a lot of possible errors at compile time instead of runtime, making it ideal for a hardened, high-performance web service.

Let me share our journey and history with you.

## Adopting Swift for backend services

TelemetryDeck is built on [Vapor](https://vapor.codes/), a web framework written in Swift, for building scalable APIs and services.

Similar to [other Vapor-based projects like Things](https://www.swift.org/blog/how-swifts-server-support-powers-things-cloud/), TelemetryDeck runs on containers hosted in Kubernetes. Our metadata lives in Postgres, and our analytics data is stored in Apache Druid. We use Swift-native connectors to access APIs for these services. Some of those come from the Swift community, others we've written ourselves and are giving back to the Open-Source ecosystem.

In the very beginning, when TelemetryDeck was just a little explorative hobby project, I wanted to go with Swift on the Server simply because I love Swift, and I'm pretty decent at it. Vapor was new, and I figured, let's try this out and learn a new way to apply and combine my skills.

In the end this decision turned out to be exactly the right one and resulted in a lean architecture that is highly performant, stable, and allows us to develop and iterate quickly.

Swift's performance characteristics are remarkable. Especially in multithreading, where Python struggles with the Global Interpreter Lock and true parallelism, Swift excels. Our infrastructure handles 16 million users per month with resources that would buckle other architectures. The efficiency gains aren't just theoretical—they translate directly to lower infrastructure costs and a better user experience.

## Swift's Codable protocol

In an API-based application, you spend an enormous amount of time encoding and decoding JSON. Swift's Codable protocol turns what's traditionally error-prone boilerplate into straightforward, type-safe operations. When a request comes in with malformed data, Swift's type system rejects it immediately with no manual validation required. This isn't just convenient; it's a security feature that prevents entire classes of vulnerabilities.

```swift
struct Notebook: Codable, Content {
    let appID: UUID
    let var snapshots: [NotebookSnapshot]
    let createdAt: Date
    let title: String
}
```

With just these few lines, we get parsing, validation, and type safety.

Just like the postal system – which only accepts letters addressed in a specific format – the API endpoint described in the above bit of code will reject any data that doesn't fit into this Codable.

We don't have to check for types, additional properties, or JSON parseability, something that lets us trust our APIs more when developing and sleep easy after deploying. "Just lick the stamp and send it", as an Australian friend of mine once encouraged me.

## Sharing Data Transfer Objects between Client and Server

For a long time, TelemetryDeck was offering a SwiftUI-based desktop application for interacting with analytics data, displaying dashboards, and exploring correlations. This meant we could use the same structs for encoding data on the server and decoding it on the client – these are called Data Transfer Objects or DTOs. We kept a separate package "SwiftDTOs" that was shared between both clients and the server code.

However, we ran into trouble when we updated our APIs to new versions with slightly different inputs and outputs. We always have the API version in our paths, which helps us to continuously develop them while keeping compatibility with clients that take a while to update, but this structure made it hard to keep updating the Data Transfer Objects quickly because it unnecessarily coupled our API versions together in an uncomfortable way.

For our newest API version, we abandoned this approach. DTOs now live directly in their controllers as inline structs:

```swift
extension V3QueryController {
    struct QueryRequest: Codable {
        let query: QueryDefinition
        let timeRange: TimeRange
    }

    struct QueryResponse: Codable {
        let results: [QueryResult]
        let metadata: ResponseMetadata
    }
}
```

The lesson? Keep your DTOs close to your controllers. It's simpler, more maintainable, and makes changes easier. Sometimes the obvious solution is the right one.

## Developer experience matters

One underappreciated aspect of Swift on the server is the development experience. We can develop in Xcode, our favorite IDE, with full debugging capabilities.

Under the hood, a Swift Vapor project is just a Swift Package with some dependencies. You open it in Xcode, you press Cmd+U to run the tests, you run it and set breakpoints and step through them when you're following a bug through the stack.

Web API services usually have a database attached to them, so when we're developing, we can either run PostgreSQL on our machines right next to the code, or we can ask Swift Vapor's database layer (Fluent) to use a different database for development, such as a local SQLite file.

The end result is a very comfortable experience that allows us to use an IDE specifically built for Swift development, without having to play around with containers or terminal commands, although that is also a possibility of course.

This flexibility matters when you're building a business. We can onboard new developers quickly because the tooling is familiar. We can iterate rapidly because the feedback loop is tight. And we can maintain high code quality because Swift's type system catches errors at compile time, not in production.

## We win and lose together

We love the open source ecosystem around Swift on the server. There are Swift packages for external services like payment providers and transactional emails. There are tools like Imperial for Single Sign-On, and Swift-Crypto for good cryptography.

Whenever a piece of the puzzle is missing, we try to give back as much as possible. That is partly because the Swift developer community is fantastic in coming up with SDKs for various services, and we try to contribute to existing projects like StripeKit or even release our own new SDKs like BrevoKit.

## Lessons learned

Building a production service teaches you things that tutorials never will. Here are some hard-won lessons from our journey:

**Use the Swift Package system.** A package is a fantastic way to structure and isolate code. Since our services are packages anyway, it's natural to further subdivide them where it makes sense.

**Your Swift Vapor service is almost never the bottleneck.** Although profiling Swift code is easy, most slowdowns in a web service will arise from a combination of database, storage, and sheer user numbers. You'll migrate the way you store and access data frequently as you build experience.

**Embrace Vapor's built-in features.** Queues and jobs, migrations, and middleware. Vapor has mature solutions for common patterns. We use Fluent almost exclusively over raw SQL, and Vapor's queue system handles everything from data processing to billing tasks.

**Version your API URLs from day one.** You'll thank yourself later when you need to evolve your API without breaking existing clients.

**Always set cache expiration times.** It sounds obvious, but that Redis cache that "will never grow too large" absolutely will. Set reasonable TTLs on everything that you cache.

**Monitor errors and performance.** When you build an iPhone app, you automatically get crash logs that help you find out where things are going wrong for your users. On the server, you'll have to collect those yourself. Before we started doing that, our customers would discover problems before we did, and that never feels good or professional.

Now we use a combination of [Swift Distributed Tracing](https://github.com/apple/swift-distributed-tracing) and our own analytics-based middleware to find performance bottlenecks and errors that are predictors of service crashes, and we can right the ship before most of our customers notice.

## Still we rise

TelemetryDeck proves that Swift isn't just for apps—it's a legitimate choice for building scalable, performant backend services. We're processing millions of events, serving thousands of developers, and doing it all with Swift and Vapor. The language that powers apps on billions of iOS devices is equally capable of powering the services behind them.

The performance gains are real: we can crunch and encode tens of thousands of data points in milliseconds. The development velocity is fantastic: we work in Xcode and write tests for behaviour and not for data parsing. And the type safety prevents entire categories of bugs that loosely-typed languages like Python or JavaScript need additional code to guard against. Perhaps most importantly, the joy of writing Swift makes the long hours of building a business more bearable.

If you're considering Swift for your next server-side project, take it from someone who's built an entire business on it: Swift delivers on its promise of safe, fast, and expressive code—whether that code runs on an iPhone or in a data center.
