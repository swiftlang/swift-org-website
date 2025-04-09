# Swift.org 官方网站

> 本项目由 [SwiftGG 翻译组](https://swiftgg.team)负责翻译维护。


## 概述

Swift.org 网站的目标包括：

1. 欢迎对 Swift 编程语言感兴趣的人。
2. 与 Swift 用户社区和潜在用户分享知识，包括尽可能简单的 Swift 入门指南、用户指南、最佳实践、API 文档和功能公告。
3. 与 Swift 贡献者社区和潜在贡献者分享知识，包括贡献指南、辅助贡献的技术细节、项目治理和法律信息。
4. 突出展示社区驱动的计划和技术工作，这些工作适用于 Swift 在其所有或部分核心使用领域的用户。

有关 Swift.org 网站目标、内容治理和贡献指南的更多信息，请参阅[网站概述](/website)。

## 技术细节

Swift.org 使用 [Jekyll](https://jekyllrb.com)，这是一个用 Ruby 编写的支持博客的静态站点生成器。

### 本地运行

要求：
- Git
- Ruby 3.3 或更高版本
  _(推荐使用 Ruby 安装管理器，如
  [rbenv](https://github.com/sstephenson/rbenv) 或
  [RVM](https://rvm.io)，但不是必需的)_
- [Bundler](https://bundler.io/)

要在本地运行网站，请在终端窗口中输入以下命令：

```shell
git clone https://github.com/swiftlang/swift-org-website.git
cd swift-org-website
bundle install
LC_ALL=en_us.UTF-8 bundle exec jekyll serve
open "http://localhost:4000"
```

### 在 Docker 中运行

首先使用 Docker Compose 构建站点：

```bash
docker compose run build
```

然后你可以运行站点：

```bash
docker compose up website
```

网站将在 `http://localhost:4000` 上可用
