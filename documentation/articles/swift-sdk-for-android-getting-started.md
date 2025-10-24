---
layout: page
date: 2025-10-21 12:00:00
title: Getting Started with the Swift SDK for Android
author: [marcprux]
---

Since it was first open-sourced in 2015, Swift has grown from a language focused on creating apps for Darwin-based systems (iOS, macOS, etc.) into a cross-platform development language supporting Linux, Windows, and various embedded systems. With the release of the Swift SDK for Android, it is now possible to use Swift for Android application development as well.

### Getting Started

Building a Swift package for Android involves installing and configuring a cross-compilation SDK. Cross-compilation is the process of building code on one platform, the host, to run on a different platform, the target. In the context of Swift for Android, this typically involves compiling Swift code on a host macOS or Linux machine to produce executables or libraries for the target Android OS. This differs from compiling Swift for the host platform, where the host and target are the same (for example, compiling and running Swift code on macOS for macOS).

To cross-compile Swift code for Android, you need three separate components:

1. **The Host Toolchain**: this is the `swift` command and related tools that you will use to build and run your Swift code.
2. **The Swift SDK for Android**: the set of libraries, headers, and other resources needed to generate and run Swift code for the Android target.
3. **The Android NDK**: the "Native Development Kit" for Android includes the cross-compilation tools like `clang` and `ld` that are used by the host toolchain to cross-compile and link.


#### 1. Install the Host Toolchain

The first thing to note is that while `swift` may already be installed on your system (such as through an Xcode installation on macOS), using a cross-compilation Swift SDK requires that the host toolchain and the Swift SDK versions match exactly. For this reason, you will need to install the specific version of the host toolchain for the given Swift SDK version.

The easiest and recommended way to manage host toolchains on macOS and Linux is to use [the swiftly command](/swiftly/documentation/swiftly/getting-started) command. Once that has been setup, you can install the host toolchain with:

```console
$ swiftly install main-snapshot-2025-10-16
Installing Swift main-snapshot-2025-10-16
Installing package in user home directory...
main-snapshot-2025-10-16 installed successfully!

$ swiftly use main-snapshot-2025-10-16
The global default toolchain has been set to `main-snapshot-2025-10-16` (was 6.2.0)

$ swiftly run swift --version
Apple Swift version 6.3-dev (LLVM 0d0246569621d5b, Swift 199240b3fe97eda)
Target: arm64-apple-macosx15.0
```

#### 2. Install the Swift SDK for Android

Next, download and install the Swift SDK bundle using the built-in `swift sdk` command:

```console
$ swift sdk install https://download.swift.org/development/android-sdk/swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a/swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a_android-0.1.artifactbundle.tar.gz --checksum 451844c232cf1fa02c52431084ed3dc27a42d103635c6fa71bae8d66adba2500

Swift SDK bundle at `https://download.swift.org/development/android-sdk/swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a/swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a_android-0.1.artifactbundle.tar.gz` successfully installed as swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a-android-0.1.artifactbundle.
```

You should now see the Android Swift SDK included in the `swift sdk list` command:

```console
$ swiftly run swift sdk list
swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a-android-0.1
```

#### 3. Install and configure the Android NDK

The Swift SDK for Android depends on the Android NDK version 27d to provide the headers and tools necessary for cross-compiling to Android architectures. There are a variety of ways to [install the Android NDK](https://developer.android.com/ndk/guides), but the simplest is to just download and unzip the archive from the [NDK Downloads page](https://developer.android.com/ndk/downloads/#lts-downloads) directly.

You can automate this with the following commands in a directory of your choosing:

```console
$ mkdir ~/android-ndk
$ cd ~/android-ndk
$ curl -fSLO https://dl.google.com/android/repository/android-ndk-r27d-$(uname -s).zip
$ unzip -q android-ndk-r27d-*.zip
$ export ANDROID_NDK_HOME=$PWD/android-ndk-r27d
```

Once you have downloaded and unpacked the NDK, you must link it to the Swift SDK for Android by running the `setup-android-sdk.sh` utility script included with the Swift SDK bundle:

```console
$ cd ~/Library/org.swift.swiftpm || cd ~/.swiftpm
$ ./swift-sdks/swift-DEVELOPMENT-SNAPSHOT-2025-10-16-a-android-0.1.artifactbundle/swift-android/scripts/setup-android-sdk.sh
setup-android-sdk.sh: success: ndk-sysroot linked to Android NDK at android-ndk-r27d/toolchains/llvm/prebuilt
```

*Note that if you have already installed the NDK in a different location, you can simply set the `ANDROID_NDK_HOME` environment variable to that location and run the `setup-android-sdk.sh` script.*

At this point, you will have a fully working cross-compilation toolchain for Android.

### Hello World on Android

Now let's try it out with the canonical "Hello World" program. First, create a directory to hold your code:

```console
$ cd /tmp
$ mkdir hello
$ cd hello
```

Next, ask Swift to create a new package for you:

```console
$ swiftly run swift package init --type executable
```

Try it out by building and running locally for the host machine:

```console
$ swiftly run swift build
Building for debugging...
[8/8] Applying hello
Build complete! (15.29s)

