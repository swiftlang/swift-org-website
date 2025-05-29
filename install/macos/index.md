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
      {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.swiftly%}
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
        {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.package-installer%}
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.static-linux-sdk %}
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
        {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.toolchain.main %}
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.toolchain.release-6-2 %}
      </div>
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
        {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.static-linux-sdk-dev.main%}
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.macos.releases.latest-release.static-linux-sdk-dev.release-6-1%}
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
</div>