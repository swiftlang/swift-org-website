---
layout: page-wide
title: Swift.org API Documentation
---

The Swift.org website provides HTTP APIs that vends information about toolchain releases and Swift evolution proposals.

The APIs are documented using [OpenAPI](https://www.openapis.org).

## Browsable API documentation

Rendered documentation of the APIs can be browsed [here](./openapi.html).

## Downloadable OpenAPI documents

The machine-readable document can be downloaded from the following URLs:

- swift.org API: [`https://swift.org/openapi/swiftorg.yaml`](swiftorg.yaml)
- download.swift.org API: [`https://swift.org/openapi/downloadswiftorg.yaml`](downloadswiftorg.yaml)

## Generating a client in Swift

You can generate a type-safe client from OpenAPI documents using [Swift OpenAPI Generator](https://github.com/apple/swift-openapi-generator).

## Tools using the Swift.org APIs

- [swiftly](https://github.com/swiftlang/swiftly)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
