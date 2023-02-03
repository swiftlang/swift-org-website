---
layout: page
title: Swift Server Workgroup (SSWG)
---

The Swift Server workgroup is a steering team that promotes the use of Swift for developing and deploying server applications. The Swift Server workgroup will:

* Define and prioritize efforts that address the needs of the Swift server community
* Define and run an incubation process for these efforts to reduce duplication of effort, increase compatibility and promote best practices
* Channel feedback for Swift language features needed by the server development community to the Swift Core Team

Analogous to the [Core Team](/community#core-team) for Swift, the workgroup is responsible for providing overall technical direction and establishing the standards by which libraries and tools are proposed, developed and eventually recommended. Membership of the workgroup is contribution-based and is expected to evolve over time.

The current Swift Server workgroup consists of the following people:

* Adam Fowler ([@adam-fowler](https://github.com/adam-fowler))
* Dave Moser ([@dave-moser](https://github.com/dave-moser), Amazon)
* Franz Busch ([@FranzBusch](https://github.com/FranzBusch), Apple)
* Gwynne Raskind ([@gwynne](https://github.com/gwynne), Vapor)
* Jimmy McDermott ([@jdmcd](https://github.com/jdmcd) , Transeo)
* Kaitlin Mahar ([@kmahar](https://github.com/kmahar), MongoDB)
* Konrad Malawski ([@ktoso](https://github.com/ktoso), Apple)
* Patrick Freed ([@patrickfreed](https://github.com/patrickfreed), MongoDB)
* Simon Pilkington ([@tachyonics](https://github.com/tachyonics), Amazon)
* Tim Condon ([@0xTim](https://github.com/0xTim), Vapor)

With Tom Doron ([@tomerd](https://github.com/tomerd), Apple) representing the Swift core team.

## Communication

The Swift Server workgroup uses the [Swift Server forum](https://forums.swift.org/c/server) for general discussion.

## Community Participation

Everyone is welcome to contribute in the following ways:

* Proposing new libraries and tools to be considered
* Participating in design discussions
* Asking or answering questions on the forums
* Reporting or triaging bugs
* Submitting pull requests to the library projects for implementation or tests

These conversations will take place on the [Swift Server forum](https://forums.swift.org/c/server). Over time, the workgroup may form smaller working groups to focus on specific technology areas.

## Charter

The main goal of the Swift Server workgroup is to eventually recommend libraries and tools for server application development with Swift. The difference between this workgroup and the Swift Evolution process is that server-oriented libraries and tools that are produced as a result of workgroup efforts will exist outside of the Swift language project itself. The workgroup will work to nurture, mature and recommend projects as they move into their development and release stages.

## Voting

In various situations the SSWG shall hold a vote. These votes can happen on the phone, email, or via a voting service, when appropriate. SSWG members can either respond "agree, yes, +1", "disagree, no, -1", or "abstain". A vote passes with two-thirds vote of votes cast based on the SSWG charter. An abstain vote equals not voting at all.

## Incubation Process

The Swift Server Workgroup has a [process](https://github.com/swift-server/sswg/blob/master/process/incubation.md) which allows a project to go through incubation stages until it graduates and becomes a recommended project.

## Projects

<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Description</th>
      <th>Maturity Level</th>
      <th>Pitched</th>
      <th>Accepted</th>
    </tr>
  </thead>
  <tbody>
    {% for project in site.data.sswg.projects %}
    <tr>
      <td><a href="{{ project.url }}">{{ project.name }}</a></td>
      <td>{{ project.description }}</td>
      <td>{{ project.maturity }}</td>
      <td>{{ project.pitched }}</td>
      <td>{{ project.accepted }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

The SSWG publishes a [package collection](/blog/package-collections/) that contains the projects incubated by the workgroup. The collection is available at `https://swiftserver.group/collection/sswg.json`.

## Meeting Time

The SSWG meets biweekly on Wednesday at 2:00PM PT (USA Pacific). The meetings take place in the weeks with the [odd week numbers](http://www.whatweekisit.org).
