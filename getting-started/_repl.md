## 使用 REPL

如果你不带任何参数运行 `swift repl` 命令，
将会启动 REPL（交互式命令行环境），
它会读取、执行并打印你输入的任何 Swift 代码的结果。

~~~ shell
$ swift repl
Welcome to Apple Swift version 5.7 (swiftlang-5.7.0.127.4 clang-1400.0.29.50).
Type :help for assistance.
  1>
~~~

使用 REPL 是体验 Swift 的好方法。
例如，如果你输入表达式 `1 + 2`，
表达式的结果 `3` 会在下一行显示：

~~~ shell
  1> 1 + 2
$R0: Int = 3
~~~

你可以为常量和变量赋值，
并在后续行中使用它们。
比如，可以将字符串值 `Hello, world!` 
赋值给常量 `greeting`，
然后将其作为参数传递给 `print(_:)` 函数：

~~~ shell
  2> let greeting = "Hello!"
greeting: String = "Hello!"
  3> print(greeting)
Hello!
~~~

如果你输入了无效的表达式，
REPL 会打印一个错误，显示问题出现的位置：

~~~ shell
let answer = "forty"-"two"
error: binary operator '-' cannot be applied to two 'String' operands
let answer = "forty"-"two"
             ~~~~~~~^~~~~~
~~~

你可以使用上下箭头键（`↑` 和 `↓`）
来循环浏览之前输入的命令。
这样你就可以对之前的表达式做小修改，
而不用重新输入整行代码。
这在修复像上面那样的错误时特别方便：

~~~ shell
let answer = "forty-two"
answer: String = "forty-two"
~~~

REPL 的另一个有用特性是
它可以自动提示在特定上下文中可以使用的函数和方法。
例如，如果你在 `String` 值后面输入点操作符，
然后输入 `re` 并按 tab 键（`⇥`），
REPL 会给出可用的补全列表，
比如 `remove(at:)` 和 `replaceSubrange(bounds:with:)`：

~~~ shell
5> "Hi!".re⇥
Available completions:
	remove(at: Index) -> Character
	removeAll() -> Void
	removeAll(keepingCapacity: Bool) -> Void
	removeSubrange(bounds: ClosedRange<Index>) -> Void
	removeSubrange(bounds: Range<Index>) -> Void
	replaceSubrange(bounds: ClosedRange<Index>, with: C) -> Void
	replaceSubrange(bounds: ClosedRange<Index>, with: String) -> Void
	replaceSubrange(bounds: Range<Index>, with: C) -> Void
	replaceSubrange(bounds: Range<Index>, with: String) -> Void
	reserveCapacity(n: Int) -> Void
~~~

当你开始一个代码块时，
比如使用 `for-in` 循环遍历数组，
REPL 会自动缩进下一行，
并将提示符从 `>` 改为 `.`，
表示该行输入的代码只有在整个代码块输入完成后才会被执行。

~~~ shell
  6> let numbers = [1,2,3]
numbers: [Int] = 3 values {
  [0] = 1
  [1] = 2
  [2] = 3
}
  7> for n in numbers.reversed() {
  8.     print(n)
  9. }
3
2
1
~~~

Swift 的所有功能都可以在 REPL 中使用，
从编写控制流语句
到声明和实例化结构体和类。

你还可以导入任何可用的系统模块，
比如 macOS 上的 `Darwin` 和 Linux 上的 `Glibc`：

### 在 macOS 上

~~~ swift
1> import Darwin
2> arc4random_uniform(10)
$R0: UInt32 = 4
~~~

### 在 Linux 上

~~~ swift
1> import Glibc
2> random() % 10
$R0: Int32 = 4
~~~

### 在 Windows 上

REPL 依赖于 Python 绑定。你必须确保 Python 3.7 在系统路径中可用。
以下命令将 Visual Studio 中的 Python 3.7 添加到 `%PATH%` 中，
以便使用：

~~~ cmd
path %ProgramFiles(x86)%\Microsoft Visual Studio\Shared\Python37_64;%PATH%
~~~

由于 Windows 安装将 SDK 与工具链分开，
因此必须向 REPL 传递一些额外的参数。
这允许你使用同一个工具链搭配多个不同的 SDK。

~~~ cmd
set SWIFTFLAGS=-sdk %SDKROOT% -I %SDKROOT%/usr/lib/swift -L %SDKROOT%/usr/lib/swift/windows
swift repl -target x86_64-unknown-windows-msvc %SWIFTFLAGS%
~~~
