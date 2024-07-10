## Example Usage

In [Getting Started](/getting-started/cli-swiftpm/),
a simple command-line tool is built with the Swift Package Manager.

To provide a more complete look at what the Swift Package Manager can do,
the following example consists of four interdependent packages:

* [PlayingCard][PlayingCard] - Defines `PlayingCard`, `Suit`, and `Rank` types.
* [FisherYates][FisherYates] - Defines an extension that implements the `shuffle()` and `shuffleInPlace()` methods.
* [DeckOfPlayingCards][DeckOfPlayingCards] - Defines a `Deck` type that shuffles and deals an array of `PlayingCard` values.
* [Dealer][Dealer] - Defines an executable that creates a `DeckOfPlayingCards`, shuffles it, and deals the first 10 cards.

> You can build and run the complete example
> by downloading the source code of the [Dealer project from GitHub][Dealer]
> and running the following commands:
>
> ~~~ shell
> $ git clone https://github.com/apple/example-package-dealer.git
> $ cd example-package-dealer
> $ swift run dealer <count>
> ~~~

### Creating a Library Package

We'll start by creating a target representing
a playing card in a standard 52-card deck.
The `PlayingCard` target defines the `PlayingCard` type,
which consists of a `Suit` enumeration value (Clubs, Diamonds, Hearts, Spades)
and a `Rank` enumeration value (Ace, Two, Three, ..., Jack, Queen, King).

~~~ swift
public enum Rank: Int {
    case two = 2
    case three, four, five, six, seven, eight, nine, ten
    case jack, queen, king, ace
}

public enum Suit: String {
    case spades, hearts, diamonds, clubs
}

public struct PlayingCard {
    let rank: Rank
    let suit: Suit
}
~~~

By convention, a target includes any source files located in the `Sources/<target-name>` directory.

~~~ shell
example-package-playingcard
├── Sources
│   └── PlayingCard
│       ├── PlayingCard.swift
│       ├── Rank.swift
│       └── Suit.swift
└── Package.swift
~~~

When creating a library package intended for use by other projects, the `Package.swift` manifest must reside at the top level/root of the package directory structure.

Because the `PlayingCard` target does not produce an executable,
it can be described as a _library_.
A library is a target that builds a module which can be imported by other packages.
By default, a library module exposes all of the `public` types and methods
declared in source code located in the `Sources/<target-name>` directory.

Run `swift build` to start the Swift build process.
If everything worked correctly,
it will compile the Swift module for `PlayingCard`.

> The complete code for the `PlayingCard` package can be found at
> <https://github.com/apple/example-package-playingcard>.

### Using Build Configuration Statements

The next module you're going to build is `FisherYates`.
Unlike `PlayingCard`, this module does not define any new types.
Instead, it extends an existing type --
specifically the `Collection` and `MutableCollection` protocols --
to add the `shuffled()` method
and its mutating counterpart `shuffle()`.

The implementation of `shuffle()` uses
the [Fisher-Yates](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle) algorithm
to randomly permute the elements in a collection.
Instead of using the random number generator provided by the Swift standard library,
this method calls a function imported from a system module.
For this function to be compatible with both macOS and Linux,
the code uses build configuration statements.

In macOS, the system module is `Darwin`,
which provides the `arc4random_uniform(_:)` function.
In Linux, the system module is `Glibc`,
which provides the `random()` function:

~~~ swift
#if os(Linux)
import Glibc
#else
import Darwin.C
#endif

public extension MutableCollection where Index == Int {
    mutating func shuffle() {
        if count <= 1 { return }

        for i in 0..<count - 1 {
          #if os(Linux)
            let j = Int(random() % (count - i)) + i
          #else
            let j = Int(arc4random_uniform(UInt32(count - i))) + i
          #endif
            swapAt(i, j)
        }
    }
}
~~~

> The complete code for the `FisherYates` package can be found at
> <https://github.com/apple/example-package-fisheryates>.

### Importing Dependencies

The `DeckOfPlayingCards` package brings the previous two packages together:
It defines a `Deck` type
that uses the `shuffle()` method from `FisherYates`
on an array of `PlayingCard` values.

