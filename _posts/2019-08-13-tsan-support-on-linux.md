---
layout: new-layouts/blog
published: true
date: 2019-08-13 10:00:00
title: Thread Sanitizer for Swift on Linux
author: jlettner
---

Thread Sanitizer is now available on Linux as part of Swift 5.1! Head over to [Swift.org](/download/#snapshots) and grab a Swift 5.1 Development snapshot to try it out.

The Swift language guarantees [memory safety](https://docs.swift.org/swift-book/LanguageGuide/MemorySafety.html) in single threaded environments. However, conflicting accesses in multithreaded code lead to _data races_. Data races in Swift cause unexpected behavior and can even lead to memory corruption, breaking Swift’s memory safety. [Thread Sanitizer](https://developer.apple.com/documentation/code_diagnostics/thread_sanitizer) is a bug-finding tool that diagnoses data races at run time. It instruments code during compilation and detects data races when they happen during execution.

### Example of a Data Race

Let’s take a look at a simple, multithreaded program. It uses [`DispatchQueue.concurrentPerform`](https://developer.apple.com/documentation/dispatch/dispatchqueue/2016088-concurrentperform) which implements an efficient *parallel for-loop*.

~~~swift
import Dispatch

func computePartialResult(chunk: Int) -> Result {
    var result = Result()
    // Computing the result is an expensive operation.
    return result
}

var results = [Result]()

DispatchQueue.concurrentPerform(iterations: 100) { index in
    let r = computePartialResult(chunk: index)
    results.append(r)
}

print("Result count: \(results.count)")
~~~

On first glance one might expect this program to print “Result count: 100”. Instead it may print “91”, “94”, or even crash. The reason is that the program contains a data race: multiple threads mutate the `results` array without synchronization.

In this example, it is easy to spot which part of the code introduces the data race. However, in real-world applications data races can be very difficult to diagnose. Their symptoms may be only observed sporadically, and they can change program behavior in subtle ways. In the worst case, they can corrupt memory and break Swift’s memory safety. Thankfully, Thread Sanitizer has proven to be an effective tool to detect and diagnose data races in Swift.

### Using Thread Sanitizer

To instrument your program with Thread Sanitizer, use the `-sanitize=thread` compiler flag and make sure to build your program in *Debug* mode. Thread Sanitizer relies on debug information to describe the problems it finds.

#### Swift Compiler

Thread Sanitizer can be used from a Swift compiler invocation on the command line:

~~~console
swiftc -g -sanitize=thread
~~~

Because Thread Sanitizer currently works best with un-optimized code that is built with debug information, either omit compiler flags for optimization or use  `-Onone` to override a pre-existing optimization level.

#### Swift Package Manager

Thread Sanitizer can also be used directly with the Swift Package Manager:

~~~console
swift build -c debug --sanitize=thread
~~~

Use the `test` target (instead of `build`) to run your package’s tests with Thread Sanitizer enabled. Note that your tests need to actually exercise multithreaded code, otherwise Thread Sanitizer will not find data races.

### Example

Let’s compile and run the simple example to see how Thread Sanitizer reports the data race. On Linux, Thread Sanitizer does not output unmangled Swift symbol names. You can use `swift-demangle` to make the report more clear:

~~~console
➤ swiftc main.swift -g -sanitize=thread -o race
➤ ./race 2>&1 | swift-demangle
==================
WARNING: ThreadSanitizer: Swift access race (pid=96)
  Modifying access of Swift variable at 0x7ffef26e65d0 by thread T2:
    #0 closure #1 (Swift.Int) -> () in main main.swift:41 (swift-linux+0xb9921)
    #1 partial apply forwarder for closure #1 (Swift.Int) -> () in main <compiler-generated>:? (swift-linux+0xb9d4c)
       [... stack frames ...]

  Previous modifying access of Swift variable at 0x7ffef26e65d0 by thread T1:
    #0 closure #1 (Swift.Int) -> () in main main.swift:41 (swift-linux+0xb9921)
    #1 partial apply forwarder for closure #1 (Swift.Int) -> () in main race-b3c26c.o:? (swift-linux+0xb9d4c)
       [... stack frames ...]

  Location is stack of main thread.

  Thread T2 (tid=99, running) created by main thread at:
    #0 pthread_create /home/buildnode/jenkins/workspace/oss-swift-5.1-package-linux-ubuntu-16_04/llvm/projects/compiler-rt/lib/tsan/rtl/tsan_interceptors.cc:980 (swift-linux+0x487b5)
       [... stack frames ...]
    #3 static Dispatch.DispatchQueue.concurrentPerform(iterations: Swift.Int, execute: (Swift.Int) -> ()) -> () ??:? (libswiftDispatch.so+0x1d916)
    #4 __libc_start_main ??:? (libc.so.6+0x2082f)

  Thread T1 (tid=98, running) created by main thread at:
    #0 pthread_create /home/buildnode/jenkins/workspace/oss-swift-5.1-package-linux-ubuntu-16_04/llvm/projects/compiler-rt/lib/tsan/rtl/tsan_interceptors.cc:980 (swift-linux+0x487b5)
       [...stack frames ...]
    #3 static Dispatch.DispatchQueue.concurrentPerform(iterations: Swift.Int, execute: (Swift.Int) -> ()) -> () ??:? (libswiftDispatch.so+0x1d916)
    #4 __libc_start_main ??:? (libc.so.6+0x2082f)

SUMMARY: ThreadSanitizer: Swift access race main.swift:41 in closure #1 (Swift.Int) -> () in main
==================
[... more identical warnings ...]
==================
~~~

A good place to start for understanding Thread Sanitizer reports is the summary line.  It shows:

* The type of bug detected, in this case a "Swift access race"
* The source location, main.swift:41, which is `results.append(r)`
* The enclosing function, which in this case is a a compiler-generated closure

Note that a data race involves at least two threads concurrently accessing the same memory location (without proper synchronization) where at least one of them writes. Thread Sanitizer reports which threads were involved ("Modifying access/Previous modifying access ... by thread ...") and provides the stack traces of these two conflicting accesses.

In this simple example, both accesses were produced by the same source statement. However, this is not always the case. Knowing the traces for both accesses can be invaluable when debugging subtle interactions in large applications. The report also states how the racing threads were created ("Thread ... created by ..."). In this example, they were created by the main thread in a call to `concurrentPerform`.

Once an issue is understood, the next step is to fix it.  How this is done heavily depends on the specific situation and the goals of the code.  For example, the goal could be to use concurrency to prevent a long-running task from locking up the user interface of an app. A different goal could be to speed up a service by splitting up its workload into separate work items and process them in parallel to utilize more cores on a powerful server machine.

Even in the simple example, there are many different choices for fixing the data race. A general guideline is to prefer high-level abstractions over low-level synchronization primitives whenever the environment and performance constraints allow for it. Let’s use a serial queue to add proper synchronization to the example:

~~~swift
let serialQueue = DispatchQueue(label: "Results Queue")

DispatchQueue.concurrentPerform(iterations: 100) { index in
    let r = computePartialResult(chunk: index)
    serialQueue.sync {
        results.append(r);
    }
}
~~~

The above code establishes proper synchronization by serializing calls to `results.append`, which removes the data race. Note that the rest of the closure including `computePartialResult` still executes in parallel. This means that the order in which the partial results will appear in the `results` array may change between different runs of the program.

One of the main goals of Swift is to make programming simple things easy and difficult things possible. Writing efficient, multithreaded programs is one of those difficult things. Swift guarantees memory safety in the absence of data races, and allows developers to take on additional complexity when they need to. With Thread Sanitizer, developers have a tool in their tool belt that helps bring Swift’s safety and productivity to multithreaded environments.

### Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/swift-org-blog-thread-sanitizer-for-swift-on-linux/27872) on the [Swift forums][].

[Swift forums]: https://forums.swift.org
