## 最新发布版本 (Swift {{ site.data.builds.swift_releases.last.name }}) {#latest}

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
    <h3>Docker 镜像</h3>
    <p class="description">
      Swift 官方 Docker 镜像。
    </p>
    <a href="https://hub.docker.com/_/swift" class="cta-secondary external">{{ site.data.builds.swift_releases.last.name }}-{{include.docker_tag}}</a>
    <a href="/install/linux/docker" class="cta-secondary">安装说明</a>
  </li>
  <li class="grid-level-1">
    <h3>压缩包</h3>
    <p class="description">
      压缩包格式 (.tar.gz)
      <ul>
        <li>签名 (PGP):{{ ' ' }}
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
      <a href="https://download.swift.org/{{ tag_downcase }}/{{ platform_name_url }}{% if arch != "x86_64" %}-{{ arch }}{% endif %}/{{ tag }}/{{ tag }}-{{ platform_name }}{% if arch != "x86_64" %}-{{ arch }}{% endif %}.tar.gz" class="cta-secondary">下载 ({{ arch }})</a>
      {% endfor %}
    </ul>
    <a href="/install/linux/tarball" class="cta-secondary">安装说明</a>
  </li>
</ul>

<ul class="grid-level-0">
  {% include install/_static_sdk_release.md %}

  {% if include.rpm %}
    <li class="grid-level-1 featured">
      <h3>RPM 包</h3>
      <p class="description">
        RPM 包管理器（仅供实验使用）
      </p>
      <a href="/install/linux/rpm" class="cta-secondary">安装说明</a>
    </li>
  {% endif %}
</ul>

<hr>
