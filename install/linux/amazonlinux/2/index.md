---
layout: page
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md amazonlinux="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.amazonlinux  name="Amazon Linux" pressed="Amazon Linux 2" %}

{% include install/_build_release.md platform="Amazon Linux 2" docker_tag="amazonlinux2" aarch64="true" rpm="true"%}

{% include install/_build_snapshot.md platform="Amazon Linux 2"
aarch64="true"
branch_dir="development"
development="main"
docker_tag="nightly-amazonlinux2"
development_builds=site.data.builds.development.amazonlinux2
aarch64_development_builds=site.data.builds.development.amazonlinux2-aarch64
development_2="release/6.0"
docker_tag_2="nightly-6.0-amazonlinux2"
development_builds_2=site.data.builds.swift-6_0-branch.amazonlinux2 aarch64_development_builds_2=site.data.builds.swift-6_0-branch.amazonlinux2-aarch64
branch_dir_2="swift-6.0-branch"%}
