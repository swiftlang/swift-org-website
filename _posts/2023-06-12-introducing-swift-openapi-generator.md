---
layout: new-layouts/blog
published: true
date: 2023-06-12 11:00:00
title: Introducing Swift OpenAPI Generator
author: [honzadvorsky, simonjbeaumont]
---

We’re excited to announce a set of open source libraries designed to help both client and server developers streamline their workflow around HTTP communication using the industry‑standard OpenAPI specification.

## What is OpenAPI?

[OpenAPI](https://www.openapis.org/) is a specification for documenting HTTP services. An OpenAPI document is written in either YAML or JSON, and can be read by tools to help automate workflows, such as generating the necessary code to send and receive HTTP requests.

By serving as the source of truth, OpenAPI solves the problem of communicating the API contract between a service and its clients. It removes the need to read potentially inaccurate, handwritten documentation, or to observe network traffic, just to figure out the correct way to call a service. It helps you avoid this time‑consuming, repetitive, and error‑prone work – not just when adopting a service for the first time, but also as the service continues to evolve.

To see OpenAPI and its benefits in action, let’s consider a simple service called `GreetingService` that:

* listens for an HTTP `GET` request at the `/greet` endpoint
* with an optional query parameter called `name`,
* and returns the HTTP status code `200 OK`, alongside a JSON body, which might look like this:

```json
{
  "message" : "Hello, Jane!"
}
```

Such a service can be described using the OpenAPI document below:

```yaml
openapi: '3.0.3'
info:
  title: GreetingService
  version: 1.0.0
servers:
  - url: "http://localhost:8080"
    description: "Localhost"
paths:
  /greet:
    get:
      operationId: getGreeting
      parameters:
        - name: name
          in: query
          schema:
            type: string
      responses:
        '200':
          description: A success response with a greeting.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Greeting"
components:
  schemas:
    Greeting:
      properties:
        message:
          type: string
      required:
        - message
```

This simple OpenAPI document defines the structure of the HTTP request and response, including the HTTP method, URL path and query parameters, HTTP status code and content type, and uses [JSON Schema](https://json-schema.org) to describe the structure of the response body.

OpenAPI also allows defining additional details not shown above, such as query items and request bodies (see [OpenAPI 3.0.3 specification](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md) for more details).

## Swift OpenAPI Generator

[Swift OpenAPI Generator](https://github.com/apple/swift-openapi-generator) is a SwiftPM plugin that takes an OpenAPI document and generates either the client code to perform HTTP calls or the server code to handle those calls. The generated code translates between a type‑safe representation of each operation’s input and output, and the underlying HTTP request and response.

So whether developing an app that serves as a client of `GreetingService` or implementing `GreetingService` itself, Swift OpenAPI Generator generates the networking code for you, allowing you to focus on the core logic.

### Adopting the Plugin

To use the Swift OpenAPI Generator plugin, you need to:

1. Add package dependencies for:
    * The package plugin ([swift-openapi-generator](https://github.com/apple/swift-openapi-generator)), which performs code generation at build time
    * The runtime library ([swift-openapi-runtime](https://github.com/apple/swift-openapi-runtime)), which contains protocol definitions used by the generated code and extension libraries
    * A transport implementation, which allows plugging in your chosen HTTP client library or server framework
2. Enable the package plugin on your target and add target dependencies for the runtime and transport libraries.
3. Add the following two files to your target:
    * `openapi.yaml`, the OpenAPI document describing your API.
    * `openapi-generator-config.yaml`, a configuration file for the plugin, which controls whether to generate client or server code.

>Tip: For more information about adopting the plugin in your Swift package or Xcode project, check out our step-by-step [tutorials](https://swiftpackageindex.com/apple/swift-openapi-generator/tutorials/swift-openapi-generator).

### Using a Generated API Client

When developing a client, such as an iOS app, you are provided with two generated types:

* `APIProtocol`, a Swift protocol that contains one method per OpenAPI operation.
    * In the case of `GreetingService`, it contains a single method called `getGreeting`.
* `Client`, a Swift struct that implements `APIProtocol`, which is used to make API calls to the server.

Below is example code to instantiate the client and fetch a greeting from the server:

```swift
import OpenAPIRuntime
import OpenAPIURLSession

// Instantiate your chosen transport library.
let transport: ClientTransport = URLSessionTransport()

// Create a client to connect to a server URL documented in the OpenAPI document.
let client = Client(
    serverURL: try Servers.server1(),
    transport: transport
)

// Make the HTTP call using a type-safe method.
let response = try await client.getGreeting(.init(query: .init(name: "Jane")))

// Switch over the HTTP response status code.
switch response {
case .ok(let okResponse):
    // Switch over the response content type.
    switch okResponse.body {
    case .json(let greeting):
        // Print the greeting message.
        print("👋 \(greeting.message)")
    }
case .undocumented(statusCode: let statusCode, _):
    // Handle HTTP response status codes not documented in the OpenAPI document.
    print("🥺 undocumented response: \(statusCode)")
}
```

>Note: While the sample code above uses the [URLSession-based client transport](https://github.com/apple/swift-openapi-urlsession), there are other client transport implementations, or you can create your own.

### Using Generated API Server Stubs

When developing a server, you get two generated types for use in your code:

* `APIProtocol`, a protocol that contains one method per OpenAPI operation, the same as in the client example above.
* `APIProtocol.registerHandlers`, a method on `APIProtocol` that registers one handler per OpenAPI operation, which calls the `getGreeting` method that you implement.

Below is example code to implement a simple handler and use it to start the server:

```swift
import OpenAPIRuntime
import OpenAPIVapor
import Vapor

// A server implementation of the GreetingService API.
struct Handler: APIProtocol {

    func getGreeting(
        _ input: Operations.getGreeting.Input
    ) async throws -> Operations.getGreeting.Output {
        let message = "Hello, \(input.query.name ?? "Stranger")!"
        let greeting = Components.Schemas.Greeting(message: message)
        return .ok(.init(body: .json(greeting)))
    }
}

// Create the Vapor app.
let app = Vapor.Application()

// Create the transport.
let transport: ServerTransport = VaporTransport(routesBuilder: app)

// Create the request handler, which contains your server logic.
let handler = Handler()

// Register the generated routes on the transport.
try handler.registerHandlers(on: transport)

// Start the server.
try app.run()
```

>Note: While the sample code above uses the [Vapor-based server transport](https://github.com/swift-server/swift-openapi-vapor), there are other server transport implementations, or you can create your own.

## Transport Implementations

Swift OpenAPI Generator works with any HTTP client or server library by abstracting the HTTP library interface in the protocols [`ClientTransport`](https://swiftpackageindex.com/apple/swift-openapi-runtime/documentation/openapiruntime/clienttransport) and [`ServerTransport`](https://swiftpackageindex.com/apple/swift-openapi-runtime/documentation/openapiruntime/servertransport). Similar to projects like [swift-log](https://github.com/apple/swift-log#selecting-a-logging-backend-implementation-applications-only), Swift OpenAPI Generator uses the _API package_ approach for greater extensibility.

Below are some examples of existing transport implementations that you can try out today:

### Client Transport Implementations

* [apple/swift-openapi-urlsession](https://github.com/apple/swift-openapi-urlsession)
* [swift-server/swift-openapi-async-http-client](https://github.com/swift-server/swift-openapi-async-http-client)

### Server Transport Implementations

* [swift-server/swift-openapi-vapor](https://github.com/swift-server/swift-openapi-vapor)
* [swift-server/swift-openapi-hummingbird](https://github.com/swift-server/swift-openapi-hummingbird)

## What’s Next

The project is being open sourced early in its development so the community can provide feedback and help us arrive at a stable 1.0 release.

The initial focus was on implementing features defined by [version 3.0.3](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md) of the OpenAPI specification, with ongoing work toward supporting [OpenAPI 3.1](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md).

While Swift OpenAPI Generator supports most of the commonly used features of OpenAPI, there are still several features left to implement, and progress is tracked publicly using GitHub [issues](https://github.com/apple/swift-openapi-generator/issues).

## Get Involved

Check out the repositories, open issues, pull requests, and let us know what you think in the Swift [forums](https://forums.swift.org/c/server).

* [Meet Swift OpenAPI Generator](https://developer.apple.com/wwdc23/10171) at WWDC23
* Swift OpenAPI Generator: [https://github.com/apple/swift-openapi-generator](https://github.com/apple/swift-openapi-generator)
* Swift OpenAPI Runtime: [https://github.com/apple/swift-openapi-runtime](https://github.com/apple/swift-openapi-runtime)

We’re excited about what Swift OpenAPI Generator can do for the Swift community by reducing the amount of time it takes to connect to an HTTP service or implement one yourself.
