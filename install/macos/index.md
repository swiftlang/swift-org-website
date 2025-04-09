---
layout: page-wide
title: 安装 Swift
---

{% include install/_os_tabs.md macos="true" %}

## Latest Release
<ul class="grid-level-0 grid-layout-1-column">
  <li class="grid-level-1 featured">
    <h3>Swiftly</h3>
  <p class="description">
    To download toolchains from Swift.org, use the Swiftly toolchain installer. Swift.org toolchains support Static Linux SDK, include experimental features like Embedded Swift and support for WebAssembly.
  </p>
  <h4>Run this in a terminal:</h4>
  <div class="language-plaintext highlighter-rouge"><div class="highlight"><button>Copy</button><pre class="highlight"><code>curl -O https://download.swift.org/swiftly/darwin/swiftly.pkg &amp;&amp; \
installer -pkg swiftly.pkg -target CurrentUserHomeDirectory &amp;&amp; \
~/.swiftly/bin/swiftly init --quiet-shell-followup &amp;&amp; \
. ~/.swiftly/env.sh &amp;&amp; \
hash -r
</code></pre></div></div>
  <h4>License: <a href="https://raw.githubusercontent.com/swiftlang/swiftly/refs/heads/main/LICENSE.txt">Apache-2.0</a></h4>
  <a href="/install/macos/swiftly" class="cta-secondary">Instructions</a>
  </li>
</ul>
<ul class="grid-level-0 grid-layout-1-column">
  <li class="grid-level-1">
    <h3>Xcode</h3>
    <p class="description">
      To develop with Swift for Apple platforms, download the latest version of Xcode, which is regularly refreshed with the latest Swift toolchain.
    </p>
    <a href="https://developer.apple.com/xcode/" class="cta-secondary external">安装 Xcode</a>
  </li>
</ul>


## Other Install Options
<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>安装包</h3>
    <p class="description">
      The toolchain package installer (.pkg) that Swiftly automates is available as a stand-alone download.
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

Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.

The easiest way to install development snapshots is with the Swiftly tool. Read more on the [instructions page](/install/macos/swiftly).

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
