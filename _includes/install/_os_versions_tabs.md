
Select {{ include.name }} version: 

<div class="interactive-tabs os">
  <div class="tabs">
    {% for os_version in include.os_versions %}
    {% if include.pressed == os_version.name %}
    <a href="{{ os_version.url }}" aria-pressed="true">{{ os_version.name }}</a>
    {% else %}
    <a href="{{ os_version.url }}" aria-pressed="">{{ os_version.name }}</a>
    {% endif %}
    {% endfor %}
  </div>
</div>
<br>  