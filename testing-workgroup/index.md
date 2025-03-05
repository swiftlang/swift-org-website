---
layout: page
title: Testing Workgroup
---

The Testing Workgroup is a team that helps guide the experience, libraries, and
tools for testing Swift code.

The Testing Workgroup will:

* Govern the [Swift Testing](https://github.com/swiftlang/swift-testing) and
  [Corelibs XCTest](https://github.com/swiftlang/swift-corelibs-xctest) projects
  and conduct reviews of their feature proposals.
* Identify improvements which would address the needs of testing in the Swift
  community.
* Pursue long-term feature directions outlined in the Swift Testing
  [vision document](https://github.com/swiftlang/swift-evolution/blob/main/visions/swift-testing.md).
* Promote the integration of testing functionality and libraries in related
  tools.
* Channel feedback to other workgroups, steering groups, and the Core Team about
  unmet testing needs of the Swift community.

The current Testing Workgroup consists of the following people:

{% assign people = site.data['testing-workgroup'].members | sort: "name" %}
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

The ultimate goal of the Testing Workgroup is to enhance the experience and
utility of authoring and running tests in Swift to improve software quality
across the ecosystem. In pursuit of that goal, the workgroup develops libraries
like Swift Testing which implement core functionality needed by the community;
it coordinates with the maintainers of commonly-used tools, IDEs, and CI
systems to integrate them and promote testing workflows; and when necessary, it
collaborates with other Swift community groups to pursue testing-related
improvements in their areas. Some areas of frequent collaboration with other
groups include:

* the `swift test` subcommand of
  [swift-package-manager](https://github.com/swiftlang/swift-package-manager);
* the testing subsystem in the
  [vscode-swift](https://github.com/swiftlang/vscode-swift) plugin; and
* the static test discovery logic in
  [sourcekit-lsp](https://github.com/swiftlang/sourcekit-lsp).

A central function of the workgroup is conducting community reviews of features
and API proposals for the Swift Testing project. Its governance of that project
is guided by its accompanying
[vision document](https://github.com/swiftlang/swift-evolution/blob/main/visions/swift-testing.md).
The workgroup also looks for opportunities to deepen integration of testing
libraries with tools and IDEs, enable additional styles of testing (such as
performance or UI), or to resolve problems which impact testing workflows.
Members of the workgroup regularly evaluate emerging trends in the Swift
ecosystem, and discuss how testing could better support them.

## Membership

Membership in the Testing Workgroup is contribution-based and expected to
evolve over time. Adding new members and removing inactive ones is subject to a
vote by the existing members and requires unanimous agreement. Membership is
limited to ten members in total to keep the group small enough to be effective.

The Core Team selects one member of the workgroup as the chair. The chair has no
special authority over the workgroup, but they are responsible for ensuring its
smooth functioning, including by:

* organizing and leading regular meetings,
* ensuring that the workgroup communicates effectively with the community, and
* coordinating meetings between workgroup representatives and other Swift
  workgroups or teams when necessary.

If you’d like to join the workgroup, send a message to
[@testing-workgroup](https://forums.swift.org/new-message?groupname=testing-workgroup)
on the Forums and you will be invited to the next available group meeting to
discuss it more. See [Community participation](#community-participation) for
examples of ways to contribute and demonstrate your interest to the group.

Workgroup members will try to make a decision independently by consensus
whenever possible, and will raise issues to the Core Team when there are
particular challenges with reaching consensus on significant decisions.

## Meetings

The Testing Workgroup meets biweekly on Monday at 1:00PM PT (USA Pacific).
Meetings take place in [even numbered weeks](http://www.whatweekisit.org/),
unless otherwise communicated in advance.

Many workgroup meetings are meant for open discussion and any Swift community
member may attend by sending a message to
[@testing-workgroup](https://forums.swift.org/new-message?groupname=testing-workgroup)
beforehand to request an invite. Some meetings are reserved for private
discussion by group members, for example to make a decision on a proposal under
review.

## Communication

The Testing Workgroup communicates with the broader Swift community in the
[swift-testing](https://forums.swift.org/c/development/swift-testing/103)
Forum category. The workgroup can also be contacted privately by sending a
message to
[@testing-workgroup](https://forums.swift.org/new-message?groupname=testing-workgroup).

If any significant decisions are reached during one of the workgroup's regular
meetings, a member will post about them in the Forums within one week. The
outcome of each proposal review will be announced by its review manager in a
separate thread dedicated to that proposal.

## Community participation

Everyone is invited to help improve Swift’s testing experience and participate
in the Testing Workgroup’s initiatives. Here are some ways to consider
participating:

* Discuss ideas on the Swift Forums. You can create new topics in the
  [swift-testing](https://forums.swift.org/c/development/swift-testing/103)
  category, or add the `testing` tag to any topic.
* Open GitHub issues to track enhancements or report bugs in the projects
  governed by the Testing Workgroup, such as
  [swift-testing](https://github.com/swiftlang/swift-testing).
* Contribute bug fixes or enhancements to
  [swift-testing](https://github.com/swiftlang/swift-testing). (See
  [CONTRIBUTING](https://github.com/swiftlang/swift-testing/blob/main/CONTRIBUTING.md).)
* Expand [swift-testing](https://github.com/swiftlang/swift-testing) to support
  additional platforms. (See
  [Porting](https://github.com/swiftlang/swift-testing/blob/main/Documentation/Porting.md).)
* Develop new tools to aide automated testing or improve existing ones.
* Provide feedback to the members of the Testing Workgroup directly by sending a
  message to
  [@testing-workgroup](https://forums.swift.org/new-message?groupname=testing-workgroup)
  on the Forums. The workgroup chair brings outstanding issues and topics to the
  workgroup to discuss during regular meetings. The workgroup decides the
  actions for the issues.
* Join the Testing Workgroup’s regular video meetings. Send a message to
  [@testing-workgroup](https://forums.swift.org/new-message?groupname=testing-workgroup)
  to request access, since calls must be kept to a relatively small number of
  participants.
