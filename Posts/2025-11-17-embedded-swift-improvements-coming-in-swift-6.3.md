---
layout: new-layouts/post
published: true
date: 2025-11-17 12:00:00
title: "Embedded Swift Improvements Coming in Swift 6.3"
author: [doug_gregor, rauhul]
category: "Language"
---

[Embedded Swift](/get-started/embedded/) is a subset of Swift that’s designed for low resource usage, making it capable of running on constrained environments like microcontrollers. Using a special compilation mode, Embedded Swift produces significantly smaller binaries than regular Swift. While a subset of the full language, the vast majority of the Swift language works exactly the same in Embedded Swift. Additional information is described in the [Embedded Swift vision document](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md).

Embedded Swift is evolving rapidly. This post describes a number of improvements made in the last few months, covering everything from improved C interoperability to better debugging and steps toward a complete linkage model for Embedded Swift.
These features and bug fixes are included in the upcoming [Swift 6.3](https://forums.swift.org/t/swift-6-3-release-process/82843) release, and you can try them out today with a [Swift development snapshot](https://www.swift.org/install/).

## Libraries and Diagnostics

### Printing floating point numbers

Previously, the `description` and `debugDescription` properties for floating-point types (`Float`, `Double`, etc.) were not available in the Embedded Swift standard library. With a new [all-Swift implementation](https://github.com/swiftlang/swift/pull/84826), you can now use these with Embedded Swift.

### Embedded restriction diagnostics

There is a new opt-in set of warnings in the [EmbeddedRestrictions](https://docs.swift.org/compiler/documentation/diagnostics/embedded-restrictions) diagnostic group that diagnoses language constructs that aren’t available in Embedded Swift, such as uses of untyped throws or calling generic functions on existential values.
These diagnostics are enabled by default when building Embedded Swift, and can also be enabled in non-Embedded Swift using the compiler flag `-Wwarning EmbeddedRestrictions` or in the package manifest with:

```swift
swiftSettings: [
    .treatWarning("EmbeddedRestrictions", as: .warning),
]
```

Read the full details at [EmbeddedRestrictions](https://docs.swift.org/compiler/documentation/diagnostics/embedded-restrictions).

### Swift MMIO 0.1.x

The [0.1.x release](https://github.com/apple/swift-mmio/releases/tag/0.1.0) of Swift MMIO, a package for memory-mapped I/O, includes many bug fixes and quality-of-life improvements, plus newly written comprehensive [documentation](https://swiftpackageindex.com/apple/swift-mmio/documentation/mmio) on the Swift Package Index.

The biggest addition is code generation support. There's now an [svd2swift tool](https://swiftpackageindex.com/apple/swift-mmio/documentation/svd2swift) and corresponding [SwiftPM plugin](https://swiftpackageindex.com/apple/swift-mmio/documentation/svd2swift/usingsvd2swiftplugin) that generates Swift MMIO interfaces directly from CMSIS System View Description (SVD) files. You can run it manually from the command line, or configure the plugin to handle everything automatically at build time.

Debugging also got a nice upgrade with [SVD2LLDB](https://swiftpackageindex.com/apple/swift-mmio/documentation/svd2lldb).
This LLDB plugin lets you work with device registers using their actual names instead of fumbling with the raw memory addresses.
It even includes visual decoding support to help you make sense of register values.
For example, here's what it looks like when you decode a hypothetical timer control register:

```swift
(lldb) svd decode TIMER0.CR 0x0123_4567 --visual
TIMER0.CR: 0x0123_4567

                      ╭╴CNTSRC  ╭╴RST
  ╭╴S   ╭╴RELOAD╭╴CAPEDGE  ╭╴MODE
  ┴     ┴─      ┴─    ┴─── ┴──  ┴
0b00000001001000110100010101100111
      ┬─    ┬─    ┬───    ┬   ┬─ ┬
      ╰╴IDR ╰╴TRGEXT      ╰╴PSC  ╰╴EN
                  ╰╴CAPSRC    ╰╴CNT

[31:31] S       0x0 (STOP)
[27:26] IDR     0x0 (KEEP)
[25:24] RELOAD  0x1 (RELOAD1)
[21:20] TRGEXT  0x2 (DMA2)
[17:16] CAPEDGE 0x3
[15:12] CAPSRC  0x4 (GPIOA_3)
[11:8]  CNTSRC  0x5 (CAP_SRC_div32)
[7:7]   PSC     0x0 (Disabled)
[6:4]   MODE    0x6
[3:2]   CNT     0x1 (Count_DOWN)
[1:1]   RST     0x1 (Reset_Timer)
[0:0]   EN      0x1 (Enable)
```

## C Interoperability

### `@c` functions and enums

The Swift evolution proposal [SE-0495](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0495-cdecl.md) provides support for defining C-compatible functions and enums with the `@c` attribute. For example, the following declaration defines a function that is callable from C with the name `MyLib_initialize`:

```swift
@c(MyLib_initialize)
public func initialize() { ... }
```

The Swift generated header from the above example, which can be included in any C/C++ code, contains a declaration of this C function:

```c
void MyLib_initialize(void); 
```

This feature also works with the `@implementation` attribute introduced in [SE-0436](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0436-objc-implementation.md). If you have a pre-existing C header that documents a C interface, you can implement that C interface with a Swift function such as:

```swift
@c @implementation
public func MyLib_initialize() { ... }
```

The Swift compiler ensures that the signature of the Swift function matches that of the C header. This allows you to replace an existing C library with a Swift implementation without affecting C clients.

The `@c` attribute formalizes the `@_cdecl` attribute, fixing a number of corner cases in the process.

### Improved tolerance of mismatching C signatures

The Swift compiler has historically required precise consistency between the Swift types for C functions imported from headers or declared in Swift with `@c` (formerly `@_cdecl`) or `@_extern(c)`. For example, if you declared a C function without nullability annotations in a header:

```c
void takePointer(const double *);
```

And then separately defined in Swift with, for example:

```swift
@c func takePointer(_ values: UnsafePointer<Double>) { ... }
```

The compiler could fail to compile when it noticed the mismatch, often with a hard-to-understand “deserialization” failure. The compiler now keeps the different views on the underlying C declaration separate, diagnosing problems when the underlying C declarations themselves are inconsistent. This allows subtle differences such as nullability or sendability annotations to occur in C signatures without failing to compile.

## Debugging 

### Debugger printing of values

LLDB’s support for printing the values of Swift types in Embedded Swift has been improved. In addition, the `memory read` command now supports an optional Swift type name, so that you can take an arbitrary address and render it as a value of that named Swift type.
The following example shows interpreting the address as the type `MyMessage`:

```swift
(lldb) memory read -t MyMessage 0x000000016fdfe970
(MessageLib.MyMessage) 0x16fdfe970 = {
  id = 15
  timestamp = 793219406
  payload = "hello"
  ...
}
```

### More data types inspectable in core dumps

LLDB needs access to type layout information so it can display variables. Since Embedded Swift doesn't contain reflection metadata, the Swift compiler emits all the type layout information as DWARF debug info.
There have been several improvements to the Swift compiler's debug info output, such as support for type declarations nested inside an extension.
At the same time, LLDB added support for nested generic type aliases in Embedded Swift.
These two improvements together make it possible to inspect many common standard library data types, such as `Dictionary` and `Array`, in Embedded Swift core dumps.
Previously these data types were only accessible via the expression evaluator, which requires a live process. 

LLDB also has native support for the new `InlineArray` data type.

### Debugger armv7m exception frames unwinding

LLDB's support for producing backtraces after taking exceptions in armv7m has been greatly improved. Previously after taking an exception, you would be presented with a back trace like the following:

```swift
(lldb) bt
* thread 1
  * frame #0: 0x0020392c NeoPixelRainbow`NeoPixelRainbow.swift_UsageFault_Handler() -> () + 28
    frame #1: 0x00203910 NeoPixelRainbow`UsageFault_Handler + 8
    frame #2: 0xfffffff8
    frame #3: 0x00202a86 NeoPixelRainbow`NeoPixelRainbow_main + 8
    frame #4: 0x00200256 NeoPixelRainbow`cinit_ctor_loop_end at startup.S:98
    frame #5: 0x00200210 NeoPixelRainbow`Reset_Handler at startup.S:33
```

However this back trace would often be missing one or more frames before the start of the exception frame (`UsageFault_Handler` above).

Now, LLDB is able to walk back through exception frames into the standard program frames and produce a backtrace that contains the missing frames.

```swift
(lldb) bt
* thread #1
  * frame #0: 0x0020392c NeoPixelRainbow`swift_UsageFault_Handler() + 28
    frame #1: 0x00203910 NeoPixelRainbow`swift_UsageFault_Handler()
    frame #2: 0x00203366 NeoPixelRainbow`static Application.main() + 2270 // Real exception location
    frame #3: 0x00202a86 NeoPixelRainbow`NeoPixelRainbow_main + 8
    frame #4: 0x00200256 NeoPixelRainbow`cinit_ctor_loop_end + 18
    frame #5: 0x00200210 NeoPixelRainbow`Reset_Handler + 16
```

## Linking

### `@section` and `@used` attributes

The Swift evolution proposal [SE-0492](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0492-section-control.md) introduced two new attributes that are useful in Embedded Swift. The `@section` attribute specifies that a particular global variable should be emitted into the named section:

```swift
@section("__DATA,mysection")
@used
let myLinkerSetEntry: Int = 42
```

Also included is an `objectFormat` check that can be used within `#if` to conditionalize code on the various object formats (ELF, COFF, MachO, Wasm), that you can use to provide different section names:

```swift
#if objectFormat(ELF)
@section("mysection")
#elseif objectFormat(MachO)
@section("__DATA,mysection")
#endif
var global = ...
```

The `@used` attribute lets the compiler know that the entity it’s attached to should always be emitted, even if it appears unused.

### Progress on the Embedded Swift linkage model

Embedded Swift uses a different compilation model from regular Swift that delays code generation to later in the compilation process. This compilation model has not been fully defined and has various practical problems. One such issue involves duplicate symbols: if you have four Embedded Swift libraries whose dependencies form a diamond, like this:

```
  A
 / \
B   C
 \ /
  D
```

Then symbols from `A` that are used in both `B` and `C` would cause duplicate definition errors when linking both into `D`. The Swift compiler now emits symbols from imported modules using weak definitions, so the linker can de-duplicate them. This eliminates the need for flags like `-mergeable-symbols` and `-emit-empty-object-file` that provided partial workarounds.

Another step along the path to formalizing the Embedded Swift linkage model is [SE-0497](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0497-definition-visibility.md), which defines a new `@export` attribute that controls how a function is visible to clients. The spelling `@export(implementation)` makes the implementation available for clients to emit, specialize, or inline, subsuming the longstanding but unofficial `@_alwaysEmitIntoClient` attribute. The spelling `@export(interface)` ensures that only the interface and *not* the definition of the function is made available to clients by emitting a callable symbol, allowing library developers to fully hide the implementation of a function even in Embedded Swift.

## Try it out!

Embedded Swift support is available in the [Swift development snapshots](/install/). The best way to get started is through the examples in the [Swift Embedded Examples](https://github.com/swiftlang/swift-embedded-examples) repository, which contains a number of sample projects to get Embedded Swift code building and running on various hardware.

If you have questions about the improvements described here, or want to discuss your own Embedded Swift work, we encourage you to join the conversation on the Swift forums. You can ask about this post in the [associated thread](https://forums.swift.org/t/embedded-swift-improvements-coming-in-swift-6-3/83268), and share your experiences in the [Embedded Swift category](https://forums.swift.org/c/platform/embedded/).
