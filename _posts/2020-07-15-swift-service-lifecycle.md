---
layout: new-layouts/blog
published: true
date: 2020-07-15 9:00:00
title: Introducing Swift Service Lifecycle
author: tomerd
---

It is my pleasure to announce a new open source project for the Swift server ecosystem, [Swift Service Lifecycle](https://github.com/swift-server/swift-service-lifecycle). Service Lifecycle is a Swift package designed to help server applications, also known as services, manage their startup and shutdown sequences.

## What is it?

Most services have startup and shutdown workflow-logic which is often sensitive to failure and hard to get right. Startup sequences include actions like initializing thread pools, running data migrations, warming up caches, and other forms of state initialization before taking traffic or accepting events. Shutdown sequences include freeing up resources that hold on to file descriptors or other system resources that may leak if not cleared correctly.

Today, server applications and frameworks must find ways to address the need on their own, which could be error prone. To make things safer and easier, Service Lifecycle codifies this common need in a safe, reusable and framework-agnostic way. It is designed to be integrated with any server framework or directly in a server application’s `main`.

## How does it work?

The recommended way of using this library is creating a `ServiceLifecycle` instance in your server application's `main`, and register `LifecycleTasks` with it. Upon calling the `start` function, `ServiceLifecycle`  will start these tasks in the order they were registered.

By default, `ServiceLifecycle` also registers a `Signal` handler that traps `INT` and `TERM` , which are typical `Signal`s used in modern deployment platforms to communicate shutdown request. The shutdown sequence begins once the `Signal` is captured, and the `LifecycleTasks` are shut down in the reverse order they have been registered in.

### Example

~~~swift
// Import the package.
import Lifecycle

// Initialize the `Lifecycle` container.
var lifecycle = ServiceLifecycle()

// Register a resource that should be shut down when the application exits.
//
// In this case, we are registering a SwiftNIO `EventLoopGroup`
// and passing its `syncShutdownGracefully` function to be called on shutdown.
let eventLoopGroup = MultiThreadedEventLoopGroup(numberOfThreads: System.coreCount)
lifecycle.registerShutdown(
    name: "eventLoopGroup",
    .sync(eventLoopGroup.syncShutdownGracefully)
)

// Register another resource that should be started when the application starts
// and shut down when the application exits.
//
// In this case, we are registering a contrived `DatabaseMigrator`
// and passing its `migrate` function to be called on startup
// and `shutdown` function to be called on shutdown.
let migrator = DatabaseMigrator(eventLoopGroup: eventLoopGroup)
lifecycle.register(
    name: "migrator",
    start: .async(migrator.migrate),
    shutdown: .async(migrator.shutdown)
)

// Start the application.
//
// Start handlers passed using the `register` function
// will be called in the order they were registered in.
lifecycle.start() { error in
    // start completion handler
    // if an startup error occurred you can capture it here
    if let error = error {
        logger.error("failed starting \(self) ☠️: \(error)")
    } else {
        logger.info("\(self) started successfully 🚀")
    }
}

// Wait for the application to exit
//
// This is a blocking operation that typically waits for a `Signal`.
// The `Signal` can be configured at `lifecycle.init`, and defaults to `INT` and `TERM`.
// Shutdown handlers passed using the `register` or `registerShutdown` functions
// will be called in the reverse order they were registered in.
lifecycle.wait()
~~~



## Getting Involved

If you are interested in Service Lifecycle, come and get involved!

The [source is available](https://github.com/swift-server/swift-service-lifecycle), and we encourage contributions from the open source community. If you have feedback, questions or would like to discuss the project, please feel free to chat on the [Swift forums](https://forums.swift.org/c/server). If you would like to report bugs, please use [the GitHub issue tracker](https://github.com/swift-server/swift-service-launcher/issues). We look forward to working with you, and helping move the industry forward to a better, safer programming future.
