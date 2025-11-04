---
layout: page
title: Build and Packaging Workgroup
---

## Charter

The Build and Packaging Workgroup is a team that represents the build and packaging community in the Swift ecosystem.

The Build and Packaging Workgroup will:

* Support and guide efforts that address the build and packaging needs of the Swift community
* Actively guide development of the flagship build and packaging tooling that is included within the Swift project, such as the [Swift Package Manager](https://github.com/swiftlang/swift-package-manager), [Swift Build](https://github.com/swiftlang/swift-build), and [llbuild](https://github.com/swiftlang/swift-llbuild)
* Plan and guide improvements to package dependency resolution
* Encourage development of Swift integrations in existing build and packaging systems that are outside of the Swift project (e.g. CMake, Bazel)
* Encourage development of build tooling for cross-platform installation and deployment of packages
* Enable the growth of a cohesive Swift package ecosystem through improved tooling
* Channel feedback to the [Ecosystem Steering Group](/ecosystem-steering-group) about the needs of the Swift community.
* Regularly update the Swift community on the status of ongoing build and packaging efforts

Current Members of the Build and Packaging Workgroup are:

{% assign people = site.data['build-and-packaging-workgroup'].members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
, {{ person.affiliation }}
{% endif %}
{% if person.handle %}
(<a href="https://forums.swift.org/u/{{person.handle}}/summary">@{{person.handle}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>

The main goal of the Build and Packaging Workgroup is to deliver a great build and packaging experience for the Swift community. To that end, the workgroup will develop tooling like the [Swift Package Manager](https://github.com/swiftlang/swift-package-manager), [Swift Build](https://github.com/swiftlang/swift-build), and [llbuild](https://github.com/swiftlang/swift-llbuild), collaborate with other Swift community groups in areas which intersect with builds and packaging, work with the community to support tooling outside the Swift project, and provide feedback on relevant evolution pitches and proposals.

Members of the Build and Packaging Workgroup serve at the discretion of the [Ecosystem Steering Group](/ecosystem-steering-group).

When necessary, the working group collaborates with other Swift community groups to pursue related improvements in their areas. Some areas of frequent collaboration with other groups and maintainers include:

* The swift test subcommand of swift-package-manager with the [Testing workgroup](/testing-workgroup)
* Build system/editor integration in [SourceKit-LSP](https://github.com/swiftlang/sourcekit-lsp) and [vscode-swift](https://github.com/swiftlang/vscode-swift) with the respective maintainers
* Cross-platform builds support with the respective workgroups and [Platform Steering Group](/platform-steering-group)

Decisions about how components of the Swift toolchain itself are built and distributed fall outside the workgroup’s charter.

## Communication

The Build and Packaging workgroup uses the [Swift forums](https://forums.swift.org) for general discussions. It can also be contacted privately by messaging [@build-and-packaging-workgroup](https://forums.swift.org/g/build-and-packaging-workgroup) on the Swift Forums.

## Meetings

The Build and Packaging Workgroup meets biweekly. Meetings take place in even numbered weeks, unless otherwise communicated in advance.

Many workgroup meetings are meant for open discussion and any Swift community member may attend by sending a message to [@build-and-packaging-workgroup](https://forums.swift.org/g/build-and-packaging-workgroup) beforehand to request an invite. Some meetings are reserved for private discussion by group members.

## Membership

Membership in the Build and Packaging Workgroup is contribution-based and expected to evolve over time. Workgroup members vote to nominate new members to the [Ecosystem Steering Group](/ecosystem-steering-group) for approval. Nomination votes by the workgroup must be unanimous. The [Ecosystem Steering Group](/ecosystem-steering-group) designates one member of the workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* organizing and leading regular meetings,
* ensuring that the workgroup communicates effectively with the community, and
* coordinating meetings between workgroup representatives and other Swift workgroups or teams when necessary.

Workgroup members will try to make a decision independently by consensus whenever possible, and will raise issues to the [Ecosystem Steering Group](/ecosystem-steering-group) when there are particular challenges with reaching consensus.

## Community Participation

Everyone is invited to help improve Swift’s build and packaging experience and participate in the Workgroup’s initiatives. Here are some ways to consider participating:

* Discuss ideas on the [Swift forums](https://forums.swift.org).
* Open GitHub issues to track enhancements or report bugs in the projects governed by the workgroup, such as [SwiftPM](https://github.com/swiftlang/swift-package-manager), [Swift Build](https://github.com/swiftlang/swift-build), and [llbuild](https://github.com/swiftlang/swift-llbuild)
* Contribute bug fixes or enhancements to [SwiftPM](https://github.com/swiftlang/swift-package-manager), [Swift Build](https://github.com/swiftlang/swift-build), and [llbuild](https://github.com/swiftlang/swift-llbuild)
* Provide feedback directly to the members of the workgroup directly by sending a message to [@build-and-packaging-workgroup](https://forums.swift.org/g/build-and-packaging-workgroup) on the Forums. The workgroup chair brings outstanding issues and topics to the workgroup to discuss during regular meetings.
* Join the Workgroup’s regular video meetings. Send a message to [@build-and-packaging-workgroup](https://forums.swift.org/g/build-and-packaging-workgroup) to request access, since calls must be kept to a relatively small number of participants. Meetings open to the community will be announced on the Swift forums in advance.
