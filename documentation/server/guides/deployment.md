---
redirect_from: "server/guides/deployment"
layout: page
title: 部署到服务器或公共云
---

以下指南可以帮助您部署到公共云提供商：
* [使用无服务器应用程序模型 (SAM) 部署到 AWS Lambda](/documentation/server/guides/deploying/aws-sam-lambda.html)
* [使用 Vapor 和 MongoDB Atlas 部署到 AWS Fargate](/documentation/server/guides/deploying/aws-copilot-fargate-vapor-mongo.html)
* [AWS EC2](/documentation/server/guides/deploying/aws.html)
* [DigitalOcean](/documentation/server/guides/deploying/digital-ocean.html)
* [Heroku](/documentation/server/guides/deploying/heroku.html)
* [Kubernetes 和 Docker](/documentation/server/guides/packaging.html#docker)
* [GCP](/documentation/server/guides/deploying/gcp.html)
* _有其他流行公共云的指南吗？请在这里添加！_

如果您正在部署到自己的服务器（例如裸机、虚拟机或 Docker），有几种策略可以将 Swift 应用程序打包以进行部署，请参阅 [打包指南](/server/guides/packaging.html) 以获取更多信息。

## 部署可调试配置（Linux 上的生产环境）

- 如果您有 `--privileged`/`--security-opt seccomp=unconfined` 容器，或者在虚拟机甚至裸机上运行，您可以使用以下命令运行您的二进制文件

        lldb --batch -o "break set -n main --auto-continue 1 -C \"process handle SIGPIPE -s 0\"" -o run -k "image list" -k "register read" -k "bt all" -k "exit 134" ./my-program

    而不是 `./my-program` 以在崩溃时获得类似于“崩溃报告”的内容。

- 如果您没有 `--privileged`（或 `--security-opt seccomp=unconfined`）容器（意味着您将无法使用 `lldb`）或者您不想使用 lldb，请考虑使用类似 [`swift-backtrace`](https://github.com/swift-server/swift-backtrace) 的库在崩溃时获取堆栈跟踪。
