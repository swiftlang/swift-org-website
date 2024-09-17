## Latest Release (Swift {{ site.data.builds.swift_releases.last.name }}) {#latest}

{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign platform_name_url = include.platform | remove: '.' | remove: ' ' | downcase %}
{% assign platform_name = include.platform | remove : ' ' | downcase %}

<ul class="install-instruction">
  <li class="resource">
    <h3>Docker</h3>
    <p class="description">
      The offical Docker images for Swift.
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">Coming Soon</a>
    <a href="/install/linux/docker" class="cta-secondary">Instructions</a>
  </li>
  <li class="resource">
    <h3>Tarball</h3>
    <p class="description">
      Tarball packages (.tar.gz)
      <ul>
        <li>Signature (PGP): <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}/{{ tag }}/{{ tag }}-{{ platform_name }}.tar.gz.sig" >x86_64</a>{% if include.aarch64 %} | <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}-aarch64/{{ tag }}/{{ tag }}-{{ platform_name }}-aarch64.tar.gz.sig">aarch64</a>{% endif %}</li>
      </ul>
    </p>
    {% if include.aarch64 %}
    <ul class="install-instruction">
      <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}/{{ tag }}/{{ tag }}-{{ platform_name }}.tar.gz" class="cta-secondary">Download (x86_64)</a>
      <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}-aarch64/{{ tag }}/{{ tag }}-{{ platform_name }}-aarch64.tar.gz" class="cta-secondary">Download (aarch64)</a>
    </ul>
    {% else %}
    <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}/{{ tag }}/{{ tag }}-{{ platform_name }}.tar.gz" class="cta-secondary">Download (x86_64)</a>
    {% endif %}
    <a href="/install/linux/tarball" class="cta-secondary">Instructions</a>
  </li>
</ul>
{% include install/_static_sdk_release.md %}

{% if include.rpm %}
  <ul class="install-instruction">
    <li class="resource featured">
      <h3>RPM</h3>
      <p class="description">
        RPM Package Manager (Experimental use only)
      </p>
      <a href="/install/linux/rpm" class="cta-secondary">Instructions</a>
    </li>
  </ul>
{% endif %}

<hr>
