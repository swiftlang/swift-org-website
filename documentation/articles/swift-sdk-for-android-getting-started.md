---
layout: page
date: 2025-10-24 11:00:00
title: Getting Started with the Swift SDK for Android
author: [marcprux]
---

Since it was first open-sourced in 2015, Swift has grown from a language focused on creating apps for Darwin-based systems (iOS, macOS, etc.) into a cross-platform development language supporting Linux, Windows, and various embedded systems. With the release of the Swift SDK for Android, it is now possible to use Swift for Android application development as well.

### Getting Started

Building a Swift package for Android involves installing and configuring a cross-compilation SDK. Cross-compilation is the process of building code on one platform, the host, to run on a different platform, the target. In the context of Swift for Android, this typically involves compiling Swift code on a host macOS or Linux machine to produce executables or libraries for the target Android OS. This differs from compiling Swift for the host platform, where the host and target are the same (for example, compiling and running Swift code on macOS for macOS).

To cross-compile Swift code for Android, you need three separate components:

1. **The Host Toolchain**: this is the `swift` command and related tools that you will use to build and run your Swift code.
2. **The Swift SDK for Android**: the set of libraries, headers, and other resources needed to generate and run Swift code for the Android target.
3. **The Android NDK**: the "Native Development Kit" for Android includes cross-compilation tools like `clang` and `lld` that are used by the host toolchain to cross-compile and link.

<!--
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Android SDK'| first %}
{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign base_url = "https://download.swift.org/" | append: tag_downcase | append: "/android-sdk/" | append: tag | append: "/" | append: tag %}
{% assign command = "swift sdk install " | append: base_url | append: "_android" | append: ".artifactbundle.tar.gz --checksum " | append: platform.checksum %}

{% comment %} Generate branch information - ONLY major.minor {% endcomment %}
-->

#### 1. Install the Host Toolchain

While `swift` may already be installed on your system (such as through an Xcode installation on macOS), using a cross-compilation Swift SDK requires using an open-source toolchain and that the Swift SDK version matches exactly.

The easiest and recommended way to manage host toolchains on macOS and Linux is to use [the swiftly command](/swiftly/documentation/swiftly/getting-started) command. Once that has been setup, you can install the host toolchain with:

```console
$ swiftly install latest
Fetching the latest stable Swift release...
Installing Swift 6.3

Installing package in user home directory...
Swift 6.3 is installed successfully!
$ swiftly use latest
The global default toolchain has been set to `Swift 6.3`

$ swift -version
Apple Swift version 6.3 ({{tag}})
Target: arm64-apple-macosx26.0
Build config: +assertions
```
You can also find [direct links to the open-source Swift toolchains](/install/), if you prefer manually installing then adding Swift to your `PATH`.

#### 2. Install the Swift SDK for Android

Next, download and install the Swift SDK bundle using the `swift sdk` command:

```console
$ {{ command }}
```

You should now see the Android Swift SDK included in the `swift sdk list` command:

```console
$ swift sdk list
{{tag}}_android
```

Make sure to remove any old Android SDKs you have installed:

```console
$ swift sdk remove <name-of-SDK>
```

#### 3. Install and configure the Android NDK

The Swift SDK for Android depends on the Android NDK, LTS version 27d or later, to provide the headers and tools necessary for cross-compiling to Android architectures. There are a variety of ways to [install the Android NDK](https://developer.android.com/ndk/guides), but the simplest is to just download and unzip the archive from the [NDK Downloads page](https://developer.android.com/ndk/downloads/#lts-downloads) directly.

You can automate this with the following commands by first changing to the installation directory of the Swift SDK for Android. For macOS:

```console
$ cd ~/Library/org.swift.swiftpm/swift-sdks/{{ tag }}_android.artifactbundle/swift-android/
```

or for Linux:

```console
$ cd ~/.swiftpm/swift-sdks/{{ tag }}_android.artifactbundle/swift-android/
```

Then run:

```console
$ curl -fSL -o ndk.zip https://dl.google.com/android/repository/android-ndk-r27d-$(uname -s).zip
$ unzip -qo ndk.zip
$ export ANDROID_NDK_HOME=$PWD/android-ndk-r27d
$ ./scripts/setup-android-sdk.sh
```

*If you have already installed the NDK in a different location, you can simply set the `ANDROID_NDK_HOME` environment variable to that location and run the `setup-android-sdk.sh` script.*

At this point, you will have a fully working cross-compilation toolchain for Android, and can unset `ANDROID_NDK_HOME` if you'd like.

### Hello World on Android

Now let's try the canonical "Hello World" program, by first creating a directory to hold your code and initialize a new package:

```console
$ cd /tmp
$ mkdir hello
$ cd hello
$ swift package init --type executable
```

Check the new package by building and running locally for the host:

```console
$ swift build
Building for debugging...
[8/8] Applying hello
Build complete! (15.29s)

$ .build/debug/hello
Hello, world!
```

With the Swift SDK for Android installed and configured, you can now cross-compile the executable to Android for the `x86_64` architecture:

```console
$ swift build --swift-sdk x86_64-unknown-linux-android28 --static-swift-stdlib
Building for debugging...
[8/8] Linking hello
Build complete! (2.04s)

$ file .build/x86_64-unknown-linux-android28/debug/hello
.build/x86_64-unknown-linux-android28/debug/hello: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /system/bin/linker64, with debug_info, not stripped
```

or for the `aarch64` architecture:

```console
$ swift build --swift-sdk aarch64-unknown-linux-android28 --static-swift-stdlib
Building for debugging...
[8/8] Linking hello
Build complete! (2.04s)

$ file .build/aarch64-unknown-linux-android28/debug/hello
.build/aarch64-unknown-linux-android28/debug/hello: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /system/bin/linker64, with debug_info, not stripped
```

Using a connected Android device that has [USB debugging enabled](https://developer.android.com/studio/debug/dev-options#Enable-debugging) or [a locally-running Android emulator](https://developer.android.com/studio/run/emulator#get-started), you can now copy the executable over, along with the required `libc++_shared.so` dependency from the Android NDK, and run it with [the `adb` utility](https://developer.android.com/tools/adb):

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

Android applications are typically not deployed as command-line executable tools. Rather, they are assembled into an `.apk` archive and launched as an app from the home screen. To support this, Swift modules can be built as shared libraries for each supported architecture and included in an app archive. Swift code can then be accessed from the Android app — which is typically written in Java or Kotlin — through [the swift-java interoperability library and tools](https://github.com/swiftlang/swift-java), which handle [the Java Native Interface (JNI)](https://developer.android.com/training/articles/perf-jni) for you. For advanced uses, [Swift Java JNI Core](https://github.com/swiftlang/swift-java-jni-core) is also available as a low-level interface.

Visit [the Android Examples repository](https://github.com/swiftlang/swift-android-examples) to see a variety of projects that demonstrate how to build full Android applications that utilize the Swift SDK for Android.

These larger development topics will be expanded on in future articles and documentation. In the meantime, please visit [the Android category in the Swift forums](https://forums.swift.org/c/platform/android/115) to discuss and seek help with the Swift SDK for Android.
