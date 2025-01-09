---
layout: page-wide
title: 安装 Swift
---

{% include install/_os_tabs.md windows="true" %}

## 最新版本 (Swift {{ site.data.builds.swift_releases.last.name }})

{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Windows 10' | first %}

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>WinGet (推荐)</h3>
    <p class="description">
      通过 Windows 包管理器（WinGet）安装 Swift。
    </p>
    <a href="/install/windows/winget" class="cta-secondary">安装说明</a>
  </li>
  <li class="grid-level-1">
    <h3>手动安装</h3>
    <p class="description">
      下载 Swift 安装程序（.exe）。
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      {% for arch in platform.archs %}
      <a href="https://download.swift.org/{{ tag | downcase }}/windows10{% if arch != "x86_64" %}-{{ arch }}{% endif %}/{{ tag }}/{{ tag }}-windows10{% if arch != "x86_64" %}-{{ arch }}{% endif %}.exe" class="cta-secondary">下载 ({{ arch }})</a>
      {% endfor %}
    </ul>
    <a href="/install/windows/manual" class="cta-secondary">安装说明</a>
  </li>
  <li class="grid-level-1">
    <h3>Scoop</h3>
    <p class="description">
      通过 Scoop 安装 Swift。
    </p>
    <a href="/install/windows/scoop" class="cta-secondary">安装说明</a>
  </li>
  <li class="grid-level-1">
    <h3>Docker</h3>
    <p class="description">
      Swift 官方 Docker 镜像。
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">{{ site.data.builds.swift_releases.last.name }}-windowsservercore-ltsc2022</a>
  </li>
</ul>

## 历史版本

Windows 系统上可以通过手动安装程序安装旧版本的 Swift，[详细说明请见此处](/install/windows/archived)。

<details class="download" style="margin-bottom: 0;">
  <summary>历史版本</summary>
  {% include install/_older-releases.md platform="Windows 10" %}
</details>

<hr>

## 开发快照版本

Swift 快照是从分支自动创建的预构建二进制文件。这些快照不是正式发布版本。它们已经过自动化单元测试，但没有经过正式发布版本所需的完整测试。

{% assign windows_dev_builds = site.data.builds.development.windows10 | sort: 'date' | reverse %}
{% assign windows_arm64_dev_builds = site.data.builds.development.windows10-arm64 | sort: 'date' | reverse %}
{% assign windows10_6_1_builds = site.data.builds.swift-6_1-branch.windows10 | sort: 'date' | reverse %}
{% assign windows10_arm64_6_1_builds = site.data.builds.swift-6_1-branch.windows10-arm64 | sort: 'date' | reverse %}

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>main 分支</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ windows_dev_builds.first.date | date_to_xmlschema }}" title="{{ windows_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ windows_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      安装包（.exe）。
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      <a href="https://download.swift.org/development/windows10/{{ windows_dev_builds.first.dir }}/{{ windows_dev_builds.first.download }}" class="cta-secondary">下载 (x86_64)</a>
      <a href="https://download.swift.org/development/windows10-arm64/{{ windows_arm64_dev_builds.first.dir }}/{{ windows_arm64_dev_builds.first.download }}" class="cta-secondary">下载 (arm64)</a>
    </ul>
  </li>
  <li class="grid-level-1">
    <h3>release/6.1 分支</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ windows10_6_1_builds.first.date | date_to_xmlschema }}" title="{{ windows10_6_1_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ windows10_6_1_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      安装包（.exe）。
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      <a href="https://download.swift.org/swift-6.1-branch/windows10/{{ windows10_6_1_builds.first.dir }}/{{ windows10_6_1_builds.first.download }}" class="cta-secondary">下载 (x86_64)</a>
      <a href="https://download.swift.org/swift-6.1-branch/windows10-arm64/{{ windows10_arm64_6_1_builds.first.dir }}/{{ windows10_arm64_6_1_builds.first.download }}" class="cta-secondary">下载 (arm64)</a>
    </ul>
  </li>
</ul>
<a href="/install/windows/manual/" class="cta-secondary">安装说明</a>
<details class="download" style="margin-bottom: 0;">
  <summary>历史快照版本 (main)</summary>
  {% include install/_older_snapshots.md builds=windows_dev_builds name="windows" platform_dir="windows10" branch_dir="development" %}
</details>
<details class="download" style="margin-bottom: 0;">
  <summary>历史快照版本 (release/6.1)</summary>
  {% include install/_older_snapshots.md builds=windows10_6_1_builds name="windows" platform_dir="windows10" branch_dir="swift-6.1-branch" %}
</details>
