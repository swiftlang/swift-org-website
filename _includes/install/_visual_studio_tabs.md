[Windows Package Manager](https://docs.microsoft.com/windows/package-manager/) (aka WinGet) comes pre-installed with Windows 11 (21H2 and later). It can also be found in the [Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1) or be [installed directly](ms-appinstaller:?source=https://aka.ms/getwinget).

---

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
