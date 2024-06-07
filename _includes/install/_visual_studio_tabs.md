<p id="platforms">Select Visual Studio 2022 edition:</p>

<div class="interactive-tabs os">
  <div class="tabs">
    {% for edition in site.data.install.visualstudio %}
    {% if include.pressed == edition.id %}
    <a href="/install/windows/winget/vs17_{{ edition.id | downcase }}" aria-pressed="true">{{ edition.name }}</a>
    {% else %}
    <a href="/install/windows/winget/vs17_{{ edition.id | downcase }}" aria-pressed="">{{ edition.name }}</a>
    {% endif %}
    {% endfor %}
  </div>
</div>

<hr>