To use the `FisherYates` and `PlayingCards` modules,
the `DeckOfPlayingCards` package must declare their packages as dependencies
in its `Package.swift` manifest file.

~~~ swift
// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "DeckOfPlayingCards",
    products: [
        .library(name: "DeckOfPlayingCards", targets: ["DeckOfPlayingCards"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/example-package-fisheryates.git", from: "2.0.0"),
        .package(url: "https://github.com/apple/example-package-playingcard.git", from: "3.0.0"),
    ],
    targets: [
        .target(
            name: "DeckOfPlayingCards",
            dependencies: ["FisherYates", "PlayingCard"]),
        .testTarget(
            name: "DeckOfPlayingCardsTests",
            dependencies: ["DeckOfPlayingCards"]),
    ]
)
~~~

Each dependency specifies a source URL and version requirements.
The source URL is a URL accessible to the current user that resolves to a Git repository.
The version requirements,
which follow [Semantic Versioning (SemVer)](http://semver.org) conventions,
are used to determine which Git tag to check out and use to build the dependency.
For the `FisherYates` dependency,
the most recent version with a major version equal to `2` (for example, `2.0.4`) will be used.
Similarly, the `PlayingCard` dependency will use the most recent version with a major version equal to `3`.

When the `swift build` command is run,
the Package Manager downloads all of the dependencies,
compiles them,
and links them to the package module.
This allows `DeckOfPlayingCards`
to access the public members of its dependent modules
with `import` statements.

You can see the downloaded sources in the `.build/checkouts` directory at the root of your project,
and intermediate build products in the `.build` directory at the root of your project.

> The complete code for the `DeckOfPlayingCards` package can be found at
> <https://github.com/apple/example-package-deckofplayingcards>.

### Resolving transitive dependencies

With everything else in place,
now you can build the `Dealer` module.
The `Dealer` module depends on the `DeckOfPlayingCards` package,
which in turn depends on the `PlayingCard` and `FisherYates` packages.
However, because the Swift Package Manager automatically resolves transitive dependencies,
you only need to declare the `DeckOfPlayingCards` package as a dependency.

~~~ swift
// swift-tools-version:5.5

import PackageDescription

let package = Package(
    name: "dealer",
    products: [
        .executable(name: "Dealer", targets: ["Dealer"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/example-package-deckofplayingcards.git", from: "3.0.0"),
    ],
    targets: [
        .target(
            name: "Dealer",
            dependencies: ["DeckOfPlayingCards"]),
    ]
)
~~~

Swift requires that a source file import the modules for any types
that are referenced in code.
For the `Dealer` module's `main.swift` file,
the `Deck` type from `DeckOfPlayingCards`
and the `PlayingCard` type from `PlayingCard` are referenced.
Although the `shuffle()` method on the `Deck` type
uses the `FisherYates` module internally,
that module does not need to be imported in `main.swift`.

~~~ swift
import DeckOfPlayingCards

let numberOfCards = 10

var deck = Deck.standard52CardDeck()
deck.shuffle()

for _ in 1...numberOfCards {
    guard let card = deck.deal() else {
        print("No More Cards!")
        break
    }

    print(card)
}
~~~

By convention, a target containing a file named `main.swift` in its directory
produces an executable.

Running the `swift build` command
starts the Swift build system
to produce the `Dealer` executable,
which can be run from the `.build/debug` directory.

~~~ shell
$ swift build
$ ./.build/debug/Dealer
♠︎6
♢K
♢2
♡8
♠︎7
♣︎10
♣︎5
♢A
♡Q
♡7
~~~

> The complete code for the `Dealer` package can be found at
> <https://github.com/apple/example-package-dealer>.

* * *

For more information about using the Swift Package Manager,
see the documentation provided in the [Swift Package Manager project on GitHub](https://github.com/swiftlang/swift-package-manager).


[PlayingCard]: https://github.com/apple/example-package-playingcard
[FisherYates]: https://github.com/apple/example-package-fisheryates
[DeckOfPlayingCards]: https://github.com/apple/example-package-deckofplayingcards
[Dealer]: https://github.com/apple/example-package-dealer
