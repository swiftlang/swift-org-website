---
layout: post
published: true
date: 2024-01-01 11:00:00
title: Swift OpenAPI Generator 1.0 Released
author: [simonjbeaumont, honzadvorsky]
excerpt_separator: <!--read more-->
---

We’re happy to announce the stable 1.0 release of [Swift OpenAPI Generator][swift-openapi-generator-repo]!

Since the initial [0.1.0 release][previous-blog-post], the project received over 300 pull requests, from more than 25 contributors, and has gained several new features and a simpler API.

<!--read more-->

[OpenAPI][openapi] is a specification for documenting HTTP services. An OpenAPI document is written in either YAML or JSON, which can be read by tools to help automate workflows, such as generating code for sending and receiving HTTP requests.

Swift OpenAPI Generator is a Swift package plugin that can generate the ceremony code required to make API calls, or implement API servers.

The code is generated at build-time, so it's always in sync with the OpenAPI document and doesn't need to be committed to your source repository.

To get started, check out one of the [example projects][examples] or follow a [step-by-step tutorial][tutorials].

## Feature highlights

* Works with OpenAPI Specification versions 3.0 and 3.1.
* Streaming request and response bodies, backed by AsyncSequence, enabling use cases such as JSON event streams, and large payloads without buffering.
* Support for common content types, including JSON, multipart, URL-encoded form, base64, plain text, and raw bytes; all represented as value types with type-safe properties.
* Flexible client, server, and middleware abstractions, decoupling the generated code from the HTTP client library and web framework.

## A look at the generated API

Swift OpenAPI Generator is a Swift package plugin that can be used to generate one or both of the following:

* Client code to make type-safe requests to an API server with any HTTP client library.
* Server code that bootstraps an API server using any web framework, using business logic for the API operations that you provide, which are simple functions using network-free types for input and output.

### Generated client API

The generated `Client` type provides a method for each HTTP operation defined in the OpenAPI document[^footnote-example-openapi-document] and can be used with any HTTP library that provides an implementation of `ClientTransport`.

```swift
import OpenAPIURLSession
import Foundation

let client = Client(
    serverURL: URL(string: "http://localhost:8080/api")!,
    transport: URLSessionTransport()
)
let response = try await client.getGreeting()
print(try response.ok.body.json.message)
```

### Generated server API stubs

To implement a server, define a type that conforms to the generated `APIProtocol`, providing a method for each HTTP operation defined in the OpenAPI document[^footnote-example-openapi-document].

The server can be used with any web framework that provides an implementation of `ServerTransport`, which allows you to register your API handlers with the HTTP server, using the generated `registerHandlers` function.

```swift
import OpenAPIRuntime
import OpenAPIVapor
import Vapor

struct Handler: APIProtocol {
    func getGreeting(_ input: Operations.getGreeting.Input) async throws -> Operations.getGreeting.Output {
        let name = input.query.name ?? "Stranger"
        return .ok(.init(body: .json(.init(message: "Hello, \(name)!"))))
    }
}

@main struct HelloWorldVaporServer {
    static func main() async throws {
        let app = Vapor.Application()
        let transport = VaporTransport(routesBuilder: app)
        let handler = Handler()
        try handler.registerHandlers(on: transport, serverURL: URL(string: "/api")!)
        try await app.execute()
    }
}
```

### Package ecosystem

* [apple/swift-openapi-generator][swift-openapi-generator-repo]: Swift package plugin and CLI.
* [apple/swift-openapi-runtime][swift-openapi-runtime-repo]: Runtime library used by the generated code.
* [apple/swift-openapi-urlsession][swift-openapi-urlsession-repo]: Client transport using URLSession.
* [swift-server/swift-openapi-async-http-client][swift-openapi-async-http-client-repo]: Client transport using AsyncHTTPClient.
* [swift-server/swift-openapi-vapor][swift-openapi-vapor-repo]: Server transport using Vapor web framework.
* [swift-server/swift-openapi-hummingbird][swift-openapi-hummingbird-repo]: Server transport using Hummingbird web framework.

## Documentation and example projects

To get started, check out the [documentation][documentation], which contains [step-by-step tutorials][tutorials].

You can also experiment with [example projects][examples] that use Swift OpenAPI Generator and integrate with other packages in the ecosystem.

Or if you prefer to watch a video, check out [Meet Swift OpenAPI Generator](https://developer.apple.com/wwdc23/10171) from WWDC23.

---
[^footnote-example-openapi-document]: The code in this blog post has been generated from this [example OpenAPI document][example-openapi-document].

[openapi]: https://openapis.org
[previous-blog-post]: https://www.swift.org/blog/introducing-swift-openapi-generator
[documentation]: https://swiftpackageindex.com/apple/swift-openapi-generator/documentation
[examples]: https://github.com/apple/swift-openapi-generator/blob/1.2.0/Examples/README.md
[tutorials]: https://swiftpackageindex.com/apple/swift-openapi-generator/tutorials/swift-openapi-generator
[example-openapi-document]: https://github.com/apple/swift-openapi-generator/blob/1.2.0/Examples/hello-world-urlsession-client-example/Sources/HelloWorldURLSessionClient/openapi.yaml
[swift-openapi-generator-repo]: https://github.com/apple/swift-openapi-generator
[swift-openapi-runtime-repo]: https://github.com/apple/swift-openapi-runtime
[swift-openapi-urlsession-repo]: https://github.com/apple/swift-openapi-urlsession
[swift-openapi-async-http-client-repo]: https://github.com/swift-server/swift-openapi-async-http-client
[swift-openapi-vapor-repo]: https://github.com/swift-server/swift-openapi-vapor
[swift-openapi-hummingbird-repo]: https://github.com/swift-server/swift-openapi-hummingbird
