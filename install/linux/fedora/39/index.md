---
layout: page-wide
title: Install Swift
---

{% include install/_os_tabs.md linux="true" %}

{% include install/_linux_platforms_tabs.md fedora="true" %}

{% include install/_os_versions_tabs.md os_versions=site.data.install.fedora  name="Fedora" pressed="Fedora 39" %}

{% include install/_build_release.md platform="Fedora 39" docker_tag="fedora39" %}

<details class="download" style="margin-bottom: 0;">
  <summary>Older Releases</summary>
  {% include install/_older-releases.md platform="Fedora 39" %}
</details>
