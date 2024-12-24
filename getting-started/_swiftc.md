## 使用 `swiftc` 命令进行编译

`swiftc` 命令用于将 Swift 代码编译成操作系统可以运行的程序。

    // 问题：我们的跨平台支持情况如何？

> 在特定机器上构建的程序只能在具有相同硬件架构和操作系统的其他机器上运行。
> 例如，在运行 macOS 10.11 且架构为 x86_64 的计算机上构建的可执行文件，
> 不能直接在运行 Ubuntu 且架构为 ARMv7 的机器上运行。
> 但是，相同的代码可以在任何支持 Swift 的机器上编译和运行。

### Hello, world!

按照传统，学习新编程语言时的第一个程序
应该在屏幕上显示 "Hello, world!"。
在 Swift 中，这可以用一行代码完成。
创建一个新文件 `hello.swift`，
并输入以下内容：

~~~ swift
print("Hello, world!")
~~~

然后，在终端中输入以下命令：

~~~ shell
$ swiftc hello.swift
~~~

运行此命令将创建一个新的可执行文件 `hello`，
可以从命令行运行它：

~~~ shell
$ ./hello
$ Hello, world!
~~~
