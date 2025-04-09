## 最新版本
<ul class="grid-level-0 grid-layout-1-column">
<li class="grid-level-1 featured">
    <h3>Swiftly（推荐）</h3>
  <p class="description">
    Swiftly 安装程序可以管理 Swift 及其依赖项。它支持在不同版本之间切换和下载更新。
  </p>
  <h4>在终端中运行以下命令：</h4>
  <div class="language-plaintext highlighter-rouge"><div class="highlight"><button>复制</button><pre class="highlight"><code>curl -O https://download.swift.org/swiftly/linux/swiftly-$(uname -m).tar.gz &amp;&amp; \
tar zxf swiftly-$(uname -m).tar.gz &amp;&amp; \
./swiftly init --quiet-shell-followup &amp;&amp; \
. ~/.local/share/swiftly/env.sh &amp;&amp; \
hash -r
</code></pre></div></div>
  <h4>许可证：<a href="https://raw.githubusercontent.com/swiftlang/swiftly/refs/heads/main/LICENSE.txt">Apache-2.0</a> | PGP：<a href="https://download.swift.org/swiftly/linux/swiftly-0.4.0-dev-x86_64.tar.gz.sig">签名</a></h4>
  <a href="/install/linux/swiftly" class="cta-secondary">安装说明</a>
</li>
</ul>
<ul class="grid-level-0 grid-layout-1-column">
<li class="grid-level-1">
    <h3>容器</h3>
    <p class="description">
      如果您更喜欢容器化环境，可以下载官方容器镜像，用于在各种发行版上编译和运行 Swift。
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">Docker Hub</a>
    <a href="/install/linux/docker" class="cta-secondary">安装说明</a>
  </li>
</ul>

## 其他安装选项

<p id="platforms">选择 Linux 平台：</p>

<div class="interactive-tabs os">
  <div class="tabs">
    <a href="/install/linux/amazonlinux/2#versions" aria-pressed="{{ include.amazonlinux }}">亚马逊Linux</a>
    <a href="/install/linux/debian/12#versions" aria-pressed="{{ include.debian }}">Debian</a>
    <a href="/install/linux/fedora/39#versions" aria-pressed="{{ include.fedora }}">Fedora</a>
    <a href="/install/linux/ubi/9#versions" aria-pressed="{{ include.ubi }}">红帽企业版</a>
    <a href="/install/linux/ubuntu#versions" aria-pressed="{{ include.ubuntu }}">Ubuntu</a>
  </div>
</div>

<hr>
