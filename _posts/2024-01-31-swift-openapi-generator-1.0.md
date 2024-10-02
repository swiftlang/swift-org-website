---
layout: new-layouts/blog
published: true
date: 2024-01-31 12:00:00
title: Swift OpenAPI Generator 1.0 Released
author: [simonjbeaumont, honzadvorsky]
excerpt_separator: <!--read more-->
---

We’re happy to announce the stable 1.0 release of [Swift OpenAPI Generator][swift-openapi-generator-repo]!

[OpenAPI][openapi] is an open standard for describing the behavior of HTTP services with a rich ecosystem of tooling. One thing OpenAPI is particularly known for is tooling to generate _interactive_ documentation. But the core motivation of OpenAPI is _code-generation_, which allows adopters to use an API-first approach to server development and, because many existing services document their API in this format, allows client developers to generate type-safe, idiomatic code to call these APIs.

<!--read more-->

Many real-world APIs have hundreds of operations, each with rich request and response types, header fields, parameters, and more. Writing and maintaining this code for every operation can be repetitive, verbose, and error-prone.

Swift OpenAPI Generator is a Swift package plugin that generates the code required to make API calls and implement API servers. The code is automatically generated at build-time, so it's always in sync with the OpenAPI document and doesn't need to be committed to your source repository.

Since the initial [release][previous-blog-post] six months ago, the project received over 250 pull requests, from more than 20 contributors, and has gained several new features and a simpler API.

## Feature Highlights

* Works with OpenAPI Specification versions 3.0 and 3.1.
* Streaming request and response bodies, backed by AsyncSequence, enabling use cases such as JSON event streams, and large payloads without buffering.
* Support for common content types, including JSON, multipart, URL-encoded form, base64, plain text, and raw bytes; all represented as value types with type-safe properties.
* Flexible client, server, and middleware abstractions, decoupling the generated code from the HTTP client library and web framework.

## A Quick Look

Consider a fictitious HTTP server that provides a single API endpoint to return a personalized greeting:

```console
% curl 'https://example.com/api/greet?name=Jane'
{
    "message": "Hello, Jane"
}
```

This service can be described using the following OpenAPI document:

```yaml
openapi: '3.1.0'
info:
  title: GreetingService
  version: 1.0.0
servers:
  - url: https://example.com/api
    description: Example service deployment.
paths:
  /greet:
    get:
      operationId: getGreeting
      parameters:
        - name: name
          required: false
          in: query
          description: The name used in the returned greeting.
          schema:
            type: string
      responses:
        '200':
          description: A success response with a greeting.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Greeting'
components:
  schemas:
    Greeting:
      type: object
      description: A value with the greeting contents.
      properties:
        message:
          type: string
          description: The string representation of the greeting.
      required:
        - message
```

Swift OpenAPI Generator can be configured to generate:

* Code to make type-safe requests to an API server with any HTTP client library.
* Code to bootstrap an HTTP server with any web framework using business logic that is decoupled from the network requests.

### Generated Client API

The generated code provides a type, named `Client`, which provides a method for each operation defined in the OpenAPI document and can be used with any HTTP library that provides an integration package for Swift OpenAPI Generator.

The plugin produces the generated code at build time in a location determined by the build system. To use the generated code in your project, simply create a `Client` by providing the server URL and HTTP transport you'd like to use.

The following example creates a Greeting Service client that uses URLSession to make the underlying HTTP requests.

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

### Generated Server API Stubs

The generated code provides a Swift protocol, named `APIProtocol`, which defines a method requirement for each operation defined in the OpenAPI document, and is designed to work with any web framework that provides an integration package for Swift OpenAPI Generator.

To implement an API server, define a type that conforms to `APIProtocol`, providing just the business logic for each operation.

To start the API server, use the generated `registerHandlers` function to configure the HTTP server to route the HTTP requests to your handler.

The following example implements the Greeting Service API in a type named `Handler` and configures a Vapor web server to serve the HTTP requests.

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

@main struct Server {
    static func main() async throws {
        let app = Vapor.Application()
        let transport = VaporTransport(routesBuilder: app)
        let handler = Handler()
        try handler.registerHandlers(on: transport, serverURL: URL(string: "/api")!)
        try await app.execute()
    }
}
```

### Package Ecosystem

The Swift OpenAPI Generator project is split across multiple repositories to enable extensibility and minimize dependencies in your project.

* [apple/swift-openapi-generator][swift-openapi-generator-repo]: Swift package plugin and CLI.
* [apple/swift-openapi-runtime][swift-openapi-runtime-repo]: Runtime library used by the generated code.
* [apple/swift-openapi-urlsession][swift-openapi-urlsession-repo]: Client transport using URLSession.
* [swift-server/swift-openapi-async-http-client][swift-openapi-async-http-client-repo]: Client transport using AsyncHTTPClient.
* [swift-server/swift-openapi-vapor][swift-openapi-vapor-repo]: Server transport using Vapor web framework.
* [swift-server/swift-openapi-hummingbird][swift-openapi-hummingbird-repo]: Server transport using Hummingbird web framework.

## Next Steps

To get started, check out the [documentation], which contains [step-by-step tutorials][tutorials].

You can also experiment with [example projects][examples] that use Swift OpenAPI Generator and integrate with other packages in the ecosystem.

Or if you prefer to watch a video, check out [Meet Swift OpenAPI Generator](https://developer.apple.com/wwdc23/10171) from WWDC23.

To ask a question, request a feature, or report a bug, [reach out to us on Github][file-an-issue] 👋.

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
[file-an-issue]: https://github.com/apple/swift-openapi-generator/issues/new/choose
