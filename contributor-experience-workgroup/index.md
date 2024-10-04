---
layout: new-layouts/base
title: Contributor Experience Workgroup
---

The Contributor Experience Workgroup supports contributors to the Swift project, including contributions on the Swift Forums.

## Charter

The Contributor Experience Workgroup is devoted to:
- improving the mechanics and ergonomics of contributing to the Swift compiler and related open source repositories by:
  - providing guidance and setting expectations for the GitHub pull request and issue workflows.
  - maintaining onboarding documentation.
  - adding and managing GitHub labels.
- providing support systems and facilitating collaboration amongst contributors through:
  - the Swift Mentorship Program.
  - community groups.
  - collaboration tools and spaces to connect with other contributors.

### Diversity

Fostering an inclusive community is critical to ensure that everybody in the Swift community feels enabled and empowered to make contributions to the Swift project. The Contributor Experience Workgroup will collaborate with other workgroups to surface pathways for making contributions, lower the barrier to entry for participating in the Swift project, provide diverse opportunities for seasoned contributors to exercise their leadership and expertise, and facilitate participation of the other workgroups in these efforts such as the Swift Mentorship Program.


## Membership
Members of the workgroup are volunteers working towards improving the contributor experience. If you are interested in joining the workgroup, please send a message to [@contributor-experience-workgroup](https://forums.swift.org/g/contributor-experience-workgroup) on the Swift Forums, and mention why you’re interested in joining and how you envision supporting contributors to the Swift project!

To facilitate turnover within the workgroup, there will be an annual check-in for participation to provide an opportunity to step down from the workgroup, and a Call for Participation for new people to join will be announced on the Swift Forums.

Members of the workgroup serve at the discretion of the Swift Core Team and the Swift project lead, who has the ultimate authority over the workgroup decisions.

The current members of the workgroup are:

{% assign people = site.data['contributer-experience-workgroup'].members | sort: "name" %}
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

We are grateful for the service of the following emeritus workgroup member:

{% assign people = site.data['contributer-experience-workgroup'].emeriti | sort: "name" %}
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

The Contributor Experience Workgroup communicates with the broader Swift community using the Development forum for general discussions and questions about the contributor experience. The workgroup can be reached privately on the Swift Forums by messaging [@contributor-experience-workgroup](https://forums.swift.org/g/contributor-experience-workgroup).

## Community Participation

Every individual contribution is appreciated and is not just limited to submitting pull requests. If you’d like to contribute, consider participating in discussions on the Swift Forums reporting or triaging GitHub issues providing feedback on your own experience contributing to the Swift project volunteering as a mentor for the Swift Mentorship Program.
