
Swift can be used on different platforms. The information below documents the current level of support for each platform.

Each Swift platform is categorized based two categories:

* **[Deployment and Development](#deployment-and-development)**: Swift programs can be built to run on this platform and the development tools for Swift — such as the Swift compiler — also run on this platform.

* **[Deployment-only](#deployment-only)**: Swift programs can be built to run on this platform, but the development tools themselves that build those programs may not themselves run on this platform.

The current set of supported platforms for development and deployment are described below.

### Deployment and Development

These are the platforms one can use for Swift's development tools. This table shows which platforms you can target when the tools are used on a given platform.  For example, the tools on macOS can build Swift applications that run on iOS.

| Platform running development tools     | Deployable targets            |
|:--------------------------------------:|:-----------------------------:|
| **macOS**                              |  Apple platforms              |
| **Ubuntu**                             |  Ubuntu                       |
| **CentOS**                             |  CentOS                       |
| **Amazon Linux**                       |  Amazon Linux                 |
| **Red Hat Universal Base Image**       |  Red Hat Universal Base Image |
| **Windows**                            |  Windows                      |

#### Minimum deployment version

This table shows the minimum OS version for which a Swift application can be deployed.  For example, a Swift application can run on iOS 7.0 or later, but not iOS 6.

| Platform running Swift application | Minimum deployment version |
|:----------------------------------:|:--------------------------:|
| **macOS**                          |10.13                       |
| **iOS**                            |11.0                        |
| **watchOS**                        |4.0                         |
| **tvOS**                           |11.0                        |
| **Ubuntu**                         |18.04                       |
| **CentOS**                         |7                           |
| **Amazon Linux**                   |2                           |
| **Red Hat Universal Base Image**   |9                           |
| **Windows**                        |10.0                        |

#### Development Tools

The Swift compiler and debugger run on platforms supporting development.  Support for the Swift Package Manager and [SourceKit-LSP] are currently supported on most, but not all platforms that support the tools.  This table provides the current breakdown of what tools are available on what platforms.

| Platform running development tools | [Swift Package Manager]| [SourceKit-LSP]|
|:----------------------------------:|:----------------------:|:--------------:|
| **macOS**                          | ✓                      | ✓              |
| **Ubuntu**                         | ✓                      | ✓              |
| **CentOS**                         | ✓                      | ✓              |
| **Amazon Linux**                   | ✓                      | ✓              |
| **Red Hat Universal Base Image**   | ✓                      | ✓              |
| **Windows**                        | ✓                      | ✓              |

### Deployment-only

Each platform that supports running Swift applications is required to provide documentation for getting started. The documentation should contain information for installing Swift, using the REPL, using the Swift Package Manager and using the Debugger. Every platform is expected to have core runtime, Standard Library support, and core libraries, except where explicitly documented otherwise.

The table below list the available capabilities on each platform for running Swift applications:

| Platform running Swift application | Debugger| REPL|
|:---------------------------------:|:-------:|:---:|
| **macOS**                         | ✓       | ✓   |
| **iOS**                           | ✓       |     |
| **watchOS**                       | ✓       |     |
| **tvOS**                          | ✓       |     |
| **Ubuntu**                        | ✓       | ✓   |
| **CentOS**                        | ✓       | ✓   |
| **Amazon Linux**                  | ✓       | ✓   |
| **Red Hat Universal Base Image**  | ✓       | ✓   |
| **Windows**                       | ✓       | ✓   |

## Platform Owners

Support for developing and running Swift applications on various platforms is supported by different members of the Swift open source community.  Each platform has a champion, called a *platform owner*, that acts as the primary steward of maintaining support for a given platform.

Platform owners help facilitate contributors to the Swift project to collaborate and continue to work towards progressing a given platform. These individuals would also be able to guide porting specific changes on the platform. Platform owners have sections on [forums.swift.org](https://forums.swift.org) and meet bi-weekly to discuss active development and open issues on the platform.

### Current Platform Owners

|                      | Getting Started                     | Toolchain Provider                                | Pull Request Testing Required|
|:--------------------:|:-----------------------------------:|:-------------------------------------------------:|:----------------------------:|
| **Apple platforms**  | [Docs](/getting-started/#on-macos)  | [Apple Inc.](https://www.apple.com)               | ✓                            |
| **Linux**            | [Docs](/getting-started/#on-linux)  | [Apple Inc.](https://www.apple.com)               | ✓                            |
| **Windows**          | [Docs](/getting-started/#on-windows)| [Saleem Abdulrasool](https://github.com/compnerd) | ✓                            |

* Apple platforms includes macOS, iOS, tvOS, and watchOS.
* Linux includes Ubuntu, CentOS, Amazon Linux and Red Hat Universal Base Image platforms.

### Continuous Integration for Platforms

Continuous integration is a critical aspect of maintaining the health of the Swift project.  Pull requests support (and for officially supported platforms) require builds and test to pass prior to the pull request being merged.

Pull request testing hardware for a given platform are provided by various members of the community.  Platform owners are responsible for monitoring continuous testing for main and release branch on Swift Community-Hosted CI or separate continuous integration systems. Platform owners are responsible for providing or securing the hardware to support continuous testing on Swift Community-Hosted CI.

### Code Signature for Downloadable Builds

Platform owners will build and sign the toolchain before providing it to Apple. Apple will then re-sign the toolchain under [swift.org](/) certificate and distribute it on the website. The builds will only be re-signed if they are not built by Apple. There will be random audits to validate the signatures between both the platform owners and Apple.

### Platform Review

Swift community members can propose adding new platforms to the tables by requesting a review on forums.swift.org. The Swift Core team will review such proposals.

[Swift Package Manager]: https://github.com/apple/swift-package-manager
[IndexStoreDB]: https://github.com/apple/indexstore-db
[SourceKit-LSP]: https://github.com/apple/sourcekit-lsp
[LLBuild]: https://github.com/apple/swift-llbuild
