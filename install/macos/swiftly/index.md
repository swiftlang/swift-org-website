---
layout: page
title: Getting Started with Swiftly
---

Download swiftly from the [install page](/install).

Run the following command in your terminal, to configure swiftly for your account:

```
$ swiftly init
```

Once swiftly is installed you can use it to install the latest available swift toolchain like this:

```
$ swiftly install latest

Fetching the latest stable Swift release...
Installing Swift 6.0.1
Downloaded 1355.3 MiB of 1355.3 MiB
Installing package in user home directory...
installer: Package name is Swift Open Source Xcode Toolchain
installer: Upgrading at base path /Users/swift
installer: The upgrade was successful.
Swift 6.0.1 installed successfully!

$ swift --version

Apple Swift version 6.0.1 (swift-6.0.1-RELEASE)
Target: arm64-apple-macosx15.0
```

Or, you can install (and use) a swift release:

```
$ swiftly install --use 5.10

$ swift --version

Apple Swift version 5.10 (swift-5.10-RELEASE)
Target: arm64-apple-macosx15.0
```

There's also an option to install the latest snapshot release and get access to the latest features:

```
$ swiftly install main-snapshot
```

> Note: This last example just installed the toolchain. You can run "swiftly use" to switch to it and other installed toolchahins when you're ready.
