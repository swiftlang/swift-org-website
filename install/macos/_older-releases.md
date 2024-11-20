<table id="osx-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Release</th>
            <th class="download">Date</th>
            <th class="download">Toolchain</th>
            <th class="download">Debugging Symbols</th>
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