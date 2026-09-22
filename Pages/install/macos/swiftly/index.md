---
template: page
title: Getting Started with Swiftly on macOS
contentTemplating: true
---

Download the [swiftly package for macOS](https://download.swift.org/swiftly/darwin/swiftly-#(swiftlyVersion).pkg).

Install the package in your user account:

```
installer -pkg swiftly-#(swiftlyVersion).pkg -target CurrentUserHomeDirectory
```

Run the following command in your terminal, to configure swiftly for your account, and automatically download the latest swift toolchain.

```
~/.swiftly/bin/swiftly init
```

Note: You can set the SWIFTLY_HOME_DIR and SWIFTLY_BIN_DIR environment variables to customize the install location.

<div class="warning" markdown="1">
Your current shell may need some additional steps to update your session. Follow the guidance at the end of the installation for a smooth install experience, such as sourcing the environment file, and rehashing your shell's PATH.
</div>

Now that swiftly and swift are installed, you can access the `swift` command from the latest Swift release:

```
swift --version
--
Apple Swift version #(latestRelease) (swift-#(latestRelease)-RELEASE)
Target: arm64-apple-macosx15.0
```

Or, you can install (and use) another swift release:

```
swiftly install --use 5.10
swift --version
--
Apple Swift version 5.10 (swift-5.10-RELEASE)
Target: arm64-apple-macosx15.0
```

There's also an option to install the latest snapshot release and get access to the latest features:

```
swiftly install --use main-snapshot
```

Check for updates to swiftly and install them by running the self-update command:

```
swiftly self-update
```

You can discover more about swiftly in the [documentation](https://www.swift.org/swiftly/documentation/swiftlydocs/)
