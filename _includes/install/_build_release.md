## Latest Release (Swift {{ site.data.builds.swift_releases.last.name }}) {#latest}

{% assign tag = site.data.builds.swift_releases.last.tag %}
{% assign tag_downcase = site.data.builds.swift_releases.last.tag | downcase %}
{% assign platform_name_url = include.platform | remove: '.' | remove: ' ' | downcase %}
{% assign platform_name = include.platform | remove : ' ' | downcase %}
{% assign platform = site.data.builds.swift_releases.last.platforms | where: 'dir', include.platform_name_url | first %}
{% unless platform %}
  {% assign platform = site.data.builds.swift_releases.last.platforms | where: 'name', include.platform | first %}
{% endunless %}

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>Docker</h3>
    <p class="description">
      The official Docker images for Swift.
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">{{ site.data.builds.swift_releases.last.name }}-{{include.docker_tag}}</a>
    <a href="/install/linux/docker" class="cta-secondary">Instructions</a>
  </li>
  <li class="grid-level-1">
    <h3>Tarball</h3>
    <p class="description">
      Tarball packages (.tar.gz)
      <ul>
        <li>Signature (PGP):{{ ' ' }}
          {%- for arch in platform.archs -%}
          {%- unless forloop.first %} | {% endunless -%}
          <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}{% if arch != "x86_64" %}-{{ arch }}{% endif %}/{{ tag }}/{{ tag }}-{{ platform_name }}{% if arch != "x86_64" %}-{{ arch }}{% endif %}.tar.gz.sig" >
            {{- arch -}}
          </a>
          {%- endfor -%}
        </li>
      </ul>
    </p>
    <ul class="grid-level-0 grid-layout-2-column">
      {% for arch in platform.archs %}
      <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}{% if arch != "x86_64" %}-{{ arch }}{% endif %}/{{ tag }}/{{ tag }}-{{ platform_name }}{% if arch != "x86_64" %}-{{ arch }}{% endif %}.tar.gz" class="cta-secondary">Download ({{ arch }})</a>
      {% endfor %}
    </ul>
    <a href="/install/linux/tarball" class="cta-secondary">Instructions</a>
  </li>
</ul>

<ul class="grid-level-0">
  {% include install/_static_sdk_release.md %}

  {% if include.rpm %}
    <li class="grid-level-1 featured">
      <h3>RPM</h3>
      <p class="description">
        RPM Package Manager (Experimental use only)
      </p>
      <a href="/install/linux/rpm" class="cta-secondary">Instructions</a>
    </li>
  {% endif %}
</ul>

<hr>
