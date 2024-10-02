---
layout: new-layouts/blog
date: 2022-03-15 9:00:00
title: Swift.org Website is Now Open Source
author: tomerd
---

The Swift.org site has long served as the hub where developers come together to work on the open source Swift compiler, libraries, and tools.
Today, we are happy to announce that the Swift.org website itself is also an open source project, ready for community contributions.
With this move, the website is also expanding its mandate to better support the entire community of Swift users, not just contributors.

To aid in this effort, a new [Swift website workgroup (SWWG)](/website-workgroup) will be formed to navigate the evolution of the website.
It is exciting to imagine what the future of our site can become with the whole community pitching in. So let’s dive into what this all means.


## Goals for the Website

Swift.org is a collection of disparate content — everything from nightly build downloads, to community forums, documentation, and also evolution proposals for the language itself.
As an open source project, the website goals have grown. The site should:

* Welcome newcomers with friendly information about Swift
* Help visitors of all skill levels get started developing with Swift
* Document the language, libraries, and best practices
* Announce new features, APIs, and tooling improvements
* Provide a safe, friendly place to interact with fellow Swift developers
* Promote activities occurring anywhere within the community
* Support collaboration and evolution in building the Swift ecosystem

## Swift Website Workgroup (SWWG)

The Swift Website Workgroup (SWWG) will have the charter to work across any tools and platforms necessary to create a truly great web experience that achieves the goals stated above.
This includes work on the main website, as well as the forums, and documentation.

Anyone is welcome to contribute to the Swift.org website. All they need to do is create a pull request with a fix or improvement to the [repository](https://github.com/swiftlang/swift-org-website/) for the site.
The maintenance of the project, and approvals for community PRs, will be handled by the SWWG, composed of people from the broad Swift community.
There is also a [forum for folks to talk](https://forums.swift.org/c/swift-website) about the project.

Today, we are opening up nominations for community members who would like to serve on the [Swift Website Workgroup (SWWG)](/website-workgroup).
The goal is to get between five and ten volunteers to manage the day-to-day review of PRs from the community, as well as direct strategy for the site.

Individuals who would like to join the workgroup should apply by [contacting the @swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) via the Swift.org forums with your reasons for interest, and special skills that will help you serve in this capacity.
Members of the Core Team will review applications, and may have follow-up questions before voting for the initial cadre of team members.


### Diversity in Swift

Much like other workgroups at Swift.org, the Diversity in Swift team will work with the SWWG to ensure the principles and interests of the entire Swift community are always considered. You can [read more about the Swift website workgroup (SWWG) charter here.](/website-workgroup)


## Types of Content

The Swift.org website is open for community contribution, with a public governance process.
However, some content hosted on Swift.org follows a different publication process and isn’t open for the same kinds of contribution.
For instance, the text of The Swift Programming Language book is available under a Creative Commons license, but the project itself isn’t open source yet.
We intend to adopt Swift-DocC for this content, replacing the book’s current custom publication toolchain to release TSPL as an open-source project.

The blog occasionally hosts posts — such as announcements — with content that cannot be openly shared before publication.
If you have a proposed blog post you’d like to see published, we ask that you [email your draft post to `@swift-website-workgroup` using the Swift forums](https://forums.swift.org/new-message?groupname=swift-website-workgroup).

By their nature, blog posts are relevant when they are published and become outdated over time.
Pull requests to fix minor issues like typos are welcome, regardless of the post’s age.
Significant changes to blog posts after publication should be infrequent — for example, it’s unnecessary to revise an old blog post when APIs or best practices change.


## Repository on GitHub

The Swift.org website is now publicly [available on GitHub](https://github.com/swiftlang/swift-org-website/).
The website repository will also use [GitHub Issues](https://github.com/swiftlang/swift-org-website/issues) for issue tracking.
We hope this will make it even easier for people to participate, and be a testbed for the rest of the Swift project to move to Issues in the future.


## Next Steps

To read up on the full details of the SWWG, check out:

* [Swift website workgroup charter](/website-workgroup)
* [Swift.org website governance](/website-governance)
* [Swift forum for website evolution](https://forums.swift.org/c/swift-website)


One of the first tasks for the workgroup will be to determine the future technology stack upon which to build the site.
For example, documentation-style pages could move to Swift-DocC. And it may be good to use a Swift-based tool to replace Jekyll.
Other efforts may include designing new “Getting Started” content to make the site more welcoming.

If you would like to join the workgroup, please email your interest soon.
The goal is to have the first cadre of members set by the end of April 2022.
