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

We're excited to announce the general availability of [Swift SDKs for WASI distributed by
swift.org](https://swift.org/download) for Swift 6.2 and development snapshots. You can easily cross-compile and
run Wasm modules with these Swift SDKs. The distributed artifact bundles also include support for the experimental Embedded
Swift mode and a subset of Swift Concurrency supported in this mode.

## Installation

1. To install the required version of the Swift toolchain, install `swiftly` first.

    a. On macOS, install swiftly with the following command:

    ```
    curl -O https://download.swift.org/swiftly/darwin/swiftly.pkg && \
    installer -pkg swiftly.pkg -target CurrentUserHomeDirectory && \
    ~/.swiftly/bin/swiftly init --quiet-shell-followup && \
    . ~/.swiftly/env.sh && \
    hash -r
    ```

    b. On Linux, the installation command is slightly different:

    ```
    curl -O "https://download.swift.org/swiftly/linux/swiftly-$(uname -m).tar.gz" && \
    tar zxf "swiftly-$(uname -m).tar.gz" && \
    ./swiftly init --quiet-shell-followup && \
    . ~/.local/share/swiftly/env.sh && \
    hash -r
    ```

2. Note the exact version of Swift with the following command

    ```
    swift --version
    ```

    If you’re installing development snapshot with `swiftly install main-snapshot`, note the exact date component in `swiftly`s output.

3. Navigate to [the downloads page](https://www.swift.org/download/) and find the “Swift SDK for WASI” section. Find a URL of a version that exactly matches the version from step 2.
If the corresponding snapshot version is not available for the Swift SDK, you’ll have to install the matching toolchain first.

4. Find the checksum value for the corresponding Swift SDK on the same page, substitute it together with the URL from step 2, and execute the following command:

    ```
    swift sdk install <swift_sdk_url> --checksum <checksum_value>
    ```

5. Run `swift sdk list` to verify the Swift SDK was installed and note its ID in the output. Embedded Swift SDK for WASI will have `-embedded` suffix in its ID.

6. After installing or selecting a new version of Swift, make sure to follow steps 2-5 to install a Swift SDK exactly matching the toolchain version.

## Building and Running

Let's create a simple package to see the Swift SDK in action:

```
mkdir wasi-example
cd wasi-example
swift package init --type executable
```

Modify freshly created `Sources/wasi-test/wasi_test.swift` file to print different strings depending on the target
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
[8/8] Linking wasi-test.wasm
Build of product 'wasi-test' complete! (1.31s)
Hello from WASI!
```

When building with Embedded Swift SDK, you have to pass `-c release` to `swift build` and `swift run` to enable
optimizations required for Embedded Swift.

## Conclusion

With Swift SDKs for WASI now available for 6.2 and development snapshots, there's ongoing work on setting up test suite
execution for libraries under `swiftlang` organization that can support WASI. If you're interested, we invite you to try
out this new platform with your own packages and are looking forward to your feedback!
