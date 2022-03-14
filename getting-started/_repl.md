## Using the REPL

If you run the `swift` command without any other arguments,
you'll launch the REPL, an interactive shell
that will read, evaluate, and print the results
of any Swift code you enter.

~~~ shell
$ swift
Welcome to Apple Swift version 2.2. Type :help for assistance.
  1>
~~~

Interacting with the REPL is a great way to experiment with Swift.
For example, if you enter the expression `1 + 2`,
the result of the expression, `3`, is printed on the next line:

~~~ shell
  1> 1 + 2
$R0: Int = 3
~~~

You can assign values to constants and variables,
and use them in subsequent lines.
For instance, the `String` value `Hello, world!`
can be assigned to the constant `greeting`,
and then passed as an argument to the `print(_:)` function:

~~~ shell
  2> let greeting = "Hello!"
greeting: String = "Hello!"
  3> print(greeting)
Hello!
~~~

If you enter an invalid expression,
the REPL will print an error showing where the problem occurred:

~~~ shell
let answer = "forty"-"two"
error: binary operator '-' cannot be applied to two 'String' operands
let answer = "forty"-"two"
             ~~~~~~~^~~~~~
~~~

You can use the up-arrow and down-arrow keys (`↑` and `↓`)
to cycle through previous lines entered into the REPL.
This allows you to make a slight change to a previous expression
without retyping the entire line,
and is especially convenient for fixing errors like the one in the previous example:

~~~ shell
let answer = "forty-two"
answer: String = "forty-two"
~~~

Another useful feature of the REPL
is that it can automatically suggest functions and methods
that can be used in a particular context.
For example, if you enter `re`
after a dot operator on a `String` value
and then hit the tab key (`⇥`),
the REPL will give a list of available completions
like `remove(at:)` and `replaceSubrange(bounds:with:)`:

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

If you start a block of code,
such as when iterating over an array with a `for-in` loop,
the REPL will automatically indent the next line,
and change the prompt character from `>` to `.`
to indicate that code entered on that line
will only be evaluated when the entire code block is evaluated.

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

All of the functionality of Swift is available to you from the REPL,
from writing control flow statements
to declaring and instantiating structures and classes.

You can also import any available system modules,
such as `Darwin` on macOS and `Glibc` on Linux:

### On macOS

~~~ swift
1> import Darwin
2> arc4random_uniform(10)
$R0: UInt32 = 4
~~~

### On Linux

~~~ swift
1> import Glibc
2> random() % 10
$R0: Int32 = 4
~~~

### On Windows

The REPL depends on Python bindings.  You must ensure that Python is available
in the path.  The following command adds Python to the PATH so that it can be
used:

~~~ cmd
path %ProgramFiles(x86)%\Microsoft Visual Studio\Shared\Python37_64;%PATH%
~~~

Because the Windows installation separates out the SDK from the toolchain, a few
extra parameters must be passed to the REPL.  This allows you to use multiple
different SDKs with the same toolchain.

~~~ cmd
set SWIFTFLAGS=-sdk %SDKROOT% -I %SDKROOT%/usr/lib/swift -L SDKROOT%/usr/lib/swift/windows
swift repl -target x86_64-unknown-windows-msvc %SWIFTFLAGS%
~~~
