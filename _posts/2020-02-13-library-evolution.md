---
layout: new-layouts/blog
date: 2020-02-13 09:00:00
title: Library Evolution in Swift
author: slavapestov
---

Swift 5.0 introduced a stable binary interface on Apple platforms. This meant that apps built with the Swift 5.0 compiler can use the Swift runtime and standard library built into the operating system, and that existing apps will remain compatible with new versions of the Swift runtime in future operating system releases.

Swift 5.1 shipped with two new features related to binary stability which enable binary frameworks that can be distributed and shared with others:

- _Module stability_ allows Swift modules built with different compiler versions to be used together in one app.

- _Library evolution support_ allows developers of binary frameworks to make additive changes to the API of their framework while remaining binary compatible with previous versions.

Module stability currently requires library evolution support; typically you will enable both features when building a binary framework for distribution.

For more details on how binary stability, module stability and library evolution support fit together, please see an earlier post on this blog titled [ABI stability and more](/blog/abi-stability-and-more/).

## When to enable library evolution support

Library evolution support is turned _off_ by default. Frameworks that are always built and distributed together, such as Swift Package Manager packages or binary frameworks that are internal to your app, should _not_ be built with library evolution support.

**Library evolution support should only be used when a framework is going to be built and updated separately from its clients**. In this scenario, a client built against an old version of the framework can be run with a new version of the framework without being recompiled.

If you plan on shipping a framework that will be used in this manner, make sure to turn library evolution on at least from the first release onward, or preferably, as early as possible in the development and testing cycle.  Enabling library evolution support changes your framework's performance characteristics, and introduces a source-incompatible language change with the exhaustiveness of `switch` over enums. Furthermore, enabling library evolution support for a framework is itself a binary-incompatible change, since frameworks built without library evolution do not provide any binary compatibility guarantees.

## Enabling library evolution support

### Xcode

When using Xcode to develop for Apple platforms, set the `BUILD_LIBRARY_FOR_DISTRIBUTION` build setting in the framework's target. This setting turns on both library evolution and module stability. Be sure to use the setting in both Debug and Release builds.

