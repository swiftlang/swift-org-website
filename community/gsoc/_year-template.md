---
redirect_from: "/gsoc{{YEAR}}/"
layout: page
title: Google Summer of Code {{YEAR}}
---

<!--
  GSoC year page template. Not published: Jekyll skips files that start with "_".

  To start a new year:
    1. mkdir community/gsoc/<year> && cp community/gsoc/_year-template.md community/gsoc/<year>/index.md
    2. Replace every {{YEAR}} with the year (front matter, forum tag, email tag, edit link).
    3. Add each project using the "Example project name" block, then delete the example.
    4. Add the new year to the years cards in _data/new-data/gsoc.
    5. When the year ends, replace the intro, "Tips for contacting mentors", "Participating in GSoC"
       and "Writing a proposal" with the archive intro, and add an "Accepted projects" section:

         Swift participated in Google Summer of Code {{YEAR}}, and N projects were accepted. This page
         records the accepted projects and the project ideas we offered that year. Browse the other
         years on the [GSoC page](/community/gsoc/).

         Discussions from this year are tagged [`gsoc-{{YEAR}}`](https://forums.swift.org/tag/gsoc-{{YEAR}}) on the Swift forums.
    6. Delete this comment.
-->

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [Google Summer of Code {{YEAR}}](https://summerofcode.withgoogle.com/). If you would like to apply to GSoC as a contributor, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
3. Check out the [Development forum](https://forums.swift.org/c/development/gsoc/98) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-{{YEAR}}` tag](https://forums.swift.org/tag/gsoc-{{YEAR}}), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform with spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

To start things off, we recommend starting a new thread or joining an existing discussion about the project you are interested in on the dedicated [GSoC forums category](https://forums.swift.org/c/development/gsoc/98). You should also _tag_ your thread with the `gsoc-{{YEAR}}` tag. It is best if you start a thread after having explored the topic a little bit already, and come up with specific questions about parts of the project you are not sure about. For example, you may have tried to build the project, but not sure where a functionality would be implemented; or you may not be sure about the scope of the project.

Please use the forums to tag and communicate with the project's mentor to figure out the details of the project, such that when it comes to writing the official proposal plan, and submitting it on the Summer of Code website, you have a firm understanding of the project and can write a good, detailed proposal (see next section about hints on that).

If you would like to reach out to a mentor privately rather than making a public forum post, and the forums are not allowing you to send private messages yet, please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc{{YEAR}}]` tag in the email subject and describe the project you would like to work on. We will route you to the appropriate mentor. In general, public communications on the forums are preferred though, as this is closer to the normal open-source way of getting things done in the Swift project.

## Participating in GSoC

Summer of Code is a *learning experience*, and while we allow the use of AI tools to assist your experience, you should not use them to completely automate any part of your GSoC experience with the Swift project.
For example, please do not use AI tools to generate project proposals, replies to discussions or questions from the community or mentors, or overly rely on coding assistants to perform the coding tasks of your project.
Make use of this experience to learn about the Swift project, community, and let us learn about you! It should be an enjoyable and personal experience for everyone involved.

For more details, please review the Swift project's guidelines on [use of AI tools in learning-oriented contributions](https://github.com/swiftlang/project-operations/blob/main/contributing/ai-tools.md#learning-oriented-contributions).

## Writing a proposal

Getting familiar with the codebase you are interested in working on during GSoC helps to write a good proposal because it helps you get a better understanding of how everything works and how you might best approach the project you are interested in. How you want to do that is really up to you and your style of learning. You could just clone the repository, read through the source code and follow the execution path of a test case by setting a breakpoint and stepping through the different instructions, read the available documentation or try to fix a simple bug in the codebase. The latter is how many open-source contributors got started, but it's really up to you. If you do want to go and fix a simple bug, our repositories contain a label "good first issue" that marks issues that should be easy to fix and doable by newcomers to the project.

When it comes to writing the proposal, the [Google Summer of Code Guide](https://google.github.io/gsocguides/student/writing-a-proposal) contains general, good advice.

The best proposals include a detailed timeline, specific milestones and goals as well as an outline the technical challenges you foresee. It is best if you engage with your potential project mentor on the forums before contributing, and have them clarify the goals and steps that they think are necessary for the project to be successful. Your proposal should have a clear goal, which can be successfully achieved as part of the weeks you'll be working it. Provide details about your approach, significant milestones you wish to achieve, and clarify with your potential mentor if they agree those seem reasonable. The time before proposal submissions is there for you to reach out and polish your proposal, so make sure you use it well! Good luck!

## Project ideas

We are currently collecting project ideas on the forums in the dedicated [GSoC category](https://forums.swift.org/c/development/gsoc/98).

Potential mentors, please feel free to propose project ideas to this page directly, by [opening a pull request](https://github.com/swiftlang/swift-org-website/edit/main/community/gsoc/{{YEAR}}/index.md) to the Swift website.

### Example project name

**Project size**: N hours

**Estimated difficulty**: ???

**Recommended skills**

- Basic proficiency in Swift.
- ...

**Description**

Description of the project goes here.

**Expected outcomes/benefits/deliverables**

- Expected deliverables of the project go here

**Potential mentors**

- Mentor name and link to their GitHub

