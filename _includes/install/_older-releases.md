<table id="osx-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">版本</th>
            <th class="download">发布日期</th>
            <th class="download">工具链</th>
            <th class="download">Docker</th>
            {% if include.platform != "Windows 10" %}
            <th class="download">静态 SDK</th>
            {% endif %}
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
<sup>1</sup> Swift {{ include.release.name }} {{ windows_platform.first.name }} 工具链由 <a href="https://github.com/compnerd">Saleem Abdulrasool</a> 提供。Saleem 是 Swift Windows 移植版本的平台负责人，这是 Swift 项目的官方构建版本。<br><br>
{% endif %}
