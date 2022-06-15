---
layout: page
title: Community Overview
---

The Swift.org community has the singular goal of making the world's best general purpose programming language.  Collectively we will develop the language in the open, with contributions from anyone who wishes to participate.  This guideline document describes how the Swift community is organized so that we can work together to add amazing new capabilities to Swift, and make it available to even more developers across more platforms.


## Communication

The Swift language is developed in the open, and all technical or administrative topics about the language or community processes should be directed to the Swift public forums. Public conversations are encouraged, and active developers of the Swift language should monitor the relevant forum categories.

* Directory of forum categories and email instructions are in the [forum section](#forums)
* Source code for all Swift projects can be found on GitHub at [github.com/apple][github]
* The Swift.org bug tracking system is maintained at [github.com/apple/swift/issues][bugtracker]

All communication within project spaces should adhere to Swift project's [Code of Conduct](/code-of-conduct).

## Community Structure

Advancing the Swift programming language with a coherent, clear view of its evolution requires strong leadership.  The leadership is taken from the community, and works closely with the much broader group of contributors and users. Roles within the community include:


* __[Project Lead](#project-lead)__ appoints technical leaders from the community.  Apple Inc. is the project lead, and interacts with the community through its representative.
* __[Core Team](#core-team)__ is the small group responsible for strategic direction and oversight of the Swift project
* __[Language Workgroup](#language-workgroup)__ is a small group of experts that drive the Swift language forward in a coherent direction
* __[Code Owner](#code-owners)__ is the individual responsible for a specific area of the Swift codebase
* __[Committer](/contributing/#commit-access)__ is anyone that has commit access to the Swift code base
* __[Contributor](/contributing/#contributing-code)__ is anyone that contributes a patch or helps with code review

Most importantly, everyone that uses Swift is a valued member of our extended community.

#### Project Lead

Apple Inc. is the project lead and serves as the arbiter for the project.  The project lead makes senior appointments to leadership roles, with those leaders coming from the worldwide Swift community of contributors.  The community leaders and code contributors work together to continually improve Swift, and the language will advance by the good works of everyone involved.

[Ted Kremenek](mailto:kremenek@apple.com) is the appointed representative from Apple, and acts as the voice of the project lead.

#### Core Team

The Core Team provides cohesion across the Swift community's various workgroups and initiatives, providing support and strategic alignment. The Project Lead appoints members of the Core Team to bring a mixture of experience, expertise, and leadership so the group may together act as effective stewards for the Swift project and its community. The Core Team membership is expected to change over time.

The current Core Team members are:

{% assign people = site.data.core_team | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

#### Language Workgroup

The Language Workgroup comprises experts that the Swift Project Lead and the Core Team have identified as possessing a balance of perspectives and expertise to review, guide, and strategically align changes to the language mindfully.  The Language Workgroup reviews and helps iterate [language evolution proposals](/contributing/#evolution-process) from the community, acting as the approver of these proposals.  Workgroup members help drive the Swift language forward coherently to create the best possible general-purpose programming language.  The Language Workgroup membership is expected to change over time.

The current Language Workgroup members are:

{% assign people = site.data.language_wg | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

#### Code Owners

Code owners are individuals assigned to specific areas of the Swift project, with code quality their primary responsibility. The umbrella Swift project is composed of numerous sub-projects including the Swift standard library, extensions to the LLDB debugger, and the Swift package manager, to name a few. Each sub-project will be assigned a code owner.  The code owner then works to get all contributions reviewed, gather feedback from the community, and shepherd approved patches into the product.

Anyone can review a piece of code, and we welcome code review from everyone that is interested. Code review procedures are not dictated by a central, global policy. Instead, the process is defined by each code owner.

Any community member that is active and shows themselves to be valuable can offer to become a code owner via posting to the forums, or be nominated by another member.  If fellow contributors agree, the project lead will make the appointment and add the new owner's name to the code owners file. The position is completely voluntary, and can be resigned at any time.

The list of current code owners can be found in the file `CODE_OWNERS.txt` in the root of the parent Swift source tree. We also maintain a mailing group so you can [send an email][email-owners] to all the code owners.

There may be nothing more important to the success of Swift than strong, engaged code owners. We all owe them respect, gratitude, and whatever help we can offer.


## License

The [Swift license](/LICENSE.txt) is based on the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.html) with a [Runtime Library Exception](#runtime-library-exception) that removes the attribution requirement when using Swift to build and distribute your own binaries. The Apache 2.0 license was chosen because it allows broad use of Swift, and is already well-understood by many potential contributors.

Copyright is held by the authors of the contributions, or the company or organization to which the individual belongs.  A list of copyright holders is maintained in the [CONTRIBUTORS.txt](/CONTRIBUTORS.txt) file on Swift.org and at the root of the repository.


### Runtime Library Exception

The Runtime Library Exception makes it clear that end users of the Swift compiler don’t have to attribute their use of Swift in their finished binary application, game, or service. End-users of the Swift language should feel unrestricted to create great software. The full text of this exception follows:

~~~~
As an exception, if you use this Software to compile your source code and
portions of this Software are embedded into the binary product as a result,
you may redistribute such product without providing attribution as would
otherwise be required by Sections 4(a), 4(b) and 4(d) of the License.
~~~~

This exception can also be found at the bottom of the [LICENSE.txt](/LICENSE.txt) file.


### Copyright and License in Source Code

All source files hosted on Swift.org must contain a comment block at the top of the file declaring the license and copyright that applies.  This text may be part of a larger header, for instance as defined in the [Contributing Code][contributing_code] section. Regardless of the header format, the wording for the license and copyright portion must be copied as follows, with the appropriate years applied:

~~~~
// This source file is part of the Swift.org open source project
//
// Copyright (c) {{site.time | date: "%Y"}} Apple Inc. and the Swift project authors
// Licensed under Apache License v2.0 with Runtime Library Exception
//
// See https://swift.org/LICENSE.txt for license information
// See https://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
~~~~


Each contributor is responsible for adding his or her name to the `CONTRIBUTORS.txt` file at the project's root and maintaining the contact information. If you are contributing under the umbrella of your company, please add your company’s information, and do not also list yourself as an additional copyright holder.


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

[github]: https://github.com/apple  "Apple's home page on GitHub"
[repo]: git+ssh://github.com/apple "Link to the repo hosted on GitHub"
[bugtracker]:  http://github.com/apple/swift/issues

[swift-apple]: https://developer.apple.com/swift  "Apple developer home page for Swift"
