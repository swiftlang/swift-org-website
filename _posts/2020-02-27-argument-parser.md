---
layout: new-layouts/blog
title: Announcing ArgumentParser
author: natecook1000
date: 2020-02-27 09:00:00
---

We're delighted to announce [`ArgumentParser`](https://github.com/apple/swift-argument-parser), a new open-source library that makes it straightforward — even enjoyable! — to parse command-line arguments in Swift.

## Building a Command-Line Tool

To show you what using the `ArgumentParser` library is like, we're going to create a utility that generates random numbers. Like many command-line tools, this one will gradually accrue features, and we'll see how `ArgumentParser` helps both authors and users keep everything straight.

Here's the desired interface for our `random` utility:

~~~
> random 20
17
> random 100
89
> random
Error: Missing expected argument '<high-value>'
Usage: random <high-value>
~~~

Let's define a `Random` type that expects a single integer argument — `highValue` — and then prints a random number between 1 and `highValue`:

~~~swift
import ArgumentParser

struct Random: ParsableCommand {
    @Argument() var highValue: Int

    func run() {
        print(Int.random(in: 1...highValue))
    }
}

Random.main()
~~~

That's it!

* The `@Argument` property wrapper indicates that the property should be drawn from a command-line argument.
* Calling `main()` on our `ParsableCommand` type kicks off parsing and, if parsing is successful, runs the command-line tool.
* The library synthesizes help and error messages that guide users toward successful usage, using all the information we've given it: the `highValue` property's name and type, and the name of our command type.
* Because `highValue` is defined as an `Int`, only valid inputs are recognized, with no manual parsing or casting necessary on your part:

  ~~~
  > random ZZZ
  Error: The value 'ZZZ' is invalid for '<high-value>'
  Usage: random <high-value>
  ~~~

### Customizing Validation and Help

A good command-line tool documents and validates its inputs. Let's add some descriptive text and implement the `validate()` method, so that we can catch the case where a user gives a too-low value for `highValue`:

~~~swift
struct Random: ParsableCommand {
    static let configuration = CommandConfiguration(
        abstract: "Chooses a random number between 1 and your input.")

    @Argument(help: "The highest value to pick.")
    var highValue: Int

    func validate() throws {
        guard highValue >= 1 else {
            throw ValidationError("'<high-value>' must be at least 1.")
        }
    }

    func run() {
        print(Int.random(in: 1...highValue))
    }
}
~~~

Our tool is now smarter about the values it can accept and includes rich documentation in the auto-generated help screen:

~~~
> random 0
Error: '<high-value>' must be at least 1.
Usage: random <high-value>
> random --help
OVERVIEW: Chooses a random number between 1 and your input.

USAGE: random <high-value>

ARGUMENTS:
  <high-value>            The highest value to pick.

OPTIONS:
  -h, --help              Show help information.
~~~

### Using Subcommands

Modern command-line tools, such as Git and the Swift Package Manager, use subcommands to group related tools in a command tree. Using `ArgumentParser`, you build interfaces like this by declaring each subcommand as a separate type.

Let's implement a subcommand by moving our existing logic into a nested `Number` type:

~~~swift
extension Random {
    struct Number: ParsableCommand {
        static let configuration = CommandConfiguration(
            abstract: "Chooses a random number between 1 and your input.")

        @Argument(help: "The highest value to pick.")
        var highValue: Int

        func validate() throws {
            guard highValue >= 1 else {
                throw ValidationError("'<high-value>' must be at least 1.")
            }
        }

        func run() {
            print(Int.random(in: 1...highValue))
        }
    }
}
~~~

...and listing the subcommand in the root command's configuration:

~~~swift
struct Random: ParsableCommand {
    static let configuration = CommandConfiguration(
        abstract: "Randomness utilities.",
        subcommands: [Number.self])
}
~~~

`ArgumentParser` takes care of the rest!

~~~
> random number 100
79
~~~

### Adding a Subcommand

To complete our tool, let's add a second subcommand to `pick` an element from a list that you supply as arguments:

~~~
> random pick Fuji Gala Cameo Honeycrisp McIntosh Braeburn
McIntosh
> random pick --count 3 Fuji Gala Cameo Honeycrisp McIntosh Braeburn
Honeycrisp
Cameo
Braeburn
~~~

The `Pick` command accepts a `count` option and expects an array of `elements` to choose from:

