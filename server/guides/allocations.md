---
layout: page
title: Allocations
---

For high-performance software in Swift, it's often important to understand where your heap allocations are coming from. The next step can then be to reduce the number of allocations your software makes.

This is very similar to other performance questions: Before you can optimise performance you need to understand where you spend your resources. And resources can be CPU time, as well as memory, or heap allocations.
In this document we will solely focus on the number of heap allocations, not their size.

On macOS, you can use Instruments's "Allocations" instrument. The Allocations instrument shows you two sets of values: The live allocations (i.e. allocated and not freed) as well as the transient allocations (all allocations made).

Your production workloads however will likely run on Linux and depending on your setup the number of allocations can differ significantly between macOS and Linux.

## Preparation

To not waste your time, be sure to do any profiling in _release mode_. Swift's optimiser will produce significantly faster code which will also allocate less in release mode. Usually this means you need to run

    swift run -c release

#### Install `perf`

Follow the [installation instructions](/server/guides/linux-perf.html) in the Linux `perf` utility guide.

#### Clone the `FlameGraph` project

To see some pretty graphs, clone the [`FlameGraph`](https://github.com/brendangregg/FlameGraph) repository on the machine/container where you need it. The rest of this guide will assume that it's available at `/FlameGraph`:

```
git clone https://github.com/brendangregg/FlameGraph
```

Tip: With Docker, you may want to bind mount the `FlameGraph` repository into the container using

```
docker run -it --rm \
           --privileged \
           -v "/path/to/FlameGraphOnYourMachine:/FlameGraph:ro" \
           -v "$PWD:PWD" -w "$PWD" \
           swift:latest
```

or similar.


## Tools

In this guide, we will be using the [Linux `perf`](https://perf.wiki.kernel.org/index.php/Main_Page) tool. If you're struggling to get `perf` to work, have a look at our [information regarding `perf`](/server/guides/linux-perf.html). If you're running in a Docker container, don't forget that you'll need a privileged container. And generally, you will need `root` access, so you may need to prefix the commands with `sudo`.

## Getting a `perf` user probe

In this guide, we will be counting the number of allocations. Most allocations from a Swift program (on Linux) will be done through the `malloc` function.

To get information about when an allocation function is called, we will install a `perf` "user probes" on the allocation functions. Because Swift also uses other allocation functions such as `calloc` and `posix_memalign`, we'll install a user probe for them all. From then on, there will be an event in `perf` that will fire whenever one of the allocation functions is called.

```bash
# figures out the path to libc
libc_path=$(readlink -e /lib64/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6)

# delete all existing user probes on libc (instead of * you can also list them individually)
perf probe --del 'probe_libc:*'

# installs a probe on `malloc`, `calloc`, and `posix_memalign`
perf probe -x "$libc_path" --add malloc --add calloc --add posix_memalign
```

The result (hopefully) looks somewhat like this:

```
Added new events:
  probe_libc:malloc    (on malloc in /usr/lib/x86_64-linux-gnu/libc-2.31.so)
  probe_libc:calloc    (on calloc in /usr/lib/x86_64-linux-gnu/libc-2.31.so)
  probe_libc:posix_memalign (on posix_memalign in /usr/lib/x86_64-linux-gnu/libc-2.31.so)

[...]
```

What `perf` is telling you here is that it added a new events called `probe_libc:malloc`, `probe_libc:calloc`, ... which will fire every time the respective function is called.

Let's confirm that our `probe_libc:malloc` probe actually works by running:

    perf stat -e probe_libc:malloc -- bash -c 'echo Hello World'

which should output something like

```
Hello World

 Performance counter stats for 'bash -c echo Hello World':

              1021      probe_libc:malloc

       0.003840500 seconds time elapsed

       0.000000000 seconds user
       0.003867000 seconds sys
```

Which seems to have allocated 1021 times, great. If that probe fired 0 times, something went wrong.

## Running the allocation analysis

After we have confirmed that our user probe on `malloc` works in general, let's dial it up a little. The first thing we'll need is a program that we'd like to analyse the allocations of.

For example, we could analyse a program which does 10 subsequent HTTP requests using [AsyncHTTPClient](https://github.com/swift-server/async-http-client). If you're interested in the full source code, please expand below.

<details>
<summary>Demo program source code</summary>

With the following dependencies

```swift
    dependencies: [
        .package(url: "https://github.com/swift-server/async-http-client.git", from: "1.3.0"),
        .package(url: "https://github.com/apple/swift-nio.git", from: "2.29.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.4.2"),
    ],
```

We could write this program

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
</details>

Assuming you have a program as a Swift package, we should first of all compile it in release mode using `swift build -c release`. Then you should find a binary called `.build/release/your-program-name` which we can then analyse.

### Allocation counts

Before we go into visualising the allocations as a flame graph, let's start with the simplest analysis: Getting the total number of allocations

```
perf stat -e 'probe_libc:*' -- .build/release/your-program-name
```

The above command instructs perf to run your program and count the number of times the `probe_libc:malloc` probe was hit. This should be the number of allocations done by your program.

The output should look something like

```
 Performance counter stats for '.build/release/your-program-name':

                68      probe_libc:posix_memalign
                35      probe_libc:calloc_1
                 0      probe_libc:calloc
              2977      probe_libc:malloc

[...]
```

In this case, my program allocated 2,977 times through `malloc` and a few more times through the other allocation functions. If you just want to compare the effects of a pull request you may just want to run this `perf stat` command twice. If you would like to find out _where_ your allocations come from, read on.

Please note that in this guide we'll use `-e probe_libc:*` instead of individually listing every event like `-e probe_libc:malloc,probe_libc:calloc,probe_libc:calloc_1,probe_libc:posix_memalign`. This assumes that you have _no other_ `perf` user probes installed. If you do, please specify each event you would like to use individually.

### Collecting the raw data

With `perf`, we can't really create live graphs whilst the program is running. For most analyses, we want to first record some raw data (usually with `perf record`) and later on transform the recorded data into a graph.

To get started, let's have `perf` run the program for us and collect the information using the `libc_probe:malloc` we set up before.

```
perf record --call-graph dwarf,16384 \
     -m 50000 \
     -e 'probe_libc:*' -- \
     .build/release/your-program-name
```

Let's break down this command a little:

- `perf record` instructs `perf` to `record` data, makes sense.
- `--call-graph dwarf,16384` instructs `perf` to use the [DWARF](http://www.dwarfstd.org) information to create the call graphs. It also sets the maximum stack dump size to 16k which should be enough to get you full stack traces. Unfortunately, using DWARF is rather slow (see below) but it creates the best call graphs for you.
- `-m 50000`: The size of the ring buffer that `perf` uses to buffer. This is given in multiples of `PAGE_SIZE` (usually 4kB) and especially with DWARF this needs to be pretty huge to prevent data loss.
- `-e 'probe_libc:*'`: Record when the `malloc`/`calloc`/... probes fire

What you want to see if output like this

```
<your program's output>
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 401.088 MB perf.data (49640 samples) ]
```

If perf tells you about "lost chunks" and asks you to "check the IO/CPU overhead", you should jump to the 'Overcoming "lost chunks"' section at the end of this document.

### Flame graphs

After a successful `perf record`, you can invoke the following command line to produce an SVG file with the flame graph

```bash
perf script | \
    /FlameGraph/stackcollapse-perf.pl - | \
    swift demangle --simplified | \
    /FlameGraph/flamegraph.pl --countname allocations \
        --width 1600 > out.svg
```

Let's expand a little on what the above command does:

- It runs `perf script` which dumps the binary information that `perf record` recorded into a textual form.
- Next, we invoke `stackcollapse-perf` on it which transforms the stacks that `perf script` outputs into the right format for Flame Graphs,
- then we invoke `swift demangle --simplified` which will give us nice symbol names,
- and lastly we create the Flame Graph itself

After this command has run (which may run for a while), you should have an SVG file that you can open in your browser.

For the above example program, please see an example flame graph below. Note how you can hover over the stack frames and get more information. To focus on a sub tree, you can click any stack frame too.

Generally, in flame graphs, the X axis just means "count", it does **not** mean time. In other words, whether a stack appears on the left or the right is not determined when that stack was live (this is different in flame _charts_).

Note that this flame graph is _not_ a CPU flame graph, 1 sample means 1 allocation here and not time spent on the CPU. Also be aware that stack frames that appear wide don't necessarily allocate directly, it means that they or something they call has allocated a lot. For example, `BaseSocketChannel.readable` is a very wide frame, and yet, it is not a function which allocates directly. However, it calls other functions (such as other parts of SwiftNIO and AsyncHTTPClient) that do allocate a lot. It may take a little while to get familiar with flame graphs but there are great resources available online.

![](/assets/images/server-guides/perf-malloc-full.svg)

## Allocation flame graphs on macOS

So far, this tutorial focussed on Linux and the `perf` tool. You can however create the same graphs on macOS. The process is fairly similar.

First, let's collect the raw data using [DTrace](https://en.wikipedia.org/wiki/DTrace).

```
sudo dtrace -n 'pid$target::malloc:entry,pid$target::posix_memalign:entry,pid$target::calloc:entry,pid$target::malloc_zone_malloc:entry,pid$target::malloc_zone_calloc:entry,pid$target::malloc_zone_memalign:entry { @s[ustack(100)] = count(); } ::END { printa(@s); }' -c .build/release/your-program > raw.stacks
```

Similar to `perf`'s user probes, dtrace also has probes and the above command instructs DTrace to aggregate the number of calls to the allocation functions `malloc`, `posix_memalign`, `calloc`, and the `malloc_zone_*` equivalents. On Apple platforms, Swift uses a slightly larger number of allocation functions than on Linux, therefore we need to specify a few more functions.

Once we collected the data, we can also create an SVG file using

```bash
cat raw.stacks |\
    /FlameGraph/stackcollapse.pl - | \
    swift demangle --simplified | \
    /FlameGraph/flamegraph.pl --countname allocations \
        --width 1600 > out.svg
```

which you will notice is very similar to the `perf` invocation. The only differences are:

- We use `cat raw.stacks` instead of `perf script` because we already have the textual data in a file with DTrace
- Instead of `stackcollapse-perf.pl` (which parses `perf script` output) we use `stackcollapse.pl` (which parses DTrace aggregation output)

## Other `perf` tricks

### Prettifying Swift's allocation pattern

Allocations in Swift usually have a very distinct shape:
 - Some code creates for example a class instance (which allocates).
 - This calls `swift_allocObject`,
 - which calls `swift_slowAlloc`,
 - which calls `malloc` (where we have our probe).

To make our flame graphs look nicer, we can apply a small transformation after we have demangled the collapsed stacks:

```
sed -e 's/specialized //g' \
    -e 's/;swift_allocObject;swift_slowAlloc;__libc_malloc/;A/g'
```

which will get rid of `"specialized "` and replaces `swift_allocObject` calling `swift_slowAlloc`, calling `malloc` with just an `A` (for allocation). The full command will then look like

```
perf script | \
    /FlameGraph/stackcollapse-perf.pl - | \
    swift demangle --simplified | \
    sed -e 's/specialized //g' \
        -e 's/;swift_allocObject;swift_slowAlloc;__libc_malloc/;A/g' | \
    /FlameGraph/flamegraph.pl --countname allocations --flamechart --hash \
    > out.svg
```

### Overcoming "lost chunks"

When using `perf` with the DWARF call stack unwinding, it is unfortunately easy to run into the following issue

```
[ perf record: Woken up 189 times to write data ]
Warning:
Processed 4346 events and lost 144 chunks!

Check IO/CPU overload!

[ perf record: Captured and wrote 30.868 MB perf.data (3817 samples) ]
```

When `perf` tells you that it lost a number of chunks it means that it lost data. If `perf` lost data, you have a few options:

- Reduce the amount of work your program is doing. For every allocation, `perf` will need to record a stack trace.
- Reduce the maximum "stack dump" that `perf` records by changing the `--call-graph dwarf` parameter to for example `--call-graph dwarf,2048`. The default is to record a maximum of 4096 bytes which gives you pretty deep stacks, if you don't need that you can reduce the number. The tradeoff is that the flame graph may show you `[unknown]` stack frames which means that there are missing stack frames there. The unit is bytes.
- You can raise the number of the `-m` parameter which is the size of the ring buffer that `perf` uses in memory (in multiples of `PAGE_SIZE`, usually that is 4kB)
- You can give up nice call graphs and replace `--call-tree dwarf` with `--call-tree fp` (`fp` stands for frame pointer).
