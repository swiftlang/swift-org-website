---
layout: page
title: Android Workgroup
---

The Android workgroup is a team that promotes the use of Swift for developing Android applications.

## Charter

The main goal of the Android workgroup is to add and maintain Android as an officially supported platform for the Swift language.

The Android workgroup will:

* Improve and maintain Android support for the official Swift distribution, eliminating the need for out-of-tree or downstream patches
* Recommend enhancements to core Swift packages such as Foundation and Dispatch to work better with Android idioms
* Work with the Platform Steering Group to officially define platform support levels generally, and then work towards achieving official support of a particular level for Android
* Determine the range of supported Android API levels and architectures for Swift integration
* Develop [continuous integration](https://www.swift.org/documentation/continuous-integration/) for the [main Swift repository](https://ci-external.swift.org/job/oss-swift-RA-linux-ubuntu-24.04-android-arm64/) that adds Android checks for pull requests
* Identify and recommend best practices for bridging between Swift and Android's Java SDK and packaging Swift libraries with Android apps
* Develop support for debugging Swift applications on Android
* Advise and assist with adding support for Android to various community Swift packages

## Communication

The Swift Android workgroup uses the [Swift Android forum](https://forums.swift.org/c/development/android) for general discussions. It can also be contacted privately by messaging [@android-workgroup](https://forums.swift.org/g/android-workgroup) on the Swift Forums.

## Membership

Membership in the Android workgroup is open to anyone who wishes to contribute. Members communicate with each other over regular video calls and on the Swift forums. Community members interested in participating in the workgroup should reach out to a current member of the workgroup, or request to be added to the [Android workgroup](https://forums.swift.org/g/android-workgroup) directly.

The Android workgroup adheres to the Swift code of conduct. If community members have any concerns about the adherence of the workgroup or one of its members to the code of conduct, they should contact a member of the Swift Core Team.

The Android workgroup selects one member of the workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* organizing and leading regular meetings,
* ensuring that the workgroup communicates effectively with the community, and
* coordinating meetings between workgroup representatives and other Swift workgroups or teams when necessary.

Where the Workgroup is uncertain of or unable to agree on the way forward, members may raise issues to the relevant Steering Group(s) for consideration. Significant decisions should be made following the usual Swift Evolution process to allow for community participation and Steering Group oversight.

The current members of the Android workgroup are:

{% assign people = site.data['android-workgroup'].members | sort: "name" %}
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

## Meetings

The Android workgroup meets biweekly on Wednesday at noon ET (US Eastern Time). The meetings take place in the weeks with the [odd week numbers](http://www.whatweekisit.org/).

Workgroup meetings are meant for open discussion and any Swift community member may attend by sending a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=android-workgroup) beforehand to request an invite.

## Community Participation

Everyone is welcome to contribute in the following ways:

* Participating in design discussions.
* Asking or answering questions on the forums.
* Reporting or triaging bugs.
* Submitting pull requests to any of the Android support library projects.
* Discuss ideas on the Swift Forums. You can create new topics in the [Android](https://forums.swift.org/c/development/android/115) category, or add the android tag to any topic.
* Develop new tools to aid the Android experience or improve existing ones.
* Provide feedback to the members of the Android workgroup directly by sending a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=android-workgroup) on the Forums. The workgroup chair brings outstanding issues and topics to the workgroup to discuss during regular meetings. The workgroup decides the actions for the issues.
* Join the Android workgroup’s regular video meetings. Send a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=android-workgroup) to request access.
