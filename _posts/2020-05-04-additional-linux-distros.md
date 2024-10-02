---
layout: new-layouts/blog
published: true
date: 2020-05-05 10:00:00
title: Additional Linux Distributions
author: tomerd

---

It is my pleasure to announce a new set of Linux distributions officially supported by the Swift project. [Swift.org](/download/) now offers downloadable toolchain and Docker images for the following new Linux distributions:

* Ubuntu 20.04
* CentOS 8
* Amazon Linux 2

The above are added to the Linux platforms we already supported:

* Ubuntu 16.04
* Ubuntu 18.04


## Porting work for Supporting Fedora-based Distributions

The work to support Fedora based distributions such as CentOS and Amazon Linux included subtle changes in various components of the Swift project:

* Changing minimum required version of `libcurl` so that FoundationNetworking (in swift-corelibs-foundation) can be built on unmodified older Fedora based systems
* Teaching SwiftPM about Fedora based systems
* Refining how the Swift platform support was built and documented which led to dropping the dependency on `libatomic` on Linux.

In all, the work included 9 PRs to the Swift project:

* <https://github.com/apple/swift/pull/29581>
* <https://github.com/apple/swift/pull/30155>
* <https://github.com/swiftlang/swift-corelibs-foundation/pull/2716>
* <https://github.com/swiftlang/swift-corelibs-foundation/pull/2737>
* <https://github.com/swiftlang/swift-package-manager/pull/2642>
* <https://github.com/swiftlang/swift-package-manager/pull/2647>
* <https://github.com/swiftlang/swift-tools-support-core/pull/59>
* <https://github.com/swiftlang/swift-tools-support-core/pull/60>
* <https://github.com/swiftlang/swift-llbuild/pull/644>


## How Downloadable Images are Built

Swift CI has moved to use Docker to build and qualify the new Linux distributions. A Dockerfile has been created for each one of the supported distributions, and CI jobs have been created to build, test and create a signed toolchain.

Linux build Dockerfiles are managed in  [Swift's Docker repository](https://github.com/swiftlang/swift-docker) with the goal of evolving them in the open with the community. Our plan is to continue and grow the number of Linux distributions we support, with CentOS 7, Debian and Fedora the most likely candidates to be added next.

It is important to note that the new distributions do not run automatically as part of PR testing - we continue to automatically test PRs on Ubuntu 16.04 - but you can “summon” them using the following commands:

* @swift-ci Please test Ubuntu 20.04
* @swift-ci Please test CentOS 8
* @swift-ci Please test Amazon Linux 2


## Getting Involved

If you are interested in building Swift on Linux, come and get involved!

The [source is available](https://github.com/swiftlang/swift-docker), and we encourage contributions from the open source community. If you have feedback, questions or would like to discuss the project, please feel free to chat on the [Swift forums](https://forums.swift.org/c/server). If you would like to report bugs, please use [the GitHub issue tracker](https://github.com/swiftlang/swift-docker/issues). We look forward to working with you, and helping move the industry forward to a better, safer programming future.
