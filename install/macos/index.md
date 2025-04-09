---
layout: page-wide
title: 安装 Swift
---

{% include install/_os_tabs.md macos="true" %}

## 最新版本
<ul class="grid-level-0 grid-layout-1-column">
  <li class="grid-level-1 featured">
    <h3>Swiftly</h3>
  <p class="description">
    要从 Swift.org 下载工具链，请使用 Swiftly 工具链安装程序。Swift.org 工具链支持静态 Linux SDK，包含实验性功能如嵌入式 Swift 和 WebAssembly 支持。
  </p>
  <h4>在终端中运行以下命令：</h4>
  <div class="language-plaintext highlighter-rouge"><div class="highlight"><button>复制</button><pre class="highlight"><code>curl -O https://download.swift.org/swiftly/darwin/swiftly.pkg &amp;&amp; \
installer -pkg swiftly.pkg -target CurrentUserHomeDirectory &amp;&amp; \
~/.swiftly/bin/swiftly init --quiet-shell-followup &amp;&amp; \
. ~/.swiftly/env.sh &amp;&amp; \
hash -r
</code></pre></div></div>
  <h4>许可证：<a href="https://raw.githubusercontent.com/swiftlang/swiftly/refs/heads/main/LICENSE.txt">Apache-2.0</a></h4>
  <a href="/install/macos/swiftly" class="cta-secondary">安装说明</a>
  </li>
</ul>
<ul class="grid-level-0 grid-layout-1-column">
  <li class="grid-level-1">
    <h3>Xcode</h3>
    <p class="description">
      要为 Apple 平台开发 Swift 应用，请下载最新版本的 Xcode，它会定期更新最新的 Swift 工具链。
    </p>
    <a href="https://developer.apple.com/xcode/" class="cta-secondary external">安装 Xcode</a>
  </li>
</ul>


## 其他安装选项
<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>安装包</h3>
    <p class="description">
      Swiftly 自动化的工具链安装包（.pkg）可作为独立下载使用。
    </p>
    <a href="https://download.swift.org/{{ site.data.builds.swift_releases.last.tag | downcase }}/xcode/{{ site.data.builds.swift_releases.last.tag }}/{{ site.data.builds.swift_releases.last.tag }}-osx.pkg" class="cta-secondary">下载工具链</a>
    <a href="/install/macos/package_installer" class="cta-secondary">安装说明</a>
  </li>
  {% include install/_static_sdk_release.md %}
</ul>

<details class="download" style="margin-bottom: 0;">
  <summary>历史版本</summary>
  {% include_relative _older-releases.md %}
</details>

<hr>

## 开发快照版本

Swift 快照是从分支自动创建的预构建二进制文件。这些快照不是官方发布版本。它们已经通过了自动化单元测试，但没有经过官方发布版本所需的完整测试。

安装开发快照最简单的方法是使用 Swiftly 工具。更多信息请查看[说明页面](/install/macos/swiftly)。

{% assign xcode_dev_builds = site.data.builds.development.xcode | sort: 'date' | reverse %}
{% assign xcode_6_1_builds = site.data.builds.swift-6_1-branch.xcode | sort: 'date' | reverse %}

<h3>工具链</h3>
<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>main 分支</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ xcode_dev_builds.first.date | date_to_xmlschema }}" title="{{ xcode_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ xcode_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      工具链安装包 (.pkg)
      <ul>
        <li><a href="https://download.swift.org/development/xcode/{{ xcode_dev_builds.first.dir }}/{{ xcode_dev_builds.first.debug_info }}">调试符号</a></li>
      </ul>
    </p>
    <a href="https://download.swift.org/development/xcode/{{ xcode_dev_builds.first.dir }}/{{ xcode_dev_builds.first.download }}" class="cta-secondary">下载工具链</a>
  </li>
  <li class="grid-level-1">
    <h3>release/6.1 分支</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ xcode_6_1_builds.first.date | date_to_xmlschema }}" title="{{ xcode_6_1_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ xcode_6_1_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      工具链安装包 (.pkg)
      <ul>
        <li><a href="https://download.swift.org/swift-6.1-branch/xcode/{{ xcode_6_1_builds.first.dir }}/{{ xcode_6_1_builds.first.debug_info }}">调试符号</a></li>
      </ul>
    </p>
    <a href="https://download.swift.org/swift-6.1-branch/xcode/{{ xcode_6_1_builds.first.dir }}/{{ xcode_6_1_builds.first.download }}" class="cta-secondary">下载工具链</a>
  </li>
</ul>
<a href="/install/macos/package_installer" class="cta-secondary">安装说明 (工具链)</a>

{% include install/_static_sdk_dev.md %}

<details class="download" style="margin-bottom: 0;">
  <summary>历史快照 (main)</summary>
  {% include_relative _older-development-snapshots.md %}
</details>
<details class="download" style="margin-bottom: 0;">
  <summary>历史快照 (release/6.1)</summary>
  {% include_relative _older-6_1-snapshots.md %}
</details>
