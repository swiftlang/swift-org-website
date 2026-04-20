---
layout: page
date: 2025-10-24 11:00:00
title: Getting Started with the Swift SDK for Android
author: [marcprux]
---

Since it was first open-sourced in 2015, Swift has grown from a language focused on creating apps for Darwin-based systems (iOS, macOS, etc.) into a cross-platform development language supporting Linux, Windows, and various embedded systems. With the release of the Swift SDK for Android, it is now possible to use Swift for Android application development as well.

### Getting Started

Building a Swift package for Android requires cross-compiling: building code on
one platform (the _host_) to run on a different platform (the _target_). In the
context of Android, the host is a desktop operating system like macOS or Linux,
and the target is an Android device or emulator. 

Cross-compilation for Android requires installing three separate components:

1. The **Swift Toolchain**: The core Swift compiler and related tools needed to
   compile and run Swift code on your host machine. This includes the `swift`
   command-line tooling, standard library, and LLVM backend.
2. The **Swift SDK for Android**: An additional bundle of Swift libraries,
   headers, and configuration files that extends the Swift toolchain with the
   specific support needed to cross-compile for Android.
3. The **Android NDK**: The Android Native Development Kit provides
   platform-specific headers, system libraries, and linker tools required to
   build native binaries for Android architectures.

<!--
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Android SDK'| first %}
{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign version = site.data.builds.swift_releases.last.name %}
{% assign sdk_snapshot_tag = site.data.builds.development.android-sdk.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign base_url = "https://download.swift.org/" | append: tag_downcase | append: "/android-sdk/" | append: tag | append: "/" | append: tag %}
{% assign command = "swift sdk install " | append: base_url | append: "_android" | append: ".artifactbundle.tar.gz --checksum " | append: platform.checksum %}

{% comment %} Generate branch information - ONLY major.minor {% endcomment %}
-->

#### 1. Install the Swift Toolchain

While `swift` may already be installed on your system (such as through an Xcode installation on macOS), using a cross-compilation Swift SDK requires using an open-source toolchain and for the Swift SDK version to match exactly.

The easiest and recommended way to manage host toolchains on macOS and Linux is to use [the swiftly command](/swiftly/documentation/swiftly/getting-started). Once that has been setup, you can install the host toolchain with:

```console
$ swiftly install latest
Fetching the latest stable Swift release...
Installing Swift {{version}}

Installing package in user home directory...
Swift {{version}} is installed successfully!
$ swiftly use latest
The global default toolchain has been set to `Swift {{version}}`

$ swift --version
Apple Swift version {{version}} ({{tag}})
Target: arm64-apple-macosx26.0
```
You can also find [direct links to the open-source Swift toolchains](/install/), if you prefer manually installing then adding Swift to your `PATH`.

#### 2. Install the Swift SDK for Android

Next, download and install the Swift SDK bundle using the `swift sdk` command:

```console
$ {{ command }}
```
You can provide either the URL, with a corresponding checksum, or a local
filename where the SDK can be found.

You should now see the Android Swift SDK included with the `swift sdk list` command:

```console
$ swift sdk list
{{tag}}_android
```
Make sure to remove any old Android SDKs you have installed:

```console
$ swift sdk remove {{sdk_snapshot_tag}}_android
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

### Troubleshooting

#### Missing header errors after SDK installation

If you see errors like:

```
error: 'semaphore.h' file not found
error: 'stddef.h' file not found
```

This means the `setup-android-sdk.sh` script was not run after installing the SDK. Make sure `ANDROID_NDK_HOME` is set and run:

```console
$ export ANDROID_NDK_HOME=/path/to/android-ndk-r27d
$ cd ~/Library/org.swift.swiftpm || cd ~/.swiftpm
$ ./swift-sdks/*/swift-android/scripts/setup-android-sdk.sh
```

#### NDK version mismatch

The Swift SDK for Android requires NDK version 27 or later. If you see:

```
setup-android-sdk.sh: error: minimum NDK version 27 required
```

Download NDK r27d or later from the [NDK Downloads page](https://developer.android.com/ndk/downloads).

### Next Steps

Congratulations, you have built and run your first Swift program on Android!

Android applications are typically not deployed as command-line executable tools. Rather, they are assembled into an `.apk` archive and launched as an app from the home screen. To support this, Swift modules can be built as shared libraries for each supported architecture and included in an app archive. Swift code can then be accessed from the Android app — which is typically written in Java or Kotlin — through [the swift-java interoperability library and tools](https://github.com/swiftlang/swift-java), which handle [the Java Native Interface (JNI)](https://developer.android.com/training/articles/perf-jni) for you. For advanced uses, [Swift Java JNI Core](https://github.com/swiftlang/swift-java-jni-core) is also available as a low-level interface.

Visit [the Android Examples repository](https://github.com/swiftlang/swift-android-examples) to see a variety of projects that demonstrate how to build full Android applications that utilize the Swift SDK for Android.

These larger development topics will be expanded on in future articles and documentation. In the meantime, please visit [the Android category in the Swift forums](https://forums.swift.org/c/platform/android/115) to discuss and seek help with the Swift SDK for Android.
