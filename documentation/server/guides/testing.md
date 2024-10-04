---
redirect_from: "server/guides/testing"
layout: new-layouts/base
title: Testing
---

SwiftPM is integrated with [XCTest, Apple’s unit test framework](https://developer.apple.com/documentation/xctest). Running `swift test` from the terminal, or triggering the test action in your IDE (Xcode or similar), will run all of your XCTest test cases. Test results will be displayed in your IDE or printed out to the terminal.

A convenient way to test on Linux is using Docker. For example:

`$ docker run -v "$PWD:/code" -w /code swift:latest swift test`

The above command will run the tests using the latest Swift Docker image, utilizing bind mounts to the sources on your file system.

Swift supports architecture-specific code. By default, Foundation imports architecture-specific libraries like Darwin or Glibc. While developing on macOS, you may end up using APIs that are not available on Linux. Since you are most likely to deploy a cloud service on Linux, it is critical to test on Linux.

A historically important detail about testing for Linux is the `Tests/LinuxMain.swift` file.

- In Swift versions 5.4 and newer tests are automatically discovered on all platforms, no special file or flag needed.
- In Swift versions >= 5.1 < 5.4, tests can be automatically discovered on Linux using `swift test --enable-test-discovery` flag.
- In Swift versions older than 5.1 the `Tests/LinuxMain.swift` file provides SwiftPM an index of all the tests it needs to run on Linux and it is critical to keep this file up-to-date as you add more unit tests. To regenerate this file, run `swift test --generate-linuxmain` after adding tests. It is also a good idea to include this command as part of your continuous integration setup.

### Testing for production

- For Swift versions between Swift 5.1 and 5.4, always test with `--enable-test-discovery` to avoid forgetting tests on Linux.

- Make use of the sanitizers. Before running code in production, and preferably as a regular part of your CI process, do the following:
    * Run your test suite with TSan (thread sanitizer): `swift test --sanitize=thread`
    * Run your test suite with ASan (address sanitizer): `swift test --sanitize=address` and `swift test --sanitize=address -c release -Xswiftc -enable-testing`

- Generally, whilst testing, you may want to build using `swift build --sanitize=thread`. The binary will run slower and is not suitable for production, but you might be able to catch threading issues early - before you deploy your software. Often threading issues are really hard to debug and reproduce and also cause random problems. TSan helps catch them early.
