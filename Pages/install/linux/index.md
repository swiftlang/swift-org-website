---
template: install
title: Install Swift - Linux
contentTemplating: true
redirect_from: /download/
---
<div class="content">
<h3 id="swiftly" class="html-header-with-anchor">1. Install Swift via Swiftly</h3>
<div class="release-box section">
<div class="content">
#extend("partials/code-box", swiftlyRelease)
</div>
</div>
<div class="release-box section">
<div class="content">
#extend("partials/code-box", containerRelease)
</div>
</div>
<h3 id="editor" class="html-header-with-anchor">2. Select an Editor</h3>
<div class="releases-grid">
<div class="release-box section">
<div class="content">
#extend("partials/code-box", vscode)
</div>
</div>
<div class="release-box section">
<div class="content">
#extend("partials/code-box", otherEditors)
</div>
</div>
</div>
<h3 id="build-a-command-line-tool" class="html-header-with-anchor">3. Build a Command-line Tool</h3>
<div class="release-box section">
<div class="content">
#extend("partials/code-box", buildAPackage)
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
<br><br>
<hr>
<h2 id="development-snapshots" class="html-header-with-anchor">Development Snapshots</h2>
<div>
<p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
</div>
<div class="release-box section">
<div class="content">
#extend("partials/code-box", swiftlyDev)
</div>
</div>
<h2 id="swift-sdk-bundles" class="html-header-with-anchor">Swift SDK Bundles</h2>
<div>
<p class="content-copy">Additional components for cross-compilation</p>
</div>
<h3>Static Linux SDK</h3>
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
<div class="callout">
<div>
<p class="content-copy">
<a class="content-link block" href="/install/linux/amazonlinux/2023">Alternate Install Options</a>
</p>
</div>
</div>
</div>
