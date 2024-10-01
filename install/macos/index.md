---
layout: new-layouts/base
title: Install Swift
label: install-macos
atom: true
---

{% capture banner-section %}
<div class="grid-1-col" markdown=1>
  <h1>Install Swift</h1>
  {% include new-includes/components/tabs.html
    group="1"
    default="macOS"
    tabs=site.data.new-data.install.os
  %}
</div>
{% endcapture %}
{% include new-includes/components/section.html
  content=banner-section
%}
