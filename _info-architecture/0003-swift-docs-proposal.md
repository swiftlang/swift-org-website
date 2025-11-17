# Proposal: Swift Docs Repository

* Author: [Joe Heck](https://github.com/heckj)

## Introduction

Introduce a repository to host multiple DocC catalogs, aligned by broad use cases and with workgroups or steering groups, to collect guides, tutorial content, and explanatory or general documentation for the Swift project.
The goal of this repository is to provide a structured, central location to collect documentation related to the Swift project.
Today there are bits and pieces of documentation in multiple locations, including a number of articles currently hosted as Jekyll/Markdown content on Swift.org.
This proposal suggests moving that content and converting it into a DocC/Markdown format to provide structure for visually navigating the articles as well as creating a consistent place to grow more content.
The content in this structure is expected to be generated into static DocC archives using Swift's documentation tool, and hosted through the project’s infrastructure at docs.swift.org, then linked and referenced from the swift.org website.
This provides structure aligned to the Swift organization to support documentation growth, while maintaining links from the URLs where the content previously existed when referenced from swift.org that we can redirect as content is migrated.

## Motivation

The documentation for Swift has grown organically since its open-source release.
That growth has resulted in fragmented locations to find information, little organization, and inconsistencies in updating content as the language grew.
The Swift WebSite workgroup started down the path to redesign the swift.org website, and parallel with that, launched the [Swift Information Architecture project](https://forums.swift.org/t/swift-high-level-information-architecture/80066), to both revitalize the site and to set a structure that supports further, consistent growth for information about Swift.

This proposal provides concrete guidance and structure for the [Documentation focus area](https://forums.swift.org/t/swift-high-level-information-architecture/80066#p-367675-documentation-41).

The proposal's goal is to provide a consistent place to host a diversity of Swift-related documentation, while also providing a structure in which to grow content while keeping it navigable and findable:

- Host content in well-known, public locations, directly navigable on swift.org.
- Act as a seed point to bring together and more easily update content for focus areas.
- Provide a path to allow for community feedback and reviewed updates to maintain the documentation.
- Enable relevant reviewers to maintain technical accuracy.

## Proposed Solution

Leverage Swift's [documentation tooling](https://www.swift.org/documentation/docc/) to provide a means to collect and organize the documentation, grouped into common collections.
For documentation content aligned with a tool or library, host the source of the documentation alongside the source for that tool or library.

For documentation content that cuts across the ecosystem, or isn't aligned with a single repository, organize the content into collections within a single "docs" repository.
Group the content of each collection by use case that aligns to a workgroup or set of people within the Swift community that can provide technical/accuracy reviews.
At a high level, these collections can be viewed as "books" of documentation, using DocC's structure to provide a hierarchical visual structure, and leveraging DocC's navigation structure for reading through the content.

This pattern of collections takes inspiration from what [Rust language website describes as "Books"](https://www.rust-lang.org/learn).
These are collections that bring together in-depth content - references, guides, and explanatory conceptual content - that provide more depth and detail, collected together to be published in a coordinated fashion.
This keeps the content available and discoverable by browsing and skimming and provides organization to support organic growth of content over time.

For cross-cutting documentation related to Swift, use a single repository to host collections of documentation content (DocC catalogs) to avoid an explosion of documentation repositories.
For example, DocC, Swift Package Manager, Swiftly, and other projects have existing repositories to host documentation where the content is specific and tightly coupled to the code in those repositories.
Topic areas such as API guidelines, Swift server tutorials, or guides to setting up development tooling do not.

An exception to these guidelines of where to host content could be made where there's an overlap of code, especially testing and validation, with documentation.
Today, Swift projects basic support for validating code blocks written in Swift using DocC's feature snippets, but this capability doesn't extend beyond code written in Swift.
For some documentation efforts, such as Embedded Swift or C/C++ Interop, hosting the documentation closer to the code where example code can be tested and validated as well as included in Documentation is a useful exception to support tested-as-accurate and up-to-date content for the documentation.
This is also a place where Swift's documentation has some potential to expand in the future, supporting broader scenarios where more variety of code examples can be validated as well as included in formal documentation.

To support accurate documentation and a well-defined set of reviewers, align each DocC catalog with a Swift workgroup or steering group who can identify or provide relevant reviewers.
For example, API guidelines should be reviewed by people identified by the Language Steering Group, and Swift server tutorials can be reviewed by individuals nominated by the Swift Server workgroup.

Codify the available reviewers using GitHub's `CODEOWNERS` file to provide the concrete map of reviewers for the DocC catalogs, and use GitHub pull requests for the review process.

From each DocC Catalog, the intent is to build a DocC archive and publish it as a "static hosted site" to docs.swift.org. 
From swift.org, include links to these published archives and provide high-level organization on the swift.org website to enable click-through discoverability.

To support migration of content that exists as articles on Swift.org today, use Jekyll's `redirectTo` plugin, which is enabled on swift.org.
As articles are migrated, update the front matter (YAML metadata) for the article source on Swift.org to provide a seamless redirect to updated content locations after the content is migrated and hosted at a URL on docs.swift.org.

## Detailed Design

### Catalogs and reviewers

Create a single repository that hosts a set of DocC catalogs that provide documentation collected by broad use case (loosely thinking of this as a book of related content), and aligned to a workgroup or steering group to provide oversight and support review.

These documentation catalogs are meant to be separate from API reference documentation, so in DocC terms - they're primarily "bare" catalogs with only articles, or host articles and tutorials.
In particular, this isn't meant to provide hosting for API reference documentation for individual libraries or projects provided from Swift Packages, such as what is available through Swift Package Index.

Viewed from a "type" of documentation, for example referencing [diátaxis](https://diataxis.fr), the contents are meant to host [explanation](https://diataxis.fr/explanation/), [tutorials](https://diataxis.fr/tutorials/), and [how-to guides](https://diataxis.fr/how-to-guides/); not [reference](https://diataxis.fr/reference/) content.

Each catalog is associated with an existing workgroup or steering group, and with the expectation that this won't be an exceptionally large set of collections, the initial expected structure is largely flat.
If the documentation grows to where we find ourselves wanting to host significantly more collections, or the flat structure becomes unwieldy, we can shift to a more hierarchical structure.

The initial catalogs listed below are based on the existing content within `/documentation` at Swift.org,
but don't reflect all the possible future content we might create.

  - Swift language guides - moderated/reviewed by the Language Steering Group.
  - API guidelines - moderated/reviewed by the Language Steering Group.
  - Server guides - moderated/reviewed by the SSWG.
  - Ecosystem tools guides - moderated/reviewed by Ecosystem Steering Group.
  - Platform guides - moderated/reviewed by Platform Steering Group.

An example `tree` view of such a repository:

```
├── CODEOWNERS
├── common
│   ├── footer.html
│   ├── header.html
│   ├── README
│   └── theme-settings.json
├── ecosystem
│   ├── EcosystemTools.docc
│   │   ├── Documentation.md
│   │   ├── getting-started-with-vscode-swift.md
│   │   ├── zero-to-swift-emacs.md
│   │   └── zero-to-swift-nvim.md
├── platform
│   └── PlatformGuides.docc
│       └── Documentation.md
├── README.md
├── server
│   └── ServerGuides.docc
│       ├── building.md
│       ├── Documentation.md
│       └── testing.md
├── swift
│   ├── APIGuidelines.docc
│   │   ├── DocComment.md
│   │   ├── Documentation.md
│   │   ├── include-words-to-avoid-ambiguity.md
│   │   ├── name-according-to-roles.md
│   │   ├── omit-needless-words.md
│   │   └── weak-type-information.md
│   └── LanguageGuides.docc
│       ├── Documentation.md
│       └── value-and-reference-types.md
```

The directories for each catalog residing at the root can host another DocC catalog (a directory ending with .docc), to host the markdown content in a typical DocC fashion.
This also allows each catalog to also provide a Package.swift file, which is required today to enable support for DocC's feature Snippets, which validates that Swift code blocks compile.

Catalogs with associated code, such as API reference documentation, that heavily leverage snippets, or that provide examples, are better served when wrapped inside a Swift package.
These can also be hosted together in this repository, using the same "each directory owned/reviewed by a steering group" pattern, but are only relevant for packages that would never be used as a dependency.
Swift conventions dictate that a package intended to be used as a dependency needs to be hosted in its own git repository, making it more difficult to use in a monorepo-style configuration.

The steering group associated with a collection identifies who to include as reviewers for their catalogs.
This doesn't require them to directly be the reviewers, but to help identify and delegat the reviewers who approve content changes for each catalog.
From a mechanical perspective, reviewers are listed in a `CODEOWNERS` file, which uses the GitHub groups that Swift provides, or lists GitHub usernames individually.

For example, the structure of the catalogs above might line up to:

```
/swift/* @swiftlang/language-steering-group
/ecosystem/* @swiftlang/ecosystem-steering-group
/server/* @swiftlang/ecosystem-steering-group
/platform/* @swifting/platform-steering-group
```

If a group dissolves, any catalogs can be updated to associate them with another group, or revert them to control by the Swift Core Team.

New catalogs can be created at the request of the relevant steering group, published and referenced from the swift.org website with the coordination of the Website workgroup to provide links to the relevant content from the Swift.org website.
As new catalogs are created, the CODEOWNERS file is updated in sync to provide the relevant reviewers for the new content.

The repository may also include a directory or directories to support continuous integration and scripts that build the static DocC archives to host them on Swift project infrastructure.

Since this repository should generally reflect the state of all current documentation for the Swift project, it should also include a list of any other repositories that provide documentation that we want to host at docs.swift.org as part of the broader Swift project.
This data is intended to serve two purposes - to provide a list of where all the documentation exists, and to support programmatic solutions (scripts/continuous integration) to build all the relevant documentation content that is hosted on docs.swift.org.

### Migration strategy for existing "standalone" DocC catalogs

As Swift has grown organically, there are some pre-existing repositories that host documentation today.
While we want all future cross-cutting documentation to be collected together in a docs repository,
for the sake of expediency and migration, we likely want to support continuing to build documentation from a number of these pre-existing repositories:

#### The Swift Programming Language:

Content hosted from https://github.com/swiftlang/swift-book/, presented at https://docs.swift.org/swift-book/documentation/the-swift-programming-language/ and linked from swift.org is already well established, with reviewers and review processes.
In addition, the content in Swift.org presents links (hosted at https://www.swift.org/documentation/tspl/) to external translations of this content that should be preserved.

#### Swift Embedded:

The embedded Swift collaborators have assembled a DocC catalog in https://github.com/apple/swift-embedded-examples.

This DocC catalog is closely aligned with Swift code and projects in that repository.
This is an example where validation of examples, and a desire to maintain and evolve the content in close proximity with deeper code examples warrants its own repository.
Additionally, the number and breadth of examples are far more discoverable within a focused repository such as this provides.

#### Concurrency Migration Guide:

The content displayed at https://www.swift.org/migration/documentation/migrationguide/ is generated from a stand-alone DocC catalog in the repository https://github.com/swiftlang/swift-migration-guide.

There are legacy Swift language migration guides for earlier versions of Swift, hosted as articles within swift.org.
The newer migration guide hosts content examples in an associated Swift package. 
Like the Swift Embedded examples repository, it benefits from close proximity between examples and written content.

### Migrating Jekyll to DocC content in the Swift Docs Repository

Based on the existing content in Swift.org, the general goal is to migrate the majority of what is general documentation content into a DocC format, grouped into the collections below.

All of the listed markdown files would remain in `/documentation`, with their front matter (Jekyll metadata) updated to redirect the URL requests to the new locations as content is migrated and accepted into the new docs repository.
Markdown files prefixed with `_` are typically only included in other files and not referenced by URL, and can be removed after they are migrated.

## Initial Migration Plan

This proposal is primarily meant to provide a guide to the structure for content as we want to see it.
In the process of establishing this new repository and structure of DocC catalogs, the following initial files from swift.org will be updated (if needed) and migrated, to establish the initial structure.

Files to migrate under the `documentation` directory on Swift.org:

| `source` | status & destination |
| - | - | 
| [`api-design-guidelines/index.md`](https://www.swift.org/documentation/api-design-guidelines/) | translate to docc, break into multiple articles in `api-guidelines/APIGuidelines.docc` |
| [`server/index.md`](https://www.swift.org/documentation/server/index.html) | deprecate & redirect to https://www.swift.org/get-started/cloud-services/ |
| [`server/guides/index.md`](https://www.swift.org/documentation/server/guides/index.html) | translate, migrate to top level of `server-guides/ServerGuides.docc` |
| [`server/guides/building.md`](https://www.swift.org/documentation/server/guides/building.html) | refine/update to provide examples of building, add section for debug vs. release and swift tooling, link to SwiftPM docs on building, add section about building in Linux using containers, add section on building with devContainers, add detail on static linux SDK, break out some content to a CI related article |
| [`server/guides/testing.md`](https://www.swift.org/documentation/server/guides/testing.html) | quite dated - update to swift 6, swift-testing, break out some content into a "CI" focused article - focus on unit testing, leave room for functional, integration testing as sep articles |
| [`articles/static-linux-getting-started.md`](https://www.swift.org/documentation/articles/static-linux-getting-started.html) | migrate as is  - consider renaming or breaking into multiple, smaller focused articles, review any changes with previous authors (Alastair, Melissa) |
| [`articles/value-and-reference-types.md`](https://www.swift.org/documentation/articles/value-and-reference-types.html) | migrate content into `swift/LanguageGuides`|
| [`concurrency/index.md`](https://www.swift.org/documentation/concurrency/index.html) | redirect to content at https://www.swift.org/migration/documentation/|  |swift-6-concurrency-migration-guide/enabledataracesafety |
| [`articles/zero-to-swift-nvim.md`](https://www.swift.org/documentation/articles/zero-to-swift-nvim.html) | migrate into `ecosystem/EcosystemTools.docc` |
| [`articles/zero-to-swift-emacs.md`](https://www.swift.org/documentation/articles/zero-to-swift-emacs.html) | migrate into `ecosystem/EcosystemTools.docc` |
| [`articles/getting-started-with-vscode-swift.md`](https://www.swift.org/documentation/articles/getting-started-with-vscode-swift.html) | migrate into `ecosystem/EcosystemTools.docc` |
| [`articles/wasm-getting-started.md`](https://www.swift.org/documentation/articles/wasm-getting-started.html) | translate and migrate into `ecosystem/WASM.docc` |

The Swift.org [documentation page](https://www.swift.org/documentation/) will be updated to point to these new DocC catalogs as the content migrates, to provide a way to navigate to the relevant content from swift.org.
The navigability between DocC collections and integration of those collections into the broader design constraints for swift.org are being dealt with separately, as part of the Swift.org redesign efforts, and beyond the immediate scope of this proposal.

As mentioned above, the metadata for the earlier pages will remain on Swift.org for some time, with the stubs of those articles being updated to provide HTML redirects for legacy URLs to the new location once the updated content is published using the DocC catalog.

### Remaining Swift.org documentation content

A full migration needs to be coordinated with relevant groups, and proceed incrementally as the availability of the community and relevant workgroups allow.
The migration process itself will be tracked by pull requests and within an issue or issues housed at https://github.com/swiftlang/swift-org-website/, and potentially moved to a new docs repository.

- documentation/cxx-interop/index.md (Doug Gregor indicated a desire to reset and migrate this content into the Swift repository in the future)
- documentation/cxx-interop/safe-interop/index.md
- documentation/cxx-interop/project-build-setup/index.md
- documentation/cxx-interop/status/index.md
- documentation/articles/wrapping-c-cpp-library-in-swift.md
- documentation/continuous-integration/index.md
- documentation/core-libraries/index.md
  - documentation/core-libraries/_foundation.md
  - documentation/core-libraries/_libdispatch.md
  - documentation/core-libraries/_swift-testing.md
  - documentation/core-libraries/_xctest.md
- documentation/package-manager/index.md (currently redirects to https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)
- documentation/tspl/index.md
- documentation/lldb/index.md
  - documentation/lldb/_playground-support.md
- documentation/migration-guide-swift3/index.md
  - documentation/migration-guide-swift3/_migration-guide.md
  - documentation/migration-guide-swift3/se-0107-migrate.md
- documentation/migration-guide-swift4/index.md
  - documentation/migration-guide-swift4/_migration-guide.md
- documentation/migration-guide-swift4.2/index.md
  - documentation/migration-guide-swift4.2/_migration-guide.md
- documentation/migration-guide-swift5/index.md
  - documentation/migration-guide-swift5/_migration-guide.md
- documentation/source-code/index.md
- documentation/source-compatibility/index.md
- documentation/server/guides/memory-leaks-and-usage.md
- documentation/server/guides/allocations.md
- documentation/server/guides/linux-perf.md
- documentation/server/guides/performance.md
- documentation/server/guides/llvm-sanitizers.md
- documentation/server/guides/packaging.md
- documentation/server/guides/packaging.md
- documentation/server/guides/passkeys.md
- documentation/server/guides/libraries/log-levels.md
- documentation/server/guides/libraries/concurrency-adoption-guidelines.md
- documentation/server/guides/deployment.md
- documentation/server/guides/deploying/aws-sam-lambda.md
- documentation/server/guides/deploying/aws-copilot-fargate-vapor-mongo.md
- documentation/server/guides/deploying/aws.md
- documentation/server/guides/deploying/aws.md
- documentation/server/guides/deploying/digital-ocean.md
- documentation/server/guides/deploying/ubuntu.md
- documentation/server/guides/deploying/heroku.md
- documentation/server/guides/deploying/gcp.md
- documentation/swift-compiler/index.md
  - documentation/swift-compiler/_compiler-architecture.md
- documentation/standard-library/index.md
  - documentation/standard-library/_preview-package.md
  - documentation/standard-library/_stdlib-design.md

## Alternatives Considered

### Don't use DocC for cross-cutting collections

For content that's aligned with repositories in `swiftlang` - Swift tooling or libraries - migrate any existing tooling to the relevant repository to consolidate to a single source of truth. For cross-cutting articles, add additional pages to provide organization on the swift.org website, and curate the organization with manual links.

Continue to grow articles using Jekyll (markdown, with additional front-matter/metadata) using pull requests to swift-org-website. Identify reviewers on an as-needed basis for new content as it is proposed or updated.

The obvious upside is that the structure could be "more directories" and some structure (in Jekyll/markdown) to present the pages and provide organization.

The downsides:

- Jekyll is different from DocC markdown, sometimes subtle so, and as such presents "paper cuts" to getting content out there for users already familiar with Swift documentation tooling. We don't aggressively use Jekyll short-codes or plugins in most of the current content - although some articles definitely have (the API guidelines). Additionally, getting the environment set up to preview and verify you've got markup correctly established is notably tricky.

- DocC provides a Swift-aligned, familiar structure, including affordances like quicknav and an article Table of Content on the side (depending on viewing width). The structure is reasonably well defined, laying out into a clear hierarchical format by default. Jekyll, in comparison, requires the Author to provide and constantly maintain any structure even between pages and if they're hierarchical vs. spaghetti, and so on.

- The process of finding reviewers and enabling reviews for content is heavily reliant on reviewers in the website workgroup to find and source reviews. This could be significantly streamlined by delegating it to steering groups (or delegated workgroups from a steering group) aligned with the content. Breaking the collected files out into a separate repository and having clearly defined reviewers for catalogs could significantly reduce the friction of getting updates and content available.

### Multiple Repos

Instead of using a mono-repo layout that collects catalogs, create a repository per catalog. This follows the pattern of what exists today with the repositories https://github.com/apple/swift-migration-guide, https://github.com/apple/swift-embedded-examples, and https://github.com/swiftlang/swift-book/. Each repository could have its own set of reviewers and committers, aligned with their steering groups.

The downside of this scenario is that this could represent a notable growth of repositories, and finding the relevant content would be notably less obvious than a single location. Additionally, some of these repositories would be quite thin - containing relatively little content for the overhead of maintaining a repository.

The proposed catalogs don't currently have a need to provide examples (or related source code) as a part of what they present.

Because this content doesn't have the constraint of Swift packages, which expect a single package per repository, these repositories can be presented more compactly as a mono-repo style configuration.

## Future Directions

The Swift compiler has a `userdocs` directory now, that is starting to see information specific to the compiler, and building out more detail for how the compiler works, LLDB, and the related driver pieces would be excellent additions. That's new content rather than existing migration work for the most part.

The Swift-Java interop project could easily warrant its own docc catalog, or potentially be included in a more generic "Swift Language interop" collection. Today the majority of existing content is focused on C/C++ Interop, although that's a place where there could be significant growth.
