---
layout: new-layouts/post
published: true
date: 2025-10-06 10:00:00
title: "Introducing Swift Profile Recorder: Identifying Performance Bottlenecks in Production"
author: [weissi, mitchellallison]
category: "Developer Tools"
---

# Introducing Swift Profile Recorder: Identifying Performance Bottlenecks in Production


[Swift Profile Recorder](https://github.com/apple/swift-profile-recorder), an in-process sampling profiler for Swift services, is now available as an open source project.

Profiling is a powerful technique for understanding the performance, resource usage, and behavior of your applications. With Swift Profile Recorder, profiling can now be added to your Swift services by simply adding a package dependency and no additional setup. Swift Profile Recorder enables you to:

* **Adopt profiling without extra privileges or system dependencies**, allowing you to add profiling across a variety of compute environments with constrained permissions.
* **Collect samples using `curl`**, allowing you to easily read profiler output via an HTTP endpoint without needing to learn specific tooling like perf, sample, DTrace, or eBPF (bpftrace).
* **Integrate with existing tools for visualization and analysis** by supporting multiple industry-standard formats, including Linux perf script format, both the pprof file format as well as the `/debug/pprof/profile` endpoints, and also the collapsed format as used by the original FlameGraphs.

Apple has used Swift Profile Recorder at scale for several years as a tool for operating and debugging Swift services in production. Alongside the recent announcement of [swift-parca](https://forums.swift.org/t/announcing-swift-parca-low-overhead-continuous-profiling-for-swift-on-server/81823), the Swift server ecosystem now has multiple profiling tools and approaches.

## What is profiling and why does it matter?

Profiling enables you to understand where your Swift application spends its time — whether it's computing, waiting for a lock acquisition, or blocked in file I/O. Profiling is achieved by collecting samples of activity, which provide insight into how it's being used.

Modern operating systems have tooling available to profile your applications or even the whole system. Examples include Apple's Instruments, `sample`, and Linux's `perf`. Furthermore, there are kernel systems like DTrace or eBPF that can be used to profile your applications. 

The community recently contributed [swift-parca](https://github.com/ordo-one/swift-parca), which plugs into Parca Agent, leveraging Parca Agent and eBPF on Linux to profile your application continuously. These samples are then aggregated on a centralized [Parca](https://www.parca.dev) server. This is a great tool which we hope many deployments can leverage today. But there are a few constraints which may impact wider adoption:


* Special privileges are required to attach to another process or load an eBPF/DTrace program into the kernel
* Linux distributions may require additional components to enable this functionality
* The available profiling technologies differ significantly between operating systems


To enable more teams to profile their applications, Swift Profile Recorder takes a different approach --- it runs from within your process, implemented as a Swift Package. This means it can profile your code even in environments where external profiling tools can't operate. You also won't need to install other system components, you won't need extra privileges, and the approach can work on different operating systems — right now Swift Profile Recorder supports macOS and Linux.


## Profiling Swift services at Apple

Apple extensively uses Swift on server to build distributed systems providing storage and compute at a huge scale. These systems power the build and test infrastructure for the development of Apple's operating systems. Our client workloads are latency-sensitive, so we soon found a need to further instrument the code to understand performance bottlenecks.

This infrastructure runs in a sandboxed environment where we don’t have access to tools such as eBPF. Additionally, components of our infrastructure run atop macOS. So we built Swift Profile Recorder to give better insights into non-optimal code.

We use Swift Profile Recorder in two ways for the above infrastructure use case:

* To safely diagnose specific and isolated instances of performance regressions
* To gather a large number of samples across all of our infrastructure to identify common patterns, also known as Continuous Profiling

## Getting started

Adding Swift Profile Recorder to your application requires minimal setup:

```
// In your Package.swift
.package(url: "https://github.com/apple/swift-profile-recorder.git", .upToNextMinor(from: "0.3.0"))

// In your target dependencies
.product(name: "ProfileRecorderServer", package: "swift-profile-recorder")
```

Then, in your application's main function:

```
import ProfileRecorderServer

@main
struct YourApp {
    func run() async throws {
        // Start the profiling server in the background
        async let _ = ProfileRecorderServer(configuration: .parseFromEnvironment()).runIgnoringFailures(logger: logger)

        // Your application code continues here
    }
}
```

Enable profiling through environment variables:

Assuming you specified `configuration: .parseFromEnvironment()` you will have to set an environment variable to activate the profiling server:

`PROFILE_RECORDER_SERVER_URL_PATTERN=unix:///tmp/my-app-samples-{PID}.sock ./my-app`

Collect samples with a simple curl command:

```
curl --unix-socket /tmp/my-app-samples-12345.sock \
     -sd '{"numberOfSamples":1000,"timeInterval":"10ms"}' \
     http://localhost/sample | swift demangle --compact > samples.perf
```


## Visualization and Integration

The generated profiles work seamlessly with popular visualization tools:


* Speedscope ([speedscope.app](https://speedscope.app)): Drag and drop your `.perf` file for instant flame graph visualization
* Firefox Profiler ([profiler.firefox.com](https://profiler.firefox.com)): Upload your profile for detailed timeline analysis ([example profile](https://profiler.firefox.com/public/4em11dgq8xkr1gxetzv8sfmrexam2tvvgh8c4f0/flame-graph/?globalTrackOrder=0&hiddenLocalTracksByPid=56427-03wc&localTrackOrderByPid=56427-024wc31&thread=1&timelineType=category&v=11))
* Traditional FlameGraph tools: Use Brendan Gregg's original [FlameGraph scripts](https://github.com/brendangregg/FlameGraph) for custom visualizations
* Many other tools compatible with the common `.perf`, `.pprof` or stack collapsed formats

An example running Hummingbird's [`hello` example](https://github.com/hummingbird-project/hummingbird-examples/tree/main/hello) on macOS visualized in Speedscope can be seen below

![a flamegraph showing Hummingbird's hello example running on macOS](/assets/images/2025-09-27-profile-recorder--macos-hummingbird-hello.png)


Swift Profile Recorder can also be used a source to send samples to [Parca](https://parca.dev) as well as [Pyroscope](https://pyroscope.io). If your production environment allows you to install system-wide profiling using eBPF, we would recommend to use Parca Agent together with [swift-parca](https://github.com/ordo-one/swift-parca).


## Community and feedback

Swift Profile Recorder is an open source project and we're eager to hear from the Swift community. Whether you're running Swift applications in Kubernetes, investigating performance issues, or simply curious about where your application spends its time, we'd love to know how Swift Profile Recorder works for you. For example, it should be possible to integrate Swift Profile Recorder into a lambda function. We look forward to hearing how you use the profiler.

The project is actively developed and we welcome contributions, bug reports, and feature requests. As with any profiling tool, different applications and environments present unique challenges, and community feedback is essential for improving the profiler's effectiveness across diverse Swift codebases.

Ready to start profiling? Visit the [Swift Profile Recorder repository](https://github.com/apple/swift-profile-recorder) to get started. We also encourage you to discuss the project on the Swift forums, including asking questions about this post on the [associated thread](https://forums.swift.org/t/introducing-swift-profile-recorder-identifying-performance-bottlenecks-in-production/82536), and sharing your experiences in the [Swift Profile Recorder category](https://forums.swift.org/c/related-projects/swift-profile-recorder/124).
