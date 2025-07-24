---
layout: page
date: 2024-06-04 12:00:00
title: Getting Started with the Static Linux SDK
author: [al45tair, incertum, etcwilde]
---

It's well known that Swift can be used to build software for Apple
platforms such as macOS or iOS, but Swift is also supported on other
platforms, including Linux and Windows.

Building for Linux is especially interesting because, historically,
Linux programs written in Swift needed to ensure that a copy of the
Swift runtime---and all of its dependencies---was installed on the
target system.  Additionally, a program built for a particular
distribution, or even a particular major version of a particular
distribution, would not necessarily run on any other distribution or
in some cases even on a different major version of the same
distribution.

The Swift Static Linux SDK solves both of these problems by allowing
you to build your program as a _fully statically linked_ executable,
with no external dependencies at all (not even the C library), which
means that it will run on _any_ Linux distribution as the only thing
it depends on is the Linux system call interface.

This portability comes at a cost, namely that everything your program
depends on must be statically linked. There is no support for dynamic
linking whatsoever — even the `dlopen()` function will not work.

A result of this design choice is that the Static Linux SDK uses a
“bring your own dependencies” model, similar to that you might be used
to with the Swift Package Manager. You cannot use system libraries,
but must either rely on the handful of common libraries supplied with
the Static SDK (see below), or build any extras yourself.

Additionally, the Static Linux SDK can be used from any platform
supported by the Swift compiler and package manager; this means that
you can develop and test your program on macOS before building and
deploying it to a Linux-based server, whether running locally or
somewhere in the cloud.

Finally, for those wondering about an equivalent for Apple platforms,
no such static SDK exists. Building a fully static executable is not
possible on Apple's operating systems because, unlike Linux, the
Darwin kernel's system call table is not part of the ABI. This design
requires all system calls to be routed through the dynamic library
`libsystem.dylib`, fundamentally preventing a 100% statically linked
binary.

### Static vs Dynamic Linking

_Linking_ is the process of taking different pieces of a computer
program and wiring up any references between those pieces.  For
_static_ linking, generally speaking those pieces are _object files_,
or _static libraries_ (which are really just collections of object
files).

For _dynamic_ linking, the pieces are _executables_ and _dynamic
libraries_ (aka dylibs, shared objects, or DLLs).

There are two key differences between dynamic and static linking:

* The time at which linking takes place.  Static linking happens when
  you build your program; dynamic linking happens at runtime.

* The fact that a static library (or _archive_) is really a collection
  of individual object files, whereas a dynamic library is monolithic.

The latter is important because traditionally, the static linker will
include every object explicitly listed on its command line, but it
will _only_ include an object from a static library if doing so lets
it resolve an unresolved symbolic reference.  If you statically link
against a library that you do not actually use, a traditional static
linker will completely discard that library and not include any code
from it in your final binary.

In practice, things can be more complicated---the static linker may
actually work on the basis of individual _sections_ or _atoms_ from
your object files, so it may in fact be able to discard individual
functions or pieces of data rather than just whole objects.

### Pros and Cons of Static Linking

Pros of static linking:

* No runtime overhead.

* Only include code from libraries that is actually needed.

* No need for separately installed dynamic libraries.

* No versioning issues at runtime.

Cons of static linking:

* Programs cannot share code (higher overall memory usage).

* No way to update dependencies without rebuilding program.

* Larger executables (though this can be offset by not having to
  install separate dynamic libraries).

On Linux in particular, it's also possible to use static linking to
completely eliminate dependencies on system libraries supplied by the
distribution, resulting in executables that work on any distribution
and can be installed by simply copying.

### Installing the SDK

Before you start, it's important to note:

* You will need to [install an Open Source toolchain from
  swift.org](/install/).

* You cannot use the toolchain provided with Xcode to build programs
  using the SDK.

* If you are using macOS, you will also need to ensure that you use
  the Swift compiler from this toolchain by [following the
  instructions
  here](/install/macos/package_installer/).

