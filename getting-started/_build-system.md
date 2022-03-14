## Using the Package Manager

Swift package manager provides a convention-based system for
building libraries and executables, and sharing code across different packages.

These examples assume you have made `swift` available in your path;
see [Installing](#installing-swift) for more information.
Once available, you can invoke the package manager tools: `swift package`, `swift run`, `swift build` and `swift test`.

~~~ shell
$ swift package --help
OVERVIEW: Perform operations on Swift packages
...
~~~

### Creating a Package

To create a new Swift package, first create and enter a directory named `Hello`:

~~~ shell
$ mkdir Hello
$ cd Hello
~~~

Every package must have a manifest file called `Package.swift` in its root directory.
You can create a minimal package named `Hello` using:

~~~ shell
$ swift package init
~~~

By default the init command will create a library package directory structure:

~~~ shell
├── Package.swift
├── README.md
├── Sources
│   └── Hello
│       └── Hello.swift
└── Tests
    ├── HelloTests
    │   └── HelloTests.swift
    └── LinuxMain.swift
~~~

You can use `swift build` to build a package. This will download, resolve and compile dependencies mentioned
in the manifest file `Package.swift`.

~~~ shell
$ swift build
Compile Swift Module 'Hello' (1 sources)
~~~

To run the tests for a package, use: `swift test`

~~~ shell
$ swift test
Compile Swift Module 'HelloTests' (1 sources)
Linking ./.build/x86_64-apple-macosx10.10/debug/HelloPackageTests.xctest/Contents/MacOS/HelloPackageTests
Test Suite 'All tests' started at 2016-08-29 08:00:31.453
Test Suite 'HelloPackageTests.xctest' started at 2016-08-29 08:00:31.454
Test Suite 'HelloTests' started at 2016-08-29 08:00:31.454
Test Case '-[HelloTests.HelloTests testExample]' started.
Test Case '-[HelloTests.HelloTests testExample]' passed (0.001 seconds).
Test Suite 'HelloTests' passed at 2016-08-29 08:00:31.455.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.001 (0.001) seconds
Test Suite 'HelloPackageTests.xctest' passed at 2016-08-29 08:00:31.455.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.001 (0.001) seconds
Test Suite 'All tests' passed at 2016-08-29 08:00:31.455.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.001 (0.002) seconds
~~~

### Building an Executable

A target is considered as an executable if it contains a file named `main.swift`.
The package manager will compile that file into a binary executable.

In this example,
the package will produce an executable named `Hello`
that outputs "Hello, world!".

First create and enter a directory called `Hello`:

~~~ shell
$ mkdir Hello
$ cd Hello
~~~

Now run the swift package's init command with executable type:

~~~ shell
$ swift package init --type executable
~~~

Use the `swift run` command to build and run the executable:

~~~ shell
$ swift run Hello
Compile Swift Module 'Hello' (1 sources)
Linking ./.build/x86_64-apple-macosx10.10/debug/Hello
Hello, world!
~~~

Note: Since there is only one executable in this package, we can omit the
executable name from the `swift run` command.

You can also compile the package by running the `swift build` command and then run
the binary from .build directory:

~~~ shell
$ swift build
Compile Swift Module 'Hello' (1 sources)
Linking ./.build/x86_64-apple-macosx10.10/debug/Hello

$ .build/x86_64-apple-macosx10.10/debug/Hello
Hello, world!
~~~

As a next step, let's define a new `sayHello(name:)` function
in a new source file, and have the executable call that
instead of calling `print(_:)` directly.

### Working with Multiple Source Files

Create a new file in the `Sources/Hello` directory called `Greeter.swift`,
and enter the following code:

~~~ swift
func sayHello(name: String) {
    print("Hello, \(name)!")
}
~~~

The `sayHello(name:)` function takes a single `String` argument
and prints our "Hello" greeting before, substituting the word "World"
with the function argument.

Now, open `main.swift` again, and replace the existing contents with the following code:

~~~ swift
if CommandLine.arguments.count != 2 {
    print("Usage: hello NAME")
} else {
    let name = CommandLine.arguments[1]
    sayHello(name: name)
}
~~~

Rather than using a hardcoded name as before,
`main.swift` now reads from the command line arguments.
And instead of invoking `print(_:)` directly,
`main.swift` now calls the `sayHello(name:)` method.
Because the method is part of the `Hello` module,
no `import` statement is necessary.

Run `swift run` and try out the new version of `Hello`:

~~~ shell
$ swift run Hello `whoami`
~~~

* * *

> To learn about the Swift Package Manager,
> including how to build modules, import dependencies, and map system libraries,
> see the [Swift Package Manager](/package-manager) section of the website.
