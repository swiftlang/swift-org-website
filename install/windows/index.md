---
redirect_from:
  - '/download/'
layout: new-layouts/install
title: Install Swift - Windows
---

{% assign windows_dev_builds = site.data.builds.development.windows10 | sort: 'date' | reverse %}
{% assign windows_arm64_dev_builds = site.data.builds.development.windows10-arm64 | sort: 'date' | reverse %}
{% assign windows10_6_1_builds = site.data.builds.swift-6_1-branch.windows10 | sort: 'date' | reverse %}
{% assign windows10_arm64_6_1_builds = site.data.builds.swift-6_1-branch.windows10-arm64 | sort: 'date' | reverse %}

<div class="content">
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.winget %}
    </div>
  </div>
  <h2>Alternative install options</h2>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.manual %}
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.docker %}
      </div>
    </div>
  </div>
  <h2>Previous Releases</h2>
  <div>
    <p class="content-copy">Previous releases of Swift are available for installation on Windows using the manual installer, <a href="/install/windows/archived">as documented here</a>.</p>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Releases</summary>
        {% include install/_older-releases.md platform="Windows 10" %}
        </details>
    </div>
  </div>
  <h2>Development Snapshots</h2>
  <div>
    <p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
  </div>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/install/windows/manual/">Instructions</a>
    </p>
  </div>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.main %}
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.release-6-1 %}
      </div>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download">
        <summary>Previous Snapshots (main)</summary>
        {% include install/_older_snapshots.md builds=windows_dev_builds name="windows" platform_dir="windows10" branch_dir="development" %}
        </details>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download">
        <summary>Previous Snapshots (release/6.1)</summary>
        {% include install/_older_snapshots.md builds=windows10_6_1_builds name="windows" platform_dir="windows10" branch_dir="swift-6.1-branch" %}
        </details>
    </div>
  </div>
</div>
