## Go Further

Ready to dive deeper? Here are some hand-picked resources covering about various Swift features and use.

<ul class="go-further-list">
  {% for resource in site.data.go_further %}
  <li class="resource{% if resource.featured %} featured{% endif %}">
      {% if resource.thumbnail_url %}
        <img class="thumbnail" src="{{ resource.thumbnail_url }}"/>
      {% elsif resource.content_type == "article" %}
        <img class="thumbnail" src="/assets/images/getting-started/article-thumbnail.jpg"/>
      {% endif %}

      <h3>{{ resource.title }}</h3>
      <div class="description">
        {{ resource.description | markdownify }}
      </div>
      
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
