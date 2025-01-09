---
layout: page
title: 通过 RPM 安装
---

请按照以下说明进行 RPM 安装：

**Amazon Linux 2**

```bash
$ curl https://download.swift.org/experimental-use-only/repo/amazonlinux/releases/2/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo
$ amazon-linux-extras install epel
$ yum install swiftlang
```

**CentOS 7**

```bash
$ curl https://download.swift.org/experimental-use-only/repo/centos/releases/7/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo
$ yum install epel-release
$ yum install swiftlang
```
