---
layout: post
published: true
date: 2023-12-21 10:00:00
title: Benchmarking in Swift
author: [hassila]
---

Have you ever encountered a _performance problem_ that slipped through to end users which resulted in a bug report? Do you systematically measure and validate performance metrics when making changes to your Swift package?

In the realm of professional trading software, the role of a comprehensive benchmarking framework integrated with Continuous Integration (CI) parallels the importance of unit and integration testing. Just as unit and integration tests are essential for ensuring the functional correctness of software, benchmarking within a CI pipeline is crucial for continuously validating the non-functional aspects, such as high throughput, low latency, predictable performance and consistent resource usage. This is vital for maintaining the competitive edge in a fast-paced financial environment where the extreme market data rates and performance requirements means that even small variations in response time - on the scale of microseconds - can significantly impact trade outcomes.

After examining the existing infrastructure within the Swift ecosystem, we concluded that there were no existing solutions meeting our needs for multi-platform and rich metrics support, CI integration, and developer-friendliness. Therefore, we decided to develop a  [Benchmark package](https://github.com/ordo-one/package-benchmark) and open-source it, believing it could help advance performance for the Swift community and benefit all of us.

### The role of benchmarks 

Constructing a set of benchmarks and consistently running them provides an indication when something is not performing as expected. Typically, other more specialized tools are employed for root-cause analysis to analyze and fix the problem (e.g., Instruments, DTrace, Heaptrack, Leaks, Sample, …).

This is analogous to unit tests, where a failed test indicates that something is wrong, and other more specialized tools are used to fix the problem (e.g., a debugger, TSAN/ASAN, adding asserts, debug printouts, …).

The open-source [Benchmark package](https://github.com/ordo-one/package-benchmark) helps you automate performance testing and makes it easy for individual developers to run a quick performance validation locally before pushing changes.

It is suitable both for microbenchmarks mostly concerned with CPU usage as well as for more complex long-running benchmarks focused on [multiple performance metrics](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/metrics) and supports measuring a wide range of samples over a long time thanks to using the [HDR Histogram](https://github.com/HdrHistogram/hdrhistogram-swift) package.

### Benchmarking infrastructure
The Benchmark package is implemented as a SwiftPM command plugin and adds a dedicated command to interact with benchmarks:

> ```swift package benchmark``` 

Introductory getting started information is available both on the [package GitHub page](https://github.com/ordo-one/package-benchmark) as well as in the [Swift Package Index DocC documentation](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/gettingstarted).

### A sample benchmark

There's an [introduction to writing benchmarks](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/writingbenchmarks) as well as a [sample repository](https://github.com/ordo-one/package-benchmark-samples), but a minimalistic and one more complex benchmark could look like:

```swift
import Benchmark
import Foundation
import Histogram

let benchmarks = {
    // Minimal benchmark with default settings
    Benchmark("Foundation-Date") { benchmark in
        for _ in benchmark.scaledIterations {
            blackHole(Foundation.Date())
        }
    } 

    // Slightly more complex with some customization
    let customBenchmarkConfiguration: Benchmark.Configuration = .init(
        metrics: [
            .wallClock,
            .throughput,
            .syscalls,
            .threads,
            .peakMemoryResident
        ],
        scalingFactor: .kilo
    )

    Benchmark("ValueAtPercentile", configuration: customBenchmarkConfiguration) { benchmark in
        let maxValue: UInt64 = 1_000_000

        var histogram = Histogram<UInt64>(highestTrackableValue: maxValue, 
                                          numberOfSignificantValueDigits: .three)

        for _ in 0 ..< 10_000 {
            blackHole(histogram.record(UInt64.random(in: 10 ... 1_000)))
        }

        let percentiles = [0.0, 25.0, 50.0, 75.0, 80.0, 90.0, 99.0, 100.0]

        benchmark.startMeasurement() // don't measure the setup cost above

        for i in benchmark.scaledIterations {
            blackHole(histogram.valueAtPercentile(percentiles[i % percentiles.count]))
        }

        benchmark.stopMeasurement()
    }
}
```

### Performance metrics
Performance is a key non-functional requirement for many foundational packages and applications, both server-side and in the desktop/mobile space. 

Swift's ambitious aspirations are that the language should provide:

> _Predictable and consistent performance that is on-par with C-based languages_

Performance is a function of how well we use the constrained machine resources to run our program - and there are several that directly impact the runtime of different applications and workloads:
 
* CPU
* Memory allocator (number of allocations/frees, amount of memory allocated)
* Memory management (ARC traffic)
* Memory footprint (e.g., transient peak RSS/VSS)
* Network bandwidth
* I/O (syscalls as well as amount of data written)
* Kernel (overall syscalls, thread scheduling, peak thread usage)
* Custom performance metrics (for other constrained resources)

Each one of these can be critical for a given piece of software. For certain kinds of foundational packages you may also want to keep strict control on certain performance metrics (e.g., ensuring that you don't regress on malloc usage or memory footprint), not only runtime performance. 

Importantly, the Benchmark package supports several of these metrics out-of-the-box including some OS specific ones (i.e. on Linux/macOS).

### Benchmark output and analytics

The default output is in a table format for human readability, but the package [supports a range of different output formats](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/exportingbenchmarks) with output suitable for analysis with other visualization tools.

Sample default output when running benchmarks:

<img
  alt="Sample text output for benchmarks"
  src="/assets/images/benchmark-blog/Benchmark.png" />

### Key Benchmark workflows are supported

* **[Automated Pull Request performance regression checks](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/comparingbenchmarksci)** by comparing the performance metrics of a pull request with the main branch and having the PR workflow check fail if there is a regression according to absolute or relative thresholds specified per benchmark
* Automated Pull Request check vs. a pre-recorded *absolute baseline p90 threshold* (see e.g., [Swift Certificates](https://github.com/apple/swift-certificates/tree/main/Benchmarks) for such a workflow with [related Docker files](https://github.com/apple/swift-certificates/tree/main/docker)), suitable for e.g., malloc regression tests
* **[Manual comparison of multiple performance baselines](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/creatingandcomparingbaselines)** for iterative or A/B performance work by an individual developer
* **[Export of benchmark results in several formats](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark/exportingbenchmarks)** for analysis or visualization
* Running the Instruments profiler [on the benchmark suite executable directly from Xcode](https://github.com/ordo-one/package-benchmark/releases/tag/1.11.0)

### Community Adoption
The Benchmark package has recently seen a wide community uptake as more projects focus on performance, including e.g.,
[SwiftNIO](https://github.com/apple/swift-nio), [Swift Foundation](https://github.com/apple/swift-foundation), [Swift Package Manager](https://github.com/apple/swift-package-manager), [Google Flatbuffers](https://github.com/google/flatbuffers), [GRPC Swift](https://github.com/grpc/grpc-swift), [Swift ASN1](https://github.com/apple/swift-asn1), [Swift Certificates](https://github.com/apple/swift-certificates) and [Swift Kafka Client](https://github.com/swift-server/swift-kafka-client). 

Discussions and questions are best directed to [the Swift forums section for Benchmark](https://forums.swift.org/c/related-projects/benchmark/105).

### Summary

Performance is a key non-functional requirement for many software packages. Early and continuous benchmarking will help you to ship software with consistent performance and controlled resource usage that delights your users.

The [Benchmark package](https://github.com/ordo-one/package-benchmark) allows you to easily create sophisticated Swift performance benchmarks - with [full documentation being available online at the Swift Package Index](https://swiftpackageindex.com/ordo-one/package-benchmark/documentation/benchmark) - providing much of the scaffolding required for benchmarking:

* Support for a wide range of performance metrics, not just CPU
* Quickly run individual benchmarks from the command line during iterative development
* Support for local baselines for individual contributor workflows (simple A/B/C testing)
* Support for CI integration
* Minimal boilerplate
* Easy integration in your project 
* Support for async benchmarks
* Multiple output formats supporting interoperability with other tools, e.g. JMH analytics and HDR histogram output
