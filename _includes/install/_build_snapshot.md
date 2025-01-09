## 开发版快照

Swift 快照是从分支自动创建的预构建二进制文件。这些快照不是正式发布版本。它们已经通过了自动化单元测试，但没有经过正式发布版本所需的完整测试流程。

{% assign platform_name_url = include.platform | remove: '.' | remove: ' ' | downcase %}
{% assign development_builds_2 = include.development_builds_2 | sort: 'date' | reverse %}
{% assign development_builds = include.development_builds | sort: 'date' | reverse %}

{% if include.aarch64 %}
{% assign aarch64_development_builds_2 = include.aarch64_development_builds_2 | sort: 'date' | reverse %}
{% assign aarch64_development_builds = include.aarch64_development_builds | sort: 'date' | reverse %}
{% endif %}

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>{{ include.development }}</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ development_builds.first.date | date_to_xmlschema }}" title="{{ development_builds.first.date | date: '%Y年%-m月%-d日 %l:%M %p (%Z)' }}">{{ development_builds.first.date | date: '%Y年%-m月%-d日' }}</time>
    </p>
    <h4>压缩包 (tar.gz)</h4>
    {% if include.aarch64 %}
    <ul class="grid-level-0 grid-layout-2-column">
      <a href="https://download.swift.org/{{ include.branch_dir }}/{{ platform_name_url }}/{{ development_builds.first.dir }}/{{ development_builds.first.download }}" class="cta-secondary">下载 (x86_64)</a>
      <a href="https://download.swift.org/{{ include.branch_dir }}/{{ platform_name_url }}-aarch64/{{ aarch64_development_builds.first.dir }}/{{ aarch64_development_builds.first.download }}" class="cta-secondary">下载 (aarch64)</a>
    </ul>
    {% else %}
    <a href="https://download.swift.org/{{ include.branch_dir }}/{{ platform_name_url }}/{{ development_builds.first.dir }}/{{ development_builds.first.download }}" class="cta-secondary">下载 (x86_64)</a>
    {% endif %}
    <h4>Docker</h4>
    <a href="https://hub.docker.com/r/swiftlang/swift/tags" class="cta-secondary external">{{ include.docker_tag }}</a>
    <p class="description">
      <ul>
        签名 (PGP): <a href="https://download.swift.org/{{ include.branch_dir }}/{{ platform_name_url }}/{{ development_builds.first.dir }}/{{ development_builds.first.download_signature }}">x86_64</a>{% if include.aarch64 %} | <a href="https://download.swift.org/{{ include.branch_dir }}/{{ platform_name_url }}-aarch64/{{ aarch64_development_builds.first.dir }}/{{ aarch64_development_builds.first.download_signature }}">aarch64</a>{% endif %}
      </ul>
    </p>
  </li>
  <li class="grid-level-1">
    <h3>{{ include.development_2 }}</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ development_builds_2.first.date | date_to_xmlschema }}" title="{{ development_builds_2.first.date | date: '%Y年%-m月%-d日 %l:%M %p (%Z)' }}">{{ development_builds_2.first.date | date: '%Y年%-m月%-d日' }}</time>
    </p>
    <h4>压缩包 (tar.gz)</h4>
      {% if include.aarch64 %}
      <ul class="grid-level-0 grid-layout-2-column">
        <a href="https://download.swift.org/{{ include.branch_dir_2 }}/{{ platform_name_url }}/{{ development_builds_2.first.dir }}/{{ development_builds_2.first.download }}" class="cta-secondary">下载 (x86_64)</a>
        <a href="https://download.swift.org/{{ include.branch_dir_2 }}/{{ platform_name_url }}-aarch64/{{ aarch64_development_builds_2.first.dir }}/{{ aarch64_development_builds_2.first.download }}" class="cta-secondary">下载 (aarch64)</a>
      </ul>
      {% else %}
      <a href="https://download.swift.org/{{ include.branch_dir_2 }}/{{ platform_name_url }}/{{ development_builds_2.first.dir }}/{{ development_builds_2.first.download }}" class="cta-secondary">下载 (x86_64)</a>
      {% endif %}
      <h4>Docker</h4>
      <a href="https://hub.docker.com/r/swiftlang/swift/tags" class="cta-secondary external">{{ include.docker_tag_2 }}</a>
      <p class="description">
        <ul>
          签名 (PGP): <a href="https://download.swift.org/{{ include.branch_dir_2 }}/{{ platform_name_url }}/{{ development_builds_2.first.dir }}/{{ development_builds_2.first.download_signature }}">x86_64</a> | <a href="https://download.swift.org/{{ include.branch_dir_2 }}/{{ platform_name_url }}-aarch64/{{ aarch64_development_builds_2.first.dir }}/{{ aarch64_development_builds_2.first.download_signature }}">aarch64</a>
        </ul>
      </p>
  </li>
</ul>
<ul class="grid-level-0 grid-layout-2-column">
  <a href="/install/linux/tarball" class="cta-secondary">安装说明 (压缩包)</a>
  <a href="/install/linux/docker" class="cta-secondary">安装说明 (Docker)</a>
</ul>
{% include install/_static_sdk_dev.md %}
<details class="download" style="margin-bottom: 0;">
  <summary>历史快照 ({{ include.development }})</summary>
  {% include install/_older_snapshots.md builds=development_builds name=include.platform platform_dir=platform_name_url branch_dir=include.branch_dir %}
</details>
<details class="download" style="margin-bottom: 0;">
  <summary>历史快照 ({{ include.development_2 }})</summary>
  {% include install/_older_snapshots.md builds=development_builds_2 name=include.platform platform_dir=platform_name_url branch_dir=include.branch_dir_2 %}
</details>
