{% assign wasi_swift_sdk_dev_builds = site.data.builds.development.wasi_swift_sdk | sort: 'date' | reverse %}
  <h3> Swift SDK for WASI </h3>
<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>main</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ wasi_swift_sdk_dev_builds.first.date | date_to_xmlschema }}" title="{{ wasi_swift_sdk_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ wasi_swift_sdk_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Swift SDK for cross-compilation to WASI (WebAssembly System Interface)
      <ul>
        <li><a href="https://download.swift.org/development/wasi-swift-sdk/{{ wasi_swift_sdk_dev_builds.first.dir }}/{{ wasi_swift_sdk_dev_builds.first.download_signature }}">Signature (PGP)</a>
        </li>
        <li>
          Checksum: <code>{{ wasi_swift_sdk_dev_builds.first.checksum }}</code></li>
      </ul>
    </p>
    <a href="https://download.swift.org/development/wasi-swift-sdk/{{ wasi_swift_sdk_dev_builds.first.dir }}/{{ wasi_swift_sdk_dev_builds.first.download }}" class="cta-secondary">Download Swift SDK for WASI</a>
  </li>
</ul>
<a href="/documentation/articles/wasi-swift-sdk-getting-started.html" class="cta-secondary">Instructions (Swift SDK for WASI)</a>
