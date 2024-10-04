---
redirect_from: "server/guides/linux-perf"
layout: new-layouts/base
title: Linux perf
---

## `perf`, what's that?

The Linux [`perf` tool](https://perf.wiki.kernel.org/index.php/Main_Page) is an incredibly powerful tool, that can amongst other things be used for:

- Sampling CPU-bound processes (or the whole) system to analyse which part of your application is consuming the CPU time
- Accessing CPU performance counters (PMU)
- "user probes" (uprobes) which trigger for example when a certain function in your application runs

In general, `perf` can count and/or record the call stacks of your threads when a certain event occurs. These events can be triggered by:

- Time (e.g. 1000 times per second), useful for time profiling. For an example use, see the [CPU performance debugging guide](/documentation/server/guides/performance.html).
- System calls, useful to see where your system calls are happening.
- Various system events, for example if you'd like to know when context switches occur.
- CPU performance counters, useful if your performance issues can be traced down to micro-architectural details of your CPU (such as branch mispredictions). For an example, see [SwiftNIO's Advanced Performance Analysis guide](https://github.com/apple/swift-nio/blob/main/docs/advanced-performance-analysis.md).
- and much more

## Getting `perf` to work

Unfortunately, getting `perf` to work depends on your environment. Below, please find a selection of environments and how to get `perf` to work there.

### Installing `perf`

Technically, `perf` is part of the Linux kernel sources and you'd want a `perf` version that exactly matches your Linux kernel version. In many cases however a "close-enough" `perf` version will do too. If in doubt, use a `perf` version that's slightly older than your kernel over one that's newer.

- Ubuntu

    ```
    apt-get update && apt-get -y install linux-tools-generic
    ```

  See below for more information because Ubuntu packages a different `perf` per kernel version.
- Debian

    ```
    apt-get update && apt-get -y install linux-perf
    ```

- Fedora/RedHat derivates

   ```
   yum install -y perf
   ```

You can confirm that your `perf` installation works using  `perf stat -- sleep 0.1` (if you're already `root`) or `sudo perf stat -- sleep 0.1`.


##### `perf` on Ubuntu when you can't match the kernel version

On Ubuntu (and other distributions that package `perf` per kernel version) you may see an error after installing `linux-tools-generic`. The error message will look similar to

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

The best fix for this is to follow what `perf` says and to install one of the above packages. If you're in a Docker container, this may not be possible because you'd need to match the kernel version (which is especially difficult in Docker for Mac because it uses a VM). For example, the suggested `linux-tools-5.10.25-linuxkit` is not actually available.

As a workaround, you can try one of the following options

- If you're already `root` and prefer a shell `alias` (only valid in this shell)

    ```
    alias perf=$(find /usr/lib/linux-tools/*/perf | head -1)
    ```

- If you're a user and would like to prefer to link `/usr/local/bin/perf`

    ```
    sudo ln -s "$(find /usr/lib/linux-tools/*/perf | head -1)" /usr/local/bin/perf
    ```

After this, you should be able to use `perf stat -- sleep 0.1` (if you're already `root`) or `sudo perf stat -- sleep 0.1` successfully.

### Bare metal

For a bare metal Linux machine, all you need to do is to install `perf` which should then work in full fidelity.

### In Docker (running on bare-metal Linux)

You will need to launch your container with `docker run --privileged` (don't run this in production) and then you should have full access to perf (including the PMU).

To validate that `perf` works correctly, run for example `perf stat -- sleep 0.1`. Whether you'll see the `<not supported>` next to some information will depend on if you have access to the CPU's performance counters (the PMU). In Docker on bare metal, this should work, ie. no `<not supported>`s should show up.

### Docker for Mac

Docker for Mac is like Docker on bare metal but with some extra complexity because we're actually running the Docker containers hosted in a Linux VM. So matching the kernel version will be difficult.

If you follow the above installation instructions, you should nevertheless get `perf` to work but you won't have access to the CPU's performance counters (the PMU) so you'll see a few events show up as `<not supported>`.

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

### In a VM

In a virtual machine, you would install `perf` just like on bare metal. And either `perf` will work just fine with all its features or it will look similarly to what you get on Docker for Mac.

What you need your hypervisor to support (& allow) is "PMU passthrough" or "PMU virtualisation". VMware Fusion does support PMU virtualisation which they call vPMC (VM settings -> Processors & Memory -> Advanced -> Allow code profiling applications in this VM). If you're on a Mac this setting is unfortunately only supported up to including macOS Catalina (and [not on Big Sur](https://kb.vmware.com/s/article/81623)).

If you use `libvirt` to manage your hypervisor and VMs, you can use `sudo virsh edit your-domain` and replace the `<cpu .../>` XML tag with

    <cpu mode='host-passthrough' check='none'/>

to allow the PMU to be passed through to the guest. For other hypervisors, an internet search will usually reveal how to enable PMU passthrough.
