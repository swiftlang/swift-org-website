---
redirect_from: "server/guides/allocations"
layout: new-layouts/base
title: Allocations
---

## Overview
In server-side Swift applications, memory allocations are fundamental for various tasks like creating objects, manipulating data structures, and managing resources. Swift allocates memory resources as needed and provides built-in memory management mechanisms, such as automatic reference counting (ARC), to handle allocations, deallocations, and memory ownership.

Allocations aid in optimizing memory usage by allocating the precise amount of memory required for each object or data structure, reducing memory wastage and improving application performance. However, Swift allocations can be padded to enforce memory alignment requirements for data types or structures that need to be accessed efficiently by the hardware, reducing the risk of misaligned memory access issues and improving performance.

Additionally, proper allocation management prevents memory leaks and ensures that memory is released when it is no longer needed. This helps in maintaining the stability and reliability of server applications.

## Heaps and stacks
Generally speaking, Swift has two fundamental locations for memory allocations: **Heaps** and **Stacks**.

Swift automatically allocates memory in either the heap or the stack data structure.

For high-performance software in Swift, understanding the source of your heap allocations and reducing the number of allocations your software provides is paramount. Identifying these questions is similar to identifying other performance questions, such as:

- Where are the resources being allocated before optimizing performance?
- What types of resources are used? CPU? Memory? Heap allocations?

> Note: While heap allocations can be relatively expensive regarding computational overhead, they provide flexibility and dynamic memory management capabilities essential for tasks like working with variable-sized or dynamic data structures.

## Profiling
You can use different tools and techniques to profile your Swift code, depending on the specific requirements of your project. Some commonly used profiling techniques include:

