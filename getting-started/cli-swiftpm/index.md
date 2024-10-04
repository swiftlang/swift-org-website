---
layout: new-layouts/base
title: Build a Command-line Tool
---

> The source code for this guide can be found [on GitHub](https://github.com/apple/swift-getting-started-cli)

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small application with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
$ mkdir MyCLI
$ cd MyCLI
$ swift package init --name MyCLI --type executable
~~~

This will generate a new directory called MyCLI with the following files:

~~~no-highlight
.
├── Package.swift
└── Sources
    └── main.swift
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as dependencies.

`Sources/main.swift` is the application entry point and where we’ll write our application code.

In fact, SwiftPM generated a "Hello, world!" project for us!

We can run the program by running  `swift run`  in our terminal.

~~~bash
$ swift run MyCLI
Building for debugging...
[3/3] Linking MyCLI
Build complete! (0.68s)
Hello, world!
~~~

## Adding dependencies

Swift based applications are usually composed from libraries that provide useful functionality.

In this project, we’ll use a package called [example-package-figlet](https://github.com/apple/example-package-figlet) which will help us make ASCII art.

You can find more interesting libraries on [Swift Package Index](https://swiftpackageindex.com) -- the unofficial package index for Swift.

To do so, we extend our `Package.swift` file with the following information:

~~~swift
// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "MyCLI",
    dependencies: [
      .package(url: "https://github.com/apple/example-package-figlet", branch: "main"),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .executableTarget(
            name: "MyCLI",
            dependencies: [
                .product(name: "Figlet", package: "example-package-figlet"),
            ],
            path: "Sources"),
    ]
)
~~~

Running `swift build` will instruct SwiftPM to download the new dependencies and then proceed to build the code.

Running this command also created a new file for us, `Package.resolved`.
This file is a snapshot of the exact versions of the dependencies we are using locally.

## A small application

Start by removing `main.swift`. We’ll replace it with a new file called `MyCLI.swift`. Add the following code to it:

~~~swift
import Figlet

@main
struct FigletTool {
  static func main() {
    Figlet.say("Hello, Swift!")
  }
}
~~~

This provides a new entrypoint to the app which could be asynchronous if required. You can either have a `main.swift` file or a `@main` entrypoint, but not both.

With `import Figlet` we can now use the `Figlet` module that the `example-package-figlet` package exports.

Once we save that, we can run our application with `swift run`
Assuming everything went well, you should see your application print this to the screen:

~~~no-highlight
  _   _          _   _                 ____               _    __   _     _
 | | | |   ___  | | | |   ___         / ___|  __      __ (_)  / _| | |_  | |
 | |_| |  / _ \ | | | |  / _ \        \___ \  \ \ /\ / / | | | |_  | __| | |
 |  _  | |  __/ | | | | | (_) |  _     ___) |  \ V  V /  | | |  _| | |_  |_|
 |_| |_|  \___| |_| |_|  \___/  ( )   |____/    \_/\_/   |_| |_|    \__| (_)
                                |/
~~~

## Argument parsing

Most command line tools need to be able to parse command line arguments.

To add this capability to our application, we add a dependency on [swift-argument-parser](https://github.com/apple/swift-argument-parser).

To do so, we extend our `Package.swift` file with the following information:

~~~swift
// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "MyCLI",
    dependencies: [
      .package(url: "https://github.com/apple/example-package-figlet", branch: "main"),
      .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .executableTarget(
            name: "MyCLI",
            dependencies: [
                .product(name: "Figlet", package: "example-package-figlet"),
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
            ],
            path: "Sources"),
    ]
)
~~~

We can now import the argument parsing module provided by `swift-argument-parser` and use it in our application:

~~~swift
import Figlet
import ArgumentParser

@main
struct FigletTool: ParsableCommand {
  @Option(help: "Specify the input")
  public var input: String

  public func run() throws {
    Figlet.say(self.input)
  }
}
~~~

For more information about how [swift-argument-parser](https://github.com/apple/swift-argument-parser) parses command line options, see [swift-argument-parser documentation](https://github.com/apple/swift-argument-parser) documentation.

Once we save that, we can run our application with `swift run MyCLI --input 'Hello, world!'`

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

---

> The source code for this guide can be found [on GitHub](https://github.com/apple/swift-getting-started-cli)
