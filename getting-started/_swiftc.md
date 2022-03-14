## Compiling with the `swiftc` Command

The `swiftc` command compiles Swift code into
programs that can be run by the operating system.

    // QUESTION: What is our cross-platform story?

> A program built on a particular machine can only be run
> on other machines with the same hardware architecture and operating system.
> For example, an executable built on a computer running macOS 10.11 on x86_64
> could not be run directly by a machine running Ubuntu on ARMv7.
> However, the same _code_ can be compiled and run on any machine
> that supports Swift.

### Hello, world!

By tradition, the first program in a new language
should display "Hello, world!" on the screen.
In Swift, this can be done in a single line.
Create a new file, `hello.swift`,
and enter the following:

~~~ swift
print("Hello, world!")
~~~

Now, in the terminal,
enter the following command:

~~~ shell
$ swiftc hello.swift
~~~

Running this command will create a new executable `hello`,
which can be run from the command line:

~~~ shell
$ ./hello
$ Hello, world!
~~~