~~~swift
struct Random: ParsableCommand {
    static let configuration = CommandConfiguration(
        abstract: "Randomness utilities.",
        subcommands: [Number.self, Pick.self])

    // ...

    struct Pick: ParsableCommand {
        static let configuration = CommandConfiguration(
            abstract: "Picks random elements from your input.")

        @Option(default: 1, help: "The number of elements to choose.")
        var count: Int

        @Argument(help: "The elements to choose from.")
        var elements: [String]

        func validate() throws {
            guard !elements.isEmpty else {
                throw ValidationError("Must provide at least one element.")
            }
        }

        func run() {
            let picks = elements.shuffled().prefix(count)
            print(picks.joined(separator: "\n"))
        }
    }
}
~~~

The `@Option` property wrapper indicates that a property should be read from command-line arguments, using the name of the property to make a key-value pair.

The final version of our `random` utility is less than 50 lines of code! It automatically detects which subcommand the user has given, parses that subcommand's arguments, and calls its `run()` method. If you leave out a subcommand, the library calls the `Random` command's default implementation of `run()`, which simply prints the command's help screen:

~~~
> random
OVERVIEW: Randomness utilities.

USAGE: random <subcommand>

OPTIONS:
  -h, --help              Show help information.

SUBCOMMANDS:
  number                  Chooses a random number between 1 and your input.
  pick                    Picks random elements from your input.
~~~

## Design Goals

When designing `ArgumentParser`, we had the following goals in mind:

* Encouraging best command-line interface practices and supporting progressive understanding of the library.
* Enabling projects ranging from simple, one-off scripts to complex tools, including nested subcommands and rich help information.
* Eliminating the boilerplate typically associated with parsing command-line arguments, reducing repetition and the chance for errors.

These design goals led us to a design that uses Swift's type system, as well as features like property wrappers and reflection, to implicitly build an interface from your custom type declarations. `ArgumentParser` is the result.

## Why Now?

The Swift project includes several command-line tools written in Swift — some shipped as part of the Swift toolchain, and some used for building and testing. In particular, SwiftPM includes an argument parser, in its `TSCUtility` library, that has grown to support SwiftPM's needs, but was never intended for wider adoption.

We'll be working to adopt `ArgumentParser` across the Swift project, and invite you to experiment with the library, give feedback, and get involved in its ongoing development!

## Learn More

In addition to what we've seen so far, `ArgumentParser` supports `--flag` arguments for Boolean or enumerable properties, multiple names for options and flags, encapsulating groups of arguments, and much more. You can learn more by visiting [the repository's README](https://github.com/apple/swift-argument-parser), browsing the guides in the [documentation folder](https://github.com/apple/swift-argument-parser/tree/main/Sources/ArgumentParser/Documentation.docc), and reading the in-source symbol documentation.

You can also explore the Swift project's in-flight adoption of `ArgumentParser`:

* [`indexstore-db`](https://github.com/swiftlang/indexstore-db/pull/72) is a simple utility with two commands.
* [`swift-format`](https://github.com/swiftlang/swift-format/pull/154) uses some advanced features, like custom option values and hidden flags.

## What's Next?

In the near term, there are a couple additional features that need to be added so that SwiftPM can adopt `ArgumentParser` without regressing in functionality — you can find those features tracked as [issues in the repository](https://github.com/apple/swift-argument-parser/issues). Once SwiftPM adoption is complete, we'd like to adopt the library in the [Swift rewrite of the Swift compiler driver](https://github.com/swiftlang/swift-driver), as well.

Along with those integrations, we'd like to work with the community toward defining the requirements of a 1.0 release. What other features are critical for widespread adoption in a variety of environments, such as on the server, Windows, and other platforms? What other customization points are most important? The more people using `ArgumentParser`, the better we'll be able to answer these questions together.

## Get Involved

Your experience, feedback, and contributions are greatly encouraged!

* Get started by trying out the [`ArgumentParser` library on GitHub](https://github.com/apple/swift-argument-parser),
* Discuss the library and get help in the [ArgumentParser forum](https://forums.swift.org/c/related-projects/argumentparser),
* [Open an issue](https://github.com/apple/swift-argument-parser/issues) with problems you find or ideas you have for improvements,
* And as always, [pull requests](https://github.com/apple/swift-argument-parser/pulls) are welcome!

### Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/announcing-argumentparser/34155) on the [Swift forums][].

[Swift forums]: https://forums.swift.org
