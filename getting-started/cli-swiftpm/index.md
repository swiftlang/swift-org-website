---
layout: page
title: Build a Command-line Tool
---

> The source code for this guide can be found [on GitHub](https://github.com/apple/swift-getting-started-cli)

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small application with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
❯ mkdir MyCLI
❯ cd MyCLI
❯ swift package init --name MyCLI --type executable
~~~

This will generate a new directory called MyCLI with the following files:

~~~no-highlight
.
├── Package.swift
├── README.md
├── Sources
│   └── MyCLI
│       └── MyCLI.swift
└── Tests
    └── MyCLITests
        └── MyCLITests.swift
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as dependencies.

`Sources/MyCLI/MyCLI.swift` is the application entry point and where we’ll write our application code.
`Test/MyCLITests/MyCLITests.swift` is where we can write tests for our application.

In fact, SwiftPM generated a "Hello, world!" project for us, including some unit tests!

We can run the tests by running  `swift test`  in our terminal.

~~~bash
❯ swift test
Building for debugging...
[6/6] Linking MyCLIPackageTests
Build complete! (16.53s)
Test Suite 'All tests' started at 2023-01-12 13:38:22.393
Test Suite 'MyCLIPackageTests.xctest' started at 2023-01-12 13:38:22.394
Test Suite 'MyCLITests' started at 2023-01-12 13:38:22.394
Test Case '-[MyCLITests.MyCLITests testExample]' started.
Test Case '-[MyCLITests.MyCLITests testExample]' passed (0.003 seconds).
Test Suite 'MyCLITests' passed at 2023-01-12 13:38:22.397.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.003 (0.003) seconds
Test Suite 'MyCLIPackageTests.xctest' passed at 2023-01-12 13:38:22.398.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.003 (0.004) seconds
Test Suite 'All tests' passed at 2023-01-12 13:38:22.398.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.003 (0.005) seconds
~~~

We can also run the program by running  `swift run`  in our terminal.

~~~bash
❯ swift run MyCLI
[3/3] Linking MyCLI
Hello, World!
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
name: "MyCLI",
  products: [
    .executable(name: "MyCLI", targets: ["MyCLI"])
  ],
  dependencies: [
    .package(url: "https://github.com/tomerd/swift-figlet", branch: "main"),
  ],
  targets: [
    .executableTarget(
      name: "MyCLI",
      dependencies: [
        .product(name: "Figlet", package: "swift-figlet"),
      ]
    ),
    .testTarget(
      name: "MyCLITests",
      dependencies: ["MyCLI"]
    ),
  ]
)
~~~

Running `swift build` will instruct SwiftPM to install the new dependencies and then proceed to build the code.

Running this command also created a new file for us, `Package.resolved`.
This file is a snapshot of the exact versions of the dependencies we are using locally.

To use this dependency, we can open `MyCLI.swift`, remove everything that’s in there (it’s just an example), and add this line to it:

~~~swift
import Figlet
~~~

This line means that we can now use the `Figlet` module that the `swift-figlet` package exports.

## A small application

Now let’s write a small application with our new dependency. In our `MyCLI.swift`, add the following code:

~~~swift
import Figlet // from the previous step

@main
struct FigletTool {
  static func main() {
    Figlet.say("Hello, Swift!")
  }
}
~~~

Now lets remove the default unit test since we changes the tools' code.
Replace the example content of `MyCLITests.swift` with the following code:

~~~swift
@testable import MyCLI
import XCTest

final class MyCLITests: XCTestCase {}
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
  name: "swift-swift",
  dependencies: [
    .package(url: "https://github.com/tomerd/swift-figlet", branch: "main"),
    .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
  ],
  products: [
    .executable(name: "MyCLI", targets: ["MyCLI"])
  ],  
  targets: [
    .executableTarget(
      name: "MyCLI",
      dependencies: [
        .product(name: "Figlet", package: "swift-figlet"),
        .product(name: "ArgumentParser", package: "swift-argument-parser"),
      ]
    ),
    .testTarget(
      name: "MyCLITests",
      dependencies: ["MyCLI"]
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
