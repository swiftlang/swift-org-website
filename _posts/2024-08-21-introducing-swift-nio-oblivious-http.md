---
layout: new-layouts/blog
published: true
date: 2024-08-21 10:00:00
title: Introducing Oblivious HTTP support in Swift
author: [corybenfield]
---

We’re excited to introduce an implementation of provisional support for Oblivious HTTP to the Swift ecosystem, with the availability of a new package called [SwiftNIO Oblivious HTTP](https://github.com/apple/swift-nio-oblivious-http).

[Oblivious HTTP](https://www.rfc-editor.org/rfc/rfc9458.html) is a protocol to allow a client to make requests of a server without the server being able to identify the source of those requests. Conventional HTTP requests can reveal identifying information about the client such as the originating IP address, and can allow multiple requests from the same client to be identified as originating from the same node. In contrast, Oblivious HTTP provides a secure mechanism for protecting identifying client information, achieved by combining HTTP message encryption with a trusted third party relay service, providing increased privacy to users without incurring a significant performance overhead.

Oblivious HTTP is a vital foundational technology that supports an emerging range of privacy-preserving networking technologies, including proposals for [enhancing privacy in DNS](https://www.rfc-editor.org/rfc/rfc9230.html). At Apple, we’re also using it to enable the industry-leading privacy of Apple devices into the cloud with [Private Cloud Compute](https://security.apple.com/blog/private-cloud-compute/). Oblivious HTTP helps ensure that personally identifiable data about the requesting source is never available to the device processing the request. It also hardens the system against attempts to target an individual’s personal data requests.

## SwiftNIO Oblivious HTTP

The package we’re releasing today is still in active development, and forms part of the [SwiftNIO project](https://github.com/apple/swift-nio) for development of maintainable high-performance network code. It supports two separate standards:

* An implementation of [RFC 9292](https://www.rfc-editor.org/rfc/rfc9292.html), which standardizes a binary representation for serializing HTTP.
* An implementation of [RFC 9457](https://www.rfc-editor.org/rfc/rfc9458.html), which defines Oblivious HTTP itself.

These two implementations can either used together or separately; they enable Swift *clients* to use services that rely on Oblivious HTTP, as well as enabling Swift *servers* to implement the specification.

The package itself is split into two libraries:

1. The headline library `OblivousHTTP` provides an implementation of the binary HTTP encoding scheme from RFC 9292 required to implement Oblivious HTTP, as well as bindings to that scheme for SwiftNIO.
2.  The second library `ObliviousX` provides more generalizable APIs that form the basis of the encryption scheme used by Oblivious HTTP, but which can also be applied to other encodings of your choice.

### Binary HTTP Encoding

The Binary HTTP representation from RFC 9292 defines a mechanism to serialize and deserialize an abstract HTTP message that does not rely on a specific wire format, such as HTTP/1.1 or HTTP/2. SwiftNIO Oblivious HTTP offers a very simple serialization and deserialization API. As an example of how to use the API to serialize and deserialize:

```swift
import ObliviousHTTP
import NIOCore
import NIOHTTP1

let serializer = BHTTPSerializer()
var buffer = ByteBuffer()
serializer.serialize(.request(.head(.init(method: .GET))), into: &buffer)
serializer.serialize(.request(.body(payload)), into: &buffer)
serializer.serialize(.request(.end(nil)), into: &buffer)

var parser = BHTTPParser(role: .server)
parser.append(buffer)
parser.completeBodyReceived()

while let message = try parser.nextMessage() {
    print(message)
}
```

### Oblivious Encapsulation

The Oblivious HTTP specification marries the binary serialization format for HTTP with an encryption scheme built on top of [Hybrid Public Key Encryption (HPKE)](https://www.rfc-editor.org/rfc/rfc9180.html). This encryption scheme is entirely general, so it may be used for any arbitrary data in addition to binary HTTP messages.

The `ObliviousX` library provides a complete series of APIs for working with this encapsulation scheme. They come in two flavours: single-shot functions, that implement the OHTTP scheme from RFC 9457, and streaming flavours that implement the scheme [defined in the draft chunked OHTTP specification](https://datatracker.ietf.org/doc/draft-ietf-ohai-chunked-ohttp/). As an example of the use of the one-shot APIs:

```swift
import ObliviousX

// Encryption

let message = Data("Hello, this is my secret message".utf8)
let (encapsulatedRequest, sender) = OHTTPEncapsulation.encapsulateRequest(
    keyID: serverKeyID,
    publicKey: serverPublicKey,
    ciphersuite: .P256_SHA256_AES_GCM_256,
    mediaType: "text/plain",
    content: message
)

// Decryption
let (header, consumedBytes) = OHTTPEncapsulation.parseRequestHeader(
    encapsulatedRequest: encapsulatedRequest
)
assert(header.keyID == serverKeyID)
assert(header.kem == .P256_HKDF_SHA256)
assert(header.kdf == .HKDF_SHA256)
assert(header.aead == .AES_GCM_256)

let decapsulator = OHTTPEncapsulation.RequestDecapsulator(
    requestHeader: header,
    message: encapsulatedRequest.dropFirst(consumedBytes)
)
let (deEncapsulated, context) = try decapsulator.decapsulate(
    mediaType: "text/plain",
    privateKey: serverPrivateKey
)

assert(deEncapsulated == message)
```

## What’s Next

This package is released in an early development stage to solicit feedback and contributions. You can get started by trying out the [SwiftNIO Oblivious HTTP library](https://github.com/apple/swift-nio-oblivious-http) on GitHub, as well as join us on [the Swift forums](https://forums.swift.org/) to discuss the library and suggest improvements.

While the core encryption scheme is believed to work well, we’re still completing design work for the complete set of bindings for Binary HTTP and Oblivious HTTP. In addition, the following items are on our roadmap:

1. Producing a better binding to SwiftNIO, in the form of ChannelHandlers that can be dropped into the ChannelPipeline.
2. Producing versions of BinaryHTTP that use [swift-http-types](https://github.com/apple/swift-http-types) instead of SwiftNIO’s types, for better composition with the rest of the Swift ecosystem and potentially remove the need to depend on SwiftNIO at all.
3. Final support for chunked Oblivious HTTP, when that draft is finalized at the IETF.
4. Other API tweaks to support a wider range of use cases.

We welcome community feedback at this stage of the design process, as well as contributions in the form of pull requests and issues, as we work to refine support over the coming months and deliver greater privacy protections to the foundations of the modern internet.
