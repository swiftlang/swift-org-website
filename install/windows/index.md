---
layout: page-wide
title: Install Swift
---

{% include install/_os_tabs.md windows="true" %}

## Latest Release (Swift {{ site.data.builds.swift_releases.last.name }})

{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Windows 10' | first %}

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>WinGet (recommended)</h3>
    <p class="description">
      Install Swift via the Windows Package Manager (also known as WinGet).
    </p>
    <a href="/install/windows/winget" class="cta-secondary">Instructions</a>
  </li>
  <li class="grid-level-1">
    <h3>Manual Installation</h3>
    <p class="description">
      Download the Swift installer (.exe).
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      {% for arch in platform.archs %}
      <a href="https://download.swift.org/{{ tag | downcase }}/windows10{% if arch != "x86_64" %}-{{ arch }}{% endif %}/{{ tag }}/{{ tag }}-windows10{% if arch != "x86_64" %}-{{ arch }}{% endif %}.exe" class="cta-secondary">Download ({{ arch }})</a>
      {% endfor %}
    </ul>
    <a href="/install/windows/manual" class="cta-secondary">Instructions</a>
  </li>
  <li class="grid-level-1">
    <h3>Scoop</h3>
    <p class="description">
      Install Swift via Scoop.
    </p>
    <a href="/install/windows/scoop" class="cta-secondary">Instructions</a>
  </li>
  <li class="grid-level-1">
    <h3>Docker</h3>
    <p class="description">
      The official Docker images for Swift.
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">{{ site.data.builds.swift_releases.last.name }}-windowsservercore-ltsc2022</a>
  </li>
</ul>

<hr>

## Development Snapshots

Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.

{% assign windows_dev_builds = site.data.builds.development.windows10 | sort: 'date' | reverse %}
{% assign windows_arm64_dev_builds = site.data.builds.development.windows10-arm64 | sort: 'date' | reverse %}
{% assign windows10_6_0_builds = site.data.builds.swift-6_0-branch.windows10 | sort: 'date' | reverse %}
{% assign windows10_arm64_6_0_builds = site.data.builds.swift-6_0-branch.windows10-arm64 | sort: 'date' | reverse %}


<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>main</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ windows_dev_builds.first.date | date_to_xmlschema }}" title="{{ windows_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ windows_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Package installers (.exe).
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      <a href="https://download.swift.org/development/windows10/{{ windows_dev_builds.first.dir }}/{{ windows_dev_builds.first.download }}" class="cta-secondary">Download (x86_64)</a>
      <a href="https://download.swift.org/development/windows10-arm64/{{ windows_arm64_dev_builds.first.dir }}/{{ windows_arm64_dev_builds.first.download }}" class="cta-secondary">Download (arm64)</a>
    </ul>
  </li>
  <li class="grid-level-1">
    <h3>release/6.0</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ windows10_6_0_builds.first.date | date_to_xmlschema }}" title="{{ windows10_6_0_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ windows10_6_0_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Package installers (.exe).
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      <a href="https://download.swift.org/swift-6.0-branch/windows10/{{ windows10_6_0_builds.first.dir }}/{{ windows10_6_0_builds.first.download }}" class="cta-secondary">Download (x86_64)</a>
      <a href="https://download.swift.org/swift-6.0-branch/windows10-arm64/{{ windows10_arm64_6_0_builds.first.dir }}/{{ windows10_arm64_6_0_builds.first.download }}" class="cta-secondary">Download (arm64)</a>
    </ul>
  </li>
</ul>
<a href="/install/windows/manual/" class="cta-secondary">Instructions</a>
<details class="download" style="margin-bottom: 0;">
  <summary>Older Snapshots (main)</summary>
  {% include install/_older_snapshots.md builds=windows_dev_builds name="windows" platform_dir="windows10" branch_dir="development" %}
</details>
<details class="download" style="margin-bottom: 0;">
  <summary>Older Snapshots (release/6.0)</summary>
  {% include install/_older_snapshots.md builds=windows10_6_0_builds name="windows" platform_dir="windows10" branch_dir="swift-6.0-branch" %}
</details>

## Older Releases

[Older releases of Swift](/download/#:~:text=Older%20Releases) are available for installation on Windows using the manual installer, [as documented here](/install/windows/old).
