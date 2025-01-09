## 通过 Docker 安装

Swift 官方 Docker 镜像托管在 [hub.docker.com/_/swift](https://hub.docker.com/_/swift/)。

Swift 的 Dockerfile 文件位于 [swift-docker](https://github.com/swiftlang/swift-docker) 代码仓库。

#### 使用 Docker 镜像

0. 从 [Docker Hub](https://hub.docker.com/_/swift/) 拉取 Docker 镜像：

   ~~~ shell
   docker pull swift
   ~~~

0. 使用 `latest` 标签创建容器并连接到该容器：

   ~~~ shell
   docker run --privileged --interactive --tty \
   --name swift-latest swift:latest /bin/bash
   ~~~

0. 启动 `swift-latest` 容器：

   ~~~ shell
   docker start swift-latest
   ~~~

0. 连接到 `swift-latest` 容器：

   ~~~ shell
   docker attach swift-latest
   ~~~
