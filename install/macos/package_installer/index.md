---
layout: page
title: macOS 软件包安装器
---

Xcode 包含了一个由 Apple 官方支持的 Swift 版本。
你可以从[下载页面](/install/macos)获取开发中的版本来尝试最新特性。

<div class="warning" markdown="1">
注意：如果要向 App Store 提交应用，你必须使用 Xcode 内置的 Swift 版本来构建你的应用。
</div>

<div class="warning" markdown="1">
注意：运行软件包安装器或使用已安装的工具链并不需要 Xcode。但是，当未安装 Xcode 时，由于一些[未解决的问题](https://github.com/swiftlang/swift-package-manager/issues/4396)，Swift Package Manager 的功能可能会受到限制。
</div>

0. 下载最新的 Swift 发行版
   ([{{ site.data.builds.swift_releases.last.name }}](/install/macos))
   或开发版本的[快照包](/install/macos/#development-snapshots)。
   请确保你的系统满足上述包的要求。

0. Run the package installer,
   which will install an Xcode toolchain into
   `~/Library/Developer/Toolchains/`:

    ~~~ shell
    installer -target CurrentUserHomeDirectory -pkg ~/Downloads/swift-DEVELOPMENT-SNAPSHOT-2025-02-26-a-osx.pkg
    ~~~

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

  * 对于 `xcodebuild`，传入 `-toolchain swift` 选项。

  另外，你也可以通过导出 `TOOLCHAINS` 环境变量来在命令行中选择工具链：

  ~~~ shell
  export TOOLCHAINS=$(plutil -extract CFBundleIdentifier raw ~/Library/Developer/Toolchains/<toolchain name>.xctoolchain/Info.plist)
  ~~~


### macOS 上的代码签名

macOS 的 `.pkg` 文件由 Swift 开源项目的开发者 ID 进行数字签名，
以验证它们未被篡改。包中的所有二进制文件也都经过签名。

macOS 上的 Swift 工具链安装器
应在标题栏右侧显示一个锁定图标。
点击锁定图标可以查看签名的详细信息。
签名应由 `Developer ID Installer: Swift Open Source (V9AUD2URP3)` 生成。

<div class="warning" markdown="1">
  如果没有显示锁定图标，
  或者签名不是由 Swift 开源开发者 ID 生成的，
  请不要继续安装。
  请退出安装程序，
  并发送邮件至 <swift-infrastructure@forums.swift.org>，
  提供尽可能详细的信息，
  以便我们调查问题。
</div>
