## 深入学习

准备深入了解更多？这里是一些精选的资源，涵盖了各种 Swift 特性。

<ul class="grid-level-0 grid-layout-2-column">
  {% for resource in site.data.go_further %}
  <li class="grid-level-1">
      {% if resource.thumbnail_url %}
        <img class="hero" src="{{ resource.thumbnail_url }}"/>
      {% elsif resource.content_type == "article" %}
        <img class="hero" src="/assets/images/getting-started/article-thumbnail.jpg"/>
      {% endif %}

      <h3>
        {{ resource.title }}
      </h3>

      <p class="description">
        {{ resource.description | markdownify }}
      </p>

      <a href="{{ resource.content_url }}" class="cta-secondary{% if resource.external %} external" target="_blank"{% else %}"{% endif %}>
        {% if resource.content_type == "video" %}
        观看视频
        {% elsif resource.content_type == "article" %}
        阅读文章
        {% elsif resource.content_type == "book" %}
        阅读书籍
        {% else %}
        查看资源
        {% endif %}
      </a>
  </li>
  {% endfor %}
</ul>

想要了解更多？在[文档](/documentation/)中，您可以找到与 Swift 项目相关的资源、参考和指南，包括 [API 设计指南](/documentation/api-design-guidelines/)。
