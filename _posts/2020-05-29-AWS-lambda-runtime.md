---
layout: new-layouts/blog
published: true
date: 2020-05-29 10:00:00
title: Introducing Swift AWS Lambda Runtime
author: tomerd
---

It is my pleasure to announce a new open source project for the Swift Server ecosystem, [Swift AWS Lambda Runtime](https://github.com/swift-server/swift-aws-lambda-runtime/). Distributed as a Swift package, the Swift AWS Lambda Runtime is designed to help Swift developers build serverless functions for the [Amazon Web Services Lambda platform](https://aws.amazon.com/lambda/).

The project is a group effort that included engineers across the Swift community, including engineers from Apple and Amazon. Notably [Fabian Fett](https://github.com/fabianfett) pioneered the work in the community and co-authored the library. As an open source library, anyone interested in contributing to the project can easily join in to help make it better.


## Background

Many modern systems have client components, like iOS, macOS or watchOS applications, as well as server components with which those clients interact. Serverless functions are often the easiest and most efficient way for client application developers to extend their applications into the cloud.

[Serverless functions](https://en.wikipedia.org/wiki/Serverless_computing) are becoming an increasingly popular choice for running event-driven or otherwise ad-hoc compute tasks in the cloud. They power mission critical microservices and data intensive workloads. In many cases, serverless functions allow developers to more easily scale and control compute costs given their on-demand nature.

When using serverless functions, attention must be given to resource utilization as it directly impacts the costs of the system. This is where Swift shines! With its low memory footprint, deterministic performance, and quick start time, Swift is a fantastic match for the serverless functions architecture.

Combine this with Swift’s developer friendliness, expressiveness, and emphasis on safety, and we have a solution that is great for developers at all skill levels, scalable, and cost effective.

Swift AWS Lambda Runtime was designed to make building Lambda functions in Swift simple and safe. The library is an implementation of the [AWS Lambda Runtime API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html) and uses an embedded asynchronous HTTP Client that is fine-tuned for performance in the AWS Runtime context. The library provides a multi-tier API that allows building a range of Lambda functions: From quick and simple closures to complex, performance-sensitive event handlers.


## How does it work?

### Using Closures

The simplest way to use AWS Lambda Runtime is to pass in a closure, for example:

~~~swift
// Import the module
import AWSLambdaRuntime

// In this example we are receiving and responding with strings
Lambda.run { (context, payload: String, callback) in
  callback(.success("Hello, \(payload)"))
}
~~~


More commonly, the payload would be a JSON, which is modeled using `Codable`, for example:

~~~swift
// Import the module
import AWSLambdaRuntime

// Request, uses Codable for transparent JSON encoding
private struct Request: Codable {
  let name: String
}

// Response, uses Codable for transparent JSON encoding
private struct Response: Codable {
  let message: String
}

// In this example we are receiving and responding with JSON using Codable
Lambda.run { (context, request: Request, callback) in
  callback(.success(Response(message: "Hello, \(request.name)")))
}
~~~


Since Lambda functions are often triggered by events originating from the AWS platform such as [SNS](https://aws.amazon.com/sns/), [SQS](https://aws.amazon.com/sqs), or [S3](https://aws.amazon.com/s3) events,  the package also includes an `AWSLambdaEvents` module providing implementations for these common trigger event types. For example, handling a `SQS` message:

~~~swift
// Import the modules
import AWSLambdaRuntime
import AWSLambdaEvents

// In this example we are receiving a SQS Message, with no response (Void)
Lambda.run { (context, message: SQS.Message, callback) in
  ...
  callback(.success(Void()))
}
~~~


In addition to these common trigger events, `AWSLambdaEvents` also includes abstractions for integrating Lambda functions with [APIGateway](https://aws.amazon.com/api-gateway/) - an AWS system that helps exposing Lambda function as HTTP endpoints.

~~~swift
// Import the modules
import AWSLambdaRuntime
import AWSLambdaEvents

// In this example we are receiving an APIGateway.V2.Request,
// and responding with APIGateway.V2.Response
Lambda.run { (context, request: APIGateway.V2.Request, callback) in
   ...
   callback(.success(APIGateway.V2.Response(statusCode: .accepted)))
}
~~~

### Using EventLoopLambdaHandler

Modeling Lambda functions as closures is both simple and safe. Swift AWS Lambda Runtime will ensure that the user-provided function is offloaded from the network processing thread to its own thread so that even if the code becomes slow or unresponsive, the underlying Lambda process can continue and interact with the Runtime engine. This safety comes at a small performance penalty from context switching between the networking and processing threads. In most cases, the simplicity and safety of using the Closure-based API is preferred over the complexity of the performance-oriented API detailed below.

Performance-sensitive Lambda functions may choose to use a more complex API which allows the user code to run on the same thread as the networking handlers. Swift AWS Lambda Runtime uses [SwiftNIO](https://www.github.com/apple/swift-nio) as its underlying networking engine, which means these APIs are based on SwiftNIO’s concurrency primitives like the `EventLoop` and `EventLoopFuture`.

For example, handling an `SNS` message:

~~~swift
// Import the modules
import AWSLambdaRuntime
import AWSLambdaEvents
import NIO

// Our Lambda handler, conforms to EventLoopLambdaHandler
struct Handler: EventLoopLambdaHandler {
    typealias In = SNS.Message // Request type
    typealias Out = Void // Response type, or Void

    // In this example we are receiving a SNS Message, with no response (Void)
    func handle(context: Lambda.Context, payload: In) -> EventLoopFuture<Out> {
        ...
        context.eventLoop.makeSucceededFuture(Void())
    }
}

Lambda.run(Handler())
~~~


Beyond the cognitive complexity of using the `EventLoopFuture` based APIs, note that these APIs should be used with extra care. An `EventLoopLambdaHandler` will execute the user-provided function on the same `EventLoop` (thread) as the library’s networking engine, putting a requirement on the implementation to never block the underlying  `EventLoop`. In other words, the Lambda code should never use blocking API calls as it might prevent the library from interacting with the Lambda platform.


## Additional resources

Additional documentation and examples can be found in the project’s [readme](https://github.com/swift-server/swift-aws-lambda-runtime).

## Project Status

This is the beginning of a community-driven open-source project actively seeking contributions.
While the core API is considered stable, the API may still evolve as it gets closer to a `1.0` version.
There are several areas which need additional attention, including but not limited to:

* Further performance tuning
* Additional trigger events
* Additional documentation and best practices
* Additional examples

## Getting Involved

If you are interested in Swift AWS Lambda Runtime, come and get involved! The [source is available](https://github.com/swift-server/swift-aws-lambda-runtime), and we encourage contributions from the open source community. If you have feedback, questions or would like to discuss the project, please feel free to chat on the [Swift forums](https://forums.swift.org/c/server). If you would like to report bugs, please use [the GitHub issue tracker](https://github.com/swift-server/swift-aws-lambda-runtime/issues). We look forward to working with you, and helping move the industry forward to a better, safer programming future.

### Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/announcing-swift-aws-lambda-runtime/37009) on the [Swift forums](https://forums.swift.org).
