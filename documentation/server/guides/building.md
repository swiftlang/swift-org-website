---
redirect_from: "server/guides/building"
layout: page
title: Building Swift Server Applications
---

Use [Swift Package Manager](/documentation/package-manager/) to build server applications.
It provides a cross-platform foundation for building Swift code and works well when you have one code base that you can edit and run on many Swift platforms.
Build with Swift Package Manager either using the command line, or through an IDE such as Xcode or Visual Studio Code.

## Choose a build configuration

The Swift package manager supports two distinct build configurations, each optimized for different stages of your development workflow.
The configurations are **debug**, frequently used during development, and **release**, which you use when profiling or producing production build artifacts.

### Use debug builds during development

When you run `swift build` without additional flags, Swift Package Manager creates a debug build:

```bash
swift build
```

These debug builds include full debugging symbols and runtime safety checks, which makes them invaluable during active development.
The compiler skips most optimizations to keep build times fast, letting you quickly test changes.
However, this can come at a significant cost to runtime performance; debug builds typically run slower than their release counterparts.

### Create release builds for production

For building to run in production, use the release configuration by adding the `-c release` flag:

```bash
swift build -c release
```

The release configuration turns on all compiler optimizations.
The trade-off is longer compilation times, as the optimizer performs extensive analysis and transformations.
Release builds still include some debugging information for crash analysis, but strip out development-only checks and assertions.

## Optimize your builds

After selecting your build configuration, you can apply additional optimizations.
Beyond choosing debug or release mode, several compiler flags can fine-tune your builds for specific scenarios.

### Preserve frame pointers

Some builds choose to omit frame pointers (data structures that enable accurate stack traces) to gain additional performance. 
This can make debugging production crashes more difficult, as stack traces become less reliable.
For production server applications, preserving frame pointers is usually worth the minimal performance cost.
Frame pointers aren't omitted by default in release configurations, but you can be explicit to preserve them:

```bash
swift build -c release -Xcc -fno-omit-frame-pointer
```

The `-Xcc -fno-omit-frame-pointer` passes the flag [-fno-omit-frame-pointer](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fomit-frame-pointer) through to the LLVM compiler.
This ensures that debugging tools can produce accurate backtraces, critical when you need to diagnose a crash or for profiling performance.
The performance impact is typically negligible for server workloads, while the debugging benefits are substantial.

### Enable cross-module optimization

Swift 5.2 added cross-module optimization, which lets the compiler optimize code across module boundaries:

```bash
swift build -c release -Xswiftc -cross-module-optimization
```

The `-Xswiftc` passes the `-cross-module-optimization` flag to the Swift compiler.
By default, Swift optimizes each module in isolation. 
Cross-module optimization removes this boundary, enabling optimizations such as inlining function calls between modules.

For code that makes frequent use of small functions across module boundaries, this can yield meaningful performance improvements.
However, results vary for every project, as they're specific to your code.
Always benchmark your specific workload with and without this flag before deploying to production.

### Build specific products

If your package defines multiple executables or library products, when you invoke `swift build`, the Swift Package Manager assumes you want to build everything declared in the package.
You can build just what you need using either the `--product` flag:

```bash
swift build --product MyAPIServer
```

This is particularly useful in monorepo setups or packages with multiple deployment targets, as it avoids building tools or test utilities you don't need for a particular deployment.

## Use package traits

Beyond additional compiler flags, Swift 6.2 introduces another way to control what gets built.
Starting with Swift 6.2, packages can define traits, which enable or disable optional features at build time.

Package Traits allows a package to define additional, optional code that you can enable for your service or library.
You can toggle experimental APIs, performance monitoring, or deployment settings without creating separate branches. 
This can be much more clear than using preprocessor macros or toggling features using environment variables in package manifests.

For details on defining traits, conditional dependencies, trait unification, and advanced use cases, see [Package Traits](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/packagetraits).

## Locate build artifacts

After building with your chosen configuration and optimizations, you'll often need to know where Swift Package Manager placed your build artifacts. The location varies by build platform and architecture:

```bash
# Show where debug build artifacts are located
swift build --show-bin-path

# Show where release build artifacts are located
swift build --show-bin-path -c release
```

Typical paths include:

- **Linux (x86_64):** `.build/x86_64-unknown-linux/debug` or `.build/x86_64-unknown-linux/release`
- **macOS (Intel):** `.build/x86_64-apple-macosx/debug` or `.build/x86_64-apple-macosx/release`
- **macOS (Apple Silicon):** `.build/arm64-apple-macosx/debug` or `.build/arm64-apple-macosx/release`

The `--show-bin-path` flag is particularly useful for deployment scripts, where you need to copy the build artifact to a specific location without hardcoding platform-specific paths.

## Build for other platforms

Once you know where your build artifacts are located, you may need to target different platforms.
Swift build artifacts are both platform and architecture-specific.
Build artifacts you create on macOS run only on macOS; those you create on Linux run only on Linux.
This creates a challenge for a common development pattern where engineers work on macOS and deploy to Linux servers.

Many developers take advantage of Xcode's excellent IDE features during development but need to produce Linux build artifacts for deployment.
Swift provides two main approaches for cross-platform building.

### Build with Linux containers

