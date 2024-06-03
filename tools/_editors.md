## Editors

<ul class="tool-list">
  {%- for editor in site.data.tools.editors %}
    <li class="tool">
      <h3>
        <a target="_blank" href="{{ editor.link }}">
          {{ editor.name }}
        </a>
        {% if editor.officially-supported or editor.community-supported %}
          <span class="supported {% if editor.community-supported %} community{% endif %}">
            {% if editor.officially-supported %}
              Officially supported
            {% else %}
              Community supported
            {% endif %}
          </span>
        {% endif %}
      </h3>
      <p class="description">
        {{ editor.description }}
      </p>
      {% if editor.guide %}
        <a href="{{ editor.guide }}"  class="cta-secondary">
          Learn more
        </a>
      {% endif %}
    </li>
  {%- endfor %}
</ul>
