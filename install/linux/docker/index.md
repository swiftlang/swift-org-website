---
layout: new-layouts/base
title: Linux Installation via Docker
---

Swift official Docker images are hosted on [hub.docker.com/\_/swift](https://hub.docker.com/_/swift/). Nightly builds and previews of Swift using Docker images under the [swiftlang](https://hub.docker.com/r/swiftlang/swift/tags) namespace are available in the Swift Docker repository on Docker Hub.

Swift Dockerfiles are located on [swift-docker](https://github.com/swiftlang/swift-docker) repository.

#### Using Docker Images

0. Pull the Docker image from [Docker Hub](https://hub.docker.com/_/swift/):

   ~~~ shell
   docker pull swift
   ~~~

0. Create a container using tag `latest` and attach it to the container:

   ~~~ shell
   docker run --privileged --interactive --tty \
   --name swift-latest swift:latest /bin/bash
   ~~~

0. Start container `swift-latest`:

   ~~~ shell
   docker start swift-latest
   ~~~

0. Attach to `swift-latest` container:

   ~~~ shell
   docker attach swift-latest
   ~~~