$ .build/debug/hello
Hello, world!
```

With the Swift SDK for Android installed and configured, you can now cross-compile the executable to Android for the `x86_64` architecture:

```console
$ swiftly run swift build --swift-sdk x86_64-unknown-linux-android28 --static-swift-stdlib
Building for debugging...
[8/8] Linking hello
Build complete! (2.04s)

$ file .build/x86_64-unknown-linux-android28/debug/hello
.build/x86_64-unknown-linux-android28/debug/hello: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /system/bin/linker64, with debug_info, not stripped
```

or for the `aarch64` architecture:

```console
$ swiftly run swift build --swift-sdk aarch64-unknown-linux-android28 --static-swift-stdlib
Building for debugging...
[8/8] Linking hello
Build complete! (2.04s)

$ file .build/aarch64-unknown-linux-android28/debug/hello
.build/aarch64-unknown-linux-android28/debug/hello: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /system/bin/linker64, with debug_info, not stripped
```

With a connected Android device that has [USB debugging enabled](https://developer.android.com/studio/debug/dev-options#Enable-debugging) or a locally-running Android [emulator](https://developer.android.com/studio/run/emulator#get-started), you can now copy the executable over, along with the required `libc++_shared.so` dependency from the Android NDK, and run it with the [`adb`](https://developer.android.com/tools/adb) utility:

```console
$ adb push .build/aarch64-unknown-linux-android28/debug/hello /data/local/tmp
.build/aarch64-unknown-linux-android28/debug/hello: 1 file pushed, 0 skipped. 155.9 MB/s (69559568 bytes in 0.425s)

$ adb push $ANDROID_NDK_HOME/toolchains/llvm/prebuilt/*/sysroot/usr/lib/aarch64-linux-android/libc++_shared.so /data/local/tmp/
aarch64-linux-android/libc++_shared.so: 1 file pushed, 0 skipped. 145.7 MB/s (1794776 bytes in 0.012s)

$ adb shell /data/local/tmp/hello
Hello, world!
```

### Next Steps

Congratulations, you have built and run your first Swift program on Android!

Note that Android applications are typically not deployed as command-line executable tools. Rather, they are assembled into an `.apk` archive and launched as an app from the home screen. To support this, Swift modules can be built as shared object libraries for each supported architecture and included in the app archive. The Swift code can then be accessed from the Android app — which is typically written in Java or Kotlin — through the Java Native Interface ([JNI](https://developer.android.com/training/articles/perf-jni)).

Visit the [swift-android-examples](https://github.com/swiftlang/swift-android-examples) repository to see a variety of projects that demonstrate how to build full Android applications that utilize the Swift SDK for Android.

These larger development topics will be expanded on in future articles and documentation. In the meantime, please visit the [Swift Android forums](https://forums.swift.org/c/platform/android/115) to discuss and seek help with the Swift SDK for Android.

