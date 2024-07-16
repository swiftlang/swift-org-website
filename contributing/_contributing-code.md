## Contributing Code

### Getting Started

It is highly recommended that you become familiar with using Swift in your own projects before contributing directly to the language itself. We put together handy [Getting Started][get_started] guides with step-by-step instructions to get you up and running.

### Incremental Development

The Swift project uses *small, incremental changes* as its preferred development model.  Sometimes these changes are small bug fixes. Other times, these changes are small steps along the path to reaching larger stated goals.  In contrast, long-term development branches can leave the community without a voice during development. Some additional problems with long-term branches include:

* Resolving merge conflicts can take a lot of time if branch development and mainline development occur in the same pieces of code.
* People in the community tend to ignore work on branches.
* Very large changes are difficult to code review.
* Branches are not routinely tested by the continuous integration infrastructure.


To address these problems, Swift uses an incremental development style.  Small changes are preferred whenever possible.  We require contributors to follow this practice when making large or otherwise invasive changes. Some tips follow:


* Large or invasive changes usually have secondary changes that must be made before the large change (for example, API cleanup or addition). Commit these changes before the major change, independently of that work.

* If possible, decompose the remaining interrelated work into unrelated sets of changes. Next, define the first increment and get consensus on the development goal of the change.

* Make each change in the set either stand alone (for example, to fix a bug) or part of a planned series of changes that work toward the development goal. Explaining these relationships to the community can be helpful.


