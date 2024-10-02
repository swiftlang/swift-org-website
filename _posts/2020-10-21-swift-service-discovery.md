---
layout: new-layouts/blog
published: true
date: 2020-10-21 9:00:00
title: Introducing Swift Service Discovery
author: yim-lee
---

It is my pleasure to announce a new open source project for the Swift Server ecosystem, [Swift Service Discovery](https://github.com/apple/swift-service-discovery). Service Discovery is a Swift package designed to establish a standard API that can be implemented by various [service discovery](https://en.wikipedia.org/wiki/Service_discovery) backends such as DNS-based, key-value store, etc.

## How does it work?

The Swift Service Discovery package defines the API only, similar to [SwiftLog](https://github.com/apple/swift-log) and [SwiftMetrics](https://github.com/apple/swift-metrics); actual functionalities are provided by backend implementations.

### Concepts

* **Service Identity**: Each service must have a unique identity. `Service` denotes the identity type used in a backend implementation.
* **Service Instance**: A service may have zero or more instances, each of which has an associated location (typically host-port). `Instance` denotes the service instance type used in a backend implementation.

### Server Applications

Application owners need to select a service discovery backend to make querying available. This is done by adding a dependency on the desired backend implementation and instantiating it at the beginning of the program.

For example, suppose the hypothetical `DNSBasedServiceDiscovery` is chosen as the backend:

~~~swift
// 1) Import the service discovery backend package
import DNSBasedServiceDiscovery

// 2) Create a concrete ServiceDiscovery object
let serviceDiscovery = DNSBasedServiceDiscovery()
~~~

To fetch the current list of instances (where `result` is `Result<[Instance], Error>`):

~~~swift
serviceDiscovery.lookup(service) { result in
    ...
}
~~~

To fetch the current list of instances (where `result` is `Result<[Instance], Error>`) AND subscribe to future changes:

~~~swift
let cancellationToken = serviceDiscovery.subscribe(
    to: service,
    onNext: { result in
        // This closure gets invoked once at the beginning and
        // subsequently each time a change occurs
        ...
    },
    onComplete: { reason in
        // This closure gets invoked when the subscription completes
        ...
    }
)

...

// Cancel the `subscribe` request
cancellationToken.cancel()
~~~

`subscribe` returns a `CancellationToken` that can be used to cancel the subscription later on.
`onComplete` is a closure that gets invoked when the subscription ends (e.g., when the service discovery instance shuts down) or gets cancelled through the `CancellationToken`.
`CompletionReason` can be used to distinguish what led to the completion.

### Backend Implementations

To become a compatible service discovery backend, implementations must conform to the `ServiceDiscovery` protocol which includes two methods: `lookup` and `subscribe`.

~~~swift
func lookup(
    _ service: Service,
    deadline: DispatchTime?,
    callback: @escaping (Result<[Instance], Error>) -> Void
)
~~~

`lookup` fetches the current list of instances for the given service and sends it to `callback`.
If the service is unknown (e.g., registration is required but it has not been done for the service), then the result should be a `LookupError.unknownService` failure.
A deadline should be imposed on when the operation will complete either via `deadline` or a default timeout.

~~~swift
func subscribe(
    to service: Service,
    onNext nextResultHandler: @escaping (Result<[Instance], Error>) -> Void,
    onComplete completionHandler: @escaping (CompletionReason) -> Void
) -> CancellationToken
~~~

`subscribe` "pushes" service instances to the `nextResultHandler`:

* When `subscribe` is first invoked, the caller should receive the current list of instances for the given service. This is essentially the `lookup` result.
* Whenever the given service's list of instances changes. The backend implementation has full control over how and when its service records get updated, but it must notify `nextResultHandler` when the instances list becomes different from the previous result.

A new `CancellationToken` is created for each `subscribe` request. If the cancellation token's `isCancelled` is `true`, the subscription has been cancelled and the backend implementation should cease calling the corresponding `nextResultHandler`.

The backend implementation must also notify via `completionHandler` when the subscription ends for any reason (e.g., the service discovery instance is shutting down or cancellation is requested through `CancellationToken`), so that the subscriber can submit another `subscribe` request if needed.

## Project Status

This is the beginning of a community-driven open-source project actively seeking contributions.
Besides contributing to Swift Service Discovery itself, we need compatible backend implementations that manage service registration and location information for querying.

## Getting Involved

If you are interested in Swift Service Discovery, come and get involved!
The [source is available](https://github.com/apple/swift-service-discovery), and we encourage contributions from the open source community.
If you have feedback, questions or would like to discuss the project, please feel free to chat on the [Swift forums](https://forums.swift.org/c/server).
If you would like to report bugs, please use [the GitHub issue tracker](https://github.com/apple/swift-service-discovery/issues).
We look forward to working with you, and helping move the industry forward to a better, safer programming future.
