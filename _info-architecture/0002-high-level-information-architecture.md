# Swift High-Level Information Architecture

* Proposal: [SIAP-0002](0002-high-level-information-architecture.md)
* Author: [James Dempsey](https://github.com/dempseyatgithub)

## Overview

The Swift project consists of a very large surface area of information across a number of software projects, audiences, and specializations.

The goals of this document are:

* Outline the characteristics of the different information channels across the Swiftlang project.
* Define high-level focus areas of audience / topic that are largely independent of one another, allowing the architecture to be divided into more manageable chunks.
* For each focus area, define general principles for where information will be hosted across sites.

The intent is for this document to define a general approach for each focus area with details to be worked through and proposed by more focused working groups.

Note also that the focus areas are not strictly divided along audience or channel boundaries. Each focus area is as granular as practical.

## Terms

For purposes of discussion, this document and the Swift Information Architecture Project will use the following terms:

* *Channel*: A website, service, or other mechanisms where the the Swift community can receive information.
* *Audience*: One of the high-level audience categories defined in the [project overview document](0001-swift-information-architecture-project.md).Those high-level audiences are defined as:
  1. Newcomers
  2. Swift Developers
  3. Contributors
a. Potential Contributors
* *Specialization*: A Swift use case such as Embedded Swift, Server, C++ Interoperability, etc. with information and typically a community of developers specific to that use case.
* *Focus Area*: A well-defined piece of the Swift information architecture that can be worked on largely independently of other focus areas.

## Sources Of Truth

One of the [design principles](0001-swift-information-architecture-project.md) in the initial project document is that the project should strive to have a single source of truth for each piece of information across all official Swift project channels.

This section refines that design principle and adds a new principle.

At present, two channels serve as sources of truth:

* GitHub repositories
This is the primary source of truth for Swiftlang content. Even channels such as [Swift.org](http://Swift.org) are ultimately derived from content in a GitHub repository.
* Swift Forums
A small but important percentage of content is available only on the Swift Forums. This content includes Swift Evolution proposal pitches, review threads, and the rationale for proposal decisions.

### Additional Desgin Principle: Minimize Update Friction

The source of truth for content should be in a repository scoped to those best suited to update, review, and approve the content.

An example of where that principle is currently *not* in practice:

> The source of truth for content such as C++ Interoperability documentation is currently in the swift-org-website repository and so requires approval from members of the website workgroup to merge changes.
>
>
>
> Members of the website workgroup do not necessarily have the technical expertise in that area to be the appropriate people to review the changes.

Adhering to this principle can be addressed in various ways including separate repositories or CODEOWNERS files within a repository.

## Channels

Information is presented to the Swift community across a variety of channels. Part of the information architecture of the project is a clear definition and rationale of which content is presented in which channel.

### [Swift.org](http://Swift.org)

[Swift.org](http://Swift.org) can be thought of as the ‘front door’ or ‘front of house’ of the Swift project. It serves two main purposes:

* Provide an excellent ‘front door’ to newcomers to the Swift language and ecosystem. Some of the pages/content is focused entirely on newcomers:
  * Getting Started
  * Tutorials
* Provide excellent day to day information for existing Swift developers:
  * Documentation
  * Downloads including development builds
  * News / Blog

#### Audiences

Newcomer and Developer audiences

#### Interaction

This channel is for presenting information and does not provide facilities for discussion or interaction. In general the content on [Swift.org](http://Swift.org) can be considered ‘read only’.

#### User Experience

One of the core strengths of this channel is complete control over its appearance and user experience.

### GitHub

GitHub serves as the ‘back of house’ of the Swift project.

Work on Swiftlang projects happens in GitHub repositories. These repositories contain the source to everything from the Swift compiler and standard library to The Swift Programming Language book, to the contents of [Swift.org](http://Swift.org).

The purpose of this channel is to provide information about contributing, both for the swiftlang organization overall and individual repositories.

#### Audiences

Contributor audience

#### Interaction

Interaction largely takes the form of creating and commenting on Issues and Pull Requests. It also includes other GitHub features various swiftlang repositories may choose to use, such as projects.

GitHub Discussions are not used for Swiftlang projects, discussions are conducted in the Swift Forums.

#### User Experience

This channel is the standard GitHub user experience. This provides a familiar interface for users of GitHub. Control over the user experience is limited to the settings available in GitHub.

There is also the potential to present some content using GitHub Pages which would provide more control over the user experience of the pages. It would be important to establish guidelines regarding using GitHub as a way to present webpages as opposed to [Swift.org](http://Swift.org).

### Swift Forums

#### Audiences

All audiences. The various categories in the Swift Forums have different audiences, from newcomers asking questions about getting started with Swift to contributors discussion evolution pitches and proposals.

#### Interaction

The Swift Forums provide the most general and free-form interaction in the Swift community. This includes public and private categories as well as sending private direct messages to individuals and groups.

#### User Experience

The forums have the standard user experience of Discourse forums software. Control of the user interface is limited to settings and options of the Discourse software.

### Social Media

#### Audiences

Although all audience can get information form this channel, the primary audience is Swift Developers.

#### Interaction

Typical social media interactions are available such as replying to the post, liking, reposting, etc. The official Swift account does not typically reply back.

#### User Experience

The user experience is defined by each social media service and any third party clients.

### APIs

Not all information in the Swiftlang project is presented in the form of webpages. The Swift project already vends a number of APIs for use by clients.

One example is the `evolution.json` file used to drive the Swift Evolution Dashboard. This API is also used by other clients in the Swift community including desktop and mobile apps.

This channel includes RSS feeds, which overlaps with the Blog / News area of focus.

This channel typically vends a transformed representation of a source of truth.

#### Audiences

Contributor and Developer audience

#### Interaction

At present APIs are read-only used as a data source. There are currently no read-write APIs.

#### User Experience

There is no inherent user experience but the client experience as to the structure and content of what the API vends is completely in the control of the Swift project.

### External Channels

There are also channels outside the direct control of the Swift project that need to be considered. For example:

[developer.apple.com](https://developer.apple.com)
[Swift Package Index](https://swiftpackageindex.com/)
[Swiftinit Documentation Index](https://swiftinit.org/)

In some cases the most appropriate channel for information will be an external channel.

## Focus Areas

Focus areas exist for the purpose of dividing the information architecture project into smaller, manageable chunks, allowing smaller working groups to work through the details of that area.

Although some focus areas are larger in scope than others, when taken all together, they should address all of the audiences and channels defined above.

The set of focus areas listed below uses the [Swift.org](http://Swift.org) site as of April 2025 as a starting point.

### Contributor Audience

The Contributor Experience Workgroup will define the information architecture for contributors to the Swift project. This includes repository-specific information as well as swiftlang organization-wide information.

Audience: Contributors

Members of the Contributor Experience Workgroup are members of this project and will coordinate between this project and the workgroup.

Because the vast majority of activity for contributors happens on GitHub, GitHub will be the channel for the vast majority of contributor information.

#### Contributor Overview

Although the vast majority of contributor information will use GitHub, an aspirational page that encourages the broad variety of contributions to the project may be better suited for [Swift.org](http://Swift.org).

Audience: Potential Contributors

#### Governance

Governance information describes the Swiftlang organization, how it is structured, governed, and run. This includes overviews of all workgroups and steering groups, as well as charters and membership for each group.

Similarly, it may make sense for things such as the project code of conduct to be presented both on GitHub and on [Swift.org](http://Swift.org).

Audience: Mixed
The audience for this information is mixed. Newcomers may want to get an overview of how the project is managed before deciding to select Swift as a language. Existing Swift Developers may be curious about how decisions get made about the language they use on a daily basis. Contributors may also be curious about how the project is structured.

This information is relatively static and may be a good candidate to be presented on [Swift.org](http://Swift.org) (although likely with less top-level menu entries than the current site). Which channel to present this information bears discussion and so is a separate focus area.

#### Workgroup Operations

As opposed to governance information which is fairly static, workgroup operations includes things such as meeting notes, requests for comment on proposals which are not part of the evolution process, and any other communication from and with workgroups and steering groups.

### Newcomer and Swift Developer Audiences

The primary channel for both the Newcomer and Swift Developer audiences is [Swift.org](http://Swift.org).

Some pages on [Swift.org](http://Swift.org) serve a definite audience and so are different focus areas.

Some parts of [Swift.org](http://Swift.org), such as navigation, need to be designed to take the entirety of the site into account.

With [Swift.org](http://Swift.org) in particular there are areas that do not fit neatly into isolated focus areas. Areas of expected overlap are noted.

Another note is that the core pages of [Swift.org](http://Swift.org) are generated as a static site using Jekyll, while other content, such as documentation, is generated separately.

The focus areas on this section are separated into the current core pages / sections of the [Swift.org](http://Swift.org) site.

Note also that the information architecture project is being run in parallel with the [Swift.org Redesign Project](https://forums.swift.org/t/announcing-the-swift-org-redesign-project/75865). The two projects will work in tandem.

#### Home Page

Audience: Newcomers / Swift Developers

At present the home page does not provide any dynamic information which can make the Swift project appear to be lifeless. Although the home page should be a welcoming 'front door' for developers coming to Swift, it could potentially have something to also make it useful to day to day Swift developers.

#### Getting Started

Audience: Newcomers

Newcomers are the audience for this page. Note that things such as tutorials for newcomers and how they are authored and delivered may have some overlap with Documentation.

Also, providing a path for newcomers interested in particular specializations (e.g. Embedded Swift, Server-side Swift, etc.) may require coordination with how these specialized communities are supported on [Swift.org](http://Swift.org) overall.

#### Blog / News

Audience: Swift Developers

The audience for blog posts are existing Swift Developers. Newcomers may also read blog posts, and give a newcomer a sense of what is going on in the Swift ecosystem, but the posts are written for those already in the ecosystem.

A related item that overlaps with the Home Page focus area is the notion of some way of presenting project news on [Swift.org](http://Swift.org). At present the only mechanism for announcing or highlighting something on [Swift.org](http://Swift.org) is through blog posts. Having a way to present information that is more lightweight may be very beneficial.

This area of focus also includes the social media channel as one way of getting news about Swift. It also includes RSS feeds as another means of getting news.

#### Packages

Audience: Newcomers / Swift Developers

I believe this section has two purposes, first to show newcomers that Swift has a vibrant package ecosystem and second to make existing Swift developers aware of the packages available.

#### Tools

Audience: Newcomers / Swift Developers

This page is primarily for newcomers. Existing Swift developers have probably already discovered their editor of choice. It may be useful for existing Swift developers looking to expand to other platforms.

#### Community

Audience: Newcomers / Swift Developers / Potential Contributors

All audiences may be interested in learning more about the Swift community.

Currently the top-level menu has many items. In conjunction with the Governance and Contributor Overview focus areas, this focus area would discuss how (or if) community information should appear on [Swift.org](http://Swift.org).

#### Install / Downloads

Audience: Newcomers and Swift Developers

There are two audiences for installation and downloads. Newcomers need an easy way to install and get started with Swift. Day to day developers need easy ways to download different Swift versions including daily development builds.

This section of [Swift.org](http://Swift.org) needs to support both use cases well.

The introduction of swiftly may change the requiremets of installation and downloads on [Swift.org](http://Swift.org).

#### Documentation

Documentation is currently split between being statically generated as part of the core [Swift.org](http://Swift.org) site, and being generated via DocC and appearing in the [docs.swift.org](http://docs.swift.org) subdomain.

Audience: Swift Developers
Although contributors and newcomers will also look at documentation, documentation should be geared towards day to day use by Swift developers.

Because documentation pages are generated in a different way and has its own set of requirements, it is a separate focus area.

Topics that may also fall out of the Documentation focus area include documentation for Swift specializations such as C++ Interoperability, Server Side Swift, etc. Also, how best to incorporate sample code as part of documentation.

#### [Swift.org](http://Swift.org) Site-wide Areas

The primary site-wide area is navigation and overall site structure. This includes top-level navigation items and how the site is organized.

For example Google Summer of Code pages are top-level pages and a new top-level page is added every year. Possibly should be grouped a level down.

In addition, there are topics that bear discussion:

* Search
* Localization
* SEO

At present these are all included in this single focus areas but could be broken out as needed.

#### Specializations

Specializations are use cases of Swift where specialized information is required. These include areas such as Embedded Swift, Swift on Server, etc. In addition, there is typically a community of developers who specialize in these areas.

The purpose of this focus area is to work through how these communities should be supported on [Swift.org](http://Swift.org) - both newcomers coming to Swift with an interest in a specialization and day to day developers who work in these areas.

Note that this focus area overlaps with a number of other focus areas (Getting Started page, Documentation) and may propose other solutions such as a landing page for a specialization.

### APIs / Dashboards

[Swift.org](http://Swift.org) vends various APIs, including the JSON file that drives the Swift Evolution Dashboard.

This focus area will catalog all of the existing APIs, developer criteria for what purpose APIs should serve and when adding an API would be appropriate.

## Next Steps

Breaking down the information space into more manageable focus areas allows each focus area to be worked on independently with a minimal amount of overlap.

Each focus area will create a proposal which will include:

* The current state of the focus area
* The proposed information design of the focus area including the rationale
* A plan / tasks required to move from current state to the desired design

Once the members of the Swift Information Architecture project have reviewed the proposal it will be made public for Swift community review and feedback.

## Conclusion

The Swift project consists of a vast amount of information. By identifying audiences and channels, as well as breaking the information space into smaller focus areas, a detailed information architecture can be created for each focus area without losing sight of the overall architecture.