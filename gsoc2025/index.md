---
layout: page
title: Project Ideas for GSoC 2025
---

This page contains a non-exhaustive list of potential project ideas that we are keen to develop during [Google Summer of Code 2025](https://summerofcode.withgoogle.com/). If you would like to apply to GSoC as a contributor, please follow these steps to get started:

1. Read through this page and the Google Summer of Code guides,
2. Identify, or come up with your own project ideas you find interesting.
3. Check out the [Development forum](https://forums.swift.org/c/development/gsoc/98) to connect with potential mentors.
- Feel free to mention the project mentors on the forums, when starting a thread about your interest in participating in a specific project they are offering to mentor.

When posting on the forums about GSoC this year, please use the [`gsoc-2025` tag](https://forums.swift.org/tag/gsoc-2025), so it is easy to identify.

## Tips for contacting mentors

The Swift forums are powered by discourse, a discussion forums platform with spam avoidance mechanisms built-in. If this is your first time joining the forums, you _may_ not be able to send mentors a direct message, as this requires a minimum amount of prior participation before the "send private message" feature is automatically enabled.

To start things off, we recommend starting a new thread or joining an existing discussion about the project you are interested in on the dedicated [GSoC forums category](https://forums.swift.org/c/development/gsoc/98). You should also _tag_ your thread with the `gsoc-2025` tag. It is best if you start a thread after having explored the topic a little bit already, and come up with specific questions about parts of the project you are not sure about. For example, you may have tried to build the project, but not sure where a functionality would be implemented; or you may not be sure about the scope of the project.

Please use the forums to tag and communicate with the project's mentor to figure out the details of the project, such that when it comes to writing the official proposal plan, and submitting it on the Summer of Code website, you have a firm understanding of the project and can write a good, detailed proposal (see next section about hints on that).

If you would like to reach out to a mentor privately rather than making a public forum post, and the forums are not allowing you to send private messages yet, please reach out to Konrad Malawski at `ktoso AT apple.com` directly via email with the `[gsoc2024]` tag in the email subject and describe the project you would like to work on. We will route you to the appropriate mentor. In general, public communications on the forums are preferred though, as this is closer to the normal open-source way of getting things done in the Swift project.

## Writing a proposal

Getting familiar with the codebase you are interested in working on during GSoC helps to write a good proposal because it helps you get a better understanding of how everything works and how you might best approach the project you are interested in. How you want to do that is really up to you and your style of learning. You could just clone the repository, read through the source code and follow the execution path of a test case by setting a breakpoint and stepping through the different instructions, read the available documentation or try to fix a simple bug in the codebase. The latter is how many open-source contributors got started, but it’s really up to you. If you do want to go and fix a simple bug, our repositories contain a label “good first issue” that marks issues that should be easy to fix and doable by newcomers to the project.

When it comes to writing the proposal, the [Google Summer of Code Guide](https://google.github.io/gsocguides/student/writing-a-proposal) contains general, good advice.

## Potential Projects

We are currently collecting project ideas on the forums in the dedicated [GSoC](https://forums.swift.org/c/development/gsoc/98).

Potential mentors, please feel free to propose project ideas to this page directly, by [opening a pull request](https://github.com/swiftlang/swift-org-website/edit/main/gsoc2025/index.md) to the Swift website. 

You can browse previous year's project ideas here: [2024](https://www.swift.org/gsoc2024/), [2023](https://www.swift.org/gsoc2023/), [2022](https://www.swift.org/gsoc2022/), [2021](https://www.swift.org/gsoc2021/), [2020](https://www.swift.org/gsoc2020/), [2019](https://www.swift.org/gsoc2019/).


### Re-implement property wrappers with macros

**Project size**: 350 hours

**Estimated difficulty**: Intermediate

**Recommended skills**

- Proficiency in Swift and C++

**Description**

[Property wrappers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md) feature is currently implemented purely within the compiler but with the addition of [Swift Macros](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0389-attached-macros.md) and [init accessors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0400-init-accessors.md) it's now possible to remove all ad-hoc code from the compiler and implement property wrappers by using existing features.

This work would remove a lot of property wrapper-specific code throughout the compiler - parsing, semantic analysis, SIL generation etc. which brings great benefits by facilitating code reuse, cleaning up the codebase and potentially fixing implementation corner cases. Macros and init accessors in their current state might not be sufficient to cover all of the property wrapper use scenarios, so the project is most likely going to require improving and expanding the aforementioned features as well.


**Expected outcomes/benefits/deliverables**

The outcome of this project is the complete removal of all property wrappers-specific code from the compiler. This benefits the Swift project in multiple areas - stability, testability and code health.

**Potential mentors**

- [Pavel Yaskevich](https://github.com/xedin)

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

- Mentor name and link to their github

