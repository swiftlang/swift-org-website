---
layout: page
title: Community Overview
---

The Swift.org community has the singular goal of making the world's best general purpose programming language.  Collectively we will develop the language in the open, with contributions from anyone who wishes to participate.  This guideline document describes how the Swift community is organized so that we can work together to add amazing new capabilities to Swift, and make it available to even more developers across more platforms.


## Communication

The Swift language is developed in the open, and all technical or administrative topics about the language or community processes should be directed to the Swift public forums. Public conversations are encouraged, and active developers of the Swift language should monitor the relevant forum categories.

* Directory of forum categories and email instructions are in the [forum section](#forums).
* Source code for Swift projects can be found on GitHub at [github.com/swiftlang][github].
* The Swift bug tracking system is maintained at [github.com/swiftlang/swift/issues][bugtracker].

All communication within project spaces should adhere to Swift project's [Code of Conduct](/code-of-conduct).

## Community Structure

Advancing the Swift programming language with a coherent, clear view of its evolution requires strong leadership.  The leadership is taken from the community, and works closely with the much broader group of contributors and users. Roles within the community include:


* __[Project Lead](#project-lead)__ appoints technical leaders from the community.  Apple Inc. is the project lead, and interacts with the community through its representative.
* __[Core Team](#core-team)__ is the small group responsible for strategic direction and oversight of the Swift project.
* __[Code Owner](/contributing/#code-owners)__ is the individual responsible for a specific area of the Swift codebase.
* __[Committer](/contributing/#commit-access)__ is anyone that has commit access to the Swift code base.
* __[Member](/contributing/#member)__ is anyone who is a member of the swiftlang organization on GitHub.
* __[Contributor](/contributing/#contributor)__ is anyone who has contributed to Swift by writing code, answering questions on the forums, reporting or triaging bugs, participating in the Swift evolution process, or other ways.
* __Steering Groups__
   * __[Ecosystem](/ecosystem-steering-group)__ is a small group of experts who focus on the direction of Swift packages and tooling.
   * __[Language](#language-steering-group)__ is a small group of experts that drive the Swift language forward in a coherent direction.
   * __[Platforms](/platform-steering-group)__ is a small group of experts that enables the Swift language and its tools to be used in new environments.
* __Workgroups__
   * __[Android](/android-workgroup)__ is a team that works on the use of Swift for developing Android applications.
   * __[C++ Interoperability](/cxx-interop-workgroup)__ is a team that works on adding the support for the bidirectional interoperability between Swift and C++.
   * __[Contributor Experience](/contributor-experience-workgroup)__ is a team that supports contributors to the Swift project, including contributions on the Swift Forums.
   * __[Documentation](/documentation-workgroup)__ is a team that helps guide the documentation experience for Swift.
   * __[Swift on Server](/sswg)__ is a team that promotes the use of Swift for developing and deploying server applications.
   * __[Testing](/testing-workgroup)__ is a team that helps guide the experience, libraries, and tools for testing Swift code.
   * __[Website](/website-workgroup/)__ is a team that helps guide the evolution on the Swift.org website.

Most importantly, everyone that uses Swift is a valued member of our extended community.

#### Project Lead

[Contact via Forums](https://forums.swift.org/new-message?username=tkremenek)

Apple Inc. is the project lead and serves as the arbiter for the project.  The project lead makes senior appointments to leadership roles, with those leaders coming from the worldwide Swift community of contributors.  The community leaders and code contributors work together to continually improve Swift, and the language will advance by the good works of everyone involved.

[Ted Kremenek](mailto:kremenek@apple.com) is the appointed representative from Apple, and acts as the voice of the project lead.

#### Core Team

[Contact via Forums](https://forums.swift.org/new-message?groupname=core-team)

The Core Team provides cohesion across the Swift community's various workgroups and initiatives, providing support and strategic alignment. The Project Lead appoints members of the Core Team to bring a mixture of experience, expertise, and leadership so the group may together act as effective stewards for the Swift project and its community. The Core Team membership is expected to change over time.

The current Core Team members are:

{% assign people = site.data.core_team | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

We are grateful for the service of the following emeritus Core Team members:

{% assign people = site.data.core_team_emeriti | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}


#### Language Steering Group

[Contact via Forums](https://forums.swift.org/new-message?groupname=language-workgroup)

The Language Steering Group comprises experts that the Swift Project Lead and the Core Team have identified as possessing a balance of perspectives and expertise to review, guide, and strategically align changes to the language mindfully.  The Language Steering Group reviews and helps iterate [language evolution proposals](/contributing/#evolution-process) from the community, acting as the approver of these proposals.  Workgroup members help drive the Swift language forward coherently to create the best possible general-purpose programming language.  The Language Steering Group membership is expected to change over time.

The current Language Steering Group members are:

{% assign people = site.data.language_wg | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

{% include_relative _forums.md %}


[homepage]: ./index.html "Swift.org home page"
[community]: ./community.html  "Swift.org community overview"
[contributing_code]: /contributing/#contributing-code  "Contributing Code"
[test_guide]: ./test_guide.html "Detailed guide to writing good Swift tests"
[blog]: ./blog_home.html  "Swift.org engineering blog"
[faq]: ./faq.html  "The FAQ for all things Swift.org"
[downloads]: ./downloads.html  "Download recent builds of Swift tools"
[forums]:  ./forums.html
[contributors]: ./CONTRIBUTORS.txt "View all Swift project authors"
[owners]: ./CODE_OWNERS.txt "View all Swift project code owners"
[license]: ./LICENSE.txt "View the Swift license"


[email-conduct]: mailto:conduct@swift.org  "Send email to the code of conduct working group"
[email-owners]: mailto:code-owners@forums.swift.org  "Send email to the code owners"
[email-users]: mailto:swift-users@swift.org  "Email other users of Swift"
[email-devs]: mailto:swift-dev@swift.org  "Email the developer discussion list"
[email-lead]: mailto:project-lead@swift.org "The leaders at Apple responsible for Swift.org"

[github]: https://github.com/swiftlang "The Swift organization on GitHub"
[repo]: git+ssh://github.com/apple "Link to the repo hosted on GitHub"
[bugtracker]:  http://github.com/swiftlang/swift/issues

[swift-apple]: https://developer.apple.com/swift  "Apple developer home page for Swift"
