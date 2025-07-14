---
layout: page
title: Safely Mixing Swift and C/C++
official_url: https://swift.org/documentation/cxx-interop/safe-interop/
redirect_from:
- /documentation/cxx-interop/safe-interop.html
---

## Table of Contents
{:.no_toc}

* TOC
{:toc}

## Introduction

This document describes the additional memory safety features that Swift
provides when interoperating with C and C++. It describes the ways to make Swift
aware of certain memory safety aspects of your codebase, as well as how Swift
uses that knowledge to prevent common memory safety issues in your code.

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
to safely interface with them. This document describes how such code needs to be annotated so that it can be used in strict safety mode.

### Annotating Foreign Types

Normally, C++ types imported into Swift are assumed to not impact Swift's memory
safety, and can be used without safety-related restrictions. However, a small
set of C++ APIs e.g. pointers/references and methods returning pointers will be
imported as unsafe (section [Working with C++ references and view types in Swift](https://www.swift.org/documentation/cxx-interop/#working-with-c-references-and-view-types-in-swift)
explains this in more detail.) Under the strict memory safety mode, the compiler will flip the polarity of its safety assumptions.
It will treat all types that are not known to be safe as unsafe, and emit diagnostics for usage of unsafe types without the `unsafe` keyword.
In this section,
we will show how to annotate unsafe C++ types so that they can be accessed safely and correctly from Swift.
Note that the features here are agnostic to whether strict safety mode is on or off. When the strict safety
mode is on, the compiler diagnostics can serve as a guide on how to properly annotate C++ types, and also help ensure
that the code doesn't use unsafe APIs anywhere. When the strict safety mode is turned off, it is still
recommended to adopt these annotation wherever appropriate, especially on C++ types that are potentially
dependent on the lifetimes of other objects.

Under the strict safety mode, built-in numeric types like `int`, some standard library types like `std::string`,
and aggregate types built from other safe types are considered safe. All other unannotated types
are considered unsafe.

Let's see what happens when we are trying to use an unannotated type in
strict safety mode. Consider the following C++ type and APIs:

```c++
struct StringRef {
public:
    ...
private:
    const char *ptr;
    size_t len;
};

std::string normalize(const std::string &path);

StringRef fileName(const std::string &normalizedPath);
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
it has a pointer member. Pointers in types like `StringRef` can dangle, so we need to take extra
care that the buffer they point to outlives the `StringRef` object they are encapsulated by.

Swift's [non-escapable types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0446-non-escapable.md)
can have lifetime dependencies. The Swift compiler can track these dependencies
and enforce safety at compile time. To import `StringRef` as a safe type, we
need to mark it as a non-escapable type by annotating the class definition:

```c++
struct SWIFT_NONESCAPABLE StringRef { ... };
```

Now the Swift compiler imports `StringRef` as a safe type and no longer
emits a warning about using an unsafe type.

<div class="info" markdown="1">
Some containers and protocols do not yet support non-escapable types in Swift 6.2.
</div>

### Annotating C++ APIs

Building the code again will emit a new diagnostic for the `fileName` function about
missing lifetime annotations. C and C++ functions that return non-escapable types need annotations
to describe their lifetime contracts via [lifetimebound](https://clang.llvm.org/docs/AttributeReference.html#id8)
and [lifetime_capture_by](https://clang.llvm.org/docs/AttributeReference.html#lifetime-capture-by) annotations.
Not all versions of C and C++ support the `[[clang::lifetimebound]]` attribute syntax. Convenience macros for
lifetime annotations using the GNU style attribute syntax are available in the `lifetimebound.h` header, and we'll
be using them throughout this document.

```c++
StringRef fileName(const std::string &normalizedPath __lifetimebound);
```

Adding this annotation to `fileName` indicates that the returned `StringRef` value has the
same lifetime as the argument of the `fileName` function.

Building the project again reveals a lifetime error in the Swift function that calls `fileName`:

```swift
func getFileName(_ path: borrowing std.string) -> StringRef {
    let normalizedPath = normalize(path)
    return fileName(normalizedPath)
    // error: lifetime-dependent value escapes local scope
    // note: depends on `normalizedPath`
}
```

The value returned by `fileName` will dangle after the lifetime of
`normalizedPath` ends. We can fix this error by making the caller of
`getFileName` normalize the path prior to calling `getFileName`:

```swift
// Path needs to be normalized.
func getFileName(_ normalizedPath: borrowing std.string) -> StringRef {
    return fileName(normalizedPath)
}
```

Alternatively, we could construct and return an `Escapable` value of type such
as `std.string` instead of a dangling `StringRef`:

```swift
func getFileName(_ path: borrowing std.string) -> std.string {
    let normalizedPath = normalize(path)
    let ref = fileName(normalizedPath)
    return ref.toString()
}
```

After annotating the C++ code, the Swift compiler can enforce those lifetime
contracts and help us to write code that is free of memory safety errors.

## Escapability Annotations in Detail

Under the strict safety mode, even though compiler warns us when importing
unannotated types, they are still imported as if they are `Escapable` to
maintain backward compatibility. This behavior might change in the future under
a new interoperability version.

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
it is considered a safe type when used from Swift. Functions returning escapable
types do not need lifetime annotations.

Escapability annotations can also be attached to types via [API Notes](https://clang.llvm.org/docs/APINotes.html):

```yaml
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

## Lifetime Annotations in Detail

The `lifetimebound` attribute on a function parameter or implicit object parameter
indicates that the returned object's lifetime could end when any of the `lifetimebound`
annotated parameters' lifetime ended.
Annotating the parameters of a constructor describes the lifetime of the created object:

```c++
struct SWIFT_NONESCAPABLE View {
    View(const int *p __lifetimebound) : member(p) {}
    ...
};
```

In this example, the object initialized by the `View` constructor has the same
lifetime as the argument `p` of the constructor.

When the attribute is written after the method signature, the returned object has
the same lifetime as the implicit `this` parameter.

```c++
struct Owner {
    int data;

    View handOutView() const __lifetimebound {
        return View(&data);
    }
};
```

For a call site like:
```c++
View v = o.handOutView()
```
the `v` object has the same lifetime as `o`.

In case the attribute is applied to a subset of the parameters, the return
value might depend on the corresponding arguments:

```c++
View getOneOfTheViews(const Owner &owner1 __lifetimebound,
                      const Owner &owner2,
                      View view1 __lifetimebound,
                      View view2 __lifetimebound) {
    if (coinFlip)
        return View(&owner1.data);
    if (coinFlip)
        return view1;
    else
        return view2;
}
```

Here, the returned `View`'s lifetime depends on `owner`, `view1`, and `view2` but not on `owner2`.

Occasionally, a function might return a non-escapable type that has no dependency on any other values.
These types might point to static data or might represent an empty sequence or lack of data.
Such functions need to be annotated with `SWIFT_RETURNS_INDEPENDENT_VALUE`:

```c++
View returnsEmpty() SWIFT_RETURNS_INDEPENDENT_VALUE {
    return View();
}
```

Notably, the default constructor of a type is always assumed to create an independent value.

We can also attach `lifetimebound` annotations to C and C++ APIs using [API Notes](https://clang.llvm.org/docs/APINotes.html). The `-1` index represents the `this` position.

```yaml
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

Note that API Notes have some limitations around C++, they do not support overloaded functions.

While `lifetimebound` always describes the lifetime dependencies of the return value (or
the constructed object in case of constructors), we can use can use the [`lifetime_capture_by`](https://clang.llvm.org/docs/AttributeReference.html#lifetime-capture-by)
annotation to describe the lifetime of other output values, like output/inout arguments
or globals.

```c++
void copyView(View view1 __lifetime_capture_by(view2), View &view2) {
    view2 = view1;
}
```

Here, `view2` inherits the lifetime dependencies of `view1`, so callers of `copyView` must ensure that whatever they pass as `view2` does not outlive `view1`.

We can use this annotation to specify that a parameter's lifetime dependencies are captured by the implicit `this` object, or
conversely, that an inout argument captures the lifetime dependencies of `this`:

```c++
struct SWIFT_NONESCAPABLE CaptureView {
private:
    View containedView;

public:
    void captureView(View v __lifetime_capture_by(this)) {
        containedView = v;
    }

    void handOut(View &v) const __lifetime_capture_by(v) {
       v = containedView; 
    }
};
```

All of the non-escapable arguments need lifetime annotations for a function to be
considered safe. If an input never escapes from the called function we can use
the `noescape` annotation:

```c++
void is_palindrome(std::span<int> s __noescape);
```

The lifetime annotations presented in this sections are powerful,
but there are still lifetime contracts that they cannot express.
APIs with such contracts can still be used from Swift,
but they are imported as unsafe APIs, so that developers are aware
that they need to take extra care when using these APIs to avoid memory safety violations.

## Safe Overloads for Annotated Spans and Pointers

C and C++ APIs often feature parameters that denote a span of memory.
For example, some might have two parameters where one points to a memory buffer
and the other designates the buffer's size; others might use the
[`std::span`](https://en.cppreference.com/w/cpp/container/span) type from the
C++ standard library. When such APIs are appropriately annotated, the Swift
compiler can bridge those span-like parameters to Swift's
[`Span`](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0447-span-access-shared-contiguous-storage.md)
and [`MutableSpan`](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0467-MutableSpan.md)
types, and the user with a safe and convenient interface to those imported APIs.
These interfaces are *in addition to* the interfaces generated without annotations:
adding additional annotations to C or C++ APIs will not affect Swift code currently
relying on the plain interface. Adding additional information may alter the signature
of any existing safe overload however, since only 1 safe overload per imported function is generated.

<div class="info" markdown="1">
At the time of writing, the features described in this section
are behind an experimental feature flag on the Swift 6.2 release branch.
To enable these features, pass `-enable-experimental-feature SafeInteropWrappers`
to the Swift compiler.
</div>

### Safe Overloads for C++ `std::span`

APIs taking or returning C++'s `std::span` with sufficient lifetime
annotations will automatically get safe overloads take or return Swift
`Span` and `MutableSpan` types.

The following table summarizes the generated convenience overloads:

```c++
using IntSpan = std::span<const int>;
using IntVec = std::vector<int>;
```

| C++ API                                                   | Generated Swift overload                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `void takeSpan(IntSpan x __noescape);`           | `func takeSpan(_ x: Span<Int32>)`                                    |
| `IntSpan changeSpan(IntSpan x __lifetimebound);` | `@lifetime(x) func changeSpan(_ x: Span<Int32>) -> Span<Int32>`      |
| `IntSpan changeSpan(IntVec &x __lifetimebound);` | `@lifetime(x) func changeSpan(_ x: borrowing IntVec) -> Span<Int32>` |
| `IntSpan Owner::getSpan() __lifetimebound;`      | `@lifetime(self) func getSpan() -> Span<Int32>`                      |

These transformations only support top-level `std::span`s. The compiler
currently does not transform nested `std::span`s. A `std::span<T>` of a non-const
type `T` is transformed to `MutableSpan<T>` on the Swift side.

### Safe Overloads for Pointers

If an API uses raw pointers rather than `std::span` - perhaps because it's written in C or Objective-C,
or because it's an older C++ API that doesn't want to break backwards compatibility -
it can still receive the same interop safety as `std::span`. This added bounds safety doesn't break
source compatiblity, nor does it affect ABI. Instead it leverages bounds annotations to express the
pointer bounds in terms of other parameters in the function signature.

#### Annotating Pointers with Bounds Annotations

The most common bounds annotation is `__counted_by`. You can apply `__counted_by` to pointer parameters
and return values to indicate the number of elements that the pointer points to, like this:

```c
int calculate_sum(const int * __counted_by(len) values __noescape, int len);
```

In this example, the function signature on the C side hasn't changed, but the `__counted_by(len)`
annotation communicates that the `values` and `len` parameters are related - specifically, `values`
should point to a buffer of at least `len` `int` values. When you annotate a function with a bounds
annotation like this, the compiler will generate a bounds safe overload: in addition to the imported
`func calculate_sum(_ values: UnsafePointer<CInt>, _ len: CInt) -> CInt` signature, you will also
get the an overload with the `func calculate_sum(_ values: Span<CInt>) -> CInt` signature.
Note that, like for `std::span`, the `__noescape` annotation is necessary to get a safe wrapper using `Span`.
This signature is not only more ergonomic to work with - since the generated overload does the unpacking
of base pointer and count for you - but it's also bounds safe. For example, if your API contains parameters
that share a count, the bounds safe overload will check that they all correspond.

```c
void sum_vectors(const int * __counted_by(len) a __noescape,
                 const int * __counted_by(len) b __noescape,
                 int * __counted_by(len) out __noescape,
                 int len);
```
This safe overload will trap if `a.count != b.count || b.count != out.count`:
```swift
func sum_vectors(_ a: Span<CInt>,
                 _ b: Span<CInt>,
                 _ out: MutableSpan<CInt>)
```

If the count of the `Span` parameters is larger than the C function expects and you intentionally want to use
only a part of it, you can create a slice using `extracting(_:)`.

If your API has more complex bounds you can express those with an arithmetic expression, like so:

```c
int transpose_matrix(int * __counted_by(columns * rows) values __noescape, int columns, int rows);
```

In this case the `columns` and `rows` parameters can't be elided:
```swift
func transpose_matrix(_ values: MutableSpan<CInt>, _ columns: CInt, _ rows: CInt)
```
This is because there's no way to factor out `columns` and `rows` given only `values.count`.
Instead a bounds check is inserted to verify that `columns * rows == values.count`.

When your C/C++ API uses opaque pointers, void pointers or otherwise pointers to unsized types,
the buffer size can't be described in terms of the number of elements. Instead you can annotate
these pointers with `__sized_by`. This bounds annotation behaves like `__counted_by`, but takes
a parameter describing the *number of bytes* in the buffer rather than the *number of elements*.
Where `__counted_by` maps to `Span<T>`, `__sized_by` will map to
`RawSpan` instead.

You can access the `__counted_by` and `__sized_by` macro definitions by including the `ptrcheck.h` header.
For more information about these annotations, see Clang's [bounds safety documentation](https://clang.llvm.org/docs/BoundsSafety.html).
If the C code base is compiled with `-fbounds-safety`, bounds safety is enforced on the C side as well -
otherwise it is only enforced at the interop boundary.

#### Lifetime Annotations for Pointers

Like with `std::span`, pointers with bounds annotations can have their safe overloads map to
`Span`/`MutableSpan` when annotated with the appropriate lifetime annotations from the `lifetimebound.h` header.
Unlike `std::span`, pointers with bounds annotations also get a bounds safe overload when they lack lifetime annotations:

<table>
<tr><td> C API </td> <td> Generated Swift overload </td></tr>

<tr>
<td markdown=1>
```c
void
take_ptr_lifetime(
  const int * __counted_by(len) x __noescape,
  int len);
```
</td>
<td markdown=1>
```swift
func take_ptr_lifetime(_ x: Span<Int32>)
```
</td>
</tr>

<tr>
<td markdown=1>
```c
const int * __counted_by(len)
change_ptr_lifetime(
  const int * __counted_by(len) x __lifetimebound,
  int len);
```
</td>
<td markdown=1>
```swift
@lifetime(x)
func change_ptr_lifetime(_ x: Span<Int32>)
  -> Span<Int32>
```
</td>
</tr>

<tr>
<td markdown=1>
```c
void
take_ptr(
  const int * __counted_by(len) x,
  int len);
```
</td>
<td markdown=1>
```swift
func take_ptr(_ x: UnsafeBufferPointer<Int32>)
```
</td>
</tr>

<tr>
<td markdown=1>
```c
const int * __counted_by(len)
change_ptr(
  const int * __counted_by(len) x,
  int len);
```
</td>
<td markdown=1>
```swift
@lifetime(x)
func change_ptr(_ x: UnsafeBufferPointer<Int32>)
  -> UnsafeBufferPointer<Int32>
```
</td>
</tr>

</table>

The `UnsafeBufferPointer` overloads provide the same bounds safety as their `Span` equvalents
(NB: `UnsafeBufferPointer` is not bounds checked on memory access in release builds, but the generated
`UnsafeBufferPointer` overloads contain bounds checks in the same cases as the `Span` overloads, *even in release builds*),
but without lifetime safety. If lifetime information is available the generated safe overload will always
choose to use `Span` - no `UnsafeBufferPointer` overload will be generated in this case. This means
that existing callers are not affected by annotating an API with `__counted_by`, but callers using the
safe overload after adding `__counted_by` *will* be affected if `__noescape` is also added later on, or
if another parameter is then also annotated with `__counted_by`.
To prevent source breaking changes, make sure to fully annotate the bounds and lifetimes of an API when
adding any bounds or lifetime annotations.

#### Bounds Annotations using API Notes

In cases where you don't want to modify the imported headers, bounds annotations can be applied using API Notes.
Given the following header:
```c
void foo(int *p, int len);
void *bar(int size);
```
We can provide bounds annotations in our API note file like this:
```yaml
Functions:
  - Name:              foo
    Parameters:
      - Position:      0
        BoundsSafety:
            Kind:      counted_by
            BoundedBy: "len"
  - Name:              bar
    BoundsSafety:
        Kind:          sized_by
        BoundedBy:     "size"
```

#### Limitations
Bounds annotations are not supported for nested pointers: only the outermost pointer can be transformed.

[`lifetime_capture_by`](https://clang.llvm.org/docs/AttributeReference.html#lifetime-capture-by)
is currently not taken into account when generating safe overloads.

Bounds annotations on global variables or struct fields are ignored: only parameters and return values
are considered.

Bounds annotations, while supported in Objective-C code bases, are not currently supported in Objective-C
class method signatures.
