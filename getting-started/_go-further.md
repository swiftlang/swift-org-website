## Go Further

Ready to dive deeper? Here are some hand-picked resources covering about various Swift features and use.

<ul class="go-further-list">
  {% for resource in site.data.go_further %}
  <li class="resource">
      <h3>{{ resource.title }}</h3>
      <p class="description">
        {{ resource.description }}
      </p>
      
      <a href="{{ resource.content_url }}" class="cta-secondary external" target="_blank">
        {% if resource.content_type == "video" %}
        Watch video
        {% elsif resource.content_type == "article" %}
        Read article        
        {% else %}
        View resource
        {% endif %}
      </a>
  </li>
  {% endfor %}
</ul>

Looking for even more? In the [documentation](/documentation/) you can find resources, references, and guidelines related to the Swift project, including the [API Design Guidelines](/documentation/api-design-guidelines/).
