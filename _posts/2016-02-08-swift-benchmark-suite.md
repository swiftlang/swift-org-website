---
layout: new-layouts/blog
published: true
date: 2016-02-08 18:00:00
title: Swift Benchmark Suite now Available
author: lplarson
---

Apple's Swift Team is happy to announce that Swift's [benchmark
suite](https://github.com/apple/swift/tree/master/benchmark) is now open
source.

The suite contains source code for benchmarks, libraries, and utilities
designed to help track Swift performance and catch performance regressions
before they are committed, including:

- 75 benchmarks covering a number of important Swift workloads
- Libraries providing commonly needed benchmarking functions
- A driver for running benchmarks and displaying performance metrics
- A utility for comparing benchmark metrics across Swift versions

We look forward to working with the Swift community to make Swift as fast as
possible!

## Building and Running Benchmarks

Contributors to the Swift project are encouraged to run Swift's benchmark suite
against their changes before requesting pull requests in order to catch
potential performance regressions. Instructions for building and running Swift
benchmarks are available in
[swift/benchmark/README.md](https://github.com/apple/swift/tree/master/benchmark).

In the future, we are planning to add support to Swift's [continuous
integration system](https://ci.swift.org) for running benchmarks on pull
requests.

## Contributing Benchmarks and Improvements

Contributions to Swift's benchmark suite are welcome! Pull requests for new
benchmarks covering performance critical workloads, additions to benchmark
helper libraries, and other improvements are encouraged. Please note that
Swift's benchmark suite shares the Swift project's
[license](https://github.com/apple/swift/blob/master/LICENSE.txt), so we are
unable to accept Swift ports of benchmarks covered under other licenses.
Additional information about the suite and instructions on adding benchmarks
are available in
[swift/benchmark/README.md](https://github.com/apple/swift/tree/master/benchmark).
