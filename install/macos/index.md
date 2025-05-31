---
redirect_from:
  - '/download/'
layout: new-layouts/install
title: Install Swift - macOS
---

{% assign xcode_dev_builds = site.data.builds.development.xcode | sort: 'date' | reverse %}
{% assign xcode_6_2_builds = site.data.builds.swift-6_2-branch.xcode | sort: 'date' | reverse %}
{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Static SDK'| first %}
{% assign static_sdk_dev_builds = site.data.builds.development.static_sdk | sort: 'date' | reverse %}
{% assign static_sdk_6_1_builds = site.data.builds.swift-6_1-branch.static_sdk | sort: 'date' | reverse %}

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
        <div class="code-box content-wrapper">
          <h2>Static Linux SDK</h2>
          <p class="body-copy">
            Static Linux SDK - Cross compile to Linux.
            <br /><br />
            {% assign base_url = "https://download.swift.org/" | append: tag_downcase | append: "/static-sdk/" | append: tag | append: "/" | append: tag %}
            {% assign command = "swift sdk install " | append: base_url | append: "_static-linux-0.0.1.artifactbundle.tar.gz --checksum " | append: platform.checksum %}
            <button onclick="copyToClipboard(this, '{{ command | escape }}')">
              Copy install command
            </button>
          </p>
          <div class="link-wrapper">
            <div class="link-group">
              <a href="https://download.swift.org/{{ tag_downcase }}/static-sdk/{{ tag }}/{{ tag }}_static-linux-0.0.1.artifactbundle.tar.gz" class="body-copy">Download Linux Static SDK</a> |
              <a href="https://download.swift.org/{{ tag_downcase }}/static-sdk/{{ tag }}/{{ tag }}_static-linux-0.0.1.artifactbundle.tar.gz.sig" class="body-copy">Signature (PGP)</a>
            </div>
          </div>
          <div class="link-wrapper">
            <a href="/documentation/articles/static-linux-getting-started.html" class="body-copy">Instructions</a>
          </div>
        </div>
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
  <h2>Development Snapshots</h2>
  <div>
    <p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
    <p class="content-copy">The easiest way to install development snapshots is with the Swiftly tool. Read more on the <a href="/install/macos/swiftly">instructions page</a>.</p>
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
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>main</h2>
          <p class="body-copy">
            <small>{{ static_sdk_dev_builds.first.date | date: '%B %-d, %Y' }}</small><br />
            Static Linux SDK - Cross compile to Linux.
            <br /><br />
            {% assign base_url = "https://download.swift.org/development/static-sdk/" | append: static_sdk_dev_builds.first.dir | append: "/" | append: static_sdk_dev_builds.first.download %}
            {% assign command = "swift sdk install " | append: base_url | append: " --checksum " | append: static_sdk_dev_builds.first.checksum %}
            <button onclick="copyToClipboard(this, '{{ command | escape }}')">
              Copy install command
            </button>
          </p>
          <div class="link-wrapper">
            <div class="link-group">
              <a href="https://download.swift.org/development/static-sdk/{{ static_sdk_dev_builds.first.dir }}/{{ static_sdk_dev_builds.first.download }}" class="body-copy">Download Linux Static SDK</a> |
              <a href="https://download.swift.org/development/static-sdk/{{ static_sdk_dev_builds.first.dir }}/{{ static_sdk_dev_builds.first.download_signature }}" class="body-copy">Signature (PGP)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>release/6.1</h2>
          <p class="body-copy">
            <small>{{ static_sdk_6_1_builds.first.date | date: '%B %-d, %Y' }}</small><br />
            Static Linux SDK - Cross compile to Linux.
            <br /><br />
            {% assign base_url = "https://download.swift.org/development/static-sdk/" | append: static_sdk_6_1_builds.first.dir | append: "/" | append: static_sdk_6_1_builds.first.download %}
            {% assign command = "swift sdk install " | append: base_url | append: " --checksum " | append: static_sdk_6_1_builds.first.checksum %}
            <button onclick="copyToClipboard(this, '{{ command | escape }}')">
              Copy install command
            </button>
          </p>
          <div class="link-wrapper">
            <div class="link-group">
              <a href="https://download.swift.org/swift-6.1-branch/static-sdk/{{ static_sdk_6_1_builds.first.dir }}/{{ static_sdk_6_1_builds.first.download }}" class="body-copy">Download Linux Static SDK</a> |
              <a href="https://download.swift.org/swift-6.1-branch/static-sdk/{{ static_sdk_6_1_builds.first.dir }}/{{ static_sdk_6_1_builds.first.download_signature }}" class="body-copy">Signature (PGP)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
