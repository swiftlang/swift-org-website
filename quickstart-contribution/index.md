---
layout: new-layouts/base
title: QuickStart contribution
---

* [Configure the system](#configure-the-system)
* [Build Swift Compiler](#build-swift-compiler)
    * [Build Swift compiler without additional tools](#build-swift-compiler-without-additional-tools)
    * [Build Swift Compiler with Sccache](#build-swift-compiler-with-sccache)
    * [Build Swift stdlib against a downloadable toolchain](#build-swift-stdlib-against-a-downloadable-toolchain)
* [Build swift-corelibs-foundation](#build-swift-corelibs-foundation)
* [Good first issues](#good-first-issues)

## Configure the system

### Requirements

* macOS 10.14.4 or later
* Xcode 11 beta 1
* 60 GB of free disk space


### Install Xcode

* Download [Xcode 11 beta 1](https://developer.apple.com/download/) and select Applications
* Double click on the XIP image
* Move the Xcode-beta.app to /Applications/

~~~bash
mv ~/Downloads/Xcode-beta.app /Applications/
~~~
* xcode-select the Xcode 11 beta 1

~~~bash
xcode-select -s /Applications/Xcode-beta.app
~~~


### Install CMake and Ninja

* Install CMake using package manager [1]
* Homebrew

~~~bash
brew install cmake ninja
~~~
* MacPorts

~~~bash
port install cmake ninja
~~~

### Setup Swift Repositories

* Clone Swift repository

~~~bash
git clone git@github.com:swiftlang/swift.git
~~~
* Clone other required repositories

~~~bash
./swift/utils/update-checkout --clone --scheme main
~~~

* * *

## Build Swift Compiler

* * *

### Build Swift compiler without additional tools

* Build Swift Compiler:

~~~bash
./swift/utils/build-script --build-ninja --release-debuginfo
~~~

### Build Swift Compiler with Sccache

* Install sccache using Homebrew [2]

~~~bash
brew install sccache
~~~
* Set sccache server URL

~~~bash
export SCCACHE_REDIS=${SCCACHE_REDIS}
~~~
* Start sccache server

~~~bash
sccache  --start-server
~~~
* Build Swift Compiler:

~~~bash
./swift/utils/build-script \
    --cmake-c-launcher `which sccache` \
    --cmake-cxx-launcher `which sccache` \
    --preset=buildbot_incremental,tools=RA,stdlib=RD,build
~~~

* Stop sccache server

~~~bash
sccache  --stop-server
~~~

### Build Swift stdlib against a downloadable toolchain

* Create a workspace directory

~~~bash
mkdir workspace
cd workspace
~~~
* Download the following snapshot from [swift.org](http://swift.org/): [https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg](https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg)

~~~bash
curl -O https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg
~~~
* Untar the file using the commands into workspace/toolchain

~~~bash
mkdir toolchain
xar -C toolchain -x -f swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg
tar -C toolchain -xzf toolchain/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx-package.pkg/Payload
TOOLCHAIN_BIN_DIR=$PWD/toolchain/usr/bin
~~~
* Clone Swift repository:

~~~bash
git clone git@github.com:swiftlang/swift.git
~~~
* Clone other required repositories:

~~~bash
./swift/utils/update-checkout --clone --scheme=stdlib_standalone
~~~
* Build the swift stdlib using one of the presets from the chart below. We suggest for development to try `stdlib_DA_standalone,build`. The form of the build-script invocation is:


    * To build/test

        ```
        ./swift/utils/build-script --preset=$PRESET_NAME toolchain_path=$TOOLCHAIN_BIN_DIR
        ```

    * To reconfigure (rerun cmake), pass in the reconfigure flag.

        ```
        ./swift/utils/build-script --preset=$PRESET_NAME toolchain_path=$TOOLCHAIN_BIN_DIR --reconfigure
        ```

    * Example:

        ```
        ./swift/utils/build-script --preset=stdlib_DA_standalone,build toolchain_path=$TOOLCHAIN_BIN_DIR
        ```

    * To clean remove ./workspace/build/$PRESET_STEM. Example:

        ```
        rm -rfv build/stdlib_DA_standalone
        ```

|Preset `$PRESET_NAME`	|Build Type	|Test	|Debug Info	|
|---|---|---|---|
|`stdlib_DA_standalone,build`	|Debug	|No	|Yes	|
|`stdlib_DA_standalone,build,test`	|Debug	|Yes	|Yes	|
|`stdlib_RA_standalone,build`	|Release	|No	|No	|
|`stdlib_RA_standalone,build,test`	|Release	|Yes	|No	|
|`stdlib_RDA_standalone,build`	|Release	|No	|Yes	|
|`stdlib_RDA_standalone,build,test`	|Release	|Yes	|Yes	|

* * *

## Build swift-corelibs-foundation

* * *

### build swift-corelibs-foundation against a downloadable toolchain

* Download and install the latest trunk snapshot using the Installer app from [swift.org](/download/#snapshots)
* Clone Swift repository

~~~bash
git clone git@github.com:swiftlang/swift.git
~~~
* Clone other required repositories

~~~bash
./swift/utils/update-checkout --clone --scheme main
~~~
* Open the Xcode version you just installed; select from the menu Xcode > Preferences > Components > Toolchains and enable the trunk snapshot you installed.
* Open `Foundation.xcworkspace` from the `swift-corelibs-foundation` repository from that version of Xcode.
* Build and run the `TestFoundation` scheme.

* * *

[1] Manually install CMake

* Download [CMake](https://github.com/Kitware/CMake/releases/download/v3.14.4/cmake-3.14.4-Darwin-x86_64.tar.gz)
* Install CMake

~~~bash
mkdir -p $HOME/bin
tar xfz cmake-3.14.4-Darwin-x86_64.tar.gz -C $HOME/bin
export PATH=$HOME/bin/cmake-3.14.4-Darwin-x86_64/CMake.app/Contents/bin:$PATH
~~~

[2] Manually Install Sccache:

* Download [sccache](https://github.com/mozilla/sccache/releases/download/0.2.8/sccache-0.2.8-x86_64-apple-darwin.tar.gz)
* Install sccache

~~~bash
mkdir -p $HOME/bin
tar xfz sccache-0.2.8-x86_64-apple-darwin.tar.gz -C $HOME/bin
export PATH=$HOME/bin/sccache-0.2.8-x86_64-apple-darwin:$PATH
~~~


## Good first issues

The Swift project uses GitHub Issues for tracking bugs, ideas, and tasks. For
example, the issues for the Swift compiler repository can be found on its
[issues dashboard](http://github.com/swiftlang/swift/issues). Beginner-friendly
issues are decorated with the `good first issue` label and can be found by
visiting `https://github.com/apple/<repository>/contribute`.

