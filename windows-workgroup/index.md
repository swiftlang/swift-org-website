---
layout: page
title: Windows Workgroup
---

The Windows workgroup is a team that promotes the use of Swift for developing Windows applications.

## Charter

The goal of the Windows workgroup is to maintain Swift support for Windows, allowing users to develop Windows applications using the Swift language and its associated tools.

The Windows workgroup will:

* Improve and maintain Windows support for the official Swift distribution.
* Recommend enhancements to core Swift packages such as Foundation and Dispatch to work better with Windows idioms
* Make recommendations to the Swift Project about the direction of future Windows support in Swift
* Identify and recommend best practices for bridging between Swift and the Windows API, and for shipping Swift libraries with Windows applications
* Improve and maintain support for debugging Swift applications on Windows
* Advise and assist with adding support for Windows to various community Swift packages

## Communication

The Swift Windows workgroup uses the [Swift Windows forum](https://forums.swift.org/c/platform/windows/67) for general discussions. It can also be contacted privately by messaging [@windows-workgroup](https://forums.swift.org/g/windows-workgroup) on the Swift Forums.

## Membership

Membership in the Windows workgroup is open to anyone who wishes to contribute. Members communicate with each other over regular video calls and on the Swift forums.

The Windows workgroup adheres to the Swift code of conduct. If community members have any concerns about the adherence of the workgroup or one of its members to the code of conduct, they should contact a member of the Swift Core Team.

The Platform Steering Group selects one member of the Windows workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* organizing and leading regular meetings,
* ensuring that the workgroup communicates effectively with the community, and
* coordinating meetings between workgroup representatives and other Swift workgroups or teams when necessary.

Where the workgroup is uncertain of or unable to agree on the way forward, members may raise issues to the relevant Steering Group(s) for consideration. Significant decisions should be made following the usual Swift Evolution process to allow for community participation and Steering Group oversight.

The core members of the Windows workgroup are:

{% assign people = site.data['windows-workgroup'].members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.chair -%}
 (Chair)
{% endif %}
{%- if person.affiliation -%}
, {{ person.affiliation }}
{% endif %}
{% if person.handle %}
(<a href="https://forums.swift.org/u/{{person.handle}}/summary">@{{person.handle}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>

Core members have no additional rights or responsibilities, but are generally people who work on Swift for Windows as part of their day-to-day jobs; they are listed here solely to provide stable points of contact for the workgroup.  If you would like to be added to the list of core members, please reach out to a current core member, or send a request to the [Windows workgroup](https://forums.swift.org/g/windows-workgroup) directly.

## Meetings

The Windows workgroup meets biweekly on Wednesday at 9am PST (U.S. Pacific Time).

Workgroup meetings are meant for open discussion and any Swift community member may attend by sending a message to [@windows-workgroup](https://forums.swift.org/new-message?groupname=windows-workgroup) beforehand to request an invite.

## Community Participation

Everyone is welcome to contribute in the following ways:

* Participating in design discussions.
* Asking or answering questions on the forums.
* Reporting or triaging bugs.
* Submitting pull requests to any of the Windows support library projects.
* Discuss ideas on the Swift Forums. You can create new topics in the [Windows](https://forums.swift.org/c/platform/windows/67) category, or add the windows tag to any topic.
* Develop new tools to aid the Windows experience or improve existing ones.
* Provide feedback to the members of the Windows workgroup directly by sending a message to [@windows-workgroup](https://forums.swift.org/new-message?groupname=windows-workgroup) on the Forums. The workgroup chair brings outstanding issues and topics to the workgroup to discuss during regular meetings. The workgroup decides the actions for the issues.
* Join the Windows workgroup’s regular video meetings. Send a message to [@windows-workgroup](https://forums.swift.org/new-message?groupname=windows-workgroup) to request access.
