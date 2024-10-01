---
redirect_from:
  - "/download/"
layout: new-layouts/base
title: Install Swift
label: install
atom: true
---

{% capture banner-section %}
<div class="grid-1-col" markdown=1>
  <h1>Install Swift</h1>
  {% include new-includes/components/tabs.html
    group="1"
    tabs=site.data.new-data.install.os
  %}
</div>
{% endcapture %}
{% include new-includes/components/section.html
  content=banner-section
%}
<script>
  const { userAgentData, userAgent } = window.navigator;

  const osToOsRegex = {
    windows: /win/,
    macos: /macintosh/,
    linux: /linux/,
  };

  const OS =
    Object.keys(osToOsRegex).find((os) =>
      osToOsRegex[os].test(userAgent.toLowerCase()),
    ) || 'macos';

  window.location.replace(OS);
</script>
