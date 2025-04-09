## 贡献代码

### 入门指南

在直接为 Swift 语言本身做贡献之前，强烈建议你先在自己的项目中熟悉使用 Swift。我们准备了详细的[入门指南][get_started]，提供了分步说明来帮助你快速上手。

### 渐进式开发

Swift 项目采用*小型、渐进式的变更*作为其首选的开发模式。有时这些变更是小的错误修复。其他时候，这些变更是实现更大目标道路上的小步骤。相比之下，长期开发分支可能会导致社区在开发过程中失去发言权。长期分支还存在以下一些问题：

* 如果分支开发和主线开发在相同的代码部分进行，解决合并冲突可能会花费大量时间。
* 社区成员往往会忽视分支上的工作。
* 非常大的变更很难进行代码审查。
* 分支不会被持续集成基础设施定期测试。

为了解决这些问题，Swift 采用渐进式开发风格。在可能的情况下，优先选择小的变更。我们要求贡献者在进行大型或具有侵入性的变更时遵循这种做法。以下是一些建议：

* 大型或侵入性变更通常需要在主要变更之前进行一些次要变更（例如，API 清理或添加）。在进行主要变更之前，独立提交这些变更。

* 如果可能，将剩余的相互关联的工作分解为互不相关的变更集。然后，定义第一个增量并就变更的开发目标达成共识。

* 使变更集中的每个变更要么是独立的（例如，修复错误），要么是朝着开发目标前进的计划系列变更的一部分。向社区解释这些关系会很有帮助。

