<table id="osx-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">下载</th>
        </tr>
    </thead>
    <tbody>
        {% for build in xcode_6_1_builds | offset:1 | limit:10 %}
            {% include_relative _old-snapshot.html build=build name="Xcode" platform_dir="xcode" branch_dir="swift-6.1-branch" %}
        {% endfor %}
    </tbody>
</table>