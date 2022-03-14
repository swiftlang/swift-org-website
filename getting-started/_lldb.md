## Using the LLDB Debugger

You can use the LLDB debugger to
run Swift programs step-by-step,
set breakpoints,
and inspect and modify program state.

As an example,
consider the following Swift code,
which defines a `factorial(n:)` function,
and prints the result of calling that function:

~~~ swift
func factorial(n: Int) -> Int {
    if n <= 1 { return n }
    return n * factorial(n: n - 1)
}

let number = 4
print("\(number)! is equal to \(factorial(n: number))")
~~~

Create a file named `Factorial.swift` with the code above,
and run the `swiftc` command,
passing the filename as a command line argument,
along with the `-g` option to generate debug information.
This will create an executable named `Factorial`
in the current directory.

~~~ shell
$ swiftc -g Factorial.swift
$ ls
Factorial.dSYM
Factorial.swift
Factorial*
~~~

Instead of running the `Factorial` program directly,
run it through the LLDB debugger
by passing it as a command line argument to the `lldb` command.

~~~ text
$ lldb Factorial
(lldb) target create "Factorial"
Current executable set to 'Factorial' (x86_64).
~~~

This will start an interactive console
that allows you to run LLDB commands.

> For more information about LLDB commands,
> see the [LLDB Tutorial](http://lldb.llvm.org/tutorial.html).

Set a breakpoint on line 2 of the `factorial(n:)` function
with the `breakpoint set` (`b`) command,
to have the process break each time the function is executed.

~~~ text
(lldb) b 2
Breakpoint 1: where = Factorial`Factorial.factorial (Swift.Int) -> Swift.Int + 12 at Factorial.swift:2, address = 0x0000000100000e7c
~~~

Run the process with the `run` (`r`) command.
The process will stop at the call site of the `factorial(n:)` function.

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

Use the `print` (`p`) command
to inspect the value of the `n` parameter.

~~~ text
(lldb) p n
(Int) $R0 = 4
~~~

The `print` command can evaluate Swift expressions as well.

~~~ text
(lldb) p n * n
(Int) $R1 = 16
~~~

Use the `backtrace` (`bt`) command
to show the frames leading to `factorial(n:)` being called.

~~~ text
(lldb) bt
* thread #1: tid = 0x14e393, 0x0000000100000e7c Factorial`Factorial.factorial (n=4) -> Swift.Int + 12 at Factorial.swift:2, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
  * frame #0: 0x0000000100000e7c Factorial`Factorial.factorial (n=4) -> Swift.Int + 12 at Factorial.swift:2
    frame #1: 0x0000000100000daf Factorial`main + 287 at Factorial.swift:7
    frame #2: 0x00007fff890be5ad libdyld.dylib`start + 1
    frame #3: 0x00007fff890be5ad libdyld.dylib`start + 1
~~~

Use the `continue` (`c`) command
to resume the process until the breakpoint is hit again.

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

Use the `print` (`p`) command again
to inspect the value of the `n` parameter
for the second call to `factorial(n:)`.

~~~ text
(lldb) p n
(Int) $R2 = 3
~~~

Use the `breakpoint disable` (`br di`) command
to disable all breakpoints
and the `continue` (`c`) command
to have the process run until it exits.

~~~ text
(lldb) br di
All breakpoints disabled. (1 breakpoints)
(lldb) c
Process 40246 resuming
4! is equal to 24
Process 40246 exited with status = 0 (0x00000000)
~~~
