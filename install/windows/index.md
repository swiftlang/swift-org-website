---
redirect_from:
  - '/download/'
layout: new-layouts/install
title: Install Swift - Windows
---

{% assign windows_dev_builds = site.data.builds.development.windows10 | sort: 'date' | reverse %}
{% assign windows_arm64_dev_builds = site.data.builds.development.windows10-arm64 | sort: 'date' | reverse %}
{% assign windows10_6_2_builds = site.data.builds.swift-6_2-branch.windows10 | sort: 'date' | reverse %}
{% assign windows10_arm64_6_2_builds = site.data.builds.swift-6_2-branch.windows10-arm64 | sort: 'date' | reverse %}
{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Windows 10' | first %}

<div class="content">
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.winget %}
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.vscode%}
    </div>
  </div>
  <h2 id="alternative-install-options" class="header-with-anchor">Alternative install options</h2>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>Manual Installation</h2>
          <p class="body-copy">
            Download the Swift installer (.exe)
          </p>
          <div class="link-wrapper">
            {% for arch in platform.archs %}
              <div class="link-single">
                <a href="https://download.swift.org/{{ tag | downcase }}/windows10{% if arch != "x86_64" %}-{{ arch }}{% endif %}/{{ tag }}/{{ tag }}-windows10{% if arch != "x86_64" %}-{{ arch }}{% endif %}.exe" class="body-copy">Download ({{ arch }})</a>
              </div>
            {% endfor %}
            <div class="link-single">
              <a href="/install/windows/manual" class="body-copy">Instructions</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>Container</h2>
          <p class="body-copy">
            Official container images are available for compiling and running Swift on a variety of distributions.
          </p>
          <div class="link-wrapper">
            <div class="link-single">
              <a href="https://hub.docker.com/_/swift" class="body-copy">{{ site.data.builds.swift_releases.last.name }}-windowsservercore-ltsc2022</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h2 id="previous-releases" class="header-with-anchor">Previous Releases</h2>
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
  <h2 id="development-snapshots" class="header-with-anchor">Development Snapshots</h2>
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
        <div class="code-box content-wrapper">
          <h2>main</h2>
          <p class="body-copy">
            <small>{{ windows_dev_builds.first.date | date: '%B %-d, %Y' }}</small><br />
            Package installers (.exe)
          </p>
          <div class="link-wrapper">
            <div class="link-single">
              <a href="https://download.swift.org/development/windows10/{{ windows_dev_builds.first.dir }}/{{ windows_dev_builds.first.download }}" class="body-copy">Download (x86_64)</a>
            </div>
            <div class="link-single">
              <a href="https://download.swift.org/development/windows10-arm64/{{ windows_arm64_dev_builds.first.dir }}/{{ windows_arm64_dev_builds.first.download }}" class="body-copy">Download (arm64)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>release/6.2</h2>
          <p class="body-copy">
            <small>{{ windows10_6_2_builds.first.date | date: '%B %-d, %Y' }}</small><br />
            Package installers (.exe)
          </p>
          <div class="link-wrapper">
            <div class="link-single">
              <a href="https://download.swift.org/swift-6.2-branch/windows10/{{ windows10_6_2_builds.first.dir }}/{{ windows10_6_2_builds.first.download }}" class="body-copy">Download (x86_64)</a>
            </div>
            <div class="link-single">
              <a href="https://download.swift.org/swift-6.2-branch/windows10-arm64/{{ windows10_arm64_6_2_builds.first.dir }}/{{ windows10_arm64_6_2_builds.first.download }}" class="body-copy">Download (arm64)</a>
            </div>
          </div>
        </div>
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
        <summary>Previous Snapshots (release/6.2)</summary>
        {% include install/_older_snapshots.md builds=windows10_6_2_builds name="windows" platform_dir="windows10" branch_dir="swift-6.2-branch" %}
        </details>
    </div>
  </div>
</div>
