---
layout: new-layouts/base
title: Swift Server Workgroup (SSWG)
---

The Swift Server workgroup is a steering team that promotes the use of Swift for developing and deploying server applications. The Swift Server workgroup will:

* Define and prioritize efforts that address the needs of the Swift server community.
* Define and run an [incubation process](/sswg/incubation-process.html) for these efforts to reduce duplication of effort, increase compatibility and promote best practices.
* Channel feedback for Swift language features needed by the server development community to the Swift Core Team.

Analogous to the [Core Team](/community#core-team) for Swift, the workgroup is responsible for providing overall technical direction and establishing the standards by which libraries and tools are proposed, developed and eventually recommended. Membership of the workgroup is contribution-based and is expected to evolve over time.

The current Swift Server workgroup consists of the following people:

{% assign people = site.data.server-workgroup.members | sort: "name" %}
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

{% assign people = site.data.server-workgroup.emeriti | sort: "name" %}
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

## Communication

The Swift Server workgroup uses the [Swift Server forum](https://forums.swift.org/c/server) for general discussion.

## Community Participation

Everyone is welcome to contribute in the following ways:

* Proposing new libraries and tools to be considered.
* Participating in design discussions.
* Asking or answering questions on the forums.
* Reporting or triaging bugs.
* Submitting pull requests to the library projects for implementation or tests.

These conversations will take place on the [Swift Server forum](https://forums.swift.org/c/server). Over time, the workgroup may form smaller working groups to focus on specific technology areas.

## Charter

The main goal of the Swift Server workgroup is to eventually recommend libraries and tools for server application development with Swift. The difference between this workgroup and the Swift Evolution process is that server-oriented libraries and tools that are produced as a result of workgroup efforts will exist outside of the Swift language project itself. The workgroup will work to nurture, mature and recommend projects as they move into their development and release stages.

## Membership

Membership in the workgroup is contribution-based and expected to evolve over time. Adding new members and removing inactive ones is subject to a SSWG vote and requires unanimous agreement. A cap of two members per company is in place to avoid overweight representation. A cap of ten members total is in place to keep the group small enough to be effective. Membership term is capped at 2 years, but exiting members may re-apply at the end of their term. When multiple candidates compete for the same seat, the SSWG will vote between all candidates, with a final voting round between the two candidates that received most votes in the first round.

Companies or individuals that would like to join the workgroup should apply by posting a request to the [Swift Server forum](https://forums.swift.org/c/server). Applicants will then be invited to the next available SSWG meeting to present their case.

Inactive members that do not participate in four consecutive workgroup meetings will be contacted to confirm their desire to stay with the group. After missing ten consecutive meetings, the SSWG will vote on removing them from the group.

## Voting

In various situations the SSWG shall hold a vote. These votes can happen on the phone, email, or via a voting service, when appropriate. SSWG members can either respond "agree, yes, +1", "disagree, no, -1", or "abstain". A vote passes with two-thirds vote of votes cast based on the SSWG charter. An abstain vote equals not voting at all.

## Meeting Time

The SSWG meets biweekly on Wednesday at 2:00PM PT (USA Pacific). The meetings take place in the weeks with the [odd week numbers](http://www.whatweekisit.org).
