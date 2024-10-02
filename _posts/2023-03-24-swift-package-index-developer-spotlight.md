---
layout: new-layouts/blog
published: true
date: 2023-03-24 8:00:00
title: Swift Package Index gains Apple sponsorship
author: [daveverwer, svenaschmidt]
---

Building a thriving open source ecosystem is important to Swift’s success, and open source packages are the building blocks that help power countless Swift projects. As the number of packages increases, discovery becomes critical for developers needing to find the tools and libraries that help them build their apps and services.

Over the last three years, the [Swift Package Index](https://swiftpackageindex.com) has become a popular destination for searching and discovering packages to help developers with their work.

Recognizing the valuable resource the Swift Package Index provides to the community, the service is now sponsored by Apple.

The post below is a Developer Spotlight from Swift Package Index creators [Dave Verwer](https://daveverwer.com) and [Sven A. Schmidt](https://mastodon.social/@finestructure) about their journey building the index into what it is today.

***

Our goal for the Swift Package Index has always been to help people make better decisions about the package dependencies they include in their projects.

When we first launched the website in 2020, we initially tackled package metadata and search. The site polls a [list of known packages](https://github.com/SwiftPackageIndex/PackageList/blob/main/packages.json), clones every repository, analyses the package manifest and git history, and makes that metadata searchable. It’s more than a simple metadata search, though, and we designed the package page to expose essential information that enables developers to make informed decisions about their dependencies. It answers questions like how long a package has been in development, how the author has licensed the code, whether pull requests and issues are being monitored and responded to, and more. At first glance, a package page on the index can look similar to its GitHub repository page, but we focus the metadata to be relevant to potential user of the package.

As the site grew, we decided to add package compatibility testing. Swift packages can be used in apps across various platforms but there’s no easy way to determine compatibility for each platform. How did we tackle it? If you’re imagining that we attempt to build each package in the index for every permutation of four Swift versions and five platforms every time the default branch moves forward or the author tags a release, you’d be correct! The “build system”, as we now call it, processes an average of 5,000 builds per day and has completed more than five million builds in total. It’s such a large operation that it needs its own custom monitoring app:

![A screenshot of the internal Swift Package Index app, Pipelines. It shows the status of several pending, running, passed, and failed package builds.](/assets/images/swift-package-index-developer-spotlight-blog/pipelines-app.png)

All those build results go to build the concise compatibility matrix that shows the platform and Swift version requirements you see on [every package page](https://swiftpackageindex.com/swiftlang/swift-markdown).

Last year we turned to documentation. Highlighting packages that have documentation aligns with the site’s goal of making better decisions about dependencies, but we decided that detecting and highlighting wasn’t enough. Instead, we decided to offer the community a platform to build and host versioned documentation for free. Any package author can now opt-in to documentation generation, and once the build system has completed a successful build, we’ll host versioned DocC documentation. You can see an example of this with the [documentation for swift-markdown](https://swiftpackageindex.com/swiftlang/swift-markdown/documentation). The community adopted this feature quickly, and we now have 300+ packages opted in, and our storage requirements are climbing quickly:

![A chart showing documentation storage rising over time from zero in May 2022 to 35Gb in February 2023 with a sharp increase at the end of December 2022](/assets/images/swift-package-index-developer-spotlight-blog/docc-storage-growth.png)

The Swift Package Index doesn’t *merely* index Swift packages, it *is an* open-source Swift package! It runs as a [vapor](https://swiftpackageindex.com/vapor/vapor) app and depends on many other packages, such as [fluent](https://swiftpackageindex.com/vapor/fluent) and the [Postgres driver](https://swiftpackageindex.com/vapor/fluent-postgres-driver) for database access, [Plot](https://swiftpackageindex.com/JohnSundell/Plot) and [Ink](https://swiftpackageindex.com/JohnSundell/Ink) to render HTML, [swift-snapshot-testing](https://swiftpackageindex.com/pointfreeco/swift-snapshot-testing) for testing, and more.

Running a site like this takes constant maintenance, and we have merged more than 1,200 pull requests and deployed over 600 releases (about four per week) since launching three years ago. We also have a growing community of [external contributors](https://github.com/SwiftPackageIndex/SwiftPackageIndex-Server/graphs/contributors) that help improve the site every day.

Finally, with the community in mind, we also started a podcast called [Swift Package Indexing](https://swiftpackageindexing.transistor.fm), where we discuss progress with feature development and pick a selection of packages from around the community for each episode.

We couldn’t be more proud to see Apple support our project and join our [other community and corporate sponsors](https://swiftpackageindex.com/supporters) to ensure we can continue providing this service for many more years to come. Thank you to Apple and everyone who makes it possible to run this site.
