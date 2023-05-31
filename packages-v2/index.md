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
    <a href="{{ package.url }}" target="_blank">
      <h4>
        <div class="package-name">{{ package.name }}</div>
        <div class="stars">
          <picture>
            <source srcset="/assets/images/icon-star~dark.svg" media="(prefers-color-scheme: dark)">
            <img src="/assets/images/icon-star.svg" width="15" height="15" alt="">
          </picture> {{ package.stars }}
        </div>
      </h4>
      <section>
        <div class="description">
          {{ package.description | markdownify }}
          <p class="activity">{{ package.activity }} {{ package.authors }}</p>
        </div>
        <ul class="metadata">
          <li class="license">
            <strong>License: </strong>
            {{ package.license }}
          </li>
          <li class="swift_compatibility">
            <strong>Swift:</strong>
            {{ package.swift_compatibility }}
          </li>
          <li class="platform_compatibility">
            <strong>Platforms:</strong>
            {{ package.platform_compatibility | join: ", " }}
          </li>
        </ul>
      </section>
    </a>
  </li>
  {% endfor %}
</ul>

<p class="more">
  <a href="{{ category.more.url }}" target="_blank">{{ category.more.title }}</a>
</p>
{% endfor %}