---
layout: page-wide
title: Swift 中文站点
hideTitle: true
atom: true
---

<div class="callout" markdown="1">
<h1 class="preamble">Swift 是一款<strong>通用</strong>编程语言。<br/>新手<strong>易学</strong>，专家<strong>称心</strong><span>Swift <strong>快速</strong>、<strong>现代</strong>、<strong>安全</strong>，<br/>写起代码<strong>乐无边</strong>。</span></h1>

{% for snippet in site.data.featured_snippets %}
```swift
{{ snippet -}}
```
{: class="featured-snippet {% if forloop.first %}visible{% endif %}" }
{% endfor %}
</div>

<div class="banner primary">
  <p>通过<a href="https://www.swift.org/migration/">官方迁移指南</a>为 Swift 6 语言模式做好准备</p>
</div>

<div class="link-grid">
  <ul>
    <li>
      <a href="/install">
        <div class="flex-container">
          <div class="latest-release-container">
          <span>
            {{ site.data.builds.swift_releases.last.name }}
          </span>
          </div>
          最新版本
        </div>
      </a>
    </li>

    <li>
      <a href="/getting-started">
        <img src="/assets/images/landing-page/signs.svg" />
        开始使用
      </a>
    </li>

    <li>
      <a href="/documentation">
        <img src="/assets/images/landing-page/book.svg" />
        阅读文档
      </a>
    </li>

    <li>
      <a href="/packages">
        <img src="/assets/images/landing-page/box.svg" />
        探索软件包
      </a>
    </li>
  </ul>
</div>

## 使用场景

<ul class="grid-level-0 grid-layout-use-cases">
  <li class="grid-level-1">
    <h3>Apple 平台</h3>
    <p>
      Swift 是一门强大而直观的编程语言，在 iOS、macOS 和其他 Apple 平台上运行时性能表现优异。
      <br><br>
      Apple 提供了丰富的框架和 API，使在这些平台上开发的应用程序独特而有趣。
    </p>
    <a href="https://developer.apple.com/swift/resources/" class="cta-secondary">了解更多</a>
  </li>
  <li class="grid-level-1">
    <h3>跨平台命令行</h3>
    <p>
      编写 Swift 代码既互动又有趣，语法简洁而富有表现力。
      Swift 代码设计上保证安全性，并能产生运行速度极快的软件。
      <br><br>
      SwiftArgumentParser 和 Swift 不断发展的软件包生态系统使开发跨平台命令行工具变得轻而易举。
    </p>

    <a href="/getting-started/cli-swiftpm" class="cta-secondary">了解更多</a>
  </li>
  <li class="grid-level-1">
    <h3>服务器与网络</h3>
    <p>
      Swift 占用内存小、启动快速，具有可预测的性能表现，这些特点使其成为服务器和其他网络应用程序的绝佳选择。
      <br><br>
      SwiftNIO 和 Swift 富有活力的服务器生态系统让开发网络应用程序变得充满乐趣。
    </p>

    <a href="/documentation/server" class="cta-secondary">了解更多</a>
  </li>
</ul>

## 参与其中

我们欢迎每个人为 Swift 做出贡献。贡献不仅仅意味着编写代码或提交拉取请求 — 您可以通过多种方式参与其中，包括在论坛上回答问题、报告或分类 bug，以及参与 Swift 演进过程。

无论您想如何参与，我们都建议您首先通过阅读[社区概览](/community/)了解项目参与者的期望。如果您要贡献代码，还应该了解如何从代码库构建和运行 Swift，具体说明请参见[源代码](/documentation/source-code/)。

<ul class="grid-level-0 grid-layout-3-column">
  <li class="grid-level-1">
    <h3>设计</h3>
    <p>
      通过参与 <em>Swift 演进过程</em>帮助塑造 Swift 的未来。
    </p>
    <a href="/contributing/#swift-evolution" class="cta-secondary">了解更多</a>
  </li>
  <li class="grid-level-1">
    <h3>编码</h3>
    <p>
      为 Swift 编译器、标准库和其他核心组件做出贡献。
    </p>
    <a href="/contributing/#contributing-code" class="cta-secondary">了解更多</a>
  </li>
  <li class="grid-level-1">
    <h3>故障排查</h3>
    <p>
      通过报告和分类 bug 来帮助提高 Swift 的质量。
    </p>
    <a href="/contributing/#triaging-bugs" class="cta-secondary">了解更多</a>
  </li>
</ul>

## 最新动态

及时了解 Swift 社区的最新动态。

<div class="links links-list-nostyle" markdown="1">
  - [访问 Swift.org 博客](/blog/)
  - [访问 SwiftGG 中文论坛](https://forums.swift.org.gg)
  - [访问 Swift 论坛（英文）](https://forums.swift.org)
  - [在 Github 上关注 SwiftGG](https://github.com/swiftggteam){:target="_blank" class="link-external"}
  - [在 X 上关注 Swift（以前的推特）](https://x.com/swiftlang){:target="_blank" class="link-external"}
</div>

<script>
  var featuredSnippets = document.querySelectorAll('.featured-snippet');
  var visibleSnippet = document.querySelector('.featured-snippet.visible');
  var randomIndex = Math.floor(Math.random() * featuredSnippets.length);

  visibleSnippet?.classList.remove('visible');
  featuredSnippets[randomIndex]?.classList.add('visible');
</script>
