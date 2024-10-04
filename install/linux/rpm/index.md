---
layout: new-layouts/base
title: Installation via RPM
---

Use the instructions below for RPM installation:

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
