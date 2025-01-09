{% assign static_sdk_dev_builds = site.data.builds.development.static_sdk | sort: 'date' | reverse %}
{% assign static_sdk_6_0_builds = site.data.builds.swift-6_0-branch.static_sdk | sort: 'date' | reverse %}
  <h3> 静态 Linux SDK </h3>
<ul class="grid-level-0 grid-layout-2-column">
    <li class="grid-level-1">
    <h3>主分支</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ static_sdk_dev_builds.first.date | date_to_xmlschema }}" title="{{ static_sdk_dev_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ static_sdk_dev_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      静态 Linux SDK - 用于交叉编译到 Linux
      <ul>
        <li><a href="https://download.swift.org/development/static-sdk/{{ static_sdk_dev_builds.first.dir }}/{{ static_sdk_dev_builds.first.download_signature }}">签名 (PGP)</a>
        </li>
        <li>
          校验和: <code>{{ static_sdk_dev_builds.first.checksum }}</code></li>
      </ul>
    </p>
    <a href="https://download.swift.org/development/static-sdk/{{ static_sdk_dev_builds.first.dir }}/{{ static_sdk_dev_builds.first.download }}" class="cta-secondary">下载 Linux 静态 SDK</a>
  </li>
  <li class="grid-level-1">
    <h3>发布/6.0 分支</h3>
    <p class="description" style="font-size: 14px;">
      <time datetime="{{ static_sdk_6_0_builds.first.date | date_to_xmlschema }}" title="{{ static_sdk_6_0_builds.first.date | date: '%B %-d, %Y %l:%M %p (%Z)' }}">{{ static_sdk_6_0_builds.first.date | date: '%B %-d, %Y' }}</time>
    </p>
    <p class="description">
      静态 Linux SDK - 用于交叉编译到 Linux
      <ul>
        <li><a href="https://download.swift.org/swift-6.0-branch/static-sdk/{{ static_sdk_6_0_builds.first.dir }}/{{ static_sdk_6_0_builds.first.download_signature }}">签名 (PGP)</a></li>
        <li>校验和: <code>{{ static_sdk_6_0_builds.first.checksum }}</code></li>
      </ul>
    </p>
    <a href="https://download.swift.org/swift-6.0-branch/static-sdk/{{ static_sdk_6_0_builds.first.dir }}/{{ static_sdk_6_0_builds.first.download }}" class="cta-secondary">下载 Linux 静态 SDK</a>
  </li>
</ul>
<a href="/documentation/articles/static-linux-getting-started.html" class="cta-secondary">使用说明 (Linux 静态 SDK)</a>
