## Go Further

Ready to dive deeper? Here are some hand-picked resources covering various Swift features.

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
        Watch video
        {% elsif resource.content_type == "article" %}
        Read article
        {% elsif resource.content_type == "book" %}
        Read book
        {% else %}
        View resource
        {% endif %}
      </a>
  </li>
  {% endfor %}
</ul>

Looking for even more? In the [documentation](/documentation/) you can find resources, references, and guidelines related to the Swift project, including the [API Design Guidelines](/documentation/api-design-guidelines/).
