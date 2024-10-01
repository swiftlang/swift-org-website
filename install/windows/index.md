---
layout: new-layouts/base
title: Install Swift
label: install-windows
atom: true
---

{% capture banner-section %}
<div class="grid-1-col" markdown=1>
  <h1>Install Swift</h1>
  {% include new-includes/components/tabs.html
    group="1"
    default="Windows"
    tabs=site.data.new-data.install.os
  %}
</div>
{% endcapture %}
{% include new-includes/components/section.html
  content=banner-section
%}
