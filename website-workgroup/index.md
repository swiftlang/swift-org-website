---
layout: new-layouts/base
title: Swift.org website workgroup (SWWG)
---

See [website overview](/website) for more information about the Swift.org website goals, content governance and contribution guidelines.

The Swift website workgroup is a steering team that helps guide the evolution on the Swift.org website. The Swift website workgroup will:

* Define a set of processes that govern the contributions to the Swift.org website.
* Actively guide Swift.org website development and contributions.
* Define and prioritize Swift.org website related efforts that address the needs of the Swift community.
* Channel feedback to Swift core team about the needs of the Swift community.

Analogous to the [Core Team](/community#core-team) for Swift, the workgroup is responsible for establishing the processes and standards by which changes to the Swift.org website are proposed and eventually integrated.

The current website workgroup consists of the following people:

{% assign people = site.data.website-workgroup.members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
  , {{ person.affiliation }}
{% endif %}
{% if person.github %}
  (<a href="https://github.com/{{person.github}}">@{{person.github}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>

We are grateful for the service of the following emeritus workgroup members:

{% assign people = site.data.website-workgroup.emeriti | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
  , {{ person.affiliation }}
{% endif %}
{% if person.github %}
  (<a href="https://github.com/{{person.github}}">@{{person.github}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>

## Charter

The main goal of the Swift website workgroup is to define a set of processes governing contributions to the Swift.org website and actively guide contributors along the website’s goals as the defined above.

In that capacity, workgroup members review proposals for changes to the website, either in pull requests or ideas posted to the workgroups formal communication channels and provide feedback in effort to integrate these changes in a way that is consistent with the website’s goals.

Workgroup member may also initiate projects to improve different aspects of the Swift.org website including it’s content, information design, UX and UI design, and technical infrastructure.
For example, one of the initial workgroup goals is to kick off building a new website, built with Swift and a different information and UX/UI design.

Members of the Swift website workgroup serve at the discretion of the Swift core team and the Swift project lead, who has the ultimate authority over the workgroup decisions.


## Membership

Members of the Swift website workgroup are appointed by the Swift project core team on their expertise and contributions to the community.
Membership in the workgroup is contribution-based and expected to evolve over time.
Adding new members and removing inactive ones is subject to a workgroup vote and requires unanimous agreement.
The workgroup's vote then needs to be approved by the Swift core team.

Individuals that would like to join the workgroup should apply by expressing their interest privately by contacting [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) on the Swift Forums.
Applications will then be reviewed in the next available workgroup meeting.

A cap of ten members total is in place to keep the group small enough to be effective.

Membership term is capped at 2 years, but exiting members may re-apply at the end of their term.
When multiple candidates compete for the same seat, the workgroup will vote between all candidates, with a final voting round between the two candidates that received most votes in the first round.

Inactive members that do not participate for 3 consecutive months will be contacted to confirm their desire to stay with the group.
After no activity for 6 months, the workgroup will vote on removing them from the group.

## Voting

In various situations the workgroup shall hold a vote. These votes can happen on the phone, email, or via a voting service, when appropriate. Workgroup members can either respond “agree, yes, +1”, “disagree, no, -1”, or “abstain”. A vote passes with two-thirds vote of votes cast based on the workgroup charter. An abstain vote equals not voting at all.


## Communication

The Swift website workgroup uses the [Swift.org website forum](https://forums.swift.org/c/swift-website/) for general discussions.
It can also be contacted privately by messaging [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) on the Swift Forums.
