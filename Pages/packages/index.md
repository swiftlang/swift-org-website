---
template: page-wide
title: Packages
contentTemplating: true
---


The Swift package ecosystem has thousands of packages to help you with all kinds of tasks across your projects. You'll find networking, testing, UI helpers, logging, animation, and many more packages that work with the [Swift Package Manager](/documentation/package-manager/) (SwiftPM).

## Package Ecosystem

Browse a small selection of interesting packages in popular categories from around the community, as well as a hand-picked selection of new and notable packages.

<ul class="grid-level-0 grid-layout-category-list">
#for(category in data.packages.packages.categories):
<li class="grid-level-1 selectable">
<a href="/packages/#(category.slug).html">
<h3>#(category.name)</h3>
<p>#(category.brief)</p>
</a>
</li>
#endfor
</ul>
<p class="banner">
  <strong>Get involved!</strong> Packages in the Community Showcase are nominated by community members like you. This is your chance to share new or interesting packages with others. <a href="https://forums.swift.org/t/68168">Nominate packages here</a> and you could see them featured next month!
</p>

## Create Your Own

Creating a Swift package is a great way to modularise your code either for personal use, for private use inside your company, or to release an open source package for the rest of the Swift community to use.

Start by reading [creating a Swift package](/getting-started/library-swiftpm/), or by watching [Creating Swift Packages](https://developer.apple.com/videos/play/wwdc2019/410/) from WWDC 2019, or [Meet Swift Package plugins](https://developer.apple.com/videos/play/wwdc2022/110359/) from WWDC 2022.

To make your package easier to find for other members of the community, [add it to the Swift Package Index](https://swiftpackageindex.com/add-a-package).

## Advanced Search

The [Swift Package Index](https://swiftpackageindex.com/) is a community-run package search engine with powerful filters to help you find what you're looking for. For example, you could search for packages that:

- [Match a search term](https://swiftpackageindex.com/search?query=swiftui)
- [Have compatibility with both iOS and macOS platforms](https://swiftpackageindex.com/search?query=swiftui+platform:ios,macos)
- [Include an executable helper or tool](https://swiftpackageindex.com/search?query=swiftui+product:executable)
- [Have been created by a specific author](https://swiftpackageindex.com/search?query=author:apple)
