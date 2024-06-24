---
layout: page
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md centos="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.centos  name="CentOS" pressed="CentOS 7" %}

{% include install/_build_release.md platform="CentOS 7" docker_tag="centos7" rpm="true" %}

{% include install/_build_snapshot.md platform="CentOS 7"
branch_dir="development"
development="main"
docker_tag="nightly-centos7"
development_builds=site.data.builds.development.centos7
development_2="release/6.0"
docker_tag_2="nightly-6.0-centos7"
development_builds_2=site.data.builds.swift-6_0-branch.centos7
branch_dir_2="swift-6.0-branch"%}
