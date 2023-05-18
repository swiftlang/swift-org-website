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

<!-- {% comment %}
Define some variables that help us build expanding detail sections
without too much boilerplate.  We use checkboxes instead of
<details>...</details> because it allows us to:

  * Write CSS ensuring that details aren't hidden when printing.
  * Add a button that expands or collapses all sections at once.
{% endcomment %} -->
{% capture expand %}{::nomarkdown}
<input type="checkbox" class="detail">
{:/nomarkdown}{% endcapture %}
{% assign detail = '<div class="more" markdown="1">' %}
{% assign enddetail = '</div>' %}

<div class="info screenonly" markdown="1">
To facilitate use as a quick reference, the details of many guidelines
can be expanded individually. Details are never hidden when this page
is printed.
<input type="button" id="toggle" value="Expand all details now" onClick="show_or_hide_all()" />
</div>

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

<div class="links" markdown="1">
[Read how to mix Swift and C++ in an Xcode project](TODO)

[Read how to use C++ APIs from Swift in a Swift package](TODO)

[Read how to use CMake to mix Swift and C++](TODO)
</div>

Other build systems can enable C++ interoperability by passing in the required
flag to the Swift compiler:

<div class="links" markdown="1">
[Read how to enable C++ interoperability when invoking Swift compiler directly](TODO)
</div>

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

## Using C++ APIs from Swift

A wide array of C++ types and functions can be used from Swift. This section
dives into the details of how the supported types and functions can be
used from Swift in a safe and ergonomic manner.

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

Static C++ member functions become `static` Swift methods.

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

## Using C++ Standard Library from Swift


## Using Swift APIs from C++

This section describes how APIs in a Swift module
get exposed to C++. It then goes into details of how to use Swift APIs from C++.
