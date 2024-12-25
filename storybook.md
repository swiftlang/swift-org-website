---
layout: new-layouts/storybook
atom: true
---

{% assign folders = "stories/classes,stories/components" | split: "," %}
{% for folder in folders %}
## {{ folder | split: "/" | last | capitalize }}

---

{% for file in site.static_files %}
{% if file.path contains folder %}
{% capture content %}
{% include_relative {{ folder }}/{{ file.name }} %}
{% endcapture %}
{{ content }}
{% endif %}
{% endfor %}
{% endfor %}
