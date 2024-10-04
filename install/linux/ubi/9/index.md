---
layout: new-layouts/base
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md ubi="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.ubi  name="Red Hat Universal Base Image" pressed="Red Hat Universal Base Image 9" %}

{% include install/_build_release.md platform="UBI 9" docker_tag="rhel-ubi9" %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include install/_older-releases.md platform="Red Hat Universal Base Image 9" %}
</details>

{% include install/_build_snapshot.md platform="ubi 9"
aarch64="true"
branch_dir="development"
development="main"
docker_tag="nightly-rhel-ubi9"
development_builds=site.data.builds.development.ubi9
aarch64_development_builds=site.data.builds.development.ubi9-aarch64
development_2="release/6.1"
docker_tag_2="nightly-6.1-rhel-ubi9"
development_builds_2=site.data.builds.swift-6_1-branch.ubi9 aarch64_development_builds_2=site.data.builds.swift-6_1-branch.ubi9-aarch64
branch_dir_2="swift-6.1-branch"%}
