---
layout: page
title: Using Structured Concurrency in server applications
---

# Using Structured Concurrency in server applications

Swift Concurrency enables writing safe concurrent, asynchronous and data race
free code using native language features. Server systems are often highly
concurrent to handle many different connections at the same time. This makes
Swift Concurrency a perfect fit for use in server systems since it reduces the
cognitive burden to write correct concurrent systems while spreading the work
across all available cores.

Structured Concurrency allows the developer to organize their code into
high-level tasks and their child component tasks. These tasks are the primary
unit of concurrency and enable the flow of information up and down the task
hierarchy.

This guide covers best practices around how Swift Concurrency should be used in
server side applications and libraries. Importantly, this guide assumes a
_perfect_ world where all libraries and applications are fully bought into
Structured Concurrency. In reality, there are a lot of places where one has to
bridge currently unstructured systems. Depending on how those unstructured
systems are shaped there are various ways to bridge them (maybe include a
section in the with common patterns). The goal of this guide is to define a
target for the ecosystem which can be referred to when talking about the
architecture of libraries and applications.

## Structuring your application

One can think of Structured Concurrency as a tree of task where the initial task
is rooted at the `main()` entry point of the application. From this entry point
onwards more and more child tasks are added to the tree to form the logical flow
of data in the application. Organizing the whole program into a single task tree
unlocks the full potential of Structured Concurrency such as:

- Automatic task cancellation propagation
- Propagation of task locals down the task tree

When looking at a typical application it is often comprised out of multiple
smaller components such as an HTTP server handling incoming traffic,
observability backends sending events to external systems, and clients to
databases. All of those components probably require one or more tasks to run
their work and those tasks should be child tasks of the application's main task
tree for the above-mentioned reasons. Broadly speaking libraries expose two
kinds of APIs short lived almost request response like APIs e.g.
`HTTPClient.get("http://example.com)` and long-lived APIs such as an HTTP server
that accepts inbound connections. In reality, libraries often expose both since
they need to have some long-lived connections and then request-response like
behavior to interact with those connections, e.g. an `HTTPClient` will have a
pool of connections and then dispatch requests onto them.

The recommended pattern for those components and libraries is to expose a `func
run() async throws` method on their types, such as an `HTTPClient`, inside this
`run()` method libraries can schedule their long running work and spawn as many
child tasks as they need. It is expected that those `run()` methods are often
not returning until their parent task is cancelled or they receive a shutdown
signal through some other mean. The other way that libraries could handle their
long running work is by spawning unstructured tasks using the `Task.init(_:)` or
`Task.detached(_:)`; however, this comes with significant downsides such as
manual implementation of cancellation of those tasks or incorrect propagation of
task locals. Moreover, unstructured tasks are often used in conjunction with
`deinit`-based cleanup, i.e. the unstructured tasks are retained by the type and
then cancelled in the `deinit`. Since `deinit`s of classes and actors are run at
arbitrary times it becomes impossible to tell when resources created by those
unstructured tasks are released. Since, the `run()` method pattern has come up a
lot while migrating more libraries to take advantage of Structured Concurrency
which lead the SSWG to update the [swift-service-lifecycle
package](https://github.com/swift-server/swift-service-lifecycle) to embrace
this pattern. In general, the SSWG recommends to adopt `ServiceLifecycle` and
conform types of libraries to the `Service` protocol which makes it easier for
application developers to orchestrate the various components that form the
application's business logic. `ServiceLifecycle` provides the `ServiceGroup`
which allows developers to orchestrate a number of `Service`s. Additionally, the
`ServiceGroup` has built-in support for signal handling to implement a graceful
shutdown of applications. Gracefully shutting down applications is often
required in modern cloud environments during roll out of new application
versions or infrastructure reformations.

The goal of structuring libraries and applications like this is enabling a
seamless integration between them and have a coherent interface across the
ecosystem which makes adding new components to applications as easy as possible.
Furthermore, since everything is inside the same task tree and task locals
propagate down the tree we unlock new APIs in libraries such as `swift-log` or
`swift-tracing`.

After adopting this structure a common question question that comes up is how to
model communication between the various components. This can be achieved in a
couple of ways. Either by using dependency injection to pass one component to
the other or by inverting the control between components using `AsyncSequence`s.

## Resource management

Applications often have to manage some kind of resource. Those could be file
descriptors, sockets or something like virtual machines. Most resources need
some kind of cleanup such as making a syscall to close a file descriptor or
deleting a virtual machine. Resource management ties in closely with Structured
Concurrency since it allows to express the lifetime of those resources in
concurrent and asynchronous applications. The recommended pattern to provide
access to resources is to use `with`-style methods such as the `func
withTaskGroup(of:returning:body:)` method from the standard library.
`with`-style methods allow to provide scoped access to a resource while making
sure the resource is currently cleaned up at the end of the scope. For example a
method providing scoped access to a file descriptor might look like this:

```swift
func withFileDescriptor<R>(_ body: (FileDescriptor) async throws -> R) async throws -> R { ... } 
```

Importantly, the file descriptor is only valid inside the `body` closure; hence,
escaping the file descriptor in an unstructured task or into a background thread
is not allowed.

> Note: With future language features such as `~Escapable` types it might be
possible to encode this constraint in the language itself.

## Task executors in Swift on Server applications

Most of the Swift on Server ecosystem is build on top of
[swift-nio](https://github.com/apple/swift-nio) - a high performant event-driven
networking library. `NIO` has its own concurrency model that predates Swift
Concurrency; however, `NIO` offers the `NIOAsyncChannel` abstraction to bridge a
`Channel` into a construct that can be interacted with from Swift Concurrency.
One of the goals of the `NIOAsyncChannel`, is to enable developers to implement
their business logic using Swift Concurrency instead of using `NIO`s lower level
`Channel` and `ChannelHandler` types, hence, making `NIO` an implementation
detail. You can read more about the `NIOAsyncChannel` in [NIO's Concurrency
documentation](https://swiftpackageindex.com/apple/swift-nio/2.61.1/documentation/niocore/swift-concurrency).

Highly performant server application often rely on handling incoming connections
and requests almost synchronously without incurring unnecessary allocations or
context switches. Swift Concurrency is by default executing any non-isolated
method on the global concurrent executor. On the other hand, `NIO` has its own
thread pool in the shape of an `EventLoopGroup`. `NIO` picks an `EventLoop` out
of the `EventLoopGroup` for any `Channel` and executes all of the `Channel`s IO
on that `EventLoop`. When bridging from `NIO` into Swift Concurrency by default
the execution has to context switch between the `Channel`s `EventLoop` and one
of the threads of the global concurrent executor. To avoid this context switch
Swift Concurrency introduced the concept of preferred task executors in
[SE-XXX](). When interacting with the `NIOAsyncChannel` the preferred task
executor can be set to the `Channel`s `EventLoop`. If this is beneficial or
disadvantageous for the performance of the application depends on a couple of
factors:

- How computationally intensive is the logic executed in Swift Concurrency?
- Does the logic make any asynchronous out calls?
- How many cores does that application have available?

In the end, each application needs to measure its performance and understand if
setting a preferred task executor is beneficial.
