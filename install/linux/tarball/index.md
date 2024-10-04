---
layout: new-layouts/base
title: Linux Installation via Tarball
---

## Installation via Tarball

**1. Install required dependencies:**

{% include linux/table.html %}

**2. Download the latest binary release** ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases)).

The `swift-<VERSION>-<PLATFORM>.tar.gz` file is the toolchain itself.
The `.sig` file is the digital signature.

**3. Import and verify the PGP signature:**

Skip this step if you have imported the keys in the past. This does not apply to verify.

<details class="download" style="margin-bottom: 0;">
  <summary>Import PGP keys details</summary>
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
  <summary>Verify the PGP signature</summary>

  <div class="warning">
    <p>If <code class="language-plaintext highlighter-rouge">gpg</code> fails to verify and reports “BAD signature”,
    do not use the downloaded toolchain.
    Instead, please email <a href="mailto:swift-infrastructure@forums.swift.org">swift-infrastructure@forums.swift.org</a>
    with as much detail as possible,
    so that we can investigate the problem.</p>
  </div>
  <p>The <code class="language-plaintext highlighter-rouge">.tar.gz</code> archives for Linux are signed using GnuPG
  with one of the keys of the Swift open source project.
  Everyone is strongly encouraged to verify the signatures
  before using the software.</p>
  <p>First, refresh the keys to download new key revocation certificates,
  if any are available:</p>

  <div class="language-shell highlighter-rouge">
    <div class="highlight">
      <pre class="highlight"><code><span class="nv">$ </span>gpg <span class="nt">--keyserver</span> hkp://keyserver.ubuntu.com <span class="nt">--refresh-keys</span> Swift</code></pre>
    </div>
  </div>
  <p>Then, use the signature file to verify that the archive is intact:</p>
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
  <p>If <code class="language-plaintext highlighter-rouge">gpg</code> fails to verify because you don’t have the public key (<code class="language-plaintext highlighter-rouge">gpg: Can't
  check signature: No public key</code>), please follow the instructions in <a href="#active-signing-keys">Active Signing Keys</a> below to import the keys into your keyring.
  </p>
  <p>You might see a warning:</p>
  <div class="language-shell highlighter-rouge">
    <div class="highlight">
      <pre class="highlight">
        <code>gpg: WARNING: This key is not certified with a trusted signature!
  gpg: There is no indication that the signature belongs to the owner.
        </code>
      </pre>
    </div>
  </div>
  <p>This warning means that there is no path in the Web of Trust between this
  key and you. The warning is harmless as long as you have followed the steps
  above to retrieve the key from a trusted source.</p>

  <p><a href="/keys/active">Active Signing Keys</a></p>
  <p><a href="/keys/expired">Expired Signing Keys</a></p>
</details>

**4. Extract the archive with the following command:**

```shell
$ tar xzf swift-<VERSION>-<PLATFORM>.tar.gz
```

This creates a `usr/` directory in the location of the archive.

**5. Add the Swift toolchain to your path as follows:**

```shell
$ export PATH=/path/to/usr/bin:"${PATH}"
```

You can now execute the `swift` command to run the REPL or build Swift projects.
