---
layout: new-layouts/base
title: Mixing Swift and C++
official_url: https://swift.org/documentation/cxx-interop/
redirect_from:
- /documentation/cxx-interop.html
---

## Table of Contents
{:.no_toc}

* TOC
{:toc}

## Introduction

C++ interoperability is a new feature in Swift 5.9.
A great variety of C++ APIs can be called directly from Swift, and select Swift APIs can be used from C++.

This document is the reference guide describing how to mix Swift and C++. It
describes how C++ APIs get imported into Swift, and provides examples showing
how various C++ APIs can be used in Swift. It also describes how Swift APIs
get exposed to C++, and provides examples showing how the exposed Swift APIs
can be used from C++.

* * *

<div class="info" markdown="1">
C++ interoperability is an actively evolving feature of Swift.
It currently supports interoperation between a subset of language features.
The [status page](status) provides an
overview of the currently supported interoperability features, and
lists the [existing constraints](status#constraints-and-limitations) as well.

Future releases of Swift might change how Swift and C++
interoperate,
as the Swift community gathers feedback from real world adoption of C++
interoperability in mixed Swift and C++ codebases.
Please provide the feedback that you have on the
[Swift forums](https://forums.swift.org/c/development/c-interoperability/), or
by filing an [issue on GitHub](https://github.com/swiftlang/swift/issues/new/choose).
Future changes to the design or functionality of C++ interoperability will not
break code in existing codebases [by default](#source-stability-guarantees-for-mixed-language-codebases).
</div>

## Overview

This section provides a high-level overview of how to mix Swift and C++. You can
get started by [enabling C++ interoperability](#enabling-c-interoperability) in
Swift. You will then want to understand how Swift
[imports C++ headers](#importing-c-into-swift), and how the imported C++
types and functions are [represented by the Swift compiler](#working-with-imported-c-apis).
After that, you will want to look over the follow-up sections that describe
[how to use](#using-c-types-and-functions-in-swift) the imported C++ APIs in Swift.
You should also take a look at how Swift APIs
[can be exposed](#exposing-swift-apis-to-c) to the rest of your C++ codebase.
If you're interested in using Swift APIs from C++, you will definitely want
to look over the follow-up sections that describe
[how to use](#using-swift-types-and-functions-from-c) the exposed Swift APIs in C++.

### Enabling C++ Interoperability

Swift code interoperates with C and Objective-C APIs by default.
You must enable interoperability with C++ if you want to use
C++ APIs from Swift, or expose Swift APIs to C++.

The following guides describe how C++ interoperability can be enabled when
working with a specific build system or IDE:

- [Read how to use C++ APIs from Swift in a Swift package](project-build-setup#mixing-swift-and-c-using-swift-package-manager)
- [Read how to mix Swift and C++ in an Xcode project](project-build-setup#mixing-swift-and-c-using-xcode)

Other build systems can enable C++ interoperability by passing in the required
flag to the Swift compiler:

- [Read how to enable C++ interoperability when invoking Swift compiler directly](project-build-setup#mixing-swift-and-c-using-other-build-systems)

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

> Swift currently cannot import
> [C++ modules](https://en.cppreference.com/w/cpp/language/modules)
> introduced in the C++20 language standard.

### Creating a Clang Module

In order for Swift to import a Clang module, it needs to find a
`module.modulemap` file that describes how a collection of C++ headers maps
to a Clang module.

Some IDEs and build systems can generate a module map file for a
C++ build target automatically.
Swift Package Manager automatically generates a module map file
when it [finds an umbrella header](project-build-setup#importing-headers-from-a-c-package-target)
in a C++ target. Xcode automatically generates a module map file for a
framework target, with the module map referencing framework's public headers.
In other cases you might be required to create a module
map manually.

The recommended way to manually create a module map is to list all the header
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

For example, Swift can represent the following C++ enumeration and
the following C++ class from the `forestLib` library:

```c++
enum class TreeKind {
  Oak,
  Redwood,
  Willow
};

class Tree {
public:
  Tree(TreeKind kind);
private:
  TreeKind kind;
};
```

A Swift enumeration is used internally by the Swift compiler to represent `TreeKind`:

```swift
enum TreeKind : Int32 {
  case Oak = 0
  case Redwood = 1
  case Willow = 2
}
```

A Swift structure is used internally by the Swift compiler to represent `Tree`:

```
struct Tree {
  init(_ kind: TreeKind)
}
```

Such structure can be used directly in Swift, just like any other Swift
structure:

```swift
import forestLib

let tree = Tree(.Oak)
```

Swift uses C++ types and
calls C++ functions directly, without any kind of indirection or wrapping.
In the example shown above,
Swift directly calls the C++ constructor for class `Tree`, and stores the
resulting object directly into the `tree` variable.

A subsequent section of this guide provides more details on
[how to use](#using-c-types-and-functions-in-swift) the imported C++ APIs in Swift.

### Exposing Swift APIs to C++

In addition to importing and using C++ APIs, the Swift compiler is also
capable of exposing Swift APIs from a Swift module to C++. This makes it
possible to gradually integrate Swift into an existing C++ codebase.

Swift APIs can be accessed by including a header
file that the build system generates when building a Swift module.
Some build systems generate the header automatically.
Xcode can automatically generate the header file for a framework or an App target.
Other build configurations
can generate the header manually by following the steps
outlined on the
[project and build setup page](project-build-setup#generating-c-header-with-exposed-swift-apis).
Swift functions can take C++ types as parameters. When using these Swift APIs from C++,
the headers for C++ types in the Swift function signatures need to be included
before including the generated interoperability header.

The generated header uses C++ types and functions
to represent Swift types and functions. When C++ interoperability is enabled,
Swift generates C++ bindings for all the supported public types and functions
in a Swift module. For example, the following Swift function can be called
from C++:

```swift
// Swift module 'forestRenderer'
import forestLib

public func renderTreeToAscii(_ tree: Tree) -> String {
  ...
}
```

An inline C++ function that calls the implementation of `renderTreeToAscii`
directly will be present in the header generated by the Swift compiler for the
`forestRenderer` module. It can be called from C++ code once the C++
file includes the generated header. Since the Swift API refers to `Tree`, a
type defined in C++, we need to include `Tree.hpp` before the generated header:

```c++
#include "Tree.hpp"
#include "forestRenderer-Swift.h"
#include <string>
#include <iostream>

void printTreeArt(const Tree &tree) {
  std::cout << (std::string)forestRenderer::renderTreeToAscii(tree);
}
```

The [C++ interoperability status page](status#supported-swift-apis)
describes which Swift language constructs and standard library types can be
exposed to C++. Some unsupported Swift APIs are mapped
to empty unavailable C++ declarations in the generated header, so you'll get an
error in the C++ code when you try to use something that's not exposed to C++.

### Source Stability Guarantees for Mixed-Language Codebases

The way Swift interoperates with C++ is still evolving. Some changes
in future releases of Swift will require source changes in mixed
Swift and C++ codebases
that have already adopted C++ interoperability. However, Swift will not
force you to adopt new or evolved C++ interoperability features when adopting
a new version of the Swift toolchain. To make that possible, future Swift releases
will provide multiple compatibility versions of C++
interoperability, just like Swift provides support for multiple compatibility
versions of the base Swift language. This means that a project using the current
compatibility version of C++ interoperability will be insulated from any changes
made in subsequent releases, and it can move to newer compatibility versions
at its own pace.

## Using C++ Types and Functions in Swift

A wide array of C++ types and functions can be used directly from Swift.
This section goes over the fundamentals of how the supported types and
functions can be used from Swift.

### Calling C++ Functions

C++ functions from imported modules can be called using the
familiar function call syntax from Swift. For example, this C++ function
is available in Swift:

```c++
void printWelcomeMessage(const std::string &name);
```

Swift code can call such function as if it was a regular Swift function:

```swift
printWelcomeMessage("Thomas")
```

### C++ Structures and Classes are Value Types by Default

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

C++ structures and classes with a deleted copy constructor are represented as
non-copyable Swift types (`~Copyable`). If a C++ type has a valid copy
constructor, it is still possible to make it non-copyable in Swift by annotating
it with a `SWIFT_NONCOPYABLE` macro.

Some C++ types are always passed around using a pointer or a reference in C++.
As such it might not make sense to map them to value types in Swift. These
types can be annotated in C++ to instruct the Swift compiler to map them to
[reference types in Swift instead](#mapping-c-types-to-swift-reference-types).

### Constructing C++ Types from Swift

Public constructors inside C++ structures and classes
that aren't copy or move constructors
become initializers in Swift.

For example, all three constructors of the C++ `Color` class are
available in Swift:

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

The `Color` constructors shown above become initializers in Swift.
Swift code can call them to create a value of type `Color`:

```swift
let theEmptiness = Color()
let oceanBlue = Color(0.0, 0.0, 1.0)
let seattleGray = Color(0.7)
```

### Accessing Data Members of a C++ Type

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
For example, this member function in the C++ `Color` class
is considered to be a `mutating` method in Swift:

```c++
void Color::invert() { ... }
```

Mutable `Color` values can call `invert`:

```swift
var red = Color(1.0, 0.0, 0.0)
red.invert() // red becomes yellow.
```

Constant `Color` values cannot call `invert`.

On the other hand, this constant member function is not a `mutating` method in
Swift:

```c++
Color Color::inverted() const { ... }
```

Therefore constant `Color` values can call `inverted`:

```swift
let darkGray = Color(0.2, 0.2, 0.2)
let veryLightGray = darkGray.inverted()
```

#### Constant Member Functions Must Not Mutate the Object

The Swift compiler assumes that constant member functions do not
mutate the instance that `this` points to. A violation of this assumption by a
C++ member function could lead to Swift code not observing the mutation
of the instance pointed to by `this` and using the original value of such
instance for the rest of the Swift code execution.

C++ permits the mutation of `mutable` fields in constant member functions.
Constant member functions in structures or classes with such fields
still become `nonmutating` methods in Swift. Swift doesn't know which
constant functions mutate the object, and which don't, so for the sake
of better API usability Swift still assumes that such functions do not
mutate the object. You should avoid calling constant member functions
that mutate `mutable` fields from Swift, unless they're explicitly annotated with a `SWIFT_MUTATING` macro.

The `SWIFT_MUTATING` macro allows you to explicitly annotate constant member
functions that do mutate the object. Such functions then become `mutating`
methods in Swift.

#### Member Functions Returning References Are Unsafe by Default

Member functions that return references, pointers, or
certain structures/classes that contain references or pointers
often return a reference that points inside of `this`, the object
used to call the function.
Such member functions are considered to be unsafe in Swift,
as the returned reference
is not associated with the owning object which can get
destroyed while the reference is still in use. Swift automatically
renames such member functions in order to emphasize their unsafety.
Their Swift name is prefixed
with two underscores and suffixed with `Unsafe`. For example, the following
member function becomes the `__getRootTreeUnsafe` method in Swift:

```c++
class Forest {
public:
  const Tree &getRootTree() const { return rootTree; }

  ...
private:
  Tree rootTree;
};
```

The set of rules that determine which functions are unsafe, and the
recommended guidelines for calling such methods safely from Swift
are documented in an upcoming section that describes how to
[safely work with C++ references and view types in Swift](#working-with-c-references-and-view-types-in-swift).

#### Overloaded Member Functions

C++ allows member functions to be overloaded based on their `const` qualifier.
For example, the `Forest` class can have two `getRootTree` members, that differ
only in their constness and their return type:

```c++
class Forest {
public:
  const Tree &getRootTree() const { return rootTree; }
  Tree &getRootTree() { return rootTree; }

  ...
private:
  Tree rootTree;
};
```

The two `getRootTree` member functions become methods in Swift. Swift
renames the `mutating` method to avoid having two ambiguous methods with
the same name and arguments, when it finds that the type already has a
`nonmutating` method with the same Swift name. The rename appends
the `Mutating` suffix to the name of the `mutating` method.
This rename is done before the safety of the method is taken into account.
In the example shown above,
the two `getRootTree` member functions become
`__getRootTreeUnsafe` and `__getRootTreeMutatingUnsafe` methods in Swift,
because they return a reference that points into the `Forest` object.

#### Virtual Member Functions

Currently virtual member functions are not available in Swift.

#### Static Member Functions

Static C++ member functions become `static` Swift methods.

### Accessing Inherited Members from Swift

A C++ class or structure becomes a standalone type in Swift. Its
relationship with base C++ classes is not preserved in Swift.
Swift tries its best to provide access to the members inherited from base
classes of a C++ type. The public member functions and data members from a
C++ base class become methods and properties in Swift, as if they
were defined in the specific class itself.

For example, the following two C++ classes become two distinct Swift structures:

```c++
class Plant {
public:
  void water(float amount) { moisture += amount; }
private:
  float moisture = 0.0;
};

class Fern: public Plant {
public:
  void trim();
};
```

The `Fern` Swift structure gets an additional method named `water`, that
calls member function `water` in the `Plant` C++ class:

```swift
struct Plant {
  mutating func water(_ amount: Float)
}

struct Fern {
  init()
  mutating func water(_ amount: Float) // Calls `Plant::water`
  mutating func trim()
}
```

The exact rules that determine when members from inherited base types
are introduced to the Swift type that represents the C++ structure or class
are not yet finalized in Swift 5.9. The following
[GitHub issue](https://github.com/swiftlang/swift/issues/66323)
tracks their finalization in Swift 5.9.

### Using C++ Enumerations

Scoped C++ enumerations become Swift enumerations with raw values.
All of their cases get mapped to Swift cases as well. For example,
the following C++ enumeration is available in Swift:

```c++
enum class TreeKind {
  Oak,
  Redwood,
  Willow
};
```

It is represented in Swift as the following enumeration:

```swift
enum TreeKind : Int32 {
  case Oak = 0
  case Redwood = 1
  case Willow = 2
}
```

It can be used just like any other `enum` in Swift:

```swift
func isConiferous(treeKind: TreeKind) -> Bool {
  switch treeKind {
    case .Redwood: return true
    default: return false
  }
}
```

Unscoped C++ enumerations become Swift structures. For example, the following
unscoped `enum` becomes a Swift structure:

```c++
enum MushroomKind {
  Oyster,
  Portobello,
  Button
}
```

The cases of unscoped C++ enumerations become
variables outside of the Swift structure:

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
For instance, the following `using` declaration becomes a `CustomString`
type in Swift:

```c++
using CustomString = std::string;
```

### Using Class Templates

An instantiated specialization of a class or structure template is mapped
to a distinct type in Swift. For example, the following uninstantiated
C++ class template is not available in Swift by itself:

```c++
template<class T, class U>
class Fraction {
public:
  T numerator;
  U denominator;

  Fraction(const T &, const U &);
};
```

However,
an instantiated specialization of a class template is available in Swift.
it is treated like
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

A function that returns a specialization like `Fraction<int, float>`
is available in Swift:

```c++
Fraction<int, float> getMagicNumber();
```

Such function can be called from Swift like any other Swift function:

```
let magicNum = getMagicNumber()
print(magicNum.numerator, magicNum.denominator)
```

A C++ type alias can refer to a specific specialization of a
class template. For example, in order to construct
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

## Customizing How C++ Maps to Swift

The defaults that determine how C++ types and functions map to Swift can be
changed by annotating a specific C++
function or type with one of the provided customization macros. For example,
you can choose to provide a different Swift name for a specific C++
function using the `SWIFT_NAME` macro.

The `<swift/bridging>` header defines the customization macros that can be used
to annotate C++ functions and types. This header ships with the
Swift toolchain.

> On Apple and Linux platforms both the system's C++ compiler and
> the Swift compiler should find this header automatically.
> On other platforms, like Windows, you might
> need to add additional header search path flags (`-I`) to your C++ and Swift
> compiler invocations to make sure that this header is found.

This section describes just two of the customization macros from
the `<swift/bridging>` header. The other customization macros and their
behavior are documented in the subsequent sections in this document.
The [complete list](#list-of-customization-macros-in-swiftbridging) of all the
customization macros is provided in the appendix.

### Renaming C++ APIs in Swift

The `SWIFT_NAME` macro provides a different name for C++
types and functions in Swift. C++ types can be renamed by specifying the Swift
type name inside of the `SWIFT_NAME` macro. For example,
the following C++ class gets renamed to `CxxLibraryError` structure in Swift:

```c++
class Error {
  ...
} SWIFT_NAME("CxxLibraryError");
```

When renaming a function, you need to specify the Swift function name
(including argument labels) inside of the `SWIFT_NAME` macro.
For example, the following C++ function gets renamed to `send` in Swift:

```c++
#include <swift/bridging>

void sendCopy(const std::string &) SWIFT_NAME(send(_:));
```

You must use the new name when calling such function from Swift:

```swift
send("Hello, this is Swift!")
```

### Mapping Getters and Setters to Computed Properties

The `SWIFT_COMPUTED_PROPERTY` macro maps a C++ getter and setter member
function to a computed property in Swift. For example, the following getter
and setter pair is mapped to a single `treeKind` computed property in Swift:

```c++
#include <swift/bridging>

class Tree {
public:
  TreeKind getKind() const SWIFT_COMPUTED_PROPERTY;
  void setKind(TreeKind kind) SWIFT_COMPUTED_PROPERTY;

  ...
};
```

Such property can be mutated in Swift as it has a setter:

```swift
func makeNotAConiferousTree(tree: inout Tree) {
  tree.kind = tree.kind == .Redwood ? .Oak : tree.kind
}
```

Both the getter and setter need to operate on the same underlying C++ type for
this transformation to be successful in Swift.

It's possible to map just the getter to a computed property, a setter is not
required for this transformation to work.

## Extending C++ Types in Swift

Swift [extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions)
can add new functionality to C++ types in Swift. They can also
conform an existing C++ type to a Swift protocol.

> Extensions can add new functionality to a C++ type, but they can't override
> existing functionality of a C++ type.

### Conforming C++ Type to Swift Protocol

Swift protocol conformance can be added to a C++ type retroactively
(after the type has been defined). Such conformance enables the
following use cases in Swift:

- Generic Swift functions and types
[constrained by protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics#Type-Constraints)
 can work with a conforming C++ value.
- A [protocol type](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols#Protocols-as-Types)
 can represent a conforming C++ value.

For example, a Swift extension can add
`Hashable` conformance to the C++ class `Tree`:

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

### Conforming Class Template to Swift Protocol

A Swift extension can add protocol conformance to a specific class template
specialization in Swift. For example, instantiated
specializations of the following class template are available in Swift:

```c++
template<class T>
class SerializedValue {
public:
  T deserialize() const;

  ...
};

using SerializedInt = SerializedValue<int>;
using SerializedFloat = SerializedValue<float>;

SerializedInt getSerializedInt();
SerializedFloat getSerializedFloat();
```

Such template specializations can conform to a protocol using a Swift
`extension`:

```swift
// Swift module 'Serialization'
protocol Deserializable {
  associatedtype ValueType

  func deserialize() -> ValueType
}

// `SerializedInt` specialization now conforms to `Deserializable`
extension SerializedInt: Deserializable {}
```

In the example above `SerializedInt` conforms to the `Deserializable` protocol.
However, other specializations of the class template, like `SerializedFloat`,
do not conform to `Deserializable`.

The `SWIFT_CONFORMS_TO_PROTOCOL` customization macro from the `<swift/bridging>`
header can be used to conform all specializations of a class template to
a Swift protocol automatically. For example, the
definition of the `SerializedValue` class template can be annotated with
`SWIFT_CONFORMS_TO_PROTOCOL`:

```c++
template<class T>
class SerializedValue {
public:
  using ValueType = T;
  T deserialize() const;

  ...
} SWIFT_CONFORMS_TO_PROTOCOL(Serialization.Deserializable);
```

The `SWIFT_CONFORMS_TO_PROTOCOL` annotation makes all specializations,
like `SerializedInt` and `SerializedFloat`,
conform to `Deserializable` automatically in Swift. This makes it possible
to add functionality to all specializations of a class
template in Swift, by using a protocol extension:

```swift
extension Deserializable {
  // All specializations of the `SerializedValue` template now have
  // `deserializedDescription` property in Swift.
  var deserializedDescription: String {
    "serialized value \(deserialize().description)"
  }
}
```

This also lets you use any
specialization in constrained generic code without any additional explicit
conformances:

```swift
func printDeserialized<T: Deserializable>(_ item: T) {
  print("obtained: \(item.deserializedDescription)")
}

// Both `SerializedInt` and `SerializedFloat` specializations automatically
// conform to `Deserializable`
printDeserialized(getSerializedInt())
printDeserialized(getSerializedFloat())
```

## Working with C++ Containers

C++ container types, like the [`std::vector`](https://en.cppreference.com/w/cpp/container/vector) class
template,
typically provide iterator-based APIs for users in C++.
Using a C++ iterator is [unsafe](#do-not-use-c-iterators-in-swift)
in Swift, as such use is not
associated with its owning container which can get destroyed
while the iterator is still in use.
Instead of relying on C++ iterators, Swift automatically
conforms some C++ container types to protocols that:

- Allow safe access to the underlying container in Swift using standard Swift
  APIs.
- Provide a way to convert a C++ container to a Swift collection type.

These protocols and their conformance rules are described below.
The recommended approach for using C++ containers that conform to these
protocols is summarized in a
[follow-up section](#recommended-approach-for-using-c-containers).

### Some C++ Containers Are Swift Collections

Swift conforms C++ containers that provide random access to their
elements, like `std::vector`, to Swift's `RandomAccessCollection` protocol
automatically. For example, the `std::vector` container returned by this
function is conformed to the `RandomAccessCollection` protocol
automatically by Swift:

```c++
std::vector<Tree> getEnchantedTrees();
```

The conformance to `RandomAccessCollection` makes it possible to traverse
through the container's elements safely in Swift, using familiar control
flow statements like the `for-in` loop. Collection methods like `map`
and `filter` are also available:

```swift
let trees = getEnchantedTrees()

// Traverse through the elements of a C++ vector.
for tree in trees {
  print(tree.kind)
}

// Filter the C++ vector and make a Swift Array that contains only
// the oak trees.
let oakTrees = getEnchantedTrees().filter { $0.kind == .Oak }
```

Swift’s count property returns the number of elements in such collection.
Swift’s subscript operator can be used to access a specific element in the collection as well.
This makes it possible to mutate individual elements in the C++ container:

```swift
var trees = getEnchantedTrees()
for i in 0..<trees.count {
  trees[i].kind = .Oak
}
```

A C++ container that conforms to `RandomAccessCollection` can be easily
converted into a Swift collection type, like `Array`:

```swift
let treesArray = Array<Tree>(getEnchantedTrees())
```

Swift **does not** convert C++ container types to Swift collection types
automatically. Any conversion from a C++ container type, like `std::vector`,
to a Swift collection type, like `Array`, is explicit in Swift.

#### Performance Constraints of Automatic Collection Conformance

Swift currently does not provide explicit performance guarantees when
using C++ containers that conform to `RandomAccessCollection`. Swift
will most likely make a deep copy of the container when:

- The container is used in a `for-in` loop.
- The container is used with methods like `filter` and `reduce` whose
  implementation comes from Swift's `Sequence` protocol.

This constraint is tracked on the [status page](status#performance-constraints).
Several strategies for working around this constraint are
[presented below](#using-c-containers-in-performance-sensitive-swift-code).

#### Conformance Rules for Random Access C++ Collections

The following two conditions must be satisfied in order for a C++ container
type to automatically conform to `RandomAccessCollection` in Swift:

- The C++ container type must have `begin` and `end` member functions. Both
  functions must be constant and must return the same iterator type.
- The C++ iterator type must satisfy the
  [`RandomAccessIterator`]( https://en.cppreference.com/w/cpp/named_req/RandomAccessIterator)
  C++ requirement. It must be possible to advance it using `operator +=` in C++
  and also to subscript into it using `operator []` in C++.
- The C++ iterator type must be comparable using `operator ==`.

When these conditions are satisfied, Swift conforms the Swift structure
that represents the underlying C++ container type to
the `CxxRandomAccessCollection` protocol, which adds the
`RandomAccessCollection` conformance.

### C++ Containers Can Be Converted to Swift Collections

The sequential C++ container types that do not provide random access to their
elements are automatically
conformed to the `CxxConvertibleToCollection` protocol in Swift.
For example, the `std::set` container returned by this
function is conformed to the `CxxConvertibleToCollection` protocol
automatically by Swift:

```c++
std::set<int> getWinningNumers();
```

The conformance to `CxxConvertibleToCollection` makes it possible
to easily convert a C++ container to a Swift collection type, like
`Array` or `Set`. For example, the `std::set` returned
by `getWinningNumers` can be converted to both a Swift `Array` and
a Swift `Set`:

```swift
let winners = getWinningNumers()
for number in Array(winners) {
  print(number)
}
let setOfWinners = Set(winners)
```

C++ containers that automatically conform to the `CxxRandomAccessCollection`
protocol also automatically conform to the `CxxConvertibleToCollection`
protocol.

#### Conformance Rules for `CxxConvertibleToCollection` Protocol

The following two conditions must be satisfied
in order for a C++ container type to automatically conform to
`CxxConvertibleToCollection` in Swift:

- The C++ container type must have `begin` and `end` member functions.
  Both functions must be constant and must return the same iterator type.
- The C++ iterator type must satisfy the
  [`InputIterator`](https://en.cppreference.com/w/cpp/named_req/InputIterator) C++ requirement.
  It must be possible to increment it using `operator ++` in C++ and also to
  dereference it using `operator *` in C++.
- The C++ iterator type must be comparable using `operator ==`.

### Using Associative Container C++ Types in Swift

Associative C++ container types, like `std::map`, provide efficient access
to stored elements using a lookup key.
The `find` member function that performs such lookup is unsafe in Swift. Instead
of using `find`, Swift automatically conforms associative containers from the
C++ standard library to the `CxxDictionary` protocol. Such conformance lets
you use the subscript operator when working with an associative C++
container in Swift. For example, the `std::unordered_map` returned by this
function is conformed to the `CxxDictionary` protocol automatically by Swift:

```c++
std::unordered_map<std::string, std::string>
getAirportCodeToCityMappings();
```

The returned `std::unordered_map` value can be used like a dictionary in Swift,
with the subscript returning
a value stored in the container, or `nil` if such value doesn't exist:

```swift
let mapping = getAirportCodeToCityMappings();
if let dubCity = mapping["DUB"] {
   print(dubCity)
}
```

The provided subscript calls the container's `find` method safely inside of its
implementation.

Associative C++ containers can be converted to a Swift sequential collection
type like `Array`, when you need to manually traverse through their elements
in Swift.

Swift does not conform custom associative C++ containers
to `CxxDictionary` automatically. A manually written Swift `extension`
can be used to add the `CxxDictionary` conformance
retroactively for a custom associative container type.

### Recommended Approach for Using C++ Containers

The following summary outlines the current recommended approach for how
to use C++ containers in Swift:

- Use `for-in` loop to traverse through a C++ container that conforms to `RandomAccessCollection`.
- Use collection APIs like `map` or `filter` when working with a C++
  container that conforms to `RandomAccessCollection`.
- Use the subscript operator to access a specific element in a C++ container
  that conforms to `RandomAccessCollection`
- Convert other sequential containers to Swift collections if you'd
  like to traverse through their elements, or if you'd like to
  use collection APIs like `map` or `filter`.
- Use the subscript operator from the `CxxDictionary` protocol when looking
  up values in an associative C++ container.

#### Using C++ Containers in Performance Sensitive Swift Code

Swift's current `for-in` loop makes a deep copy of the C++
container when traversing through its elements. You can avoid
this copy by using the `forEach` method provided by the `CxxConvertibleToCollection`
protocol. For example, the `std::vector<Tree>` container returned by
`getEnchantedTrees` can be traversed using the `forEach` method in Swift:

```swift
let trees = getEnchantedTrees()
// Swift should not copy the `trees` std::vector here.
trees.forEach { tree in
  print(tree.kind)
}
```

### Best Practices for Working with C++ Containers in Swift

#### Do Not Use C++ Iterators in Swift

As outlined at the start of this section, using C++ iterators is unsafe in
Swift. It's easy to misuse C++ iterators, for instance:

- it's easy to use an iterator after the C++ container is destroyed.
- it's easy to dereference an iterator that has advanced past the container's
  last element.

You should use protocols like `CxxRandomAccessCollection`,
`CxxConvertibleToCollection` and `CxxDictionary` when working with C++ containers
instead of relying on C++ iterator APIs.

Member functions inside of C++ container types that return C++ iterators are
marked unsafe in Swift, just like
[member functions that return references](#member-functions-returning-references-are-unsafe-by-default).
Other C++ APIs, like top-level functions that take or return iterators could
still be directly available in Swift.
You should avoid using such functions in Swift.

#### Borrow C++ Containers When Calling Swift Functions

C++ container types become value types in Swift. This means that
Swift calls the container's copy constructor, which in turn copies all the
elements, every time a copy is made in Swift. For example,
Swift will copy all of the elements from a `std::vector<int>` represented
by the `CxxVectorOfInt` type into a new `vector` whenever it's passed into
this Swift function:

```swift
func takesVectorType(_ : CxxVectorOfInt) {
  ...
}

let vector = createCxxVectorOfInt()
takesVectorType(vector) // 'vector' is copied here.
```

Swift's upcoming
[parameter ownership modifiers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0377-parameter-ownership-modifiers.md),
which will be provided in an upcoming Swift release, will let you avoid copies
when passing immutable values to functions. Mutable values can be passed
by `inout` to a Swift function, which lets you avoid a deep copy of
the C++ container:

```swift
func mutatesVectorType(_ : inout CxxVectorOfInt) {
  ...
}

var vector = createCxxVectorOfInt()
takesVectorType(&vector) // 'vector' is not copied!
```

## Mapping C++ Types to Swift Reference Types

The Swift compiler allows you to annotate some C++ types and import them as reference types (or `class` types) in Swift. Whether a C++ type should be imported as a reference type is a complex question, and there are two primary criteria that go into answering it.

The first criterion is whether object identity is part of the "value" of the type. Is comparing the address of two objects just asking whether they're stored at the same location, or is it deciding whether they represent the "same object" in a more significant sense?

The second criterion whether objects of the C++ class are always passed around by reference.  Are objects predominantly passed around using a pointer or reference type, such as a raw pointer (`*`), C++ reference (`&` or `&&`), or a smart pointer (like `std::unique_ptr` or `std::shared_ptr`)?  When passed by raw pointer or reference, is there an expectation that that memory is stable and will continue to stay valid, or are receivers expected to copy the object if they need to keep the value alive independently?  If objects are generally allocated and remain at a stable address, even if that address is not semantically part of the "value" of an object, the class may be idiomatically a reference type. This will sometimes be a judgment call for the programmer.

The first and most important criteria is often not possible for a compiler to answer automatically by just looking at the code. If you want the Swift compiler to map a C++ type to a Swift reference type, you must annotate the C++ type with one of the following
customization macros from the `<swift/bridging>` header:

- [`SWIFT_IMMORTAL_REFERENCE`](#immortal-reference-types)
- [`SWIFT_SHARED_REFERENCE`](#shared-reference-types)
- [`SWIFT_UNSAFE_REFERENCE`](#unsafe-reference-types)

### Immortal Reference Types

**Immortal** reference types are not designed to be managed individually by the program. Objects of these types are allocated and then intentionally "leaked" without tracking their uses. Sometimes these objects are not truly immortal: for example, they may be arena-allocated, with an expectation that they will only be referenced from other objects within the arena. Nonetheless, they aren't expected to be individually managed.

The only reasonable thing Swift can do with immortal reference types is import them as unmanaged classes.  This is perfectly fine when objects are truly immortal.  If the object is arena-allocated, this is unsafe, but it's essentially an unavoidable level of unsafety given the choices of the C++ API.

To specify that a C++ type is an immortal reference type, apply the `SWIFT_IMMORTAL_REFERENCE` attribute. Here's an example of `SWIFT_IMMORTAL_REFERENCE` being applied to the C++ type `LoggerSingleton`:
```c++
class LoggerSingleton {
public:
    LoggerSingleton(const LoggerSingleton &) = delete; // non-copyable

    static LoggerSingleton &getInstance();
    void log(int x);
} SWIFT_IMMORTAL_REFERENCE;
```

Now that `LoggerSingleton` is imported as a reference type in Swift, the programmer will be able to use it in the following manner:
```swift
let logger = LoggerSingleton.getInstance()
logger.log(123)
```

### Shared Reference Types

**Shared** reference types are reference-counted types that are passed around by
pointer or reference in C++. They typically use either:

- custom retain and release operations that increment and decrement
  a reference count stored intrusively in the object.
- or, a non-intrusive shared pointer type like `std::shared_ptr`,
  that can store the reference count outside of the object.

Currently Swift can map C++ classes or structures that use custom retain
and release operations together with a reference count stored intrusively in the object
to a Swift reference type (that behaves like a Swift `class`). Other types
that rely on `std::shared_ptr` for reference counting can still be used
as value types in Swift.

To specify that a C++ type is a shared reference type, use the `SWIFT_SHARED_REFERENCE` customization macro. This macro expects two arguments: a retain and release function. These functions must be global functions that take exactly one argument and return void. The argument must be a pointer to the C++ type (not a base type). Swift will call these custom retain and release functions where it would otherwise retain and release Swift classes. Here's an example of `SWIFT_SHARED_REFERENCE` being applied to the C++ type `SharedObject`:

```c++
class SharedObject : IntrusiveReferenceCounted<SharedObject> {
public:
    SharedObject(const SharedObject &) = delete; // non-copyable

    static SharedObject* create();
    void doSomething();
} SWIFT_SHARED_REFERENCE(retainSharedObject, releaseSharedObject);

void retainSharedObject(SharedObject *);
void releaseSharedObject(SharedObject *);
```

Now that `SharedObject` is imported as a reference type in Swift, the programmer will be able to use it in the following manner:
```swift
let object = SharedObject.create()
object.doSomething()
// `object` will be released here.
```

#### Exposing C++ Shared Reference Types back from Swift

C++ can call into Swift APIs that take or return C++ Shared Reference Types. Objects of these types are always created on the C++ side,
but their references can be passed back and forth between Swift and C++. This section explains the conventions of incrementing and decrementing
the reference counts when passing such references across the language boundaries. Consider the following Swift APIs:

```swift
public func takeSharedObject(_ x : SharedObject) { ... }

public func returnSharedObject() -> SharedObject { ... }
```

In case of the `takeSharedObject` function, the compiler will automatically insert calls to retain and release for `x` as necessary to satisfy the semantics of
owned/guaranteed calling conventions. The C++ callers must guarantee that `x` is alive for the duration of the call.
Note that functions returning a shared reference type such as `returnSharedObject` transfer the ownership to the caller.
The C++ caller of this function is responsible for releasing the object.

### Unsafe Reference Types

The `SWIFT_UNSAFE_REFERENCE` annotation macro has the same effect as `SWIFT_IMMORTAL_REFERENCE`
annotation macro. However, it communicates different semantics: the type is intended to be used unsafely, rather than living for the duration of the program.

### Unique Reference Types

Unique reference types, such as types passed around by `std::unique_ptr` are
not yet supported by Swift.

## Using C++ Standard Library from Swift

This section describes how to import the C++ standard library, and how
to use the types provided by it in Swift.

### Importing C++ Standard Library

Swift can import the platform's C++ standard library, by importing
the `CxxStdlib` module.
The `std` namespace becomes `std` enumeration in Swift. The functions and types
inside of the `std` namespace become nested types and static functions in
the `std` Swift enumeration.

The status page contains a
[list of the supported C++ standard libraries](status#c-standard-library-support),
that describes which C++ standard libraries are supported on the
platforms supported by Swift.

### Using `std::string`

The `std::string` C++ type becomes a structure in Swift. It conforms to
the `ExpressibleByStringLiteral` protocol, so it can be initialized directly
using a string literal in Swift:

```swift
import CxxStdlib

let s: std.string = "Hello C++ world!"
```

Swift `String` can be easily converted to a C++ `std::string`:

```swift
let swiftString = "This is " + "a Swift string"
let cxxString = std.string(swiftString)
```

The same conversion can be made in the opposite direction, going from a C++
`std::string` to a Swift `String`:

```swift
let cxxString = std.string("This is a C++ string")
let swiftString = String(cxxString)
```

Swift does not convert C++ `std::string` type to Swift's `String` type
automatically.

## Working with C++ References and View Types in Swift

As outlined
[earlier](#member-functions-returning-references-are-unsafe-by-default),
member functions that return references, pointers, or certain structures/classes that
contain references or pointers are considered to be unsafe in Swift.
Such member functions often return references or view
types that point back inside of the `this` object, or into memory owned by the
`this` object. In such cases, the
lifetime of the object the returned reference or view points to is said to be **dependent**
on the lifetime
of its owning object (the `this` object passed to the member function).
C++ currently doesn't specify which member functions
return dependent references or views, and which member functions return
completely independent references or views.
Therefore
Swift assumes that any reference or any view
type returned by a member function is dependent on the `this` object.

Dependent references and view types are unsafe in Swift, as the
reference or view is not associated with its owning object. Thus the owning object
can get destroyed while the reference is still in use. Because of this unsafety,
and the assumption that all such references and views are dependent, Swift
renames such member functions to emphasize their unsafety and to discourage
their use in Swift.

This section describes the exact rules used by Swift to determine which
member functions return dependent references or view types, and suggests
approaches for how to write Swift wrappers that call such member functions
safely from Swift. It also introduces two new customization macros that
can be applied to C++ code to instruct Swift to treat some member functions
it thinks are unsafe as safe instead.

### C++ Types Considered to Be References or View Types by Swift

Swift assumes that a C++ member function that returns one of the following
types is unsafe in Swift:

- C++ reference
- Raw pointer
- C++ class or structure without a user-defined copy constructor,
  that contains a field whose type is in this list, recursively.

For example, the following two C++ structures are view types in Swift's eyes:

```c++
struct PairIntRefs {
  int &firstValue;
  const int &secondImmutableValue;

  PairIntRefs(int &, const int &);
};

// Also a view type, since its `refs` field is a view type.
struct BagOfValues {
  PairIntRefs refs;
  int x;

  BagOfValues(PairIntRefs, int);
};
```

The rules outlined above define a **heuristic** that Swift uses to detect
member functions that likely return a dependent reference or view type.
This heuristic doesn't guarantee that all C++ member functions that return
dependent references or views will be detected by Swift, and therefore
some member functions that return dependent references or views could
appear to be safe in Swift.

### Safely Accessing References with Dependent Lifetime

The recommended approach to calling member functions that return a reference
or a view type with a dependent lifetime is to wrap them in a Swift API
that returns a copy of the referenced object.

For example, consider the `Forest` class whose `getRootTree` members
return references:

```c++
class Forest {
public:
  const Tree &getRootTree() const { return rootTree; }
  Tree &getRootTree() { return rootTree; }

  ...
private:
  Tree rootTree;
};
```

As outlined [earlier](#overloaded-member-functions), both of these member
functions become `__getRootTreeUnsafe` and `__getRootTreeMutatingUnsafe` methods
in Swift. Such methods are not meant be called directly in your code. Instead,
you should write a wrapper that achieves the desired objective without
exposing the dependent reference, that can then be used throughout
your Swift codebase. For example, lets say you want to inspect the underlying
`rootTree` value in Swift. You can add a wrapper that allows your Swift codebase
to inspect the `rootTree` by extending the `Forest` class in Swift
and adding a `rootTree` computed property that returns a `Tree` value:

```swift
import forestLib

extension Forest {
  private borrowing func getRootTreeCopy() -> Tree {
    return __getRootTreeUnsafe().pointee
  }

  var rootTree: Tree {
    getRootTreeCopy()
  }
}
```

The `borrowing` ownership modifier used above is a
[new addition](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0377-parameter-ownership-modifiers.md)
in Swift 5.9. Some development versions of Swift 5.9 might not allow you to
use `borrowing` for copyable C++ types like `Forest`. In such cases, prior
to the release of Swift 5.9, you can
use a `mutating` method call chain instead to safely copy the `Tree` returned
by `getRootTree` instead:

```swift
import forestLib

extension Forest {
  private mutating func getRootTreeCopy() -> Tree {
    return __getRootTreeUnsafeMutating().pointee
  }

  var rootTree: Tree {
    var mutCopy = self
    return mutCopy.getRootTreeCopy()
  }
}
```

### Using Methods That Return References and Views with Independent Lifetime

Some C++ member functions that return a reference or a view type might
return a reference whose lifetime is independent from the `this` object. Swift
will still assume that such member functions are unsafe. To change that, you can
annotate your C++ code to instruct Swift to either:
- Assume that a particular C++ member function returns a completely independent
  reference or view. Such member function is then assumed to be safe.
- Assume that a particular C++ class or structure is **self contained**. All
  member functions that return such self contained types are then assumed to be safe.

#### Annotating Methods Returning Independent References or Views

The `SWIFT_RETURNS_INDEPENDENT_VALUE` customization macro from the
`<swift/bridging>` header can be added to a C++ member functions, to let
Swift know that it doesn't return a dependent reference or a
dependent view. Such member function is then assumed to be safe in Swift.

For example, the `getName` member function in the `NatureLibrary` C++ class
is a great candidate for `SWIFT_RETURNS_INDEPENDENT_VALUE`, as its definition
clearly shows that it returns a pointer to a constant static string literal, that's not
stored within the `NatureLibrary` object itself:

```c++
class NatureLibrary {
public:
  const char *getName() const SWIFT_RETURNS_INDEPENDENT_VALUE {
    return "NatureLibrary";
  }
};
```

#### Annotating C++ Structures or Classes as Self Contained

The `SWIFT_SELF_CONTAINED` customization macro from the
`<swift/bridging>` header can be added to a C++ structure or class, to let
Swift know that it's not a view type.  All member functions that return such self contained type are then assumed to be safe in Swift.

## Accessing Swift APIs from C++

Swift compiler can generate a header file that contains C++ types and
functions that represent the Swift types and functions defined in a
Swift module.
Such header file can then be included from C++ code, letting
you use Swift types and call Swift functions from C++.

Swift considers all public types and functions defined in a
Swift module as eligible to be exposed to C++ when generating the
generated header file.
However, not all public types and functions can be represented in C++ yet.
The exact rules that determine which Swift types and functions currently get
exposed to C++ in the generated header are described in the
[following status page section](status#supported-swift-apis).

## Using Swift Types and Functions from C++

A wide array of Swift types and functions gets exposed to C++.
This section goes over the fundamentals of how the exposed Swift types and
functions can be used from C++.

### Calling Swift Functions

Top-level Swift functions that are exposed to C++ become `inline` C++ functions
in the generated header. The C++ functions are placed in the C++ `namespace`
that represents the Swift module. The body of such C++ function calls the native
Swift function directly from C++, without using any kind of indirection.

For example, the following Swift function gets exposed to C++ in the generated
 header:

```swift
// Swift module 'Greeter'

public func printWelcomeMessage(_ name: String) {
  print("Welcome \(name)")
}
```

C++ code can call `printWelcomeMessage` after including the generated
header:

```c++
#include <Greeter-Swift.h>

void cPlusPlusCallsSwift() {
  Greeter::printWelcomeMessage("Theo");
}
```

### Using Swift Structures In C++

Swift structures that are exposed to C++ become final C++ classes in the
generated header. Top-level structures are placed in the C++ `namespace`
that represents the Swift module. The exposed initializers, methods and
properties defined inside of the Swift structure become members of the
C++ class.

The C++ class that represents a Swift structure is copyable. Its copy
constructor copies the underlying Swift value into a new value. The destructor
of the C++ class destroys the underlying Swift value.

Currently C++ classes that represent Swift structures cannot be moved
in C++ using `std::move`.

#### Creating a Swift Structure in C++

The exposed initializers of a Swift structure become static `init` member
functions in the C++ class. The C++ code can then call one of such functions
to create an instance of the structure in C++.

For example, Swift exposes the `MountainPeak` structure shown below in the
generated header:

```swift
// Swift module 'Landscape'

public struct MountainPeak {
  let name: String
  let height: Float

  public init(name: String, height: Float) {
    self.name = name
    self.height = height
  }
}
```

The `init` static member function from the `MountainPeak` C++ class can
be used to create a `MountainPeak` instance in C++:

```c++
#include <Landscape-Swift.h>
using namespace Landscape;

void createMountainRange() {
  auto tallestMountain = MountainPeak::init("Everest", 8848.9);
}
```

### Using Swift Classes in C++

Swift classes that are exposed to C++ become C++ classes in the
generated header. Top-level classes are placed in the C++ `namespace`
that represents the Swift module. The exposed initializers, methods and
properties defined inside of the Swift class become members of the
C++ class.

The C++ class that represents a Swift class is copyable and movable.
Its copy and move constructors, and its destructor obey the rules of Swift's
[automatic reference
counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting)
(ARC) model that allows the program to release the Swift class instance when it's no
longer referenced.

For example, Swift exposes the `MountainRange` class shown below in the
generated header:

```swift
// Swift module 'Landscape'

public class MountainRange {
  let peaks: [MountainPeak]

  public init(peaks: [MountainPeak]) {
    self.peaks = peaks
  }
}

public func createSierras() -> MountainRange {
  ...
}

public func render(mountainRange: MountainRange) {
  ...
}
```

A `MountainRange` instance can then be passed around in C++ safely. ARC
will release it once it's no longer in use:

```c++
#include <Landscape-Swift.h>
using namespace Landscape;

void renderSierras() {
  MountainRange range = createSierras();
  render(range);
  // The `MountainRange` instance that `range` points to is freed by ARC when
  // this C++ function returns.
}
```

The inheritance hierarchy of Swift classes is represented using a C++
inheritance hierarchy formed by the C++ classes that represent the
exposed Swift classes.

### Using Swift Enumerations in C++

Swift enumerations that are exposed to C++ become C++ classes in the
generated header. Top-level enumerations are placed in the C++ `namespace`
that represents the Swift module. The exposed initializers, methods and
properties defined inside of the Swift enumeration become members of the
C++ class.

The C++ class that represents a Swift enumeration is copyable. Its copy
constructor copies the underlying Swift value into a new value. The destructor
of the C++ class destroys the underlying Swift value. Currently C++
classes that represent Swift enumerations cannot be moved in C++ using
`std::move`.

The enumeration cases become `static inline` constant C++ data members in the
C++ class that represents the enum. These members let you:
- Construct a Swift enumeration that is set to the specific case value in C++.
- Switch over a Swift enumeration using a `switch` statement in C++.

For example, the following Swift enumeration is exposed in the generated
header:

```swift
// Swift module 'Landscape'

public enum VolcanoStatus {
  case dormant
  case active
}
```

A `VolcanoStatus` instance can be constructed from C++, by using
`operator()` on one of its members that represents an enumeration case.
You can also reference such member in the `case` condition inside of a
`switch` statement in C++:

```c++
#include <Landscape-Swift.h>
using namespace Landscape;

VolcanoStatus invertVolcanoStatus(VolcanoStatus status) {
  switch (status) {
  case VolcanoStatus::dormant:
    return VolcanoStatus::active(); // Returns `VolcanoStatus.active` case.
  case VolcanoStatus::active:
    return VolcanoStatus::dormant(); // Returns `VolcanoStatus.dormant` case.
  }
}
```

The `unknownDefault` C++ member allows you to write an exhaustive C++ `switch`
for a resilient Swift enumeration, as such enumeration might get more cases in
the future that the C++ code does not know about.

#### Using Enumerations with Associated Values

Swift allows an enumeration to associate a set of values with a particular
case. Enumerations whose cases have one associated
value, or no associated values, get exposed to C++. They become C++ classes
in the
generated header. The interface of such C++ class closely resembles the
interface of a class generated for a Swift enumeration without associated
values. Such classes also contain additional getter member functions, that let
you extract the associated value stored in the enumeration once you determine
which case the enumeration is set to.

For example, the following Swift enumeration with associated values is
exposed in the generated header:

```swift
// Swift module 'Landscape'

public enum LandmarkIdentifier {
  case name(String)
  case id(Int)
}
```

The value associated with one of the cases of `LandmarkIdentifier` can be
extracted by calling the appropriate getter method in C++:

```c++
#include <Landscape-Swift.h>
#include <iostream>
using namespace Landscape;

void printLandmarkIdentifier(LandmarkIdentifier identifier) {
  switch (status) {
  case LandmarkIdentifier::name:
    std::cout << (std::string)identifier.getName();
    break;
  case LandmarkIdentifier::id:
    std::cout << "unnamed landmark #" << identifier.getId();
    break;
  }
}
```

A new `LandmarkIdentifier` instance can be constructed from C++ as well:

```c++
auto newLandmarkId = LandmarkIdentifier::id(1234);
```

### Calling Swift Methods

Swift methods become member functions in C++.

Swift structures and enumerations have `mutating` and `nonmutating` methods.
`Nonmutating` methods become constant member functions in C++.

### Accessing Swift Properties in C++

Both stored and computed properties become getter and setter member functions
in C++. The getter is a constant member function that returns the value of
the Swift property. Mutable properties have a setter in C++ as well. The
setter is a member function and should not be invoked on immutable instances
of a Swift value type.

For example, the following Swift structure is exposed to C++
in the generated header:

```swift
public struct LandmarkLocation {
  public var latitude: Float
  public var longitude: Float
}
```

C++ code can then call `getLatitude` and `getLongitude` member functions
to access the stored property values.

## Using Swift Standard Library Types from C++

Several Swift standard library types can be used in C++. This section
describes how to use the
[supported Swift standard library types](status#supported-swift-standard-library-types)
in C++.

### Using Swift `String` in C++

Swift's `String` type is exposed to C++. It can be initialized directly
using a string literal in C++:

```c++
#include <SwiftLibrary-Swift.h>

void createSwiftString() {
  swift::String test = "Hello Swift world!";
}
```

A C++ `std::string` can be easily converted to a Swift `String`:

```c++
void callSwiftAPI(const std::string &stringValue) {
  SwiftLibrary::functionTakesString(swift::String(stringValue));
}
```

The same conversion can be made in the opposite direction, going from a
Swift `String` to a C++ `std::string`:

```c++
std::string getStringFromSwift() {
  return (std::string)SwiftLibrary::giveMeASwiftString();
}
```

The C++ representation of `String` provides access to a number of
String's methods and properties including:

- `isEmpty`
- `getCount`
- `lowercased` and `uppercased`
- `hasPrefix` and `hasSuffix`
- `append`

Several other methods and properties not listed here are also available.

An Objective-C `NSString *` can be
converted to and from a Swift `String` in Objective-C++ language mode.

### Using Swift `Array` in C++

Swift's `Array` type is exposed to C++. C++ represents it using the
`swift::Array` class template. It must be instantiated with a C++ type that
represents a Swift type. It can also be instantiated with a native C++ type,
when a Swift `Array` of such type is used in Swift and is exposed back to C++
via a public Swift API.

A Swift `Array` can be traversed using a `for` loop in C++. For example,
take the `StringsAndNumbers` Swift module interface:

```swift
// Swift module 'StringsAndNumbers'

public func findTheStrings() -> [String]
public func processRandomNumbers(_ numbers: [Float])
```

A C++ `for` loop can traverse over the `Array` returned
from `findTheStrings`:

```c++
#include <StringsAndNumbers-Swift.h>

void printTheFoundStrings() {
  auto stringsArray = StringsAndNumbers::findTheStrings();
  for (const auto &swiftString: stringsArray) {
    std::cout << (std::string)swiftString << ", ";
  }
}
```

An empty `Array` can be created in C++, mutated, and then passed to Swift.
For example, C++ code can create an `Array` that contains some floating point
numbers and pass it to `processRandomNumbers`:

```c++
#include <StringsAndNumbers-Swift.h>

void processSomeTrulyUniqueRandomNumbers() {
  auto array = swift::Array<float>::init();
  array.append(1.0f);
  array.append(42.0f);
  StringsAndNumbers::processRandomNumbers(array);
}
```

Individual elements in the array can be accessed using `operator []` in C++.
You cannot mutate an array element using `operator []` however. C++ does not
yet support mutating individual elements in a Swift `Array`.

The C++ representation of `Array` provides access to a number of
Array's methods and properties including:

- `getCount`
- `getCapacity`
- `append`
- `insertAt`
- `removeAt`

Several other methods and properties not listed here are also available.

### Using Swift `Optional` in C++

Swift's `Optional` type is exposed to C++. C++ represents it using the
`swift::Optional` class template. It must be instantiated with a C++ type that
represents a Swift type. It can also be instantiated with a native C++ type,
when a Swift `Array` of such type is used in Swift and is exposed back to C++
via a public Swift API.

A value stored in a Swift `Optional` can be extracted using the `get` member
function. For example,
take the `OptionalValues` Swift module interface:

```swift
// Swift module 'OptionalValues'

public func maybeMakeString() -> String?
public func callMeOnThePhoneMaybe(_ number: UInt64?)
```

The C++ `get` member function can be used to extract the `String`
value returned by `maybeMakeString`:

```c++
#include <OptionalValues-Swift.h>

void printAStringOrNone() {
  auto maybeString = OptionalValues::maybeMakeString();
  if (maybeString) {
    std::cout << (std::string)maybeString.get() << "\n";
  } else {
    std::cout << "Got no value from Swift :( \n";
  }
}
```

The `Optional` is implicitly convertible to `bool` in C++. That allows
you to check if it has a value in an `if` condition, like in the example
shown above.

A Swift `Optional` can also be constructed from C++, using the
`some` or `none` case constructor:

```c++
#include <OptionalValues-Swift.h>

void callMeOnThePhone() {
  OptionalValues::callMeOnThePhoneMaybe(
    swift::Optional<uint64_t>::some(1234567890));
}
```

## Appendix

This section contains additional tables and references for certain topics
that are outlined in the documentation above.

### List of Customization Macros in `<swift/bridging>`

| Macro                     | Documentation |
| ------------------------- | ------------- |
| `SWIFT_NAME`                | [Renaming C++ APIs in Swift](#renaming-c-apis-in-swift)       |
| `SWIFT_COMPUTED_PROPERTY`   | [Mapping Getters and Setters to Computed Properties](#mapping-getters-and-setters-to-computed-properties)        |
| `SWIFT_CONFORMS_TO_PROTOCOL` | [Conforming Class Template to Swift Protocol](#conforming-class-template-to-swift-protocol)        |
| `SWIFT_IMMORTAL_REFERENCE` | [Immortal Reference Types](#immortal-reference-types) |
| `SWIFT_SHARED_REFERENCE` | [Shared Reference Types](#shared-reference-types) |
| `SWIFT_UNSAFE_REFERENCE` | [Unsafe Reference Types](#unsafe-reference-types) |
| `SWIFT_RETURNS_INDEPENDENT_VALUE` | [Annotating Methods Returning Independent References or Views](#annotating-methods-returning-independent-references-or-views) |
| `SWIFT_MUTATING` | [Constant Member Functions Must Not Mutate the Object](#constant-member-functions-must-not-mutate-the-object) |
| `SWIFT_NONCOPYABLE` | [C++ Structures and Classes are Value Types by Default](#c-structures-and-classes-are-value-types-by-default) |
| `SWIFT_SELF_CONTAINED` | [Annotating C++ Structures or Classes as Self Contained](#annotating-c-structures-or-classes-as-self-contained) |

## Document Revision History

This section lists the recent changes made to this reference guide.

**2024-08-12**

- Added several customization macros from `<swift/bridging>` to the list.

**2024-06-11**

- Non-copyable C++ types are now available in Swift.

**2024-03-26**

- Updated the status of C++ templated operator support in Swift.

**2023-06-05**

- Published the initial version of the guide that describes how to mix Swift and C++.
