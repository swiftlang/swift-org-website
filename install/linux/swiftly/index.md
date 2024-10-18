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
Downloaded 488.5 MiB of 488.5 MiB
Extracting toolchain...
Swift 6.0.1 installed successfully!

$ swift --version

Swift version 6.0.1 (swift-6.0.1-RELEASE)
Target: x86_64-unknown-linux-gnu
```

Or, you can install (and use) a swift release:

```
$ swiftly install --use 5.10

$ swift --version

Swift version 5.10 (swift-5.10-RELEASE)
Target: x86_64-unknown-linux-gnu
```

There's also an option to install the latest snapshot release and get access to the latest features:

```
$ swiftly install main-snapshot
```

> Note: This last example just installed the toolchain. You can run "swiftly use" to switch to it and other installed toolchahins when you're ready.
