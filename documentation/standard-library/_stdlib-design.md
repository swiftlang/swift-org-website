## 标准库设计

Swift 标准库涵盖了多种数据类型、协议和函数，包括基本数据类型(如 `Int`、`Double`)、集合类型(如 `Array`、`Dictionary`)以及描述它们的协议和操作它们的算法、字符和字符串，以及底层原语(如 `UnsafeMutablePointer`)。标准库的实现位于 [Swift 代码库][swift-repo] 中的 `stdlib/public` 子目录下，该目录进一步细分为:

* **标准库核心**: 标准库的核心部分(在 [stdlib/public/core](https://github.com/swiftlang/swift/tree/main/stdlib/public/core) 中实现)，包括所有数据类型、协议、函数等的定义。

* **运行时**: 语言支持运行时(在 [stdlib/public/runtime](https://github.com/swiftlang/swift/tree/main/stdlib/public/runtime) 中实现)，它位于编译器和核心标准库之间。它负责实现语言的许多动态特性，如类型转换(例如 `as!` 和 `as?` 运算符)、类型元数据(支持泛型和反射)，以及内存管理(对象分配、引用计数等)。与高层库不同，运行时主要用 C++ 编写，或在需要互操作性时使用 Objective-C。

* **SDK 覆盖层**: 特定于 Apple 平台，SDK 覆盖层(在 [stdlib/public/Platform](https://github.com/swiftlang/swift/tree/main/stdlib/public/Platform) 中实现)为现有的 Objective-C 框架提供 Swift 特定的添加和修改，以改善它们在 Swift 中的映射。特别是，`Foundation` 覆盖层提供了与 Objective-C 代码互操作的额外支持。

Swift 标准库是用 Swift 编写的，但由于它是技术栈中最底层的 Swift 代码——负责实现其他 Swift 代码所依赖的核心数据类型——它与普通的 Swift 代码有一些不同。主要区别包括：

* **访问编译器内置功能**: `Builtin` 模块通常只对标准库开放，它提供编译器内置函数(例如，直接创建 SIL 指令)和数据类型(例如，"原始"指针、基本的 LLVM 整数类型)，这些都是实现 Swift 编程基础数据类型所必需的。

* **可见性通常通过约定管理**: 由于标准库的编译和优化方式，标准库声明通常需要比理想情况下更大的可见性。例如，从不使用 `private` 修饰符。更重要的是，即使某些内容不打算作为公共接口的一部分，也经常需要将其标记为 `public`。在这种情况下，应使用下划线前缀来表示该公共 API 实际上是私有的。标准库中的访问控制策略记录在 [docs/AccessControlInStdlib.rst](https://github.com/swiftlang/swift/blob/main/docs/AccessControlInStdlib.rst) 中。

* **重复代码使用 gyb**: [gyb](https://github.com/swiftlang/swift/blob/main/utils/gyb.py) 是一个简单的工具，用于从模板生成重复代码，在标准库中经常使用。例如，它用于从单一源代码创建各种大小的整数类型(`Int8`、`Int16`、`Int32`、`Int64` 等)的定义。

* **测试与编译器紧密耦合**: 标准库和编译器是一起演进的，它们紧密耦合。核心数据类型(如 `Array` 或 `Int`)的更改可能需要编译器端的更改，反之亦然，因此标准库测试套件存储在与编译器相同的目录结构中，位于 [test/stdlib](https://github.com/swiftlang/swift/tree/main/test/stdlib) 和 [validation-test/stdlib](https://github.com/swiftlang/swift/tree/main/validation-test/stdlib)。

[swift-repo]: https://github.com/swiftlang/swift "Swift 代码库"
