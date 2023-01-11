---
layout: page
title: Build a Command-line Tool
---

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small application with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
❯ mkdir hello-swift
❯ cd hello-swift
❯ swift package init --name hello-swift --type executable
~~~

This will generate a new directory called hello-swift with the following files:

~~~no-highlight
.
├── Package.swift
├── README.md
├── Sources
│   └── hello-swift
│       └── hello_swift.swift
└── Tests
    └── hello-swiftTests
        └── hello_swiftTests.swift
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as dependencies.

`Sources/hello-swift/main.swift` is the application entry point and where we’ll write our application code.
`Test/hello-swiftTests/hello_swiftTests.swift` is where we can write tests for our application.

In fact, SwiftPM generated a "Hello, world!" project for us!
We can run this program by running  `swift run`  in our terminal.

~~~bash
❯ swift run
[3/3] Linking hello-swift
Hello, world!
~~~

## Adding dependencies

Swift based applications are usually composed from libraries that provide useful functionality.

In this project, we’ll use a package called [swift-figlet](https://github.com/tomerd/swift-figlet) which will help us make ASCII art.

You can find more interesting libraries on [Swift Package Index](https://swiftpackageindex.com) -- the unofficial package index for Swift.

To do so, we extend our `Package.swift` file with the following information:

~~~swift
// swift-tools-version: 5.7

import PackageDescription

let package = Package(
name: "hello-swift",
  dependencies: [
    .package(url: "https://github.com/tomerd/swift-figlet", branch: "main"),
  ],
  targets: [
    .executableTarget(
      name: "hello-swift",
      dependencies: [
        .product(name: "Figlet", package: "swift-figlet"),
      ]
    ),
    .testTarget(
      name: "hello-swiftTests",
      dependencies: ["hello-swift"]
    ),
  ]
)
~~~

Running `swift build` will instruct SwiftPM to install the new dependencies and then proceed to build the code.

Running this command also created a new file for us, `Package.resolved`.
This file is a snapshot of the exact versions of the dependencies we are using locally.

To use this dependency, we can open `hello_swift.swift`, remove everything that’s in there (it’s just an example), and add this line to it:

~~~swift
import Figlet
~~~

This line means that we can now use the `Figlet` module that the `swift-figlet` package exports.

## A small application

Now let’s write a small application with our new dependency. In our `hello_swift.swift`, add the following code:

~~~swift
import Figlet // from the previous step

@main
struct FigletTool {
  static func main() {
    let figlet = Figlet()
    figlet.say("Hello, Swift!")
  }
}
~~~

Once we save that, we can run our application with `swift run`
Assuming everything went well, you should see your application print this to the screen:

~~~no-highlight
_   _          _   _                                  _    __   _     _
| | | |   ___  | | | |   ___          ___  __      __ (_)  / _| | |_  | |
| |_| |  / _ \ | | | |  / _ \        / __| \ \ /\ / / | | | |_  | __| | |
|  _  | |  __/ | | | | | (_) |  _    \__ \  \ V  V /  | | |  _| | |_  |_|
|_| |_|  \___| |_| |_|  \___/  ( )   |___/   \_/\_/   |_| |_|    \__| (_)
                              |/
~~~

## Argument parsing

Most command line tools need to be able to parse command line arguments.

To add this capability to our application, we add a dependency on [swift-argument-parser](https://github.com/apple/swift-argument-parser).

To do so, we extend our `Package.swift` file with the following information:

~~~swift
// swift-tools-version: 5.7

import PackageDescription

let package = Package(
  name: "hello-swift",
  dependencies: [
    .package(url: "https://github.com/tomerd/swift-figlet", branch: "main"),
    .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
  ],
  targets: [
    .executableTarget(
      name: "hello-swift",
      dependencies: [
        .product(name: "Figlet", package: "swift-figlet"),
        .product(name: "ArgumentParser", package: "swift-argument-parser"),
      ]
    ),
    .testTarget(
      name: "hello-swiftTests",
      dependencies: ["hello-swift"]
    ),
  ]
)
~~~

We can now import the argument parsing module provided by `swift-argument-parser` and use it in our application:

~~~swift
import ArgumentParser
import Figlet

@main
struct FigletTool: ParsableCommand {
  @Option(help: "Specify the input")
  public var input: String

  public func run() throws {
    let figlet = Figlet()
    figlet.say(self.input)
  }
}
~~~

For more information about how [swift-argument-parser](https://github.com/apple/swift-argument-parser) parses command line options, see [swift-argument-parser documentation](https://github.com/apple/swift-argument-parser) documentation.

Once we save that, we can run our application with `swift run hello-swift --input 'Hello, world!'`

Note we need to specify the executable in this case, so we can pass the `input` argument to it.

Assuming everything went well, you should see your application print this to the screen:

~~~no-highlight
_   _          _   _                                           _       _   _
| | | |   ___  | | | |   ___         __      __   ___    _ __  | |   __| | | |
| |_| |  / _ \ | | | |  / _ \        \ \ /\ / /  / _ \  | '__| | |  / _` | | |
|  _  | |  __/ | | | | | (_) |  _     \ V  V /  | (_) | | |    | | | (_| | |_|
|_| |_|  \___| |_| |_|  \___/  ( )     \_/\_/    \___/  |_|    |_|  \__,_| (_)
                              |/
~~~
