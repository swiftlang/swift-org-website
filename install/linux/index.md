---
redirect_from:
  - '/download/'
layout: new-layouts/install
title: Install Swift - Linux
---

<div class="content">
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html with-tabs = true content = site.data.new-data.install.linux.releases.latest-release.swiftly %}
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html content = site.data.new-data.install.linux.releases.latest-release.container %}
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/static-linux-sdk.html %}
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html content = site.data.new-data.install.windows.releases.latest-release.vscode%}
    </div>
  </div>
  <h2 id="development-snapshots" class="header-with-anchor">Development Snapshots</h2>
  <div>
    <p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
  </div>
  <div class="release-box section">
    <div class="content">
      {% include new-includes/components/code-box.html with-tabs = true content = site.data.new-data.install.linux.dev.latest-dev.swiftly %}
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
  <div class="callout">
    <div>
      <p class="content-copy">
        <a class="content-link block" href="/install/linux/amazonlinux/2">Alternate Install Options</a>
      </p>
    </div>
  </div>
</div>
