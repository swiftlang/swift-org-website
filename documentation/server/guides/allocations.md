---
redirect_from: "server/guides/allocations"
layout: page
title: 内存分配
---

## 概述
在服务端 Swift 应用程序中，内存分配对于创建对象、操作数据结构和管理资源等各种任务至关重要。Swift 根据需要分配内存资源，并提供了内置的内存管理机制，例如自动引用计数（ARC），来处理分配、释放和内存所有权。

内存分配通过分配每个对象或数据结构所需的精确内存量来帮助优化内存使用，从而减少内存浪费并提高应用程序性能。但是，Swift 内存分配可以增加填充，以强制执行需要由硬件有效访问的数据类型或结构的内存对齐要求，从而降低内存访问问题未对齐的风险并提高性能。

此外，适当的分配管理可以防止内存泄漏，并确保内存在不再需要时被释放。这有助于维护服务端应用程序的稳定性和可靠性。

## 堆和栈
通常，Swift 有两个基本的内存分配位置：**堆** 和 **栈**。

Swift 自动在堆或栈数据结构中分配内存。

对于 Swift 中的高性能软件，理解你的堆内存分配来源并减少软件的内存分配数量至关重要。识别这些问题与识别其他性能问题类似，例如：

- 在优化性能之前资源被分配到了哪里？
- 使用了哪些类型的资源？CPU？内存？堆内存分配？
  
> 注意：虽然堆内存分配在计算开销方面可能相对昂贵，但它们提供了灵活性和动态内存管理能力，对于处理可变大小或动态数据结构等任务至关重要。

## 分析
根据项目的具体需求，你可以使用不同的工具和技术来分析你的 Swift 代码。一些常用的分析技术包括：