The `BUILD_LIBRARY_FOR_DISTRIBUTION` Xcode build setting and associated `.xcframework` support were presented at WWDC 2019 in the talk titled [Binary frameworks in Swift](https://developer.apple.com/wwdc19/416).

### Directly invoking the compiler

If you're calling `swiftc` directly, either from the command line or another build system, you can pass the `-enable-library-evolution` and `-emit-module-interface` flags. For example:

~~~shell
$ swiftc Tack.swift Barn.swift Hay.swift \
    -module-name Horse \
    -emit-module -emit-library -emit-module-interface \
    -enable-library-evolution
~~~

The above invocation will produce a module interface file named `Horse.swiftinterface` and a shared library `libHorse.dylib` (macOS) or `libHorse.so` (Linux).

## Library evolution model

Library evolution allows you to make certain changes to your framework without breaking binary compatibility. We say that a change to a framework is **resilient** if the new version remains both source compatible and binary compatible with the old version.

Before we can detail the kinds of changes that are resilient, we need to introduce the concept of an **ABI-public declaration**. This is a declaration which can be referenced from another Swift module. Here are some examples:

- All `public` declarations are ABI-public.

- Declarations annotated with the [`@usableFromInline` attribute](https://docs.swift.org/swift-book/ReferenceManual/Attributes.html#ID597) are ABI-public, but not public in the source language; this means they can be referenced from `@inlinable` code, but not directly from source. This special attribute is discussed in more detail later.

If we need to explicitly draw attention to the behavior of declarations that are not ABI-public, the term **ABI-private** is used. ABI-private declarations are those declared `private`, `fileprivate`, or `internal` without a `@usableFromInline` attribute.

The [`@frozen` attribute](https://docs.swift.org/swift-book/ReferenceManual/Attributes.html#ID620) is also associated with library evolution. This attribute changes the binary interface of an ABI-public struct or enum to expose more implementation detail. By restricting what kind of changes can be resilient in the future, some flexibility can be traded off for additional performance.

With that out of the way, let's move on and describe some common resilient changes that a framework author can introduce, as well as non-resilient changes to avoid.

### Examples of resilient changes

- A general principle is that ABI-private declarations (per the above definition) can be added, removed and changed oh a whim. Only what is explicitly declared to be ABI-public becomes part of the framework's binary interface.

- Top-level declarations in a source file can be re-ordered, and moved between source files in the same framework. Members inside a type or extension can be re-ordered, with the exception of stored properties and enum cases in structs and enums declared `@frozen`, respectively.

  For example, in the following, we have a top-level function, followed by a class with two methods. The function and the class can appear in any order, and the two methods inside the class can be re-ordered without breaking binary compatibility:

  ~~~swift
    public func sum<T : Sequence>(_ seq: T) -> Int
        where T.Element == Int {
      return array.reduce(0, (+))
    }

    open class NetworkHandle {
      open func open() {}
      open func close() {}
    }
  ~~~

  This could instead have been written with the two top-level declarations reversed without any impact on the ABI of the framework:

  ~~~swift
    // The declarations of NetworkHandle and sum have been reordered.
    // This does NOT have any impact on the binary interface of
    // of the framework.
    open class NetworkHandle {
      open func open() {}
      open func close() {}
    }

    public func sum<T : Sequence>(_ seq: T) -> Int
        where T.Element == Int {
      return array.reduce(0, (+))
    }
  ~~~

  In constrast, in the following `@frozen` enum definition, the two `case` declarations _cannot_ be re-ordered, but the two methods can.  Further, the relative ordering of the methods and the cases _can_ change:

  ~~~swift
    @frozen public enum Shape {
      // These cases of an @frozen enum cannot be reordered.
      // The order of the cases with repect to each other
      // is part of the framework's binary interface.
      case rect(w: Int, h: Int)
      case circle(radius: Int)

      // The order that these methods are declared
      // can be reordered. Their ordering is NOT
      // part of the framework's binary interface.
      public func area() -> Int {...}
      public func circumference() -> Int {...}
    }
  ~~~

- Declarations can be added at the top level of a source file.

- Members can be added to class, struct and enum types as long as the container type is not declared `@frozen`. If the type is `@frozen`, stored properties or enum cases cannot be added. Any other kind of member can be added without restriction.

- An immutable property can become mutable. The binary interface to a property is a set of **accessor functions**, so introducing mutability is equivalent to adding a new declaration -- the setter.

  For example, suppose we have a struct defining a read-only computed property `fahrenheit`:

  ~~~swift
    public struct Temperature {
      public var celsius: Int
      public var fahrenheit: Int { (celsius * 9) / 5 + 32 }
    }
  ~~~

  A new version of the library could add a setter to `fahrenheit`:

  ~~~swift
    public struct Temperature {
      public var celsius: Int
      public var fahrenheit: Int {
        get { (celsius * 9) / 5 + 32 }
        set { celsius = ((newValue - 32) * 5) / 9 }
      }
    }
  ~~~

- New protocol requirements can be added to protocols, as long as the new requirement has a default implementation defined in a protocol extension.

  For example, let's say we have a `PointLike` protocol:

  ~~~swift
  public protocol PointLike {
    var x: Int { get }
    var y: Int { get }
  }
  ~~~

  A new version of the library could add a new property requirement `z` to the protocol, with a default implementation returning 0:

  ~~~swift
  public protocol PointLike {
    var x: Int { get }
    var y: Int { get }
    var z: Int { get }
  }

  extension PointLike {
    public var z: Int { 0 }
  }
  ~~~

  Adding new associated types is binary compatible if the associated type has a default specified in the protocol itself:

  ~~~swift
  public protocol PointLike {
    var x: Int { get }
    var y: Int { get }
    var z: Int { get }

    associatedtype Magnitude = Double

    var magnitude: Magnitude { get }
  }
  ~~~

  There is an important caveat here. Recall that Swift allows all protocols to be used as generic constraints. Additionally, protocols that do not define associated types or `Self` requirements can be used as _types_. This limitation exists purely in the source language, and does not affect the binary interface of values of protocol type.

  In the above example, the previous version of `PointLike` could be used as a type, because it did not have any associated types or `Self` requirements. However, the new version has an associated type. So in fact, while this change is binary compatible, it is not _source_ compatible. For this reason, it is best to only add new associated types or `Self` requirements to protocols that _already_ have associated types or `Self` requirements. This way, you can be sure clients do not have existing uses of the protocol as a type.

- ABI-private declarations can be removed from the top level of a source file. Since they can never be referenced directly from outside the framework, they do not affect the framework's binary interface.

- ABI-private members can be removed from class, struct and enum types, provided the container type is not `@frozen`. If a struct or enum is `@frozen`, stored properties or enum cases cannot be removed. Any other kind of member can be removed without restriction.

- Private and internal declarations and members can become `public` or `@usableFromInline`. Classes and class members that are `public` can be made `open`.

- The implementation of a public declaration can be changed, as long as the new implementation is compatible with existing expected behavior. For example, a function's body might be replaced with a more efficient algorithm producing the same result. Or, a stored property can be changed into a computed property, as long as the computed property has the same observed behavior.

  For example, the following implementation of `Temperature` is binary compatible with the one we saw earlier:

  ~~~swift
  public struct Temperature {
    public var celsius: Int {
      get { ((fahrenheit - 32) * 5) / 9 }
      set { fahrenheit = (newValue * 9) / 5 + 32 }
    }
    public var fahrenheit: Int
  }
  ~~~

  This would *not* be binary compatible if `Temperature` was `@frozen`, however.

- New protocol conformances can be added to classes, structs, and enums. (Even if they're `@frozen`.)

  For example, recall our frozen enum `Shape` from earlier:

  ~~~swift
  @frozen public enum Shape {
    case rect(w: Int, h: Int)
    case circle(radius: Int)
  }
  ~~~

  We can make it conform to the standard library's `CustomStringConvertible` protocol:

  ~~~swift
  @frozen public enum Shape : CustomStringConvertible {
    case rect(w: Int, h: Int)
    case circle(radius: Int)

    public var description: String { ... }
  }
  ~~~

  Alternatively, we could have defined the conformance with an extension, like this:

  ~~~swift
  extension Shape : CustomStringConvertible {
    public var description: String { ... }
  }
  ~~~

- Conformances to ABI-private protocols can be removed.

- A superclass can be inserted between two existing classes. For example, say a class `Widget` inherits from a class `Gadget` in version 1:

  ~~~swift
  public class Gadget {}
  public class Widget : Gadget {}
  ~~~

  we can add a new class `Gizmo` in version 2 inheriting from `Gadget`, and simultaneously change `Widget` to inherit from `Gizmo`:

  ~~~swift
  public class Gadget {}
  public class Gizmo : Gadget {}
  public class Widget : Gizmo {}
  ~~~

### Examples of non-resilient changes

- Removing an ABI-public declaration is not allowed, because existing client code can reference those declarations; either via source, or the framework's inlinable functions that were emitted into the client. For example, imagine a framework published this code:

  ~~~swift
    @usableFromInline func doInternalThing() { ... }

    @inlinable public func doPublicThing() {
      doInternalThing()
    }
  ~~~

  The function `doInternalThing()` is ABI-public, and cannot be removed, because an existing client application may have inlined the body of the `doPublicThing()` function, which is `@inlinable`.

- A mutable ABI-public property cannot become immutable.  In the binary interface, this would mean removing the ABI-public setter function, which is not allowed.

- Adding or removing a stored property from a `@frozen` struct, _even if the property is private, fileprivate or internal_.

- Adding or removing the `@frozen` attribute on a struct or enum is not allowed.

- Changes to a protocol's list of refined protocols are not allowed.

- Changes to the _interface_ of a declaration are not allowed either. This includes the following:

  - Changing the type of a property

  - Changing the return type or parameter types of a function

  - Adding a parameter to a function's parameter list (even if a default value is provided)

  - Removing a parameter from a function's parameter list

  - Adding or removing generic constraints to a generic type or function's `where` clause

- Changing a default argument expression does not technically break binary compatibility, however since default argument expressions are inlined at the call site, existing clients will continue to use the old default argument value until recompiled.

For an even more exhaustive accounting of which changes are resilient or not, see the document titled [LibraryEvolution.rst](https://github.com/apple/swift/blob/master/docs/LibraryEvolution.rst) in the Swift compiler source repository.

## Selectively opting out of library evolution

Now, we will discuss the `@frozen` and `@inlinable` attributes in detail.

Library evolution trades off performance for flexibility by introducing a level of abstraction between the compiled client code and framework. Most of the time, allowing for future flexibility is the right default. However, sometimes your framework will define very simple data types that simply cannot evolve in any reasonable way.

For example, a library for two-dimensional graphics might define a `struct` representing a point in two-dimensional space, represented as two stored properties of type `Double` named `x` and `y`. It is unlikely that the stored property layout of this struct will change in the future.

In these situations it can be advantageous for the developer to communicate to the compiler that the declaration will not evolve in future releases of the library. In return, the compiler might generate more efficient code when clients interface with these declarations.

These attributes should be used judiciously. However, they are nonetheless very valuable in certain contexts, so next we will study each one of these attributes in detail.

### Inlinable functions

The `@inlinable` attribute is a promise from the library developer that the current definition of a function will remain correct when used with future versions of the library. This promise allows the compiler to look at the function body when building client code. Note that despite the name, inlining is not guaranteed to take place; the compiler may choose to emit a specialized out-of-line copy of the function inside the client, or continue to call the original version found in the framework.

An example of when the use of this attribute might be warranted is generic algorithms implemented entirely in terms of protocol requirements. Assuming the invariants published by the protocol do not change, it should always be correct to inline the generic algorithm into the client application. A future version of the library might replace the generic algorithm with a more efficient implementation, but existing versions that were inlined into client applications should continue to work.

The compiler enforces an important restriction on `@inlinable` function bodies; they can only reference other ABI-public declarations. Recall that an ABI-public declaration is one that is either `public`, or `@usableFromInline`. The `@usableFromInline` attribute exists so that helper functions can be defined for use from inlinable code, but which cannot be called directly as part of your public interface. To understand why the restriction exists, consider what could happen if an `@inlinable` function could reference `private` functions or types. These private functions and types would now be part of the framework's binary interface, hindering future evolution.

From a binary compatibility standpoint, `@usableFromInline` declarations are effectively the same as public declarations, which is why we always talk about the concept of _ABI-public declarations_, encompassing both. Once published, a `@usableFromInline` declaration must never be removed or undergo any incompatible changes to its interface.

Inlinable functions are described in more detail in a Swift evolution proposal, [SE-0193 Cross-module inlining and specialization](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0193-cross-module-inlining-and-specialization.md).

### Frozen structs

The `@frozen` attribute can be applied to a struct to publish its stored property layout to clients. Adding, removing, or re-ordering the stored properties of a `@frozen` struct is a binary-incompatible change. In return for the loss of flexibility, the compiler is able to perform certain optimizations on frozen structs across module boundaries.

The compiler imposes two language restrictions on `@frozen` structs:

- While the stored properties of a `@frozen` struct need not be ABI-public, the _types_ of those stored properties must be ABI-public types. This means that ABI-private structs and enums are never be part of a framework's binary interface, because they cannot be recursively contained in an ABI-public `@frozen` type.

  So the following is legal, because the type of `Widget.id` is `Int`, which is ABI-public:

  ~~~swift
    @frozen
    public struct Widget {
      private let id: Int
    }
  ~~~

  However, a similar declaration except where the `id` property has a custom private type `ID` is not:

  ~~~swift
    @frozen
    public struct Widget {
      private let id: ID
    }

    fileprivate struct ID {
      private let id: Int
    }
  ~~~

  To make the above compile, the definition of `ID` can be changed to be `public` or `@usableFromInline`.

- If any stored properties in the struct have initial value expressions, those initial value expressions are compiled as if they are `@inlinable`, meaning the initial value can only be expressed in terms of references to other ABI-public declarations.

  For example, the following is legal, because `doInternalThing()` is `@usableFromInline`:

  ~~~swift
    @usableFromInline
    func doInternalThing() -> Int { ... }

    public struct Widget {
      private let id: Int = doInternalThing()
    }
  ~~~

  But this is not:

  ~~~swift
    func doInternalThing() -> Int { ... }

    public struct Widget {
      private let id: Int = doInternalThing()
    }
  ~~~

Keep in mind that `@frozen` only proposes that the set of stored property members will not change. It does not place any restrictions on other kinds of struct members. Adding and re-ordering methods and _computed_ properties is totally fine.  However, do not change any computed properties to stored, or vice versa; and remember that property wrappers and `lazy` properties are implemented as stored properties under the hood.

A final caveat is that actually adding or removing `@frozen` on a struct is a binary _incompatible_ change; structs must be "born frozen", or remain forever resilient!

More details about frozen structs can be found in a Swift evolution proposal, [SE-0260 Library evolution for stable ABIs](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0260-library-evolution.md).

### Frozen enums

Enums can also be `@frozen`, which is a promise not to add, remove or re-order enum cases. (Note that while "remove" is in that list, removing a case from an ABI-public enum breaks binary compatibility even if an enum is not `@frozen`, because all cases are ABI-public.)

As with frozen structs, the compiler can manipulate frozen enum values more efficiently across module boundaries. Adding or removing `@frozen` on an enum is binary-incompatible.

A `switch` over a frozen enum is considered exhaustive if all cases are covered by the switch, whereas a switch over a non-frozen enum must always provide a default or `@unknown` case. This is the singular _source_ incompatibility introduced by enabling library evolution support.

The behavior of switch exhaustiveness is detailed in a Swift evolution proposal, [SE-0192 Non-exhaustive enums](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0192-non-exhaustive-enums.md).

## Platform support

The Swift compiler currently only guarantees binary compatibility among different compiler versions on Apple platforms. This means that on Linux and other platforms, an application and a library built with different versions of the Swift compiler will not necessarily link or behave correctly at runtime.

However, stable module interfaces and library evolution can be used on all platforms supported by Swift. So on non-Apple platforms, you can still use multiple versions of the same library without recompiling a client application, as long as all binaries were built with the same version of the Swift compiler.

As mentioned in [ABI stability and more](/blog/abi-stability-and-more/), as development of Swift on Linux, Windows, and other platforms matures, the Swift Core Team will evaluate stabilizing the ABI on those platforms as well. This will lift the restriction on mixing and matching artifacts built with different compiler versions.

### Objective-C interoperability

The following material applies to Apple platforms only.

If your framework defines an `open` class, a subclass definition in client code must perform runtime initialization to cope with resilient changes in the base class, such as the addition of new stored properties or insertion of a superclass. This initialization is handled by the Swift runtime behind the scenes.

However, if a class requires runtime initialization, it will only be visible to the _Objective-C_ runtime when running on a newer platform version. The practical consequence of this is that on older platforms, certain features, such as functionality built on top of `NSClassFromString()`, will not work as expected with classes requiring runtime initialization. Furthermore, classes requiring runtime initialization will not appear in the Objective-C generated header produced by the Swift compiler unless the deployment target is set to a new enough platform version.

The requisite Objective-C runtime features are present in the following OS versions:

- macOS 10.15
- iOS 13.0
- tvOS 13.0
- watchOS 6.0

Unless you are certain that your framework's classes will not be used in conjunction with dynamic Objective-C features in the aforesaid manner, the safest option is to target the above platform versions as a minimum deployment target for both your framework and client code.

## Interaction with -enable-testing

The `-enable-testing` compiler flag builds a framework in a special mode allowing other modules to import the framework with the `@testable` attribute. A `@testable import` makes visible all `internal` declarations in the framework to the importing module. This is commonly used for unit tests that wish to test code that is otherwise not part of the framework's public API.

The `-enable-library-evolution` compiler flag is supported in conjunction with `-enable-testing`, and in fact the recommended way of building a framework target for testing is to pass both flags. However, it is important to note that the resulting framework is only resilient with respect to changes to the public API. This means that clients normally importing the framework remain binary compatible with a new version built for testing. However, code that actually uses `@testable import`, such as the framework's own unit tests, bypasses access control and necessarily depends on non-resilient implementation details of the specific version of the framework it was built against. For this reason, tests should always be built together with the framework.

## Implementation of library evolution

For the remainder of this article, we're going to dive into compiler implementation details. Understanding these details is not a requirement for making use of the library evolution feature. This material is only of interest to Swift compiler contributors, or anyone who is curious about how things work under the hood.

### Resilience boundary

For a single given language construct, the Swift compiler may generate different code patterns depending on the context and quantity of static information available. The main difference between using a framework built with library evolution support over one without is that with library evolution support, the compiler is more conservative when generating code for certain language constructs.

An important concept is a **resilience boundary**. Within a single framework itself, the compiler always has full understanding of the framework's types and functions. There is no resilience boundary within the framework, as all the sources of the framework are assumed to be compiled together.

However, when building a client application, the compiler must take care to only make static assumptions that are guaranteed to hold even with future versions of the framework. The scope of available compile-time information is intentionally limited across the resilience boundary, and some decisions must be deferred to run time, in order to enable the flexibility that library evolution support affords.

### Structs and enums

If a struct or enum is not declared `@frozen`, its in-memory layout is opaque across a resilience boundary. This includes the size and alignment of the value, as well as whether additional work must be performed when moving, copying and destroying values of this type (for example, updating reference counts).

When generating code that interfaces with a resilient struct or enum across a resilience boundary, the compiler will always manipulate the value indirectly, passing type metadata to describe the in-memory layout of the value. This is analogous to how unspecialized generic functions manipulate values of generic parameter type, which is a topic discussed in detail in the 2017 LLVM Developer's Meeting talk titled [Implementing Swift Generics](https://www.youtube.com/watch?v=ctS8FzqcRug).

An important property of the implementation is that a resilient struct or enum has the same in-memory layout as a non-resilient struct or enum; there is no [boxing](https://en.wikipedia.org/wiki/Object_type_(object-oriented_programming\)#Boxing) or indirection at the level of values. Instead, code that manipulates those values must take additional steps to calculate field offsets or pass values as parameters between functions. This ensures that while library evolution support can increase code size, it does _not_ impact the [cache locality](https://en.wikipedia.org/wiki/Locality_of_reference) of data.

### Properties

Properties in Swift come in many different flavors: stored properties, computed properties, stored properties with observers, and some more exotic variations such as `lazy` and `@NSManaged`.

Recall that from a library evolution standpoint, all properties expose a uniform interface composed of accessor functions. Every property has a getter function. If the property is mutable, it will also have a setter and a _modify coroutine_. The modify coroutine allows for more efficient code generation with certain usages, such as passing a property as an `inout` parameter. Today its existence is an implementation detail, but a [pitch to add modify accessors to the language](https://forums.swift.org/t/modify-accessors/31872) is currently making its way through the Swift evolution process.

The compiler will generally always use accessor functions to access a property across a resilience boundary. This guarantees that changes to the property's underlying implementation are resilient.

The exception is, of course, stored properties in `@frozen` structs. While the accessor functions are still generated, and used in some contexts such as when emitting protocol witness tables, the compiler is able to emit direct accesses to stored properties where possible.

### Protocols

When a framework publishes a protocol, client code can declare types conforming to this protocol. The compiler generates a table of function pointers known as the _protocol witness table_ to describe each protocol conformance. Calling a protocol requirement on a generic parameter requires loading the right function pointer from a protocol witness table. Since protocol requirements can be re-ordered, and new protocol requirements with default implementations can be added, the layout of a protocol witness table must be completely opaque across a resilience boundary.

This is accomplished in two steps. First, for every protocol requirement, the binary framework exports a special function called a _dispatch thunk_. The dispatch thunk is part of the framework itself, and so it can directly hard-code the offset of the protocol requirement in the witness table. If the protocol's declaration is changed to re-order requirements, the order of entries in the witness table is changed, but the symbol names of the dispatch thunks remain the same. Since client code calls all protocol methods via dispatch thunks, binary compatibility with future versions of the framework can be maintained.

Finally, to cope with adding new protocol requirements, protocol witness tables require _runtime instantiation_. Instead of emitting a witness table in the client code directly, the compiler emits a symbolic description of the conformance. The instantiation process places the protocol requirements in the correct order and fills missing entries to point to their default implementation, to produce a well-formed witness table which can be passed off to a dispatch thunk.

Unlike structs and enums, protocols do not define an opt-out mechanism to publish the exact layout of the protocol and get around the use of dispatch thunks. This is because the overhead is negligible in practice.

If you've been paying particularly close attention, you might (correctly) guess that just like the other resilience features, if the conformance is defined in the same framework as the protocol, the compiler does not use runtime instantiation or dispatch thunks.

### Classes

Classes in Swift provide a large amount of functionality, primarily as a result of inheritance. A class can inherit from another Swift superclass, or an Objective-C superclass; when inheriting from a Swift superclass, the superclass might be in the same module, or another module, either built with or without library evolution support.

Methods of classes can be dynamically dispatched, allowing them to be overridden in subclasses. Swift classes inheriting from Objective-C classes can also override Objective-C methods. Classes can opt-out of dynamic dispatch, by declaring a method as `final`. An entire class can also be made `final`. Last but not least, methods of classes can be published to Objective-C using the `@objc` attribute. There's a lot going on here, and the interactions with resilience can be complex.

The key takeaway here is that method dispatch to Swift-native methods on a resilient class is performed by calling a dispatch thunk; as with protocols, this allows methods on the class to be re-ordered and new methods added without disturbing callers. This mechanism also allows the _superclass_ to add or remove methods, without disturbing subclasses.

Of course `@objc` methods use a completely different method dispatch strategy involving a call to the Objective-C `objc_msgSend()` runtime function, which is resilient by virtue of going through a hashtable lookup.

### Development history

Much of the functionality behind library evolution has been incrementally tested and rolled out in previous releases of the compiler, starting from the Swift 3.0 release.

Prior to Swift 4.0, the standard library was built in a special mode, enabled using the undocumented `-sil-serialize-all` compiler flag. This flag predates the implementation of the `@inlinable` attribute, and was essentially equivalent to declaring all functions as inlinable. There was no explicit attribute to opt into this behavior on a per-function basis; we always enabled the flag on the standard library and disabled it everywhere else.

Swift 4.0 introduced an experimental implementation of inlinable functions that at the time was spelled as `@_inlineable`, and the special `-sil-serialize-all` flag was removed. To ease the transition, we simply marked all standard library functions `@_inlineable`, so at first, these changes had little functional effect.

In Swift 4.1 and 4.2 we began a comprehensive audit of the standard library to decide what should and should not be `@_inlinable`. Swift 4.2 finally rolled out `@inlinable` as an officially supported attribute, indicating the implementation of inlinable functions had reached the requisite level of polish and correctness desired.

By the time of the Swift 5.0 release, the standard library audit had completed, with the inlinable code paired down to an absolute minimum, ensuring the standard library can evolve into the future.

We also continued to flesh out the implementation of resilient structs and enums, introducing another experimental attribute, `@_fixed_layout`, which would later become `@frozen`. The standard library was now ABI-stable, but one of the tools required for doing so, the `@_fixed_layout` attribute, was still not an official language feature.

Swift 5.1 finally introduced `@frozen`, as the replacement for the experimental `@_fixed_layout`, while remaining ABI-compatible with the standard library from Swift 5.0. With the introduction of `@frozen`, library evolution is now ready for general use.

### Questions?

Please feel free to post questions about this post on the [associated thread](https://forums.swift.org/t/swift-org-blog-library-evolution-in-swift/33785) on the [Swift forums][].

[Swift forums]: https://forums.swift.org

## References

The list below collects various links found earlier in this document:

- Blog post: [ABI stability and more](/blog/abi-stability-and-more/)
- WWDC talk: [Binary frameworks in Swift](https://developer.apple.com/wwdc19/416)
- Specification document: [LibraryEvolution.rst](https://github.com/apple/swift/blob/master/docs/LibraryEvolution.rst)
- Evolution proposal: [SE-0193 Cross-module inlining and specialization](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0193-cross-module-inlining-and-specialization.md)
- Evolution proposal: [SE-0260 Library evolution for stable ABIs](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0260-library-evolution.md)
- Evolution proposal: [SE-0192 Non-exhaustive enums](https://github.com/swiftlang/swift-evolution/blob/master/proposals/0192-non-exhaustive-enums.md)
- Evolution pitch: [Modify accessors](https://forums.swift.org/t/modify-accessors/31872)
- LLVM Developer's Meeting talk: [Implementing Swift generics](https://www.youtube.com/watch?v=ctS8FzqcRug)
