---
redirect_from: "server/guides/building"
layout: new-layouts/base
title: Build System
---

The recommended way to build server applications is with [Swift Package Manager](/documentation/package-manager/). SwiftPM provides a cross-platform foundation for building Swift code and works nicely for having one code base that can be edited as well as run on many Swift platforms.

## Building
SwiftPM works from the command line and is also integrated within Xcode.

You can build your code either by running `swift build` from the terminal, or by triggering the build action in Xcode.

### Docker Usage
Swift binaries are architecture-specific, so running the build command on macOS will create a macOS binary, and similarly running the command on Linux will create a Linux binary.

Many Swift developers use macOS for development, which enables taking advantage of the great tooling that comes with Xcode. However, most server applications are designed to run on Linux.

If you are developing on macOS, Docker is a useful tool for building on Linux and creating Linux binaries. Apple publishes official Swift Docker images to [Docker Hub](https://hub.docker.com/_/swift).

For example, to build your application using the latest Swift Docker image:

`$ docker run -v "$PWD:/code" -w /code swift:latest swift build`

Note, if you want to run the Swift compiler for Intel CPUs on an Apple Silicon (M1) Mac, please add `--platform linux/amd64 -e QEMU_CPU=max` to the command line. For example:

`$ docker run -v "$PWD:/code" -w /code --platform linux/amd64 -e QEMU_CPU=max swift:latest swift build`

The above command will run the build using the latest Swift Docker image, utilizing bind mounts to the sources on your Mac.

### Debug vs. Release Mode
By default, SwiftPM will build a debug version of the application. Note that debug versions are not suitable for running in production as they are significantly slower. To build a release version of your app, run `swift build -c release`.

### Locating Binaries
Binary artifacts that can be deployed are found under `.build/x86_64-unknown-linux` on Linux, and `.build/x86_64-apple-macosx` on macOS.

SwiftPM can show you the full binary path using `swift build --show-bin-path -c release`.

### Building for production

- Build production code in release mode by compiling with `swift build -c release`. Running code compiled in debug mode will hurt performance significantly.

- For best performance in Swift 5.2 or later, pass `-Xswiftc -cross-module-optimization` (this won't work in Swift versions before 5.2) - enabling this should be verified with performance tests (as any optimization changes) as it may sometimes cause performance regressions.

- Integrate [`swift-backtrace`](https://github.com/swift-server/swift-backtrace) into your application to make sure backtraces are printed on crash. Backtraces do not work out-of-the-box on Linux, and this library helps to fill the gap. Eventually this will become a language feature and not require a discrete library.