- Using OS vendor-supplied profiling tools like [Instruments](https://help.apple.com/instruments/mac/current/#/dev7b09c84f5) on macOS or [`perf`](https://www.swift.org/server/guides/linux-perf.html) on Linux.
- Adding manual timing measurements using techniques like adding timestamps before and after critical code sections.
- Leveraging performance profiling libraries and frameworks for Swift, such as [SwiftMetrics](https://swiftpackageregistry.com/RuntimeTools/SwiftMetrics) or [XCGLogger](https://github.com/XCGLogger/).

For macOS, you can use the [Allocations instrument](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use#Profile-your-app-using-the-Allocations-instrument) in [Xcode](https://developer.apple.com/xcode/) Instruments to help you analyze and optimize memory usage in your apps. The Allocations instrument tracks the size and number of all heap and anonymous virtual memory allocations and organizes them by category.

If your production workloads run on Linux instead of macOS, the number of allocations can differ significantly depending on your setup.

*This document mainly focuses on the number of heap allocations and not their size.*

## Getting started
Swift’s optimizer produces faster code and allocates less memory in `release` mode. By profiling your Swift code in the `release` mode and optimizing based on the results, you can achieve better performance and efficiency in your applications.

Follow the steps below:

Step 1. **Build your code** in `release` mode by running this command:
```bash
swift run -c release
```

Step 2. [**Install `perf`**](https://www.swift.org/server/guides/linux-perf.html) to profile your code for your environment to gather performance-related data and optimize the performance of your Swift server applications.

Step 3. **Clone the FlameGraph project** to generate a flame graph visualization that helps you quickly identify hotspots in the codebase, visualize call paths, understand the flow of execution, and optimize performance. To generate a flame graph, you will need to clone the [`FlameGraph`](https://github.com/brendangregg/FlameGraph) repository on your machine or into a container, making it available at `~/FlameGraph`.

Run this command to clone the `https://github.com/brendangregg/FlameGraph` repository in `~/FlameGraph`:
```bash
git clone https://github.com/brendangregg/FlameGraph
```

When running in Docker, use this command to bind-mount the `FlameGraph` repository into the container:
```bash
docker run -it --rm \
           --privileged \
           -v "/path/to/FlameGraphOnYourMachine:/FlameGraph:ro" \
           -v "$PWD:PWD" -w "$PWD" \
           swift:latest
```

By visually highlighting the most frequently called functions or the functions consuming the most processing time, you can focus your optimization efforts on improving the performance of critical code paths.

## Tools
You can identify areas for optimization and make informed decisions to improve the performance and efficiency of your Swift server code using the [Linux `perf`](https://perf.wiki.kernel.org/index.php/Main_Page) tool.

The `perf` tool is a performance profiling and analysis tool available on Linux systems. Although it is not specific to Swift, it can be valuable for profiling Swift code on the server for the following reasons:

- **Low overhead** which means it can collect performance data with minimal impact on the execution of your Swift code.
- **Rich set of features** like CPU profiling, memory profiling, and event-based sampling.
- **Flame graph generation** to help you understand the relative time spent in different areas of your code and identify performance bottlenecks.
- **System-level profiling** gathers performance data at the kernel level, analyzes system-wide events, and understands the impact of other processes or system components on the performance of your Swift application.
- **Flexibility and extensibility** allow you to customize the types of events you want to profile, set sampling rates, specify filters, and more.

> Tip 1: If you’re running `perf` in a Docker container, you will need a privileged container to provide the necessary permissions and access to the tool to gather performance data.

> Tip 2: Prefix the commands with `sudo` if you need `root` access.
See [Getting `perf` to work](https://www.swift.org/server/guides/linux-perf.html) for more information.

## Installing a perf user probe
As previously mentioned, this document's example programs focus on counting the *number* of allocations.

Most allocations use a Swift program's `malloc` function on Linux. Installing `perf` user probes on the allocation function provides information about when an allocation function is called.

In this instance, a user probe was installed for all allocation functions because Swift uses other functions like `calloc` and `posix_memalign`.

```bash
# figures out the path to libc
libc_path=$(readlink -e /lib64/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6)

# delete all existing user probes on libc (instead of * you can also list them individually)
perf probe --del 'probe_libc:*'

# installs a probe on `malloc`, `calloc`, and `posix_memalign`
perf probe -x "$libc_path" --add malloc --add calloc --add posix_memalign
```

Subsequently, an event in `perf` will trigger whenever one of the allocation functions is called.

The output should look like this:

```
Added new events:
  probe_libc:malloc    (on malloc in /usr/lib/x86_64-linux-gnu/libc-2.31.so)
  probe_libc:calloc    (on calloc in /usr/lib/x86_64-linux-gnu/libc-2.31.so)
  probe_libc:posix_memalign (on posix_memalign in /usr/lib/x86_64-linux-gnu/libc-2.31.so)

[...]
```

Here, you can see that `perf` triggers new events `probe_libc:malloc`; `probe_libc:calloc` each time the respective function is called.

To confirm the user probe `probe_libc:malloc` works, run this command:

```bash
perf stat -e probe_libc:malloc -- bash -c 'echo Hello World'
```

The output should look similar to this:

```
Hello World

 Performance counter stats for 'bash -c echo Hello World':

              1021      probe_libc:malloc

       0.003840500 seconds time elapsed

       0.000000000 seconds user
       0.003867000 seconds sys
```

In this case, it appears the user probe called the allocation functions 1021 times.

> Important: If the probe called the allocation functions 0 times, it would indicate an error.

## Running allocation analysis
By running allocation analysis, you can gain a better understanding of the memory usage patterns in your application and identify and fix memory issues such as leaks or inefficient usage, ultimately improving the performance and stability of your code.

### Example program
Once you’ve confirmed the user probe on `malloc` is working, you can analyze the allocations of a program. For instance, you can analyze a program that performs ten subsequent HTTP requests using [AsyncHTTPClient](https://github.com/swift-server/async-http-client).

Analyzing a program using AsyncHTTPClient can help optimize its performance, improve error handling, ensure proper concurrency and threading, enhance code readability and maintainability, and assess scalability considerations.

Here’s an example of the program source code with the following dependencies:

```swift
dependencies: [
    .package(url: "https://github.com/swift-server/async-http-client.git", from: "1.3.0"),
    .package(url: "https://github.com/apple/swift-nio.git", from: "2.29.0"),
    .package(url: "https://github.com/apple/swift-log.git", from: "1.4.2"),
],
```

An example program using AsyncHTTPClient can be written as:

```swift
import AsyncHTTPClient
import NIO
import Logging

let urls = Array(repeating:"http://httpbin.org/get", count: 10)
var logger = Logger(label: "ahc-alloc-demo")

logger.info("running HTTP requests", metadata: ["count": "\(urls.count)"])
MultiThreadedEventLoopGroup.withCurrentThreadAsEventLoop { eventLoop in
    let httpClient = HTTPClient(eventLoopGroupProvider: .shared(eventLoop),
                                backgroundActivityLogger: logger)

    func doRemainingRequests(_ remaining: ArraySlice<String>,
                             overallResult: EventLoopPromise<Void>,
                             eventLoop: EventLoop) {
        var remaining = remaining
        if let first = remaining.popFirst() {
            httpClient.get(url: first, logger: logger).map { [remaining] _ in
                eventLoop.execute { // for shorter stacks
                    doRemainingRequests(remaining, overallResult: overallResult, eventLoop: eventLoop)
                }
            }.whenFailure { error in
                overallResult.fail(error)
            }
        } else {
            return overallResult.succeed(())
        }
    }

    let promise = eventLoop.makePromise(of: Void.self)
    // Kick off the process
    doRemainingRequests(urls[...],
                        overallResult: promise,
                        eventLoop: eventLoop)

    promise.futureResult.whenComplete { result in
        switch result {
        case .success:
            logger.info("all HTTP requests succeeded")
        case .failure(let error):
            logger.error("HTTP request failure", metadata: ["error": "\(error)"])
        }

        httpClient.shutdown { maybeError in
            if let error = maybeError {
                logger.error("AHC shutdown failed", metadata: ["error": "\(error)"])
            }
            eventLoop.shutdownGracefully { maybeError in
                if let error = maybeError {
                    logger.error("EventLoop shutdown failed", metadata: ["error": "\(error)"])
                }
            }
        }
    }
}

logger.info("exiting")
```

If running a program as a Swift package, compile it in the `release` mode first, using this command:

```bash
swift build -c release
```

A binary called `.build/release/your-program-name` should render and can be analyzed to get the number of allocations.

### Counting allocations
Counting allocations and visualizing them as a graph can help you analyze memory utilization, profile memory usage, optimize performance, refactor and optimize code, and debug memory-related issues in your program.

Before visualizing the allocations as a flame graph, start with an analysis using the binary to get the number of allocations by running the command:

```bash
perf stat -e 'probe_libc:*' -- .build/release/your-program-name
```

This command instructs `perf` to run your program and count the number of times the user probe `probe_libc:malloc` was hit or allocated memory within your application.

The output should look similar to this:

```
Performance counter stats for '.build/release/your-program-name':

                68      probe_libc:posix_memalign
                35      probe_libc:calloc_1
                 0      probe_libc:calloc
              2977      probe_libc:malloc

[...]
```

In this instance, the program allocated 2977 times through `malloc` and a small number of times through the other allocation functions.

It's important to note that the `-e probe_libc:*` command is used instead of individually listing every event such as:
- `-e probe_libc: malloc`
- `probe_libc:calloc`
- `probe_libc:calloc_1`
- `probe_libc:posix_memalign`

> Tip: This approach assumes you don’t have *other* `perf` user probes installed. If other `perf` user probes are installed, you need to specify each event you want to use individually.

### Collecting raw data
Collecting raw data is crucial for obtaining an accurate representation of the system's behavior, performing detailed performance analysis and debugging, analyzing trends, enabling profiling flexibility, and guiding performance optimization efforts.

The `perf` command doesn’t allow for creating live graphs while the program is running. However, the [Linux Perf tool](https://perf.wiki.kernel.org/index.php/Main_Page) provides a `perf record`  utility command that captures performance events for later analysis. The collected data can then be transformed into a graph.

In general, the command `perf record` can be used to run the program and `libc_probe:malloc` to collect information, as shown here:

```bash
perf record --call-graph dwarf,16384 \
     -m 50000 \
     -e 'probe_libc:*' -- \
     .build/release/your-program-name
```

Breaking down this command provides the following construct:

- The `perf record` command instructs `perf` to record data.
- The `--call-graph dwarf,16384` command instructs `perf` to use the [debugging with attributed record formats (DWARF)](http://www.dwarfstd.org/) information to create the call graphs. It also sets the maximum stack dump size to 16k, which should be enough information for full stack traces.
    - Although using DWARF is slow (see below), it creates the best call graphs.
- `-m 50000` indicates the size of the ring buffer that `perf` uses and outputs in multiples of `PAGE_SIZE` (usually 4kB).
    - A significant buffer is necessary when using DWARF to prevent data loss.
- `-e 'probe_libc:*'` records the data when the `malloc`; `calloc`; and other `malloc/calloc/...` user probes fire.
    - The fire event occurs when the probe is triggered or executed, capturing relevant information about the allocation for further analysis and debugging.

Your program output should look similar to this:

```
<your program's output>
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 401.088 MB perf.data (49640 samples) ]
```

By placing user probes at strategic points in your codebase, you can track and log allocation events to gain insights into memory allocation patterns, identify potential performance issues or memory leaks, and analyze memory usage in your application.

> Important: If the `perf` output returns `lost chunks` and makes a `check the IO/CPU overload!` request, see **Overcoming lost chunks of data** below.

### Creating flame graphs
Once you’ve successfully recorded data using `perf record`, you can invoke the following command to produce an SVG file with the flame graph:

```bash
perf script | \
    /FlameGraph/stackcollapse-perf.pl - | \
    swift demangle --simplified | \
    /FlameGraph/flamegraph.pl --countname allocations \
        --width 1600 > out.svg
```

Here’s a breakdown of this command construct:

- The `perf` script command places the binary information into a textual form that `perf record` captured.
- The `stackcollapse-perf` command transforms the stacks that `perf script` generated into the correct format for flame graphs.
- The `swift demangle --simplified` command converts the symbol names to a human-readable format.
- The last two commands create the flame graph based on the number of allocations.

Once the command has been completed, an SVG file is generated that you can open in your browser.

> Note: Lengthy run times may result depending on the data size, algorithm complexity, resource limitations such as CPU power or memory, poorly optimized or inefficient code, external services, APIs, or network latency causing a slowdown.

### Reading flame graphs
This flame graph is a direct result of the example program in this section. Hover over the stack frames to get more information, or click on any stack frame to zoom in on a sub-tree.

<p><img src="/assets/images/server-guides/perf-malloc-full.svg" alt="Flame graph" /></p>

- When interpreting flame *graphs*, the X-axis means the **count** and not time. The arrangement of the stack (left or right) is not determined by when that stack was live, unlike flame *charts*.

- This flame graph is not a CPU flame graph but an allocation flame graph, where one sample indicates one allocation and not time spent on the CPU.
- The wide stack frames don’t (necessarily) allocate directly, meaning the function, or something the function called, allocated numerous times.

    - For example, `BaseSocketChannel.readable` is a wide frame, but its function does not allocate directly. Instead, it called other functions, such as other parts of SwiftNIO and AsyncHTTPClient, that allocated considerably.

## Allocation flame graphs on macOS
Although much of this tutorial focuses on the `perf` tool, you can create the same graphs using macOS.

Step 1. To get started, collect the raw data using the [DTrace](https://en.wikipedia.org/wiki/DTrace) framework by running this command:

```bash
sudo dtrace -n 'pid$target::malloc:entry,pid$target::posix_memalign:entry,pid$target::calloc:entry,pid$target::malloc_zone_malloc:entry,pid$target::malloc_zone_calloc:entry,pid$target::malloc_zone_memalign:entry { @s[ustack(100)] = count(); } ::END { printa(@s); }' -c .build/release/your-program > raw.stacks
```

Like Linux's `perf` user probes, DTrace also uses probes. The previous command instructs `dtrace` to aggregate the number of calls to the allocation function equivalents:

- `malloc`
- `posix_memalign`
- `calloc`
- `malloc_zone_*`

> Note: On Apple platforms, Swift uses a slightly larger number of allocation functions than Linux.

Step 2. Once the data is collected, run this command to create an SVG file:

```bash
cat raw.stacks |\
    /FlameGraph/stackcollapse.pl - | \
    swift demangle --simplified | \
    /FlameGraph/flamegraph.pl --countname allocations \

        --width 1600 > out.svg
```

You will notice this command is similar to the `perf` invocation, except:
- The command `cat raw.stacks` replaces the `perf script` command since `dtrace` already includes a textual data file.
- The command `stackcollapse.pl`, which parses `dtrace` aggregation output, replaces the `stackcollapse-perf.pl` command, which parses the `perf script` output.

## Other perf tricks

### Swift’s allocation patterns
Optimizing memory allocations and improving code efficiency based on the information provided by the flame graph can help make your Swift code more performant and visually appealing. The shape of allocations in Swift can vary depending on the type of memory being allocated and the way it is used.

Some common shapes of allocations in Swift include:

- Single object allocations
- Collection allocations
- Strings
- Function call stacks
- Protocol existentials
- Structures and classes

For example, a class instance (which allocates) calls `swift_allocObject`, which calls `swift_slowAlloc`, which calls `malloc` that contains the user probe.

### “Prettifying” allocation patterns
To make your flame graph look good (after demangling the collapsed stacks) insert the following code into the Linux `perf script` code (above) by:

- Removing `specialized` and replacing it with `swift_allocObject`.
- Calling `swift_slowAlloc`, which calls `malloc`.
- Using an `A` for allocation.

These changes should look like this:

```bash
sed -e 's/specialized //g' \
    -e 's/;swift_allocObject;swift_slowAlloc;__libc_malloc/;A/g'
```

To produce a visually appealing SVG file flame graph when analyzing memory allocations in Swift, use the complete command:

```bash
perf script | \
    /FlameGraph/stackcollapse-perf.pl - | \
    swift demangle --simplified | \
    sed -e 's/specialized //g' \
        -e 's/;swift_allocObject;swift_slowAlloc;__libc_malloc/;A/g' | \
    /FlameGraph/flamegraph.pl --countname allocations --flamechart --hash \
    > out.svg
```

## Overcoming lost chunks of data
When using perf with the DWARF call stack unwinding, you may encounter this issue:

```
[ perf record: Woken up 189 times to write data ]
Warning:
Processed 4346 events and lost 144 chunks!

Check IO/CPU overload!

[ perf record: Captured and wrote 30.868 MB perf.data (3817 samples) ]
```

If `perf` indicates it lost several *chunks*, it means it lost data. When `perf` loses data, you can use these options to help resolve the issue:

- Reduce the amount of work your program performs.
    - For every allocation, `perf` records a stack trace.
- Reduce the maximum *stack dump* that `perf` records by changing the `--call-graph dwarf` parameter.
For example, change to: `--call-graph dwarf,2048`
    - The default records a maximum of 4096 bytes, rendering deep stacks. If you don’t need high-volume output, you can reduce this number. However, the flame graph may display `[unknown]` stack frames, meaning missing stack frames exist (in units of bytes).
- Increase the number of the `-m` parameter, which is the size of the ring buffer that `perf` uses in memory and renders in multiples of `PAGE_SIZE` (usually 4kB).
- Replace the command `--call-tree dwarf` with `--call-tree fp` to generate a call tree report that provides a hierarchical view of function calls within the program, showing how functions are called and the relationships between different functions.

Overall, these practices help you understand your program’s behavior, identify bottlenecks, and improve performance in your Swift applications.
