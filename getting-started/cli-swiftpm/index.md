---
layout: page
title: Build a Command-line Tool
---

> The source code for this guide can be found [on GitHub](https://github.com/swiftlang/swift-getting-started-cli)

In this guide we'll build `mycli`, a small tool that prints messages as ASCII art. Along the way we'll parse command-line arguments, add a package dependency, write tests, and build a single binary that runs on any Linux machine. The same code works on macOS, Linux, and Windows.

{% include getting-started/_installing.md %}

## Create a package

SwiftPM can create a new command-line tool package for us. In your terminal of choice run:

~~~bash
$ mkdir MyCLI
$ cd MyCLI
$ swift package init --type tool --name MyCLI
~~~

This creates the following files:

~~~no-highlight
.
├── Package.swift
├── Sources
│   └── MyCLI
│       └── MyCLI.swift
└── Tests
    └── MyCLITests
        └── MyCLITests.swift
~~~

`Package.swift` is the package manifest, which describes the package's targets and dependencies. The `tool` template already depends on [Swift Argument Parser](https://github.com/apple/swift-argument-parser), an open-source library for parsing command-line arguments.

`Sources/MyCLI/MyCLI.swift` is the entry point of the tool, and `Tests/MyCLITests/MyCLITests.swift` is where its tests live.

Let's run it:

~~~no-highlight
$ swift run MyCLI
Building for debugging...
Build complete! (3.39 sec)
Hello, world!
~~~

## Add a dependency

Swift tools are usually built from packages that provide useful functionality. We'll use [example-package-figlet](https://github.com/swiftlang/example-package-figlet), which renders text as ASCII art. You can find many more packages on the [Swift Package Index](https://swiftpackageindex.com).

Add the package to the manifest, then make it available to the `MyCLI` target:

~~~bash
$ swift package add-dependency https://github.com/swiftlang/example-package-figlet --from 1.0.0
$ swift package add-target-dependency Figlet MyCLI --package example-package-figlet
~~~

`Package.swift` now includes both dependencies:

~~~swift
dependencies: [
    .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.2.0"),
    .package(url: "https://github.com/swiftlang/example-package-figlet", from: "1.0.0"),
],
targets: [
    .executableTarget(
        name: "MyCLI",
        dependencies: [
            .product(name: "ArgumentParser", package: "swift-argument-parser"),
            .product(name: "Figlet", package: "example-package-figlet"),
        ],
        // ...
~~~

`from: "1.0.0"` accepts any release up to the next major version, so you get bug fixes without breaking changes. The next time we build, SwiftPM records the exact versions it used in `Package.resolved`, so every build of the package uses the same dependencies.

## Define the command

Replace the contents of `Sources/MyCLI/MyCLI.swift` with the following code:

~~~swift
import ArgumentParser
import Figlet

@main
struct MyCLI: ParsableCommand {
    static let configuration = CommandConfiguration(
        commandName: "mycli",
        abstract: "Print a message as ASCII art."
    )

    @Argument(help: "The message to print.")
    var message: String

    @Option(name: .shortAndLong, help: "The number of times to print the message.")
    var count = 1

    @Flag(help: "Convert the message to uppercase.")
    var uppercase = false

    func validate() throws {
        guard count >= 1 else {
            throw ValidationError("Please specify a count of at least 1.")
        }
    }

    func run() {
        let text = uppercase ? message.uppercased() : message
        for _ in 0..<count {
            Figlet.say(text)
        }
    }
}
~~~

The `@main` attribute marks `MyCLI` as the tool's entry point. Each property declares part of the command-line interface:

- `@Argument` is a positional value, here the message to print.
- `@Option` is a named value. `count` is an `Int`, so Argument Parser converts and checks the input for us, and `.shortAndLong` accepts both `-c` and `--count`.
- `@Flag` is a Boolean that is `true` when present.

Argument Parser calls `validate()` after parsing for any extra checks, then calls `run()`. `commandName` sets the name shown in help, which is also the name we'll install the tool under later.

Let's try it:

~~~no-highlight
$ swift run MyCLI "Hello, Swift!"
  _   _          _   _                 ____               _    __   _     _ 
 | | | |   ___  | | | |   ___         / ___|  __      __ (_)  / _| | |_  | |
 | |_| |  / _ \ | | | |  / _ \        \___ \  \ \ /\ / / | | | |_  | __| | |
 |  _  | |  __/ | | | | | (_) |  _     ___) |  \ V  V /  | | |  _| | |_  |_|
 |_| |_|  \___| |_| |_|  \___/  ( )   |____/    \_/\_/   |_| |_|    \__| (_)
                                |/                                          
~~~

Argument Parser generates help from our declarations:

~~~no-highlight
$ swift run MyCLI --help
OVERVIEW: Print a message as ASCII art.

USAGE: mycli <message> [--count <count>] [--uppercase]

ARGUMENTS:
  <message>               The message to print.

OPTIONS:
  -c, --count <count>     The number of times to print the message. (default: 1)
  --uppercase             Convert the message to uppercase.
  -h, --help              Show help information.
~~~

Argument Parser reports errors, including the one from our `validate()`, with usage information:

~~~no-highlight
$ swift run MyCLI Hi --count three
Error: The value 'three' is invalid for '--count <count>'
Help:  --count <count>  The number of times to print the message.
Usage: mycli <message> [--count <count>] [--uppercase]
  See 'mycli --help' for more information.
$ swift run MyCLI Hi --count 0
Error: Please specify a count of at least 1.
Usage: mycli <message> [--count <count>] [--uppercase]
  See 'mycli --help' for more information.
~~~

## Test it

The package already includes a test target that uses [Swift Testing](https://swiftpackageindex.com/swiftlang/swift-testing/main/documentation/testing). Commands can parse an array of strings, which makes them easy to test without starting a process. Replace the contents of `Tests/MyCLITests/MyCLITests.swift` with:

~~~swift
import Testing
@testable import MyCLI

@Test func parsesArguments() throws {
    let command = try MyCLI.parse(["Hello", "--count", "3", "--uppercase"])
    #expect(command.message == "Hello")
    #expect(command.count == 3)
    #expect(command.uppercase)
}

@Test func rejectsInvalidCount() {
    #expect(throws: (any Error).self) {
        try MyCLI.parse(["Hello", "--count", "0"])
    }
}
~~~

Then run the tests with `swift test`:

~~~no-highlight
$ swift test
...
◇ Test run started.
↳ Testing Library Version: 6.4.2 (288a2328ff84644)
↳ Target Platform: arm64-apple-macosx
◇ Test rejectsInvalidCount() started.
◇ Test parsesArguments() started.
✔ Test parsesArguments() passed after 0.003 seconds.
✔ Test rejectsInvalidCount() passed after 0.004 seconds.
✔ Test run with 2 tests in 0 suites passed after 0.004 seconds.
~~~

## Install it

So far we've been running a debug build. For an optimized build, use the release configuration, then copy the binary to a directory on your `PATH`:

~~~bash
$ swift build -c release
$ mkdir -p ~/.local/bin
$ cp "$(swift build -c release --show-bin-path)/MyCLI" ~/.local/bin/mycli
$ mycli "It works!"
~~~

If your shell can't find `mycli`, add `~/.local/bin` to your `PATH`.

> Tip: On Windows, copy `MyCLI.exe` to a directory that's listed in your `Path` environment variable instead.

Argument Parser can also generate shell completion scripts for zsh, bash, and fish, so `mycli` gets tab completion like any other tool:

~~~bash
$ mycli --generate-completion-script zsh
~~~

See [Generating and Installing Completion Scripts](https://swiftpackageindex.com/apple/swift-argument-parser/documentation/argumentparser/installingcompletionscripts) for where to save the script for your shell.

Argument Parser also includes a plugin that generates a man page from the same declarations: `swift package generate-manual`.

## Ship a static Linux binary

Swift can cross-compile, so you can build Linux binaries from macOS or from any Linux distribution. With the [Static Linux SDK](/documentation/articles/static-linux-getting-started.html), the result is a single, fully statically linked executable that runs on any Linux machine without installing Swift.

Install the SDK that matches your Swift toolchain. For Swift {{ site.data.builds.swift_releases.last.name }}, that's:

{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Static SDK' | first %}
{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = tag | downcase %}
{% assign base_url = "https://download.swift.org/" | append: tag_downcase | append: "/static-sdk/" | append: tag | append: "/" | append: tag %}

~~~bash
$ swift sdk install {{ base_url }}_static-linux-{{ platform.version }}.artifactbundle.tar.gz --checksum {{ platform.checksum }}
~~~

> Note: On macOS, the Static Linux SDK needs the open-source toolchain from [swift.org/install](/install/macos/), not the one included with Xcode.

Then build for Linux:

~~~no-highlight
$ swift build -c release --swift-sdk x86_64-swift-linux-musl -Xlinker -s
Building for production...
Build complete! (10.79 sec)
$ file "$(swift build -c release --swift-sdk x86_64-swift-linux-musl --show-bin-path)/MyCLI"
/path/to/MyCLI/.build/out/Products/Release-staticlinux-x86_64/MyCLI: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, BuildID[sha1]=4dab974a8ca9ba6b7d4b993af741d71ea48f26ac, stripped
~~~

Use `aarch64-swift-linux-musl` instead to build for ARM64 Linux.

`-Xlinker -s` strips debug information, which makes the binary much smaller. Copy it to any x86-64 Linux machine or container and it runs as is, with no dependencies. To learn about building C dependencies and other details, see [Getting Started with the Static Linux SDK](/documentation/articles/static-linux-getting-started.html).

## Where now?

You've built, tested, installed, and cross-compiled a command-line tool in Swift. Here are some places to go next:

- **Argument Parser**: The [documentation](https://swiftpackageindex.com/apple/swift-argument-parser/documentation/argumentparser) covers [subcommands](https://swiftpackageindex.com/apple/swift-argument-parser/documentation/argumentparser/commandsandsubcommands), custom completions, and [`AsyncParsableCommand`](https://swiftpackageindex.com/apple/swift-argument-parser/documentation/argumentparser/asyncparsablecommand) for tools that use Swift concurrency.
- **Run other programs**: [Subprocess](https://github.com/swiftlang/swift-subprocess) launches child processes and streams their output using async/await.
- **Work with the system**: [Swift System](https://github.com/apple/swift-system) provides idiomatic interfaces to system calls and file paths, [SwiftLog](https://github.com/apple/swift-log) adds structured logging, and [Swift Configuration](https://github.com/apple/swift-configuration) reads settings from files and environment variables.
- **Make your CLI look great**: [Noora](https://github.com/tuist/Noora) provides prompts, progress indicators, and other terminal UI components.
- **Find packages**: Browse [packages that provide executables](https://swiftpackageindex.com/search?query=product:executable) on the Swift Package Index, or read the [Swift Package Manager documentation]({% link documentation/package-manager/index.md %}).
- **Set up your editor**: [Configure VS Code for Swift development](/documentation/articles/getting-started-with-vscode-swift.html) for code completion, debugging, and a test explorer.
- **Learn from real tools**: [swiftly](https://github.com/swiftlang/swiftly), [Swift-DocC](https://github.com/swiftlang/swift-docc), and [Swift Package Manager](https://github.com/swiftlang/swift-package-manager) are all command-line tools written in Swift.

---

> The source code for this guide can be found [on GitHub](https://github.com/swiftlang/swift-getting-started-cli)
