---
layout: new-layouts/base
title: UnsafeRawPointer Migration
---

### Contents:

- [Introduction](#introduction)
- [API for binding memory types and pointer conversion](#api-for-binding-memory-types-and-pointer-conversion)
- [Common use cases](#common-use-cases)
- [Automatic migration cases](#automatic-migration-cases)

## Introduction

Swift 3 introduces an `UnsafeRawPointer` type and enforces type safety with respect to unsafe pointer conversion.

[Proposal SE-0107](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0107-unsaferawpointer.md) made the following change:

  An `Unsafe[Mutable]RawPointer` type has been introduced. It
  replaces `Unsafe[Mutable]Pointer<Void>`. Conversion from
  `UnsafePointer<T>` to `UnsafePointer<U>` has been
  disallowed. `Unsafe[Mutable]RawPointer` provides an API for untyped
  memory access and an API for binding memory to a type. Binding
  memory allows for safe conversion between pointer types.

To understand the language rules codified by this change, see the [Swift memory model](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0107-unsaferawpointer.md#memory-model-explanation) section of the proposal.

Some Swift 2 code contains UnsafePointer initialization such as:

~~~
func getCStr(ptr: UnsafePointer<UInt8>) -> UnsafePointer<CChar> {
  UnsafePointer(ptr)
}
~~~

or

~~~
func getElementPtr(ptr: UnsafePointer<Void>) -> UnsafePointer<Element> {
  return UnsafePointer(ptr)
}
~~~

In Swift 3, these initialization statements produce the error message:

~~~
error: 'init' is unavailable: use 'withMemoryRebound(to:capacity:_)' to temporarily view memory as another layout-compatible type.
~~~

The first step in migrating is to convert `UnsafePointer<Void>` to
`UnsafeRawPointer`. This makes Swift code consistent with the way Swift
3 imports `void *` declarations from C headers.

Now the `getElementPtr` code above produces this error instead:

~~~
error: cannot invoke initializer for type 'UnsafePointer<_>' with an argument list of type '(UnsafeRawPointer)'
note: Pointer conversion restricted: use '.assumingMemoryBound(to:)' or '.bindMemory(to:capacity:)' to view memory as a type.
~~~

These error messages refer to three new methods introduced in Swift 3:

- `UnsafePointer.withMemoryRebound(to:capacity:_)`
- `UnsafeRawPointer.assumingMemoryBound(to:)`
- `UnsafeRawPointer.bindMemory(to:capacity:)`

For information on using this API, see [API for binding memory types and pointer conversion](#api-for-binding-memory-types-and-pointer-conversion).
<!---
Copy the above Introduction into the main document and update this link
--->

## API for binding memory types and pointer conversion

### UnsafePointer.withMemoryRebound(to:capacity:_)

This method takes a closure in which the memory at `self` is viewed as
a different type through the closure argument. This is the safest way
to fix an `UnsafePointer` conversion that no longer compiled in
Swift 3. Three caveats are:

- At the point of conversion, the developer must know the number of elements
  that may be accessed at this memory location (`capacity`).
- `self` must not be accessed within the closure.
- The closure argument (`$0`) must not escape the closure.

The full signature is:

~~~
struct UnsafePointer<Pointee> {
  public func withMemoryRebound<T, Result>(to: T.Type, capacity count: Int,
    _ body: (UnsafeMutablePointer<T>) throws -> Result
}
~~~

It first binds the memory at `self` such that it is now expected to
hold `capacity` values of type `T`. Presumably, the memory was
previously bound to `Pointee`, which `T` must be layout compatible
with. i.e. `T` has the same number, size and alignment of stored
properties as `Pointee`. Any class references must also be at the same
locations. `T`s stored properties may be a prefix of `Pointee`s if
`capacity == 1`.

The memory has now temporarily been "rebound" from `Pointee` to
`T`. The closure `body` then executes with an argument of
`UnsafePointer<T>`. This pointer to rebound memory should not escape
from this closure.

Upon returning from the closure, memory is again rebound back to
`Pointee` so that the memory's bound type is the same before and after
executing the closure.

Interacting with an external API may make it necessary to rebind
memory. In Swift 2, type inconsistencies may have been masked by a
simple initializer as follows:

~~~
var addr = sockaddr_in()
let sock = socket(PF_INET, SOCK_STREAM, 0)

let result = withUnsafePointer(to: &addr) {
  connect(sock, UnsafePointer($0), socklen_t(MemoryLayout<sockaddr_in>.stride))
}
~~~

In Swift 3, the user should explicitly rebind memory to a different type:

~~~
let result = withUnsafePointer(to: &addr) {
  // Temporarily bind the memory at &addr to a single instance of type sockaddr.
  $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
    connect(sock, $0, socklen_t(MemoryLayout<sockaddr_in>.stride))
  }
}
~~~

Ideally, developers will not need to bind memory to interoperate with
well-designed APIs. The BSD socket API is inherently difficult to use
from Swift because different API entry points used the same memory as
unrelated types. Swift code using Sockets should hide this complexity
behind a helper API. See [Socket API helper](#socket-api-helper).

### UnsafeRawPointer.assumingMemoryBound(to:)

This API allows raw memory to viewed as the type that it was bound to
earlier. It returns a typed `UnsafePointer<T>` where `T.self` is the
`to` argument. It is the user's responsiblity to guarantee that the
memory is already bound to that type or to a related type.

This is useful if the memory's bound type has been "erased" by an API
with a raw pointer interface. For example:

~~~
  var threadResultRawPtr: UnsafeMutableRawPointer? = nil
  pthread_join(thread, &threadResultRawPtr)
  let threadResultPtr = threadResultRawPtr!.assumingMemoryBound(to: ThreadResult.self)
~~~

This is also useful when the user needs to view memory as another type
that is related to the original type. It is legal to do this in Swift
without rebinding memory. It allows, for example, viewing memory as
elements that are nested within a struct or tuple. Calling `withUnsafePointer(to:)` on a tuple passes its closure
argument as `UnsafePointer<(Element, Element, ...)>`. Normally the
closure body wants a pointer to the tuple elements instead. This
should be done by upcasting the tuple pointer to a raw pointer, then
assuming that raw pointer is bound to the tuple elements:

~~~
var bytes: (CChar, CChar, CChar, CChar) = (0x61, 0x62, 0x63, 0)
let name: String = withUnsafePointer(to: &bytes) { ptr -> String in
  return String(cString: UnsafeRawPointer(ptr).assumingMemoryBound(to: CChar.self))
}
~~~

In general, developer's should not make layout assumptions. However,
some "obvious" cases can be safely assumed, including homogeneous
arrays and tuples, and structs with homogeneous stored
properties. Imported C structs naturally follow the layout rules of
the platform's C ABI.

For more information, see this [discussion on related and layout compatible types](https://github.com/atrick/swift/blob/type-safe-mem-docs/docs/TypeSafeMemory.rst).

### UnsafeRawPointer.bindMemory(to:capacity:)

This API allows a region of memory to hold unrelated types at
different points in the program. Binding uninitialized memory to a
type prepares the memory to store values of that type. Binding memory
that is already initialized reinterprets the in-memory values
as the new type. If the old values are either nontrivial (require
destruction) or if they are ever read from memory before being
overwritten, then the new type must be mutually layout compatible with
the old type.

Like `assumingMemoryBound(to:)`, it returns a typed `UnsafePointer<T>`
where `T.self` is the `to` argument. However, this also requires the
`capacity` to be specified because it changes the type of the memory
itself rather than simply providing a typed pointer. One caveat is
that a typed pointer should never be used again after rebinding its
memory to another type.

This is useful for manual layout of newly allocated memory. For example:

~~~
// Data header followed in memory by a sequence of Floats.
struct Header {
  enum Kind { case A, B }
  var kind: Kind
  var numValues: Int
}

let dataOffset = roundUp(MemoryLayout<Header>.size,
  toAlignment: MemoryLayout<Float>.alignment)

let ptr = UnsafeMutableRawPointer.allocate(
  bytes: dataOffset + numValues * MemoryLayout<Float>.stride,
  alignedTo: MemoryLayout<Header>.alignment)

let header = ptr.bindMemory(to: Header.self, capacity: 1)
let data = (ptr + dataOffset).bindMemory(to: Float.self, capacity: numValues)
for index in 0..<numValues {
  data[index] = 0.0
}
~~~

`bindMemory` is also useful for converting an externally allocated `void*`
into a Swift typed pointer:

~~~
let rawPtr = mmap(nil, numFloats * MemoryLayout<Float>.stride, ...);
let floatPtr = rawPtr.bindMemory(to: Float.self, capacity: numFloats)
~~~

`bindMemory` even supports implementing custom allocators, as described in [SE-0107](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0107-unsaferawpointer.md#custom-memory-allocation)

### unsafeBitCast of pointers

It may be tempting to workaround compiler errors with an
unsafeBitCast. Note that the following substitution will always
compile. In fact, it is equivalent to (just as safe or unsafe as) the
code before UnsafeRawPointer was introduced:

Replace `Unsafe[Mutable]Pointer[<Pointee>](<expr>)`

with `unsafeBitCast(<expr>, to: Unsafe[Mutable]Pointer<Pointee>.self)`.

However, `unsafeBitCast`ing a pointer is one of the most dangerous
things Swift a developer can do and is strongly discouraged. That is
precisely why UnsafePointer conversion was eliminated in Swift 3.

The `unsafeBitCast` workaround does often work in practice. The common
case of wrapping arguments passed directly to an external function
call tends to work. If the Swift compiler cannot see the function body
it cannot see the memory access to the same memory with an unrelated
type. Any such workaround should be accompanied by a severe warning
comment because it sets a very dangerous precedent for other
developers reading or maintaining the code.

Remember that incorrect use of the Swift memory model can result in
code that works in one release to be miscompiled in subsequent releases
of the compiler.

## Common use cases

Part of the difficulty in using Swift UnsafePointer is the impedance
mismatch with existing API's. The two common issues that developer
will encounter are with APIs that represent strings as
`UnsafePointer<CChar>` or untyped memory as `UnsafePointer<UInt8>` as
discussed below.

### CStrings

Some Swift code operates directly on UTF8 Strings via a buffer of type
`UnsafePointer<UInt8>`. This is incompatible with libc APIs that
expect `const char *`, which is imported as
`UnsafePointer<CChar>`. Before `UnsafePointer` conversion was
restricted, it was common practice to move between these pointer
representations via the `UnsafePointer`
initializer. e.g. `strlen(UnsafePointer(utf8Buffer))`.

Most Swift code should avoid this problem by working with the proper
String or UTF8View abstractions.

If the goal is to invoke libc routines, then the Swift String can be
passed directly, and it will automatically be copied into a C string:

~~~
import Darwin
let s1 = "pointers"
print(strlen(s1))
~~~

This works in general for passing any Swift String as an
`UnsafePointer<CChar>`:

~~~
import Darwin

func takesCString(cstr: UnsafePointer<CChar>) {...}

let s1 = "pointers"
takesCString(cstr: s1)
~~~

This transformation can be performed directly via the
`String.utf8CString` property. Accessing this property copies memory
out of String's buffer into a null-terminated C string.

If the goal is to convert back from a null-terminated C strings into a
Swift Strings, use the `String.init(cstring:)` initializer. It can
take either `UnsafePointer<UInt8>` or `UnsafePointer<CChar>` and
copies null-terminated C string into String's internal buffer.

A similar failing initializer handles potentially invalid UTF8 C strings:
`public init?(validatingUTF8 cString: UnsafePointer<CChar>)`

A String can be initialized from a validated UTF8 C string of `UInt8`
by directly calling: `decodeCString` as follows:

~~~
let cstr: UnsafePointer<UInt8>
if let (str, _) = String.decodeCString(cstr, as: UTF8.self,
  repairingInvalidCodeUnits: false) {

  doSomethingWithString(str)
}
~~~

Unfortunately, a `validatingUTF8` initializer is not available for
`UnsafePointer<UInt8>` because of it's affect on overload
resolution. However, it could be implemented within one's own project:

~~~
extension String {
  public init?(validatingUTF8 cString: UnsafePointer<UInt8>) {
    if let (result, _) = String.decodeCString(cString, as: UTF8.self,
      repairingInvalidCodeUnits: false) {
      self = result
    }
    else {
      return nil
    }
  }
}
~~~

The above techniques all copy the string representation. If the goal
is interoperability between the two types of C strings without copying
the String, then it is necessary to bind memory to the correct type
each time the String is accessed, as described in [UnsafeRawPointer.bindMemory(to:capacity:)](unsafeRawPointer.bindMemory(to:capacity:)).

### Untyped Buffers ("raw" vs. UInt8)

Memory of any type may be legally accessed with
`UnsafeRawPointer`. Naturally than, an API that views a chunk of raw
memory and doesn't care about the type of values that it holds should
represent addresses into the memory via `UnsafeRawPointer`. However,
either for historical reasons or convenience, many APIs that work with
raw memory expect view each byte as a `UInt8` value and communicate
memory addresses via `UnsafePointer<UInt8>`.

For example, some legacy C APIs accept `char*` or `unsigned char *`
arguments when operating on raw bytes:

~~~
var x = 23
let count = MemoryLayout.size(ofValue: x)
let data = withUnsafePointer(to: &x) {
  // Temporarily rebind `var x` memory as `UInt8` so that
  // CFDataCreate can copy it into its own `UInt8` buffer.
  $0.withMemoryRebound(to: UInt8.self, capacity: count) {
    CFDataCreate(kCFAllocatorDefault, $0, count)
  }
}
~~~

Ideally, these APIs should be replaced by Swift-side APIs that work
with raw pointers instead. In the meantime, users are encouraged to
write their own wrappers that take the correct raw pointer type.

### UnsafeRawBufferPointer API proposal

The [UnsafeRawBufferPointer proposal](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0138-unsaferawbufferpointer.md) describes a data type that adds convenience in some typical
UnsafePointer migration scenarios. Although this proposed API is not currently
included with the language, it is possible for developers to copy all
or part of the proposed implementation into their own project, or at
least to take inspiration from it.

### Type punning without rebinding

Rebinding memory allows the same region of memory to be viewed as
unrelated types in different parts of the program. However, it is
possible to type pun without rebinding memory as long as all typed
access to that memory is consistent, and all access to unrelated types
are done via an `UnsafeRawPointer` API such as `load` or `storeBytes`.

As a simple example consider the following case that arose during 3.0
migration. A 16-bit emulated register is typed as UInt16 but the high
and low bytes can be accessed as UInt8 via raw pointers:

~~~
struct WordBytePair {

    private let lptr: UnsafeMutableRawPointer
    private let hptr: UnsafeMutableRawPointer
    private let wordptr: UnsafeMutablePointer<UInt16>

    var l: UInt8 {
        get { return lptr.load(as: UInt8.self) }
        set { lptr.storeBytes(of: newValue, as: UInt8.self) }
    }
    var h: UInt8 {
        get { return hptr.load(as: UInt8.self) }
        set { hptr.storeBytes(of: newValue, as: UInt8.self) }
    }
    var word: UInt16 {
        get { return wordptr.pointee }
        set { wordptr.pointee = newValue }
    }

    init(at ptr: UnsafeMutablePointer<UInt16>, value: UInt16 = 0x0000) {

        ptr.initialize(to: value)

        if Int(bigEndian: 42) == 42 {
            hptr = UnsafeMutableRawPointer(ptr)
            lptr = hptr + 1
        } else {
            lptr = UnsafeMutableRawPointer(ptr)
            hptr = lptr + 1
        }

        wordptr = ptr
    }
}

let numRegisters = 8
// Allocate all the registers in one cache line.
let registerFile = UnsafeMutablePointer<UInt16>.allocate(capacity: numRegisters)

var R0 = WordBytePair(at: &registerFile[0])

R0.word = 0x02F0
R0.h = 0x02
R0.l = 0x04
~~~

### Socket API Helper

BSD sockets are a common pain point for Swift interoperability. Swift
3.0 exposes the difficultly in doing this correctly. Fortunately, Quinn
"The Eskimo!" has provided these helpful wrappers:

~~~
import Darwin

extension sockaddr_storage {

    /// Calls a closure with traditional BSD Sockets address parameters.
    ///
    /// This is used to call BSD Sockets routines like `connect`, which accept their
    /// address as an `sa` and `saLen` pair.  For example:
    ///
    ///     let ss: sockaddr_storage = …
    ///     let connectResult = ss.withSockAddr { (sa, saLen) in
    ///         connect(fd, sa, saLen)
    ///     }
    ///
    /// - parameter body: A closure to call with `self` referenced appropriately for calling
    ///   BSD Sockets APIs that take an address.
    ///
    /// - throws: Any error thrown by `body`.
    ///
    /// - returns: Any result returned by `body`.

    func withSockAddr<ReturnType>(_ body: (_ sa: UnsafePointer<sockaddr>, _ saLen: socklen_t) throws -> ReturnType) rethrows -> ReturnType {
        // We need to create a mutable copy of `self` so that we can pass it to `withUnsafePointer(to:_:)`.
        var ss = self
        return try withUnsafePointer(to: &ss) {
            try $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                try body($0, socklen_t(self.ss_len))
            }
        }
    }

    /// Calls a closure such that it can return an address based on traditional BSD Sockets parameters.
    ///
    /// This is used to call BSD Sockets routines like `accept`, which return a value (the file
    /// descriptor) and an address via memory pointed to by `sa` and `saLen` parameters.  For example:
    ///
    ///     let (acceptResult, peerAddr) = sockaddr_storage.fromSockAddr { (_ sa: UnsafeMutablePointer<sockaddr>, _ saLen: inout socklen_t) in
    ///         return accept(fd, sa, &saLen)
    ///     }
    ///
    /// - parameter body: A closure to call with parameters appropriate for calling BSD Sockets APIs
    ///   that return an address.
    ///
    /// - throws: Any error thrown by `body`.
    ///
    /// - returns: A tuple consistent of the result returned by `body` and an address set up by
    ///   `body` via its `sa` and `saLen` parameters.

    static func fromSockAddr<ReturnType>(_ body: (_ sa: UnsafeMutablePointer<sockaddr>, _ saLen: inout socklen_t) throws -> ReturnType) rethrows -> (ReturnType, sockaddr_storage) {
        // We need a mutable `sockaddr_storage` so that we can pass it to `withUnsafePointer(to:_:)`.
        var ss = sockaddr_storage()
        // Similarly, we need a mutable copy of our length for the benefit of `saLen`.
        var saLen = socklen_t(MemoryLayout<sockaddr_storage>.size)
        let result = try withUnsafePointer(to: &ss) {
            try $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                try body($0, &saLen)
            }
        }
        return (result, ss)
    }

    /// Calls a closure with an address parameter of a user-specified type.
    ///
    /// This makes it easy to access the fields of an address as the appropriate type.  For example:
    ///
    ///     let sin: sockaddr_storage = … initialise with an AF_INET address …
    ///     sin.withSockAddrType { (sin: inout sockaddr_in) in
    ///         print(sin.sin_len)
    ///         print(UInt16(bigEndian: sin.sin_port))
    ///     }
    ///
    /// In this case the closure returns void, but there may be other circumstances where it's useful
    /// to have a return type.
    ///
    /// - note: `body` takes an inout parameter for the sake of folks who need to take
    ///   a pointer to elements of that parameter.  We ignore any changes that the `body`
    ///   might make to this value.  Without this affordance, the following code would not
    ///   work:
    ///
    ///         let sus: sockaddr_storage = … initialise with an AF_UNIX address …
    ///         sus.withSockAddrType { (sun: inout sockaddr_un) in
    ///             print(sun.sun_len)
    ///             print(String(cString: &sun.sun_path.0))
    ///         }
    ///
    /// - parameter body: A closure to call with `self` referenced via an arbitrary type.
    ///   Careful with that axe, Eugene.
    ///
    /// - throws: Any error thrown by `body`.
    ///
    /// - returns: Any result returned by `body`.
    ///
    /// - precondition: `AddrType` must not be larger than `sockaddr_storage`.

    func withSockAddrType<AddrType, ReturnType>(_ body: (_ sax: inout AddrType) throws -> ReturnType) rethrows -> ReturnType {
        precondition(MemoryLayout<AddrType>.size <= MemoryLayout<sockaddr_storage>.size)
        // We need to create a mutable copy of `self` so that we can pass it to `withUnsafePointer(to:_:)`.
        var ss = self
        return try withUnsafeMutablePointer(to: &ss) {
            try $0.withMemoryRebound(to: AddrType.self, capacity: 1) {
                try body(&$0.pointee)
            }
        }
    }

    /// Calls a closure such that it can return an address via a user-specified type.
    ///
    /// This is useful if you want to create an address from a specific sockaddr_xxx
    /// type that you initialise piecemeal.  For example:
    ///
    ///     let (_, sin) = sockaddr_storage.fromSockAddr { (sin: inout sockaddr_in) in
    ///         sin.sin_family = sa_family_t(AF_INET)
    ///         sin.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
    ///         sin.sin_port = (12345 as in_port_t).bigEndian
    ///     }
    ///
    /// In this case the closure returns void, but there may be other circumstances where it's useful
    /// to have a return type.
    ///
    /// - parameter body: A closure to call with parameters appropriate for returning an address.
    ///
    /// - throws: Any error thrown by `body`.
    ///
    /// - returns: A tuple consistent of the result returned by `body` and an address set
    ///   up by `body` via the `sax` inout parameter.
    ///
    /// - precondition: `AddrType` must not be larger than `sockaddr_storage`.

    static func fromSockAddr<AddrType, ReturnType>(_ body: (_ sax: inout AddrType) throws -> ReturnType) rethrows -> (ReturnType, sockaddr_storage) {
        precondition(MemoryLayout<AddrType>.size <= MemoryLayout<sockaddr_storage>.size)
        // We need a mutable `sockaddr_storage` so that we can pass it to `withUnsafePointer(to:_:)`.
        var ss = sockaddr_storage()
        let result = try withUnsafePointer(to: &ss) {
            try $0.withMemoryRebound(to: AddrType.self, capacity: 1) {
                try body(&$0.pointee)
            }
        }
        return (result, ss)
    }
}
~~~

## Automatic migration cases

The following cases are not handled by compiler fix-its, but are
patterns that can be automatically, or almost automatically,
migrated. Running the Swift 3.0 migrator ("Convert to current Swift
syntax") already handles most of these cases.

The following examples assume these declarations:

~~~
struct A {}
typealias Tuple=(A, A, A)

class B {}
class C: B {}
class D {}

func takesConstTPtr(_ p: UnsafePointer<A>) -> UnsafePointer<A> { return p }
func takesConstVoidPtr(_ p: UnsafeRawPointer) -> UnsafeRawPointer { return p }

func takesConstDPtr(_ p: UnsafePointer<D>) {}
func takesDPtr(_ p: UnsafeMutablePointer<D>) {}
~~~

### 1. `UnsafePointer<Void>` type should be renamed `UnsafeRawPointer`

*Handled by the 3.0 migrator*

This is a textual find/replace operation with these substitutions:

Original                    | Substitution
--------------------------- | -------------------------
`UnsafePointer<Void>`       | `UnsafeRawPointer`
`UnsafePointer<()>  `       | `UnsafeRawPointer`
`UnsafeMutablePointer<Void>`| `UnsafeMutableRawPointer`
`UnsafeMutablePointer<()>`  | `UnsafeMutableRawPointer`

Diagnostic string:

`error: cannot invoke initializer for type 'UnsafePointer<Void>' with an argument list of type '(UnsafeRawPointer)'`

Example:

~~~
// Case #1: Search and replace:
// func case1(_ ptr: UnsafeMutableRawPointer) -> UnsafeRawPointer {
//   return UnsafeRawPointer(takesConstVoidPtr(ptr))
// }
func case1(ptr: UnsafeMutablePointer<Void>) -> UnsafePointer<Void> {
  return UnsafePointer<Void>(takesConstVoidPtr(ptr))
}
~~~

### 2. Remove redundant initializers.

*Handled by the 3.0 migrator*

When the type of `<expr>` is the same as the type being initialized
(e.g. both `Unsafe[Mutable]Pointer<Void>` with the same mutability), simply
remove the initialization:

Original                      | Substitution
---------------------------   | -------------------------
`UnsafePointer(<expr>)`       | `<expr>`
`UnsafeMutablePointer(<expr>)`| `<expr>`

No diagnostic string.

Example:

~~~
// Case #2: redundant initializer:
// Remove all initializers.
// func case2a_1(_ ptr: UnsafeRawPointer) -> UnsafeRawPointer {
//   return ptr
// }
// func case2a_2(_ ptr: UnsafeMutableRawPointer) -> UnsafeMutableRawPointer {
//   return ptr
// }
// func case2a_3(_ ptr: UnsafeRawPointer) -> UnsafeRawPointer {
//   return ptr
// }
// func case2a_4(_ ptr: UnsafeMutableRawPointer) -> UnsafeMutableRawPointer {
//   return ptr
// }
func case2_1(ptr: UnsafePointer<Void>) -> UnsafePointer<Void> {
  return UnsafePointer<Void>(ptr)
}
func case2_2(ptr: UnsafeMutablePointer<Void>) -> UnsafeMutablePointer<Void> {
  return UnsafeMutablePointer<Void>(ptr)
}
func case2_3(ptr: UnsafePointer<Void>) -> UnsafePointer<Void> {
  return UnsafePointer(ptr)
}
func case2_4(ptr: UnsafeMutablePointer<Void>) -> UnsafeMutablePointer<Void> {
  return UnsafeMutablePointer(ptr)
}
~~~

### 3. Convert to a raw pointer initializer.

*Handled by the 3.0 migrator*

When initializing an inferred `Unsafe[Mutable]Pointer<Void>`, substitute:

Original                      | Substitution
---------------------------   | -------------------------
`UnsafePointer(<expr>)`       | `UnsafeRawPointer(<expr>)`
`UnsafeMutablePointer(<expr>)`| `UnsafeMutableRawPointer(<expr>)`

This is the same substitution as case #1, but with an inferred generic
parameter in the original code. If the Pointee type were explicit,
then case #1 would already have handled it.

Diagnostic strings:

`error: cannot convert value of type 'UnsafePointer<...>' to expected argument type 'UnsafePointer<_>'`

`error: cannot convert value of type 'UnsafeMutablePointer<...>' to expected argument type 'UnsafeMutablePointer<_>'`

~~~
// Case #3: convert to raw initializer:
// - <rdar://problem/27938675> Migrator work for [SE-0107]: UnsafePointer() to UnsafeRawPointer() case.
// func case2b_1(ptr: UnsafePointer<A>) -> UnsafeRawPointer {
//   return UnsafeRawPointer(ptr)
// }
//
// func case2b_2(ptr: UnsafeMutablePointer<A>) -> UnsafeMutableRawPointer {
//   return UnsafeMutableRawPointer(ptr)
// }
func case3_1(ptr: UnsafePointer<A>) -> UnsafePointer<Void> {
  return UnsafePointer(ptr)
}

func case3_2(ptr: UnsafeMutablePointer<A>) -> UnsafeMutablePointer<Void> {
  return UnsafeMutablePointer(ptr)
}
~~~

### 4. Update Unsafe[Mutable]Pointer<Pointee> initializer calls, where Pointee ==> tuple

*Handled by the 3.0 migrator*

Find occurrences of `Unsafe[Mutable]Pointer<Pointee>` initializer calls
of this form:

`Unsafe[Mutable]Pointer[<Pointee>](<expr>)`

where <expr> type is resolved to an `Unsafe[Mutable]Pointer` with a
tuple element type, `(Pointee, Pointee, ...)`, such that the tuple
type is the same as the initializer's generic argument.

Substitute with:

`(<expr>).assumingMemoryBound(to: Pointee.self)`

Diagnostic strings:

`error: cannot convert value of type 'UnsafePointer<...>' (aka 'UnsafePointer<(..., ...)>') to expected argument type 'UnsafePointer<_>'`

`error: cannot convert value of type 'UnsafeMutablePointer<...>' (aka 'UnsafeMutablePointer<(..., ...)>') to expected argument type 'UnsafeMutablePointer<_>'`

Example:

~~~
// Case #4: assumingBound to tuple element:
// - <rdar://problem/27977302> Migrator work for [SE-0107]: tuple element pointers, materialize assumingBound(to:)
// func case4_1(ptr: UnsafePointer<Tuple>) -> UnsafePointer<A> {
//   return UnsafeRawPointer(ptr).assumingMemoryBound(to: A.self)
// }
// func case4_2(ptr: UnsafeMutablePointer<Tuple>) -> UnsafeMutablePointer<A> {
//   return UnsafeMutableRawPointer(ptr).assumingMemoryBound(to: A.self)
// }
// func case4_3(ptr: UnsafeMutablePointer<Tuple>) -> UnsafePointer<A> {
//   return UnsafeRawPointer(ptr).assumingMemoryBound(to: A.self)
// }
func case4_1(ptr: UnsafePointer<Tuple>) -> UnsafePointer<A> {
  return UnsafePointer(ptr)
}
func case4_2(ptr: UnsafeMutablePointer<Tuple>) -> UnsafeMutablePointer<A> {
  return UnsafeMutablePointer(ptr)
}
func case4_3(ptr: UnsafeMutablePointer<Tuple>) -> UnsafePointer<A> {
  return UnsafePointer(ptr)
}
~~~

### 5. Update UnsafePointer<Pointee> initializer calls, where Pointee ==> class

Find occurrences of `UnsafePointer<Pointee>` (non-mutable) initializer
calls of this form:

`UnsafePointer[<Pointee>](<expr>)`

where <expr> type is resolved to an `Unsafe[Mutable]Pointer` with a
class type. Check whether the initializer's `Pointee` type is a base
class or class-constrained protocol (similar to C++ static_cast).  If
the two types both have class representation and the expressions type is
a subclass or conformance of the initializer's class or
class-constrained protocol, then perform this substitution:

`(<expr>).assumingMemoryBound(to: Pointee.self)`

Example:

~~~
// Case #5: assumingBound to related class.
// - <rdar://problem/27978532> Migrator work for [SE-0107]: class pointers, materialize assumingBound(to:)
// func case4_1(ptr: UnsafePointer<C>) -> UnsafePointer<B> {
//   return UnsafeRawPointer(ptr).assumingMemoryBound(to: B.self)
// }
// func case5_2(ptr: UnsafeMutablePointer<C>) -> UnsafeMutablePointer<B> {
//   return UnsafeMutableRawPointer(ptr).assumingMemoryBound(to: B.self)
// }
// func case5_3(ptr: UnsafeMutablePointer<C>) -> UnsafePointer<B> {
//   return UnsafeRawPointer(ptr).assumingMemoryBound(to: B.self)
// }
func case5_1(ptr: UnsafePointer<C>) -> UnsafePointer<B> {
  return UnsafePointer(ptr)
}
func case5_2(ptr: UnsafeMutablePointer<C>) -> UnsafeMutablePointer<B> {
  return UnsafeMutablePointer(ptr)
}
func case5_3(ptr: UnsafeMutablePointer<C>) -> UnsafePointer<B> {
  return UnsafePointer(ptr)
}
~~~

### 5a. Update UnsafePointer<Pointee> initializer calls, where Pointee ==> AnyObject

*Handled by the 3.0 migrator*

We catch one of the most likely cases above simply by allowing any pointer-to-class to be cast to a pointer to AnyObject. This doesn't require anysophisticated type system support.

Occurrences of this form:

`UnsafePointer[<AnyObject>](<expr>)`

are converted to:

`(<expr>).assumingMemoryBound(to: AnyObject.self)`

Diagnostic string:

`error: cannot convert value of type 'UnsafeMutablePointer<...>' to expected argument type 'UnsafeMutablePointer<_>'`

Example:

~~~
// Simplified version of case #5 that handled AnyObject casts.
func case5a_1(ptr: UnsafePointer<C>) -> UnsafePointer<AnyObject> {
  return UnsafePointer(ptr)
}
func case5a_2(ptr: UnsafeMutablePointer<C>) -> UnsafeMutablePointer<AnyObject> {
  return UnsafeMutablePointer(ptr)
}
func case5a_3(ptr: UnsafeMutablePointer<C>) -> UnsafePointer<AnyObject> {
  return UnsafePointer(ptr)
}
~~~

### 6. Use `withMemoryRebound` for UnsafePointer initializers that feed arguments.

Find occurrences of `UnsafePointer<Pointee>` initializers in which the initializer's expression is an argument to a function call:

`takesPtr(Unsafe[Mutable]Pointer[<T>](ptr))`

These can be replaced with the pattern:

~~~
// Replace <<capacity>> with the number of `T` values in memory
// pointed to by `ptr`.
ptr.withMemoryRebound(to: D.self, capacity: <<capacity>>) {
  takesPtr(Unsafe[Mutable]Pointer(ptr))
}
~~~

Diagnostic string:

`error: 'init' is unavailable: use 'withMemoryRebound(to:capacity:_)' to temporarily view memory as another layout-compatible type.`

Example:

~~~
// Case #6: Unsafe[Mutable]Pointer argument cast.
// This pattern can be partially migrated with a comment asking the user
// to fill in capacity:
//
// func case6_1(ptr: UnsafePointer<C>) {
//   // Replace <<capacity>> with the number of `D` values in memory
//   // pointed to by `ptr`.
//   ptr.withMemoryRebound(to: D.self, capacity: <<capacity>>) {
//     takesConstDPtr($0)
//   }
// }
// func case6_2(ptr: UnsafeMutablePointer<C>) {
//   // Replace <<capacity>> with the number of `D` values in memory
//   // pointed to by `ptr`.
//   ptr.withMemoryRebound(to: D.self, capacity: <<capacity>>) {
//     takesDPtr($0)
//   }
// }
func case6_1(ptr: UnsafePointer<C>) {
  takesConstDPtr(UnsafePointer(ptr))
}
func case6_2(ptr: UnsafeMutablePointer<C>) {
  takesDPtr(UnsafeMutablePointer(ptr))
}
~~~

### 7. Use `UnsafeRawPointer.load(as:)` for Unsafe[Mutable]Pointer<T>.pointee getters.

Find occurrences of `Unsafe[Mutable]Pointer<Pointee>` initializers in
which the initialized expression is only used to access the `pointee`.

`Unsafe[Mutable]Pointer[<T>](ptr).pointee`

These can be replaced with the pattern:

`UnsafeRawPointer(ptr).load(as: T.self)`

Occasionally, the `advanced(by:)` method is invoked on the expression prior to accessing the `pointee`:

`Unsafe[Mutable]Pointer[<T>](ptr).advanced(by: n).pointee`

This can be replaced with:

`UnsafeRawPointer(ptr).load(fromByteOffset: n * MemoryLayout<T>.stride, as: T.self)`

Example:

~~~
// Case #7: Unsafe[Mutable]Pointer pointee load.
// This pattern can be replaced with an Unsafe[Mutable]Pointer.load(as:):
//
// func case7_1(ptr: UnsafePointer<C>) -> D {
//   return UnsafeRawPointer(ptr).load(as: D.self)
// }
// func case7_2(ptr: UnsafeMutablePointer<C>) -> D {
//   return UnsafeMutableRawPointer(ptr).load(as: D.self)
// }
// func case7_3(ptr: UnsafePointer<C>, n: Int) -> D {
//   return UnsafeRawPointer(ptr).load(fromByteOffset: n * MemoryLayout<D>.stride, as: D.self)
// }
// func case7_4(ptr: UnsafeMutablePointer<C>, n: Int) -> D {
//   return UnsafeMutableRawPointer(ptr).load(fromByteOffset: n * MemoryLayout<D>.stride, as: D.self)
// }
func case7_1(ptr: UnsafePointer<C>) -> D {
  return UnsafePointer<D>(ptr).pointee
}
func case7_2(ptr: UnsafeMutablePointer<C>) -> D {
  return UnsafeMutablePointer<D>(ptr).pointee
}
func case7_3(ptr: UnsafePointer<C>, n: Int) -> D {
  return UnsafePointer<D>(ptr).advanced(by: n).pointee
}
func case7_4(ptr: UnsafeMutablePointer<C>, n: Int) -> D {
  return UnsafeMutablePointer<D>(ptr).advanced(by: n).pointee
}
~~~

Note that, as with accessing `UnsafePointer.pointee`, calling
`UnsafeRawPointer.load(as:)` requires the underlying pointer to be
properly aligned for the specified type. Reading misaligned data can
currently only be done by using an API that copies a byte buffer, such
as `UnsafeRawPointer.copyBytes`. Directly loading misaligned data will
likely be a future addition to the `UnsafeRawPointer` API.
