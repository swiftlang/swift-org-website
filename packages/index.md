---
layout: page
title: Packages
---

Swift has a rich ecosystem of open-source packages that you can easily import into your project using the [Swift Package Manager](https://www.swift.org/package-manager/) (SPM). Use the [Swift Package Index](https://swiftpackageindex.com) to search for libraries and tools that are compatible with SPM.

## Community Packages

{% for category in site.data.packages.packages.categories %}
<h3>{{ category.name }}</h3>
<p>{{ category.description | markdownify }}</p>
<ul class="package-list">
  {% for package in category.packages %}
  <li>
    <section>
      <h4>{{ package.name }}</h4>
      <div class="description">{{ package.description | markdownify }}</div>
    </section>
    <ul class="metadata">
      <li class="compatibility">
        {{ package.swift_compatibility }}
      </li>
      <li class="stars">
        <picture>
          <source srcset="/assets/images/icon-star~dark.svg" media="(prefers-color-scheme: dark)">
          <img src="/assets/images/icon-star.svg" width="15" height="15" alt="">
        </picture> {{ package.stars }}
      </li>
    </ul>
  </li>
  {% endfor %}
</ul>
{% endfor %}
