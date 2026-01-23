---
layout: new-layouts/post
published: true
date: 2026-01-22 12:00:00
title: "Improving the usability of C libraries in Swift"
author: [doug_gregor]
category: "Language"
---

There are many interesting, useful, and fun C libraries in the software ecosystem. While one could go and rewrite these libraries in Swift, usually there is no need, because Swift provides direct interoperability with C. With a little setup, you can directly use existing C libraries from your Swift code. 

When you use a C library directly from Swift, it will look and feel similar to using it from C. That can be useful if you're following sample code or a tutorial written in C, but it can also feel out of place. For example, here's a small amount of code using a C API:

```swift
  var instanceDescriptor = WGPUInstanceDescriptor()
  let instance = wgpuCreateInstance(&instanceDescriptor)
  var surfaceDescriptor = WGPUSurfaceDescriptor()
  let surface = wgpuInstanceCreateSurface(instance, &surfaceDescriptor)
  if wgpuSurfacePresent(&surface) == WGPUStatus_Error {
      // report error
  }
  wgpuSurfaceRelease(surface)
  wgpuInstanceRelease(instance)
```

The C library here that Swift is using comes from the [webgpu-headers project](https://github.com/webgpu-native/webgpu-headers), which vends a C header (`webgpu.h`) that is used by several implementations of [WebGPU](https://www.w3.org/TR/webgpu/). WebGPU  is a technology that enables web developers to use the system's GPU (Graphics Processing Unit) from the browser. For the purposes of this post, you don't really need to know anything about WebGPU: I'm using it as an example of a typical C library, and the techniques described in this blog post apply to lots of other well-designed C libraries.

The Swift code above has a very "C" feel to it. It has global function calls with prefixed names like `wgpuInstanceCreateSurface` and global integer constants like `WGPUStatus_Error`. It pervasively uses unsafe pointers, some of which are managed with explicit reference counting, where the user provides calls to `wpuXYZAddRef` and `wgpuXYZRelease` functions. It works, but it doesn't feel like Swift, and inherits various safety problems of C.

Fortunately, we can improve this situation, providing a safer and more ergonomic interface to WebGPU from Swift that feels like it belongs in Swift. More importantly, we can do so without changing the WebGPU implementation: Swift provides a suite of annotations that you can apply to C headers to improve the way in which the C APIs are expressed in Swift. These annotations describe common conventions in C that match up with Swift constructs, projecting a more Swift-friendly interface on top of the C code.

In this post, I'm going to use these annotations to improve how Swift interacts with the WebGPU C code. By the end, we'll be able to take advantage of Swift features like argument labels, methods, enums, and automatic reference counting, like this:

```swift
  var instanceDescriptor = WGPUInstanceDescriptor()
  let instance = WGPUInstance(descriptor: &instanceDescriptor)
  var surfaceDescriptor = WGPUSurfaceDescriptor()
  let surface = instance.createSurface(descriptor: &surfaceDescriptor)
  if surface.present() == .error {
      // report error
  }
  // Swift automatically deallocates the instance and surface when we're done
```

These same annotations can be used for any C library to provide a safer, more ergonomic development experience in Swift without changing the C library at all.

> **Note**: Some of what is covered in this post requires bug fixes that first became available in Swift 6.2.3.

## Setup: Writing a module map

A [module map](https://clang.llvm.org/docs/Modules.html) is a way of layering a Swift-friendly modular structure on top of C headers. You can create a module map for the WebGPU header by writing the following to a file `module.modulemap`:

```swift
module WebGPU {
  header "webgpu.h"
  export *
}
```

The easiest thing to do is to put `module.modulemap` alongside the header itself. For my experiment here, I put it in the root directory of my `webgpu-headers` checkout. If you're in a Swift package, put it into its own target with this layout:

```swift
├── Package.swift
└── Sources
    └── WebGPU
        ├── include
        │   ├── webgpu.h
        │   └── module.modulemap
        └── WebGPU.c (empty file)
```

If you reference this `WebGPU` target from elsewhere in the package, you can `import WebGPU` to get access to the C APIs.

## Seeing the results

There are a few ways to see what the Swift interface for a C library looks like. 

* The `swift-synthesize-interface` tool in Swift 6.2+ prints the Swift interface to the terminal.
* Xcode's "Swift 5 interface" counterpart to the `webgpu.h` header will show how the header has been mapped into Swift.

Let's do it from the command line, using `swift-synthesize-interface`. From the directory containing `webgpu.h` and `module.modulemap`, run:

```swift
xcrun swift-synthesize-interface -I . -module-name WebGPU -target arm64-apple-macos15 -sdk /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX26.0.sdk
```

The leading `xcrun` and the `-sdk` argument with the path is only needed on macOS; on other platforms, make sure `swift-synthesize-interface` is in your path. The `-target` operation is the triple provided if you run `swiftc -print-target-info`. It looks like this:

```json
{
  "compilerVersion": "Apple Swift version 6.2 (swiftlang-6.2.2.15.4 clang-1700.3.15.2)",
  "target": {
    "triple": "arm64-apple-macosx15.0",
    "unversionedTriple": "arm64-apple-macosx",
    "moduleTriple": "arm64-apple-macos",
    "compatibilityLibraries": [ ],
    "librariesRequireRPath": false
  },
  "paths": { ... }
}
```

The output of `swift-synthesize-interface` is the Swift API for the WebGPU module, directly translated from C. For example, this code from the WebGPU header:

```c
typedef enum WGPUAdapterType {
    WGPUAdapterType_DiscreteGPU = 0x00000001,
    WGPUAdapterType_IntegratedGPU = 0x00000002,
    WGPUAdapterType_CPU = 0x00000003,
    WGPUAdapterType_Unknown = 0x00000004,
    WGPUAdapterType_Force32 = 0x7FFFFFFF
} WGPUAdapterType WGPU_ENUM_ATTRIBUTE;
```

is translated into:

```swift
public struct WGPUAdapterType : Hashable, Equatable, RawRepresentable {
    public init(_ rawValue: UInt32)
    public init(rawValue: UInt32)
    public var rawValue: UInt32
}

public var WGPUAdapterType_DiscreteGPU: WGPUAdapterType { get }
public var WGPUAdapterType_IntegratedGPU: WGPUAdapterType { get }
public var WGPUAdapterType_CPU: WGPUAdapterType { get }
public var WGPUAdapterType_Unknown: WGPUAdapterType { get }
public var WGPUAdapterType_Force32: WGPUAdapterType { get }
```

and there are lots of global functions like this:

```swift
public func wgpuComputePipelineGetBindGroupLayout(_ computePipeline: WGPUComputePipeline!, _ groupIndex: UInt32) -> WGPUBindGroupLayout!
public func wgpuComputePipelineSetLabel(_ computePipeline: WGPUComputePipeline!, _ label: WGPUStringView)
public func wgpuComputePipelineAddRef(_ computePipeline: WGPUComputePipeline!)
public func wgpuComputePipelineRelease(_ computePipeline: WGPUComputePipeline!)
```

It's a starting point! You can absolutely write Swift programs using these WebGPU APIs, and they'll feel a lot like writing them in C. Let's see what we can do to make it better.

## Cleaning up enumeration types

C enums can be used for several things. Sometimes they really represent a choice among a number of alternatives. Sometimes they represent flags in a set of options, from which you can choose several. Sometimes they're just a convenient way to create a bunch of named constants. Swift conservatively imports enum types as wrappers over the underlying C type used to store values of the enum (e.g., `WGPUAdapterType` wraps a `UInt32`) and makes the enumerators into global constants. It covers all of the possible use cases, but it isn't *nice*.

The `WGPUAdapterType` enum really is a choice among one of several options, which would be best represented as an `enum` in Swift. If we were willing to modify the header, we could apply the [`enum_extensibility` attribute](https://clang.llvm.org/docs/AttributeReference.html#enum-extensibility) to the enum, like this:

```c
typedef enum __attribute__((enum_extensibility(closed))) WGPUAdapterType {
    WGPUAdapterType_DiscreteGPU = 0x00000001,
    WGPUAdapterType_IntegratedGPU = 0x00000002,
    WGPUAdapterType_CPU = 0x00000003,
    WGPUAdapterType_Unknown = 0x00000004,
    WGPUAdapterType_Force32 = 0x7FFFFFFF
} WGPUAdapterType WGPU_ENUM_ATTRIBUTE;
```

This works, and results in a much nicer Swift API:

```swift
@frozen public enum WGPUAdapterType : UInt32, @unchecked Sendable {
    case discreteGPU = 1
    case integratedGPU = 2
    case CPU = 3
    case unknown = 4
    case force32 = 2147483647
}
```

Now, we get an `enum` that we can switch over, and nice short case names, e.g.,

```swift
switch adapterType {
  case .discreteGPU, .integratedGPU:
    print("definitely a GPU")
  default:
    print("not so sure")
}
```

That's great, but I already broke my rule: no header modifications unless I have to!

## API notes

The problem of needing to layer information on top of existing C headers is not a new one. As noted earlier, Swift relies on a Clang feature called [API notes](https://clang.llvm.org/docs/APINotes.html) to let us express this same information in a separate file, so we don't have to edit the header. In this case, we create a file called `WebGPU.apinotes` (the name `WebGPU` matches the module name from `module.modulemap`), which is a YAML file describing the extra information. We'll start with one that turns `WGPUAdapterType` into an `enum`:

```yaml
---
Name: WebGPU
Tags:
- Name: WGPUAdapterType
  EnumExtensibility: closed
```

`Tags` here is a term used in the C and C++ standard to refer to enum, struct, union, or class types. Any information about those types in the API notes file will go into that section.

Put `WebGPU.apinotes` alongside the `module.modulemap`, and now `WGPUAdapterType` gets mapped into a `Swift` enum. For a package, the structure will look like this:

```swift
├── Package.swift
└── Sources
    └── WebGPU
        ├── include
        │   ├── webgpu.h
        │   ├── WebGPU.apinotes
        │   └── module.modulemap
        └── WebGPU.c (empty file)
```

We'll be adding more to this API notes file as we keep digging through the interface.

## Reference-counted object types

The WebGPU header has a number of "object" types that are defined like this:

```c
typedef struct WGPUBindGroupImpl* WGPUBindGroup WGPU_OBJECT_ATTRIBUTE;
```

This gets imported into Swift as an alias for an opaque pointer type, which is... not great:

```swift
public typealias WGPUBindGroup = OpaquePointer
```

WebGPU object types are reference counted, and each object type has corresponding `AddRef` and `Release` functions to increment and decrement the reference count, like this:

```c
WGPU_EXPORT void wgpuBindGroupAddRef(WGPUBindGroup bindGroup) WGPU_FUNCTION_ATTRIBUTE;
WGPU_EXPORT void wgpuBindGroupRelease(WGPUBindGroup bindGroup) WGPU_FUNCTION_ATTRIBUTE;
```

Of course, you can use these functions in Swift exactly how you do in C, making sure to balance out calls to `AddRef` and `Release`, but then it would be every bit as unsafe as C.

We can do better with [`SWIFT_SHARED_REFERENCE`](https://www.swift.org/documentation/cxx-interop/#shared-reference-types). It's a macro (defined in the `<swift/bridging>` header) that can turn a reference-counted C type like the above into an automatically reference-counted `class` in Swift. Here's how we would use it in the header:

```swift
typedef struct SWIFT_SHARED_REFERENCE(wgpuBindGroupAddRef, wgpuBindGroupRelease) WGPUBindGroupImpl* WGPUBindGroup WGPU_OBJECT_ATTRIBUTE;
```

Now, `WGPUBindGroup` gets imported like this:

```swift
public class WGPUBindGroupImpl { }
public typealias WGPUBindGroup = WGPUBindGroupImpl
```

The extra typealias is a little unexpected, but overall this is a huge improvement: Swift is treating `WGPUBindGroup` as a class, meaning that it automatically manages retains and releases for you! This is both an ergonomic win (less code to write) and a safety win, because it's eliminated the possibility of mismanaging these instances.

There's one more thing: when dealing with reference-counting APIs, you need to know whether a particular function that returns an object is expecting you to call "release" when you're done. In the WebGPU header, this information is embedded in a comment:

```c
/**
 * @returns
 * This value is @ref ReturnedWithOwnership.
 */
WGPU_EXPORT WGPUBindGroup wgpuDeviceCreateBindGroup(WGPUDevice device, WGPUBindGroupDescriptor const * descriptor) WGPU_FUNCTION_ATTRIBUTE;
```

"ReturnedWithOwnership" here means that the result of the call has already been retained one extra time, and the caller is responsible for calling "release" when they are done with it. The `<swift/bridging>` header has a `SWIFT_RETURNS_RETAINED` macro that expresses this notion. One can use it like this:

```swift
WGPU_EXPORT WGPUBindGroup wgpuDeviceCreateBindGroup(WGPUDevice device, WGPUBindGroupDescriptor const * descriptor) WGPU_FUNCTION_ATTRIBUTE SWIFT_RETURNS_RETAINED;
```

Now, Swift will balance out the retain that `wgpuDeviceCreateBindGroup` has promised to do by performing the extra release once you're done using the object. Once these annotations are done, we're all set with a more ergonomic and memory-safe API for this C library. There's no need to ever call `wgpuBindGroupRelease` or `wgpuBindGroupAddRef` yourself.

We've hacked up our header again, so let's undo that and move all of this out to API notes. To turn a type into a foreign reference type, we augment the `Tags` section of our API notes with the same information, but in YAML form:

```yaml
- Name: WGPUBindGroupImpl
  SwiftImportAs: reference
  SwiftReleaseOp: wgpuBindGroupRelease
  SwiftRetainOp: wgpuBindGroupAddRef
```

That makes `WGPUBindGroupImpl` import as a class type, with the given retain and release functions. We can express the "returns retained" behavior of the `wgpuDeviceCreateBindGroup` function like this:

```yaml
Functions:
- Name: wgpuDeviceCreateBindGroup
  SwiftReturnOwnership: retained
```

That's enums and classes, so now let's tackle... functions.

## Importing functions

A typical function from `webgpu.h`, like this:

```c
WGPU_EXPORT void wgpuQueueWriteBuffer(
    WGPUQueue queue, WGPUBuffer buffer, uint64_t bufferOffset, 
    void const * data, size_t size
) WGPU_FUNCTION_ATTRIBUTE;
```

will come into Swift like this:

```swift
public func wgpuQueueWriteBuffer(_ queue: WGPUQueue!, _ buffer: WGPUBuffer!, _ bufferOffset: UInt64, _ data: UnsafeRawPointer!, _ size: Int)
```

Note that `_` on each parameter, which means that we won't use argument labels for anything when we call it:

```swift
wgpuQueueWriteBuffer(myQueue, buffer, position, dataToWrite, bytesToWrite)
```

That matches C, but it isn't as clear as it could be in Swift. Let's clean this up by providing a better name in Swift that includes argument labels. We can do so using `SWIFT_NAME` (also in `<swift/bridging>`), like this:

```c
WGPU_EXPORT void wgpuQueueWriteBuffer(
      WGPUQueue queue, WGPUBuffer buffer, uint64_t bufferOffset,
      void const * data, size_t size
  ) WGPU_FUNCTION_ATTRIBUTE 
    SWIFT_NAME("wgpuQueueWriteBuffer(_:buffer:bufferOffset:data:size:)");
```

Within the parentheses, we have each of the argument labels that we want (or `_` meaning "no label"), each followed by a `:`. This is how one describes a full function name in Swift. Once we've made this change to the Swift name, the C function comes into Swift with argument labels, like this:

```swift
public func wgpuQueueWriteBuffer(_ queue: WGPUQueue!, buffer: WGPUBuffer!, bufferOffset: UInt64, data: UnsafeRawPointer!, size: Int)
```

That makes the call site more clear and self-documenting:

```swift
wgpuQueueWriteBuffer(myQueue, buffer: buffer, offset: position, data: dataToWrite, size: bytesToWrite)
```

### Importing functions as methods

There is more usable structure in this API. Note that the `wgpuQueueWriteBuffer` function takes, as its first argument, an instance of `WGPUQueue`. Most of the C functions in `WebGPU.h` are like this, because these are effectively functions that operate on their first argument. In a language that has methods, they would be methods. Swift has methods, so let's make them methods!

```c
WGPU_EXPORT void wgpuQueueWriteBuffer(
      WGPUQueue queue, WGPUBuffer buffer, uint64_t bufferOffset, void const * data, size_t size) 
  WGPU_FUNCTION_ATTRIBUTE SWIFT_NAME("WGPUQueueImpl.writeBuffer(self:buffer:bufferOffset:data:size:)");
```

There are three things to notice about this `SWIFT_NAME` string:

* It starts with `WGPUQueueImpl.`, which tells Swift to make this function a member inside `WGPUQueueImpl`.
* Let's change the function name to `writeBuffer`, because we no longer need the `wgpuQueue` prefix to distinguish it from other "write buffer" operations on other types.
* The name of the first argument in parentheses is `self`, which indicates that the `self` argument (in Swift) should be passed as that positional argument to the C function. The other arguments are passed in-order.

Note that this also requires `WGPUQueue(Impl)` to be imported as a `class`, as we did earlier for `WGPUBindGroupImpl`. Once we've done so, we get a much-nicer Swift API:

```swift
extension WGPUQueueImpl {
  /**
   * Produces a @ref DeviceError both content-timeline (`size` alignment) and d
evice-timeline
   * errors defined by the WebGPU specification.
   */
  public func writeBuffer(buffer: WGPUBuffer!, bufferOffset: UInt64, data: UnsafeRawPointer!, size: Int)
}
```

We've hacked up the header again, but didn't have to. In `WebGPU.apinotes`, you can put a `SwiftName` attribute on any entity. For `wgpuQueueWriteBuffer`, it would look like this (in the `Functions` section):

```yaml
- Name: wgpuQueueWriteBuffer
  SwiftName: WGPUQueueImpl.writeBuffer(self:buffer:bufferOffset:data:size:)
```

### Importing functions as properties

`WebGPU.h` has a number of `Get` functions that produce information about some aspect of a type. Here are two for the `WGPUQuerySet` type:

```c
WGPU_EXPORT uint32_t wgpuQuerySetGetCount(WGPUQuerySet querySet) WGPU_FUNCTION_ATTRIBUTE;
WGPU_EXPORT WGPUQueryType wgpuQuerySetGetType(WGPUQuerySet querySet) WGPU_FUNCTION_ATTRIBUTE;
```

With the `SWIFT_NAME` tricks above, we can turn these into "get" methods on `WGPUQuerySet`, like this:

```swift
extension WGPUQuerySetImpl {
    public func getCount() -> UInt32
    public func getType() -> WGPUQueryType
}
```

That's okay, but it's not what you'd do in Swift. Let's go one step further and turn them into read-only computed properties. To do so, use the `getter:` prefix on the Swift name we define. We'll skip ahead to the YAML form that goes into API notes:

```yaml
- Name: wgpuQuerySetGetCount
  SwiftName: getter:WGPUQuerySetImpl.count(self:)
- Name: wgpuQuerySetGetType
  SwiftName: getter:WGPUQuerySetImpl.type(self:)
```

And now, we arrive at a nice Swift API:

```swift
extension WGPUQuerySetImpl {
    public var count: UInt32 { get }
    public var type: WGPUQueryType { get }
}
```

### Importing functions as initializers

`SWIFT_NAME` can also be used to import a function that returns a new instance as a Swift initializer. For example, this function creates a new `WGPUInstance` (which we assume is getting imported as a `class` like we've been doing above):

```c
/**
 * Create a WGPUInstance
 *
 * @returns
 * This value is @ref ReturnedWithOwnership.
 */
WGPU_EXPORT WGPUInstance wgpuCreateInstance(WGPU_NULLABLE WGPUInstanceDescriptor const * descriptor) WGPU_FUNCTION_ATTRIBUTE;
```

We can turn this into a Swift initializer, which is used to create a new object, using the same `SWIFT_NAME` syntax but where the method name is `init`. Here is the YAML form that goes into API notes:

```yaml
- Name: wgpuCreateInstance
  SwiftReturnOwnership: retained
  SwiftName: WGPUInstanceImpl.init(descriptor:)
```

and here is the resulting Swift initializer:

```swift
extension WGPUInstanceImpl {
    /**
     * Create a WGPUInstance
     *
     * @returns
     * This value is @ref ReturnedWithOwnership.
     */
    public /*not inherited*/ init!(descriptor: UnsafePointer<WGPUInstanceDescriptor>!)
}
```

Now, one can create a new `WGPUInstance` with the normal object-creation syntax, e.g.,

```swift
let instance = WGPUInstance(descriptor: myDescriptor)
```

## Another Boolean type?

The WebGPU header defines its own Boolean type. I wish everyone would use C99's `_Bool` and be done with it, but alas, here are the definitions for WebGPUs Boolean types:

```c
#define WGPU_TRUE (UINT32_C(1))
#define WGPU_FALSE (UINT32_C(0))
typedef uint32_t WGPUBool;
```

This means that `WGPUBool` will come in to Swift as a `UInt32`. The two macros aren't available in Swift at all: they're "too complicated" to be recognized as integral constants. Even if they were available in Swift, it still wouldn't be great because we want to use `true` and `false` for Boolean values in Swift, not `WGPU_TRUE` and `WGPU_FALSE`.

To make `WGPUBool` easier to use from Swift, we're first going to map that typedef to its own `struct` that stores the underlying `UInt32`, giving it an identity separate from `UInt32`. We can do this using a `SwiftWrapper` API note within the `Typedefs` section of the file, like this:

```yaml
- Name: WGPUBool
  SwiftWrapper: struct
```

Now, we get `WGPUBool` imported like this:

```swift
public struct WGPUBool : Hashable, Equatable, RawRepresentable {
    public init(_ rawValue: UInt32)
    public init(rawValue: UInt32)
}
```

To be able to use `true` and `false` literals with this new `WGPUBool`, we can write a little bit of Swift code that makes this type conform to the [`ExpressibleByBooleanLiteral`](https://developer.apple.com/documentation/swift/expressiblebybooleanliteral) protocol, like this:

```swift
extension WGPUBool: ExpressibleByBooleanLiteral {
  init(booleanLiteral value: Bool) {
    self.init(rawValue: value ? 1 : 0)
  }
}
```

That's it! Better type safety (you cannot confuse a `WGPUBool` with any other integer value) and the convenience of Boolean literals in Swift.

## Option sets

`webgpu.h` describes a set of flags using a `typedef` of the `WGPUFlags` type (a 64-bit unsigned integer) along with a set of global constants for the different flag values. For example, here is the `WGPUBufferUsage` flag type and some of its constants:

```c
typedef WGPUFlags WGPUBufferUsage;
static const WGPUBufferUsage WGPUBufferUsage_MapRead = 0x0000000000000001;
static const WGPUBufferUsage WGPUBufferUsage_MapWrite = 0x0000000000000002;
static const WGPUBufferUsage WGPUBufferUsage_CopySrc = 0x0000000000000004;
static const WGPUBufferUsage WGPUBufferUsage_Index = 0x0000000000000010;
```

Similar to what we saw with `WGPUBool`, `WGPUBufferUsage` is a `typedef` of a `typedef` of a `uint64_t`. There's no type safety in this C API, and one could easily mix up these flags with, say, those of `WGPUMapMode`:

```c
typedef WGPUFlags WGPUMapMode;
static const WGPUMapMode WGPUMapMode_Read = 0x0000000000000001;
static const WGPUMapMode WGPUMapMode_Write = 0x0000000000000002;
```

We can do better, by layering more structure for the Swift version of this API using the same `SwiftWrapper` approach from `WGPUBool`. This goes into the `Typedefs` section of API notes:

```yaml
Typedefs:
- Name: WGPUBufferUsage
  SwiftWrapper: struct
```

Now, `WGPUBufferUsage` comes in as its own `struct`:

```swift
public struct WGPUBufferUsage : Hashable, Equatable, RawRepresentable {
    public init(_ rawValue: WGPUFlags)
    public init(rawValue: WGPUFlags)
}
```

The initializers let you create a `WGPUBufferUsage` from a `WGPUFlags` value, and there is also a `rawValue` property to get a `WGPUFlags` value out of a `WGPUBufferInstance`, so the raw value is always there... but the default is to be type safe. Additionally, those global constants will come in as members of `WGPUBufferUsage`, like this:

```swift
extension WGPUBufferUsage {
    /**
     * The buffer can be *mapped* on the CPU side in *read* mode (using @ref WGPUMapMode_Read).
     */
    public static var _MapRead: WGPUBufferUsage { get }

    /**
     * The buffer can be *mapped* on the CPU side in *write* mode (using @ref WGPUMapMode_Write).
     *
     * @note This usage is **not** required to set `mappedAtCreation` to `true` in @ref WGPUBufferDescriptor.
     */
    public static var _MapWrite: WGPUBufferUsage { get }

    /**
     * The buffer can be used as the *source* of a GPU-side copy operation.
     */
    public static var _CopySrc: WGPUBufferUsage { get }

    /**
     * The buffer can be used as the *destination* of a GPU-side copy operation.
     */
    public static var _CopyDst: WGPUBufferUsage { get }
}
```

This means that, if you're passing a value of type `WPUBufferUsage`, you can use the shorthand "leading dot" syntax. For example:

```swift
func setBufferUsage(_ usage: WGPUBufferUsage) { ... }

setBufferUsage(._MapRead)
```

Swift has dropped the common `WPUBufferUsage` prefix from the constants when it made them into members. However, the resulting names aren't great. We can rename them by providing a `SwiftName` in the API notes file within the `Globals` section:

```yaml
Globals:
- Name: WGPUBufferUsage_MapRead
  SwiftName: WGPUBufferUsage.mapRead
- Name: WGPUBufferUsage_MapWrite
  SwiftName: WGPUBufferUsage.mapWrite
```

We can go one step further by making the `WGPUBufferUsage` type conform to Swift's [`OptionSet`](https://developer.apple.com/documentation/swift/optionset) protocol. If we revise the API notes like this:

```yaml
Typedefs:
- Name: WGPUBufferUsage
  SwiftWrapper: struct
  SwiftConformsTo: Swift.OptionSet
```

Now, we get the nice option-set syntax we expect in Swift:

```swift
let usageFlags: WGPUBufferUsage = [.mapRead, .mapWrite]
```

## Nullability

Throughout `webgpu.h`, the `WGPU_NULLABLE` macro is used to indicate pointers that can be NULL. The implication is that any pointer that is not marked with `WGPU_NULLABLE` cannot be NULL. For example, here is the definition of `wgpuCreateInstance` we used above:

```c
WGPU_EXPORT WGPUInstance wgpuCreateInstance(WGPU_NULLABLE WGPUInstanceDescriptor const * descriptor) WGPU_FUNCTION_ATTRIBUTE;
```

The `WGPU_NULLABLE` indicates that it's acceptable to pass a NULL pointer in as the `descriptor` parameter. Clang already has [nullability specifiers](https://clang.llvm.org/docs/AttributeReference.html#nullability-attributes) to express this information. We could alter the declaration in the header to express that this parameter is nullable but the result type is never NULL, like this:

```swift
WGPU_EXPORT WGPUInstance _Nonnull wgpuCreateInstance(WGPU_NULLABLE WGPUInstanceDescriptor const * _Nullable descriptor) WGPU_FUNCTION_ATTRIBUTE;
```

This eliminates the implicitly-unwrapped optionals (`!`) from the signature of the initializer, so we end up with one that explicitly accepts a `nil` descriptor argument and always returns a new instance (never `nil`):

```swift
extension WGPUInstanceImpl {
    /**
     * Create a WGPUInstance
     *
     * @returns
     * This value is @ref ReturnedWithOwnership.
     */
    public /*not inherited*/ init(descriptor: UnsafePointer<WGPUInstanceDescriptor>?)
}
```

Now, I did cheat by hacking the header. Instead, we can express this with API notes on the parameters and result type by extending the entry we already have for `wgpuCreateInstance` like this:

```yaml
- Name: wgpuCreateInstance
  SwiftReturnOwnership: retained
  SwiftName: WGPUInstanceImpl.init(descriptor:)
  Parameters:
  - Position: 0
    Nullability: O
  ResultType: "WGPUInstance _Nonnull"
```

To specific nullability of pointer parameters, one can identify them by position (where 0 is the first parameter to the function) and then specify whether the parameter should come into Swift as optional (`O`, corresponds to `_Nullable`), non-optional (`N`, corresponds to `_Nonnull`) or by left unspecified as an implicitly-unwrapped optional (`U`, corresponds to `_Null_unspecified`). For the result type, it's a little different: we specified the result type along with the nullability specifier, i.e., `WGPUInstance _Nonnull`. The end result of these annotations is the same as the modified header, so we can layer nullability information on top of the header.

## Scripting the creation of `WebGPU.apinotes`

`webgpu.h` is about 6,400 lines long, and is regenerated from a database of the API as needed. Each of the WebGPU implementations seems to augment or tweak the header a bit. So, rather than grind through and manually do annotations, I wrote a little Swift script to "parse" `webgpu.h`, identify its patterns, and generate `WebGPU.apinotes` for most of what is discussed in this post. The entirety of the script is [here](/assets/blog/improving-usability-of-c-libraries-in-swift/webgpu_apinotes.swift). It reads `webgpu.h` from standard input and prints `WebGPU.apinotes` to standard output.

Because `webgpu.h` is generated, it has a very regular structure that we can pick up on via regular expressions. For example:

```swift
// Enum definitions, marked by WGPU_ENUM_ATTRIBUTE.
let enumMatcher = /} (?<name>\w+?) WGPU_ENUM_ATTRIBUTE/

// Object definitions, marked by WGPU_OBJECT_ATTRIBUTE.
let objectMatcher = /typedef struct (?<implName>\w+?)\* (?<name>\w+?) WGPU_OBJECT_ATTRIBUTE;/

// Function declarations, marked by WGPU_FUNCTION_ATTRIBUTE
let functionMatcher = /WGPU_EXPORT (?<nullableResult>WGPU_NULLABLE ?)?(?<resultType>\w+?) (?<name>\w+?)\((?<parameters>.*\)?) WGPU_FUNCTION_ATTRIBUTE;/
let parameterMatcher = /(?<type>[^),]+?) (?<name>\w+?)[),]/
```

That's enough to identify all of the enum types (so we can emit the `EnumExtensibility: closed` API notes), object types (to turn them into shared references), and functions (which get nicer names and such). The script is just a big `readLine` loop that applies the regexes to capture all of the various types and functions, then does some quick classification before printing out the API notes. The resulting API notes are [in WebGPU.apinotes](/assets/blog/improving-usability-of-c-libraries-in-swift/WebGPU.apinotes), and the generated Swift interface after these API notes are applied is [here](/assets/blog/improving-usability-of-c-libraries-in-swift/WebGPU.swiftinterface). You can run it with, e.g.,

```shell
swift -enable-bare-slash-regex webgpu_apinotes.swift < webgpu.h
```

This script full of regular expressions is, admittedly, a bit of a hack. A better approach for an arbitrary C header would be to use [`libclang`](https://clang.llvm.org/docs/LibClang.html) to properly parse the headers. For WebGPU specifically, the webgpu-headers project contains a database from which the header is generated, and one could also generate API notes directly from that database. Regardless of how you get there, many C libraries have well-structured headers with conventions that can be leveraged to create safer, more ergonomic projections in Swift.

## Swiftifying your favorite C library

The techniques described in this post can be applied to just about any C library. To do so, I recommend setting up a small package like the one described here for WebGPU, so you can iterate quickly on example code to get a feel for how the Swift projection of the C API will work. The annotations might not get you all the way to the best Swift API, but they are a lightweight way to get most of the way there. Feel free to also extend the C types to convenience APIs that make sense in Swift, like I did above to make `WGPUBool` conform to `ExpressibleByBooleanLiteral`. 

A little bit of annotation work on your favorite C library can make for a safer, more ergonomic, more Swifty experience of working with that library.

## Postscript: Thoughts for improving the generated `webgpu.h`

The regular structure of `webgpu.h` helped considerably when trying to expose the API nicely in Swift. That said, there are a few ways in which `webgpu.h` could be improved to require less annotation for this purpose:

* `WGPU_ENUM_ATTRIBUTE` would be slightly nicer if placed on the `enum` itself, rather than on the `typedef`. If it were there, we could use

  ```c
  #define WGPU_ENUM_ATTRIBUTE __attribute__((enum_extensibility(closed)))
  ```

  and not have to generate any API notes to bring these types in as proper enums in Swift.

* `WGPU_OBJECT_ATTRIBUTE` could provide the names of the retain and release operations and be placed on the `struct` itself. If it were there, we could use

  ```c
  #define WGPU_OBJECT_ATTRIBUTE(RetainFn,ReleaseFn) SWIFT_SHARED_REFERENCE(RetainFn,ReleaseFn)
  ```

  and not have to generate any API notes to bring these types in as classes in Swift.

* `WGPU_NULLABLE` could be placed on the pointer itself (i.e., after the `*`) rather than at the beginning of the type, to match the position of [Clang's nullability attributes](https://clang.llvm.org/docs/AttributeReference.html#nullability-attributes). If it were placed there, then

  ```c
  #define WGPU_NULLABLE _Nullable
  ```

  would work with Clangs' longstanding nullable-types support. Swift would then import such pointers as optional types (with `?`). Moreover, if some macros `WGPU_ASSUME_NONNULL_BEGIN` and `WGPU_ASSUME_NONNULL_END` were placed at the beginning and end of the header, they could be mapped to Clang's pragmas to assume that any pointer not marked "nullable" is always non-null:
  ```c
  #define WGPU_ASSUME_NONNULL_BEGIN #pragma clang assume_nonnull begin
  #define WGPU_ASSUME_NONNULL_END #pragma clang assume_nonnull end
  ```

  This would eliminate all of the implicitly unwrapped optionals (marked `!` in the Swift interface), making it easier to use safely.
