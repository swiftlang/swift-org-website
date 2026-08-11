---
layout: page
title: Networking Workgroup
---

The Networking Workgroup is a team that guides the evolution of networking libraries, protocols, and APIs in the Swift ecosystem.

The Networking Workgroup will:

* Govern the development of Swift's networking libraries, including the HTTP client and server APIs, core networking primitives, and shared protocol implementations.
* Conduct community reviews of feature and API proposals for projects under the workgroup's purview.
* Pursue the long-term directions outlined in the [Networking vision](https://github.com/swiftlang/swift-evolution/blob/main/visions/networking.md), including a unified layered networking architecture for Swift.
* Define and maintain currency types for networking, such as HTTP request and response types, IP addresses, hostnames, ports, and other foundational primitives that enable interoperability across the ecosystem.
* Guide the evolution of shared protocol implementations (TLS, HTTP/1.1, HTTP/2, HTTP/3, QUIC, WebSockets) so that improvements benefit the entire ecosystem rather than being duplicated across libraries.
* Encourage the growth of a cohesive networking ecosystem by promoting interoperability between libraries at every layer of the stack.
* Channel feedback to the [Ecosystem Steering Group](/ecosystem-steering-group) and the Core Team about the networking needs of the Swift community.

Current Members of the Networking Workgroup are:

{% assign people = site.data['networking-workgroup'].members | sort: "name" %}
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

The ultimate goal of the Networking Workgroup is to make networking in Swift excellent everywhere: high-level and safe by default, modular and interoperable, cross-platform, and observable. In pursuit of that goal, the workgroup develops and guides libraries that implement core networking functionality; coordinates with maintainers of frameworks, tools, and platform implementations to promote a coherent networking experience; and collaborates with other Swift community groups on networking-related improvements.

The workgroup's efforts are organized around several focus areas:

* **Define a unified networking stack.** Establish a coherent layered architecture with shared I/O primitives at the foundation, common protocol implementations in the middle, and ergonomic client and server APIs at the top. Each layer has well-defined boundaries, allowing implementations to be swapped or optimized independently.
* **Define currency types.** Establish shared foundational types that enable libraries to interoperate without coupling to specific implementations. This includes types for IP addresses, hostnames, ports, HTTP requests and responses, and other networking primitives.
* **Evolve HTTP APIs.** Design and guide the development of a modern, unified HTTP client and server API built on structured concurrency. HTTP is the most common networking entry point in Swift, and improving it yields the highest impact for the broadest set of developers.

Some areas of frequent collaboration with other groups include, but are not limited to:

* Maintainers of SwiftNIO and projects built on top of it, such as AsyncHTTPClient, gRPC-swift, Vapor, and Hummingbird
* Maintainers of platform-specific networking frameworks and HTTP stacks, such as Network.framework and URLSession
* The Swift Server Workgroup on HTTP server frameworks and the broader Swift Server ecosystem
* The [Build and Packaging Workgroup](/build-and-packaging-workgroup) on package-level networking concerns
* Cross-platform I/O and networking support with the [Platform Steering Group](/platform-steering-group)

### Scope

The workgroup's scope spans the networking stack: from I/O primitives and transport protocols such as QUIC and TLS, through protocol implementations, to high-level client and server APIs. The following are explicitly out of scope:

* Configuring system-wide proxy settings
* Application-layer frameworks built on top of HTTP (web frameworks, ORMs, templating engines) — though the workgroup aims to provide foundations those frameworks can build on

### Relationship with the Swift Server Workgroup

The Swift Server Workgroup (SSWG) promotes the use of Swift for server application development and runs an incubation process for server-oriented libraries. There is natural overlap: many of the networking libraries the Networking Workgroup governs are heavily used in server contexts, and several SSWG-incubated packages (such as AsyncHTTPClient) are networking libraries.

The two groups have complementary responsibilities:

* The Networking Workgroup provides the foundational networking libraries, APIs, and protocol implementations that the ecosystem builds on, and guides their evolution to serve the entire Swift ecosystem — apps, servers, embedded, CLI tools, and more.
* The Swift Server Workgroup is a key stakeholder and one of the primary consumers of these foundations, with a specific focus on the broader server application ecosystem: incubating libraries, promoting best practices, and channeling server-specific needs (database drivers, deployment tooling, service lifecycle, etc.).

In practice, the groups will collaborate closely:

* Networking proposals that significantly affect server use cases will be shared with the SSWG for input before or during review, and vice versa for proposals that significantly affect networking.
* Members may serve on both groups to ensure alignment, and joint meetings may be held when topics span both charters.

### Evolution

The Ecosystem Steering Group has delegated the purview over the workgroup's repositories to the Networking Workgroup. The Networking Workgroup uses the Swift Evolution process for its repositories.

Proposals or vision documents that intersect with platform-specific behavior will be reviewed in collaboration with the Platform Steering Group.

## Membership

Membership in the Networking Workgroup is contribution-based and expected to evolve over time. Adding new members and removing inactive ones is subject to a vote by the existing members and requires unanimous agreement.

The Ecosystem Steering Group designates one member of the workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* organizing and leading regular meetings
* ensuring that the workgroup communicates effectively with the community
* coordinating meetings between workgroup representatives and other Swift workgroups or teams when necessary

If you'd like to join the workgroup, send a message to [@networking-workgroup](https://forums.swift.org/new-message?groupname=networking-workgroup) on the Forums and you will be invited to the next available group meeting to discuss it. See [Community Participation](#community-participation) for examples of ways to contribute and demonstrate your interest to the group.

Workgroup members will try to make decisions independently by consensus whenever possible, and will raise issues to the Ecosystem Steering Group when there are particular challenges with reaching consensus on significant decisions.

## Meetings

The Networking Workgroup meets every two weeks, unless otherwise communicated.

Many workgroup meetings are meant for open discussion, and any Swift community member may attend by sending a message to [@networking-workgroup](https://forums.swift.org/new-message?groupname=networking-workgroup) beforehand to request an invite. Some meetings are reserved for private discussion by group members, for example, to make decisions on proposals under review.

## Communication

The Networking Workgroup communicates with the broader Swift community on the [Swift Forums](https://forums.swift.org). The workgroup can also be contacted privately by sending a message to [@networking-workgroup](https://forums.swift.org/new-message?groupname=networking-workgroup).

If any significant decisions are reached during one of the workgroup's regular meetings, a member will post about them in the Forums within one week. The outcome of each proposal review will be announced by its review manager in a separate thread dedicated to that proposal.

## Community Participation

Everyone is invited to help improve Swift's networking experience and participate in the Networking Workgroup's initiatives. Here are some ways to participate:

* Discuss ideas on the [Swift Forums](https://forums.swift.org). Start conversations about networking APIs, share use cases, or provide feedback on existing proposals.
* Open GitHub issues to track enhancements or report bugs in the projects governed by the workgroup.
* Contribute code. Submit bug fixes or enhancements to the repositories managed by the workgroup.
* Provide feedback directly to the members of the Networking Workgroup by sending a message to [@networking-workgroup](https://forums.swift.org/new-message?groupname=networking-workgroup) on the Forums. The workgroup chair brings outstanding issues and topics to the workgroup to discuss during regular meetings.
* Join the workgroup's regular video meetings. Send a message to [@networking-workgroup](https://forums.swift.org/new-message?groupname=networking-workgroup) to request access.
* Participate in the [Swift Mentorship Program](/mentorship) or similar mentoring opportunities for networking-related projects.

