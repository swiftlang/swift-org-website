---
layout: new-layouts/base
title: Blog
label: blog
atom: true
---

{% capture banner-section %}
<div class="grid-1-col" markdown=1>
  <h1>Blog</h1>
</div>
{% endcapture %}
{% include new-includes/components/section.html
  content=banner-section
%}
