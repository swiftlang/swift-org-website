---
layout: new-layouts/install-linux-version
title: Install Swift
---

{% include /new-includes/assigns/linux-platform-builds.html
    platform="ubi 9"
    aarch64="true"
    branch_dir="development"
    development="main"
    docker_tag="nightly-rhel-ubi9"
    development_builds=site.data.builds.development.ubi9
    aarch64_development_builds=site.data.builds.development.ubi9-aarch64
    development_2="release/6.2"
    docker_tag_2="nightly-6.2-rhel-ubi9"
    development_builds_2=site.data.builds.swift-6_2-branch.ubi9
    aarch64_development_builds_2=site.data.builds.swift-6_2-branch.ubi9-aarch64
    branch_dir_2="swift-6.2-branch"
%}

{% include /new-includes/components/linux-releases.html
  docker=site.data.new-data.install.linux.ubi.ubi-9.releases.latest-release.docker
  tarball=site.data.new-data.install.linux.ubi.ubi-9.releases.latest-release.tarball
  static_sdk=site.data.new-data.install.linux.ubi.ubi-9.releases.latest-release.static-linux-sdk
  rpm=site.data.new-data.install.linux.ubi.ubi-9.releases.latest-release.rpm
  dev_main=site.data.new-data.install.linux.ubi.ubi-9.releases.latest-release.main
  dev_release_6_2=site.data.new-data.install.linux.ubi.ubi-9.releases.latest-release.release-6-2
  development_builds=development_builds
  development_builds_2=development_builds_2
  platform=platform
  platform_name_url=platform_name_url
  branch_dir=branch_dir
  branch_dir_2=branch_dir_2
%}
