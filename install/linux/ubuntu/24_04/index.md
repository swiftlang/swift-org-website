---
layout: new-layouts/base
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md ubuntu="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.ubuntu  name="Ubuntu" pressed="Ubuntu 24.04" %}

{% include install/_build_release.md platform="Ubuntu 24.04" docker_tag="noble" %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include install/_older-releases.md platform="Ubuntu 24.04" %}
</details>

{% include install/_build_snapshot.md platform="Ubuntu 24.04"
aarch64="true"
branch_dir="development"
development="main"
docker_tag="nightly-noble"
development_builds=site.data.builds.development.ubuntu2404
aarch64_development_builds=site.data.builds.development.ubuntu2404-aarch64
development_2="release/6.1"
docker_tag_2="nightly-6.1-noble"
development_builds_2=site.data.builds.swift-6_1-branch.ubuntu2404 aarch64_development_builds_2=site.data.builds.swift-6_1-branch.ubuntu2404-aarch64
branch_dir_2="swift-6.1-branch"%}
