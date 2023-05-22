---
layout: page
title: Mix Swift and C++
official_url: https://swift.org/documentation/cxx-interop/
redirect_from: 
- /documentation/cxx-interop.html
---
<!-- {% comment %}
The width of <pre> elements on this page is carefully regulated, so we
can afford to drop the scrollbar boxes.
{% endcomment %} -->
<style>
article pre {
    overflow: visible;
}
</style>

## Table of Contents
{:.no_toc}

* TOC
{:toc}

## Introduction

This document is the reference guide describing how to mix Swift and C++. It
describes how C++ APIs get imported into Swift, and provides examples showing
how various C++ APIs can be used in Swift. It also describes how Swift APIs
get exposed to C++, and provides examples showing how the exposed Swift APIs
can be used from C++.

Bidirectional interoperability with C++ is supported in Swift 5.9 and above. 

* * *

<div class="info" markdown="1">
C++ interoperability is an actively evolving feature of Swift. The [status page](status) provides an
overview of the currently supported interoperability features.
</div>

## Overview

This section provides the basic high-level overview of how
Swift interoperates with C++.

### Enabling C++ Interoperability

Swift code interoperates with C and Objective-C APIs by default.
You must enable interoperability with C++ if you want to use
C++ APIs from Swift, or expose Swift APIs to C++.

The following guides describe how C++ interoperability can be enabled when
working with a specific build system or IDE:

- [Read how to use C++ APIs from Swift in a Swift package](TODO)
- [Read how to use CMake to mix Swift and C++](TODO)

Other build systems can enable C++ interoperability by passing in the required
flag to the Swift compiler:

- [Read how to enable C++ interoperability when invoking Swift compiler directly](TODO)

### Importing C++ into Swift

Header files are commonly used to describe the public interface of a
C++ library. They contain type and template definitions, and also
declarations for functions and methods, whose bodies are often placed into
implementation files that are then compiled by the C++ compiler.

