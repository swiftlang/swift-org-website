# Proposal: Swift Docs Repository

* Author: [Joseph Heck](https://github.com/heckj)

## Introduction

Introduce a repository to host multiple catalogs, aligned by broad use cases and to workgroups or steering groups, to collect guides, explanatory documentation, and general reference documentation for the Swift project. Migrate some of the articles currently hosted as Jekyll/markdown content on Swift.org into a DocC format to provide structure around a growing set of articles, and host the archives generated from those catalogs at docs.swift.org, linked and referenced from the swift.org website. This provides a basic structure aligned to the Swift organization to support growth, as well as preserve links from legacy content at swift.org that we can redirect as content is migrated.

## Motivation

The documentation for Swift has grown organically since its open source release. That growth has resulted in fragmented locations to find information, little organization, and inconsistencies in updating content as the language grew. The Swift WebSite workgroup started down the path to redesign the swift.org website, and parallel with launched the [Swift Information Architecture project](https://forums.swift.org/t/swift-high-level-information-architecture/80066), to both revitalize the site and to set a structure that supports further, consistent growth for Swift documentation.

This proposal provides concrete guidance and structure for the [Documentation focus area](https://forums.swift.org/t/swift-high-level-information-architecture/80066#p-367675-documentation-41).

The proposal's goal is to provide a consistent place to host a diversity of Swift-related documentation, while also providing a structure in which to grow content while keeping it navigable and findable:

- Host content in well-known, public locations, directly navigable on swift.org.
- Act as a seed point to bring together and more easily update content for focus areas.
- Provide a path to allow for community feedback and reviewed updates to maintain the documentation.
- Enable relevant reviewers to maintain technical accuracy.

## Proposed Solution

Leverage Swift's [documentation tooling](https://www.swift.org/documentation/docc/) to provide a means to collect and organize the documentation, grouped into common collections. For documentation content aligned with a tool or library, host the source of the documentation alongside the source for that tool or library.

For documentation content that cuts across the ecosystem, or otherwise isn't aligned with a single repository, organize the content into collections within a single repository. Group the content of each collection by use case that aligns to a workgroup or set of people within the Swift community that can provide technical/accuracy reviews.

This pattern of collections takes inspiration from what [Rust language website describes as "Books"](https://www.rust-lang.org/learn). Collections that bring together in-depth content - references, guides, and explanatory conceptual content - that provide more depth and detail, collected together to be published in a coordinated fashion. This keeps the content available and discoverable by browsing and skimming and provides organization to support organic growth of content over time.

For cross-cutting documentation, use a single repository to host collections of documentation content (DocC catalogs) to avoid an explosion of documentation repositories. For example, DocC, Swift Package Manager, Swiftly, and others have existing repositories to host documentation but topic areas such as API guidelines, articles about language interoperability, Swift server tutorials, or guides to setting up development tooling do not. 

To support accurate documentation, align each DocC catalog with a Swift workgroup or steering group to identify relevant reviewers. For example, API guidelines should be reviewed by people identified by the Language Steering Group, or Swift server tutorials reviewed by people nominated by the Swift Server workgroup.

Codify the available reviewers using GitHub's `CODEOWNERS` file to map the DocC catalogs to relevant reviewers, and use GitHub pull requests for the review process.

From each DocC Catalog, build a DocC archive and publish it as a "static hosted site" to docs.swift.org. Link to the published documentation archives from the relevant pages and high-level organization provided on the swift.org website to provide click-through discoverability from swift.org pages.

To support migration of content that exists as articles on Swift.org today, use Jekyll's `redirectTo` plugin, which is already enabled on swift.org. As articles are migrated, update the front matter (YAML metadata) for the article source on Swift.org to provide a seamless redirect after the content is hosted at a URL on docs.swift.org.

## Detailed Design

### Catalogs and reviewers

Host a repository with a set of DocC catalogs that provide documentation related to a workgroup or steering group.

These documentation catalogs are meant to be separate from API reference documentation, so in DocC terms - they're primarily "bare" catalogs with only articles, or potentially hosting both articles and tutorials. In particular, this isn't meant to replace hosting API reference documentation for libraries, such as what's available through Swift Package Index.

Viewed from a "type" of documentation, for example referencing [diátaxis](https://diataxis.fr), the contents are meant to host [explanation](https://diataxis.fr/explanation/), [tutorials](https://diataxis.fr/tutorials/), and [how-to guides](https://diataxis.fr/how-to-guides/); not [reference](https://diataxis.fr/reference/) content.

Each catalog is associated with an existing workgroup or steering group.

  - API guidelines - moderated/reviewed by the Language Steering Group.
  - Server guides - moderated/reviewed by the SSWG.
  - C++ Interop Guide - moderated/reviewed by C++ Interop group.
  - Swift Migration guides - moderated by lang/platforms.
  - Tools Guides - moderated/reviewed by platform & ecosystem.

The `tree` view of such a repository:

```
├── APIGuides
│   └── APIGuides.docc
│       ├── Documentation.md
│       ├── ...
├── CODEOWNERS
├── InteropGuides
│   └── InteropGuides.docc
│       ├── ...
├── README.md
├── ServerGuides
│   └── ServerGuides.docc
│       └── Documentation.md
├── SwiftLangGuides
│   └── SwiftLangGuides.docc
│       └── Documentation.md
│       ├── ...
└── ToolGuides
    └── ToolGuides.docc
        ├── Documentation.md
        ├── ...
```

Catalogs with associated code, such as API reference documentation, that heavily leverage snippets, or that provide examples, are better served when wrapped inside a Swift package. These can also be hosted together in this repository, using the same "each directory owned/reviewed by a workgroup" pattern, but are only relevant for packages that would never be used as a dependency. Swift conventions dictate that a package intended to be used as a dependency needs to be hosted in its own git repository, making it more difficult to use in a monorepo-style configuration.

The workgroup or steering group associated with a collection identifies who to include as reviewers for their catalogs. From a mechanical perspective, reviewers are listed in a `CODEOWNERS` file, which uses the GitHub groups that Swift provides, or lists GitHub usernames individually.

For example, the structure of the catalogs above might line up to:

```
/APIGuides.docc/* @swiftlang/language-steering-group
/ServerGuides.docc/* @swiftlang/server-workgroup
/InteropGuides.docc/* @swiftlang/cxx-interop-workgroup
/SwiftLangGuides.docc/* @swiftlang/language-steering-group
/ToolGuides.docc/* @swiftlang/platform-steering-group
```

If a group dissolves, any catalogs can be associated with another group, or revert to control by the Swift Core Team.

New catalogs can be created at the request of the relevant workgroup or steering group, published and referenced from the swift.org website with the coordination of the Website workgroup.

### Existing "standalone" DocC catalogs

#### The Swift Programming Language:

Content hosted from https://github.com/swiftlang/swift-book/, presented at https://docs.swift.org/swift-book/documentation/the-swift-programming-language/ and linked from swift.org is already well established and likely wouldn't benefit from migrating.

In addition, there are links to external translations of that content, the links hosted at https://www.swift.org/documentation/tspl/, that should be preserved.

#### Swift Embedded:

The embedded Swift collaborators have assembled a DocC catalog in https://github.com/apple/swift-embedded-examples.

That catalog is closely aligned with Swift code content and projects also in that repository.

I think it is best to maintain and evolve with the close proximity, rather than breaking the stand-alone content into a separate git repository.

Additionally, the number and breadth of examples are far more discoverable within a focused repository such as this.

#### Concurrency Migration Guide:

The content displayed at https://www.swift.org/migration/documentation/migrationguide/ is generated from a stand-alone DocC catalog in the repository https://github.com/swiftlang/swift-migration-guide.

There are legacy Swift language migration guides, for earlier versions of Swift, hosted as articles within swift.org.

The newer migration guide hosts content examples in an associated Swift package. 

Like the Swift Embedded examples repository, it benefits from close proximity between examples and written content.

### Swift Docs Repository Content

Based on my review of existing content in Swift.org, I'd propose the following initial collections to include existing articles:

- API guidelines

  - documentation/api-design-guidelines/index.md

- Server guides

  - documentation/server/index.md
  - documentation/server/guides/memory-leaks-and-usage.md
  - documentation/server/guides/packaging.md
  - documentation/server/guides/allocations.md
  - documentation/server/guides/libraries
  - documentation/server/guides/libraries/log-levels.md
  - documentation/server/guides/libraries/concurrency-adoption-guidelines.md
  - documentation/server/guides/testing.md
  - documentation/server/guides/performance.md
  - documentation/server/guides/linux-perf.md
  - documentation/server/guides/deployment.md
  - documentation/server/guides/index.md
  - documentation/server/guides/deploying/heroku.md
  - documentation/server/guides/deploying/ubuntu.md
  - documentation/server/guides/deploying/gcp.md
  - documentation/server/guides/deploying/digital-ocean.md
  - documentation/server/guides/deploying/aws-copilot-fargate-vapor-mongo.md
  - documentation/server/guides/deploying/aws.md
  - documentation/server/guides/deploying/aws-sam-lambda.md
  - documentation/server/guides/building.md
  - documentation/server/guides/llvm-sanitizers.md
  - documentation/server/guides/passkeys.md
  - documentation/articles/static-linux-getting-started.md
    
- Interop Guides

  - documentation/articles/wrapping-c-cpp-library-in-swift.md
  - documentation/cxx-interop/project-build-setup/index.md

- Swift Language Guides

  - possibly seeding this and re-organizing it with content from https://github.com/swiftlang/swift-migration-guide
  - documentation/articles/value-and-reference-types.md
  - migration-guide-swift3/_migration-guide.md
  - migration-guide-swift3/se-0107-migrate.md
  - migration-guide-swift3/index.md
  - migration-guide-swift4/_migration-guide.md
  - migration-guide-swift4/index.md
  - migration-guide-swift4.2/_migration-guide.md
  - migration-guide-swift4.2/index.md
  - migration-guide-swift5/_migration-guide.md
  - migration-guide-swift5/index.md
  - documentation/concurrency/index.md
  - documentation/lldb/_playground-support.md
  - documentation/lldb/index.md

- Tool Guides

  - documentation/articles/zero-to-swift-nvim.md
  - documentation/articles/zero-to-swift-emacs.md
  - documentation/articles/getting-started-with-vscode-swift.md

## Alternatives Considered

### Don't use DocC for cross-cutting collections

For content that's aligned with repositories in `swiftlang` - Swift tooling or libraries - migrate any existing tooling to the relevant repository to consolidate to a single source of truth. For cross-cutting articles, add additional pages to provide organization on the swift.org website, and curate the organization with manual links.

Continue to grow articles using Jekyll (markdown, with additional front-matter/metadata) using pull requests to swift-org-website. Identify reviewers on an as-needed basis for new content as it is proposed or updated.

The obvious upside is that the structure could be "more directories" and some structure (in Jekyll/markdown) to present the pages and provide organization.

The downsides:

- Jekyll is different from DocC markdown, sometimes subtle so, and as such presents "paper cuts" to getting content out there for users already familiar with Swift documentation tooling. We don't aggressively use Jekyll short-codes or plugins in most of the current content - although some articles definitely have (the API guidelines). Additionally, getting the environment set up to preview and verify you've got markup correctly established is notably tricky.

- DocC provides a Swift-aligned, familiar structure, including affordances like quicknav and an article Table of Content on the side (depending on viewing width). The structure is reasonably well defined, laying out into a clear hierarchical format by default. Jekyll, in comparison, requires the Author to provide and constantly maintain any structure even between pages and if they're hierarchical vs. spaghetti, and so on.

- The process of finding reviewers and enabling reviews for content is heavily reliant on reviewers in the website workgroup to find and source reviews. This could be significantly streamlined by delegating it to workgroups or steering groups aligned with the content. Breaking the collected files out into a separate repository and having clearly defined reviewers for catalogs could significantly reduce the friction of getting updates and content available.

### Multiple Repos

Instead of using a mono-repo layout that collects catalogs, create a repository per catalog. This follows the pattern of what exists today with the repositories https://github.com/apple/swift-migration-guide, https://github.com/apple/swift-embedded-examples, and https://github.com/swiftlang/swift-book/. Each repository could have its own set of reviewers and committers, aligned with their relevant workgroup or steering group.

The downside of this scenario is that this could represent a notable growth of repositories, and finding the relevant content would be notably less obvious than a single location. Additionally, some of these repositories would be quite thin - containing relatively little content for the overhead of maintaining a repository.

The proposed catalogs don't currently have a need to provide examples (or related source code) as a part of what they present.

Because this content doesn't have the constraint of Swift packages, which expect a single package per repository, these repositories can be presented more compactly as a mono-repo style configuration.

## Future Directions

I think there's a good argument for migrating some of the content in the Swift repository's [docs](https://github.com/swiftlang/swift/tree/main/docs) directory to provide details about the Swift compiler and how to use it, as well as content related to the establishment and output of both the Platform and Ecosystems steering groups.
