---
redirect_from: "server/guides/llvm-sanitizers"
layout: new-layouts/base
title: LLVM TSAN / ASAN
---

For multithreaded and low-level unsafe interfacing server code, the ability to use LLVM's [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html) and
[AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) can help troubleshoot invalid thread usage and invalid usage/access of memory.

There is a [blog post](/blog/tsan-support-on-linux/) outlining the usage of TSAN.

The short story is to use the swiftc command line options `-sanitize=address` and `-sanitize=thread` to each respective tool.

Also for Swift Package Manager projects you can use `--sanitize` at the command line, e.g.:

```
swift build --sanitize=address
```

or

```
swift build --sanitize=thread
```

and it can be used for the tests too:

```
swift test --sanitize=address
```

or

```
swift test --sanitize=thread
```
