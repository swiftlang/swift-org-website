---
layout: page
title: macOS Installation Options
---

## Installation via Xcode

Installing Swift on macOS offers a compelling environment for developing native applications for Apple platforms, benefiting from tight integration with Xcode and the broader Apple ecosystem. 

To start using Xcode, [download the current version](https://itunes.apple.com/app/xcode/id497799835) which contains the latest Swift release.

## Installation via package installer

If you want a more customized development experience for working in a specific version of Swift, you have the option to use a package installer. 

While Xcode already includes a release of Swift that is supported by Apple, you can experiment with a version that is still in development by downloading one of the packages from the [download](/download) page. 

> Note 1: To submit to the App Store you must build your app using the version of Swift that comes included within Xcode.

> Note 2: Xcode is not required to run the package installer or use an installed
toolchain. However, when Xcode is not installed, the functionality of the Swift
Package Manager may be limited due to some [outstanding issues](https://github.com/apple/swift-package-manager/issues/4396).

Follow these instructions to stay up-to-date with the latest features and improvements in Swift, and tailor your development environment to your specific needs:

1. Download the latest release ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases))
   or development [snapshot](/download/#snapshots) package.
   Make sure that your system meets the aforementioned requirements for
   this package.

2. Run the package installer,
   which will install an Xcode toolchain into
   `/Library/Developer/Toolchains/`.

   An Xcode toolchain (`.xctoolchain`) includes a copy of the compiler, LLDB,
   and other related tools needed to provide a cohesive development experience
   for working in a specific version of Swift.

* To select the installed toolchain in Xcode, navigate to `Xcode > Toolchains`.

  Xcode uses the selected toolchain for building Swift code, debugging, and
  even code completion and syntax coloring. You'll see a new toolchain
  indicator in Xcode's toolbar when Xcode is using an installed toolchain.
  Select the default toolchain to go back to Xcode's built-in tools.

* Selecting a toolchain in Xcode affects the IDE only. To use the installed
  toolchain with
  * `xcrun`, pass the `--toolchain swift` option. For example:

    ~~~ shell
    xcrun --toolchain swift swift --version
    ~~~

  * `xcodebuild`, pass the `-toolchain swift` option.

  Alternatively, you can select the toolchain on the command line by exporting
  the `TOOLCHAINS` environment variable as follows:

  ~~~ shell
  export TOOLCHAINS=$(plutil -extract CFBundleIdentifier raw /Library/Developer/Toolchains/<toolchain name>.xctoolchain/Info.plist)
  ~~~

## Code Signing on macOS

The macOS `.pkg` files are digitally signed
by the developer ID of the Swift open-source project
to allow verification that they have not been tampered with.
All binaries in the package are signed as well.

The Swift toolchain installer on macOS
should display a lock icon on the right side of the title bar.
Clicking the lock brings up detailed information about the signature.
The signature should be produced by
`Developer ID Installer: Swift Open Source (V9AUD2URP3)`.

> Warning: If the lock is not displayed
or the signature is not produced by the Swift open-source developer ID,
do not proceed with the installation.
Instead, quit the installer
and email <swift-infrastructure@forums.swift.org>
with as much detail as possible,
so that we can investigate the problem.
