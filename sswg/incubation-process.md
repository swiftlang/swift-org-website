---
layout: new-layouts/base
title: SSWG Incubation Process
---

## Overview

As described on [the server page](/documentation/server), the goal of the Swift Server Work Group (SSWG) is to create a robust, healthy ecosystem for server application development with Swift. One avenue to achieve this goal is to encourage the development of high quality, well maintained libraries and tools that the community can comfortably lean on.

The difference between the SSWG and the Swift Evolution process is that server-oriented libraries and tools that are produced as a result of work group efforts will exist outside of the Swift language project itself, and they will be distributed across different code bases.

The teams at Apple and Vapor have engineers that will actively participate in the development of such libraries and tools, and we would love to see the community joining in this effort. To that end, the work group defined and launches an incubation process where *anyone* can pitch, propose, develop, and contribute to such libraries and tools.

The incubation process is designed to help nurture and mature projects ensuring standardization, quality, and longevity. It also seeks to increase the visibility of ideas, experiments, or other early work that can add value to the SSWG mission.
The following document details this incubation process.
The SSWG [steering group](/documentation/server/) has a similar role to the Swift Core Team and will make the final decision on moving pitches/proposals through the incubation process based on the feedback of the community.
Just like for Swift Evolution, pitches and proposals can be made by anyone, being part of the SSWG steering group is absolutely not a requirement.

## Process

Incubation is made of the following stages: **Pitch**, **Proposal**, **Development**, and **Recommendation**.
The Development stage is where the majority of incubation take place.
The SSWG will maintain a public "Swift Server Ecosystem" index page that will list all recommended tools and libraries as well as projects that are part of the incubation process and their respective incubation level.

### Pitch

Pitches are an introduction to an idea for a new library or tool.
They can also introduce ideas for new features or changes to existing tools.
Pitches are used to collect feedback from the community and help define the exact scope of a project prior to writing code.
They should demonstrate how they align with the SSWG's goals to improve Swift on the server.
Pitches are submitted by creating a new thread in the Swift Server forum area.

### Proposal

For a pitch to be moved into the Proposal stage, it must be endorsed by at least two members of the SSWG.
The scope of the proposed code needs to closely align with the endorsed Pitch and it is subject to review based on the SSWG graduation criteria defined below.

