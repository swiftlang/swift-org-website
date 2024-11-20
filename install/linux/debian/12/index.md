---
layout: page-wide
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md debian="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.debian  name="Debian" pressed="Debian 12" %}

{% include install/_build_release.md platform="Debian 12" docker_tag="debian12" %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include install/_older-releases.md platform="Debian 12" %}
</details>
