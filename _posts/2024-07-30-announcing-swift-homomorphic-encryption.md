---
layout: post
published: false
date: 2024-07-30 14:00:00
title: Announcing Swift Homomorphic Encryption
author: [fabian-boemer, karl-tarbe, rehan-rishi]
---

We’re excited to announce a new open source Swift package for homomorphic encryption in Swift: [swift-homomorphic-encryption](https://github.com/apple/swift-homomorphic-encryption).
Homomorphic encryption (HE) enables computation on encrypted data without revealing the underlying unencrypted data to the operating process.
Clients can send encrypted data to a server which operates on that encrypted data and generates encrypted responses.
The server never decrypts the original request or even has access to the decryption key.

At Apple, we’re using Swift HE in our own work.
For example, in iOS 18, homomorphic encryption enables the new [Live Caller ID Lookup](https://developer.apple.com/documentation/sms_and_call_reporting/getting_up-to-date_calling_and_blocking_information_for_your_app) feature that provides caller ID and spam blocking services.
Live Caller ID Lookup uses HE to send an encrypted query to a server which provide information about a particular phone number without the server ever knowing that phone number.
To demonstrate this, we are also sharing [live-caller-id-lookup-example](https://github.com/apple/live-caller-id-lookup-example), which provides a functional example backend to test the Live Caller ID Lookup feature using homomorphic encryption.

These packages take full advantage of features such as:
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
A typical HE workflow might be:
* The client encrypts its sensitive data and sends the result to the server.
* The server performs HE computation on the ciphertext (and perhaps its own plaintext inputs), without learning what any ciphertext decrypts to.
* The server sends the resulting ciphertext response to the client.
* The client decrypts to learn the response.

Swift Homomorphic Encryption implements the Brakerski-Fan-Vercauteren (BFV) HE scheme ([https://eprint.iacr.org/2012/078.pdf](https://eprint.iacr.org/2012/078.pdf), [https://eprint.iacr.org/2012/144](https://eprint.iacr.org/2012/078.pdf)).
BFV is based on the ring learning with errors (RLWE) hardness problem, which is quantum resistant.
In line with Apple’s [transition](https://security.apple.com/blog/imessage-pq3/) to post-quantum security, the Live Caller ID feature requires BFV parameters with post-quantum 128-bit security.

## Using Homomorphic Encryption
Homomorphic Encryption is useful for a wide variety of standalone privacy-preserving applications both inside and outside the Apple ecosystem, including private set intersection, secure aggregation, and machine learning.

We look forward to working with others to enhance this package: you can read more about contributing at the repositories on GitHub.
We also encourage you to file issues to [swift-homomorphic-encryption](https://github.com/apple/swift-homomorphic-encryption/issues) and [live-caller-id-lookup-examples](https://github.com/apple/live-caller-id-lookup-example/issues) if you encounter any problems or have suggestions for improvements.

We’re excited to see how homomorphic encryption can empower developers and researchers in the Swift community to enable new use-cases!