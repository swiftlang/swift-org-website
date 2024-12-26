---
redirect_from: "server/guides/linux-perf"
layout: page
title: Linux perf
---

## `perf` 是什么？

Linux [`perf` 工具](https://perf.wiki.kernel.org/index.php/Main_Page) 是一个非常强大的工具，它可以用于：

- 采样 CPU 绑定的进程（或整个系统）以分析应用程序的哪个部分在消耗 CPU 时间
- 访问 CPU 性能计数器 (PMU)
- "用户探针" (uprobes)，例如在应用程序中的某个函数运行时触发

一般来说，`perf` 可以在某个事件发生时计数和/或记录线程的调用栈。这些事件可以由以下情况触发：

- 时间（例如每秒 1000 次），用于时间分析。有关示例用法，请参阅 [CPU 性能调试指南](/documentation/server/guides/performance.html)。
- 系统调用，用于查看系统调用发生的位置。
- 各种系统事件，例如如果您想知道上下文切换何时发生。
- CPU 性能计数器，如果您的性能问题可以追溯到 CPU 的微架构细节（例如分支预测失败），这将非常有用。有关示例，请参阅 [SwiftNIO 的高级性能分析指南](https://github.com/apple/swift-nio/blob/main/docs/advanced-performance-analysis.md)。
- 以及更多

## 使 `perf` 工作

不幸的是，使 `perf` 工作取决于您的环境。请在下面找到一些环境以及如何在这些环境中使 `perf` 工作。

### 安装 `perf`

从技术上讲，`perf` 是 Linux 内核源代码的一部分，您需要一个与您的 Linux 内核版本完全匹配的 `perf` 版本。然而，在许多情况下，一个“足够接近”的 `perf` 版本也可以。如果有疑问，请使用比您的内核稍旧的 `perf` 版本，而不是更新的版本。

- Ubuntu

    ```
    apt-get update && apt-get -y install linux-tools-generic
    ```

  请参阅下文了解更多信息，因为 Ubuntu 为每个内核版本打包了不同的 `perf`。
- Debian

    ```
    apt-get update && apt-get -y install linux-perf
    ```

- Fedora/RedHat derivates

   ```
   yum install -y perf
   ```

您可以使用 `perf stat -- sleep 0.1`（如果您已经是 `root`）或 `sudo perf stat -- sleep 0.1` 来确认您的 `perf` 安装是否正常工作。


##### `perf` 在 Ubuntu 上无法匹配内核版本时

在 Ubuntu（以及其他为每个内核版本打包 `perf` 的发行版）上，您可能会在安装 `linux-tools-generic` 后看到错误。错误消息将类似于

```
$ perf stat -- sleep 0.1
WARNING: perf not found for kernel 5.10.25

  You may need to install the following packages for this specific kernel:
    linux-tools-5.10.25-linuxkit
    linux-cloud-tools-5.10.25-linuxkit

  You may also want to install one of the following packages to keep up to date:
    linux-tools-linuxkit
    linux-cloud-tools-linuxkit
```

最好的解决方法是按照 `perf` 的提示安装上述软件包之一。如果您在 Docker 容器中，这可能是不可能的，因为您需要匹配内核版本（在 Docker for Mac 中尤其困难，因为它使用虚拟机）。例如，建议的 `linux-tools-5.10.25-linuxkit` 实际上不可用。

作为一种解决方法，您可以尝试以下选项之一

- 如果您已经是 `root` 并且更喜欢 shell `alias`（仅在此 shell 中有效）

    ```
    alias perf=$(find /usr/lib/linux-tools/*/perf | head -1)
    ```

- 如果您是用户并且希望链接 `/usr/local/bin/perf`

    ```
    sudo ln -s "$(find /usr/lib/linux-tools/*/perf | head -1)" /usr/local/bin/perf
    ```

之后，您应该能够成功使用 `perf stat -- sleep 0.1`（如果您已经是 `root`）或 `sudo perf stat -- sleep 0.1`。

### 裸机

对于裸机 Linux 机器，您只需安装 `perf`，它应该可以完全正常工作。

### 在 Docker 中（运行在裸机 Linux 上）

您需要使用 `docker run --privileged` 启动容器（不要在生产环境中运行此命令），然后您应该可以完全访问 perf（包括 PMU）。

要验证 `perf` 是否正常工作，请运行例如 `perf stat -- sleep 0.1`。是否会看到某些信息旁边的 `<not supported>` 取决于您是否可以访问 CPU 的性能计数器（PMU）。在裸机上的 Docker 中，这应该可以工作，即不应显示 `<not supported>`。

### Docker for Mac

Docker for Mac 类似于裸机上的 Docker，但由于我们实际上在 Linux 虚拟机中托管 Docker 容器，因此增加了一些复杂性。因此，匹配内核版本将很困难。

如果您按照上述安装说明进行操作，您仍然可以使 `perf` 工作，但您将无法访问 CPU 的性能计数器（PMU），因此您会看到一些事件显示为 `<not supported>`。

```
$ perf stat -- sleep 0.1

 Performance counter stats for 'sleep 0.1':

              0.44 msec task-clock                #    0.004 CPUs utilized
                 1      context-switches          #    0.002 M/sec
                 0      cpu-migrations            #    0.000 K/sec
                57      page-faults               #    0.129 M/sec
   <not supported>      cycles
   <not supported>      instructions
   <not supported>      branches
   <not supported>      branch-misses

       0.102869000 seconds time elapsed

       0.000000000 seconds user
       0.001069000 seconds sys
```

### 在虚拟机（VM）中

在虚拟机中，您将像在裸机上一样安装 `perf`。并且 `perf` 要么可以正常工作并具有其所有功能，要么看起来类似于您在 Docker for Mac 上获得的结果。

您需要您的虚拟机管理程序支持（并允许）“PMU 直通”或“PMU 虚拟化”。VMware Fusion 支持 PMU 虚拟化，他们称之为 vPMC（虚拟机设置 -> 处理器和内存 -> 高级 -> 允许在此虚拟机就中进行代码分析应用程序）。如果您使用的是 Mac，此设置仅支持到 macOS Catalina（并且[不支持 Big Sur](https://kb.vmware.com/s/article/81623)）。

如果您使用 `libvirt` 来管理您的虚拟机管理程序和虚拟机，您可以使用 `sudo virsh edit your-domain` 并将 `<cpu .../>` XML 标签替换为

    <cpu mode='host-passthrough' check='none'/>

以允许 PMU 直通到访客。对于其他虚拟机管理程序，互联网搜索通常会揭示如何启用 PMU 直通。
