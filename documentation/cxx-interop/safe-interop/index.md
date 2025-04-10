---
layout: page
title: Mixing Strict Memory Safe Swift and C++
official_url: https://swift.org/documentation/cxx-interop/safe-interop/
redirect_from:
- /documentation/cxx-interop/safe-interop.html
---

## Table of Contents
{:.no_toc}

* TOC
{:toc}

## Introduction

This document describes how to ergonomically interact with Swift by importing
C++ construct safely. Swift's [strict memory safety mode](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0458-strict-memory-safety.md)
is a new feature under development to make code easier to audit for memory safety.
All of the features in this document work in regular Swift
but they provide more value in strict memory safe mode.

* * *

<div class="info" markdown="1">
C++ interoperability is an actively evolving feature of Swift.
Future releases of Swift might change how Swift and C++
interoperate,
as the Swift community gathers feedback from real world adoption of C++
interoperability in mixed Swift and C++ codebases.
Please provide the feedback that you have on the
[Swift Forums](https://forums.swift.org/c/development/c-interoperability/), or
by filing an [issue on GitHub](https://github.com/swiftlang/swift/issues/new/choose).
Future changes to the design or functionality of C++ interoperability will not
break code in existing codebases [by default](#source-stability-guarantees-for-mixed-language-codebases).
</div>

## Overview

Swift provides memory safety with a combination of language affordances and runtime checking.
However, Swift also deliberately includes some unsafe constructs, such as the `UnsafePointer` and `UnsafeMutablePointer`
types in the standard library.
In some cases, Swift needs additional information that is not present in the C++ type and API declarations
to safely interface with them. This document describes how such code needs to be annotated.

### Annotating foreign types

Types imported from C++ are considered foreign to Swift. 
Types imported from C++ are considered foreign to Swift. Normally, most C++ types are imported into Swift
without any restriction. However, a small set of C++ APIs e.g. pointers/references and methods returning
pointers will be imported as unsafe (section [Working with C++ references and view types in Swift](https://www.swift.org/documentation/cxx-interop/#working-with-c-references-and-view-types-in-swift)
explains this in more detail.) Under the strict memory safe mode, the compiler will flip the polarity and
treat all types that are not known to be safe as unsafe, and will diagnose uses of them. In this section,
we will show how to annotate unsafe C++ types so that they can be accessed safely and correctly from Swift.
Note that the features here are agnostic to whether strictly-safe mode is on or off. When the strictly safe
mode is on, the compiler warnings can serve as a guide to properly annotate C++ types and also help ensure
that the code doesn't use unsafe APIs anywhere. When the strictly-memory-safe mode is off, it is still
recommended to adopt these annotation whereever appropriate, especially on C++ types that are potentially
lifetime dependent on other objects.

Under strictly-memory-safe mode the built-in integral types like `int`, some standard library types like `std::string`,
and aggregate types built from other safe types are considered safe. Whereas all other unannotated types
are considered unsafe. Let's see what happens when we are trying to use an unannotated type in
strictly-safe mode. Consider the following C++ type and APIs:

```c++
class StringRef {
public:
    ...
private:
    const char* ptr;
    size_t len;
};

std::string normalize(const std::string& path);

StringRef fileName(const std::string& normalizedPath);
```

Let's try to use them from Swift with strict memory safety enabled:

```swift
func getFileName(_ path: borrowing std.string) -> StringRef {
    let normalizedPath = normalize(path)
    return fileName(normalizedPath)
}
```

Building this code will emit a warning that the `fileName` call is unsafe because
it references the unsafe type `StringRef`. Swift considers `StringRef` unsafe because
it has a pointer member. Types like `StringRef` can dangle, so we need to take extra
care using them, making sure the referenced buffer outlives the `StringRef` object.

Swift's [non-escapable types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0446-non-escapable.md)
can also have lifetime dependencies, just like `StringRef`. However, the Swift compiler
can track these dependencies and enforce safety at compile time. To import `StringRef`
as a safe type we need to mark it as a non-escapable type, we can annotate the class
definition:

```c++
class SWIFT_NONESCAPABLE StringRef { ... };
```

Now the Swift compiler imports `StringRef` as a safe type and no longer
emits a warning about using an unsafe type.

### Annotating APIs

Building the code again will emit a new diagnostic for the `fileName` function about
missing lifetime annotations. Functions returning non-escapable types need annotations
to describe their lifetime contracts via [lifetimebound](https://clang.llvm.org/docs/AttributeReference.html#id11)
and [lifetime_capture_by](https://clang.llvm.org/docs/AttributeReference.html#lifetime-capture-by) annotations.

```c++
StringRef fileName(const std::string& normalizedPath [[clang::lifetimebound]]);
```

Adding this annotation to `fileName` indicates that the returned `StringRef` value has the
same lifetime as the argument of the `fileName` function.

Building the project again reveals a lifetime error in the Swift function:

```swift
func getFileName(_ path: borrowing std.string) -> StringRef {
    let normalizedPath = normalize(path)
    // error: lifetime-dependent value escapes local scope
    // note: depends on `normalizedPath`
    return fileName(normalizedPath)
}
```

The value returned by `fileName` will dangle after the lifetime of `normalizedPath` ends.
We can fix this error by pushing the task of normalizing a path to the callee:

```swift
// Path needs to be normalized.
func getFileName(_ path: borrowing std.string) -> StringRef {
    return fileName(normalizedPath)
}
```

Or we could return an `Escapable` value like `std.string` instead of a dangling `StringRef`:

```swift
func getFileName(_ path: borrowing std.string) -> std.string {
    let normalizedPath = normalize(path)
    let ref = fileName(normalizedPath)
    return ref.toString()
}
```

After annotating the C++ code, the Swift compiler can enforce the lifetime
contracts helping us to write code that is free of memory safety errors.

## Escapability annotations in detail

Under the strictly-safe mode, even though compiler warns on unannotated types,
they are imported as if they are `Escapable` to maintain backward
compatibility. This might change in the future under a new interoperability version.
We have already seen that we can import a type as `~Escapable` to Swift by adding
the `SWIFT_NONESCAPABLE` annotation:

```c++
struct SWIFT_NONESCAPABLE View {
    View(const int *p) : member(p) {}
private:
    const int *member;
};
```

Moreover, we can explicitly mark types as `Escapable` using the `SWIFT_ESCAPABLE`
annotation to express that they are not lifetime dependent on any other values:

```c++
struct SWIFT_ESCAPABLE Owner { ... }; 
```

The main reason for explicitly annotating a type as `SWIFT_ESCAPABLE` is to make sure
it is considered as a safe type when used from Swift. Functions returning escapable
types do not need lifetime annotations.

Escapability annotations can also be attached to types via APINotes:

```
Tags:
- Name: NonEscapableType
  SwiftEscapable: false
- Name: EscapableType
  SwiftEscapable: true
```

In case of template instantiations the escapability of a type can depend on the
template arguments:

```c++
MyList<View> f();
MyList<Owner> g();
```

In this example, `MyList<View>` should be imported as `~Escapable` while `MyList<Owner>`
should be imported as `Escapable`. This can be achieved via conditional escapability
annotations:

```c++
template<typename T>
struct SWIFT_ESCAPABLE_IF(T) MyList {
    ...
};
```

Here, instantiations of `MyList` are imported as `Escapable` when `T` is substituted
with an `Escapable` type.

The `SWIFT_ESCAPABLE_IF` macro can take multiple template parameters:

```c++
template<typename F, typename S>
struct SWIFT_ESCAPABLE_IF(F, S) MyPair {
    F first;
    S second;
};
```

`MyPair` instantiations are only imported as `Escapable` if both template arguments
are `Escapable`.

`Escapable` types cannot have `~Escapable` fields. The following code snippet will
trigger a compiler error:

```c++
struct SWIFT_NONESCAPABLE View { ... };
struct SWIFT_ESCAPABLE Owner { 
    View v;
}; 
```

Escapability annotations will not only help the Swift compiler to import C++ types
safely, it will also help discover missing lifetime annotations as all `~Escapable`
parameters and return values need to be annotated in an API to make its use safe in
Swift.

## Lifetime annotations in detail

The `lifetimebound` attribute on a function parameter or implicit object parameter
indicates that the returned object's lifetime could end when any of the `lifetimebound`
annotated parameters' lifetime ended.
This annotation a constructor describes the lifetime of the created object:

```c++
struct SWIFT_NONESCAPABLE View {
    View(const int *p [[clang::lifetimebound]]) : member(p) {}
    ...
};
```

In this example, the object initialized by the `View` constructor has the same
lifetime as the input argument of the constructor.

In case the attribute is after the method signature, the returned object has
the same lifetime as the implicit `this` parameter.

```c++
struct Owner {
    int data;

    View handOutView() const [[clang::lifetimebound]] {
        return View(&data);
    }
};
```

Consider a call site like `View v = o.handOutView()`. The `v` object has the same lifetime
as `o`.

In case the attribute is applied to a subset of the parameters, the return
value might depend on the corresponding arguments:

```c++
View getOneOfTheViews(const Owner& owner1 [[clang::lifetimebound]], const Owner& owner2
    View view1 [[clang::lifetimebound]], View view2 [[clang::lifetimebound]]) {
    if (coinFlip)
        return View(&owner1.data);
    if (coinFlip)
        return view1;
    else
        return view2;
}
```

Here, the returned `View`'s lifetime depends on `owner`, `view1`, and `view2` but it cannot
depend on `owner2`. 

Occasionally, a function might return a non-escapable type that has no dependency on any other values.
These types might point to static data or might represent an empty sequence or lack of data.
Such functions need to be annotated with `SWIFT_RETURNS_INDEPENDENT_VALUE`:

```c++
View returnsEmpty() SWIFT_RETURNS_INDEPENDENT_VALUE {
    return View();
}
```

Notably, the default constructor of a type is always assumed to create an independent value.

We can also annotate `lifetimebound` APIs via APINotes. The `-1` index represents the this position.

```
Tags:
- Name: MyClass
  Methods:
    - Name: annotateThis
      Parameters:
        - Position:      -1
          Lifetimebound: true
    - Name: methodToAnnotate
      Parameters:
        - Position:      0
          Lifetimebound: true
```

Note that APINotes have some limitations around C++, they do not support overloaded functions.

While `lifetimebound` always describes the lifetime dependencies of the return value (or
the constructed object in case of constructors), we can use can use `lifetime_capture_by`
annotation to descibe the lifetime of other output values, like output/inout arguments
or globals.

```c++
void copyView(View view1 [[clang::lifetime_capture_by(view2)]], View &view2) {
    view2 = view1;
}
```

In this example, `view2` will have get all of the lifetime dependencies of `view1`
after a call to `copyView`. a

We can annotate dependency captured by the implicit `this` object, or
an inout argument capturing `this`:

```c++
struct SWIFT_NONESCAPABLE CaptureView {
    void captureView(View v [[clang::lifetime_capture_by(this)]]) {
        view = v;
    }

    void handOut(View &v) const [[clang::lifetime_capture_by(v)]] {
       v = view; 
    }

    View view;
};
```

All of the non-escapable inputs need lifetime annotations for a function to be
considered safe. If an input never escapes from the called function we can use
the `noescape` annotation:

```c++
void is_palindrome(std::span<int> s [[clang::noescape]]);
```

While the annotations in this section are powerful, they cannot express all of
the lifetime contracts. APIs with inexpressible contracts can be used from Swift,
but they are imported as unsafe APIs and need extra care from the developers
to manually guarantee safety.

## Convenience overloads for annotated spans and pointers

C++ APIs often using standard library types or other constructs like a 
pointer and a size to represent buffers that have Swift equivalents like
Swift's `Span` type. These Swift types have additional requirements and
guarantees. When these properties are properly annotated on the C++ side,
the Swift compiler can introduce safe convenience functions to make
interacting with the C++ APIs as effortless as if they were written in Swift.

### C++ span support

APIs taking/returning C++'s `std::span` with sufficient lifetime
annotations will automatically get overloads taking/returning Swift
`Span`.

The following table summarizes the generated convenience overloads:

```c++
using IntSpan = std::span<const int>;
using IntVec = std::vector<int>;
```

| C++ API                                                   | Generated Swift overload                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `void takeSpan(IntSpan x [[clang::noescape]]);`           | `func takeSpan(_ x: Span<Int32>)`                                    |
| `IntSpan changeSpan(IntSpan x [[clang::lifetimebound]]);` | `@lifetime(x) func changeSpan(_ x: Span<Int32>) -> Span<Int32>`      |
| `IntSpan changeSpan(IntVec& x [[clang::lifetimebound]]);` | `@lifetime(x) func changeSpan(_ x: borrowing IntVec) -> Span<Int32>` |
| `IntSpan Owner::getSpan() [[clang::lifetimebound]];`      | `@lifetime(self) func getSpan() -> Span<Int32>`                      |

These transformations only support top level `std::span`s, we do not
transform the nested cases. A `std::span` of a non-const type `T` will
be transformed to `MutableSpan<T>` on the Swift wide.

### Annotated pointers