Docker or on macOS, [Container](https://github.com/apple/container), offers a straightforward way to create Linux build artifacts on macOS.
Apple publishes official Swift Docker images to [Docker Hub](https://hub.docker.com/_/swift), which provide complete Linux build environments.

To build your application using the latest Swift release image:

```bash
# Build with Container
container run -c 2 -m 8g --rm -it \
  -v "$PWD:/code" -w /code \
  swift:latest swift build

# Build with Docker
docker run --rm -it \
  -v "$PWD:/code" -w /code \
  swift:latest swift build
```

This command mounts your current directory into the container and runs `swift build` inside a Linux environment provided by the `swift:latest` container image.
The resulting build artifacts are Linux-compatible.

If you're on Apple Silicon but need to target Intel/AMD64 Linux servers, specify the platform explicitly:

```bash
# Build with Container
container run -c 2 -m 8g --rm -it \
  -v "$PWD:/code" -w /code \
  --platform linux/amd64 \
  -e QEMU_CPU=max \
  swift:latest swift build

# Build with Docker
docker run --rm -it \
  -v "$PWD:/code" -w /code \
  --platform linux/amd64 \
  -e QEMU_CPU=max \
  swift:latest swift build
```

The `--platform` flag runs the container with emulation using QEMU.
The `-e QEMU_CPU=max` is passing an environment variable that asks QEMU to emulate the most advanced features, such as AMD64 support.

Note that emulation doesn't guarantee all processor-specific extensions are available, but this setting enables the broadest feature set supported by your system.

For building your code into a container, you typically use a container declaration, called a Dockerfile or Containerfile, which specifies all the steps used to assemble the container image that holds your build artifacts.
Container-based builds work particularly well in continuous integration or continuous deployment (CI/CD) pipelines and local development where you want to validate that your code builds cleanly on Linux. The main downside is that Docker containers can be slower than native builds, especially on Apple Silicon where x86_64 containers run through emulation.

For a more detailed example of creating a container declaration to build and package your application, see [packaging.md](./packaging.md).


### Cross-compile with the Static Linux SDK

If Docker's performance overhead is a concern for your workflow, Swift 5.9 and later provide Static Linux SDKs that enable cross-compilation directly from macOS to Linux without using a container:

```bash
# Build for x86_64 Linux
swift build -c release --swift-sdk x86_64-swift-linux-musl

# Build for ARM64 Linux
swift build -c release --swift-sdk aarch64-swift-linux-musl
```

These SDK targets use musl libc (a lightweight C library) instead of glibc (the GNU C library) to produce statically-linked build artifacts.
The resulting executables have minimal dependencies on the target Linux system, making them highly portable across Linux distributions.
However, they may be larger than dynamically-linked equivalents.

Cross-compilation is significantly faster than Docker-based builds because it runs natively on your Mac's architecture without emulation. 
One of the tradeoffs is build environment fidelity: you're testing that your code cross-compiles to Linux, not that it actually builds on a Linux system.
Another is that you can only use the static libraries that are available in the SDK, and your code can't use `dlopen` or other tools to dynamically load libraries that may be available on the target system.

For most projects this distinction doesn't matter.
However, packages with complex C dependencies may behave differently when built natively on Linux versus cross-compiled.

### Choose static or dynamic linking

By default, Swift build artifacts link the standard library dynamically. This keeps individual build artifacts smaller and allows multiple programs to share a single copy of the Swift runtime.
However, it also means you need to ensure the Swift runtime is installed on your deployment target.

For deployment scenarios where you want more self-contained build artifacts, you can statically link the Swift standard library:

```bash
swift build -c release --static-swift-stdlib
```

The resulting build artifacts still depend on dynamically linking to glibc, but have fewer dependency requirements on the target system.

This bundles the Swift runtime directly into the build artifact:

| Aspect | Dynamic Linking | Static Linking |
|--------|----------------|----------------|
| **Build artifact size** | Smaller (runtime not included) | Larger (adds to binary size for stdlib) |
| **Deployment complexity** | Requires Swift runtime on target system | Self-contained, no runtime needed |
| **Version management** | Must match runtime version on system | Each artifact includes its own runtime version |
| **Best for** | Containerized deployments with Swift runtime | VMs or bare metal with unknown configurations |

For containerized deployments, dynamic linking is usually preferable since the container already includes the Swift runtime. For deploying to VMs or bare metal where you don't control the system configuration, static linking can simplify operations significantly.

### Inspecting a binary

If you're uncertain what platform a binary was built for, use the `file` command on macOS to get more information. This inspects the binary, and provides useful information which usually shows, for binaries, the platform target. The following example inspects a swift executable (`MyServer`)

```
file .build/debug/MyServer
```

The output when compiled, in debug configuration, on macOS with Apple Silicon:

```
.build/debug/MyServer: Mach-O 64-bit executable arm64
```

The output when compiled, in debug configuration, on Linux using a container in Apple Silicon:

```
.build/debug/MyServer: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, for GNU/Linux 3.7.0, BuildID[sha1]=ec68ac934b11eb7364fce53c95c42f5b83c3cb8d, with debug_info, not stripped
```

And the output for that same executable compiled, in debug configuration, on macOS through the Container with Linux x86/64 emulation (using the example in the section above):

```
.build/debug/MyServer: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=40357329617ac9629e934b94415ff4078681b45a, with debug_info, not stripped
```

And finally, that same binary compiled with the static Linux SDK (`swift build --swift-sdk x86_64-swift-linux-musl`):

```
.build/debug/MyServer: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, BuildID[sha1]=04ae4f872265b1e0d85ff821fd26fc102993b9f2, with debug_info, not stripped
```
