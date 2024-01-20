---
layout: page
title: Debugging Memory Leaks and Usage
---

There are many different tools for troubleshooting memory leaks both on Linux and macOS, each with different strengths and ease-of-use. One excellent tool is the Xcode's [Memory Graph Debugger](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/debugging_with_xcode/chapters/special_debugging_workflows.html#//apple_ref/doc/uid/TP40015022-CH9-DontLinkElementID_1). [Instruments](https://help.apple.com/instruments/mac/10.0/#/dev022f987b) and `leaks` can also be very useful. If you cannot run or reproduce the problem on macOS, there are a number of server-side alternatives below.

## Example program

The following program doesn't do anything useful but leaks memory so will serve as the example:

```swift
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

## Debugging leaks with `valgrind`

If you run your program using

    valgrind --leak-check=full ./test

then `valgrind` will output

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

The important part is

```
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: $s4test12MemoryLeakerCACycfC (in /tmp/test)
==1==    by 0x10900E: $s4test28myFunctionDoingTheAllocationyyF (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
```

which can demangled by pasting it into `swift demangle`:

```
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: test.MemoryLeaker.__allocating_init() -> test.MemoryLeaker (in /tmp/test)
==1==    by 0x10900E: test.myFunctionDoingTheAllocation() -> () (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
```

So valgrind is telling us that the allocation that eventually leaked is coming from `test.myFunctionDoingTheAllocation` calling `test.MemoryLeaker.__allocating_init()` which is correct.

### Limitations

- `valgrind` doesn't understand the bit packing that is used in many Swift data types (like `String`) or when you create `enum`s with associated values. Therefore `valgrind` sometimes claims a certain allocation was leaked even though it might not have
- `valgrind` will make your program run _very slow_ (possibly 100x slower) which might stop you from even getting far enough to reproduce the issue.

## Debugging leaks with `Leak Sanitizer`

If you build your application using

    swift build --sanitize=address

it will be built with [Address Sanitizer](https://github.com/google/sanitizers/wiki/AddressSanitizerLeakSanitizer) enabled. Address Sanitizer also automatically tries to find leaked memory blocks, just like `valgrind`.

The output from the above example program would be

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

which shows the same information as `valgrind`, unfortunately however not symbolicated due to [SR-12601](https://bugs.swift.org/browse/SR-12601).

You can symbolicate it using `llvm-symbolizer` or `addr2line` if you have `binutils` installed like so:

```
# /tmp/test+0xc62ce
addr2line -e /tmp/test -a 0xc62ce -ipf | swift demangle
0x00000000000c62ce: test.myFunctionDoingTheAllocation() -> () at crtstuff.c:?
```
## Debugging transient memory usage with `heaptrack`
[Heaptrack](https://github.com/KDE/heaptrack) is very useful for analyzing memory leaks/usage with less overhead than `valgrind` - but more importantly is also allows for analyzing transient memory usage which may significantly impact performance by putting to much pressure on the allocator.

In addition to command line access, there is a graphical front-end `heaptrack_gui`.

A key feature is that it allows for diffing between two different runs of your application, making it fairly easy to troubleshoot differences in `malloc` behavior between e.g. feature branches and main.

A short how-to run on Ubuntu 20.04 (using a different example than above, as we look at transient usage in this example), install `heaptrack` with:

```
sudo apt-get install heaptrack
```

Then run the binary with `heaptrack` two times — first we do it for `main` to get a baseline:
```
> heaptrack .build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
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
Then run it a second time for the feature branch:
```
> heaptrack .build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
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
Here we could see that we had 673989 allocations in the feature branch version and 319347 in `main`, so clearly a regression.

Finally, we can analyze the output as a diff from these runs using `heaptrack_print` and pipe it through `swift demangle` for readability:

```
heaptrack_print -T -d heaptrack.test_1000_autoReadGetAndSet.84341.gz heaptrack.test_1000_autoReadGetAndSet.84372.gz | swift demangle
```
`-T` gives us the temporary allocations (as it in this case was not a leak, but a transient allocation - if you have leaks remove `-T`).

The output can be quite long, but in this case as we look for transient allocations, scroll down to:

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

And here we could fairly quickly see that the transient extra allocations was due to extra debug printing and querying of environment variables:

```
NIO.URing.getEnvironmentVar(Swift.String) -> Swift.String?
  at /home/ubuntu/swiftnio/swift-nio/Sources/NIO/LinuxURing.swift:291
  in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
NIO.URing._debugPrint(@autoclosure () -> Swift.String) -> ()
```

And this code will be removed before final integration of the feature branch, so the diff will go away.
