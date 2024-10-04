---
layout: new-layouts/base
title: Platform Steering Group
---

The Platform Steering Group enables the Swift language and its tools to be used in new environments. The Platform Steering Group’s primary goal is to **drive development work that brings the Swift toolchain and language runtime to a variety of platforms**. Specifically, the Platform Steering Group will:

* work with the Swift Core Team to define a roadmap for toolchain improvements and expanded platform support,
* work with the (to be formed) Ecosystem Steering Group to improve the experience of setting up a Swift development environment on all supported platforms,
* work with the Language Steering Group to define Swift language support in specific environments,
* implement an evolution process for the Swift toolchain and new platform support, and
* keep the community informed about changes to the project roadmap, the status of accepted proposals, and the availability of platform support, their support tier, and their requirements.

## Membership

The Platform Steering Group is made up of Swift community members who have technical expertise and hands on engineering experience in build systems, compilers, debuggers, linkers, or systems programming. Members of the steering group are volunteers who ordinarily serve for a term of two years. The Swift Core Team is solely responsible for the membership of the steering group and may add or remove members as it sees fit.

The current members of the Platform Steering Group are:

{% assign people = site.data['platform-steering-group'].members | sort: "name" %}
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


## Evolution

The Platform Steering Group has evolution authority over low-level tools in the Swift toolchain, including:

* The SwiftPM build system
* The debugger
* The linker
* Libraries, such as the sanitizers
* The mechanics of the Swift runtime
* ABI stability, and
* Runtime API availability based on platform constraints

Proposals or vision documents that define subsets of the Swift language for specific platforms will be reviewed in collaboration with the Language Steering Group, because they have direct impact on program semantics and the overall programming model.

Evolution authority of the Platform Steering Group does not extend to

* Tools that help programmers read and write code on various platforms
* IDE extensions
* SourceKit LSP
* DocC, or
* The SwiftPM dependency management and distribution features

All of these are under the purview of the (to be formed) Ecosystem Steering Group.

Not all changes driven by the Platform Steering Group will under go evolution review. Evolution review is critical for defining new platform support and new features of existing platforms that have major implications on ABI stability and toolchain compatibility. The Platform Steering Group will also participate in standard processes of related communities, such as submitting proposals for the DWARF Debugging Standard in support of LLDB. The evolution process only concerns itself with implementation details where they interact with the underlying platform. It is also not necessary for day-to-day engineering work for reaching a higher support tier for a particular platform, general bug fixes, performance improvements, and other quality-of-life changes.

## Communication

The Platform Steering Group communicates with the community primarily using the [Platform category](https://forums.swift.org/c/platform) on the Swift forums.  It may also prepare special posts for the [Swift Blog](https://www.swift.org/blog/).

The Steering Group is presently working on a process for platform evolution and will update this charter when details of this process have been finalised, but it is expected that the Steering Group will be responsible for:

* Announcing (and running) platform evolution proposal reviews.
* Announcing decisions about platform evolution proposal reviews.
* After every release of Swift, describing the platform evolution proposals newly implemented in that release.
* After every release of Swift, describing the current platform evolution roadmap for the next few upcoming releases (a 1–2 year timeline).

The Steering Group will also be partially responsible for the content of platform and runtime library documentation:

* It will have editorial authority over platform evolution proposals as primary documents.
* It will review, alongside other steering groups, the technical content as relates to platform support of any language, library, runtime, or platform documentation hosted on [swift.org](https://swift.org), but editorial authority over that documentation rests with the Website Workgroup or other groups as appropriate.

## Platform Evolution process

The Steering Group is presently working on defining a Platform Evolution process, and will share more here when ready.

## Community participation

The Platform Steering Group is not separate from the Swift community. Steering Group members participate in platform evolution discussions and propose changes just like any other member of the community.  When the Steering Group develops a new idea about a proposal in the course of its internal deliberations, a Steering Group member is expected to bring that idea to the community for discussion before the review is considered complete.

Proposals or feedback about Swift platform support, the Platform Evolution process, a specific Platform Evolution proposal, or any other topic under the purview of the Platform Steering Group are always welcome.  The primary way to communicate with the Platform Steering Group is simply to post in the Evolution category on the Swift forums, either by adding a reply to an existing review, pitch, or other discussion thread, or by creating a new thread in [Evolution > Discussion](https://forums.swift.org/c/evolution/discuss) or [Evolution > Pitches](https://forums.swift.org/c/evolution/pitches).  Community members may also reach out privately to members of the Platform Steering Group by email or private message on the forums.

The Platform Steering Group follows the [Swift Code of Conduct](https://www.swift.org/code-of-conduct/).  Instances of abusive, harassing, or otherwise unacceptable behaviour may be reported by contacting the Steering Group chair or a member of the [Swift Core Team](https://www.swift.org/community/#community-structure) or by flagging the behavior for moderation, whether you are the target of that behaviour or not.

