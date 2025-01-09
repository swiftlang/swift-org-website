<table id="osx-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">版本</th>
            <th class="download">发布日期</th>
            <th class="download">工具链</th>
            <th class="download">调试符号</th>
            <th class="download">静态 SDK</th>
        </tr>
    </thead>
    <tbody>
        {% assign releases = site.data.builds.swift_releases | offset:1  %}
        {% for release in releases reversed %}
        {% unless forloop.first %}
    {% include_relative _old-release.html release=release name="Xcode" platform_dir="xcode" %}
{% endunless %}

{% endfor %}
    </tbody>
</table>