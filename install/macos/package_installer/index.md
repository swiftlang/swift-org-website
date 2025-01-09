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

0. 运行软件包安装器，
   它会将 Xcode 工具链安装到
   `/Library/Developer/Toolchains/` 目录。

   Xcode 工具链（`.xctoolchain`）包含编译器、LLDB 以及
   其他相关工具的副本，这些工具能够为特定版本的 Swift
   提供完整的开发体验。

* 要在 Xcode 中选择已安装的工具链，请导航到 `Xcode > Toolchains`。

  Xcode 使用选定的工具链来构建 Swift 代码、调试，
  甚至代码补全和语法高亮。当 Xcode 使用已安装的工具链时，
  你会在 Xcode 的工具栏中看到一个新的工具链指示器。
  选择默认工具链可以返回到 Xcode 的内置工具。

* 在 Xcode 中选择工具链只会影响 IDE。要在命令行中使用已安装的工具链：
  * 对于 `xcrun`，传入 `--toolchain swift` 选项。例如：

    ~~~ shell
    xcrun --toolchain swift swift --version
    ~~~

  * 对于 `xcodebuild`，传入 `-toolchain swift` 选项。

  另外，你也可以通过导出 `TOOLCHAINS` 环境变量来在命令行中选择工具链：

  ~~~ shell
  export TOOLCHAINS=$(plutil -extract CFBundleIdentifier raw /Library/Developer/Toolchains/<工具链名称>.xctoolchain/Info.plist)
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
