---
layout: page
title: Android Workgroup
---

The Android Workgroup is a team that promotes the use of Swift for developing Android applications.

## Charter

The main goal of the Android Workgroup is to add and maintain Android as an officially supported platform for the Swift language.

The Android Workgroup will:

* Coordinate the development of a reference Swift Android SDK  
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

If any significant decisions are reached during one of the workgroup’s regular meetings, a member will post about them in the Forums within one week. The outcome of each proposal review will be announced by its review manager in a separate thread dedicated to that proposal.

## Membership

Membership in the Android Workgroup is contribution-based and expected to evolve over time. Adding new members and removing inactive ones is subject to a vote by the existing members and requires unanimous agreement. Membership is limited to ten members in total to keep the group small enough to be effective. A cap of two members per company is in place to avoid over-representation.

The Core Team selects one member of the workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* organizing and leading regular meetings,
* ensuring that the workgroup communicates effectively with the community, and
* coordinating meetings between workgroup representatives and other Swift workgroups or teams when necessary.

If you would like to join the workgroup, send a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=android-workgroup) on the Forums and you will be invited to the next available group meeting to discuss it more. See Community participation for examples of ways to contribute and demonstrate your interest to the group.

Workgroup members will try to make a decision independently by consensus whenever possible, and will raise issues to the Core Team when there are particular challenges with reaching consensus on significant decisions.

The current members of the Android Workgroup are:

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

The Android Workgroup meets biweekly on Wednesday at 2:00PM ET (US Eastern Time). The meetings take place in the weeks with the [odd week numbers](http://www.whatweekisit.org/).

Many workgroup meetings are meant for open discussion and any Swift community member may attend by sending a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=testing-workgroup) beforehand to request an invite. Some meetings are reserved for private discussion by group members, for example to make a decision on a proposal under review.

## Community Participation

Everyone is welcome to contribute in the following ways:

* Participating in design discussions.
* Asking or answering questions on the forums.
* Reporting or triaging bugs.
* Submitting pull requests to any of the Android support library projects.
* Discuss ideas on the Swift Forums. You can create new topics in the [Android](https://forums.swift.org/c/development/android/115) category, or add the android tag to any topic.
* Develop new tools to aid the Android experience or improve existing ones.
* Provide feedback to the members of the Android Workgroup directly by sending a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=android-workgroup) on the Forums. The workgroup chair brings outstanding issues and topics to the workgroup to discuss during regular meetings. The workgroup decides the actions for the issues.
* Join the Android Workgroup’s regular video meetings. Send a message to [@android-workgroup](https://forums.swift.org/new-message?groupname=android-workgroup) to request access, since calls are easier to manage when kept to a relatively small number of participants.
