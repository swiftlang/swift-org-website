---
layout: new-layouts/install-linux-version
title: Install Swift
---

{% include /new-includes/assigns/linux-platform-builds.html
    platform="Fedora 39"
    aarch64="true"
    branch_dir="development"
    development="main"
    docker_tag="nightly-fedora-39"
    development_builds=site.data.builds.development.fedora39
    aarch64_development_builds=site.data.builds.development.fedora39-aarch64
    development_2="release/6.2"
    docker_tag_2="nightly-6.2-fedora39"
    development_builds_2=site.data.builds.swift-6_2-branch.fedora39
    aarch64_development_builds_2=site.data.builds.swift-6_2-branch.fedora39-aarch64
    branch_dir_2="swift-6.2-branch"
%}

{% include /new-includes/components/linux-releases.html
  docker=site.data.new-data.install.linux.fedora.fedora-39.releases.latest-release.docker
  tarball=site.data.new-data.install.linux.fedora.fedora-39.releases.latest-release.tarball
  static_sdk=site.data.new-data.install.linux.fedora.fedora-39.releases.latest-release.static-linux-sdk
  rpm=site.data.new-data.install.linux.fedora.fedora-39.releases.latest-release.rpm
  dev_main=site.data.new-data.install.linux.fedora.fedora-39.releases.latest-release.main
  dev_release_6_2=site.data.new-data.install.linux.fedora.fedora-39.releases.latest-release.release-6-2
  development_builds=development_builds
  development_builds_2=development_builds_2
  platform=platform
  platform_name_url=platform_name_url
  branch_dir=branch_dir
  branch_dir_2=branch_dir_2
%}