* The toolchain must match the version of the Static Linux SDK that
  you install.  The Static Linux SDK includes the corresponding Swift
  version in its filename to help identify the correct version of the
  SDK.

* When installing Swift SDKs from remote URLs, you have to pass a
  `--checksum` option with the corresponding checksum provided by the
  author of the Swift SDK.

Once that is out of the way, actually installing the Static Linux SDK
is easy; at a prompt, enter

```console
$ swift sdk install <URL-or-filename-here> [--checksum <checksum-for-archive-URL>]
```

giving the URL (and a corresponding checksum) or filename at which the SDK can be found.

For instance, assuming you have installed the
`swift-6.0-DEVELOPMENT-SNAPSHOT-2024-07-02-a` toolchain, you would
need to enter

```console
$ swift sdk install https://download.swift.org/swift-6.0-branch/static-sdk/swift-6.0-DEVELOPMENT-SNAPSHOT-2024-07-02-a/swift-6.0-DEVELOPMENT-SNAPSHOT-2024-07-02-a_static-linux-0.0.1.artifactbundle.tar.gz --checksum 42a361e1a240e97e4bb3a388f2f947409011dcd3d3f20b396c28999e9736df36
```

to install the corresponding Static Linux SDK.

Swift will download and install the SDK on your system.  You can get a
list of installed SDKs with

```console
$ swift sdk list
```

and it's also possible to remove them using

```console
$ swift sdk remove <name-of-SDK>
```

### Your first statically linked Linux program

First, create a directory to hold your code:

```console
$ mkdir hello
$ cd hello
```

Next, ask Swift to create a new program package for you:

```console
$ swift package init --type executable
```

You can build and run this locally:

```console
$ swift build
Building for debugging...
[8/8] Applying hello
Build complete! (15.29s)
$ .build/debug/hello
Hello, world!
```

But with the Static Linux SDK installed, you can also build Linux
binaries for x86-64 and ARM64 machines:

```console
$ swift build --swift-sdk x86_64-swift-linux-musl
Building for debugging...
[8/8] Linking hello
Build complete! (2.04s)
$ file .build/x86_64-swift-linux-musl/debug/hello
.build/x86_64-swift-linux-musl/debug/hello: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, with debug_info, not stripped
```

```console
$ swift build --swift-sdk aarch64-swift-linux-musl
Building for debugging...
[8/8] Linking hello
Build complete! (2.00s)
$ file .build/aarch64-swift-linux-musl/debug/hello
.build/aarch64-swift-linux-musl/debug/hello: ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV), statically linked, with debug_info, not stripped
```

These can be copied to an appropriate Linux-based system and executed:

```console
$ scp .build/x86_64-swift-linux-musl/debug/hello linux:~/hello
$ ssh linux ~/hello
Hello, world!
```

### What about package dependencies?

Swift packages that make use of Foundation or Swift NIO should just
work.  If you try to use a package that uses the C library, however,
you may have a little work to do.  Such packages often contain files
with code like the following:

```swift
#if os(macOS) || os(iOS)
import Darwin
#elseif os(Linux)
import Glibc
#elseif os(Windows)
import ucrt
#else
#error(Unknown platform)
#endif
```

