---
layout: new-layouts/base
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md debian="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.debian  name="Debian" pressed="Debian 12" %}

{% include install/_build_release.md platform="Debian 12" docker_tag="debian12" %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include install/_older-releases.md platform="Debian 12" %}
</details>

{% include install/_build_snapshot.md platform="Debian 12"
aarch64="true"
branch_dir="development"
development="main"
docker_tag="nightly-debian-12"
development_builds=site.data.builds.development.debian12
aarch64_development_builds=site.data.builds.development.debian12-aarch64
development_2="release/6.1"
docker_tag_2="nightly-6.1-debian12"
development_builds_2=site.data.builds.swift-6_1-branch.debian12 aarch64_development_builds_2=site.data.builds.swift-6_1-branch.debian12-aarch64
branch_dir_2="swift-6.1-branch"%}
