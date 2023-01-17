## Go Further

Ready to dive deeper? Here are some hand-picked resources covering about various Swift features and use.

<ul class="go-further-list">
  {% for resource in site.data.go_further %}
  <li class="resource">
      <h3>{{ resource.title }}</h3>
      <p class="description">
        {{ resource.description }}
      </p>
      
      <a href="{{ resource.content_url }}" class="cta-secondary">
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