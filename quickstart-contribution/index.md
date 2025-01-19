---
layout: page
title: 快速入门指南
---

* [配置系统](#配置系统)
* [构建 Swift 编译器](#构建-swift-编译器)
    * [不带额外工具构建 Swift 编译器](#不带额外工具构建-swift-编译器)
    * [使用 Sccache 构建 Swift 编译器](#使用-sccache-构建-swift-编译器)
    * [基于可下载工具链构建 Swift 标准库](#基于可下载工具链构建-swift-标准库)
* [构建 swift-corelibs-foundation](#构建-swift-corelibs-foundation)
* [适合新手的问题](#适合新手的问题)

## 配置系统

### 系统要求

* macOS 10.14.4 或更高版本
* Xcode 11 beta 1
* 60 GB 可用磁盘空间

### 安装 Xcode

* 下载 [Xcode 11 beta 1](https://developer.apple.com/download/) 并选择应用程序
* 双击 XIP 镜像文件
* 将 Xcode-beta.app 移动到 /Applications/ 目录

~~~bash
mv ~/Downloads/Xcode-beta.app /Applications/
~~~
* 使用 xcode-select 选择 Xcode 11 beta 1

~~~bash
xcode-select -s /Applications/Xcode-beta.app
~~~

### 安装 CMake 和 Ninja

* 使用包管理器安装 CMake [1]
* Homebrew

~~~bash
brew install cmake ninja
~~~
* MacPorts

~~~bash
port install cmake ninja
~~~

### 设置 Swift 代码仓库

* 克隆 Swift 代码仓库

~~~bash
git clone git@github.com:swiftlang/swift.git
~~~
* 克隆其他必需的代码仓库

~~~bash
./swift/utils/update-checkout --clone --scheme main
~~~

* * *

## 构建 Swift 编译器

* * *

### 不带额外工具构建 Swift 编译器

* 构建 Swift 编译器：

~~~bash
./swift/utils/build-script --build-ninja --release-debuginfo
~~~

### 使用 Sccache 构建 Swift 编译器

* 使用 Homebrew 安装 sccache [2]

~~~bash
brew install sccache
~~~
* 设置 sccache 服务器 URL

~~~bash
export SCCACHE_REDIS=${SCCACHE_REDIS}
~~~
* 启动 sccache 服务器

~~~bash
sccache  --start-server
~~~
* 构建 Swift 编译器：

~~~bash
./swift/utils/build-script \
    --cmake-c-launcher `which sccache` \
    --cmake-cxx-launcher `which sccache` \
    --preset=buildbot_incremental,tools=RA,stdlib=RD,build
~~~

* 停止 sccache 服务器

~~~bash
sccache  --stop-server
~~~

### 基于可下载工具链构建 Swift 标准库

* 创建工作目录

~~~bash
mkdir workspace
cd workspace
~~~
* 从 [swift.org](http://swift.org/) 下载以下快照：[https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg](https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg)

~~~bash
curl -O https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg
~~~
* 使用以下命令将文件解压到 workspace/toolchain

~~~bash
mkdir toolchain
xar -C toolchain -x -f swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx.pkg
tar -C toolchain -xzf toolchain/swift-DEVELOPMENT-SNAPSHOT-2019-06-06-a-osx-package.pkg/Payload
TOOLCHAIN_BIN_DIR=$PWD/toolchain/usr/bin
~~~
* 克隆 Swift 代码仓库：

~~~bash
git clone git@github.com:swiftlang/swift.git
~~~
* 克隆其他必需的代码仓库：

~~~bash
./swift/utils/update-checkout --clone --scheme=stdlib_standalone
~~~
* 使用下表中的预设之一构建 swift 标准库。我们建议开发时尝试使用 `stdlib_DA_standalone,build`。构建脚本调用格式如下：


    * 构建/测试

        ```
        ./swift/utils/build-script --preset=$PRESET_NAME toolchain_path=$TOOLCHAIN_BIN_DIR
        ```

    * 重新配置（重新运行 cmake），传入 reconfigure 标志。

        ```
        ./swift/utils/build-script --preset=$PRESET_NAME toolchain_path=$TOOLCHAIN_BIN_DIR --reconfigure
        ```

    * 示例：

        ```
        ./swift/utils/build-script --preset=stdlib_DA_standalone,build toolchain_path=$TOOLCHAIN_BIN_DIR
        ```

    * 清理：删除 ./workspace/build/$PRESET_STEM。示例：

        ```
        rm -rfv build/stdlib_DA_standalone
        ```

|预设名称 `$PRESET_NAME`	|构建类型	|测试	|调试信息	|
|---|---|---|---|
|`stdlib_DA_standalone,build`	|Debug	|否	|是	|
|`stdlib_DA_standalone,build,test`	|Debug	|是	|是	|
|`stdlib_RA_standalone,build`	|Release	|否	|否	|
|`stdlib_RA_standalone,build,test`	|Release	|是	|否	|
|`stdlib_RDA_standalone,build`	|Release	|否	|是	|
|`stdlib_RDA_standalone,build,test`	|Release	|是	|是	|

* * *

## 构建 swift-corelibs-foundation

* * *

### 基于可下载工具链构建 swift-corelibs-foundation

* 从 [swift.org](/download/#snapshots) 下载并使用安装程序安装最新的主干快照
* 克隆 Swift 代码仓库

~~~bash
git clone git@github.com:swiftlang/swift.git
~~~
* 克隆其他必需的代码仓库

~~~bash
./swift/utils/update-checkout --clone --scheme main
~~~
* 打开刚刚安装的 Xcode 版本；从菜单选择 Xcode > Preferences > Components > Toolchains，并启用已安装的主干快照。
* 使用该版本的 Xcode 打开 `swift-corelibs-foundation` 仓库中的 `Foundation.xcworkspace`。
* 构建并运行 `TestFoundation` scheme。

* * *

[1] 手动安装 CMake

* 下载 [CMake](https://github.com/Kitware/CMake/releases/download/v3.14.4/cmake-3.14.4-Darwin-x86_64.tar.gz)
* 安装 CMake

~~~bash
mkdir -p $HOME/bin
tar xfz cmake-3.14.4-Darwin-x86_64.tar.gz -C $HOME/bin
export PATH=$HOME/bin/cmake-3.14.4-Darwin-x86_64/CMake.app/Contents/bin:$PATH
~~~

[2] 手动安装 Sccache：

* 下载 [sccache](https://github.com/mozilla/sccache/releases/download/0.2.8/sccache-0.2.8-x86_64-apple-darwin.tar.gz)
* 安装 sccache

~~~bash
mkdir -p $HOME/bin
tar xfz sccache-0.2.8-x86_64-apple-darwin.tar.gz -C $HOME/bin
export PATH=$HOME/bin/sccache-0.2.8-x86_64-apple-darwin:$PATH
~~~

## 适合新手的问题

Swift 项目使用 GitHub Issues 来跟踪 bug、想法和任务。例如，Swift 编译器仓库的问题可以在其
[问题面板](http://github.com/swiftlang/swift/issues)上找到。适合新手的问题会标记
`good first issue` 标签，可以通过访问 `https://github.com/apple/<repository>/contribute` 找到。

