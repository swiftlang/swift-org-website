## Latest Release
<ul class="grid-level-0 grid-layout-1-column">
<li class="grid-level-1 featured">
    <h3>Swiftly (recommended)</h3>
  <p class="description">
    The Swiftly installer manages Swift and its dependencies. It supports switching between different versions and downloading updates.
  </p>
  <h4>Run this in a terminal:</h4>
  <div class="language-plaintext highlighter-rouge"><div class="highlight"><button>Copy</button><pre class="highlight"><code>curl -O https://download.swift.org/swiftly/linux/swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz &amp;&amp; \
tar zxf swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz &amp;&amp; \
SWIFTLY_HOME_DIR=~/.swiftly SWIFTLY_BIN_DIR=~/.swiftly/bin ./swiftly init --quiet-shell-followup &amp;&amp; \
. ~/.swiftly/env.sh &amp;&amp; \
hash -r
</code></pre></div></div>
  <h4>License: <a href="https://raw.githubusercontent.com/swiftlang/swiftly/refs/heads/main/LICENSE.txt">Apache-2.0</a> | PGP: <a href="https://download.swift.org/swiftly/linux/swiftly-0.4.0-dev-x86_64.tar.gz.sig">Signature</a></h4>
  <a href="/install/linux/swiftly" class="cta-secondary">Instructions</a>
</li>
</ul>
<ul class="grid-level-0 grid-layout-1-column">
<li class="grid-level-1">
    <h3>Container</h3>
    <p class="description">
      If you prefer a containerized environment, you can download the official container images for compiling and running Swift on a variety of distributions.
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">Docker Hub</a>
    <a href="/install/linux/docker" class="cta-secondary">Instructions</a>
  </li>
</ul>

## Alternate installation options

<p id="platforms">Select Linux platform:</p>

<div class="interactive-tabs os">
  <div class="tabs">
    <a href="/install/linux/amazonlinux/2#versions" aria-pressed="{{ include.amazonlinux }}">Amazon Linux</a>
    <a href="/install/linux/debian/12#versions" aria-pressed="{{ include.debian }}">Debian</a>
    <a href="/install/linux/fedora/39#versions" aria-pressed="{{ include.fedora }}">Fedora</a>
    <a href="/install/linux/ubi/9#versions" aria-pressed="{{ include.ubi }}">Red Hat</a>
    <a href="/install/linux/ubuntu#versions" aria-pressed="{{ include.ubuntu }}">Ubuntu</a>
  </div>
</div>

<hr>
