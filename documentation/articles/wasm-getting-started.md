---
layout: page
date: 2025-06-01 12:00:00
title: Getting Started with Swift SDKs for WebAssembly
author: [maxdesiatov]
---

[WebAssembly (Wasm) is a virtual instruction set](https://webassembly.org/) focused on portability, security, and
performance. Developers can build client and server applications for Wasm and then deploy them in the browser or other
Wasm runtime implementations.

WebAssembly support in Swift started out as a community project. Any instruction set benefits tremendously from a
standardized ABI and system interfaces, and from its inception Wasm support in Swift targeted [WebAssembly System
Interface](https://wasi.dev/), which made porting Swift core libraries to this platform much easier.

With Swift 6.2 and development snapshots you can easily cross-compile and run Wasm modules with Swift SDKs for WASI distributed on [swift.org](https://swift.org/download).
The distributed artifact bundles also include support for the experimental Embedded Swift mode.

## Installation

1. [Install `swiftly` per the instructions](https://www.swift.org/install/) for the platform that you're bulding on.

2. Install latest 6.2 development snapshot with `swiftly install 6.2-snapshot`, note the exact snapshot date component in the output of this command.

3. Select the installed toolchain with `swiftly use 6.2-snapshot`.

4. Navigate to [the downloads page](https://www.swift.org/download/) and find the “Swift SDK for WASI” section. Find a URL of a version that exactly matches the version from step 2.
If the corresponding snapshot version is not available for the Swift SDK, you’ll have to install the matching toolchain first.

5. Find the checksum value for the corresponding Swift SDK on the same page, substitute it together with the URL from step 2, and execute the following command:

    ```
    swift sdk install <swift_sdk_url> --checksum <checksum_value>
    ```

6. Run `swift sdk list` to verify the Swift SDK was installed and note its ID in the output. Two Swift SDKs will be installed,
one with support for all Swift features, and the other with a subset of features allowed in the experimental [Embedded Swift mode](#embedded-swift-support).
| SDK ID | Description |
|:-------:|:-----------:|
| `swift-<version>_wasm` | Support all Swift features |
| `swift-<version>_wasm-embedded` | Support a subset of features allowed in the experimental [Embedded Swift mode](#embedded-swift-support) |

7. In the future, after installing or selecting a new version of the toolchain with `swiftly` make sure to follow steps 3-6 to install a Swift SDK exactly matching the toolchain version.

## Building and Running

Let's create a simple package to see the Swift SDK in action:

```
mkdir Hello
cd Hello
swift package init --type executable
```

Modify freshly created `Sources/Hello/Hello.swift` file to print different strings depending on the target
platform:

```swift
@main
struct wasi_test {
    static func main() {
#if os(WASI)
        print("Hello from WASI!")
#else
        print("Hello from the host system!")
#endif
    }
}
```

Build your package with the following command, substituting the ID from step 5 of [the "Installation" section](#installation) above.

```
swift build --swift-sdk <swift_sdk_id>
```

Recent toolchain snapshots that are compatible with Swift SDKs for WASI also include
[WasmKit](https://github.com/swiftwasm/wasmkit/), which is a Wasm runtime that `swift run` can delegate to for
execution. To run the freshly built module, use `swift run` with the same `--swift-sdk` option:

```
swift run --swift-sdk  <swift_sdk_id>
```

You should see the following output:

```
[1/1] Planning build
Building for debugging...
[8/8] Linking Hello.wasm
Build of product 'Hello' complete! (1.31s)
Hello from WASI!
```

# Embedded Swift Support

[Embedded Swift](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md) is an experimental subset of the language
allowing the toolchain to produce Wasm binaries that are multiple orders of magnitude smaller. One of the Swift SDKs in the artifact bundle you've installed
with the `swift sdk install` command is tailored specifically for Embedded Swift. A subset of Swift Concurrency is also supported in this mode
thanks to the functionality provided by WASI.

To build with Embedded Swift SDK, pass its ID as noted in `swift sdk list` output (which has an `-embedded` suffix) in the `--swift-sdk` option. You also have to pass `-c release`
to `swift build` and `swift run` to enable optimizations required for Embedded Swift.

