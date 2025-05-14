---
layout: page
title: Ecosystem Steering Group
---

The Ecosystem Steering Group fosters a flourishing Swift package and tooling
ecosystem. The Ecosystem Steering Group's primary goal is to **encourage and
streamline development of new packages and evolution of existing packages that
are fundamental to the Swift ecosystem and broadly used across platforms such as
`swift-foundation`**. The group will work toward this goal by providing
development tools and actionable guidance for Swift package authors and clients.
Specifically, the Ecosystem Steering Group will:

- work with the Swift Core Team to define a roadmap for developer experience
  improvements and growing the package ecosystem,
- work with the Platforms Steering Group to improve the experience of setting up
  a Swift development environment on all supported platforms,
- work with the Language Steering Group to create resources on best practices
  for effective use of Swift in packages, such as adopting strict concurrency
  checking or other new language features, or adopting tools such as the API
  checker to facilitate source-stable package evolution, define and facilitate an
  evolution process for new tools (or features of existing tools) for producing
  and consuming Swift packages, adopting best practices (e.g. through linters and
  formatters), etc, and
- provide practical guidance to package authors on how to maintain and evaluate
  the efficacy of their packages.

## Membership

The Ecosystem Steering Group is made up of Swift community members with a
variety of backgrounds, including (but not limited to) involvement in key Swift
libraries, engineering experience with developer tools such as IDEs or CI
systems, or experience in software supply chain. The Swift Core Team is solely
responsible for the membership of the steering group and may add or remove
members as it sees fit.

The Core Team selects one member of the steering group as the chair. The chair has no
special authority over the steering group, but they are responsible for ensuring its
smooth functioning, including by:

- organizing and leading regular meetings,
- ensuring that the workgroup communicates effectively with the community, and
- coordinating meetings between workgroup representatives and other Swift
  workgroups or teams when necessary.

The current members of the Ecosystem Steering Group are:

- David Cummings [@daveyc123](https://github.com/daveyc123)
- Franz Busch, Chair [@FranzBusch](https://github.com/FranzBusch)
- Mikaela Caron [@mikaelacaron](https://github.com/mikaelacaron)
- Mishal Shah, Core Team Representative [@shahmishal](https://github.com/shahmishal)
- Tim Condon [@0xTim](https://github.com/0xTim)
- Tina Liu [@itingliu](https://github.com/itingliu)


# Decision making

The Ecosystem Steering Group is commissioned by the Swift Core Team to make
decisions on its behalf, and it typically works autonomously, with a goal of
reaching consensus within the steering group whenever possible. Final
decision-making authority about all ecosystem evolution topics rests with the
Core Team.

Specific responsibilities in this capacity include:

- Evaluating and deciding on the inclusion of new libraries into the official
  Swift project, ensuring alignment with established Swift project principles
  and overall ecosystem strategy.
- Ensuring the continuity and health of packages within the Swift project; this
  includes identifying successor maintainers or alternative solutions if a
  project package becomes unmaintained or vacated.
- Providing oversight and guidance for official ecosystem libraries, intervening
  with checks and balances if their development trajectory becomes
  counterproductive to the broader goals or health of the Swift ecosystem.

# Evolution

The Ecosystem Steering Group has purview over a number of areas.
Areas not covered are discussed [later](#areas-not-covered). The areas covered
are:

- SwiftPM dependency management features and specifications for package services
- Build systems, including the current native SwiftPM build system, swift-build,
  and llbuild and its variants
- Tooling related to maintaining packages such as `swift-format`
- Tooling related to documentation
- Tooling related to code editing including IDE/editor integration
- Tooling and documentation for continuous integration and deployment
- Tooling and packages related to testing
- `swift-foundation`

Proposals or vision documents that intersect with platform specific behavior
will be reviewed in collaboration with the Platform Steering Group.

## Areas not covered

Evolution authority of the Ecosystem Steering Group does not extend to:

- The language or the standard library
- The selection of low-level tools that are used by the build system on a
  per-platform basis
- The default invocation of low-level tools by the build system
- The debugger
- The linker
- Libraries, such as the sanitizers

All of these are under the purview of the Language Steering Group or Platform
Steering Group.

# Workgroups

While the Ecosystem Steering group has purview over various areas that
contribute to a flourishing and healthy ecosystem. Some of those areas are
already covered by existing workgroups that will fall under the governance of
the Ecosystem Steering group. This includes:

- [The Server Workgroup](/sswg/)
- [The Documentation Workgroup](/documentation-workgroup/)
- [The Foundation Workgroup](/foundation-workgroup/)
- [The Testing Workgroup](/testing-workgroup/)

## Workgroup authority

These workgroups are the domain experts in their respective areas; hence, the
authority is with the respective workgroups. Currently, the Foundation workgroup
has the authority over swift-foundation and swift-corelibs-foundation. The
Testing workgroup has authority over swift-testing and swift-corelibs-xctest.

Not all changes to these libraries undergo the Swift evolution process, and some
workgroups do not have a clear evolution process. The Ecosystem Steering Group
will work with all existing and future workgroups together with the contributor
experience workgroup to establish a definition of what exactly is under
evolution and that all workgroups are following an aligned evolution process.

## New workgroups

To ensure coverage of all areas outlined in the 'Evolution' section, the
Ecosystem Steering Group intends to establish new workgroups that are not
currently overseen by an existing workgroup. Consistent with the model for
existing workgroups, these new workgroups will then be responsible for driving
the evolution of their respective projects and focus areas, fostering
specialized expertise and community engagement within those domains.

## Workgroup collaboration

The Ecosystem Steering Group is going to foster collaboration among its overseen
workgroups, ensuring they communicate effectively to build a cohesive ecosystem
narrative and align on strategic goals. Crucially, it serves as a vital conduit,
relaying the collective needs, progress, and challenges of these workgroups
to the Core Team and other Swift steering groups, while also ensuring workgroups
are informed of broader project directions and decisions.

# Communication

The Ecosystem Steering Group communicates with the community primarily using the
[Ecosystem](https://forums.swift.org/c/ecosystem/120) category on the Swift forums. It may also prepare special
posts for the Swift Blog.

Furthermore, the Ecosystem Steering Group intends to establish a well defined
communication process between itself and its workgroups that fosters close
collaboration and synergetic effects. Additionally, this communication process
is used to inform the other steering groups and the core team about the needs
and challenges in the ecosystem.

# Ecosystem Evolution process

Existing workgroups that fall under the governance of the Ecosystem Steering
Group may already run evolution processes. The Ecosystem Steering Group intends
to established an aligned evolution process for all areas under its purview
together with the existing workgroups, the contributor experience workgroup, and
the platform and language steering groups. The goal is to have a clear
definition for each area that covers:

- What packages or libraries are under evolution?
- What APIs or CLI arguments are under evolution?
- Is the evolution delegated to a specific workgroup?
- Where does the evolution process run?

# Community participation

The Ecosystem Steering Group is not separate from the Swift community. Steering
Group members participate in ecosystem evolution discussions and propose changes
just like any other member of the community. When the Steering Group develops a
new idea about a proposal in the course of its internal deliberations, a
Steering Group member is expected to bring that idea to the community for
discussion before the review is considered complete.

Proposals or feedback about the Swift ecosystem, the Ecosystem Evolution
process, a specific Ecosystem Evolution proposal, or any other topic under the
purview of the Ecosystem Steering Group are always welcome. The primary way to
communicate with the Ecosystem Steering Group is simply to post in the Evolution
category on the Swift forums, either by adding a reply to an existing review,
pitch, or other discussion thread, or by creating a new thread in [Evolution >
Discussion](https://forums.swift.org/c/evolution/discuss) or [Evolution >
Pitches](https://forums.swift.org/c/evolution/pitches). Community members may
also reach out privately to members of the Ecosystem Steering Group by private
message on the forums using `@ecosystem-steering-group`.

The Ecosystem Steering Group follows the [Swift Code of
Conduct](/code-of-conduct/). Instances of abusive,
harassing, or otherwise unacceptable behavior may be reported by contacting the
Steering Group chair or a member of the Swift Core Team or by flagging the
behavior for moderation, whether you are the target of that behavior or not.