The Swift compiler embeds the [Clang](https://clang.llvm.org/) compiler.
This allows Swift to import C++ header files using
[Clang modules](https://clang.llvm.org/docs/Modules.html). Clang modules
provide a more robust and efficient semantic model of C++ headers as
compared to the preprocessor-based model of directly including the contents of 
header files using the `#include` directive.

> C++20 introduced C++ modules as an alternative to header files.
> Swift cannot import C++ modules yet.

### Creating a Clang Module

In order for Swift to import a Clang module, it needs to find a 
`module.modulemap` file that describes how a collection of C++ headers maps
to a Clang module. 

<!-- {% comment %}
TODO: talk about SwiftPM generating module map for umbrealla header.
TODO: talk about Xcode generating module map?
{% endcomment %} -->

Some IDEs and build systems can generate a module map file for a
C++ build target. In other cases you might be required to create a module
map manually.

The recommended way to create a module map is to list all the header
files from a specific C++ target that you want to make available to Swift.
For example, let's say we want to create a module map for a C++
library `forestLib`. This library has two header files: `forest.h` and `tree.h`.
In this case we can follow the recommended approach and create a module map
that has two `header` directives:

```shell
module forestLib {
    header "forest.h"
    header "tree.h"

    export *
}
```

The `export *` directive is another
recommended addition to the module map.
It ensures that the types from Clang modules imported 
into the `forestLib` module are visible to Swift as well.

The module map file should be placed right next to the header files it
references. 
For example, in the `forestLib` library, the module map would
go into the `include` directory:

~~~ shell
forestLib
├── include
│   ├── forest.h
│   ├── tree.h
│   └── module.modulemap [NEW]
├── forest.cpp
└── tree.cpp
~~~

Now that `forestLib` has a module map, Swift can import it when
C++ interoperability is enabled. In order for Swift to find the `forestLib`
module, the build system must pass the import path flag (`-I`) that 
points to `forestLib/include` when it's invoking the Swift compiler. 

For more information on the syntax and the semantics of module map files, please
see Clang's
[module map language documentation](https://clang.llvm.org/docs/Modules.html#module-map-language).

### Working with Imported C++ APIs

The Swift compiler represents the imported C++ types and functions
using Swift declarations once a Clang module is imported. This allows Swift code
to use C++ types and functions as if they were Swift types and functions.

For example, the following C++ class from the `forestLib` library: 

```c++
class Tree {
public:
  Tree(TreeKind kind);
private:
  TreeKind kind;
};
```

Is represented as a `struct` inside of the Swift compiler:

```swift
struct Tree {
  init(_ kind: TreeKind)
}
```

It can then be used directly in Swift, just like any other
Swift `struct`:

```swift
import forestLib

let tree = Tree(.Oak)
```

Even though Swift has its own internal representation of the C++ type,
it doesn't use any kind of indirection to represent a
value of such type. That means that
when you're creating a
`Tree` from Swift, Swift invokes the C++ constructor directly and stores
the produced value directly into the `tree` variable.

### Exposing Swift APIs to C++

In addition to importing and using C++ APIs, the Swift compiler is also
capable of exposing Swift APIs from a Swift module to C++. This makes it
possible to gradually integrate Swift into an existing C++ codebase,
as the newly added Swift APIs can still be accessed from C++.

Swift APIs can be accessed by including a header
file that Swift generates. The generated header uses C++ types and functions
to represent Swift types and functions. When C++ interoperability is enabled,
Swift generates C++ bindings for all the supported public types and functions
in a Swift module. For example, the following Swift function:

```swift
// Swift module 'forestRenderer'
import forestLib

public func renderTreeToAscii(_ tree: Tree) -> String {
  ...
}
```

Will be present in the header generated by the Swift compiler for the
`forestRenderer` module. It can then be called directly from C++ once the C++
file includes the generated header:

```c++
#include "forestRenderer-Swift.h"
#include <string>
#include <iostream>

void printTreeArt(const Tree &tree) {
  std::cout << (std::string)forestRenderer::renderTreeToAscii(tree);
}
```

The [C++ interoperability status page](status) describes which Swift
language constructs and standard library types can be exposed to C++.

## Using C++ Types And Functions In Swift

A wide array of C++ types and functions can be used from Swift. This section
goes over the fundamentals of how the supported types and functions can be
used from Swift.

### Invoking C++ Functions

C++ functions from imported modules can be invoked using the
familiar function call syntax from Swift. For example, this C++ function:

```c++
void printWelcomeMessage(const std::string &name);
```

Can be invoked directly from Swift as if it was a regular Swift function:

```swift
printWelcomeMessage("Thomas");
```

### C++ Structures and Classes Are Value Types By Default

Swift maps C++ structures and classes to Swift `struct` types by default.
Swift considers them to be
[value types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures#Structures-and-Enumerations-Are-Value-Types). This means that they're always copied
when they're passed around in your Swift code.

The special members of a C++ structure or class type are used by Swift when it
needs to perform a copy of a value or dispose of a value when it goes out of
scope. If the C++ type has a copy
constructor, Swift will use it when a value of such type is copied in
Swift. And if the C++ type has a destructor, Swift will call the destructor when
a Swift value of such type is destroyed.

As of Swift 5.9, C++ structures and classes with a deleted copy constructor
are not available in Swift. Non-copyable C++ structures or classes that also
have a move constructor will be available in a future version of Swift.
They will map to
[non-copyable](https://github.com/apple/swift-evolution/blob/main/proposals/0390-noncopyable-structs-and-enums.md) Swift `structs`. In the meantime, such C++ types can be annotated
with [Swift-provided annotations for reference types](TODO) to make them
available in Swift. 

### Constructing C++ Types From Swift

Public constructors inside C++ structures and classes
that aren't copy or move constructors 
become initializers in Swift. 

For example, these constructors of the C++ `Color` class:

```c++
class Color {
public:
  Color();
  Color(float red, float blue, float green);
  Color(float value);

  ...
  float red, blue, green;
};
```

Become initializers. They can be called from Swift to create a value of type
`Color`: 

```swift
let theEmptiness = Color()
let oceanBlue = Color(0.0, 0.0, 1.0)
let seattleGray = Color(0.7)
```

### Accessing Data Members Of a C++ Type

The public data members of C++ structures and classes become properties
in Swift. For example, the data members of the `Color` class shown above
can be accessed just like any other Swift property:

```swift
let color: Color = getRandomColor()
print("Today I'm feeling \(color.red) red but also \(color.blue) blue")
```

### Calling C++ Member Functions

Member functions inside C++ structures and classes become methods in
Swift.

#### Constant Member Functions Are `nonmutating`

Constant member functions become `nonmutating` Swift methods, whereas
member function without a `const` qualifier become `mutating` Swift methods.
For example, this member function in the C++ `Color` class:

```c++
void Color::invert() { ... }
```

Is considered to be a `mutating` method in Swift:

```swift
var red = Color(1.0, 0.0, 0.0)
red.invert() // red becomes yellow.
```

And as such it can't be called on constant `Color` values. However,
this constant member function:

```c++
Color Color::inverted() const { ... }
```

Is not a `mutating` method in Swift, and thus it can be called on a constant
`Color` value:

```swift
let darkGray = Color(0.2, 0.2, 0.2)
let veryLightGray = darkGray.inverted()
```

<!-- {% comment %}
TODO: Talk about const rule.
{% endcomment %} -->

#### Constant Member Function Assumptions

The Swift compiler assumes that constant member functions do not
mutate the instance that `this` points to. A violation of this assumption by a
C++ member function could lead to Swift code not observing the mutation
of the instance pointed to by `this` and using the original value of such
instance for the rest of the Swift code execution.

#### Member Functions Returning References And View Types

Some functions are unsafe (TODO).

Please look at this section to see how to work with them safely in Swift.

#### Overloaded Member Functions

Two member functions that have the same name but different `const` qualifiers
are both available in Swift. The function without `const` becomes `Mutating`
in Swift. 

TODO have an example.

For example, the following C++ method:

```
class Forest {
public:
  Tree getFirstTree() const;
  Tree getFirstTree();

};
```

will map to:

```swift
  getFirstTree
  getFirstTreeMutating
```

#### Static Member Functions

Static C++ member functions become `static` Swift methods.

### Acessing Inherited Members From Swift

Inherited members become available in Swift inside the specific
Swift structure/class.

TODO: what are the rules on shadowed names.

### Using C++ Enumerations

Scoped C++ enumerations become Swift enumerations with raw values.
All of their cases get mapped to Swift cases as well. For example,
the following C++ enumeration:

```c++
enum class TreeKind {
  Oak,
  Redwood,
  Willow
};
```

Is represented in Swift as the following enumeration:

```swift
enum TreeKind : Int32 {
  case Oak = 0
  case Redwood = 1
  case Willow = 2
}
```

As such, it can be used just like any other `enum` in Swift:

```swift
func isConiferous(treeKind: TreeKind) -> Bool {
  switch treeKind {
    case .Redwood: return true
    default: return false
  }
}
```

Unscoped C++ enumerations become Swift structures. Their cases become
variables outside of the Swift structure itself. For example, the following
unscoped enum:

```c++
enum MushroomKind {
  Oyster,
  Portobello,
  Button
}
```

Is represented in Swift as the following structure:

```swift
struct MushroomKind : Equatable, RawRepresentable {
    public init(_ rawValue: UInt32)
    public init(rawValue: UInt32)
    public var rawValue: UInt32
}
var Oyster: MushroomKind { get }
var Portobello: MushroomKind { get }
var Button: MushroomKind { get }
```

### Using C++ Type Aliases

A C++ `using` or `typedef` declaration becomes a `typealias` in Swift.
For instance, the following `using` declaration:

```c++
using CustomString = std::string;
```

Becomes a `CustomString` type in Swift.

### Using Class Templates 

An instantiated specialization of a class or structure template is mapped
to a distinct type in Swift. For example, the following C++ class
template:

```c++
template<class T, class U>
class Fraction {
public:
  T numerator;
  U denominator;

  Fraction(const T &, const U &);
};
```

Is not available in Swift by itself. However, a function that returns
an instantiated specialization of `Fraction` is:

```c++
Fraction<int, float> getMagicNumber();
```

Such function can be called from Swift, as its return value
is the `Fraction<int, float>` specialization:

```
let magicNum = getMagicNumber()
print(magicNum.numerator, magicNum.denominator)
```

An instantiated specialization of a class template is treated like
a regular C++ structure or class when it is mapped into Swift. For
example, the `Fraction<int, float>` template specialization becomes a
Swift structure:

```swift
struct Fraction<CInt, Float> {
  var numerator: CInt
  var denominator: Float

  init(_: CInt, _: Float)
}
```

A C++ type alias can refer to a specific specialization of a
class template. For example, in order to construct a 
`Fraction<int, float>` from Swift, you first want to create a
C++ type alias that refers to such template specialization:

```c++
// Bring `Fraction<int, float>` type to Swift with a C++ `using` declaration.
using MagicFraction = Fraction<int, float>;
```

Then you can use this type alias directly from Swift:

```swift
let oneEights = MagicFraction(1, 8.0)
print(oneEights.numerator)
```

A [follow-up section of this document](#conforming-class-template-to-swift-protocol)
describes how Swift generics and protocol extensions can be used to write
generic Swift code that works with any specialization of a class template.

## Customizing How C++ Maps To Swift

The defaults that determine how C++ types and functions map to Swift can be
changed, by annotating a specific C++
function or type with one of the provided customization macros. For example,
you can choose to provide a different Swift name for a specific C++
function using the `SWIFT_NAME` macro.

The `<swift/bridging>` header defines the customization macros that can be used
to annotate C++ functions and types. This header ships with the
Swift toolchain. On platforms like Linux, both the system's C++ compiler and
the Swift compiler should find this header automatically.
On other platforms, like Windows, you might
need to add additional header search path flags (`-I`) to your C++ and Swift
compiler invocations to make sure that this header is found. 

<!-- {% comment %}
TODO: Talk about Xcode.
{% endcomment %} -->

This section describes just two of the customization macros from 
the `<swift/bridging>` header. The other customization macros and their
behavior are documented in the subsequent sections in this document.
The [complete list](#list-of-customization-macros-in-swiftbridging) of all the
customization macros is provided in the appendix.

### Renaming C++ APIs In Swift

The `SWIFT_NAME` macro provides a different name for C++
types and functions in Swift. C++ types can be renamed by specifying the Swift
type name inside of the `SWIFT_NAME` macro. For example,
the following C++ structure:

```c++
struct Error {
  ...
} SWIFT_NAME("CxxLibraryError");
```

Gets renamed to `CxxLibraryError` structure in Swift.

When renaming a function, you need to specify the Swift function name
(including argument labels) inside of the `SWIFT_NAME` macro.
For example, the following C++ function:

```c++
#include <swift/bridging>

void sendCopy(const std::string &) SWIFT_NAME(send(_:));
```

Gets renamed to `send` in Swift:

```swift
send("Hello, this is Swift!")
```

### Mapping Getters And Setters to Computed Properties

The `SWIFT_COMPUTED_PROPERTY` macro maps a C++ getter and setter member
function to a computed property in Swift. For example, the following getter
and setter pair:

```c++
#include <swift/bridging>

class Tree {
public:
  TreeKind getKind() const SWIFT_COMPUTED_PROPERTY;
  void setKind(TreeKind kind) SWIFT_COMPUTED_PROPERTY;
  
  ...
};
```

Gets mapped to a single `treeKind` computed property in Swift:

```swift
func makeNotAConiferousTree(tree: inout Tree) {
  tree.kind = tree.kind == .Redwood ? .Oak : tree.kind
}
```

Both the getter and setter need to operate on the same underlying C++ type for
this transformation to be successful in Swift.

<!-- {% comment %}
TODO: Can getter accept const ref.
{% endcomment %} -->

It's possible to map just the getter to a computed property, a setter is not
required for this transformation to work.

## Extending C++ Types In Swift

Swift [extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions)
can add new functionality to C++ types in Swift. They can also
conform an existing C++ type to a Swift protocol. 

> Extensions can add new functionality to a C++ type, but they can't override
> existing functionality of a C++ type.

### Conforming C++ Type To Swift Protocol

A C++ type can conform to a Swift protocol, retroactively (after the type has
been defined). Such conformance enables the following use cases in Swift:

- Generic Swift functions and types
[constrained by a protocol](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics#Type-Constraints)
 accept
  a conforming C++ value.
- A [protocol type](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols#Protocols-as-Types)
 can represent a conforming C++ value.

For example, a Swift extension to the C++ class `Tree` can add
`Hashable` conformance:

```swift
extension Tree: Hashable {
  static func == (lhs: Tree, rhs: Tree) -> Bool {
    return lhs.kind == rhs.kind
  }

  func hash(into hasher: inout Hasher) {
    hasher.combine(self.kind.rawValue)
  }
}
```

Such conformance then lets you use `Tree` as a key in a Swift dictionary:

```swift
let treeEmoji: Dictionary<Tree, String> = [
  Tree(.Oak): "🌳",
  Tree(.Redwood): "🌲"
]
```

### Conforming Class Template To Swift Protocol

A Swift extension can add protocol conformance for a specific class template specialization in Swift.

For example (TODO: Need better example):

```swift
// Swift module `Calculator`
protocol Fractional {
  associatedtype Numerator
  associatedtype Denominator
}
```

This makes it possible:

```c++
template<class T, class U>
class Fraction {
 
} SWIFT_CONFORMS_TO(Calculator.Fractional);
```

Then, every specialization conforms to such protocol.

## Working With C++ Collections

This section is used to describe collection / iterator bridging.

## Mapping C++ Types To Swift Reference Types

This section describes how to map C++ types that have reference semantics to
reference types in Swift

## Working With C++ References And View Types In Swift

This section describes how to safely work with C++ references and view types
in Swift.

## Using C++ Standard Library from Swift

This section describes how to import the C++ standard library, and how
to use the types from it in Swift.

### Importing C++ Standard Library

The platform's C++ standard library can be imported into Swift by importing
the `CxxStdlib` module.

Please see the [status page](TODO) for details on which C++ standard libraries
are supported on the supported platforms.

## Using Swift APIs from C++

A Swift library author might want to expose their interface to C++, to allow a C++ codebase to interoperate with the Swift library. This document describes how this can be accomplished, by first describing how Swift can expose its interface to C++, and then going into the details on how to use Swift APIs from C++.

This section describes how APIs in a Swift module
get exposed to C++. It then goes into details of how to use Swift APIs from C++.


## Appendix

This section contains additional tables and references for certain topics
that are outlined in the documentation above.

### List Of Customization Macros In `<swift/bridging>` 

| Macro                     | Documentation |
| ------------------------- | ------------- |
| `SWIFT_NAME`                | [Renaming C++ APIs In Swift](#renaming-c-apis-in-swift)       |
| `SWIFT_COMPUTED_PROPERTY`   | [Mapping Getters And Setters to Computed Properties](#mapping-getters-and-setters-to-computed-properties)        |
| `SWIFT_CONFORMS_TO`   | [Conforming Class Template To Swift Protocol](#conforming-class-template-to-swift-protocol)        |
