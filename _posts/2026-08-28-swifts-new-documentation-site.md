---
layout: new-layouts/post
published: true
date: 2026-08-28 10:00:00
title: "A New Home for the Swift Documentation Site"
author: [heckj]
category: "Community"
description: "Swift's documentation is now consolidated at docs.swift.org. The site brings together the language guide, standard library and testing references, and toolchain docs, built with DocC and updated at least daily."
---

A reorganized and refreshed Swift documentation site is live at [docs.swift.org](https://docs.swift.org/latest/documentation/).
It brings together the Swift Programming Language guide, the reference API for the standard library and testing, and documentation for the toolchain and Swift on each platform.
The site is updated at least daily with any documentation changes across [swiftlang](https://github.com/swiftlang/) repositories.

## Where to look

- Latest release docs: <https://docs.swift.org/latest/documentation/>
- Nightly `main` branch docs: <https://docs.swift.org/main/documentation/>

The URL with `latest` will track the most recently released branch. To make this initial setup easier, it's currently built from the 6.4.x release branch.
Going forward, the URL with `latest` is the stable URL to find the latest release docs.
The URL with `main` tracks nightly development, and a URL with `6.4` is coming after the 6.4 release.

## Evolving content

This is a living site, not a finished product.
We wanted to make it available right away, and we'll keep improving it — it's also open to contribution.
Documentation for libraries and Swift packages continues to live on the Swift Package Index.

One gap worth noting: Foundation's reference API isn't yet included.
Work is underway to open source that content, as has been done for the Swift standard library.

## Next steps

There's a lot more behind this launch: nearly two years of work, what's still missing, what's coming next, and ways to get involved.
The overall structure and some of the content are hosted at [swiftlang/docs](https://github.com/swiftlang/docs), with much of the content coming from repositories in the [swiftlang](https://github.com/swiftlang).
For the full story, or if you're inclined to get involved, see [the announcement on the Swift Forums](https://forums.swift.org/t/swifts-new-documentation-site/89192).
