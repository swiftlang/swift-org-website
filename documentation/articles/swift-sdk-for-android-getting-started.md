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

### Installing the SDK

#### (1) Prerequisites

Before starting, please note the following requirements:

* You need to install an open-source [Swift toolchain](/install/) from
  swift.org.

* If you are using macOS, note that you cannot use the toolchain
  provided with Xcode to build programs using the SDK. Instead, you
  must use the Swift compiler from the open-source toolchain (see
  above).


#### (2) Pre-Installation Notes

Please be aware of:

* Version compatibility: The Swift toolchain must match the version of
  the Swift SDK for Android that you install.

* Clean installation: If you previously installed an SDK for a
  different Swift toolchain version, remove the old one before
  installing the new one (see management commands below).

* Checksum verification: When installing Swift SDKs from remote URLs,
  you must pass a `--checksum` option with the corresponding checksum
  provided by the SDK author.

* Command pattern: The installation follows the pattern described in
  the next sections.


#### (3) Download and Install the Swift SDK for Android

To obtain the Swift SDK for Android:

* Visit the swift.org [installation
  page](https://www.swift.org/install) for complete Swift SDK for Android
  installation instructions, where you can download directly or click
  "Copy install command".

* For previous releases, navigate to "Previous Releases" on the
  installation page.

#### (4) Installation Commands Pattern

The basic installation command follows this pattern:

```console
$ swift sdk install <URL-or-filename-here> [--checksum <checksum-for-archive-URL>]
```

You can provide either a URL (with corresponding checksum) or a local
filename where the SDK can be found.

<!--
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Android SDK'| first %}
{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign base_url = "https://download.swift.org/" | append: tag_downcase | append: "/android-sdk/" | append: tag | append: "/" | append: tag %}
{% assign command = "swift sdk install " | append: base_url | append: "_android" | append: ".artifactbundle.tar.gz --checksum " | append: platform.checksum %}

{% comment %} Generate branch information - ONLY major.minor {% endcomment %}
-->

For example, if you have installed the {{ tag }} toolchain, you would enter:

```console
$ {{ command }}
```

This will download and install the corresponding Swift SDK for Android on
your system.

#### (5) Managing Installed SDKs

After installation, you can manage your SDKs using these commands:

List all installed SDKs:

```console
$ swift sdk list
```

Remove an SDK:

```console
$ swift sdk remove <name-of-SDK>
```

#### (6) Install and configure the Android NDK

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

Android applications are typically not deployed as command-line executable tools. Rather, they are assembled into an `.apk` archive and launched as an app from the home screen. To support this, Swift modules can be built as shared libraries for each supported architecture and included in an app archive. Swift code can then be accessed from the Android app — which is typically written in Java or Kotlin — through [the Java Native Interface (JNI)](https://developer.android.com/training/articles/perf-jni) by using the low-level [swiftlang/swift-java-jni-core](https://github.com/swiftlang/swift-java-jni-core) and higher-level [swiftlang/swift-java](https://github.com/swiftlang/swift-java) interoperability library and tools.

Visit [the Android Examples repository](https://github.com/swiftlang/swift-android-examples) to see a variety of projects that demonstrate how to build full Android applications that utilize the Swift SDK for Android.

These larger development topics will be expanded on in future articles and documentation. In the meantime, please visit [the Android category in the Swift forums](https://forums.swift.org/c/platform/android/115) to discuss and seek help with the Swift SDK for Android.
