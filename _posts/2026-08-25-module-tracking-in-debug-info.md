---
layout: new-layouts/post
published: false
date: 2026-08-25 11:30
title: "Module Tracking in Swift Debug Info"
author: [adrianprantl]
category: "Developer Tools"
---
Starting with Swift 6.3, and completed in 6.4, there are some changes coming to how the Swift compiler references explicitly-built Swift modules in debug info. The majority of developers will automatically benefit from **faster**, more **reliable debugging** and **smaller build products**, without any modifications to their SwiftPM or Xcode projects. For developers who **maintain their own build systems** using, for example, Bazel, Buck, or CMake, **some adjustments may be necessary** to take advantage of these changes.
This article explains how Swift modules are used by the debugger, and how they are related to debugging. Next, it explains how Swift 6.3+ changes how modules are tracked in debug info to solve several problems with the previous representation. Finally, it shows how to adjust build systems to make use of the new representation, and eliminate some build steps that are no longer necessary.

## Swift modules and expression evaluation

LLDB’s standout feature is its [powerful expression evaluator](https://lldb.llvm.org/#compiler-integration-benefits). Because LLDB embeds the Clang and Swift compilers, it can JIT-compile any valid source code and run it in the context of your application while stopped at a breakpoint. This includes not just calling code in your application, but also defining new data types, functions, and closures. Debugging features that are usually reserved for interpreted or JIT-compiled languages like JavaScript become available to ahead-of-time-compiled languages like C++ and, of course, Swift!
In order to JIT-compile user expressions that make use of data types defined in the debugged program, LLDB’s embedded Swift compiler needs to import the Swift modules defining those types. In a world before explicitly-built modules, LLDB would find the base name of the main module at the current breakpoint in the debug info and then kick off an implicit import of a module with that name. With a cold module cache this would launch an expensive compilation of that module and all its dependencies.

To illustrate this, let’s walk through a simple example:

```swift
(lldb) p myObj
```

Here `myObj` is just a local variable: LLDB can find its location in the debug info and resolve its type via reflection metadata. No need to bother the Swift compiler.
Let’s make it more complex:

```swift
(lldb) p myObj.myComputedProperty
```

In this case, `myComputedProperty` is really a function call; in order to evaluate this, LLDB needs the expression evaluator to run code in the target. In order to initialize a Swift compiler instance with the state of the current module, LLDB finds the name of the current function’s Swift module in debug info.
We can visualize what LLDB does using the `dwarfdump` utility:

```bash
$ dwarfdump Foo.o
...
DW_TAG_module
  DW_AT_name ("Foo")
```

Conceptually, LLDB then wraps the expression in a function that can be compiled:

```swift
(lldb) log enable lldb expr
(lldb) p myObj.myComputedProperty
...
import Foo

func lldb_expr(_ $__lldb_arg : UnsafeMutablePointer<Any>) {
  let myObj: MyObject = /* some LLDB magic */
  // Expression begins here:
  myObj.myComputedProperty
  ...
```

One problem with this is that `import Foo` is quite imprecise: Even though the Swift language doesn’t allow multiple modules to have the same name, even the most stringently engineered application may have more than one copy of the same module. For example, there might be a private version of a module containing all of its private declarations (which would be great for LLDB) and also a Swift interface file that only contains the public interface for the module. Or there might be `macOS` and `Mac Catalyst` variants of the same module in the same process.

## Swift modules, debug info, and the build system

Let’s look at where those modules are found next. In order to communicate the location of `Foo.swiftmodule` to LLDB, Swift build systems rely on some cooperation from the linker. On Darwin the system linker accepts an option called `-add_ast_path` and build systems are expected to specify this option to list every binary Swift module when linking.

```bash
# Linker invocation on macOS
ld -add_ast_path /path/to/Foo.swiftmodule Foo.o -o MyApplication
```

The linker translates these options into symbol table entries. The debug info linker `dsymutil` then collects all Swift modules and stores them in a special `__swift_ast` section in the dSYM bundle, where LLDB can find them by name. Alternatively, when debugging without dSYM bundles, LLDB reads the symbol table entries in the binary to collect a list of all binary Swift modules.
Such an approach would not work on platforms where the linker isn’t aware of Swift. For these platforms the Swift compiler provides a `-modulewrap` action that takes a binary Swift module and outputs an object file with a `.swift_ast` section holding the contents of the module. This object file can then be passed to any linker to get added to the binary, where LLDB can find it.

```bash
# Modulewrap and linker invocation on Linux
swift-frontend -modulewrap Foo.swiftmodule -o Foo.swiftmodule.o
lld Foo.o Foo.swiftmodule.o -o MyApplication
```

This can create scalability issues, especially for large applications:
- Module files can get large and for an entire application you can often end up with a large portion of the SDK in your Linux or Windows binary. That can be quite problematic for the binary size.
- As mentioned above, the chances of LLDB finding the right module in a Swift AST section or symbol table just by its base name diminish as the application gets more complex.
- Binary Swift modules are version-locked to the precise compiler that created them. This is at odds with the intent of dSYM bundles, which are meant for long-term archival serialization of debug info.
- When anything goes wrong and a matching explicit module cannot be found LLDB falls back to an implicit module import which may involve recompiling parts of the SDK from source. This can be very slow.

## New: Precise module tracking

Over the last couple of months we have been making changes to the Swift compiler, the Swift driver, and LLDB that improve performance, reliability, and scalability. These changes were enabled by and are built on top of explicitly-built modules.
### New: Explicitly-built modules track their explicit Swift dependencies
Explicitly-built binary Swift modules have always kept track of their explicitly-built *Clang* module dependencies. This is why LLDB can import explicit modules so much faster than implicit modules, which may need to recompile their dependencies from source. In Swift 6.3, explicitly-built binary Swift modules also keep track of their *Swift* module dependencies. This makes importing an explicitly-built module fast and unambiguous because no module needs to be looked up by name. This happens automatically. Users don’t need to make any changes. Users with distributed build systems will already be familiar with the Swift frontend’s path remapping options, which now also affect Swift module paths.
### New: Debug info stores path of object file's own Swift module
Once LLDB finds the top-level module it can precisely import it and all of its dependencies. But how can LLDB find precisely the module that belongs to the Swift file at the current breakpoint? In Swift 6.3, the Swift compiler can store the path to it in the debug info. Because a Swift file’s own Swift module is not an input to an object file compilation, there is a new `-debug-module-path` compiler option to communicate the path to each object file compilation action. This path is also subject to the standard path remapping options used by users with distributed build systems.
### New: Swift driver passes module path to compile jobs
Users of `swiftpm` or Xcode do not need to think about this, because the Swift driver also knows about the new `-debug-module-path` option and automatically passes the path to the object file's own Swift module to the compiler. However, users maintaining their own third-party build system to orchestrate Swift compilations with explicitly-built modules that are calling the Swift frontend directly and bypassing the Swift driver need to make sure to communicate the path to the top-level module to each object file compilation job.
### Deprecated: swiftc -modulewrap and ld -add_ast_path
Because the module paths are now communicated via debug info and the module headers themselves, third-party build systems doing explicit module builds can now remove all `-modulewrap` actions on Linux and Windows; and remove the use of the `-add_ast_path` linker option on Darwin (macOS, iOS, *etc…*).
### Deprecated: Binary Swift modules in dSYM bundles
As a consequence, `dsymutil` will no longer process binary Swift modules. This is a good thing, because binary Swift modules—which can only be parsed by the exact toolchain that produced them—were always at odds with dSYM bundles being a long-term archival format. Moreover, Swift modules often depend on Clang modules, and these Clang modules also were never included in dSYM bundles. By removing the binary Swift modules, dSYM bundles will get smaller.
#### But don’t we need them for debugging?
Since Swift 1.0, binary Swift modules were included in dSYM bundles because they were needed to resolve the types of local variables. However, starting with Swift 5.6, LLDB could perform this operation by reading the reflection metadata in the binary. The absence of binary Swift modules in dSYM bundles does not affect LLDB’s ability to inspect the contents of variables or dump object descriptions with `po`. Binary Swift modules are still needed to evaluate complex expressions like function calls or computed getters. Expression evaluation continues to work as long as LLDB finds all binary modules in their original (or [remapped](https://lldb.llvm.org/use/map.html#remap-source-file-pathnames-for-the-debug-session)) location. This is always the case when debugging a just-built binary on the same machine.
If the absence of binary Swift modules in dSYM bundles creates an unforeseen problem with your workflow, please let us know, either on the [Swift LLDB forum](https://forums.swift.org/c/development/lldb/13) or by creating an issue on the [bug tracker](https://github.com/swiftlang/swift/issues)!
### What about caching?
All the paths stored in Swift modules and debug info can also be CAS addresses, so all of the described features also transparently work with compilation caching.
### Coming in Swift 6.4: Faster bridging header import in LLDB
Up to including Swift 6.3, LLDB always compiles a bridging header from source. In recent nightly development toolchains, LLDB can use the new precise explicit module information to import precompiled bridging headers and their explicit module dependencies directly. This makes debugging explicitly-built projects with bridging headers as fast and reliable as debugging fully modularized projects.

## Summary

With these changes for **explicitly-built modules**:
- Binaries built with debug info on Windows and Linux, and dSYM bundles on Darwin will get dramatically smaller, since they no longer contain any binary Swift modules (6.4+)
- Contextual module imports in LLDB become more reliable due to precise tracking instead of by-name lookups
- Certain performance cliffs around module importing in LLDB are eliminated (such as SDK module dependencies in dSYMs triggering implicit imports)
- **Developers maintaining their own build systems** can remove support for `-modulewrap` actions and remove `-add_ast_path` from the linker flags, but may need to pass `-debug-module-path` to the compiler if they are not letting the Swift driver handle the frontend options
- Finally, many projects forgot to use `-add_ast_path` when linking static archives into their projects and had mysterious debugging problems inside the static archives as a result. This entire class of problems has been designed away.

*tl;dr:* `-module-wrap` and `-add_ast_path` are replaced by `-debug-module-path`. Debug info gets smaller and more precise!
