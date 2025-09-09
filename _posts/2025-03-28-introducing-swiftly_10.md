---
layout: post
published: true
date: 2025-03-28 6:00:00
title: Introducing swiftly 1.0
author: [chris-mcgee]
category: "Developer Tools"
---

Today we’re delighted to introduce the first stable release of swiftly, a Swift version manager that takes the pain out of installing, managing and updating your Swift toolchain.

The latest version of Swift is bundled with Xcode for writing apps for Apple platforms. But perhaps you want to install Swift on a different platform like Linux, or use a different version of the toolchain for building services or command line tools. Downloading, extracting and installing a trusted build of Swift along with the relevant dependencies for your operating system can require quite a few manual and error-prone steps.

swiftly has been around for some years as a community-supported tool for Swift developers using Linux. With this release, we’re officially supporting it as part of the core Swift toolchain, including hosting it as part of the [Swift GitHub organization](https://github.com/swiftlang). We’ve also added macOS support to make it easier to install Swift separately from Xcode.

## Introducing swiftly

swiftly is the best tool to install the standalone toolchain, providing commands to install Swift on a new system, update to the latest stable version, and experiment or test with nightly snapshots or older versions. It also makes it easy to switch effortlessly between multiple installed toolchains. You can even add a file to your project repository so swiftly will use the same toolchain version for all members of your development team.

Naturally, swiftly itself is written in Swift, and is able to update itself to the latest version.

## Quick tour

Let's take a look at some of the features of swiftly!

To get started, visit [swift.org/install](/install) and install it.

swiftly will provide directions after installation if there are any system packages, or shell commands needed for smooth operation of the new toolchain.

The latest Swift toolchain is installed as the default, so you can immediately use it to start a new project. For example:

```
$ swift package init
```

The `swiftly use` command selects the default toolchain for Swift commands (e.g. `swift test`, `swift build`):

```
$ swiftly use 6.0.3
$ swift --version
--
Apple Swift version 6.0.3 (swiftlang-6.0.3.1.2 clang-1600.0.28.6)
Target: arm64-apple-macosx15.0
```

At a later point, if there’s a new release of Swift you can install it alongside the existing toolchain with the `latest` command:

```
$ swiftly install latest
```

Pre-release of versions of Swift are available, including nightly "snapshot" toolchains. They can be easily listed using swiftly:

```
$ swiftly list-available main-snapshot
--
Available main development snapshot toolchains
----------------------------------------------
main-snapshot-2025-03-25
...
```

Once you’ve identified a snapshot toolchain, it can be installed using its name:

```
$ swiftly install main-snapshot-2025-03-25
--
Installing main-snapshot-2025-03-25
```

Another way to temporarily use a specific version of Swift is to use the special '+' selector. With this syntax, you don't need to first switch to a different toolchain:

```
$ swiftly run lldb +main-snapshot-2025-03-25
--
(lldb) _
```

If you’re building a SwiftPM project in a team setting and want to enforce a common version of the Swift toolchain on all contributors, simply create a `.swift-version` file in the root of your project folder with the desired version (e.g. “6.0.3”).

As swiftly is updated with new features and bug fixes, you can run `swiftly self-update` to check and install new releases.

## How swiftly works

By writing swiftly in Swift, we’re able to take advantage of the language’s features, support, and ecosystem of related projects. Swift comes with standard library features for working with the filesystem in its [Foundation](https://developer.apple.com/documentation/foundation/) module. For network operations [Async HTTP Client](https://github.com/swift-server/async-http-client) is there to work the HTTP requests. And to retrieve the latest Swift release, swiftly uses the [Swift OpenAPI](https://github.com/apple/swift-openapi-generator) plugin to generate the code to interact with the [swift.org](http://swift.org/)  website. Lastly, it takes advantage of Swift’s interoperability with C to use the existing libarchive library to work with archives. swiftly uses libarchive to extract the toolchains downloaded from the Swift website and the integration is simple.

It can be challenging to build shell programs that work well across multiple platforms with minimal system dependencies; this motivated us to switch swiftly away from using a shell program to install it and become a self-installing binary application. swiftly has access to excellent argument parsing capabilities, beautiful `--help` screens, and the full standard library.

The only remaining problem was being able to deliver the operating system and processor architecture specific binary to the users system with simplicity. The [swift.org](http://swift.org/) website helps with operating system detection, but it cannot reliably detect the Linux distribution. Luckily, there is the [Swift Static Linux SDK](https://www.swift.org/documentation/articles/static-linux-getting-started.html) that makes binaries that work with a wide range of distributions. The processor architecture can be determined on most unixes using `uname -m` . The result of all of this is the simplicity of a copy and paste from the website to your terminal and get started with Swift.

## Installing Swift, swiftly

Moving forward, swiftly will become the default way to install Swift outside of Xcode. The initial version supports macOS and a variety of Linux distributions, including Ubuntu, Debian, Fedora, Red Hat Enterprise Linux and Amazon Linux.

The [swiftly documentation](/swiftly/documentation/swiftlydocs/) provides further information about [using swiftly in a CI/CD environment](/swiftly/documentation/swiftly/automated-install), as well as setting proxy servers and custom install locations for enterprise environments. swiftly is an open source project, and so you can raise new issues or contribute pull requests at its [GitHub repository](https://github.com/swiftlang/swiftly). You can also [ask questions or discuss swiftly on the Swift Forums](https://forums.swift.org/tag/swiftly).

Special thanks to Patrick Freed for creating swiftly, contributing it to the Swift organization, and his continued contributions to this valuable tool. The community is what makes Swift amazing!

