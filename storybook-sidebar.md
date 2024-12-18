---
---

{% assign folders = "stories/classes,stories/components" | split: "," %}
{% for folder in folders %}
{% capture folder_output %}
## {{ folder | split: "/" | last | capitalize }}

{% for file in site.static_files %}
{% if file.path contains folder %}
<a href="/storybook#{{ file.name | split: '.' | first }}">{{ file.name | split: '.' | first }}</a>
{% endif %}
{% endfor %}
{% endcapture %}
{{ folder_output | markdownify }}
{% endfor %}
