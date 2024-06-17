## Editors

<ul class="tool-list">
  {%- for editor in site.data.tools.editors %}
    <li class="tool">
      <h3>
        <a target="_blank" href="{{ editor.link }}">
          {{ editor.name }}
        </a>
      </h3>
      <p class="description">
        {{ editor.description }}
      </p>
      {% if editor.guide %}
        <a href="{{ editor.guide }}" class="cta-secondary">
          Learn more
        </a>
      {% endif %}
    </li>
  {%- endfor %}
</ul>
