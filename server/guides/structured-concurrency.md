---
layout: page
title: Using Structured Concurrency in server applications
---

# Using Structured Concurrency in server applications

Swift Concurrency allows you to write safe concurrent, asynchronous and data
race free code using native language features. Server systems are often highly
concurrent to handle many different connections at the same time. This makes
Swift Concurrency a perfect fit for use in server systems since it reduces the
cognitive burden to write correct concurrent systems while spreading the work
across all available cores.

Structured Concurrency allows you to organize your code into high-level tasks
and their child component tasks. These tasks are the primary unit of concurrency
and enable the flow of information up and down the task hierarchy. Furthermore,
child tasks enhance local reasoning since at the end of a method all child tasks
must have finished.

This guide covers best practices around how Swift Concurrency should be used in
server side applications and libraries. Importantly, this guide assumes a
_perfect_ world where all libraries and applications have fully bought into
Structured Concurrency. The goal of this guide is to define a target for the
ecosystem which can be referred to when talking about the architecture of
libraries and applications. In reality, there are a lot of places where one has
to bridge currently unstructured systems. Depending on how those unstructured
systems are shaped there are various ways to bridge them. It is outside the
scope of this guide to explain how to bridge unstructured systems.

## Structuring your application

You can think of Structured Concurrency as a tree of tasks where the initial
task is rooted at the `main()` entry point of the application. From this entry
point onwards more and more child tasks are added to the tree to form the
logical flow of data in the application. Organizing the whole program into a
single task tree unlocks the full potential of Structured Concurrency such as:

- Automatic task cancellation propagation
- Propagation of task locals down the task tree

Applications are typically comprised out of multiple smaller components such as
an HTTP server handling incoming traffic, observability backends sending events
to external systems, and clients for databases. All of those components probably
require one or more tasks to run their work and those tasks should be child
tasks of the application's main task tree for the above-mentioned reasons. In
general, those components can be split into two kinds - clients and servers. The
task structure for clients and servers is slightly different but important to
understand.

Clients often have to manage a pool of connections to external resources. Those
connections need to be owned by one task. At the same time, clients expose
methods to execute requests on those connections. This requires communication
between the request task and the task that owns the connection. Below is a
simplified `HTTPClient` that shows this pattern:

```swift
final class HTTPClient: Sendable {
    /// An async sequence containing requests that need to be executed. 
    private let requestStream: AsyncStream<(HTTPRequest, CheckedContinuation<HTTPResponse, Error>)>
    /// The continuation of the above async sequence.
    private let requestStreamContinuation: AsyncStream<(HTTPRequest, CheckedContinuation<HTTPResponse, Error>)>.Continuation
    /// A pool of connections.
    private let connectionPool: ConnectionPool
    
    public func run() async throws {
        await withDiscardingTaskGroup { group in
            group.addTask {
                // This runs the connection pool which will own the individual connections.
                await self.connectionPool.run()
            }

            // This consumes new incoming requests and dispatches them onto connections from the pool.
            for await (request, continuation) in workStream {
                group.addTask {
                    await self.connectionPool.withConnection(for: request) { connection in
                        do {
                            let response = try await connection.execute(request)
                            continuation.resume(returning: response)
                        } catch {
                            continuation.resume(throwing: error)
                        }
                    }
                }
            }
        }
    }

    public func execute(request: HTTPRequest) async throws -> HTTPResponse {
        try await withCheckedContinuation { continuation in
            self.requestStreamContinuation.yield((request, continuation))
        }
    }
}
```

On the other hand, server are usually handling new incoming connections or
requests and are dispatching them to user-defined handlers. In practice, this
results in servers often just exposing a long lived `run()` that listens for new
incoming work. Below is a simplified `HTTPServer`.

