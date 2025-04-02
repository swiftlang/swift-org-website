---
layout: new-layouts/install-linux-version
title: Install Swift
---

{% include /new-includes/assigns/linux-platform-builds.html
platform="Ubuntu 20.04"
aarch64="true"
branch_dir="development"
development="main"
docker_tag="nightly-focal"
development_builds=site.data.builds.development.ubuntu2004
aarch64_development_builds=site.data.builds.development.ubuntu2004-aarch64
development_2="release/6.2"
docker_tag_2="nightly-6.2-focal"
development_builds_2=site.data.builds.swift-6_2-branch.ubuntu2004
aarch64_development_builds_2=site.data.builds.swift-6_2-branch.ubuntu2004-aarch64
branch_dir_2="swift-6.2-branch"
%}

{% include /new-includes/components/linux-releases.html
  docker=site.data.new-data.install.linux.ubuntu.ubuntu-20-04.releases.latest-release.docker
  tarball=site.data.new-data.install.linux.ubuntu.ubuntu-20-04.releases.latest-release.tarball
  static_sdk=site.data.new-data.install.linux.ubuntu.ubuntu-20-04.releases.latest-release.static-linux-sdk
  rpm=site.data.new-data.install.linux.ubuntu.ubuntu-20-04.releases.latest-release.rpm
  dev_main=site.data.new-data.install.linux.ubuntu.ubuntu-20-04.releases.latest-release.main
  dev_release_6_2=site.data.new-data.install.linux.ubuntu.ubuntu-20-04.releases.latest-release.release-6-2
  development_builds=development_builds
  development_builds_2=development_builds_2
  platform=platform
  platform_name_url=platform_name_url
  branch_dir=branch_dir
  branch_dir_2=branch_dir_2
%}