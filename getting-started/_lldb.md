## 使用 LLDB 调试器

你可以使用 LLDB 调试器来逐步运行 Swift 程序、设置断点，以及检查和修改程序状态。

让我们看一个例子，以下 Swift 代码定义了一个 `factorial(n:)` 函数，并打印调用该函数的结果：

~~~ swift
func factorial(n: Int) -> Int {
    if n <= 1 { return n }
    return n * factorial(n: n - 1)
}

let number = 4
print("\(number)! is equal to \(factorial(n: number))")
~~~

创建一个名为 `Factorial.swift` 的文件，包含上述代码，然后运行 `swiftc` 命令，将文件名作为命令行参数传入，同时使用 `-g` 选项生成调试信息。这将在当前目录中创建一个名为 `Factorial` 的可执行文件。

~~~ shell
$ swiftc -g Factorial.swift
$ ls
Factorial.dSYM
Factorial.swift
Factorial*
~~~

不要直接运行 `Factorial` 程序，而是通过 LLDB 调试器运行它，将其作为命令行参数传递给 `lldb` 命令。

~~~ text
$ lldb Factorial
(lldb) target create "Factorial"
Current executable set to 'Factorial' (x86_64).
~~~

这将启动一个交互式控制台，允许你运行 LLDB 命令。

> 要了解更多关于 LLDB 命令的信息，请参阅 [LLDB 教程](http://lldb.llvm.org/tutorial.html)。

使用 `breakpoint set`（简写为 `b`）命令在 `factorial(n:)` 函数的第 2 行设置断点，这样每次执行该函数时进程都会中断。

~~~ text
(lldb) b 2
Breakpoint 1: where = Factorial`Factorial.factorial (Swift.Int) -> Swift.Int + 12 at Factorial.swift:2, address = 0x0000000100000e7c
~~~

使用 `run`（简写为 `r`）命令运行进程。进程将在 `factorial(n:)` 函数的调用处停止。

~~~ text
(lldb) r
Process 40246 resuming
Process 40246 stopped
* thread #1: tid = 0x14dfdf, 0x0000000100000e7c Factorial`Factorial.factorial (n=4) -> Swift.Int + 12 at Factorial.swift:2, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000e7c Factorial`Factorial.factorial (n=4) -> Swift.Int + 12 at Factorial.swift:2
   1    func factorial(n: Int) -> Int {
-> 2        if n <= 1 { return n }
   3        return n * factorial(n: n - 1)
   4    }
   5
   6    let number = 4
   7    print("\(number)! is equal to \(factorial(n: number))")
~~~

使用 `print`（简写为 `p`）命令检查参数 `n` 的值。

~~~ text
(lldb) p n
(Int) $R0 = 4
~~~

`print` 命令也可以计算 Swift 表达式。

~~~ text
(lldb) p n * n
(Int) $R1 = 16
~~~

使用 `backtrace`（简写为 `bt`）命令显示导致调用 `factorial(n:)` 的帧栈。

~~~ text
(lldb) bt
* thread #1: tid = 0x14e393, 0x0000000100000e7c Factorial`Factorial.factorial (n=4) -> Swift.Int + 12 at Factorial.swift:2, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
  * frame #0: 0x0000000100000e7c Factorial`Factorial.factorial (n=4) -> Swift.Int + 12 at Factorial.swift:2
    frame #1: 0x0000000100000daf Factorial`main + 287 at Factorial.swift:7
    frame #2: 0x00007fff890be5ad libdyld.dylib`start + 1
    frame #3: 0x00007fff890be5ad libdyld.dylib`start + 1
~~~

使用 `continue`（简写为 `c`）命令继续运行进程，直到再次遇到断点。

~~~ text
(lldb) c
Process 40246 resuming
Process 40246 stopped
* thread #1: tid = 0x14e393, 0x0000000100000e7c Factorial`Factorial.factorial (n=3) -> Swift.Int + 12 at Factorial.swift:2, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000e7c Factorial`Factorial.factorial (n=3) -> Swift.Int + 12 at Factorial.swift:2
   1    func factorial(n: Int) -> Int {
-> 2        if n <= 1 { return n }
   3        return n * factorial(n: n - 1)
   4    }
   5
   6    let number = 4
   7    print("\(number)! is equal to \(factorial(n: number))")
~~~

再次使用 `print`（简写为 `p`）命令检查第二次调用 `factorial(n:)` 时参数 `n` 的值。

~~~ text
(lldb) p n
(Int) $R2 = 3
~~~

使用 `breakpoint disable`（简写为 `br di`）命令禁用所有断点，然后使用 `continue`（简写为 `c`）命令让进程运行直到结束。

~~~ text
(lldb) br di
All breakpoints disabled. (1 breakpoints)
(lldb) c
Process 40246 resuming
4! is equal to 24
Process 40246 exited with status = 0 (0x00000000)
~~~
