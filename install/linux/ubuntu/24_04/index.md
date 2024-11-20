---
layout: page-wide
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md ubuntu="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.ubuntu  name="Ubuntu" pressed="Ubuntu 24.04" %}

{% include install/_build_release.md platform="Ubuntu 24.04" docker_tag="noble" %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include install/_older-releases.md platform="Ubuntu 24.04" %}
</details>