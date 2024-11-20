<table id="osx-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Release</th>
            <th class="download">Date</th>
            <th class="download">Toolchain</th>
            <th class="download">Docker</th>
        </tr>
    </thead>
    <tbody>
        {% assign releases = site.data.builds.swift_releases | offset:1  %}
        {% for release in releases reversed %}
        {% unless forloop.first %}
            {% include install/_old-release.html release=release platform=include.platform %}
        {% endunless %}

{% endfor %}
    </tbody>
</table>
{% if include.platform == "Windows 10" %}
<sup>1</sup> Swift {{ include.release.name }} {{ windows_platform.first.name }} toolchain is provided by <a href="https://github.com/compnerd">Saleem Abdulrasool</a>. Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>
{% endif %}
