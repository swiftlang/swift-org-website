---
layout: page
title: Why Swift on Server - Concurrency
---

Concurrency is often critical for server-side applications in order to minimize latency, or the time it takes an application to complete some task. Many server-side applications are built up by retrieving and combining responses from multiple different downstream services - such as remote databases or other micro-services - and concurrency can help minimize the time a server is just waiting on receiving these responses by making requests in parallel.

Swift has a suite of features that make writing concurrent applications straight-forward while minimizing the chance of introducing difficult-to-debug race conditions. 

## Asynchronous Task Execution
Swift has a built-in mechanism for running asynchronous tasks. These tasks are run on a cooperative thread pool and Swift automatically manages suspending tasks when they need to wait for some future event and resuming them when they continue. 

The advantage of this mechanism is that, outside of advanced use cases, the optimization of task execution is taken care of you. There is no need to "rightsize" a custom thread pool or executor to find the sweet spot between high CPU utilization and context switching between threads. No worry about thread explosions if you create too much parallel work. No wasted resources as threads just wait around for network responses to return. No verbose syntax to learn. Swift automatically creates the cooperative thread pool optimized for the size of the current computing resource and schedules tasks on it.

## Async/Await syntax

Swift utilizes a built-in "async/await" style syntax that by default hides the complexity of concurrent programming. Similar to how Swift uses the explicit `try` keyword at function call sites to indicate that a function might throw, the `await` keyword is used to indicate that a function may suspend its processing to asynchronously wait on some future event or completion of another task. 

~~~ swift
func someFunction() async -> ClientResult {
    return await myClient.get() // this call may take significant time
}

let theClientResult = await someFunction()
~~~

## Structured Concurrency
Building on the ability to schedule asynchronous tasks, Swift also makes it easy to create tasks which are the logical child tasks of the currently running task, creating a tree-structure of tasks. This task-tree retains the creation relationship between tasks which can be used by the Swift runtime and applications to optimize the application.

This is particularly useful for request-based server-side applications - such as http request/response applications - where there are often a set of tasks that ultimately need to come together to create a response.

### Child Task Creation

Swift provides a number of mechanisms that allow for the creation and management of child tasks, the most flexible of which are task groups. 

~~~ swift
await withTaskGroup(of: TaskResultType.self) { group in
    group.addTask {
        ...
    }

    group.addTask {
        ...
    }
    
    for await taskResult in group {
        // do something with each result as it is returned,
        // potentially adding more tasks to the group or
        // breaking out of the loop
    }

    // cancel any tasks still running
    group.cancelAll()
}
~~~

Task Groups are extremely powerful, providing complete control over when tasks are added to the group, when and how their results are processed and managing task cleanup/cancellation if required. Task Groups can be used to create simplified high level abstractions such as `concurrentForEach` and `concurrentMap` or alternatively to create complex custom implementations with precise control over specific concurrent use cases.

### Task Locals

Task Locals provide the ability to associate Swift objects - such as structs and classes - with a Swift task. These objects can be associated with a task and then retrieved somewhere else without explicitly passing the objects between the two. This is often useful when these two actions are performed without knowledge of the other, such as across different libraries.

Conceptually Task Locals are similar to Java's Thread Locals but, due to structured concurrency, solve a number of problems with latter. Task Locals are automatically propagated to child tasks avoiding manual, and often error-prone, propagation of context between threads. Task Locals are also only associated with the task, not a particular thread and therefore follow the task regardless if the task is suspended and then resumed by the system on a different thread.

There are a number of core uses of Task Locals in the Swift server-side ecosystem that enable robust development of applications.