```swift
import NIO

final class HTTPServer: Sendable {
    public func run() async throws {
        // This example uses SwiftNIO but simplifies its usage to
        // focus on server pattern and not too much on SwiftNIO itself.
        let serverChannel = ServerBootstrap().bind { ... }

        try await withDiscardingTaskGroup { group in
            try await serverChannel.executeThenClose { inbound in
                // This for await loop is handling the incoming connections
                for try await connectionChannel in serverChannel {
                    // We are handling each connection in a separate child task so we can concurrently process each
                    group.addTask {
                        try await connectionChannel.executeThenClose { inbound, outbound in
                            // Here we are just handling each incoming HTTP request per connection
                            for try await httpRequest in inbound {
                                // We are just going to print the request and reply with a status ok
                                print("Received request", httpRequest)
                                try await outbound.write(HTTPResponse(status: .ok))
                            }
                        }
                    }
                }
            }
        }
    }
}
```

In the above simplified examples, you can already see that both expose a `func
run() async throws`. This is the recommended pattern for libraries to expose a
single entry point where they can add their long-running background tasks. The
expectation is that `run()` methods don't return until their parent task is
cancelled or they receive a shutdown signal by some other means. Furthermore,
throwing from a `run()` method is usually considered an unrecoverable problem
and should often lead to the termination of the application.

You may be tempted to handle background work by spawning unstructured tasks
using the `Task.init(_:)` or `Task.detached(_:)`; however, this comes with
significant downsides such as manual implementation of cancellation of those
tasks or incorrect propagation of task locals. Moreover, unstructured tasks are
often used in conjunction with `deinit`-based cleanup, i.e. the unstructured
tasks are retained by the surrounding type and then cancelled in the `deinit`.
Doing this is very brittle since those unstructured tasks are often also
retaining the type which might also be shared across multiple other tasks. This
makes it almost impossible to tell when those `deinit`s are actually run and
when the underlying resources are cleaned up. The next section provides more
details why controlled resource clean up is important and what patterns exist to
model this with Structured Concurrency.

By adopting the `run()` pattern you can make use of the [swift-service-lifecycle
package](https://github.com/swift-server/swift-service-lifecycle) to structure
your applications. It allows you to compose different services under a single
top-level task while getting out-of-the-box support for signal handling allowing
you to gracefully terminate services.

The goal of structuring libraries and applications like this is enabling a
seamless integration between them. Furthermore, since everything is inside the
same task tree and task locals propagate down the tree we unlock new APIs in
libraries such as `Swift Log` or `Swift Distributed Tracing`.

After adopting this structure a common question that comes up is how to model
communication between the various components. This can be achieved by:
- Using dependency injection to pass one component to the other, or 
- Inverting the control between components using `AsyncSequence`s.

## Resource management

Applications often have to manage some kind of resource. Those could be file
descriptors, sockets or something like virtual machines. Most resources need
some kind of cleanup such as making a syscall to close a file descriptor or
deleting a virtual machine. Resource management ties in closely with Structured
Concurrency since it allows to express the lifetime of those resources in
concurrent and asynchronous applications. The recommended pattern to provide
access to resources is to use `with`-style methods such as the `func
withTaskGroup(of:returning:body:)` method from the standard library.
`with`-style methods allow to provide scoped access to a resource while making
sure the resource is correctly cleaned up at the end of the scope. Even before
Swift gained native concurrency support `with`-style methods were already used
in the standard library for synchronous APIs like `withUnsafeBytes`. Below is an
example method that provides scoped access to a file descriptor:

```swift
func withFileDescriptor<R>(_ body: (FileDescriptor) async throws -> R) async throws -> R { ... } 
```

Importantly, the file descriptor is only valid inside the `body` closure; hence,
escaping the file descriptor in an unstructured task or into a background thread
is not allowed.

Again, one might be tempted to use unstructured concurrency to clean up the file
descriptor in it's deinit like this:

```
struct FileDescriptor: ~Copyable {
    private let fd: CInt

    deinit {
        Task {
            await close(self.fd)
        }
    }
}
```

 However, this will make your application incredibly hard to reason about and in
 the end might result in security issues since the closure of the file
 descriptor might be slightly delayed and it is impossible to know how many file
 descriptor are open at any given point of your application.