The Static Linux SDK does not use Glibc; instead, it is built on top
of an alternative C library for Linux called
[Musl](https://musl-libc.org).  We chose this approach for two
reasons:

1. Musl has excellent support for static linking.

2. Musl is permissively licensed, which makes it easy to distribute
   executables statically linked with it.

If you are using such a dependency, you will therefore need to adjust
it to import the `Musl` module instead of the `Glibc` module:

```swift
#if os(macOS) || os(iOS)
import Darwin
#elseif canImport(Glibc)
import Glibc
#elseif canImport(Musl)
import Musl
#elseif os(Windows)
import ucrt
#else
#error(Unknown platform)
#endif
```

Occasionally there might be a difference between the way a C library
type gets imported between Musl and Glibc; this sometimes happens if
someone has added nullability annotations, or where a pointer type is
using a forward-declared `struct` for which no actual definition is
ever provided.  Usually the problem will be obvious---a function
argument or result will be `Optional` in one case and non-`Optional`
in another, or a pointer type will be imported as `OpaquePointer`
rather than `UnsafePointer<FOO>`.

If you do find yourself needing to make these kinds of adjustments,
you can make your [local copy](https://developer.apple.com/documentation/xcode/editing-a-package-dependency-as-a-local-package) of the package dependency editable by
doing

```console
$ swift package edit SomePackage
```

and then editing the files in the `Packages` directory that appears in
your program's source directory.  You may wish to consider raising PRs
upstream with any fixes you may have.

If your project makes use of C or C++ language libraries, you may need
to take additional steps. The Static SDK for Linux includes a small
handful of very common dependencies (e.g.
[libxml2](https://gitlab.gnome.org/GNOME/libxml2/-/wikis/home),
[zlib](https://www.zlib.net/) and [curl](https://curl.se/)). There is
a high bar for adding dependencies to the SDK itself, because it makes
the SDK image larger, and means the SDK must be updated to track the
versions of those dependencies.

The Static SDK includes an SBOM, in [SPDX format](https://spdx.dev/),
that you can use to determine exactly what is present in any given
release of the Static SDK for Linux. For instance, using the `bom`
tool, you can display the SBOM using a command like:

```console
$ bom document outline ~/.swiftpm/swift-sdks/swift-6.1.2-RELEASE-static-linux-0.0.1.artifactbundle/sbom.spdx.json
              _      
 ___ _ __   __| |_  __
/ __| '_ \ / _` \ \/ /
\__ \ |_) | (_| |>  < 
|___/ .__/ \__,_/_/\_\
    |_|               

 📂 SPDX Document SBOM-SPDX-648fa59a-9d9d-476f-9183-78d57d847c31
  │ 
  │ 📦 DESCRIBES 1 Packages
  │ 
  ├ Swift statically linked SDK for Linux@0.0.1
  │  │ 🔗 7 Relationships
  │  ├ GENERATED_FROM PACKAGE swift@6.1.2-RELEASE
  │  ├ GENERATED_FROM PACKAGE musl@1.2.5
  │  ├ GENERATED_FROM PACKAGE musl-fts@1.2.7
  │  ├ GENERATED_FROM PACKAGE libxml2@2.12.7
  │  ├ GENERATED_FROM PACKAGE curl@8.7.1
  │  ├ GENERATED_FROM PACKAGE boringssl@fips-20220613
  │  └ GENERATED_FROM PACKAGE zlib@1.3.1
  │ 
  └ 📄 DESCRIBES 0 Files
```

If your project has additional C/C++ dependencies, the process is the
same as using any static library you’ve built yourself in any other
context. You must ensure the static library (`.a` file) is in the
linker’s search path. Additionally, if you intend to call the
library's functions directly from your Swift code, you must also add
its header files to the compiler's include path. The only
Swift-specific part is that you will need a module map for the
library, but this is also true outside of the Static SDK for Linux
(see [Mixing Swift and
C++](https://www.swift.org/documentation/cxx-interop/)).

Some of the dependencies bundled in the Static SDK may be pulled in by
Swift’s runtime libraries, if you use the functionality that requires
them — for instance, Foundation Networking uses `libcurl` and
`libcurl` uses `libz` — but because of the way static linking works,
you will generally only “pay for what you use”.

You may be able to override the versions of libraries that ship with
the Static SDK by placing a newer build of the library earlier in the
linker’s search path. Note however that where other libraries that
ship with the Static SDK have been built against the library in
question, your new build will need to be ABI compatible with the
version that shipped in the Static SDK, since the other libraries in
the Static SDK will have been built against the headers from the
version that they ship with.