Proposals are submitted to the SSWG by creating a PR that adds the proposal document to the [proposal directory](https://github.com/swift-server/sswg/tree/main/proposals). Proposals follow [a template](https://github.com/swift-server/sswg/blob/main/proposals/0000-template.md) and include the following information:

* Name (must be unique within SSWG)
* Description (what it does, why it is valuable, origin, and history)
* Statement on alignment with SSWG mission
* Preferred initial maturity level (see SSWG Graduation Criteria)
* Initial committers (how long working on project)
* Link to source (GitHub by default)
* External dependencies (including licenses)
* Release methodology and mechanics
* License (Apache 2 by default)
* Issue tracker (GitHub by default)
* Communication channels (slack, irc, mailing lists)
* Website (optional)
* Social media accounts (optional)
* Community size and any existing sponsorship (optional)

Once a proposal PR is submitted, the SSWG will assign a review manager during it's bi-weekly meeting.
The review manager responsibilities include:

* Review the PR
  * Validate structure and language.
  * Make sure the implementation is in place.
* Update the PR
  * Assign a number.
  * Assign a review manager.
  * Set status to "Active Review + Date range for review"
* Secure approval from the PR author to merge changes above and merge them.
* Publish a forum post in the [server proposals area](https://forums.swift.org/c/server/proposals) soliciting feedback from the community.
* Watch the forum thread for conduct or off-topic issues, and make sure author is engaged.
* Once the review period is over, summarize the key takeaways to the SSWG in writing.

The SSWG votes on pending proposals on a bi-weekly cadence, with the goal of voting on at least two proposals per month.

After the vote, the review manager will:
1. Announce the vote results in the review thread.
1. Update the Proposal's status based on the vote result.
1. Close the review thread.

### Graduation Criteria

Every SSWG project has an associated maturity level: **Sandbox**, **Incubating**, or **Graduated**.
Proposals should state their preferred initial maturity level, and the SSWG will take a vote to decide on the actual level.

A **supermajority** (two-thirds) is required for a project to be accepted as Incubating or Graduated.
If there is not a super-majority of votes to enter at the Graduated level, then the votes toward Graduated are recounted as votes to enter at the Incubating level.
If there is not a super-majority of votes to enter at the Incubating level, then all votes are recounted as **sponsorship** to enter at the Sandbox level.
If there are not at least two sponsors, the Proposal is rejected.

#### Sandbox Level

To be accepted at the Sandbox level, a project must meet the [SSWG minimal requirements](#minimal-requirements) detailed below and be endorsed by at least two SSWG sponsors.

Early adopters should treat early stage projects with extra care.
While Sandbox projects are safe to try out, it is expected that some projects may fail and never move to the next maturity level.
There is no guarantee of production readiness, users, or professional level support.
As such, users must exercise their own judgment.

#### Incubating Level

To be accepted at Incubating level, a project must meet the Sandbox level requirements plus:

* Document that it is being used successfully in production by at least two independent end users which, in the SSWG judgement, are of adequate quality and scope.
* Must have 2+ maintainers and/or committers. In this context, a committer is an individual who was given write access to the codebase and actively writes code to add new features and fix any bugs and security issues. A maintainer is an individual who has write access to the codebase and actively reviews and manages contributions from the rest of the project's community. In all cases, code should be reviewed by at least one other individual before being released.
* Packages must have more than one person with admin access. This is to avoid losing access to any packages. For packages hosted on GitHub and GitLab, the packages must live in an organization with at least two administrators. If you don't want to create an organization for the package, you can host them in the [Swift Server Community](https://github.com/swift-server-community) organization.
* Demonstrate an ongoing flow of commits and merged contributions, or issues addressed in timely manner, or similar indication of activity.
* Receive a super-majority vote from the SSWG to move to Incubation stage.

#### Graduated Level

To be accepted at Graduated level, a project must meet the [SSWG graduation requirements](#graduation-requirements) detailed below, plus:

* Document that it is being used successfully in production by at least three independent end users which, in the SSWG judgement, are of adequate quality and scope.
* Have committers and maintainers, as defined above, from at least two organizations.
* Receive a super-majority vote from the SSWG to move to Graduation stage.

## Process Diagram

![process diagram](/assets/images/sswg/incubation.png)

### Ecosystem Index

All projects and their respective levels will be listed on the [Swift Server Ecosystem Index](/documentation/server/#projects).
In cases where more than one project solves a particular problem (e.g., two similar database drivers), they will be ordered by popularity.
The SSWG reserves the right to define a singular solution for critical building blocks, such as Logging or Metrics APIs, where consistency across the ecosystem is of a critical nature.

It is recommended for projects that have been accepted to any of the maturity levels to list the maturity level in their project's README with the appropriate badge as defined:

[![sswg:sandbox](https://img.shields.io/badge/sswg-sandbox-lightgrey.svg)](https://swift.org/sswg/incubation-process.html#sandbox-level){: style="display: inline-block; width: 94px; height: 20px"}
[![sswg:incubating](https://img.shields.io/badge/sswg-incubating-blue.svg)](https://swift.org/sswg/incubation-process.html#incubating-level){: style="display: inline-block; width: 104px; height: 20px"}
[![sswg:graduated](https://img.shields.io/badge/sswg-graduated-green.svg)](https://swift.org/sswg/incubation-process.html#graduated-level){: style="display: inline-block; width: 104px; height: 20px"}

The SSWG will meet every 6 months to review all projects, and it reserves the right to demote, archive, or remove projects that no longer fulfill minimal requirements.
For example, a Graduated project that no longer receives regular updates or fails to address security concerns in timely fashion. Similarly, the SSWG reserves the right to remove or archive Pitches and Proposals that no longer receive updates.

Changes to the Swift Server Ecosystem index page will be announced by the SSWG using the Swift Server forums.

## Minimal Requirements

* General
  * Has relevance to Swift on Server specifically
  * Publicly accessible source managed by an SCM such as github.com or similar
    * Prefer to use `main` as the default branch name, in line with [Swift's guidelines](https://forums.swift.org/t/moving-default-branch-to-main/38515)
  * Adopt the [Swift Code of Conduct](/community/#code-of-conduct)
* Ecosystem
  * Uses SwiftPM
  * Integrated with critical SSWG ecosystem building blocks, e.g., Logging and Metrics APIs, SwiftNIO for IO
* Longevity
  * Must be from a team that has more than one public repository (or similar indication of experience)
  * SSWG should have access / authorization to graduated repositories in case of emergency
  * Adopt the [SSWG Security Best Practices](/sswg/security/)
* Testing, CI and Release
  * Have unit tests for Linux
  * CI setup, including testing PRs and the main branch
  * Follow semantic versioning, with at least one published pre-release (e.g. 0.1.0, 1.0.0-beta.1) or release (e.g. 1.0.0)
* Licensing
  * Apache 2, MIT, or BSD (Apache 2 recommended)
* Conventions and Style
  * Adopt [Swift API Design Guidelines](/documentation/api-design-guidelines/)
  * Follow [SSWG Technical Best Practices](#technical-best-practices) when applicable.
  * Prefer to adopt code formatting tools and integrate them into the CI

## Graduation Requirements

* [Minimal Requirements](#minimal-requirements)
* Have stable API (no pending/planned breaking API changes), with at least one published major release (e.g. 1.0.0)
* Support new GA versions of Swift within 30d
* CI setup for two latest Swift.org recommended versions of Swift
* CI setup for at least one of Swift.org recommended Linux distributions
* CI setup for each platform supported by the library or tool
* Unit tests for both macOS and Linux
* Use Swift.org docker images, when appropriate
* Documented release methodology
* Documented support strategy for at least one previous major version.
* Explicitly define a project governance and committer process, ideally laid out in a GOVERNANCE.md file and OWNERS.md files respectively
* Include list of adopters for at least the primary repo ideally laid out in an ADOPTERS.md files or logos on the project website
* Optionally, have a [Developer Certificate of Origin](https://developercertificate.org) or a [Contributor License Agreement](https://en.wikipedia.org/wiki/Contributor_License_Agreement)

## Security

Please follow the guidance laid out in the [Security](/sswg/security) section.

## Technical Best Practices

* Prefer native Swift over C wrapping, where appropriate
* Concurrency / IO
  * Packages should be non-blocking (w/ async API) unless not possible (blocking C libs, etc)
  * There should be as little (preferably no) wrapping of NIO as possible. Exposing NIO types directly will go a long way for making packages compatible.
  * Blocking code should be wrapped in [NIOThreadPool](https://swiftpackageindex.com/apple/swift-nio/2.48.0/documentation/nioposix/niothreadpool) (like Vapor's SQLite package)
* Uses force unwraps and force tries only as preconditions, ie. conditions that the programmer regards as impossible or programmer error. All force tries/unwraps should come with a comment stating the reasons
* Does not use `*Unsafe*` unless interfacing with C
  * Exceptions to uses of `*Unsafe*` constructs are acceptable when appropriately documented why they are absolutely necessary.
  * When `*Unsafe*` is used in this manner, its is expected to be accompanied by enhancement request tickets for the root cause in Swift, SwiftNIO, or a different offending library.
* Avoid using `fatalError` to deal with error cases, design APIs that `throws` or return `Result` instead.


## Change Management

Changes to the incubation process must be documented and published publicly and are subject to semantic versioning schema:

* Major: Represents a deeper change in approach or workflow
* Minor: Small change in concepts or nomenclature.

Updates resulting in a version bump require a super-majority vote from the SSWG. Trivial changes, such as fixing typos or formatting, do not require a version bump.


## Resources and References

- [Incubated packages](/sswg/incubated-packages.html)
* [Swift Evolution](https://www.swift.org/swift-evolution/)
* [CNCF Project Lifecycle & Process](https://github.com/cncf/toc/tree/main/process)
* [The Apache Incubator](https://incubator.apache.org)
