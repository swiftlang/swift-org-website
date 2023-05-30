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

C++ interoperability is a new feature in an upcoming release of Swift. A
pre-release Swift toolchain that supports C++ interoperability
is available for download on the
[Swift website](https://www.swift.org/download/#swift-59-development).

* * *

<div class="info" markdown="1">
C++ interoperability is an actively evolving feature of Swift.
It currently supports interoperation between a subset of language features.
Certain aspects of its design and functionality might change in future releases of Swift,
as the Swift community gathers feedback from real world adoption of C++
interoperability in mixed Swift and C++ codebases. Future changes will not
break code in existing codebases [by default](#source-stability-guarantees-for-mixed-language-codebases).

The [status page](status) provides an
overview of the currently supported interoperability features, and
lists the [known issues](status#known-issues) as well. You can report bugs or suggest
changes related to C++ interoperability by filing an
[issue on Github](https://github.com/apple/swift/issues/new/choose).
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

- [Read how to use C++ APIs from Swift in a Swift package](project-build-setup#mixing-swift-and-c-using-swift-package-manager)

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

> C++20 introduced C++ modules as an alternative to header files.
> Swift cannot import C++ modules yet.

### Creating a Clang Module

In order for Swift to import a Clang module, it needs to find a 
`module.modulemap` file that describes how a collection of C++ headers maps
to a Clang module. 

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

The [C++ interoperability status page](status#supported-swift-apis)
describes which Swift language constructs and standard library types can be
exposed to C++.

### Source Stability Guarantees for Mixed-Language Codebases

The way Swift interoperates with C++ is still evolving. Some changes
in future releases of Swift will require source changes in mixed
Swift and C++ codebases
that have already adopted C++ interoperability. However, Swift will not
force you to adopt new or evolved C++ interoperability features when adopting
a new version of the Swift toolchain. To make that possible, Swift releases
after Swift 5.9 will provide multiple compatibility versions of C++
interoperability, just like Swift provides support for multiple compatibility
versions of the base Swift language. This means that a project using the 5.9
compatibility version of C++ interoperability will be insulated from any changes
made in subsequent releases, and it can move to newer compatibility versions
at its own pace.

## Using C++ Types and Functions in Swift

A wide array of C++ types and functions can be used from Swift. This section
goes over the fundamentals of how the supported types and functions can be
used from Swift.

### Calling C++ Functions

C++ functions from imported modules can be called using the
familiar function call syntax from Swift. For example, this C++ function:

```c++
void printWelcomeMessage(const std::string &name);
```

Can be invoked directly from Swift as if it was a regular Swift function:

```swift
printWelcomeMessage("Thomas");
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

As of Swift 5.9, C++ structures and classes with a deleted copy constructor
are not available in Swift. Non-copyable C++ structures or classes that also
have a move constructor will be available in a future version of Swift.
They will map to
[non-copyable](https://github.com/apple/swift-evolution/blob/main/proposals/0390-noncopyable-structs-and-enums.md) Swift `structs`.

### Constructing C++ Types from Swift

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

#### Constant Member Functions Must Not Mutate the Object

The Swift compiler assumes that constant member functions do not
mutate the instance that `this` points to. A violation of this assumption by a
C++ member function could lead to Swift code not observing the mutation
of the instance pointed to by `this` and using the original value of such
instance for the rest of the Swift code execution.

#### Member Functions Returning References

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
member function:

```c++
class Forest {
public:
  const Tree &getRootTree() const { return rootTree; }

  ...
private:
  Tree rootTree;
};
```

Becomes the `__getRootTreeUnsafe` method in Swift.

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
`__getRootTreeUnsafe` and `__getRootTreeMutatingUnsafe` methods in Swift. 

#### Virtual Member Functions

As of Swift 5.9, virtual member functions are not available in Swift.

#### Static Member Functions

Static C++ member functions become `static` Swift methods.

### Acessing Inherited Members from Swift

A C++ class or structure becomes a standalone type in Swift. Its
relationship with base C++ classes is not preserved in Swift.
Swift tries its best to provide access to the members inherited from base
classes of a C++ type. The public member functions and data members from a
C++ base class become methods and properties in Swift, as if they
were defined in the specific class itself.

For example, the following two C++ classes:

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

Become two distinct Swift structures, with `Fern` structure getting an
additional `water` method from `Plant`:

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

## Customizing How C++ Maps to Swift

The defaults that determine how C++ types and functions map to Swift can be
changed, by annotating a specific C++
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

### Mapping Getters and Setters to Computed Properties

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
specialization in Swift. For example, a specific
specialization of the following class template:

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

Can conform to a protocol using a Swift `extension`:

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

The `SWIFT_CONFORMS_TO` customization macro from the `<swift/bridging>`
header can be used to conform all specializations of a class template to
a Swift protocol automatically. For example, the 
definition of the `SerializedValue` class template can be annotated with
`SWIFT_CONFORMS_TO`:

```c++
template<class T>
class SerializedValue {
public:
  using ValueType = T;
  T deserialize() const;

  ...  
} SWIFT_CONFORMS_TO(Serialization.Deserializable);
```

This makes all specializations, like `SerializedInt` and `SerializedFloat`,
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
Using a C++ iterator is unsafe in Swift, as such use is not
associated with its owning container which can get destroyed
while the iterator is still in use.
Instead of relying on C++ iterators, Swift attempts to automatically
conform certain C++ container types to protocols which allow safe access to the
underlying container in Swift.
Swift also provides a handful of
other protocols that provide safe access to the underlying container for
types that conform to them manually using an `extension` in Swift.

### Using Random Access C++ Collections in Swift

Swift attemps to conform C++ containers that provide random access to their
elements, like `std::vector`, to Swift's `RandomAccessCollection` protocol
automatically. This makes it possible to traverse
through the collection's elements safely, using familiar Swift control flow
statements and APIs.
For example, you can traverse through the elements
of the `vector` returned by this function:

```c++
std::vector<Tree> getEnchantedTrees();
```

Using the `for-in` loop in Swift:

```swift
let trees = getEnchantedTrees()
for tree in trees {
  print(tree.kind)
}
```

Collection methods like `map` and `filter` are also available:

```swift
let oakTrees = getEnchantedTrees().filter { $0.kind == .Oak }
```

Swift's `count` property returns the number of elements in such
collection. Swift's subscript operator can be used to access a specific
element in the collection as well. This makes it possible to mutate individual
elements in the C++ container:

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

#### Conformance Rules for Random Access C++ Collections

The following two conditions must be satisfied in order for a C++ container
type to automatically conform to `RandomAccessCollection` in Swift:

- The C++ container type must have `begin` and `end` member functions. Both
  functions must be constant and must return the same iterator type.
- The C++ iterator type must satisfy the
  [`RandomAccessIterator`]( https://en.cppreference.com/w/cpp/named_req/RandomAccessIterator)
  C++ requirement. It must be possible to advance it using `operator +=` in C++
  and also to subscript into it using `operator []` in C++.

When these conditions are satisfied, Swift conforms the Swift structure
that represents the underlying C++ container type to
the `CxxRandomAccessCollection` protocol, which adds the
`RandomAccessCollection` conformance.

### Using Sequential C++ Collections in Swift

The sequential C++ container types that do not provide random access to their
elements are automatically
conformed to the `CxxConvertibleToCollection` protocol in Swift.
This makes
it possible to easily convert them to Swift collection types like `Array` and
`Set` in Swift. For example, the `std::set` returned by this function:

```c++
std::set<int> getWinningNumers();
```

Can be easily converted to either an `Array` or `Set` in Swift:

```swift
let winners = getWinningNumers()
for number in Array(winners) {
  print(number)
}
let setOfWinners = Set(winners)
```

In addition to automatic conformances, Swift lets you conform
a sequential C++ container to the `Sequence` protocol manually,
by providing a `CxxSequence` protocol that implements `Sequence` for a
conforming C++ container. Such conformance
lets you use familiar APIs and control flow statements for
types that don't provide random access to their elements. For example,
the `std::set<TreeKind>` container type:

```c++
using SetOfTreeKinds = std::set<TreeKind>;
```

Can be easily conformed to `CxxSequence` using an `extension` in Swift:

```swift
extension SetOfTreeKinds: CxxSequence { }
```

This lets you traverse through the elements of such set using
the `for-in` loop in Swift:

```swift
let highTreeKinds: SetOfTreeKinds = getHighElevationTreeKinds()
for treeKind in highTreeKinds {
  print("Fact: \(treeKind) tree can survive above 5000 feet!")
}
```

Collection methods like `map` and `filter` are also available for types
that conform to `CxxSequence`.

#### Conformance Rules for `CxxSequence` Protocol

The following two conditions must be satisfied when conforming a C++ container
type to `CxxSequence` in Swift:

- The C++ container type must have `begin` and `end` member functions. Both
  functions must be constant and must return the same iterator type.
- The C++ iterator type must satisfy the
  [`InputIterator`](https://en.cppreference.com/w/cpp/named_req/InputIterator)
  C++ requirement. It must be possible to increment it using `operator ++` in
  C++ and also to dereference it using `operator *` in C++.

Conforming a type to `CxxSequence` automatically conforms it to Swift's
`Sequence` protocol.

### Using Associative Container C++ Types in Swift

Associative C++ container types, like `std::map`, provide efficient access
to stored elements using a lookup key.
The `find` member function that performs such lookup is unsafe in Swift. Instead
of using `find`, Swift automatically conforms associative containers from the
C++ standard library to the `CxxDictionary` protocol. Such conformance lets
you use the subscript operator when working with an associative C++
container in Swift. For example, the `std::unordered_map` returned by this
function:

```c++
std::unordered_map<std::string, std::string>
getAirportCodeToCityMappings();
```

Can be used like a dictionary in Swift, with the subscript returning
a value stored in the container, or `nil` if such value doesn't exist:

```swift
let mapping = getAirportCodeToCityMappings();
if let dubCity = mapping["DUB"] {
   print(dubCity)
}
```

The provided subscript calls the container's `find` method safely inside of its
implementation.

Associative C++ containers can also be manually conformed to `CxxSequence` when
you need to traverse through their elements in Swift.

Swift does not conform custom associative C++ containers
to `CxxDictionary` automatically. A manually written Swift `extension`
can be used to add the `CxxDictionary` conformance
retroactively for a custom associative container type.

### Best Practices for Working with C++ Containers in Swift

#### Do Not Use C++ Iterators in Swift

As outlined at the start of this section, using C++ iterators is unsafe in
Swift. It's easy to misuse C++ iterators, for instance:

- it's easy to use an iterator after the C++ container is destroyed.
- it's easy to dereference an iterator that has advanced past the container's
  last element.

You should use protocols like `CxxRandomAccessCollection`,
`CxxSequence` and `CxxDictionary` when working with C++ containers
instead of relying on C++ iterator APIs.

Member functions inside of C++ container types that return C++ iterators are
marked unsafe in Swift, just like 
[member functions that return references](#member-functions-returning-references).
Other C++ APIs, like top-level functions that take or return iterators could
still be directly available in Swift.
You should avoid using such functions in Swift.

#### Avoiding Deep Container Copies

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
[parameter ownership modifiers](https://github.com/apple/swift-evolution/blob/main/proposals/0377-parameter-ownership-modifiers.md),
which will be provided in Swift 5.9, will let you avoid copies
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

The first criterion is whether object identity is part of the "value" of the type. Is comparing the address of two objects just asking whether they're stored at the same location, or it is deciding whether they represent the "same object" in a more significant sense? 

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

And now that `LoggerSingleton` is imported as a reference type in Swift, the programmer will be able to use it in the following manner:
```swift
let logger = LoggerSingleton.getInstance()
logger.log(123)
``` 

### Shared Reference Types

**Shared** reference types are reference-counted with custom retain and release operations. In C++, this is nearly always done with a smart pointer like `std::shared_ptr` rather than expecting programmers to manually use retain and release. This is generally compatible with being imported as a managed type. Shared pointer types are either "intrusive" or "non-intrusive", which unfortunately ends up being relevant to semantics. `std::shared_ptr` is a non-intrusive shared pointer, which supports pointers of any type without needing any cooperation.  Intrusive shared pointers require cooperation but support some additional operations. Currently, Swift only supports importing intrusively reference counted types as foreign reference types, but we intent to lift this restriction over time. (Today, you can still often use non-intrusively reference counted types, such as `std::shared_ptr`, as value types that own their storage.)

To specify that a C++ type is a shared reference type, use the `SWIFT_SHARED_REFERENCE` attribute. This attribute expects two arguments: a retain and release function. These functions must be global functions that take exactly one argument and return void. The argument must be a pointer to the C++ type (not a base type). Swift will call these custom retain and release functions where it would otherwise retain and release Swift classes. Here's an example of `SWIFT_SHARED_REFERENCE` being applied to the C++ type `SharedObject`:

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

And now that `SharedObject` is imported as a reference type in Swift, the programmer will be able to use it in the following manner:
```swift
let object = SharedObject.create()
object.doSomething()
// `object` will be released here.
``` 

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

As of Swift 5.9, C++ classes that represent Swift structures can not be moved
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
properties defined inside of the Swift structure become members of the
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
of the C++ class destroys the underlying Swift value. As of Swift 5.9, C++
classes that represent Swift enumerations can not be moved in C++ using
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
  public var longtitude: Float
}
```

C++ code can then call `getLatitude` and `getLongtitude` member functions
to access the stored property values.

## Appendix

This section contains additional tables and references for certain topics
that are outlined in the documentation above.

### List of Customization Macros in `<swift/bridging>` 

| Macro                     | Documentation |
| ------------------------- | ------------- |
| `SWIFT_NAME`                | [Renaming C++ APIs in Swift](#renaming-c-apis-in-swift)       |
| `SWIFT_COMPUTED_PROPERTY`   | [Mapping Getters and Setters to Computed Properties](#mapping-getters-and-setters-to-computed-properties)        |
| `SWIFT_CONFORMS_TO`   | [Conforming Class Template to Swift Protocol](#conforming-class-template-to-swift-protocol)        |
| `SWIFT_IMMORTAL_REFERENCE` | [Immortal Reference Types](#immortal-reference-types) |
| `SWIFT_SHARED_REFERENCE` | [Shared Reference Types](#shared-reference-types) |
| `SWIFT_UNSAFE_REFERENCE` | [Unsafe Reference Types](#unsafe-reference-types) |

