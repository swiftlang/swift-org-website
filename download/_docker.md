## Docker

Swift offical Docker images are hosted on [hub.docker.com/\_/swift](https://hub.docker.com/_/swift/).

Swift Dockerfiles are located on [swift-docker](https://github.com/apple/swift-docker) repository.

#### Supported Platforms

* Ubuntu 18.04
* Ubuntu 20.04
* CentOS 7
* Amazon Linux 2

### Using Docker Images

0. Pull the Docker image from [Docker hub](https://hub.docker.com/_/swift/):

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