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

Starting with Swift 6.2 and development snapshots you can easily cross-compile and run Wasm modules with Swift SDKs for Wasm distributed on [swift.org](https://swift.org/download).
The distributed artifact bundles also include support for the experimental Embedded Swift mode.

## Installation

{% assign last_release = site.data.builds.swift_releases.last %}
{% assign platform = last_release.platforms | where: 'name', 'Wasm SDK'| first %}
{% assign release_name = last_release.name %}
{% assign tag = last_release.tag %}
{% assign tag_downcase = last_release.tag | downcase %}

{% assign base_url = "https://download.swift.org/" | append: tag_downcase | append: "/wasm-sdk/" | append: tag | append: "/" | append: tag %}
{% assign command = "swift sdk install " | append: base_url | append: "_wasm.artifactbundle.tar.gz --checksum " | append: platform.checksum %}

Note that these steps are required on macOS even if you already have latest Xcode installed. Cross-compilation with Swift SDKs on Windows hosts is [not supported yet](https://github.com/swiftlang/swift-package-manager/issues/9148).

1. [Install `swiftly` per the instructions](https://www.swift.org/install/) for the platform that you're bulding on.

2. Install Swift {{ release_name }} with `swiftly install {{ release_name }}`.

3. Select the installed toolchain with `swiftly use {{ release_name }}`.

4. Run a command in your terminal application to install Swift SDKs for Wasm.
    ```
    {{ command }}
    ```

6. Run `swift sdk list` to verify the Swift SDK was installed and note its ID in the output. Two Swift SDKs will be installed,
one with support for all Swift features, and the other with a subset of features allowed in the experimental [Embedded Swift mode](#embedded-swift-support).

    | Swift SDK ID | Description |
    |:-------:|:-----------:|
    | `swift-<version>_wasm` | Supports all Swift features |
    | `swift-<version>_wasm-embedded` | Supports a subset of features allowed in the experimental [Embedded Swift mode](#embedded-swift-support) |

7. In the future, after installing or selecting a new version of the toolchain with `swiftly` make sure to install and use an exactly matching Swift SDK version.

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
swift build --swift-sdk {{ tag }}_wasm
```

Recent toolchain snapshots that are compatible with Swift SDKs for Wasm also include
[WasmKit](https://github.com/swiftwasm/wasmkit/), which is a Wasm runtime that `swift run` can delegate to for
execution. To run the freshly built module, use `swift run` with the same `--swift-sdk` option:

```
swift run --swift-sdk {{ tag }}_wasm
```

You should see the following output:

```
[1/1] Planning build
Building for debugging...
[8/8] Linking Hello.wasm
Build of product 'Hello' complete! (1.31s)
Hello from WASI!
```

## Embedded Swift Support

[Embedded Swift](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md) is an experimental [subset of the language](https://docs.swift.org/embedded/documentation/embedded/languagesubset)
allowing the toolchain to produce Wasm binaries that are multiple orders of magnitude smaller. One of the Swift SDKs in the artifact bundle you've installed
with the `swift sdk install` command is tailored specifically for Embedded Swift.

To build with Embedded Swift SDK, pass its ID as noted in `swift sdk list` output (which has an `-embedded` suffix) in the `--swift-sdk` option. For example:

```
swift build --swift-sdk {{ tag }}_wasm-embedded
```

or

```
swift run --swift-sdk {{ tag }}_wasm-embedded
```

## Editor Configuration

This section shows you how to configure your development environment for Swift WebAssembly development using the Swift SDKs you installed in the previous section.

### Visual Studio Code

If you haven't set up VSCode for Swift development yet, see the [Configuring VS Code for Swift Development guide](/documentation/articles/getting-started-with-vscode-swift/).

**Configure VSCode for WebAssembly:**

1. Open your Swift package in VSCode.

2. Use the Command Palette (`Cmd + Shift + P` on macOS, `Ctrl + Shift + P` on other platforms) and select `Swift: Select Toolchain...`.

3. Choose your Swift toolchain from the list (should match the version installed with `swiftly`).

4. When prompted, save the toolchain setting in **Workspace Settings**. This will create or update the `swift.path` setting in `.vscode/settings.json`.

5. Create a `.sourcekit-lsp/config.json` file in your project root:

   ```json
   {
       "swiftPM": {
           "swiftSDK": "{{ tag }}_wasm"
       }
   }
   ```

   Replace `{{ tag }}_wasm` with the exact Swift SDK ID from your `swift sdk list` output. Use `{{ tag }}_wasm-embedded` if you're working with Embedded Swift.

6. Reload VSCode using the Command Palette: `Developer: Reload Window`.

### Other Editors

For other editors (Vim, Neovim, Emacs, etc.) with LSP support already configured for Swift:

1. Ensure your editor is using the correct Swift toolchain (the one installed with `swiftly`).

2. Create a `.sourcekit-lsp/config.json` file in your project root:

   ```json
   {
       "swiftPM": {
           "swiftSDK": "{{ tag }}_wasm"
       }
   }
   ```

   Replace `{{ tag }}_wasm` with your Swift SDK ID from `swift sdk list`. Use `{{ tag }}_wasm-embedded` for Embedded Swift.

For initial Swift LSP setup guides, see:
- [Zero to Swift with Neovim](/documentation/articles/zero-to-swift-nvim/)
- [Zero to Swift with Emacs](/documentation/articles/zero-to-swift-emacs/)
