---
layout: new-layouts/post
published: false
date: 2026-11-06 17:00:00
title: "GSoC 2026 Showcase: Task and TaskGroup Tracking for Swift Concurrency"
author: [egekaya, samkhouri, ktoso]
category: "Community"
---

This is the second post in our series showcasing the Swift community's participation in [Google Summer of Code](https://summerofcode.withgoogle.com) 2026. Learn more about the projects and work accomplished:

- [DocC language features in SourceKit-LSP](/blog/gsoc-2026-showcase-docc-language-features/)
- Task and TaskGroup tracking for Swift Concurrency (this post)
- [Qualified name lookup for swift-syntax](/blog/gsoc-2026-showcase-qualified-name-lookup/)

Each GSoC contributor has shared a writeup about their project and experience in the program on the forums. 
Today's featured project added low-overhead runtime tracking of active Tasks and TaskGroups to make debugging Swift Concurrency programs easier, contributed by Ege Kaya.
To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2026-task-and-taskgroup-tracking-for-swift-concurrency/89084).

---

## Task and TaskGroup Tracking for Swift Concurrency

## Hello everyone! 👋

My name is Ege Kaya, and I'm incredibly excited to share what I've been working on over the summer for my Google Summer of Code 2026 project alongside my fantastic mentors, [@al45tair](https://forums.swift.org/u/al45tair) and [@Mike_Ash](https://forums.swift.org/u/mike_ash)!

My project focused on introducing Task and TaskGroup tracking for the Swift Concurrency runtime, which will hopefully vastly improve the debugging experience for Swift developers!

## The Problem:

Until now, the Swift Concurrency runtime did not provide a built-in way to keep track of which Tasks and TaskGroups are currently executing (and which are stuck). This missing information made debugging programs that use Swift Concurrency notoriously difficult. If your application ended up in a state where no progress was being made, you couldn't easily see which tasks were outstanding because they weren't actively executing on a thread (and thus didn't show up in backtraces).

An easy, naive solution might have been to use a global linked list of all Tasks and TaskGroups. However, that approach would cause significant, unnecessary synchronization and lock contention between threads, which is highly undesirable for a high-performance concurrency runtime.

## The Solution: TaskRegistry

We designed and implemented `TaskRegistry`, a sharded registry that tracks every live Task and TaskGroup without forcing threads to contend on a single lock. Instead of one global list, the registry is split into 64 independent `TaskRegistryShard` units, each aligned to a cache line to avoid false sharing, with its own linked list and `LazyMutex`. Every task is hashed by its task ID into one of the 64 shards, so concurrent registrations and removals on different tasks almost never contend with each other.

## Under the Hood

The implementation is roughly 600 lines of C++ added to the Concurrency runtime, and it leans on a few key ideas:

1. **Intrusive storage.** The registry's linked-list pointers live directly inside `AsyncTask`'s `PrivateStorage`, so registering a task never needs a separate heap allocation. Registration and deregistration cost about 0.01 microseconds each.
2. **O(1) insert and remove.** A task's shard is chosen with a simple hash, `(taskId ^ (taskId >> 8)) & 63`, which keeps the shard lookup a constant-time operation and spreads tasks evenly across shards.
3. **Crash-safe traversal.** The debug-time walk that lists tasks and groups uses `try_lock()` on each shard, skipping any shard that's currently busy instead of blocking, and applies a cycle limit so a corrupted list can't cause an infinite loop while debugging.

To confirm the hashing actually distributes tasks evenly, I wrote a small Python/LLDB script that walked the shards of a running process and checked the distribution matched expectations.

## Real-World Validation

To make sure the registry doesn't get in the way of a real workload, I benchmarked a simulated web server that spawns over 600,000 tasks. With the registry disabled, the benchmark took 0.3715 seconds; with it enabled, 0.3860 seconds, a small enough difference to confirm the sharded design keeps overhead negligible even under heavy task churn.

## Lessons Learned

This project gave me a much deeper understanding of how the Swift Concurrency runtime works in C++, along with hands-on experience in performance tuning, thinking about cache-line effects, and choosing between atomics and locks, as well as writing LLDB Python scripts to inspect runtime state.

## Remaining Stretch Goals

A couple of stretch goals are still in progress: surfacing Task and TaskGroup listings directly in on-crash backtraces, and adding LLDB Python macros that let you list all live tasks and groups straight from the debugger.

### Acknowledgements

I'm incredibly grateful to my mentors [@al45tair](https://forums.swift.org/u/al45tair) and [@Mike_Ash](https://forums.swift.org/u/mike_ash) for their technical guidance throughout the summer. This project has been an absolutely transformative experience, and I'm excited to keep contributing to Swift Concurrency.

---

Continue reading a more detailed version of Ege's writeup on the [Swift forums](https://forums.swift.org/t/gsoc-2026-task-and-taskgroup-tracking-for-swift-concurrency/89084).
