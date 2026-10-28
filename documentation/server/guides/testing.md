---
redirect_from: "server/guides/testing"
layout: page
title: Testing
---

SwiftPM is integrated with [Swift Testing](https://github.com/swiftlang/swift-testing), the recommended framework for writing new tests, and with [XCTest](https://github.com/swiftlang/swift-corelibs-xctest). Both are included in the Swift toolchain on all supported platforms. Running `swift test` from the terminal, or triggering the test action in your IDE (Xcode or similar), will run all of your Swift Testing and XCTest tests. Test results will be displayed in your IDE or printed out to the terminal.

A convenient way to test on Linux is using Docker. For example:

`$ docker run -v "$PWD:/code" -w /code swift:latest swift test`

The above command will run the tests using the latest Swift Docker image, utilizing bind mounts to the sources on your file system.

Swift supports architecture-specific code. By default, Foundation imports architecture-specific libraries like Darwin or Glibc. While developing on macOS, you may end up using APIs that are not available on Linux. Since you are most likely to deploy a cloud service on Linux, it is critical to test on Linux.

Tests are automatically discovered on all platforms, so no special file or flag is needed. (Swift versions before 5.4 required a `Tests/LinuxMain.swift` file or the `--enable-test-discovery` flag to find tests on Linux.)

### Testing for production

- Make use of the sanitizers. Before running code in production, and preferably as a regular part of your CI process, do the following:
    * Run your test suite with TSan (thread sanitizer): `swift test --sanitize=thread`
    * Run your test suite with ASan (address sanitizer): `swift test --sanitize=address` and `swift test --sanitize=address -c release -Xswiftc -enable-testing`

- Generally, whilst testing, you may want to build using `swift build --sanitize=thread`. The binary will run slower and is not suitable for production, but you might be able to catch threading issues early - before you deploy your software. Often threading issues are really hard to debug and reproduce and also cause random problems. TSan helps catch them early.
