<table id="osx-builds" class="downloads body-copy">
    <thead>
        <tr>
            <th class="download">Download</th>
        </tr>
    </thead>
    <tbody>
        {% for build in xcode_dev_builds | offset:1 | limit:10 %}
            {% include_relative _old-snapshot.html build=build name="Xcode" platform_dir="xcode" branch_dir="development" %}
        {% endfor %}
    </tbody>
</table>
