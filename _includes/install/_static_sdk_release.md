{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', 'Static SDK'| first %}

<li class="grid-level-1 featured">
  <h3>Static Linux SDK </h3>
  <p class="description">
    Static Linux SDK - Cross compile to Linux
    <ul>
      <li><a href="https://download.swift.org/{{ tag_downcase }}/static-sdk/{{ tag }}/{{ tag }}_static-linux-0.0.1.artifactbundle.tar.gz.sig">Signature (PGP)</a>
      </li>
      <li>
        Checksum: <code>{{ platform.checksum }}</code></li>
    </ul>
  </p>
  <a href="https://download.swift.org/{{ tag_downcase }}/static-sdk/{{ tag }}/{{ tag }}_static-linux-0.0.1.artifactbundle.tar.gz" class="cta-secondary">Download Linux Static SDK</a>
  <a href="/documentation/articles/static-linux-getting-started.html" class="cta-secondary">Instructions (Static Linux SDK)</a>
</li>
