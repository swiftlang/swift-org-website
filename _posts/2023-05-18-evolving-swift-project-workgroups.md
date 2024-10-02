---
layout: new-layouts/blog
published: true
date: 2023-05-18 10:30:00
title: Evolving the Swift Workgroups
author: [tkremenek]
---

Today, the Swift Core Team is announcing forward-looking changes to the structure of Swift, the work, and the people around it. These changes include new groups, names, organization, as well as inclusion as a first-class concept for each group:

* We are organizing all workgroups into two tiers — steering groups and workgroups.

* We are incorporating the core mission of Diversity in Swift in all workgroups.

* We are creating the Ecosystem Steering Group and Contributor Experience Workgroups to provide vital support for the growing Swift developer ecosystem and community.

Let's dive into the details.

## Steering Groups and Workgroups

Until today, the Swift project used "team" and "workgroup" interchangeably to describe groups working together on some community effort or area of responsibility.

Aside from using "team" for the Core Team, we will consistently use the term **group**.

Each group will have a clear charter and focus.  Groups can also have **subgroups** that are smaller scoped units of focus under another group.

There are two kinds of groups:

* **Steering groups** are responsible for the overall strategic direction in a broad area or a necessary process that affects the entire community.

* **Workgroups** represent functional areas of the project and drive work in a particular area.  Subgroups of workgroups help further refine tasks and deliverables.  Workgroups are long-term and focus on a specific domain.  Various active contributors lead workgroups.

The purpose of workgroups is to provide structure to help support contributors in organizing and driving activity.  However, workgroups are only one of the ways to organize and contribute to Swift.  Most contributions and community activities begin and grow organically.  Once an effort reaches sufficient momentum and size where it could benefit from support from the Swift project, forming a workgroup for that effort makes sense.

