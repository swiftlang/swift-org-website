---
redirect_from: "server/guides/llvm-sanitizers"
layout: page
title: LLVM TSAN / ASAN
---

对于多线程和低级别不安全接口的服务器代码，使用 LLVM 的 [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html) 和
 [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) 的能力可以帮助排查无效的线程使用和无效的内存使用/访问。

有一篇 [博客文章](/blog/tsan-support-on-linux/) 概述了 TSAN 的使用。

简而言之，就是在 swiftc 命令行选项中使用 `-sanitize=address` 和 `-sanitize=thread` 来分别使用每个工具。

对于 Swift Package Manager 项目，你也可以在命令行中使用 `--sanitize` ，例如：

```
swift build --sanitize=address
```

或者

```
swift build --sanitize=thread
```

它也可以用于测试：

```
swift test --sanitize=address
```

或者

```
swift test --sanitize=thread
```
