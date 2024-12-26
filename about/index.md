---
layout: page
title: 关于 Swift
---

Swift 是一种通用编程语言，对新手友好，同时也足够强大，能满足专业需求。它快速、现代、安全，并且编写起来充满乐趣。

* Swift 是通用且现代的：适用于从系统编程到移动和桌面应用，再到云服务的各种场景。
* Swift 是安全的：未定义行为是安全的敌人，且最好在软件投入生产前就捕获错误。Swift 让最明显的路径成为最安全的选择。
* Swift 运行快，编写也高效：它提供可预测且一致的性能，与基于 C 的编程语言性能相当，同时没有牺牲对开发的友好性。
* Swift 既简单易学又功能强大：从简单的单行代码的“Hello, World!”到拥有数十万行代码的大型应用，Swift 都能按你的需求扩展。

## 工具

工具是 Swift 生态系统的重要组成部分。我们致力于与开发者的工具集良好集成，快速构建，提供出色的诊断功能，并支持交互式开发体验。工具能够极大地提升编程的能力，比如 Xcode 中基于 Swift 的 Playground，或在处理 Linux 服务端代码时的基于 Web 的 REPL。

## 特性

Swift 拥有许多特性，使代码更易读易写，同时赋予开发者在真正系统编程语言中所需的控制力。Swift 支持类型推断，让代码更简洁、更不易出错；Swift 的模块消灭了头文件并提供了命名空间；Swift 的内存管理是自动化的；Swift 代码中甚至无需输入分号。此外，Swift 借鉴了其他语言的优势，例如从 Objective-C 引入的命名参数，通过简洁的语法表达，使 Swift 的 API 易于阅读和维护。

Swift 的特性相辅相成，打造出一种强大却又有趣的实用编程语言。Swift 的一些其他的特性包括：

* 闭包与函数指针的统一
* 元组与多返回值的支持
* 泛型
* 对范围（Range）和集合（Collection）类型快速简洁的遍历
* 支持方法（method）、扩展（extension）和协议（protocol）的结构体（Struct）
* 函数式编程模式，例如 map 和 filter
* 内置强大的错误处理机制
* 使用 `do`、`guard`、`defer` 和 `repeat` 关键字实现高级控制流

### 安全

Swift 从一开始就设计得比基于 C 的语言更安全，并消除了各种不安全代码的问题。变量在使用前必须初始化，数组和整数会进行溢出检查，内存管理是自动化的。语法经过优化，便于清晰表达意图，例如使用简单的三个字符关键字定义一个变量（`var`）或常量（`let`）。

Another safety feature is that by default Swift objects can never be `nil`, and trying to make or use a `nil` object results in a compile-time error. This makes writing code much cleaner and safer, and prevents a common cause of runtime crashes. However, there are cases where `nil` is appropriate, and for these situations Swift has an innovative feature known as **optionals**. An optional may contain `nil`, but Swift syntax forces you to safely deal with it using ``?`` to indicate to the compiler you understand the behavior and will handle it safely.

另一个安全特性是 Swift 对象（object）在默认情况下不能为 `nil`，尝试创建或使用 `nil` 对象会导致编译时错误。这使代码编写更清晰、更安全，并避免了一种运行时崩溃的常见原因。然而，在某些情况下，`nil` 是合适的，为此 Swift 提供了一项创新特性，称为 **可选值（optionals）**。可选值可以包含 `nil` 值，但 Swift 的语法要求你使用 ``?`` 向编译器明确表示你理解这种行为并会安全地处理它，从而强制实现安全的可选值操作。

{% include_relative _platform-support.md %}
{% include_relative _open-source.md %}
