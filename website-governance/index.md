---
layout: new-layouts/base
title: Swift.org website governance
---

See [website overview](/website) for more information about the Swift.org website goals and contribution guidelines.

The website has a small list of *maintainers* which have *write* access and are in charge of reviewing and merging pull requests from *contributors*.
The *maintainers* group consists of a small subset of the Swift core team and the [Swift website workgroup members](/website-workgroup).

The Swift.org website source code consists of several distinct parts:

1. General content: Markdown, HTML, data files, images and other content.
2. Blog posts: Source files for blog posts, mostly in markdown form.
3. Technical infrastructure: Code and scripts for generating the website’s final static content (HTML mostly) from other forms of textual content such as Markdown and HTML files.
4. Information design, user experience and user interface design: The layout and navigation of the website, including CSS and images used to define the user experience and user interface.

Each one of these areas is governed by a slightly different contribution process that matches their nature.

### General content governance

Incremental updates to existing content (outside blog posts) are done by submitting pull requests, and will be reviewed by the website maintainers.
Normally, these pull requests would be used to correct or improve existing topics.

Larger changes to content, such as introducing broad new topics, require consultation with the [website workgroup](/website-workgroup) to decide on the appropriate navigation structure and other information design concerns. Such broader changes can be proposed via a public forum post or can be suggested more privately by contacting the website workgroup [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) on the Swift Forums.

### Blog posts governance

The Swift.org blog is designed to keep the Swift community informed of recent development in the language, its ecosystem, and news about the community. It is a platform for sharing the language roadmap, interesting new features, libraries, and tools, and announcing project & community initiatives.

The blog is also an opportunity to recognize and highlight the work being done by members of our community, and we welcome post contributions through the [blog post contribution process]({% link blog-post-contributions/index.md %}).

### Swift libraries documentation and "The Swift Programming Language"

The Swift.org website hosts technical documentation for several Swift libraries, as well as "The Swift Programming Language".

These technical documents are not part of the website content, and are only re-published as part of the website. As such, these technical documents are not governed by this contribution guide.

### Technical infrastructure governance

Incremental fixes and improvements to the technical infrastructure of the website are done by submitting pull requests, and will be reviewed by the website maintainers.

Technical infrastructure changes need to go through more testing compared to content changes to make sure they work on both macOS and Linux, which are the primary development environments for the website.

### Information design, user experience and user interface design governance

Incremental fixes and improvements to the styling of the website are done by submitting pull requests, and will be reviewed by the website maintainers.

Larger changes to navigation, UX and UI, require consultation with the [website workgroup](/website-workgroup) to decide on the appropriate approach.
Such broader changes can be proposed via a public forum post or can be suggested more privately by contacting the website workgroup [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) on the Swift Forums.