Note that the [evolution workgroups](https://github.com/swiftlang/swift-evolution/blob/main/process.md) as described in the Swift Evolution process, can either be steering groups or workgroups.  Evolution workgroups are groups that utilize or manage the Swift Evolution process in some way to achieve their core charter.

### Adopting the "Groups" Terminology

We are adjusting the names of the current groups and "teams" to match the new terminology.

Steering groups:

* The **Language Workgroup** becomes the **Language Steering Group**, and continues to use the Swift Evolution process to help drive the language forward. The group's membership will change over time as contributors are recognized for their active participation in helping shape the direction of the Swift language.

Workgroups:

* The **Server Workgroup**, often referred to as the "Swift on Server Workgroup," promotes the use of Swift for developing and deploying server applications.
The workgroup has helped [incubate](/sswg/incubation-process.html) more than twenty critical server libraries, some of which the workgroup members developed together with the rest of the community.  It also published in-depth guides for developing, deploying, and troubleshooting server applications written in Swift.

* The **Documentation Workgroup** helps guide the documentation experience for Swift.  The workgroup shepherds the development of [Swift-DocC](https://github.com/swiftlang/swift-docc) features that bring exciting ways to customize and enhance the experience of authored API documentation.  The group also published a revamped version of _[The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)_ book written using DocC and maintained by the open source community.

* The **Website Workgroup** helps guide the evolution on the [Swift.org](http://swift.org/) website. Since its inception, the website workgroup has helped review and integrate community-driven improvements to the website, including the introduction of server development guides in collaboration with the server workgroup, integration of the Swift Evolution dashboard, and numerous documentation and language fixes. The workgroup has also established a process for community-driven blog posts (initially piloted by the Diversity in Swift workgroup) designed to provide opportunities for community members to showcase their journey with Swift.

* The **C++ Interoperability Workgroup** works to build and advance the interoperability support between Swift and C++, prototyping and proposing changes to Swift that go through the Swift Evolution process.

Overseeing the steering and workgroups is the **Swift Core Team**.  We briefly considered adjusting its name to adopt the "group" terminology, but decided to retain its "team" name because it has been in use for so long and is widely recognized by the community.  The Swift Core team, is a body that provides cohesion and strategic alignment across the Swift community's various Groups and initiatives.  The Project Lead appoints members of the Core Team to bring a mixture of experience, expertise, and leadership so the group may act as effective stewards for the Swift project and its community.  The Core Team's membership will change over time, and the size and shape will evolve with the Swift project's needs.  The Core Team does not make decisions by voting but by general consensus, with the Project Lead stepping in to resolve discussions.

## Extending Diversity in Swift

The Diversity in Swift Workgroup's mission is to identify pathways to contribute outside the main Swift codebase by creating intentional, concerted efforts to bring new voices to the community.  Its achievements are lasting:  we now have a community-written blog post process, mentoring programs, and specific community groups for developers to connect with others who have similar experiences and backgrounds, such as Women in Swift, Black in Swift, and Pride in Swift.

Inclusion and diversity are fundamental values in the Swift project that need to be ingrained in the project's day-to-day operation.

Today, Diversity in Swift is growing as a shared responsibility throughout the Swift project structure.  Each group will designate an individual to serve in the new, rotating role of a Diversity in Swift champion.  Diversity in Swift champions across all groups will work together to guide their respective groups to participate in initiatives such as the Swift Mentorship Program and form new initiatives.  They will provide a feedback channel for members of the Swift community to discuss the topic of inclusion and diversity.

The current members and initiatives of the Diversity in Swift Workgroup will be spread out among the other groups and incorporated into their respective charters.  New groups formed in the future will be required to designate a Diversity in Swift champion and address how the workgroup will uphold our values of inclusion in the charter.

## Announcing New Groups

Over the coming weeks, the Swift project will add two new groups to provide support in areas of growing momentum in the Swift project.  This overall picture of groups will look as follows:

![Swift Workgroups Diagram](/assets/images/evolving-workgroups-blog/community-structure.png)

### Ecosystem Steering Group

Notably, we will be creating a new **Ecosystem Steering Group.**

Successful programming languages have an extensive supporting system focused on developer experience and productivity through tooling, documentation, and other development resources.

The new Ecosystem Steering Group will focus on growing that support structure for Swift.  It will support the evolution of developer and documentation tooling, the Swift.org website, the package manager, and the package ecosystem.  The steering group will also support the work to bring Swift to additional platforms and the tooling to make creating such ports easier.  Finally, the group will support the growth of Swift in standard or industry-leading developer productivity tooling including cloud-based IDEs and continuous integration systems.

A follow-up announcement will provide additional details on the charter of the Ecosystem Steering Group, its scope and responsibilities. With its charter formalized, the new steering group will form an additional set of workgroups to drive specific initiatives within its charter.  The Core Team will choose the inaugural members of the Ecosystem Steering Group.

### Contributor Experience Workgroup

Finally, a new **Contributor Experience Workgroup** will create new pathways into the open source Swift community, including the Swift Mentorship Program and Community Groups.

This shift in stewardship will enable the Diversity in Swift champions to focus on diversity being both at the core and pervasive throughout the project and Swift community, while the Contributor Experience group will support all forms of contributing to the Swift project.

The new Contributor Experience workgroup will explore providing community members with the best support system and mechanics. Some example investments from this new workgroup will be improvements to the process and documentation for contributing code, bug reports, discussion on the Swift Forums, and more.

For more details, please see the [Contributor Experience Workgroup Charter](/contributor-experience-workgroup).

## Next Steps and You

If you're interested in getting involved, check out the charters of the above groups, or read about other ways to [contribute to the project](/contributing/). If you have contributed and don’t fall neatly into one of the groups above, keep going! All contributions are valuable.

If you want to keep up with these changes, we invite you to join us for the kick-off of our Contributor Meeting series, occurring quarterly. Keep an eye out for more information on the Swift forums.

Onward!

### Previous Related Announcements

* [Documentation Workgroup announcement](/blog/documentation-workgroup/)
* [Language Workgroup announcement](/blog/language-workgroup/)
* [Website Workgroup announcement](/blog/website-open-source/)
* [Server Workgroup announcement](/blog/server-api-workgroup/)
