---
layout: new-layouts/base
title: Language Steering Group
---

The Swift Language Steering Group guides the development of the Swift language and standard libraries through the [Swift evolution process](https://github.com/swiftlang/swift-evolution/blob/main/process.md).

## Charter

The Swift Language Steering Group:
* works with the [Swift Core Team](/community/#community-structure) to define a roadmap for the focus areas of language and library development in the upcoming releases of Swift.
* works with the Swift Core Team and other workgroups to define, document, and develop the Swift evolution process.
* implements the evolution process for the Swift language and library by:
  * soliciting, writing, and approving feature roadmaps.
  * guiding evolution discussion.
  * keeping evolution discussion collegial and inclusive.
  * deciding whether and when to run a review for an evolution proposal.
  * running evolution reviews.
  * making decisions about proposals.
* keeps the community informed about changes to the project roadmap, the status of accepted proposals, and the availability of new features.

## Membership

The Language Steering Group is made up of Swift community members with a variety of backgrounds. Members of the workgroup are volunteers who ordinarily serve for a term of two years. The Swift Core Team is solely responsible for the membership of the workgroup and may add or remove members as it sees fit.

The Core Team also selects one member of the workgroup as the chair. The chair has no special authority over the workgroup, but they are responsible for ensuring its smooth functioning, including by:

* organizing and leading regular meetings.
* ensuring that proposals have an assigned review manager sufficiently in advance of when they will be reviewed.
* ensuring that the workgroup discusses and reaches a conclusion promptly after a proposal has been reviewed.
* ensuring that the workgroup communicates effectively with the community.
* coordinating meetings between workgroup representatives and the Core Team when issues need to be raised to the Core Team.

The current members of the Language Steering Group are:

{% assign people = site.data['language-steering-group'].members | sort: "name" %}
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

## Decision making

The Language Steering Group is commissioned by the Swift Core Team to make decisions on its behalf, and it typically works autonomously, with a goal of reaching consensus within the workgroup whenever possible. Final decision-making authority about all language evolution topics rests with the Project Lead.

## Communication

The Language Steering Group communicates with the community primarily using the [Evolution](https://forums.swift.org/c/evolution) category on the Swift forums. It will also prepare special posts for the Swift Blog.

The workgroup is responsible for the following regular communication with the broader Swift community:

* Announcing (and running) evolution proposal reviews for language and library proposals.
* Announcing decisions about evolution proposal reviews for language and library proposals.
* After every release of Swift, describing the language and library evolution proposals newly implemented in that release.
* After every release of Swift, describing the current language and library evolution roadmap for the next few upcoming releases (a 1–2 year timeline).

The workgroup is also partially responsible for the content of language and library documentation:

* It has editorial authority over evolution proposals as primary documents.
* It has editorial authority over the naming guidelines and other “style” documents which are under the control of the evolution process.
* It reviews the technical content of any language and library documentation hosted on [swift.org](http://swift.org/), but editorial authority over that documentation rests with the Website Workgroup or other groups as appropriate.

## Evolution process

The Language Steering Group is an evolution workgroup which uses the [Swift evolution process](https://github.com/swiftlang/swift-evolution/blob/main/process.md) to guide proposals through evolution review. The Language Steering Group has evolution authority over the Swift language and standard library. Authority over the language includes authority over the language configuration, such as compiler flags for language options, diagnostic options, and similar settings with a direct impact on the language or a programmer's experience using the language. This authority does not extend to other compiler flags, such as optimization or code generation settings, or to tools such as build systems and package managers.

These limits on the evolution authority of the Language Steering Group are not meant to be limits on the scope of evolution proposals. Swift workgroups are expected to collaborate to ensure that proposals offer a satisfactory solution across the entire Swift project. If a proposal impacts parts of the project under the authority of multiple workgroups, those workgroups must work together to bring the proposal through the evolution process.

As a major client of the evolution process, the Language Steering Group works closely with the Core Team to define and improve that process, such as by:

* clearly defining how proposals are pitched and reviewed.
* providing guidelines for participating in the evolution process in various roles.
* regularly updating the process and guidelines to make the process work better.

Any change to the evolution process is ultimately up to the discretion of the Core Team.

## Community participation

The Language Steering Group is not separate from the Swift community. Workgroup members participate in evolution discussions and propose language changes just like any other member of the community. When the workgroup develops a new idea about a proposal in the course of its internal deliberations, a workgroup member is expected to bring that idea to the community for discussion before the review is considered complete.

Proposals or feedback about the Swift language, the general evolution process, a specific evolution proposal, or any other topic under the purview of the Language Steering Group are always welcome. The primary way to communicate with the Language Steering Group is simply to post in the [Evolution category](https://forums.swift.org/c/evolution/) on the Swift forums, either by adding a reply to an existing review, pitch, or other discussion thread or by creating a new thread in [Evolution > Discussion](https://forums.swift.org/c/evolution/discuss) or [Evolution > Pitches](https://forums.swift.org/c/evolution/pitches). Community members may also reach out privately to members of the Language Steering Group by email or private message on the forums.

The Language Steering Group follows the Swift [Code of Conduct](/code-of-conduct/). Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the workgroup chair or a member of the [Swift Core Team](/community/#community-structure) or by flagging the behavior for moderation, whether you are the target of that behavior or not.