- 使用操作系统供应商提供的分析工具，如 macOS 上的 [Instruments](https://help.apple.com/instruments/mac/current/#/dev7b09c84f5) 或 Linux 上的 [`perf`](https://www.swift.org/server/guides/linux-perf.html)。
- 使用在关键代码部分之前和之后添加时间戳等技术手动测量时间。
- 利用 Swift 的性能分析库和框架，例如 [SwiftMetrics](https://swiftpackageregistry.com/RuntimeTools/SwiftMetrics) 或 [XCGLogger](https://github.com/XCGLogger/)。

对于 macOS，你可以使用 [Xcode](https://developer.apple.com/xcode/) Instruments 中的 [Allocations instrument](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use#Profile-your-app-using-the-Allocations-instrument) 来帮助你分析和优化应用程序中的内存使用。Allocations instrument 跟踪所有堆和匿名虚拟内存分配的大小和数量，并按类别组织它们。

如果你的生产工作不是在 macOS 上，而是在 Linux 上运行，那么分配数量可能会根据你的设置有很大的不同。

*本文档主要关注堆内存分配的数量，而不是它们的大小。*

## 开始使用
Swift 的优化器在 `release` 模式下生成更快的代码，并分配更少的内存。通过在 `release` 模式下分析你的 Swift 代码并根据结果进行优化，你可以在应用程序中获得更好的性能和效率。

按照以下步骤操作：

步骤 1. **构建你的代码** 在 `release` 模式下运行以下命令：
```bash
swift run -c release
```

步骤 2. [**安装 `perf`**](https://www.swift.org/server/guides/linux-perf.html) 来分析你的代码，通过收集到的性能相关数据，优化你的 Swift 服务端应用程序的性能。

步骤 3. **克隆 FlameGraph 项目** 生成可视化火焰图，帮助你快速识别代码库中的热点，可视化调用路径，理解执行流程，并优化性能。要生成火焰图，你需要在你的机器或容器中克隆 [`FlameGraph`](https://github.com/brendangregg/FlameGraph) 仓库到 `~/FlameGraph` 目录。

运行以下命令把 `https://github.com/brendangregg/FlameGraph` 仓库克隆岛 `~/FlameGraph`：
```bash
git clone https://github.com/brendangregg/FlameGraph
```

在 Docker 中运行时，使用以下命令将 `FlameGraph` 仓库绑定挂载到容器中：

```bash
docker run -it --rm \
           --privileged \
           -v "/path/to/FlameGraphOnYourMachine:/FlameGraph:ro" \
           -v "$PWD:PWD" -w "$PWD" \
           swift:latest
```

通过突出显示最频繁调用的函数或消耗最多处理时间的函数，你可以将优化工作集中在改善关键代码的性能上。

## 工具
你可以使用 [Linux `perf`](https://perf.wiki.kernel.org/index.php/Main_Page) 工具来识别需要优化的区域，并做出针对性的改动，以提高你的 Swift 服务端代码的性能和效率。

`perf` 工具是一个在 Linux 系统上可用的性能分析和分析工具。尽管它不是针对 Swift 的，但它对于在服务器上分析 Swift 代码很有价值，原因如下：

- **低开销** 意味着它可以在对你的 Swift 代码执行的影响最小的情况下收集性能数据。
- **丰富的功能** 如 CPU 分析、内存分析和基于事件的采样。
- **生成火焰图** 帮助你理解代码不同区域的相对时间消耗，并识别性能瓶颈。
- **系统级分析** 在内核级别收集性能数据，分析系统范围的事件，并了解其他进程或系统组件对你的 Swift 应用程序性能的影响。
- **灵活性和可扩展性** 允许你自定义你想要分析的事件类型，设置采样率，指定过滤器等。

> 提示 1：如果你在 Docker 容器中运行 `perf`，你将需要一个有特权的容器，以提供工具收集性能数据所需的必要权限和访问。
> 提示 2：如果你需 `root` 访问权限，请在命令前加上  `sudo`。更多相关信息请参阅 [Getting `perf` to work](https://www.swift.org/server/guides/linux-perf.html)。

## 安装 perf 用户探针
如前所述，本文档的示例程序侧重于内存分配的*数量*。

在 Linux 上，大多数内存分配使用 Swift 中的 `malloc` 函数。在内存分配函数上安装 `perf` 用户探针可以提供内存分配函数被调用时的信息。

In this instance，a user probe was installed for all allocation functions because Swift uses other functions like `calloc` and `posix_memalign`.
在这个例子中，需要这也写才能为所有内存分配函数安装用户探针，因为 Swift 使用了其他函数，如 `calloc` 和 `posix_memalign`。

```bash
# 确定 libc 的路径
libc_path=$(readlink -e /lib64/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6)

# 删除 libc 上所有现有的用户探针（你可以用 * 来代替，也可以单独列出它们）
perf probe --del 'probe_libc:*'

# 给 `malloc`，`calloc`，和 `posix_memalign` 函数安装探针
perf probe -x "$libc_path" --add malloc --add calloc --add posix_memalign
```

随后，每当调用其中一个分配函数时，`perf` 中的事件都会触发。

输出应该如下所示：

```
Added new events:
  probe_libc:malloc    (on malloc in /usr/lib/x86_64-linux-gnu/libc-2.31.so)
  probe_libc:calloc    (on calloc in /usr/lib/x86_64-linux-gnu/libc-2.31.so)
  probe_libc:posix_memalign (on posix_memalign in /usr/lib/x86_64-linux-gnu/libc-2.31.so)

[...]
```

这样你就可以看到 `perf` 每次调用相应函数时触发新事件 `probe_libc:malloc`；`probe_libc:calloc`。

要确认用户探针 `probe_libc:malloc` 工作正常，运行此命令：

```bash
perf stat -e probe_libc:malloc -- bash -c 'echo Hello World'
```

输出应该类似于这样：

```
Hello World

 Performance counter stats for 'bash -c echo Hello World':

              1021      probe_libc:malloc

       0.003840500 seconds time elapsed

       0.000000000 seconds user
       0.003867000 seconds sys
```

在这种情况下，用户探针调用内存分配函数 1021 次。

> 重要提示：如果探针调用内存分配函数 0 次，则表示错误。

## 运行内存分配分析
通过运行分配分析，您可以更好地了解应用程序中的内存使用模式，并识别和修复内存问题，例如泄漏或使用效率低下，从而最终提高代码的性能和稳定性。

### 示例程序
一旦您确认 `malloc` 上的用户探针工作正常，您就可以分析程序的内存分配情况。例如，您可以分析一个使用 [AsyncHTTPClient](https://github.com/swift-server/async-http-client)执行十个连续 HTTP 请求的程序。

分析使用 AsyncHTTPClient 的程序可以帮助优化性能，改进错误处理，确保适当的并发和线程处理，增强代码的可读性和可维护性，以及评估可扩展性。

下面是程序源代码示例的依赖库：

```swift
dependencies: [
    .package(url: "https://github.com/swift-server/async-http-client.git", from: "1.3.0"),
    .package(url: "https://github.com/apple/swift-nio.git", from: "2.29.0"),
    .package(url: "https://github.com/apple/swift-log.git", from: "1.4.2"),
],
```

下面是使用 AsyncHTTPClient 的示例程序：

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
                eventLoop.execute { // 为了更短的栈
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
    // 发起请求
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

如果以 Swift 包的形式运行程序，请先使用此命令在 `release` 模式下编译它：

```bash
swift build -c release
```

会生成一个名为 `.build/release/your-program-name` 的二进制文件，可以对其进行分析以获取内存分配的数量。

### 计算内存分配次数
计算内存分配次数并将其可视化为图表有助于您分析内存利用率，配置内存使用情况，优化性能，重构和优化代码，以及调试程序中的内存相关问题。

在将分配可视化为火焰图之前，请先使用二进制文件进行分析，通过运行命令来获取内存分配次数：

```bash
perf stat -e 'probe_libc:*' -- .build/release/your-program-name
```

此命令指示 `perf` 运行您的程序并计算用户探针 `probe_libc:malloc` 被命中或在您的应用程序中分配内存的次数。

输出应该类似于这样：

```
Performance counter stats for '.build/release/your-program-name':

                68      probe_libc:posix_memalign
                35      probe_libc:calloc_1
                 0      probe_libc:calloc
              2977      probe_libc:malloc

[...]
```

在这种情况下，该程序通过 `malloc` 分配了 2977 次以及通过其他内存分配函数少量次。

请务必注意，这里使用的是 `-e probe_libc：*` 命令，而不是单独列出每个事件，例如：
- `-e probe_libc: malloc`
- `probe_libc:calloc`
- `probe_libc:calloc_1`
- `probe_libc:posix_memalign`

> 提示：这种方法假定您没有安装其他 `perf` 用户探针。如果安装了其他 `perf` 用户探针，则需要单独指定您想要计算的每个事件。

### 收集原始数据
收集原始数据对于准确表示系统行为、进行详细的性能分析和调试、分析趋势、提供分析灵活性以及指导性能优化工作至关重要。

`perf` 命令不允许在程序运行时创建实时图表。然而，[Linux Perf 工具](https://perf.wiki.kernel.org/index.php/Main_Page)提供了一个 `perf record` 实用命令，它捕获性能事件以供稍后分析。然后可以将收集的数据转换为图表。

通常，命令 `perf record` 可用于运行程序，`libc_probe：malloc` 来收集信息，如下所示：

```bash
perf record --call-graph dwarf,16384 \
     -m 50000 \
     -e 'probe_libc:*' -- \
     .build/release/your-program-name
```

以下是这个命令结构的分解：

- `perf record` 命令指示 `perf` 记录数据。
- `--call-graph dwarf,16384` 命令指示 `perf` 使用 [具有属性记录格式 （DWARF） 信息的调试](http://www.dwarfstd.org/) 信息来创建调用图。它还将最大堆栈转储大小设置为 16k，这应该足以获得完整的堆栈跟踪。
    - 尽管使用 DWARF 速度较慢（见下文），但它创建了最佳的调用图。
- `-m 50000` 指示 `perf` 使用并输出的环形缓冲区的大小，以 `PAGE_SIZE` （通常为 4kB）的倍数表示。
    - 使用 DWARF 时，需要一个重要的缓冲区来防止数据丢失。
- `-e 'probe_libc:*'` 记录当 `malloc`、`calloc`、以及他 `malloc/calloc/...` 用户探针触发时的数据。
    - 在探针被触发或执行时，触发事件来捕获有关分配的相关信息以供进一步分析和调试。 

您的程序输出应该类似于这样：

```
<your program's output>
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 401.088 MB perf.data (49640 samples) ]
```

通过在代码库中的策略性点放置用户探针您可以跟踪和记录分配事件，以深入了解内存分配模式，识别潜在的性能问题或内存泄漏，并分析您的应用程序中的内存使用情况。

> 重要提示：如果 `perf` 输出返回了 `lost chunks` 并发起 `check the IO/CPU overload!` 的请求，请参阅下面的 **克服数据块丢失**。

### 创建火焰图
一旦您使用 `perf record` 成功记录了数据，您可以调用以下命令生成火焰图的 SVG 文件：

```bash
perf script | \
    /FlameGraph/stackcollapse-perf.pl - | \
    swift demangle --simplified | \
    /FlameGraph/flamegraph.pl --countname allocations \
        --width 1600 > out.svg
```

以下是这个命令结构的分解：

- `perf` 命令将 `perf record` 捕获的二进制信息转换成文本形式。
- `stackcollapse-perf` 命令将 `perf script` 生成的堆栈转换为火焰图的正确格式。
- `swift demangle --simplified` 命令将符号名称转换为我们可读的格式。
- 最后两个命令根据内存分配次数创建火焰图。

命令完成后，将生成一个 SVG 文件，您可以在浏览器中打开该文件。

> 注意：根据数据大小、算法复杂性、资源限制（如 CPU 功率或内存）、代码优化不良或效率低下、外部服务、API 或网络延迟，可能会导致运行时间很长。

### 阅读火焰图
这个火焰图是本节中示例程序的直接结果。将鼠标悬停在堆栈帧上以获取更多信息，或点击任何堆栈帧可放大子树。

<p><img src="/assets/images/server-guides/perf-malloc-full.svg" alt="Flame graph" /></p>

- 在解读火焰*图*时，X 轴表示 **计数** 而不是时间。堆栈的排列（左或右）并不是由该堆栈活跃的时间决定的，这与火焰*图表*不同。
  
- 这个火焰图不是 CPU 火焰图，而是内存分配火焰图，其中一个样本表示一次内存分配，而不是 CPU 上花费的时间。
- 宽堆栈帧不一定（直接）分配，这意味着函数或函数调用的内容被分配了多次。

    - 例如，`BaseSocketChannel.readable` 是一个宽帧，但它的函数不直接分配。相反，它调用了其他函数，例如 SwiftNIO 和 AsyncHTTPClient 的其他部分，它们进行了相当数量的内存分配。

## macOS 上的内存分配火焰图
虽然本教程的大部分关注 `perf` 工具，但您也可以使用 macOS 创建相同的图表。

步骤 1. 首先，使用 [DTrace](https://en.wikipedia.org/wiki/DTrace) 框架收集原始数据，运行此命令：

```bash
sudo dtrace -n 'pid$target::malloc:entry,pid$target::posix_memalign:entry,pid$target::calloc:entry,pid$target::malloc_zone_malloc:entry,pid$target::malloc_zone_calloc:entry,pid$target::malloc_zone_memalign:entry { @s[ustack(100)] = count(); } ::END { printa(@s); }' -c .build/release/your-program > raw.stacks
```

与 Linux 的 `perf` 用户探针一样，DTrace 也使用探针。上述命令指示 `dtrace` 聚合对等内存分配函数的调用次数：

- `malloc`
- `posix_memalign`
- `calloc`
- `malloc_zone_*`

> 注意：在 Apple 平台上，Swift 使用的分配函数数量略多于 Linux。

步骤 2. 数据收集完成后，运行此命令创建 SVG 文件：

```bash
cat raw.stacks |\
    /FlameGraph/stackcollapse.pl - | \
    swift demangle --simplified | \
    /FlameGraph/flamegraph.pl --countname allocations \

        --width 1600 > out.svg
```

您会注意到这个命令与 `perf` 调用类似，但有以下不同：
- 命令 `cat raw.stacks` 替换了 `perf script` 命令，因为 `dtrace` 已经包含了一个文本数据文件。
- 命令 `stackcollapse.pl`，它解析 `dtrace` 的聚合输出，替换了 `stackcollapse-perf.pl` 命令，后者解析 `perf script` 的输出。

## 其他 perf 技巧

### Swift 的内存分配模式
根据火焰图提供的信息优化内存分配并提高代码效率，可以帮助您的 Swift 代码变得更高效和视觉上更具吸引力。Swift 中的内存分配形式会根据分配的内存类型和使用方式而有所不同。

Swift 中一些常见的内存分配形式包括：

- 单个对象分配
- 集合分配
- 字符串
- 函数调用堆栈
- 存在型协议
- 类和结构体

例如，一个类实例（进行内存分配）会调用 `swift_allocObject`，该方法调用 `swift_slowAlloc`，然后调用包含用户探针的 `malloc`。

### “美化”内存分配模式
为了让您的火焰图看起来更美观（在解开堆栈混淆后），请通过以下方式将这段代码插入到 Linux `perf script` 代码中（如上所述）：

- 移除 `specialized` 并将其替换为 `swift_allocObject`。
- 调用 `swift_slowAlloc`，该方法调用 `malloc`。
- 使用 `A` 表示内存分配。

这些更改应该像这样：

```bash
sed -e 's/specialized //g' \
    -e 's/;swift_allocObject;swift_slowAlloc;__libc_malloc/;A/g'
```

要在 Swift 中分析内存分配时生成视觉上吸引人的 SVG 文件火焰图，请使用完整的命令：

```bash
perf script | \
    /FlameGraph/stackcollapse-perf.pl - | \
    swift demangle --simplified | \
    sed -e 's/specialized //g' \
        -e 's/;swift_allocObject;swift_slowAlloc;__libc_malloc/;A/g' | \
    /FlameGraph/flamegraph.pl --countname allocations --flamechart --hash \
    > out.svg
```

## 克服数据缺失块
当使用 perf 并且带有 DWARF 堆栈回溯时，您可能会遇到这个问题：

```
[ perf record: Woken up 189 times to write data ]
Warning:
Processed 4346 events and lost 144 chunks!

Check IO/CPU overload!

[ perf record: Captured and wrote 30.868 MB perf.data (3817 samples) ]
```

如果 `perf` 表示它丢失了几个块，这意味着它丢失了数据。当 `perf` 丢失数据时，您可以使用以下选项来帮助解决问题：

- 减少程序执行的工作量。 
    - 对于每次内存分配，`perf` 都会记录一个堆栈跟踪。
- 通过更改 `--call-graph dwarf` 参数来减少 `perf` 记录的最大堆栈*转储*。例如，更改为：`--call-graph dwarf，2048`
    - 默认值最多记录 4096 字节，呈现深堆栈。如果您不需要高容量输出，则可以减少此数字。但是，火焰图可能会显示 `[unknown]` 堆栈帧，这意味着存在缺失的堆栈帧（以字节为单位）。
- 增加 `-m` 参数的数量，这是 `perf` 在内存中使用的环形缓冲区的大小，并以 `PAGE_SIZE`（通常为 4kB）的倍数渲染。
- 用 `--call-tree fp` 替换命令 `--call-tree dwarf`，以生成一个调用树报告，提供程序内函数调用的层次视图，展示如何调用函数以及不同函数间的关系。

总体来说，这些做法帮助您理解程序的行为，识别瓶颈，并提高您的 Swift 应用程序的性能。
