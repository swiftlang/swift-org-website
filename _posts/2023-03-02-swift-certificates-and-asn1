---
layout: post
published: true
date: 2023-03-02 9:00:00
title: Introducing Certificates and ASN.1
author: [corybenfield]
---

I'm thrilled to announce two new open-source Swift packages: Swift Certificates and Swift ASN.1. Together, these libraries unlock a wide range of use-cases. Most importantly, they will provide Swift developers a faster and safer implementation of X.509 certificates, a critical technology that powers the security of TLS.

The rest of this post will explore what these libraries do in some detail, but if you’d like to dive in straight away then feel free to head over to [swift-asn1](https://github.com/apple/swift-asn1) or [swift-certificates](https://github.com/apple/swift-certificates) to get started.

## What are X.509 certificates?

X.509 certificates are a commonly-used identity format to cryptographically attest to the identity of an actor in a system. They form part of the X.509 standard created by the ITU-T for defining a public key infrastructure (PKI). X.509-style PKIs are commonly used in cases where it is necessary to delegate the authority to attest to an actor's identity to a small number of trusted parties (called Certificate Authorities). Most of us experience X.509 in the form of TLS certificates, but they have a wide range of other uses, such as code-signing and token exchange.

Server-side applications work with X.509 certificates as a matter of course. At a bare minimum, most web servers will load a TLS certificate to secure their network connections. However, many more complex use-cases exist, from dynamically provisioning TLS certificates using [ACME](https://www.rfc-editor.org/rfc/rfc8555.html) to validating identities using x5c. This makes a fully-featured X.509 library a powerful asset for a server-side ecosystem.

## What is ASN.1?

X.509 certificates are a complex data type that has gone through a number of versions. The layout of the X.509 certificate type is defined using a data type definition language called ASN.1 (Abstract Syntax Notation One). ASN.1 is absolutely everywhere in telecommunications, and finds its way into a number of other domains.

ASN.1 is extremely flexible and complex. Types can be defined and recursively referenced. Fields can be named and tagged. Fields can be optional or defaulted. Human readable comments can be applied, often applying further constraints on top of what ASN.1 is capable of expressing.

ASN.1 is the name of the format used to define the types, but there is more than one way of serializing an ASN.1 type. These methods are called “encoding rules”, and there are a lot of them. The vast majority of cryptographic use-cases for ASN.1 use the Distinguished Encoding Rules (DER) or the Basic Encoding Rules (BER).

For the certificates use-case, the fact that X.509 certificates are defined in ASN.1 and serialized using DER means that in order to provide a powerful, safe, Swift-native X.509 library, we needed to build out an ASN.1 library as well.

## Swift ASN.1

Swift ASN.1 provides two major pieces of functionality: an implementation of the common ASN.1 currency types, and an implementation of DER serialization and deserialization. This is sufficient for implementation of the majority of the cryptographic use-cases for DER, including for swift-certificates.

Swift ASN.1 provides these security-critical parsing and serializing services using entirely memory-safe code with low overhead. This approach provides great performance and safety. Making this parser safe is particularly valuable, as a major goal of DER parsers is to parse untrusted user input. Memory safety issues in ASN.1 parsing are commonly extremely high severity.

While Swift ASN.1 is very capable, it is going to evolve substantially in the future. In particular, it has a few areas of future growth:

1. Supporting an ASN.1 compiler.
    
    Currently, Swift ASN.1 requires users to construct the ASN.1 parse and serialize functions by hand. This is not ideal: it’s labour-intensive, and forces users to understand ASN.1 deeply. ASN.1 compilers can automatically generate the type definitions corresponding to an ASN.1 module.
    
    Much like for Protobuf, Codable is a poor fit for ASN.1 due to the extra information that Codable cannot easily provide (such as tag information). That information can be provided to a Codable implementation, but to do it requires the ASN.1 compiler to inform the Encoder/Decoder of the extra information, and by the time we’re doing that we may as well have the ASN.1 compiler simply emit the serialization/deserialization code directly.
    
    A future extension for swift-asn1 will be to enhance it with the addition of an ASN.1 compiler.  This could be written from scratch, or bootstrapped using an existing compiler, such as the one from [Heimdal](https://github.com/heimdal/heimdal).

2. BER support.
    
    Currently, only DER is required for the immediate ASN.1 use-case of X.509. Going forward, it’s likely that other use-cases will call for supporting at least decoding BER, if not producing it as well. ASN.1 has been designed to support that extension point, and users will likely want to add it.

## Swift Certificates

Swift Certificates has been released at an early stage in order to get community feedback, so it’s missing some functionality that will be required for widespread use. Right now it can:

1. Parse the majority of X.509 certificates that comply with RFC 5280 and are used in the Web PKI.
2. Perform X.509 chain building.
3. Support pluggable X.509 verification policies.
4. Support pluggable OCSP resolution.

We still have a lot of functionality to add before we go to v1.0. We’ll know we’re ready to tag a v1.0 when we have a sufficiently robust X.509 verifier that we can safely support the WebPKI use-case. This will mean tackling the remaining certs we know we cannot parse, and building out the verifier policies.

Our medium-term goal is to replace swift-nio-ssl’s BoringSSL-based X.509 implementation with Swift Certificates. This should provide substantial performance improvements to all applications using TLS, as well as adding memory safety to this substantial attack surface. We also intend to add support for Certificate Signing Requests, opening up the door for more automated interaction with certificate issuance services.

## Get involved!

Please keep an eye on the repositories ([swift-certificates](https://github.com/apple/swift-certificates), [swift-asn1](https://github.com/apple/swift-asn1)), open issues and pull requests, and try to use the code and report back! We’re really excited for what Swift Certificates can do for the Swift community, and we look forward to seeing it unlock a wide range of new use-cases and technologies.

