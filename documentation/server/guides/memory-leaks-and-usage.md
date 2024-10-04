---
redirect_from: "server/guides/memory-leaks-and-usage"
layout: new-layouts/base
title: Debugging Memory Leaks and Usage
---

# Overview

Debugging memory leaks and usage helps you identify and resolve issues related to memory management in an application. Memory leaks occur when memory is allocated but not properly deallocated, leading to a gradual increase in memory usage over time. This can severely impact an application's performance and stability.

It’s important to note, however, that a gradual increase in memory usage over time doesn’t always indicate a leak. Instead, it may be the memory profile of the application. For example, when an application’s cache gradually fills over time it shows the same gradual increase in memory. Accordingly, configuring the cache so it doesn’t expand beyond a designated limit will cause the memory usage to plateau. Additionally, allocator libraries don't always immediately return memory feedback to the system due to performance or other reasons. But it will stabilize over time.

## Tools and techniques

Debugging memory leaks in Swift on macOS and Linux environments can be done using different tools and techniques, each with distinct strengths and usability.

### Basic troubleshooting includes:

* Using profiling tools.
* Reviewing code and identifying potential leaks.
* Enabling debug memory allocation features.

**1. Using profiling tools** provided by the respective operating systems and development environments to identify and analyze memory usage.

*For macOS*: [Memory Graph Debugger](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use#Inspect-the-debug-memory-graph) and this [Detect and diagnose memory issues](https://developer.apple.com/videos/play/wwdc2021/10180/) video are helpful. You can also use the [Xcode Instruments](https://help.apple.com/instruments/mac/10.0/#/dev022f987b) tool for various profiling instruments including the [Allocations instrument](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use#Profile-your-app-using-the-Allocations-instrument) to track memory allocation and deallocation in your Swift code.

*For Linux*: You can use tools like [Valgrind](https://valgrind.org/) or [Heaptrack](https://github.com/KDE/heaptrack) to profile your application as shown in the examples below. Although these tools are primarily used for C/C++ code, they can also work with Swift.

**2. Reviewing code and identifying potential leaks** to examine your code for any potential areas where memory leaks may occur. Common sources of leaks include retained references or unbalanced retain-release cycles, which rarely apply to Swift since it performs [automatic reference counting (ARC)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/).

> Note: Memory leaks can occur in Swift if there are substantial reference cycles between objects that involve closures or if objects hold references to external resources that are not released properly. However, the likelihood of such issues is significantly reduced through the automatic memory management's ability to add and remove references, making sources of leaks like retained references and unbalanced retain-release cycles less common in Swift code.

**3. Enabling debug memory allocation features** allows you to get additional information about objects and their memory allocations.

*On macOS*: You can enable Zombie Objects using Xcode or use [MallocStackLogging](https://developer.apple.com/videos/play/wwdc2022/10106/) to detect over-released or accessed deallocated objects.

To enable Zombie Objects:
1. Open your Xcode project.
2. Go to the **Edit Scheme** menu by clicking on the scheme dropdown in the toolbar.
3. In the scheme editor window, select the **Run** tab.
4. Choose the **Diagnostics** tab.
5. Under **Memory Management**, check the box next to **Enable Zombie Objects**.

*On Linux*: Swift has built-in LeakSanitizer support that can be enabled using the `-sanitize=leak` compiler flag.

## Troubleshooting

This section aims to provide you with helpful server-side troubleshooting techniques to debug leaks and usage using **Valgrind**, **LeakSanitizer**, and **Heaptrack**.

The following **example program** leaks memory. We are using it as an *example only* to illustrate the various troubleshooting methods mentioned below.

```
public class MemoryLeaker {
   var closure: () -> Void = { () }

   public init() {}

   public func doNothing() {}

   public func doSomethingThatLeaks() {
      self.closure = {
         // This will leak as it'll create a permanent reference cycle:
         //
         //     self -> self.closure -> self
         self.doNothing()
      }
   }
}
@inline(never) // just to be sure to get this in a stack trace
func myFunctionDoingTheAllocation() {
   let thing = MemoryLeaker()
   thing.doSomethingThatLeaks()
}

myFunctionDoingTheAllocation()
```

### Debugging leaks with Valgrind
Valgrind is an open-source framework for debugging and profiling Linux applications. It provides several tools, including Memcheck, which can detect memory leaks, invalid memory accesses, and other memory errors. Although Valgrind is primarily focused on C/C++ applications, it can also be used with Swift on Linux.

To debug memory leaks for Swift on Linux using Valgrind, install it on your system.

1. Install Swift on your Linux system. You can download and install Swift from the [official website](https://swift.org/download/).
2. Install Valgrind on your Linux system by using your package manager. For example, if you are using Ubuntu, you can run the following command:
```
sudo apt-get install valgrind
```

3. Once Valgrind is installed, run the following command:
```
valgrind --leak-check=full swift run
```

The `valgrind` command analyzes the program for any memory leaks and shows the relevant information about the leak, including the stack trace where the allocation occurred as shown below:
```
==1== Memcheck, a memory error detector
==1== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==1== Using Valgrind-3.13.0 and LibVEX; rerun with -h for copyright info
==1== Command: ./test
==1==
==1==
==1== HEAP SUMMARY:
==1==     in use at exit: 824 bytes in 4 blocks
==1==   total heap usage: 5 allocs, 1 frees, 73,528 bytes allocated
==1==
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: $s4test12MemoryLeakerCACycfC (in /tmp/test)
==1==    by 0x10900E: $s4test28myFunctionDoingTheAllocationyyF (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
==1==
==1== LEAK SUMMARY:
==1==    definitely lost: 32 bytes in 1 blocks
==1==    indirectly lost: 0 bytes in 0 blocks
==1==      possibly lost: 0 bytes in 0 blocks
==1==    still reachable: 792 bytes in 3 blocks
==1==         suppressed: 0 bytes in 0 blocks
==1== Reachable blocks (those to which a pointer was found) are not shown.
==1== To see them, rerun with: --leak-check=full --show-leak-kinds=all
==1==
==1== For counts of detected and suppressed errors, rerun with: -v
==1== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```

The following trace block (from above) indicates a memory leak.
```
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: $s4test12MemoryLeakerCACycfC (in /tmp/test)
==1==    by 0x10900E: $s4test28myFunctionDoingTheAllocationyyF (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
```

However, since Swift uses name mangling for function and symbol names, the stack traces may not be straightforward to understand.

To demangle the Swift symbols in the stack traces, run the `swift demangle` command:
```
swift demangle <mangled_symbol>
```

Replace `<mangled_symbol>` with the mangled symbol name shown in the stack trace. For example:

`swift demangle $s4test12MemoryLeakerCACycfC`

**Note:** `swift demangle` is a Swift command line utility and should be available if you have the Swift toolchain installed.

The utility will demangle the symbol and display a human-readable version as follows:
```
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: test.MemoryLeaker.__allocating_init() -> test.MemoryLeaker (in /tmp/test)
==1==    by 0x10900E: test.myFunctionDoingTheAllocation() -> () (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
```

By analyzing the demangled symbols, we can understand which part of the code is responsible for the memory leak. In this example, the `valgrind` command indicates the allocation that leaked is coming from:

`test.myFunctionDoingTheAllocation` calling `test.MemoryLeaker.__allocating_init()`

####  Limitations

* The `valgrind` command doesn’t understand the bit-packing used in many Swift data types like `String` or when `enums` are created with associated values. Consequently, using the `valgrind` command sometimes reports memory errors or leaks that do not exist, and false negatives occur when it fails to detect actual issues.
* The `valgrind` command makes your program run exceptionally slow (possibly 100x slower), which may hinder your ability to reproduce the problem and analyze the performance.
* Valgrind is primarily supported on Linux. Its support for other platforms, such as macOS or iOS, may be limited or nonexistent.

### Debugging leaks with LeakSanitizer
LeakSanitizer is a memory leak detector that is integrated into [AddressSanitizer](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early). To debug memory leaks using LeakSanitizer with Address Sanitizer enabled on Swift, you will need to set the appropriate environment variable, compile your Swift package with the necessary options, and then run your application.

Here are the steps:

1. Open a terminal session and navigate to your Swift package directory.
2. Set the `ASAN_OPTIONS` environment variable to enable AddressSanitizer and configure its behavior. You can do this by running the command:
```
export ASAN_OPTIONS=detect_leaks=1
```

3. Run `swift build` with the additional option to enable [Address Sanitizer](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early):
```
swift build --sanitize=address
```

The build process will compile your code with AddressSanitizer enabled, which automatically looks for leaked memory blocks. If any memory leaks during the build are detected, it will output the information (similar to Valgrind) as shown in the example below:
```
=================================================================
==478==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 32 byte(s) in 1 object(s) allocated from:
    #0 0x55f72c21ac8d  (/tmp/test+0x95c8d)
    #1 0x7f7e44e686b1  (/usr/lib/swift/linux/libswiftCore.so+0x3cb6b1)
    #2 0x55f72c24b2ce  (/tmp/test+0xc62ce)
    #3 0x55f72c24a4c3  (/tmp/test+0xc54c3)
    #4 0x7f7e43aecb96  (/lib/x86_64-linux-gnu/libc.so.6+0x21b96)

SUMMARY: AddressSanitizer: 32 byte(s) leaked in 1 allocation(s).
```

Currently, the output doesn’t provide a human-readable representation of the function names because [LeakSanitizer doesn't symbolicate stack traces on Linux](https://github.com/swiftlang/swift/issues/55046). However, you can symbolicate it using `llvm-symbolizer` or `addr2line` if you have `binutils` installed.

To install `binutils` for Swift on a server running Linux, follow these steps:

Step 1: Connect to your Swift server through SSH using a terminal.

Step 2: Update the package lists by running the following command:
```
sudo apt update
```

Step 3: Install `binutils` by running the following command:
```
sudo apt install binutils
```

This will install `binutils` and its related tools for working with binaries, object files, and libraries, which can be useful for developing and debugging Swift applications on Linux.

You can now run the following command to demangle the symbols in the stack traces:
```
# /tmp/test+0xc62ce
addr2line -e /tmp/test -a 0xc62ce -ipf | swift demangle
```

In this example, the allocation that leaked is coming from:
```
0x00000000000c62ce: test.myFunctionDoingTheAllocation() -> () at crtstuff.c:?
```

#### Limitations

* LeakSanitizer may not be as effective in detecting and reporting all types of memory leaks in Swift code compared to languages like C or C++.
* False positives occur when LeakSanitizer reports a memory leak that does not exist.
* LeakSanitizer is primarily supported on macOS and Linux. While it is possible to use LeakSanitizer on iOS or other platforms that support Swift, there may be limitations or platform-specific issues that need to be considered.
* Enabling Address Sanitizer and LeakSanitizer in your Swift project can have a performance impact. It is recommended to use LeakSanitizer for targeted analysis and debugging rather than continuously running it in production environments.

### Debugging transient memory usage with Heaptrack
[Heaptrack](https://github.com/KDE/heaptrack) is an open-source heap memory profiler tool that helps find and analyze memory leaks and usage with less overhead than Valgrind. It also allows for analyzing and debugging transient memory usage in your application. However, it may significantly impact performance by overloading the allocator.

A GUI front-end analyzer `heaptrack_gui` is available in addition to command line access. The analyzer allows for diffing between two different runs of your application to troubleshoot variations in `malloc` behavior between the `feature branch` and `main`.

Using a different example, here’s a short how-to using [Ubuntu](https://www.swift.org/download/) to analyze transient usage.

Step 1: Install `heaptrack` by running this command:
```
sudo apt-get install heaptrack
```

Step 2: Run the binary twice using `heaptrack`. The first run provides a baseline for `main`.

```
heaptrack .build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
heaptrack output will be written to "/tmp/.nio_alloc_counter_tests_GRusAy/heaptrack.test_1000_autoReadGetAndSet.84341.gz"
starting application, this might take some time...
...
heaptrack stats:
    allocations:              319347
    leaked allocations:       107
    temporary allocations:    68
Heaptrack finished! Now run the following to investigate the data:

  heaptrack --analyze "/tmp/.nio_alloc_counter_tests_GRusAy/heaptrack.test_1000_autoReadGetAndSet.84341.gz"
```

Step 3: Then run it a second time for the `feature branch` by changing the branch and recompiling.

```
heaptrack .build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
heaptrack output will be written to "/tmp/.nio_alloc_counter_tests_GRusAy/heaptrack.test_1000_autoReadGetAndSet.84372.gz"
starting application, this might take some time...
...
heaptrack stats:
    allocations:              673989
    leaked allocations:       117
    temporary allocations:    341011
Heaptrack finished! Now run the following to investigate the data:

  heaptrack --analyze "/tmp/.nio_alloc_counter_tests_GRusAy/heaptrack.test_1000_autoReadGetAndSet.84372.gz"
ubuntu@ip-172-31-25-161 /t/.nio_alloc_counter_tests_GRusAy>
```

The output shows `673989` allocations in the `feature branch` version and `319347` in `main`, indicating a regression.

Step 4: Run the following command to analyze the output as a diff from these runs using `heaptrack_print` and pipe it through `swift demangle` for readability:
```
heaptrack_print -T -d heaptrack.test_1000_autoReadGetAndSet.84341.gz heaptrack.test_1000_autoReadGetAndSet.84372.gz | swift demangle
```

**Note:** `-T` outputs the temporary allocations, providing transient allocations and not leaks. If leaks are detected, remove `-T`.

Scroll down to see the transient allocations (output may be long):
```
MOST TEMPORARY ALLOCATIONS
307740 temporary allocations of 290324 allocations in total (106.00%) from
swift_slowAlloc
  in /home/ubuntu/bin/usr/lib/swift/linux/libswiftCore.so
43623 temporary allocations of 44553 allocations in total (97.91%) from:
    swift_allocObject
      in /home/ubuntu/bin/usr/lib/swift/linux/libswiftCore.so
    NIO.ServerBootstrap.(bind0 in _C131C0126670CF68D8B594DDFAE0CE57)(makeServerChannel: (NIO.SelectableEventLoop, NIO.EventLoopGroup) throws -> NIO.ServerSocketChannel, _: (NIO.EventLoop, NIO.ServerSocketChannel) -> NIO.EventLoopFuture<()>) -> NIO.EventLoopFuture<NIO.Channel>
      at /home/ubuntu/swiftnio/swift-nio/Sources/NIO/Bootstrap.swift:295
      in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
    merged NIO.ServerBootstrap.bind(host: Swift.String, port: Swift.Int) -> NIO.EventLoopFuture<NIO.Channel>
      in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
    NIO.ServerBootstrap.bind(host: Swift.String, port: Swift.Int) -> NIO.EventLoopFuture<NIO.Channel>
      in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
    Test_test_1000_autoReadGetAndSet.run(identifier: Swift.String) -> ()
      at /tmp/.nio_alloc_counter_tests_GRusAy/Sources/Test_test_1000_autoReadGetAndSet/file.swift:24
      in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
    main
      at Sources/bootstrap_test_1000_autoReadGetAndSet/main.c:18
      in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
22208 temporary allocations of 22276 allocations in total (99.69%) from:
    swift_allocObject
      in /home/ubuntu/bin/usr/lib/swift/linux/libswiftCore.so
    generic specialization <Swift.UnsafeBufferPointer<Swift.Int8>> of Swift._copyCollectionToContiguousArray<A where A: Swift.Collection>(A) -> Swift.ContiguousArray<A.Element>
      in /home/ubuntu/bin/usr/lib/swift/linux/libswiftCore.so
    Swift.String.utf8CString.getter : Swift.ContiguousArray<Swift.Int8>
      in /home/ubuntu/bin/usr/lib/swift/linux/libswiftCore.so
    NIO.URing.getEnvironmentVar(Swift.String) -> Swift.String?
      at /home/ubuntu/swiftnio/swift-nio/Sources/NIO/LinuxURing.swift:291
      in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
    NIO.URing._debugPrint(@autoclosure () -> Swift.String) -> ()
      at /home/ubuntu/swiftnio/swift-nio/Sources/NIO/LinuxURing.swift:297
...
22196 temporary allocations of 22276 allocations in total (99.64%) from:
```

Looking at the output above, we can see the extra transient allocations were due to extra debug printing and querying of environment variables as shown below:
```
NIO.URing.getEnvironmentVar(Swift.String) -> Swift.String?
  at /home/ubuntu/swiftnio/swift-nio/Sources/NIO/LinuxURing.swift:291
  in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
NIO.URing._debugPrint(@autoclosure () -> Swift.String) -> ()
```

In this example, the debug prints are only for testing and would be removed from the code before the branch is merged.

**Tip:** Heaptrack can also be [installed on an RPM-based distribution](https://rhel.pkgs.org/8/epel-x86_64/heaptrack-1.2.0-7.el8.x86_64.rpm.html) to debug transient memory usage. You may need to consult the distribution's documentation for the specific repository setup steps. When Heaptrack is installed correctly, it should display its version and usage information.

#### Limitations

* It's important to note that Heaptrack was primarily designed for C and C++ applications, so its support for Swift applications is limited.
* While Heaptrack can provide insights into memory allocations and deallocations in a Swift application, it may not capture certain Swift-specific memory management mechanisms like Swift's built-in Instruments profiler.
