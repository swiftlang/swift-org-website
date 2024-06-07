{% assign static_sdk_dev_builds = site.data.builds.development.static_sdk | sort: 'date' | reverse %}
{% assign static_sdk_6_0_builds = site.data.builds.swift-6_0-branch.static_sdk | sort: 'date' | reverse %}
  <h3> Static Linux SDK </h3>
<ul class="install-instruction">
    <li class="resource">
    <h3>main</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ static_sdk_dev_builds.first.date | date_to_xmlschema }}" title="{{ static_sdk_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ static_sdk_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Static Linux SDK - Cross compile to Linux
      <ul>
        <li><a href="https://download.swift.org/development/static-sdk/{{ static_sdk_dev_builds.first.dir }}/{{ static_sdk_dev_builds.first.download_signature }}">Signature (PGP)</a></li>
      </ul>
    </p>
    <a href="https://download.swift.org/development/static-sdk/{{ static_sdk_dev_builds.first.dir }}/{{ static_sdk_dev_builds.first.download }}" class="cta-secondary">Download Linux Static SDK</a>
  </li>
  <li class="resource">
    <h3>release/6.0</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ static_sdk_6_0_builds.first.date | date_to_xmlschema }}" title="{{ static_sdk_6_0_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ static_sdk_6_0_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      Static Linux SDK - Cross compile to Linux
      <ul>
        <li><a href="https://download.swift.org/development/static-sdk/{{ static_sdk_6_0_builds.first.dir }}/{{ static_sdk_6_0_builds.first.download_signature }}">Signature (PGP)</a></li>
      </ul>
    </p>
    <a href="https://download.swift.org/development/static-sdk/{{ static_sdk_6_0_builds.first.dir }}/{{ static_sdk_6_0_builds.first.download }}" class="cta-secondary">Download Linux Static SDK</a>
  </li>
</ul>
<a href="/documentation/articles/static-linux-getting-started.html" class="cta-secondary">Instructions (Static Linux SDK)</a>