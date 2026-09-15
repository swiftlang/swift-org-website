---
layout: new-layouts/install-linux-version
title: Install Swift
---

{% include /new-includes/assigns/linux-platform-builds.html
    platform="Ubuntu 26.04"
    aarch64="true"
    branch_dir="development"
    development="main"
    docker_tag="nightly-resolute"
    development_builds=site.data.builds.development.ubuntu2604
    aarch64_development_builds=site.data.builds.development.ubuntu2604-aarch64
%}

{% include /new-includes/components/linux-releases.html
  docker_tag=docker_tag
  development_builds=development_builds
  platform=platform
  development=development
  platform_name_url=platform_name_url
  branch_dir=branch_dir
%}
