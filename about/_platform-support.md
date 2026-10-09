## Platform Support

One of the most exciting aspects of developing Swift in the open is knowing that it is now free to be ported across a wide range of platforms, devices, and use cases.

Our goal is to provide source compatibility for Swift across all platforms, even though the actual implementation mechanisms may differ from one platform to the next. The primary example is that the Apple platforms include the Objective-C runtime, which is required to access Apple platform frameworks such as UIKit and AppKit. On other platforms, such as Linux, no Objective-C runtime is present, because it isn't necessary.

The [Swift core libraries](/documentation/core-libraries/) extend the
cross-platform capabilities of Swift by providing portable implementations
of fundamental Apple frameworks (such as Foundation) without dependencies on
the Objective-C runtime, so that Swift code can be shared across platforms.

### Apple Platforms

Open-source Swift can be used on the Mac to target all of the Apple
platforms: iOS, macOS, watchOS, tvOS, and visionOS. Moreover, binary builds of
open-source Swift integrate with the Xcode developer tools, including
complete support for the Xcode build system, code completion in the
editor, and integrated debugging, allowing anyone to experiment with
the latest Swift developments in a familiar Cocoa and Cocoa Touch
development environment.


### Linux

Open-source Swift can be used on Linux to build Swift libraries and
applications. The open-source binary builds provide the Swift compiler and standard library, Swift REPL and debugger (LLDB), and the [core libraries](/documentation/core-libraries/), so one can jump right in to Swift development. The [Static Linux SDK](/documentation/articles/static-linux-getting-started.html) builds fully statically linked Linux executables, and can be used to cross-compile for Linux from other platforms.


### Windows

Open source Swift can be used on Windows to build Swift libraries and applications. The open source binary builds provide C/C++/Swift toolchains, the standard library, and debugger (LLDB), as well as the [core libraries](/documentation/core-libraries/), so one can jump right in to Swift development. SourceKit-LSP is bundled into the releases to enable developers to be quickly productive with the IDE of their choice.

### Android

The official [Swift SDK for Android](/documentation/articles/swift-sdk-for-android-getting-started.html) lets you cross-compile Swift libraries and executables for Android from a host such as macOS or Linux.

### WebAssembly

The [Swift SDK for WebAssembly](/documentation/articles/wasm-getting-started.html) lets you compile Swift code to Wasm modules that run in the browser or in other WebAssembly runtimes.

### Embedded Systems

[Embedded Swift](/get-started/embedded/) is a compilation mode that produces small, freestanding binaries for microcontrollers and other constrained environments.

### New Platforms

We can't wait to see the new places we can bring Swift---together.  We truly believe that this language that we love can make software safer, faster, and easier to maintain.  We'd love your help to bring Swift to even more computing platforms.
