<p id="platforms">Select Windows SDK version:</p>

<div class="interactive-tabs os">
  <div class="tabs">
    {% for sdk_version in site.data.install.windows_sdk %}
    {% if include.pressed == sdk_version %}
    <a href="/install/windows/winget/{{ include.visualstudio }}/{{ sdk_version }}" aria-pressed="true">{{ sdk_version }}</a>
    {% else %}
    <a href="/install/windows/winget/{{ include.visualstudio }}/{{ sdk_version }}" aria-pressed="">{{ sdk_version }}</a>
    {% endif %}
    {% endfor %}
  </div>
</div>

<hr>
