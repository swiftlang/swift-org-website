---
layout: new-layouts/base
title: Foundation Workgroup
---

The Foundation Workgroup governs the Swift Foundation project. Foundation provides a base layer of functionality that is useful in many applications. It includes fundamental types for numbers, data, URL, and dates, as well as functions for task management, file system access, localization, and more.

The Foundation Workgroup will:

* Set high level goals for the direction of Foundation
* Run reviews of community API proposals, prioritizing those that align with the goals of the project
* Define processes that govern contributions to Foundation and its related projects
* Channel feedback to Swift Core Team about the needs of the Swift community.

The current members of the Foundation Workgroup are:

{% assign people = site.data['foundation-workgroup'].members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
, {{ person.affiliation }}
{% endif %}
{% if person.handle %}
(<a href="https://forums.swift.org/new-message?username={{person.handle}}">@{{person.handle}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>


## Charter

The goal of the Foundation project is to deliver the best fundamental data types and internationalization features, and make them available to Swift developers everywhere. It takes advantage of emerging features in the language as they are added, and enables library and app authors to build higher level API with confidence.

An important part of that confidence is built by using a [community-focused API review process](https://github.com/swiftlang/swift-foundation/blob/main/Evolution.md). The Foundation Workgroup oversees the process, and closely coordinates with developments in the Swift project, Apple platforms, and other platforms. The workgroup members review and work with contributors to iterate API proposals, triage bug and feature requests on [Github Issues](https://github.com/swiftlang/swift-foundation/issues), and provide feedback via pull requests and forum posts to incorporate the changes. The workgroup members also look at emerging trends in the Swift ecosystem, and discuss how the library should evolve to align with the language.

The workgroup meets quarterly, and also when the review period ends to accept or return proposals for revision.

### Evolution Process

The Foundation Workgroup follows an evolution process that is documented in the [Foundation GitHub repository](https://github.com/swiftlang/swift-foundation/blob/main/Evolution.md).

### Membership

Members of the Foundation Workgroup provide stewardship of the Foundation project as outlined in the charter above. The membership is made up of Swift community members with a variety of backgrounds.

The Core Team also selects one member of the workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* Organizing and leading regular meetings.
* Ensuring that the workgroup communicates effectively with the community.
* Coordinating meetings between workgroup representatives and the Core Team when issues need to be raised to the Core Team.

Workgroup members will try to make a decision independently by consensus whenever possible, and will raise issues to the Core Team when there are particular challenges with reaching consensus on significant decisions.

## Communication

The Foundation Workgroup communicates with the broader Swift community using the [forum](https://forums.swift.org/c/related-projects/foundation/99) for general discussions.

The workgroup can also be contacted privately by messaging [@foundation-workgroup](https://forums.swift.org/new-message?groupname=foundation-workgroup) on the Swift Forums.

## Community Participation

Foundation welcomes contributions from the community, including bug fixes, tests, documentation, and ports to new platforms. Please see the [`CONTRIBUTING`](https://github.com/apple/swift-foundation/blob/main/CONTRIBUTING.md) document for more information, including the process for accepting community contributions for new API in Foundation. We would also love your comments and reviews in the community API approval process and evolution processes linked above.

Discussion about general topics that are not code specific takes place on the [forum](https://forums.swift.org/c/related-projects/foundation/99). You can also reach out to the workgroup by sending messages to [@foundation-workgroup](https://forums.swift.org/new-message?groupname=foundation-workgroup) . The chair brings the list of outstanding issues and topics to the workgroup during regular workgroup meetings. The workgroup decides the actions for the issues.