如果你想进行大型变更但对其整体影响感到不确定，请务必先通过[开发者论坛](/community/#swift-development)讨论变更并达成共识。然后询问如何最好地进行这个变更。

[email-devs]: mailto:swift-dev@swift.org

### 提交信息

虽然我们不强制要求特定的提交信息格式，但我们建议你遵循以下在开源项目中常见的指导原则。遵循这些指导原则有助于代码审查过程、搜索提交日志和邮件格式化。从高层次来看，提交信息的内容应该传达变更的理由，而不需要深入太多细节。例如，"位没有设置正确"让审查者不清楚是哪些位以及为什么它们不"正确"。相比之下，"在'Type'中正确计算'is dependent type'位"几乎传达了变更的全部内容。

以下是关于提交信息格式本身的一些指导原则：

* 将提交信息分为单行*标题*和描述变更的单独*正文*。
* 使标题简洁，以便在提交日志中易于阅读，并适合作为提交邮件的主题行。
* 在仅限于代码特定部分的变更中，在行首用方括号包含[标签]---例如，"[stdlib] ..."或"[SILGen] ..."。这个标签有助于邮件过滤和提交后审查的搜索。
* 当有正文时，用空行将其与标题分开。
* 使正文简洁，但包含完整的推理。除非理解变更需要，否则额外的代码示例或其他细节应留在错误评论或邮件列表中。
* 如果提交修复了错误跟踪系统中的问题，在信息中包含该问题的链接。
* 对于文本格式和拼写，遵循与文档和代码内注释相同的规则---例如，大写字母和句号的使用。
* 如果提交是在另一个最近提交的变更之上的错误修复，或者是补丁的还原或重新应用，请包含先前相关提交的 Git 修订号，例如"还原 abcdef，因为它导致 bug#"。

对于这些指导原则的轻微违反，社区通常倾向于提醒贡献者这个政策，而不是还原。小的更正和遗漏可以通过向提交邮件列表发送回复来处理。

### 变更归属

当贡献者向 Swift 子项目提交变更时，在该变更被批准后，其他具有提交权限的开发者可以代表作者提交。这样做时，保持正确的贡献归属很重要。一般来说，Git 会自动处理归属。

我们不希望源代码中充斥着像"此代码由 J. Random Hacker 编写"这样随意的归属，这会造成干扰和分散注意力。不要在源代码或文档中添加贡献者姓名。

此外，除非他人已向项目提交了变更，或者你已获得代表他们提交的授权（例如，你们一起工作，你的公司授权你贡献这些变更），否则不要提交他人编写的变更。作者应该首先通过向相关项目提交拉取请求、向开发邮件列表发送邮件或添加错误跟踪器项目来提交变更。如果有人私下向你发送变更，请鼓励他们首先将其提交给适当的列表。

### 代码模板

如[社区概述][community]中所述，Swift.org 代码的许可证和版权保护在每个源代码文件的顶部都有说明。在极少数情况下，如果你贡献的变更包含新的源文件，请确保适当填写头部信息。

对于 Swift 源文件，代码头部应该如下所示：

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

对于 C 或 C++ 源文件或头文件，代码头部应该如下所示：

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

分隔线应该正好是 80 个字符宽，以帮助遵守代码风格指南。底部部分包含用于生成文档的可选描述（这些行以 `///` 开头，而不是 `//`）。如果没有描述，可以跳过这个区域。

### 发布分支拉取请求

针对发布分支（`release/x.y` 或 `swift/release/x.y`）的拉取请求在没有相应分支管理员的 GitHub 批准的情况下不能合并。为了使变更被考虑纳入发布分支，拉取请求必须：

* 标题以包含目标分支发布版本号的标识开头。

* 在其描述中填写[此][form]表单。不适用的项目可以留空或填写相应说明，但不能完全省略。

  在浏览器中为 [swiftlang][swiftlang] 仓库起草拉取请求时，要切换到此模板，请在当前 URL 后附加 `template=release.md` 查询参数并刷新。
  例如：
  ```diff
  -https://github.com/swiftlang/swift/compare/main...my-branch?quick_pull=1
  +https://github.com/swiftlang/swift/compare/main...my-branch?quick_pull=1&template=release.md
  ```

[这里](https://github.com/swiftlang/swift/pull/73697)是一个示例。

[swiftlang]: https://github.com/swiftlang
[form]: https://github.com/swiftlang/.github/blob/main/PULL_REQUEST_TEMPLATE/release.md?plain=1

### 代码审查

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

### Contributor Ladder

This contributor ladder defines the roles you might gain while contributing to Swift on GitHub. Each role has privileges associated, which requires building trust with the community of contributors. We recognize there are many different types of contributors to Swift and we appreciate every single one! Everyone who has participated in the open source Swift project is a *Contributor*: This can be by writing code, answering questions on the forums, reporting or triaging bugs, or participating in the Swift evolution process.

As you climb the contributor ladder by contributing to Swift on GitHub, you gain new privileges but also gain trust and responsibilities that you are expected to fulfill. If a contributor violates this trust and these responsibilities, the Core Team may give them a notice and upon repeated infringements revoke their level. We believe in a healthy community and hope this action will never be necessary.

#### Member

A *Member* has constructively contributed to Swift multiple times. This role is held across the entire organization, becoming a *Member* allows you to trigger CI on all repositories in the swiftlang organization on GitHub.

- Requirements
  - Make multiple constructive contributions to the Swift projects. This can be in the form of PRs, engagement on the Swift Forums, filing valuable issue, triaging them, or similar.
- Privileges
  - Ability to trigger CI testing
  - Show your membership in the swiftlang organization on your GitHub profile
- Nomination
  - If you would like to become a member, please send an email to [the code owners list](mailto:code-owners@forums.swift.org) that includes your contribution and the GitHub user name that you want to use
- Growth
  - Show that you use the privileges constructively and continue contributing to gain commit access.

#### Commit Access

Commit access is granted to contributors with a track record of submitting high-quality changes. If you would like commit access, please send an email to [the code owners list](mailto:code-owners@forums.swift.org) with the GitHub user name that you want to use and a list of 5 non-trivial pull requests that were accepted without modifications.

Once you’ve been granted commit access, you will be able to commit to all of the GitHub repositories that host Swift.org projects.  To verify that your commit access works, please make a test commit (for example, change a comment or add a blank line).  The following policies apply to users with commit access:

* You are granted commit-after-approval to all parts of Swift. To get approval, create a pull request. When the pull request is approved, you may merge it yourself.

* You may commit an obvious change without first getting approval. The community expects you to use good judgment. Examples are reverting obviously broken patches, correcting code comments, and other minor changes.

* You are allowed to commit changes without approval to the portions of Swift to which you have contributed or for which you have been assigned responsibility. Such commits must not break the build. This is a “trust but verify” policy, and commits of this nature are reviewed after being committed.

Multiple violations of these policies or a single egregious violation may cause commit access to be revoked.  Even with commit access, your changes are still subject to [code review](#code-review). Of course, you are also encouraged to review other peoples’ changes.


#### Code Owners

Code owners are individuals assigned to specific areas of the Swift project, with code quality their primary responsibility. The umbrella Swift project is composed of numerous sub-projects including the Swift standard library, extensions to the LLDB debugger, and the Swift package manager, to name a few. Each sub-project will be assigned a code owner.  The code owner then works to get all contributions reviewed, gather feedback from the community, and shepherd approved patches into the product.

Anyone can review a piece of code, and we welcome code review from everyone that is interested. Code review procedures are not dictated by a central, global policy. Instead, the process is defined by each code owner.

Any community member that is active and shows themselves to be valuable can offer to become a code owner via posting to the forums, or be nominated by another member.  If fellow contributors agree, the project lead will make the appointment and add the new owner's name to the code owners file. The position is completely voluntary, and can be resigned at any time.

The list of current code owners can be found in the file `CODE_OWNERS.txt` in the root of the parent Swift source tree. We also maintain a mailing group so you can [send an email](mailto:code-owners@forums.swift.org) to all the code owners.

There may be nothing more important to the success of Swift than strong, engaged code owners. We all owe them respect, gratitude, and whatever help we can offer.


Each contributor is responsible for adding his or her name to the `CONTRIBUTORS.txt` file at the project's root and maintaining the contact information. If you are contributing under the umbrella of your company, please add your company’s information, and do not also list yourself as an additional copyright holder.


[community]: /community  "Swift.org 社区概述"
[get_started]: /getting-started/ "如何设置你自己的 Swift 版本"