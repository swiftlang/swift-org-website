## Latest Release
<ul class="grid-level-0 grid-layout-1-column">
<li class="grid-level-1 featured">
    <h3>Swiftly (recommended)</h3>
  <p class="description">
    The Swiftly installer manages Swift and its dependencies. It supports switching between different versions and downloading updates.
  </p>
  <div class="shellcode-intro">Run this in a terminal:<button id="shell" class="toggle">fish</button></div>
  <div class="language-plaintext highlighter-rouge"><div class="highlight"><button>Copy</button><pre class="highlight"><code id="shellcode" style="white-space: initial;"></code></pre></div></div>
  <h4>License: <a href="https://raw.githubusercontent.com/swiftlang/swiftly/refs/heads/main/LICENSE.txt">Apache-2.0</a> | PGP: <a href="https://download.swift.org/swiftly/linux/swiftly-0.4.0-dev-x86_64.tar.gz.sig">Signature</a></h4>
  <a href="/install/linux/swiftly" class="cta-secondary">Instructions</a>
</li>
</ul>

<script>
var shell = "";
var shellToggle = document.getElementById("shell");
var code = document.getElementById("shellcode");

function setShell() {
  code.innerText = "curl -O https://download.swift.org/swiftly/linux/swiftly-$(uname -m).tar.gz && \\\n"
  code.innerText += "tar zxf swiftly-$(uname -m).tar.gz && \\\n"
  code.innerText += "./swiftly init --quiet-shell-followup && \\\n"

  if (shell == "sh") {
    shell = "fish";
    code.innerText = code.innerText.replace("$(", "(") // Subshells are invoked differently in fish
    code.innerText = code.innerText.replace("$(", "(")
    code.innerText += "set -q SWIFTLY_HOME_DIR && . \"$SWIFTLY_HOME_DIR/env.fish\" || . ~/.local/share/swiftly/env.fish"
    shellToggle.innerText = "sh";
  } else {
    shell = "sh";
    code.innerText += ". \"${SWIFTLY_HOME_DIR:-~/.local/share/swiftly}/env.sh\" && \\\n"
    code.innerText += "hash -r"
    shellToggle.innerText = "fish";
  }
}

setShell();

shellToggle.addEventListener("mousedown", function() {
  setShell();
});
</script>

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
