{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Static SDK'| first %}

<li class="grid-level-1 featured">
  <h3>静态 Linux SDK</h3>
  <p class="description">
    静态 Linux SDK - 用于交叉编译到 Linux 平台
    <ul>
      <li><a href="https://download.swift.org/{{ tag_downcase }}/static-sdk/{{ tag }}/{{ tag }}_static-linux-0.0.1.artifactbundle.tar.gz.sig">签名文件 (PGP)</a>
      </li>
      <li>
        校验和: <code>{{ platform.checksum }}</code></li>
    </ul>
  </p>
  <a href="https://download.swift.org/{{ tag_downcase }}/static-sdk/{{ tag }}/{{ tag }}_static-linux-0.0.1.artifactbundle.tar.gz" class="cta-secondary">下载 Linux 静态 SDK</a>
  <a href="/documentation/articles/static-linux-getting-started.html" class="cta-secondary">使用说明 (静态 Linux SDK)</a>
</li>
