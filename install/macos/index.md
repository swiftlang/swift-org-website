---
layout: page-wide
title: Install Swift
---

{% include install/_os_tabs.md macos="true" %}

## Latest Release (Swift {{ site.data.builds.swift_releases.last.name }})

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>Xcode</h3>
    <p class="description">
      Download the latest version of Xcode, which is regularly refreshed with the latest Swift toolchain.
    </p>
    <a href="https://developer.apple.com/xcode/" class="cta-secondary external">Install Xcode</a>
  </li>
  <li class="grid-level-1">
    <h3>Package Installer</h3>
    <p class="description">
      Toolchain package installer (.pkg)
    </p>
    <a href="https://download.swift.org/{{ site.data.builds.swift_releases.last.tag | downcase }}/xcode/{{ site.data.builds.swift_releases.last.tag }}/{{ site.data.builds.swift_releases.last.tag }}-osx.pkg" class="cta-secondary">Download Toolchain</a>
    <a href="/install/macos/package_installer" class="cta-secondary">Instructions</a>
  </li>
</ul>

<ul class="grid-level-0">
  {% include install/_static_sdk_release.md %}
</ul>

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include_relative _older-releases.md %}
</details>

<hr>

## Development Snapshots

Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.

{% assign xcode_dev_builds = site.data.builds.development.xcode | sort: 'date' | reverse %}
{% assign xcode_6_1_builds = site.data.builds.swift-6_1-branch.xcode | sort: 'date' | reverse %}

<h3>Toolchain</h3>
<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>main</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ xcode_dev_builds.first.date | date_to_xmlschema }}" title="{{ xcode_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ xcode_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Toolchain package installer (.pkg)
      <ul>
        <li><a href="https://download.swift.org/development/xcode/{{ xcode_dev_builds.first.dir }}/{{ xcode_dev_builds.first.debug_info }}">Debugging Symbols</a></li>
      </ul>
    </p>
    <a href="https://download.swift.org/development/xcode/{{ xcode_dev_builds.first.dir }}/{{ xcode_dev_builds.first.download }}" class="cta-secondary">Download Toolchain</a>
  </li>
  <li class="grid-level-1">
    <h3>release/6.1</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ xcode_6_1_builds.first.date | date_to_xmlschema }}" title="{{ xcode_6_1_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ xcode_6_1_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Toolchain package installer (.pkg)
      <ul>
        <li><a href="https://download.swift.org/swift-6.1-branch/xcode/{{ xcode_6_1_builds.first.dir }}/{{ xcode_6_1_builds.first.debug_info }}">Debugging Symbols</a></li>
      </ul>
    </p>
    <a href="https://download.swift.org/swift-6.1-branch/xcode/{{ xcode_6_1_builds.first.dir }}/{{ xcode_6_1_builds.first.download }}" class="cta-secondary">Download Toolchain</a>
  </li>
</ul>
<a href="/install/macos/package_installer" class="cta-secondary">Instructions (Toolchain)</a>

{% include install/_static_sdk_dev.md %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Snapshots (main)</summary>
  {% include_relative _older-development-snapshots.md %}
</details>
<details class="download" style="margin-bottom: 0;">
  <summary>Older Snapshots (release/6.1)</summary>
  {% include_relative _older-6_1-snapshots.md %}
</details>
