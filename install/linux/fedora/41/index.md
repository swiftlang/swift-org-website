---
layout: new-layouts/install-linux-version
title: Install Swift
---

{% include /new-includes/assigns/linux-platform-builds.html
    platform="Fedora 41"
    aarch64="true"
    branch_dir="development"
    development="main"
    docker_tag="nightly-fedora-41"
    development_builds=site.data.builds.development.fedora41
    aarch64_development_builds=site.data.builds.development.fedora41-aarch64
    development_2="release/6.4.x"
    docker_tag_2="nightly-6.4.x-fedora41"
    development_builds_2=site.data.builds.swift-6_4_x-branch.fedora41
    aarch64_development_builds_2=site.data.builds.swift-6_4_x-branch.fedora41-aarch64
    branch_dir_2="swift-6.4.x-branch"
%}

{% include /new-includes/components/linux-releases.html
  docker_tag=docker_tag
  development_builds=development_builds
  platform=platform
  development=development
  platform_name_url=platform_name_url
  branch_dir=branch_dir
%}
