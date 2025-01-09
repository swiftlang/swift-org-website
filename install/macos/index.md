---
layout: page-wide
title: 安装 Swift
---

{% include install/_os_tabs.md macos="true" %}

## 最新发布版本 (Swift {{ site.data.builds.swift_releases.last.name }})

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>Xcode</h3>
    <p class="description">
      下载最新版本的Xcode，其中包含最新的Swift工具链。
    </p>
    <a href="https://developer.apple.com/xcode/" class="cta-secondary external">安装 Xcode</a>
  </li>
  <li class="grid-level-1">
    <h3>安装包</h3>
    <p class="description">
      工具链安装包 (.pkg)
    </p>
    <a href="https://download.swift.org/{{ site.data.builds.swift_releases.last.tag | downcase }}/xcode/{{ site.data.builds.swift_releases.last.tag }}/{{ site.data.builds.swift_releases.last.tag }}-osx.pkg" class="cta-secondary">下载工具链</a>
    <a href="/install/macos/package_installer" class="cta-secondary">安装说明</a>
  </li>
</ul>

<ul class="grid-level-0">
  {% include install/_static_sdk_release.md %}
</ul>

<details class="download" style="margin-bottom: 0;">
  <summary>历史版本</summary>
  {% include_relative _older-releases.md %}
</details>

<hr>

## 开发快照版本

Swift快照是从分支自动创建的预编译二进制文件。这些快照不是正式发布版本。它们已经通过了自动化单元测试，但没有经过正式发布版本所需的完整测试。

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
