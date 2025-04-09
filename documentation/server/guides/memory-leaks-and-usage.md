---
redirect_from: "server/guides/memory-leaks-and-usage"
layout: page
title: 调试内存泄漏
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
    
*在 Linux 上*：Swift 内置了 LeakSanitizer 支持，可以通过地址消毒器（Address Sanitizer）启用。更多信息，请阅读[使用 LeakSanitizer 调试内存泄漏](#debugging-leaks-with-leaksanitizer)部分。

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

### 使用 Valgrind 调试内存泄漏
Valgrind 是一个用于调试和分析 Linux 应用程序的开源框架。它提供了多个工具，包括 Memcheck，可以检测内存泄漏、无效内存访问和其他内存错误。尽管 Valgrind 主要针对 C/C++ 应用程序，但它也可以在 Linux 上与 Swift 一起使用。

要使用 Valgrind 调试 Linux 上的 Swift 内存泄漏，请在系统上安装它。

1. 在您的 Linux 系统上安装 Swift。您可以从 [official website](https://swift.org/download/) 下载并安装 Swift。
2. 使用包管理器在您的 Linux 系统上安装 Valgrind。例如，如果您使用的是 Ubuntu，可以运行以下命令：

```
sudo apt-get install valgrind
```

3. 安装 Valgrind 后，运行以下命令：
```
valgrind --leak-check=full swift run
```

`valgrind` 命令会分析程序中的任何内存泄漏，并显示有关泄漏的相关信息，包括分配发生的堆栈跟踪，如下所示：
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

以下跟踪块（来自上面）表示内存泄漏。
```
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: $s4test12MemoryLeakerCACycfC (in /tmp/test)
==1==    by 0x10900E: $s4test28myFunctionDoingTheAllocationyyF (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
```

然而，由于 Swift 使用名称重整（name mangling）来处理函数和符号名称，堆栈跟踪可能不容易理解。

要在堆栈跟踪中解码 Swift 符号，请运行 `swift demangle` 命令：

```
swift demangle <mangled_symbol>
```

将 `<mangled_symbol>` 替换为堆栈跟踪中显示的重整符号名称。例如：

`swift demangle $s4test12MemoryLeakerCACycfC`

**注意**：`swift demangle` 是一个 Swift 命令行工具，如果您安装了 Swift 工具链，它应该是可用的。

该工具将解码符号并显示人类可读的版本，如下所示：
```
==1== 32 bytes in 1 blocks are definitely lost in loss record 1 of 4
==1==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x52076B1: swift_slowAlloc (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x5207721: swift_allocObject (in /usr/lib/swift/linux/libswiftCore.so)
==1==    by 0x108E58: test.MemoryLeaker.__allocating_init() -> test.MemoryLeaker (in /tmp/test)
==1==    by 0x10900E: test.myFunctionDoingTheAllocation() -> () (in /tmp/test)
==1==    by 0x108CA3: main (in /tmp/test)
```

通过分析解码后的符号，我们可以了解代码的哪个部分导致了内存泄漏。在此示例中，`valgrind` 命令指示泄漏的分配来自：

`test.myFunctionDoingTheAllocation` calling `test.MemoryLeaker.__allocating_init()`

#### 限制

* `valgrind` 命令不理解许多 Swift 数据类型（如 `String`）中使用的位打包，或者当创建带有关联值的 `enums` 时。因此，使用 `valgrind` 命令有时会报告不存在的内存错误或泄漏，并且在未能检测到实际问题时会出现假阴性。
* `valgrind` 命令会使您的程序运行异常缓慢（可能慢 100 倍），这可能会阻碍您重现问题和分析性能。
* Valgrind 主要在 Linux 上受支持。它对其他平台（如 macOS 或 iOS）的支持可能有限或不存在。

### 使用 LeakSanitizer 调试内存泄漏
LeakSanitizer 是一个内存泄漏检测器，集成在 [AddressSanitizer](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early) 中。要使用 LeakSanitizer 调试启用了 Address Sanitizer 的 Swift 内存泄漏，您需要设置适当的环境变量，使用必要的选项编译您的 Swift 包，然后运行您的应用程序。

以下是步骤：

1. 打开终端会话并导航到您的 Swift 包目录。
2. 设置 `ASAN_OPTIONS` 环境变量以启用 AddressSanitizer 并配置其行为。您可以通过运行以下命令来执行此操作：
```
export ASAN_OPTIONS=detect_leaks=1
```

3. 使用附加选项运行 `swift build` 以启用 [Address Sanitizer](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early):
```
swift build --sanitize=address
```

构建过程将启用 AddressSanitizer 编译您的代码，该工具会自动查找泄漏的内存块。如果在构建期间检测到任何内存泄漏，它将输出信息（类似于 Valgrind），如下所示：
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

目前，输出不提供函数名称的可读表示，因为 [LeakSanitizer 在 Linux 上不符号化堆栈跟踪](https://github.com/swiftlang/swift/issues/55046)。但是，如果您安装了 `binutils`，可以使用 `llvm-symbolizer` 或 `addr2line` 进行符号化。


要在运行 Linux 的服务器上为 Swift 安装 `binutils`，请按照以下步骤操作：

步骤 1：使用终端通过 SSH 连接到您的 Swift 服务器。

步骤 2：运行以下命令更新包列表：
```
sudo apt update
```

步骤 3：运行以下命令安装 `binutils`：
```
sudo apt install binutils
```

这将安装 `binutils` 及其相关工具，用于处理二进制文件、目标文件和库，这对于在 Linux 上开发和调试 Swift 应用程序非常有用。

您现在可以运行以下命令来解码堆栈跟踪中的符号：
```
# /tmp/test+0xc62ce
addr2line -e /tmp/test -a 0xc62ce -ipf | swift demangle
```

在此示例中，泄漏的分配来自：
```
0x00000000000c62ce: test.myFunctionDoingTheAllocation() -> () at crtstuff.c:?
```

#### 限制

* 与 C 或 C++ 等语言相比，LeakSanitizer 在检测和报告 Swift 代码中的所有类型内存泄漏方面可能不如有效。
* 当 LeakSanitizer 报告不存在的内存泄漏时，会出现误报。
* LeakSanitizer 主要在 macOS 和 Linux 上受支持。虽然可以在支持 Swift 的 iOS 或其他平台上使用 LeakSanitizer，但可能需要考虑平台特定的问题或限制。
* 在 Swift 项目中启用 Address Sanitizer 和 LeakSanitizer 会对性能产生影响。建议将 LeakSanitizer 用于有针对性的分析和调试，而不是在生产环境中持续运行。

### 使用 Heaptrack 调试瞬态内存使用
[Heaptrack](https://github.com/KDE/heaptrack) 是一个开源堆内存分析工具，有助于发现和分析内存泄漏和使用情况，其开销比 Valgrind 小。它还允许分析和调试应用程序中的瞬态内存使用情况。然而，它可能会通过过载分配器显著影响性能。

除了命令行访问外，还提供了一个 GUI 前端分析器 `heaptrack_gui`。该分析器允许在应用程序的两次不同运行之间进行差异分析，以排除 `feature branch` 和 `main` 之间 `malloc` 行为的差异。

使用不同的示例，以下是在 [Ubuntu](https://www.swift.org/download/) 上分析瞬态使用情况的简短指南。

步骤 1：运行以下命令安装 `heaptrack`：
```
sudo apt-get install heaptrack
```

步骤 2：使用 `heaptrack` 运行二进制文件两次。第一次运行为 `main` 提供基线。

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

步骤 3：然后通过更改分支并重新编译来为 `feature branch` 运行第二次。

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

输出显示 `feature branch` 版本中的分配为 `673989`，而 `main` 中为 `319347`，表明存在回归。

步骤 4：运行以下命令以使用 `heaptrack_print` 分析输出作为这些运行的差异，并通过 `swift demangle` 进行可读性处理：
```
heaptrack_print -T -d heaptrack.test_1000_autoReadGetAndSet.84341.gz heaptrack.test_1000_autoReadGetAndSet.84372.gz | swift demangle
```

**注意**：`-T` 输出临时分配，提供瞬态分配而不是泄漏。如果检测到泄漏，请删除 `-T`。

向下滚动以查看瞬态分配（输出可能很长）：
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

查看上面的输出，我们可以看到额外的瞬态分配是由于额外的调试打印和查询环境变量，如下所示：
```
NIO.URing.getEnvironmentVar(Swift.String) -> Swift.String?
  at /home/ubuntu/swiftnio/swift-nio/Sources/NIO/LinuxURing.swift:291
  in /tmp/.nio_alloc_counter_tests_GRusAy/.build/x86_64-unknown-linux-gnu/release/test_1000_autoReadGetAndSet
NIO.URing._debugPrint(@autoclosure () -> Swift.String) -> ()
```

在这个例子中，调试打印仅用于测试，并将在分支合并前从代码中移除。

**提示：** Heaptrack 也可以 [installed on an RPM-based distribution](https://rhel.pkgs.org/8/epel-x86_64/heaptrack-1.2.0-7.el8.x86_64.rpm.html) 以调试瞬态内存使用。您可能需要查阅发行版的文档以获取特定的存储库设置步骤。当 Heaptrack 正确安装时，它应该显示其版本和使用信息。