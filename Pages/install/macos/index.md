---
template: install
title: Install Swift - macOS
contentTemplating: true
redirect_from: /download/
---


<div class="content">
  <h3 id="swiftly" class="html-header-with-anchor">1. Install Swift via Swiftly</h3>
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", macosSwiftlyRelease)
    </div>
  </div>
  <h3 id="editor" class="html-header-with-anchor">2. Select an Editor</h3>
  <div class="releases-grid">
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", macosXcode)
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", windowsVscode)
    </div>
  </div>
</div>
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", macosOtherEditors)
    </div>
  </div>
  <h3 id="build-a-command-line-tool" class="html-header-with-anchor">3. Build a Command-line Tool</h3>
<div class="release-box section">
    <div class="content">
      #extend("partials/code-box", windowsBuildAPackage)
    </div>
  </div>
  <h2 id="swift-sdk-bundles" class="html-header-with-anchor">Swift SDK Bundles</h2>
  <div>
    <p class="content-copy">Additional components for cross-compilation</p>
  </div>
  <div class="releases-grid">
      <div class="release-box section">
      <div class="content">
        #extend("partials/install/sdk-box", releaseSDKs.staticLinux)
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        #extend("partials/install/sdk-box", releaseSDKs.wasm)
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        #extend("partials/install/sdk-box", releaseSDKs.android)
      </div>
    </div>
  </div>
  <h3 id="alternative-install-options" class="html-header-with-anchor">Alternative toolchain install options</h3>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>Package Installer</h2>
          <p class="body-copy">
            The toolchain package installer (.pkg) that Swiftly automates is available as a stand-alone download.
          </p>
          <div class="link-wrapper">
            <a href="#(macosToolchain)" class="body-copy">Download Toolchain</a>
          </div>
          <div class="link-single">
            <a href="/install/macos/package_installer" class="body-copy">Instructions</a>
          </div>
        </div>
      </div>
    </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Releases</summary>
        #extend("partials/install/macos-older-releases", macosOlderReleases)
        </details>
    </div>
  </div>
  <br><br>
  <hr>
  <h2 id="development-snapshots" class="html-header-with-anchor">Development Snapshots</h2>
  <div>
    <p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
    <p class="content-copy">The easiest way to install development snapshots is with the Swiftly tool. Read more on the <a href="/install/macos/swiftly">instructions page</a>.</p>
  </div>
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", macosSwiftlyDev)
    </div>
  </div>
  <h3>Toolchain</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/install/macos/package_installer">Instructions</a>
    </p>
  </div>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>main</h2>
          <p class="body-copy">
            <small>#(macosMainSnapshot.date)</small><br />
            Toolchain package installer (.pkg)
          </p>
          <div class="link-wrapper">
            <a href="#(macosMainSnapshot.download)" class="body-copy">Download Toolchain</a>
          </div>
          <div class="link-wrapper">
            <a href="#(macosMainSnapshot.debugInfo)" class="debug">Debugging Symbols</a>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>release/6.4.x</h2>
          <p class="body-copy">
            <small>#(macosBranchSnapshot.date)</small><br />
            Toolchain package installer (.pkg)
          </p>
          <div class="link-wrapper">
            <a href="#(macosBranchSnapshot.download)" class="body-copy">Download Toolchain</a>
          </div>
          <div class="link-wrapper">
            <a href="#(macosBranchSnapshot.debugInfo)" class="debug">Debugging Symbols</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Snapshots (main)</summary>
        #extend("partials/install/older-snapshots", macosDevSnapshots)
        </details>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Snapshots (release/6.4.x)</summary>
        #extend("partials/install/older-snapshots", macosReleaseBranchSnapshots)
        </details>
    </div>
  </div>
  <h2 id="swift-sdk-buindles-dev" class="html-header-with-anchor">Swift SDK Bundles</h2>
  <div>
    <p class="content-copy">Additional components for cross-compilation</p>
  </div>
  <h3>Swift SDK for Static Linux</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/documentation/articles/static-linux-getting-started.html">Instructions</a>
    </p>
  </div>
  #extend("partials/install/sdk-dev-grid", devSDKs.staticLinux)
   <h3>Swift SDK for WebAssembly</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/documentation/articles/wasm-getting-started.html">Instructions</a>
    </p>
  </div>
  #extend("partials/install/sdk-dev-grid", devSDKs.wasm)
  <h3>Swift SDK for Android</h3>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/documentation/articles/swift-sdk-for-android-getting-started.html">Instructions</a>
    </p>
  </div>
  #extend("partials/install/sdk-dev-grid", devSDKs.android)
</div>

