---
layout: page
title: Packages
---

Swift has a rich ecosystem of open-source packages that you can easily import into your project using the [Swift Package Manager](/package-manager/) (SPM). With more than 5,500 open-source packages, you’re sure to find what you’re looking for, whether it’s a package to help you build great apps for Apple platforms or if you’re looking to develop server backends with Swift. Or, get started today by [creating a package yourself](https://developer.apple.com/documentation/xcode/creating-a-standalone-swift-package-with-xcode).

## Featured Packages

There are thousands of packages to explore through the community-run package index project, the [Swift Package Index](https://swiftpackageindex.com/){:target="_blank"}. Below is a selection of popular packages in commonly used categories and packages picked by podcasts or blogs around the community.

<ul>
  {% for category in site.data.packages.packages.categories %}
  <li><a href="#{{ category.anchor }}-packages">{{ category.name }}</a></li>
  {% endfor %}
</ul>

{% for category in site.data.packages.packages.categories %}
<h3 id="{{ category.anchor }}-packages">{{ category.name }}</h3>
<p>{{ category.description | markdownify }}</p>
<ul class="package-list-v1">
  {% for package in category.packages %}
  <li class="{% if package.showcase_reason %}showcase{% endif %}">
    <a href="{{ package.url }}" target="_blank">
      <h4><span>{{ package.name }}</span></h4>
      <section class="description">
        {{ package.description | markdownify }}
      </section>
      <section class="metadata">
        <div class="platform-compatibility" title="{{ package.platform_compatibility_tooltip }}">
        {% for platform in package.platform_compatibility %}
          <span>{{ platform }}</span>
        {% endfor %}
        </div>
        <div class="swift-compatibility" title="Swift version compatibility">
          <span>{{ package.swift_compatibility }}</span>
        </div>
        <div class="license" title="Package license">
          <span>{{ package.license }}</span>
        </div>
      </section>
    </a>
    {% if package.showcase_reason %}
    <section class="showcase-reason">
      {{ package.showcase_reason | markdownify }}
    </section>
    {% endif %}
  </li>
  {% endfor %}
</ul>

<p class="more">
  <a href="{{ category.more.url }}" target="_blank">{{ category.more.title }}</a>
</p>
{% endfor %}