1. [`swift-log`](https://github.com/apple/swift-log)'s Metadata Providers: Swift's unified logging API, swift-log, provides the ability to retrieve log metadata from Task Locals and incorporate them into any logs emitted. In http request/response applications for example, this allows any logs - including those emitted from libraries with no knowledge of how the top-level application works - to include log metadata such as requestIds and other information about the incoming request.
1. [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing): Swift's unified distributed tracing API allows specific tracing implementations to set tracing context from incoming requests and to then set it on any outgoing requests made in that task or any child task.

For most server-side use cases, the [ServiceContext](https://github.com/apple/swift-service-context) type, modeled after the concepts explained in [W3C Baggage](https://w3c.github.io/baggage/) and built on top of Task Locals, will be a convenient mechanism to transport task-specific information. This type easily allows for custom attributes to be stored and retrieved in a type-safe manner. This type is also the basis for `swift-distributed-tracing`'s trace identifier propagation.


~~~ swift
struct MyData {    
    let requestId: String
}

extension ServiceContext {
    public var myData: MyData? {
        get {
            self[MyDataKey.self]
        }
        set {
            self[MyDataKey.self] = newValue
        }
    }
}

private enum MyDataKey: ServiceContextKey {
    typealias Value = MyData

    static var nameOverride: String? = "my-data"
}

if let myData = ServiceContext.current.myData {
    print("Hello \(myData.requestId)")
}
~~~

### Cancellation

Server-side applications often perform work that is time-bounded. For example in a http request/response application after a certain duration the client has likely given up and potentially retried the request, making any additional processing - even if it does eventually complete - ultimately unused.

Swift provides the ability to flag that a task is cancelled and this is automatically propagated to child-tasks. Tasks that are currently suspended will throw a `CancellationError` which parent tasks can catch and perform appropriate cleanup before completing. Other tasks can handle checking for cancellation manually if required. This mechanism allows for the robust cleanup of entire task-trees once it is known that they are no longer needed.

### Task Priority

Structured concurrency also simplifies managing the priority of different tasks. By default tasks inherit the priority of their parent task and additionally Swift will reduce the likelihood of priority inversion by automatically raising the priority of a task to at least the priority of any task suspended waiting for its completion.

## Thread Safety

Server-side applications are often highly concurrent, often with many hundreds or even thousands of requests executing in parallel within the same application. In these cases it is critical for correctness - and potentially even availability - that these requests can all run in parallel without unexpectedly affecting each other. Failing to make applications thread safe often results in unpredictable and difficult-to-debug race conditions.

From the beginning Swift has focused on providing safe defaults and thread safety is no exception. Swift encourages the use of value types - such as structs - that, even if mutated only mutate the local copy and do not expose shared mutable state through multiple references. Swift's built-in collection types - arrays, dictionaries and sets - all utilize copy-on-write implementations underneath so again do not expose shared mutable state potentially across threads. 

In addition Swift is increasingly making its compiler smart enough to enforce thread safety at compile-time. Objects - or even function blocks - sent across task boundaries must either be implicitly thread safe - such as structs - or guaranteed by the compiler to be so, through the `@Sendable` annotation.

While the performance and correctness of server-side applications often depends on the ability for separate requests to run in parallel without interfering with each other, there are times when you explicitly want communication between different threads of execution. For these situations, Swift provides a number of mechanisms so that this communication can be handled correctly and safely.

### Actors

In many instances a server-side application will want a small amount of shared mutable state across the application. Caches of various kinds, for example, ensure that expensive operations - such as retrieving information across a network connection - are minimized and the results reused when possible.

Actors integrate with the "async/await" syntax to ensure that the execution of any functions isolated to the actor will be serialized, with any parallel function calls suspended until they can be run safely on the actor. This protects the mutable state of the actor from concurrent access without the author having to worry about the underlying details of how this happens.

This ensures that any mutable state the actor has can safely be accessed across task boundaries and allows the actor itself to be passed across task boundaries without any unexpected race conditions, that is actors are considered `Sendable`.

~~~ swift
actor Metrics {    
    var count = 0

    func increment() {
        self.count += 1
    }
}

let metrics = Metrics()

await withTaskGroup(of: Void.self) { group in
    group.addTask {
        await metrics.increment()
    }

    group.addTask {
        await metrics.increment()
    }
    
    await group.waitForAll()
}
~~~

## Async sequences

Async Sequences provide the ability to pass a sequence of `Sendable` Swift objects between tasks over time. They are a powerful mechanism that can be used to implement a variety of producer-consumer use cases. The Swift standard library along with other core libraries - such as [swift-async-algorithms](https://github.com/apple/swift-async-algorithms) - provide a number of ready-to-use implementations of the base `AsyncSequence` protocol, including those that provide back-pressure to ensure the production of values do not exceed the consumption of values.

~~~ swift
// AsyncStream is an implementation of the AsyncSequence protocol provided
// by the standard library
let (stream, continuation) = AsyncStream.makeStream(of: Int.self)

await withTaskGroup(of: Void.self) { group in
    group.addTask {
        (0..<100).forEach { index in
            continuation.yield(index)
        }

        continuation.finish()
    }

    group.addTask {
        for await value in stream {
            // do something with the value
        }
    }
    
    await group.waitForAll()
}
~~~