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
<ul class="package-list-v2">
  {% for package in category.packages %}
  <li>
    <h4>{{ package.name }}</h4>
    <section class="description">
      {{ package.description | markdownify }}
    </section>
    <p class="metadata-link">
      <a href="{{ package.url }}" target="_blank">View Metadata&hellip;</a>
    </p>
  </li>
  {% endfor %}
</ul>

<p class="more">
  <a href="{{ category.more.url }}" target="_blank">{{ category.more.title }}</a>
</p>
{% endfor %}
