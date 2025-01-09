---
layout: page
title: 通过 Tarball 在 Linux 上安装
---

## 通过 Tarball 安装

**1. 安装必需的依赖：**

{% include linux/table.html %}

**2. 下载最新的二进制发布版本** ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases))。

`swift-<VERSION>-<PLATFORM>.tar.gz` 文件是工具链本身。
`.sig` 文件是数字签名。

**3. 导入并验证 PGP 签名：**

如果您之前已经导入过密钥，可以跳过此步骤。这不适用于验证。

<details class="download" style="margin-bottom: 0;">
  <summary>导入 PGP 密钥详情</summary>
  <pre class="highlight">
    <code>$ gpg --keyserver hkp://keyserver.ubuntu.com \
          --recv-keys \
          'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561'\
          'E813 C892 820A 6FA1 3755  B268 F167 DF1A CF9C E069'
    </code>
  </pre>

  <p>or:</p>

  <div class="highlight">
    <pre class="highlight">
      <code>$ wget -q -O - https://swift.org/keys/all-keys.asc | \
        gpg --import -
      </code>
    </pre>
  </div>
</details>

<details class="download" style="margin-bottom: 0;">
  <summary>验证 PGP 签名</summary>

  <div class="warning">
    <p>如果 <code class="language-plaintext highlighter-rouge">gpg</code> 验证失败并报告"BAD signature"，
    请勿使用下载的工具链。
    请发送邮件至 <a href="mailto:swift-infrastructure@forums.swift.org">swift-infrastructure@forums.swift.org</a>
    并提供尽可能详细的信息，以便我们调查问题。</p>
  </div>
  <p>Linux 的 <code class="language-plaintext highlighter-rouge">.tar.gz</code> 压缩包使用 Swift 开源项目的密钥之一
  通过 GnuPG 进行签名。强烈建议所有人在使用软件之前验证签名。</p>
  <p>首先，刷新密钥以下载新的密钥撤销证书（如果有）：</p>

  <div class="language-shell highlighter-rouge">
    <div class="highlight">
      <pre class="highlight"><code><span class="nv">$ </span>gpg <span class="nt">--keyserver</span> hkp://keyserver.ubuntu.com <span class="nt">--refresh-keys</span> Swift</code></pre>
    </div>
  </div>
  <p>然后，使用签名文件验证压缩包的完整性：</p>
  <div class="language-shell highlighter-rouge">
    <div class="highlight">
      <pre class="highlight">
        <code><span class="nv">$ </span>gpg <span class="nt">--verify</span> swift-&lt;VERSION&gt;-&lt;PLATFORM&gt;.tar.gz.sig
  ...
  gpg: Good signature from <span class="s2">"Swift Automatic Signing Key #4 &lt;swift-infrastructure@forums.swift.org&gt;"</span>
        </code>
      </pre>
    </div>
  </div>
  <p>如果由于没有公钥而导致 <code class="language-plaintext highlighter-rouge">gpg</code> 验证失败
  （<code class="language-plaintext highlighter-rouge">gpg: Can't check signature: No public key</code>），
  请按照下面<a href="#active-signing-keys">活动签名密钥</a>中的说明将密钥导入到您的密钥环中。</p>

  <p>您可能会看到警告：</p>
  <div class="language-shell highlighter-rouge">
    <div class="highlight">
      <pre class="highlight">
        <code>gpg: WARNING: This key is not certified with a trusted signature!
  gpg: There is no indication that the signature belongs to the owner.
        </code>
      </pre>
    </div>
  </div>
  <p>此警告表示在信任网络中，此密钥与您之间没有路径。只要您按照上述步骤从可信来源获取密钥，
  此警告就是无害的。</p>

  <p><a href="/keys/active">活动签名密钥</a></p>
  <p><a href="/keys/expired">过期签名密钥</a></p>
</details>

**4. 使用以下命令解压压缩包：**

```shell
$ tar xzf swift-<VERSION>-<PLATFORM>.tar.gz
```

这将在压缩包所在位置创建一个 `usr/` 目录。

**5. 按如下方式将 Swift 工具链添加到您的路径中：**

```shell
$ export PATH=/path/to/usr/bin:"${PATH}"
```

现在您可以执行 `swift` 命令来运行 REPL 或构建 Swift 项目。
