## 编辑器

<ul class="grid-level-0 grid-layout-2-column">
  {%- for editor in site.data.tools.editors %}
    <li class="grid-level-1">
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
          了解更多
        </a>
      {% endif %}
    </li>
  {%- endfor %}
</ul>
