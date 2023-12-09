---
layout: post
published: true
date: 2023-12-09 10:00:00
title: Benchmarking in Swift
author: [hassila]
---

The "why" of the need of benchmarking and performance testing (especially given Swifts goal of _Predictable and consistent performance that is on-par with C-based languages_) - and a special focus on why we'd want multidimensional performance metrics (e.g. mallocs, syscalls, ...) and not just runtime performance.
together with a mention of the projects above that have initially adopted the benchmark package

### Performance friction

### Benchmarking workflows 
Examples of major workflows that are useful for benchmarking

### Sample Benchmark
Sample code of a small benchmark showing how it can be written

### Benchmark output and analytics
Sample screenshots of different kinds of output from such a benchmark

###
References to the package-benchmark documentation on SPI and to any further reading


### Community
The Benchmark package has recently seen a fairly wide community uptake as more projects gives more focus to performance, including e.g.
[SwiftNIO](https://github.com/apple/swift-nio), [Swift Foundation](https://github.com/apple/swift-foundation), [Google Flatbuffers](https://github.com/google/flatbuffers), [GRPC Swift](https://github.com/grpc/grpc-swift), [Swift ASN1](https://github.com/apple/swift-asn1), [Swift Certificates](https://github.com/apple/swift-certificates) and [Swift Kafka Client](https://github.com/swift-server/swift-kafka-client).

### Summary

Performance is a non-functional key feature for many software systems, early and continuous benchmarking will 
help you to ship software with consistent performance and controlled resource usage.

The [Benchmark package](https://github.com/ordo-one/package-benchmark) allows you to easily create sophisticated Swift performance benchmarks, with [full documentation being available online at the Swift Package Index](https://swiftpackageindex.com/ordo-one/package-benchmark/1.13.0/documentation/benchmark)
