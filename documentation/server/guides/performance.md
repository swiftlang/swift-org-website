---
redirect_from: "server/guides/performance"
layout: page
title: Debugging Performance Issues
---

First of all, it's very important to make sure that you compiled your Swift code in _release mode_. The performance difference between debug and release builds is huge in Swift. You can compile your Swift code in release mode using

    swift build -c release

## Instruments

If you can reproduce your performance issue on macOS, you probably want to check out Instrument's [Time Profiler](https://developer.apple.com/videos/play/wwdc2016/418/).

## Flamegraphs

[Flamegraphs](http://www.brendangregg.com/flamegraphs.html) are a nice way to visualise what stack frames were running for what percentage of the time. That often helps pinpointing the areas of your program that need improvement. Flamegraphs can be created on most platforms, in this document we will focus on Linux.

### Flamegraphs on Linux

To have something to discuss, let's use a program that has a pretty big performance problem:

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

The above program contains the `TerribleArray` data structure which has _O(n)_ appends and not the amortised _O(1)_ that users are used to from `Array`.

We will assume, that you have Linux's `perf` installed and configured, documentation on how to install `perf` can be found in [this guide](/server/guides/linux-perf.html).

Let's assume we have compiled the above code using `swift build -c release` into a binary called `./slow`. We also assume that the `https://github.com/brendangregg/FlameGraph` repository is cloned in `~/FlameGraph`:

```
# Step 1: Record the stack frames with a 99 Hz sampling frequency
sudo perf record -F 99 --call-graph dwarf -- ./slow
# Alternatively, to attach to an existing process use
#     sudo perf record -F 99 --call-graph dwarf -p PID_OF_SLOW
# or if you don't know the pid, you can try (assuming your binary name is "slow")
#     sudo perf record -F 99 --call-graph dwarf -p $(pgrep slow)

# Step 2: Export the recording into `out.perf`
sudo perf script > out.perf

# Step 3: Aggregate the recorded stacks and demangle the symbols
~/FlameGraph/stackcollapse-perf.pl out.perf | swift demangle > out.folded

# Step 4: Export the result into a SVG file.
~/FlameGraph/flamegraph.pl out.folded > out.svg # Produce
```

The resulting file will look something like:

![](/assets/images/server-guides/perf-issues-flamegraph.svg)

And we can see that almost all of our runtime is spent in `isFavouriteNumber` which is invoked from `addFavouriteNumber`. That should be a very good hint to the programmer on where to look for improvements. Maybe after all, we should use `Set<Int>` to store the favourite numbers, that should get is an answer to if a number is a favourite number in constant time (_O(1)_).

## Alternate `malloc` libraries
For some workloads putting serious pressure on the memory allocation subsystem, it may be beneficial with a custom `malloc` library.
It requires no changes to the code, but needs interposing with e.g. an environment variable before running your server.
It is worth benchmarking with the default and with a custom memory allocator to see how much it helps for the specific workload.
There are many `malloc` implementations out there, but a portable and well-performing one is [Microsofts mimalloc](https://github.com/microsoft/mimalloc).

Typically these are simply enabled by using LD_PRELOAD:

`> LD_PRELOAD=/usr/bin/libmimalloc.so  myprogram`
