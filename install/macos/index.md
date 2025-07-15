---
redirect_from:
  - '/download/'
layout: new-layouts/install
title: Install Swift - macOS
---

{% assign xcode_dev_builds = site.data.builds.development.xcode | sort: 'date' | reverse %}
{% assign xcode_6_2_builds = site.data.builds.swift-6_2-branch.xcode | sort: 'date' | reverse %}

<div class="content">
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html with-tabs = true content = site.data.new-data.install.macos.releases.latest-release.swiftly%}
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.xcode%}
    </div>
  </div>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>Package Installer</h2>
          <p class="body-copy">
            The toolchain package installer (.pkg) that Swiftly automates is available as a stand-alone download.
          </p>
          <div class="link-wrapper">
            <a href="https://download.swift.org/{{ site.data.builds.swift_releases.last.tag | downcase }}/xcode/{{ site.data.builds.swift_releases.last.tag }}/{{ site.data.builds.swift_releases.last.tag }}-osx.pkg" class="body-copy">Download Toolchain</a>
          </div>
          <div class="link-single">
            <a href="/install/macos/package_installer" class="body-copy">Instructions</a>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/static-linux-sdk.html %}
      </div>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Releases</summary>
        {% include_relative _older-releases.md %}
        </details>
    </div>
  </div>
  <h2 id="development-snapshots" class="header-with-anchor">Development Snapshots</h2>
  <div>
    <p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
    <p class="content-copy">The easiest way to install development snapshots is with the Swiftly tool. Read more on the <a href="/install/macos/swiftly">instructions page</a>.</p>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html with-tabs = true content = site.data.new-data.install.linux.dev.latest-dev.swiftly %}
    </div>
  </div>
  <h3>Toolchain</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/install/macos/package_installer">Instructions</a>
    </p>
  </div>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>main</h2>
          <p class="body-copy">
            <small>{{ xcode_dev_builds.first.date | date: '%B %-d, %Y' }}</small><br />
            Toolchain package installer (.pkg)
          </p>
          <div class="link-wrapper">
            <a href="https://download.swift.org/development/xcode/{{ xcode_dev_builds.first.dir }}/{{ xcode_dev_builds.first.debug_info }}" class="body-copy">Debugging Symbols</a>
          </div>
          <div class="link-wrapper">
            <a href="https://download.swift.org/development/xcode/{{ xcode_dev_builds.first.dir }}/{{ xcode_dev_builds.first.download }}" class="body-copy">Download Toolchain</a>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>release/6.2</h2>
          <p class="body-copy">
            <small>{{ xcode_6_2_builds.first.date | date: '%B %-d, %Y' }}</small><br />
            Toolchain package installer (.pkg)
          </p>
          <div class="link-wrapper">
            <a href="https://download.swift.org/swift-6.2-branch/xcode/{{ xcode_6_2_builds.first.dir }}/{{ xcode_6_2_builds.first.debug_info }}" class="body-copy">Debugging Symbols</a>
          </div>
          <div class="link-wrapper">
            <a href="https://download.swift.org/swift-6.2-branch/xcode/{{ xcode_6_2_builds.first.dir }}/{{ xcode_6_2_builds.first.download }}" class="body-copy">Download Toolchain</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Snapshots (main)</summary>
        {% include_relative _older-development-snapshots.md %}
        </details>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Snapshots (release/6.2)</summary>
        {% include_relative _older-6_2-snapshots.md %}
        </details>
    </div>
  </div>
  <h3>Static Linux SDK</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/documentation/articles/static-linux-getting-started.html">Instructions</a>
    </p>
  </div>
  {% include new-includes/components/static-linux-sdk-dev.html %}
   <h3>Swift SDK for WebAssembly</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/documentation/articles/wasm-getting-started.html">Instructions</a>
    </p>
  </div>
  {% include new-includes/components/wasm-sdk-dev.html %}
</div>
