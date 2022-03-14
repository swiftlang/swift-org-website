{% if xcode_3_0_p1_builds.size > 1 %}

Xcode
<table id="osx-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Xcode</th>
        </tr>
    </thead>
    <tbody>
        {% for build in xcode_3_0_p1_builds | offset:1 | limit:10 %}
            {% include_relative _old-snapshot.html build=build platform_dir="xcode" branch_dir="swift-3.0-preview-1-branch" %}
        {% endfor %}
    </tbody>
</table>

{% endif %}

{% if ubuntu1510_3_0_p1_builds.size > 1 %}

Ubuntu 15.10
<table id="linux-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Download</th>
        </tr>
    </thead>
    <tbody>
        {% for build in ubuntu1510_3_0_p1_builds | offset:1 | limit:10 %}
            {% include_relative _old-snapshot.html build=build platform_dir="ubuntu1510" branch_dir="swift-3.0-preview-1-branch" %}
        {% endfor %}
    </tbody>
</table>

{% endif %}

{% if ubuntu1404_3_0_p1_builds.size > 1 %}

Ubuntu 14.04
<table id="linux-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Download</th>
        </tr>
    </thead>
    <tbody>
        {% for build in ubuntu1404_3_0_p1_builds | offset:1 | limit:10 %}
            {% include_relative _old-snapshot.html build=build platform_dir="ubuntu1404" branch_dir="swift-3.0-preview-1-branch" %}
        {% endfor %}
    </tbody>
</table>

{% endif %}