If you are interested in making a large change and feel unsure about its overall effect, please make sure to first discuss the change and reach a consensus through the [developer forums](/community/#swift-development). Then ask about the best way to go about making the change.

[email-devs]: mailto:swift-dev@swift.org

{% comment %}
### Contributing a Change

When contributing a change, please do to the following:

- Please ensure your change applies against main (as current as possible).
- Related, please submit your change shortly after updating to main to stay in sync.
- Include new or updated tests that apply to your change.

When your change is ready, submit a [pull request](https://help.github.com/articles/using-pull-requests/).

Please do not add confidentiality or non-disclosure notices to the changes themselves as these conflict with the Swift license.
{% endcomment %}

### Commit Messages

Although we don't enforce a strict format for commit messages, we prefer that you follow the guidelines below, which are common among open source projects.  Following these guidelines helps with the review process, searching commit logs, and email formatting. At a high level, the contents of the commit message should be to convey the rationale of the change, without delving into much detail. For example, "bits were not set right" leaves the reviewer wondering about which bits and why they weren't "right". In contrast, "Correctly compute 'is dependent type' bits in 'Type'" conveys almost all there is to the change.

Below are some guidelines about the format of the commit message itself:

* Separate the commit message into a single-line *title* and a separate *body* that describes the change.
* Make the title concise to be easily read within a commit log and to fit in the subject line of a commit email.
* In changes that are restricted to a specific part of the code, include a [tag] at the start of the line in square brackets---for example, "[stdlib] ..." or "[SILGen] ...". This tag helps email filters and searches for post-commit reviews.
* When there is a body, separate it from the title by an empty line.
* Make body concise, while including the complete reasoning. Unless required to understand the change, additional code examples or other details should be left to bug comments or the mailing list.
* If the commit fixes an issue in the bug tracking system, include a link to the issue in the message.
* For text formatting and spelling, follow the same rules as documentation and in-code comments---for example, the use of capitalization and periods.
* If the commit is a bug fix on top of another recently committed change, or a revert or reapply of a patch, include the Git revision number of the prior related commit, e.g. "Revert abcdef because it caused bug#".

For minor violations of these guidelines, the community normally favors reminding the contributor of this policy over reverting. Minor corrections and omissions can be handled by sending a reply to the commits mailing list.

### Attribution of Changes

When contributors submit a change to a Swift subproject, after that change is approved, other developers with commit access may commit it for the author. When doing so, it is important to retain correct attribution of the contribution. Generally speaking, Git handles attribution automatically.

We do not want the source code to be littered with random attributions like "this code written by J. Random Hacker", which is noisy and distracting. Do not add contributor names to the source code or documentation.

In addition, don't commit changes authored by others unless they have submitted the change to the project or you have been authorized to submit on their behalf---for example, you work together and your company authorized you to contribute the changes. The author should first either submit the change through a pull request to the relevant project, email the development list, or add a bug tracker item. If someone sends you a change privately, encourage them to submit it to the appropriate list first.

### Code Templates

As mentioned in the [Community Overview][community], the license and copyright protections for Swift.org code are called out at the top of every source code file.  On the rare occasion you contribute a change that includes a new source file, ensure that the header is filled out appropriately.

For Swift source files the code header should look this:

~~~~swift
//===----------------------------------------------------------------------===//
//
// This source file is part of the Swift.org open source project
//
// Copyright (c) {{site.time | date: "%Y"}} Apple Inc. and the Swift project authors
// Licensed under Apache License v2.0 with Runtime Library Exception
//
// See https://swift.org/LICENSE.txt for license information
// See https://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
//
//===----------------------------------------------------------------------===//
~~~~

For C or C++ source or header files, the code header should look this:

~~~~cpp
//===-- subfolder/Filename.h - Very brief description -----------*- C++ -*-===//
//
// This source file is part of the Swift.org open source project
//
// Copyright (c) {{site.time | date: "%Y"}} Apple Inc. and the Swift project authors
// Licensed under Apache License v2.0 with Runtime Library Exception
//
// See https://swift.org/LICENSE.txt for license information
// See https://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
//
//===----------------------------------------------------------------------===//
///
/// \file
/// This file contains stuff that I am describing here in the header and will
/// be sure to keep up to date.
///
//===----------------------------------------------------------------------===//
~~~~

The divider lines should be exactly 80 characters wide to aid in adherence to the code style guidelines.  The bottom section contains an optional description intended for generated documentation (these lines begin with `///` rather than `//`).  If there is no description, this area can be skipped.

### Release Branch Pull Requests

A pull request targeting a release branch (`release/x.y` or `swift/release/x.y`)
cannot be merged without a GitHub approval by a corresponding branch manager.
In order for a change to be considered for inclusion in a release branch, the
pull request must have:

* A title starting with a designation containing the release version number of
  the target branch.

* [This][form] form filled out in its description. An item that is not
  applicable may be left blank or completed with an indication thereof, but must
  not be omitted altogether.

  To switch to this template when drafting a pull request in a
  [swiftlang][swiftlang] repository in a browser, append the
  `template=release.md` query parameter to the current URL and refresh.
  For example:
  ```diff
  -https://github.com/swiftlang/swift/compare/main...my-branch?quick_pull=1
  +https://github.com/swiftlang/swift/compare/main...my-branch?quick_pull=1&template=release.md
  ```

[Here](https://github.com/apple/swift/pull/73697) is an example.

[swiftlang]: https://github.com/swiftlang
[form]: https://github.com/swiftlang/.github/blob/main/PULL_REQUEST_TEMPLATE/release.md?plain=1

### Code Review

The Swift project relies heavily on code review to improve software quality:


* All significant changes, by all developers, must be reviewed before they are committed to the repository.  Smaller changes (or changes where the developer owns the component) can be reviewed after being committed.
* Code reviews are conducted on GitHub (through comments on pull requests or commits) and are reflected on the relevant project's commit mailing list.
* The developer responsible for a code change is also responsible for making all necessary review-related changes.


Code review can be an iterative process, which continues until the change is ready to be committed. After a change is sent out for review it needs an explicit approval before it's submitted. Do not assume silent approval or request active objections to the patch by setting a deadline.

Sometimes code reviews will take longer than you would hope for, especially for larger features. Here are some accepted ways to speed up review times for your patches:


* **Review other people's changes.** If you help out, everybody will be more willing to do the same for you.  Goodwill is our currency.
* **Split your change into multiple smaller changes.** The smaller your change, the higher the probability that somebody will take a quick look at it.
* **Ping the change.** If it is urgent, provide reasons why it is important to get this change landed and ping it every couple of days. If it is not urgent, the common courtesy ping rate is one week. Remember that you're asking for valuable time from other professional developers.

Note that anyone is welcome to review and give feedback on a change, but only people with commit access to the repository can approve it.

### Testing

Developers are required to create test cases for any bugs fixed and any new features added, and to contribute them along with the changes.

* All feature and regression test cases are added to the appropriate test directory---for example, the `swift/test` directory.
* Write test cases at the abstraction level nearest to the actual feature. For example, if it's a Swift language feature, write it in Swift; if it's a SIL optimization, write it in SIL.
* Reduce test cases as much as possible, especially for regressions. It's unacceptable to place an entire failing program into `swift/test` because this slows down testing for all developers. Please keep them short.

### Quality

People depend on Swift to create their production software.  This means that a bug in Swift could cause bugs in thousands, even millions of developers' products.  Because of this, the Swift project maintains a high bar for quality.  The minimum quality standards that any change must satisfy before being committed to the main development branch include:

1. Code must compile without errors or warnings on at least one platform.
2. Bug fixes and new features must include a test case to pinpoint any future regressions, or include a justification for why a test case would be impractical.
3. Code must pass the appropriate test suites---for example, the `swift/test` and `swift/validation-test` test suites in the Swift compiler.

Additionally, the committer is responsible for addressing any problems found in the future that the change may cause. This responsibility means that you may need to update your change in order to:

* Ensure the code compiles cleanly on all primary platforms.
* Fix any correctness regressions found in other test suites.
* Fix any major performance regressions.
* Fix any performance or correctness regressions in the downstream Swift tools.
* Fix any performance or correctness regressions that result in customer code that uses Swift.
* Address any bugs that appear in the bug tracker as a result from your change.

We prefer that these issues be handled before submission, but we understand that it isn’t possible to test all of this for every submission. Our continuous integration (CI) infrastructure normally finds these problems. We recommend watching the CI infrastructure throughout the next day to look for regressions. The CI infrastructure will directly email you if a group of commits that included yours caused a failure. You are expected to check those messages to see whether they are your fault and, if so, fix the breakage.

Commits that clearly violate these quality standards may be reverted, in particular when the change blocks other developers from making progress. The developer is welcome to recommit the change after the problem has been fixed.

### Commit Access

Commit access is granted to contributors with a track record of submitting high-quality changes. If you would like commit access, please send an email to [the code owners list](mailto:code-owners@forums.swift.org) with the GitHub user name that you want to use and a list of 5 non-trivial pull requests that were accepted without modifications.

Once you’ve been granted commit access, you will be able to commit to all of the GitHub repositories that host Swift.org projects.  To verify that your commit access works, please make a test commit (for example, change a comment or add a blank line).  The following policies apply to users with commit access:

* You are granted commit-after-approval to all parts of Swift. To get approval, create a pull request. When the pull request is approved, you may merge it yourself.

* You may commit an obvious change without first getting approval. The community expects you to use good judgment. Examples are reverting obviously broken patches, correcting code comments, and other minor changes.

* You are allowed to commit changes without approval to the portions of Swift to which you have contributed or for which you have been assigned responsibility. Such commits must not break the build. This is a “trust but verify” policy, and commits of this nature are reviewed after being committed.

Multiple violations of these policies or a single egregious violation may cause commit access to be revoked.  Even with commit access, your changes are still subject to [code review](#code-review). Of course, you are also encouraged to review other peoples’ changes.

[community]: /community  "Swift.org community overview"
[get_started]: /getting-started/ "How to setup your own version of Swift"

