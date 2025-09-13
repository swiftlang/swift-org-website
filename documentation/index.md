---
layout: page
title: Documentation
---

If you are new to Swift, you may want to check out these additional resources.

<div class="links links-list-nostyle" markdown="1">
- [Getting started guide](/getting-started/)
- [Swift resources on developer.apple.com](https://developer.apple.com/swift/resources/){:target="_blank" class="link-external"}
</div>

{%- for category in site.data.documentation %}
## {{ category.header }}
  <div>
  {%- for entry in category.pages %}
    <div>
    <a href="{{ entry.url }}">{{ entry.title }}</a>{% if entry.description %}: {{ entry.description }}{% endif %}
    </div>
    <br/>
  {% endfor %}
  </div>
{% endfor %}
