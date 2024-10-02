---
layout: new-layouts/blog
published: true
date: 2024-07-30 10:00:00
title: Announcing Swift Homomorphic Encryption
author: [fabian-boemer, karl-tarbe, rehan-rishi]
---

We’re excited to announce a new open source Swift package for homomorphic
encryption in Swift:
[swift-homomorphic-encryption](https://github.com/apple/swift-homomorphic-encryption).

Homomorphic encryption (HE) is a cryptographic technique that enables
computation on encrypted data _without_ revealing the underlying unencrypted
data to the operating process. It provides a means for clients to send encrypted
data to a server, which operates on that encrypted data and returns a result
that the client can decrypt. During the execution of the request, the server
itself never decrypts the original data or even has access to the decryption
key. Such an approach presents new opportunities for cloud services to operate
while protecting the privacy and security of a user's data, which is obviously
highly attractive for many scenarios.

At Apple, we’re using homomorphic encryption in our own work; we're therefore
delighted to share this Swift implementation in the community for others to use
and contribute to.

One example of how we're using this implementation in iOS 18, is the new [Live
Caller ID
Lookup](https://developer.apple.com/documentation/sms_and_call_reporting/getting_up-to-date_calling_and_blocking_information_for_your_app)
feature, which provides caller ID and spam blocking services. Live Caller ID
Lookup uses homomorphic encryption to send an encrypted query to a server that
can provide information about a phone number without the server knowing the
specific phone number in the request. To demonstrate this, we are also sharing
[live-caller-id-lookup-example](https://github.com/apple/live-caller-id-lookup-example),
which provides a functional example backend to test the Live Caller ID Lookup
feature using homomorphic encryption.

These two packages take full advantage of features such as:
* [Swift on Server](https://www.swift.org/documentation/server/), including the Hummingbird HTTP framework and cross-platform support
* easy benchmarking with the [Benchmark](https://github.com/ordo-one/package-benchmark) library
* performant low-level cryptography primitives in [Swift Crypto](https://github.com/apple/swift-crypto).

## Private Information Retrieval (PIR)
Live Caller ID Lookup relies on *Private Information Retrieval (PIR)*, a form of private key-value database lookup.
In the PIR setting, a client has a private keyword (such as a phone number) and wants to retrieve the associated value from a server.
Because the keyword is private, the client wants to perform this lookup without the server learning the keyword.

A trivial implementation of PIR is to have the server send the entire database to the client for local processing.
While this does prevent the server from knowing what queries are being made, it is only feasible for small databases with infrequent updates.

In contrast, our PIR implementation, which relies on homomorphic encryption, only needs to sync a small amount of database metadata with the client.
This metadata changes infrequently, which allows efficient handling of very large databases with a high volume of updates.

## Homomorphic Encryption
As mentioned above, homomorphic encryption enables computation on encrypted data without decryption or access to the decryption key.

A typical workflow for homomorphic encryption might be as follows:
* The client encrypts its sensitive data and sends the result to the server.
* The server performs computation on the ciphertext (perhaps incorporating its
  own plaintext inputs), without learning what any ciphertext decrypts to.
* The server sends the resulting ciphertext response to the client.
* The client decrypts the resulting response.

The Swift implementation of homomorphic encryption implements the
Brakerski-Fan-Vercauteren (BFV) HE scheme
([https://eprint.iacr.org/2012/078](https://eprint.iacr.org/2012/078),
[https://eprint.iacr.org/2012/144](https://eprint.iacr.org/2012/144)). BFV
is based on the ring learning with errors (RLWE) hardness problem, which is
quantum resistant.

The Live Caller ID Lookup feature requires BFV parameters
with post-quantum 128-bit security, to provide strong security against both classical and
potential future quantum attacks, previously explained in [https://security.apple.com/blog/imessage-pq3/](https://security.apple.com/blog/imessage-pq3/).

## Using Homomorphic Encryption
We believe developers will find homomorphic encryption useful for a wide variety
of standalone privacy-preserving applications both inside and outside the Apple
ecosystem, including private set intersection, secure aggregation, and machine
learning.

Below is a basic example for how to use Swift Homomorphic Encryption.
```swift
import HomomorphicEncryption

// We start by choosing some encryption parameters for the Bfv<UInt64> scheme.
// *These encryption parameters are insecure, suitable for testing only.*
let encryptParams =
    try EncryptionParameters<Bfv<UInt64>>(from: .insecure_n_8_logq_5x18_logt_5)
// Perform pre-computation for HE computation with these parameters.
let context = try Context(encryptionParameters: encryptParams)

// We encode N values using coefficient encoding.
let values: [UInt64] = [8, 5, 12, 12, 15, 0, 8, 5]
let plaintext: Bfv<UInt64>.CoeffPlaintext = try context.encode(
    values: values,
    format: .coefficient)

// We generate a secret key and use it to encrypt the plaintext.
let secretKey = try context.generateSecretKey()
let ciphertext = try plaintext.encrypt(using: secretKey)

// Decrypting the plaintext yields the original values.
let decrypted = try ciphertext.decrypt(using: secretKey)
let decoded: [UInt64] = try decrypted.decode(format: .coefficient)
precondition(decoded == values)
```

We look forward to working with others to enhance this package: you can read more about contributing at the repositories on GitHub.
We also encourage you to file issues to [swift-homomorphic-encryption](https://github.com/apple/swift-homomorphic-encryption/issues) and [live-caller-id-lookup-examples](https://github.com/apple/live-caller-id-lookup-example/issues) if you encounter any problems or have suggestions for improvements.

We’re excited to see how homomorphic encryption can empower developers and
researchers in the Swift community to enable new use cases!
