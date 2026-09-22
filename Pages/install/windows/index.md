---
template: install
title: Install Swift - Windows
contentTemplating: true
redirect_from: /download/
---


<div class="content">
  <h3 id="winget" class="html-header-with-anchor">1. Install Swift via WinGet</h3>
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", windowsWinget)
    </div>
  </div>
  <h3 id="editor" class="html-header-with-anchor">2. Select an Editor</h3>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        #extend("partials/code-box", windowsVscode)
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
      #extend("partials/code-box", macosOtherEditors)
      </div>
    </div>
  </div>
  <h3 id="build-a-command-line-tool" class="html-header-with-anchor">3. Build a Command-line Tool</h3>
  <div class="release-box section">
    <div class="content">
      #extend("partials/code-box", windowsBuildAPackage)
    </div>
  </div>
  <h2 id="alternative-install-options" class="html-header-with-anchor">Alternative install options</h2>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>Manual Installation</h2>
          <p class="body-copy">
            Download the Swift installer (.exe)
          </p>
          <div class="link-wrapper">
            #for(installer in windowsInstallers):
              <div class="link-single">
                <a href="#(installer.download)" class="body-copy">Download (#(installer.arch))</a>
              </div>
            #endfor
            <div class="link-single">
              <a href="/install/windows/manual" class="body-copy">Instructions</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>Container</h2>
          <p class="body-copy">
            Official container images are available for compiling and running Swift on a variety of distributions.
          </p>
          <div class="link-wrapper">
            <div class="link-single">
              <a href="https://hub.docker.com/_/swift" class="body-copy">#(windowsDockerImage)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h2 id="previous-releases" class="html-header-with-anchor">Previous Releases</h2>
  <div>
    <p class="content-copy">Previous releases of Swift are available for installation on Windows using the manual installer, <a href="/install/windows/archived">as documented here</a>.</p>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download" style="margin-bottom: 0;">
        <summary>Previous Releases</summary>
        #extend("partials/install/older-releases", windowsOlderReleases)
        </details>
    </div>
  </div>
  <h2 id="development-snapshots" class="html-header-with-anchor">Development Snapshots</h2>
  <div>
    <p class="content-copy">Swift snapshots are prebuilt binaries that are automatically created from the branch. These snapshots are not official releases. They have gone through automated unit testing, but they have not gone through the full testing that is performed for official releases.</p>
  </div>
  <div>
    <p class="content-copy">
      <a class="content-link" href="/install/windows/manual/">Instructions</a>
    </p>
  </div>
  <div class="releases-grid">
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>main</h2>
          <p class="body-copy">
            <small>#(windowsMainX86.date)</small><br />
            Package installers (.exe)
          </p>
          <div class="link-wrapper">
            <div class="link-single">
              <a href="#(windowsMainX86.download)" class="body-copy">Download (x86_64)</a>
            </div>
            <div class="link-single">
              <a href="#(windowsMainArm64.download)" class="body-copy">Download (arm64)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="release-box section">
      <div class="content">
        <div class="code-box content-wrapper">
          <h2>release/6.4.x</h2>
          <p class="body-copy">
            <small>#(windowsBranchX86.date)</small><br />
            Package installers (.exe)
          </p>
          <div class="link-wrapper">
            <div class="link-single">
              <a href="#(windowsBranchX86.download)" class="body-copy">Download (x86_64)</a>
            </div>
            <div class="link-single">
              <a href="#(windowsBranchArm64.download)" class="body-copy">Download (arm64)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download">
        <summary>Previous Snapshots (main)</summary>
        #extend("partials/install/older-snapshots", windowsDevSnapshots)
        </details>
    </div>
  </div>
  <div class="release-box section">
    <div class="content">
        <details class="download">
        <summary>Previous Snapshots (release/6.4.x)</summary>
        #extend("partials/install/older-snapshots", windowsReleaseBranchSnapshots)
        </details>
    </div>
  </div>
</div>
