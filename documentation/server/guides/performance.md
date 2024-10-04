---
redirect_from: "server/guides/performance"
layout: new-layouts/base
title: Debugging Performance Issues
---

## Overview

This document aims to help you debug performance issues in Swift by identifying and resolving any bottlenecks or inefficiencies in the code that may cause the application to run slow or consume excessive system resources. By debugging performance issues, you can optimize your code and improve the overall speed and efficiency of your Swift application.

Here are some basic methods and tools to debug performance issues in Swift:

1. **Measure performance**: [Xcode’s Instruments](https://help.apple.com/instruments/mac/current/) and [Linux perf](https://www.swift.org/documentation/server/guides/linux-perf.html) provide profiling tools to track the performance of your application and help identify areas that consume excessive CPU, memory, or energy. For example, profiling and flame graphs show the consumption of CPU, and memory graphs the consumption of memory. It’s important to note that each platform manages the measuring of your application’s performance differently.

    - For macOS, see [Getting Started with Instruments](https://developer.apple.com/videos/play/wwdc2019/411/).
    - For Linux, see [perf: Linux profiling with performance counters](https://perf.wiki.kernel.org/index.php/Main_Page).

2. **Profile memory usage**: Use Xcode’s [Memory Graph Debugger](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use) to identify and fix memory-related issues.

3. **Benchmark and measure improvements**: Continue to iterate and optimize until the desired performance is achieved.

> Tip: We recommend compiling your Swift code in `release` mode to ensure optimal performance. The performance difference between debug and release builds is significant. You can do this by running the command `swift build -c release` before configuring your code to collect data.

## Tools

Debugging performance issues can sometimes be a complex and iterative process. It requires a combination of techniques, tools, and analysis. We’ve compiled some tools and methods to help you identify and resolve bottlenecks effectively, such as:

- **Flame graphs**
- **Malloc libraries**

### Flame graphs

[Flame graphs](https://www.brendangregg.com/flamegraphs.html) are a helpful tool for analyzing program performance. They show which parts of your program are taking up the most time which can help you find areas that need improvement.

#### Flame graphs in Xcode

While there isn’t a built-in tool in Xcode specifically designed for creating flame graphs like Linux `perf`, you can use external tools to generate flame graphs for some apps developed using Xcode.

One commonly used tool for creating flame graphs is Instruments, which is part of Xcode. You can use the Time Profiler instrument in Instruments to capture stacks and convert the captured data into a flame graph using tools like [flamegraph.pl](https://github.com/brendangregg/FlameGraph/blob/master/flamegraph.pl). Running the app with Instruments using the Time Profiler and then converting the collected data into a flame graph can give you insights into your application's performance profile.

#### Flame graphs in Linux

Flame graphs can be created on most platforms, including Swift on Linux. In this section, we will focus on Linux.

For discussion, here’s an *example flame graph program* on Linux that utilizes the `TerribleArray` data structure, leading to inefficient *O(n)* appends instead of the expected *O(1)* amortized time complexity for `Array`. This can cause performance issues and impact the overall efficiency of the program.

```swift
/* a terrible data structure which has a subset of the operations that Swift's
 * array does:
 *  - retrieving elements by index
 *     --> user's reasonable performance expectation: O(1)   (like Swift's Array)
 *     --> implementation's actual performance:       O(n)
 *  - adding elements
 *     --> user's reasonable performance expectation: amortised O(1)   (like Swift's Array)
 *     --> implementation's actual performance:       O(n)
 *
 * ie. the problem I'm trying to demo here is that this is an implementation
 * where the user would expect (amortised) constant time access but in reality
 * is linear time.
 */
struct TerribleArray<T: Comparable> {
    /* this is a terrible idea: storing the index inside of the array (so we can
     * waste some performance later ;)
     */
    private var storage: Array<(Int, T)> = Array()

    /* oh my */
    private func maximumIndex() -> Int {
        return (self.storage.map { $0.0 }.max()) ?? -1
    }

    /* expectation: amortised O(1) but implementation is O(n) */
    public mutating func append(_ value: T) {
        let maxIdx = self.maximumIndex()
        self.storage.append((maxIdx + 1, value))
        assert(self.storage.count == maxIdx + 2)
    }

    /* expectation: O(1) but implementation is O(n) */
    public subscript(index: Int) -> T? {
        get {
            return self.storage.filter({ $0.0 == index }).first?.1
        }
    }
}

protocol FavouriteNumbers {
    func addFavouriteNumber(_ number: Int)
    func isFavouriteNumber(_ number: Int) -> Bool
}

public class MyFavouriteNumbers: FavouriteNumbers {
    private var storage: TerribleArray<Int>
    public init() {
        self.storage = TerribleArray<Int>()
    }

    /* - user's expectation: O(n)
     * - reality O(n^2) because of TerribleArray */
    public func isFavouriteNumber(_ number: Int) -> Bool {
        var idx = 0
        var found = false
        while true {
            if let storageNum = self.storage[idx] {
                if number == storageNum {
                    found = true
                    break
                }
            } else {
                break
            }
            idx += 1
        }
        return found
    }

    /* - user's expectation: amortised O(1)
     * - reality O(n) because of TerribleArray */
    public func addFavouriteNumber(_ number: Int) {
        self.storage.append(number)
        precondition(self.isFavouriteNumber(number))
    }
}

let x: FavouriteNumbers = MyFavouriteNumbers()

for f in 0..<2_000 {
    x.addFavouriteNumber(f)
}
```

**Generating a flame graph**

To generate flame graphs in Swift on Linux, you can use various tools such as `perf` combined with `FlameGraph` scripts to collect data on CPU utilization and stack traces. They can then be visualized using flame graph tools to gain insights into the performance characteristics of the application as follows:

1. [Install and configure](https://www.swift.org/server/guides/linux-perf.html) `perf` for Linux to collect performance data.
2. Compile the code using `swift build -c release` into a binary called `./slow` by using these steps:

   a. Open your Terminal and navigate to the directory containing your Swift code, typically the root directory of your Swift package.

   b. Run the following command to compile the code in release mode, optimizing the build for performance:
    ```
    swift build -c release
    ```

    After the build process completes successfully, you can find the compiled binary in the `.build/release/` directory within your Swift package’s directory.

    c. Copy the compiled binary to the current directory and rename it to `slow` using the following command:
    ```
    cp .build/release/YourExecutableName ./slow
    ```

    Replace `YourExecutableName` with the actual name of your compiled binary.

3. Clone the repository in the `~/FlameGraph` directory using this command:
    ```
    git clone https://github.com/brendangregg/FlameGraph
    ```

4. Run this command to record the stack frames with a 99 Hz sampling frequency:
    ```
    sudo perf record -F 99 --call-graph dwarf -- ./slow
    ```

Alternatively, to attach to an existing process use:
    ```
    sudo perf record -F 99 --call-graph dwarf -p PID_OF_SLOW
    ```

5. Export the recording into `out.perf` by running this command:
    ```
    sudo perf script > out.perf
    ```

6. Aggregate the recorded stacks and demangle the symbols using this command:
    ```
    ~/FlameGraph/stackcollapse-perf.pl out.perf | swift demangle > out.folded
    ```

7. Export the result into an SVG file to visually represent the functions and their relative CPU usage using the following command:
    ```
    ~/FlameGraph/flamegraph.pl out.folded > out.svg # Produce
    ```

The resulting Flamegraph file should look similar to the one below:

![Flame graph](/assets/images/server-guides/perf-issues-flamegraph.svg)

We can see in the flame graph that `isFavouriteNumber` consumes most of the runtime, invoked from `addFavouriteNumber`. This outcome indicates where to look for improvements.

> Note: If you use `Set<Int>` to store the `FavouriteNumber`, the by-product should indicate if a number is a `FavouriteNumber` in constant time *(O(1)*).

### Malloc libraries

In Swift, memory allocation and deallocation are primarily managed by the [automatic reference counting (ARC)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/) mechanism. In certain cases, you may need to interface with C or other languages using *malloc* libraries or if you require finer control over memory management. For example, you can use a custom malloc library for workloads that put significant pressure on the memory allocation subsystem. Although no changes are required to the code, interposing it with an environment variable is necessary before running your server.

> Tip: You may want to benchmark the default and a custom memory allocator to see how much it helps for the specified workload.

Here are some specialized memory allocation libraries designed to address performance concerns, especially in multi-threaded environments:

- [TCMalloc](https://github.com/google/tcmalloc) is tailored for speed and scalability within Google’s environments.
- [Jemalloc](https://jemalloc.net/) emphasizes fragmentation reduction and efficiency for a wider range of applications.

Other `malloc` implementations exist and can typically be enabled using LD_PRELOAD:

```bash
> LD_PRELOAD=/usr/bin/libjemalloc.so  myprogram
```

The choice between these libraries depends on the specific performance needs and characteristics of the application or system.

In summary, using performance tools for debugging Swift server applications helps optimize performance, enhance user experience, plan for scalability, and ensure the efficient operation of server applications in production environments.
