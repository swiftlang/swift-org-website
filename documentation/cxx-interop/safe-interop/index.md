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

Swift's [strict memory safety mode](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0458-strict-memory-safety.md)
is a new feature in Swift 6.2 to make code easier to audit for memory safety.
This document describes how to ergonomically interact with Swift by importing
C++ construct safely. All of the features in this document work in regular Swift
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
Swift occasionally needs additional information that is not present in the C++ type and API declarations
to safely interface with them. This document describes how such code needs to be annotated.

### Annotating foreign types

Types imported from C++ are considered foreign to Swift. Many of these types are considered safe,
including the built-in integral types like `int`, some standard library types like `std::string`,
and aggregate types built from other safe types.

On the other hand, some C++ types are imported as unsafe by default. Consider the following C++ type
and APIs:

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

Currently, unannotated types are imported as `Escapable` to maintain backward
compatibility. This might change in the future under a new interoperability version.
We have already seen that we can import a type as `~Escapable` to Swift by adding
the `SWIFT_NONESCAPABLE` annotation:

```c++
struct SWIFT_NONESCAPABLE View {
    View() : member(nullptr) {}
    View(const int *p) : member(p) {}
    View(const View&) = default;
private:
    const int *member;
};
```

Moreover, we can explicitly mark types as `Escapable` using the `SWIFT_ESCAPABLE`
annotation:

```c++
struct SWIFT_ESCAPABLE Owner {
    ...
}; 
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

```
template<typename T>
struct SWIFT_ESCAPABLE_IF(T) MyList {
    ...
};
```

## Lifetime annotations in detail

The `lifetimebound` attribute can be used to annotate code in various scenarios.
On a constructor, it describes the lifetime of the created object:

```c++
struct SWIFT_NONESCAPABLE View {
    View(const int *p [[clang::lifetimebound]]) : member(p) {}
private:
    const int *member;
};
```

In case the attribute is after the method signature, the returned object has
the same lifetime as the `this` object.

```c++
struct Owner {
    int data;

    View handOutView() const [[clang::lifetimebound]] {
        return View(&data);
    }
};
```

In case the attribute is applied to a subset of the formal parameters, the return
value might depend on the corresponding arguments:

```c++
View getView(const Owner& owner [[clang::lifetimebound]]) {
    return View(&owner.data);
}

View getViewFromFirst(const Owner& owner [[clang::lifetimebound]], const Owner& owner2) {
    return View(&owner.data);
}

View getViewFromEither(View view1 [[clang::lifetimebound]], View view2 [[clang::lifetimebound]]) {
    if (coinFlip)
        return view1;
    else
        return view2;
}
```

Occasionally, a function might return a non-escapable type that in fact has no dependency on any other values.
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

We can use `lifetime_capture_by` annotations for output arguments.

```c++
void copyView(View view1 [[clang::lifetime_capture_by(view2)]], View &view2) {
    view2 = view1;
}

struct SWIFT_NONESCAPABLE CaptureView {
    CaptureView() : view(nullptr) {}
    CaptureView(View p [[clang::lifetimebound]]) : view(p) {}

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
the `noescape` annotation.

```c++
void is_palindrome(std::span<int> s [[clang::noescape]]);
```

## Convenience overloads for annotated spans and pointers

