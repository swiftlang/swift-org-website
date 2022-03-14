---
layout: page
title: QuickStart contribution
---

* [Configure the system](#configure-the-system)
* [Build Swift Compiler](#build-swift-compiler)
    * [Build Swift compiler without additional tools](#build-swift-compiler-without-additional-tools)
    * [Build Swift Compiler with Sccache](#build-swift-compiler-with-sccache)
    * [Build Swift stdlib against a downloadable toolchain](#build-swift-stdlib-against-a-downloadable-toolchain)
* [Build swift-corelibs-foundation](#build-swift-corelibs-foundation)
* [Starter Bugs](#starter-bugs)

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
git clone git@github.com:apple/swift.git
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
git clone git@github.com:apple/swift.git
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

* Download and install the latest trunk snapshot using the Installer app from [swift.org](https://swift.org/download/#snapshots)
* Clone Swift repository  

~~~bash
git clone git@github.com:apple/swift.git
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


## Starter bugs

The Swift project uses JIRA for bug tracking and the bugs and enhancement requests could be found at [bugs.swift.org](http://bugs.swift.org/). If you are new to the codebase, you can identify beginner tasks by searching for the bugs that have the "Starter Bug" label. Here are some beginner bugs that you can start with with today.

### Swift Compiler

[SR-10292](https://bugs.swift.org/browse/SR-10292): Missing fix-it to add 'override' keyword while trying to override a computed property  
[SR-9679](https://bugs.swift.org/browse/SR-9679): Spurious "enum element cannot be referenced as an instance member" error  
[SR-9040](https://bugs.swift.org/browse/SR-9040): Suggestion when overriding implictly unwrapped optional does not suggest making parameter implictly unwrapped  
[SR-9615](https://bugs.swift.org/browse/SR-9615): @escaping and inout should work together but don't  
[SR-8797](https://bugs.swift.org/browse/SR-8797): Misleading diagnostic when closure parameter is missing  

### Standard Library

[SR-8905](https://bugs.swift.org/browse/SR-8905): Gaps in String benchmarking  
[SR-10817](https://bugs.swift.org/browse/SR-10817): Gaps in arithmetic benchmarking / testing  

### LLDB

[SR-10584](https://bugs.swift.org/browse/SR-10584): REPL crashes when triggering code completion with tab  
[SR-5994](https://bugs.swift.org/browse/SR-5994): Off by one error in URL description data formatter  
[SR-6189](https://bugs.swift.org/browse/SR-6189): Wrong values being printed when using protocols  
[SR-6657](https://bugs.swift.org/browse/SR-6657): Couldn't load 'self' because its value couldn't be evaluated  
[SR-6156](https://bugs.swift.org/browse/SR-6156): Expression parser fails to evaluate member variable  
[SR-1350](https://bugs.swift.org/browse/SR-1350): REPL doesn't correctly handle guard variable shadowing  

### SourceKit-LSP

[SR-10806](https://bugs.swift.org/browse/SR-10806): workspace/symbol (open quickly)  
[SR-10807](https://bugs.swift.org/browse/SR-10807): textDocument/typeDefinition  
[SR-10808](https://bugs.swift.org/browse/SR-10808): textDocument/implementation (find impls of protocol)  
[SR-10809](https://bugs.swift.org/browse/SR-10809): Honour ClientCapabilities for code completion snippets  

[bugs.swift.org](http://bugs.swift.org/):  

* component: SourceKit-LSP, label: StarterBug  
* component: SwiftSyntax, label: StarterBug  

### Swift Package Manager

[SR-10794](https://bugs.swift.org/browse/SR-10794): Have SwiftPM suggest close commands  
[SR-10633](https://bugs.swift.org/browse/SR-10633): SwiftPM can't find its own clang  
[SR-7828](https://bugs.swift.org/browse/SR-7828): Include name-based "fixits" whenever we do a unique name membership lookup  
[SR-20](https://bugs.swift.org/browse/SR-20): Update swift --help to explain multitool support ("swift build", etc.)  
[SR-9402](https://bugs.swift.org/browse/SR-9402): SwiftPM should diagnose duplicate target dependency declarations and emit a warning  
[SR-10616](https://bugs.swift.org/browse/SR-10616): SwiftPM: cross compilation broken in Swift 5.0.1  
[SR-10802](https://bugs.swift.org/browse/SR-10802): --disable-automatic-resolution doesn't work with local packages  
[SR-10804](https://bugs.swift.org/browse/SR-10804): Add $(inherited) to OTHER_SWIFT_FLAGS  
[SR-10805](https://bugs.swift.org/browse/SR-10805): The `root` property in PackageModel.Sources struct should use the directory name as on disk  
[SR-10799](https://bugs.swift.org/browse/SR-10799): SwiftPM should have a --no-network flag that ensures no network calls are made  
[SR-10800](https://bugs.swift.org/browse/SR-10800): `swift test` should have more flexible test selection  
[SR-10801](https://bugs.swift.org/browse/SR-10801): `swift test --filter` should display summary for the entire group of tests run, not per-test  
[SR-10803](https://bugs.swift.org/browse/SR-10803): Descriptive Help for "swift package init --type" in SPM  

### Swift Infrastructure

[SR-10824](https://bugs.swift.org/browse/SR-10824): Add support for XML test results to source compatibility suite  
[SR-10810](https://bugs.swift.org/browse/SR-10810): Create preset for LLDB macOS bots  
[SR-10825](https://bugs.swift.org/browse/SR-10825): Profile building and testing Swift compiler  
[SR-10827](https://bugs.swift.org/browse/SR-10827): Add test suite to swift-docker  


### Swift Corelibs Foundation 

[SR-10347](https://bugs.swift.org/browse/SR-10347): Parity Remove all uses of NSUnimplemented from swift-corelibs-foundation  


