---
layout: page
title: 文档
---

如果您是 Swift 新手，可以查看以下额外资源。

<div class="links links-list-nostyle" markdown="1">
- [入门指南](/getting-started/)
- [Apple 开发者网站上的 Swift 资源](https://developer.apple.com/swift/resources/){:target="_blank" class="link-external"}
</div>

{%- for category in site.data.documentation %}
  <h2>
  {{ category.header }}
  </h2>
  <div>
  {%- for entry in category.pages %}
    <div>
    <a href="{{ entry.url }}">{{ entry.title }}</a>{% if entry.description %}: {{ entry.description }}{% endif %}
    </div>
    <br/>
  {% endfor %}
  </div>
{% endfor %}
