---
layout: page
title: 社区概览
---

Swift.org 社区有一个独特的目标：打造世界上最好的通用编程语言。我们将在开放环境下共同开发这门语言，欢迎任何人参与贡献。本指南文档描述了Swift社区的组织方式，以便我们能够协同工作，为Swift添加令人惊叹的新功能，并使其能够被更多开发者在更多平台上使用。

## 交流方式

Swift语言在开放环境下开发，所有关于语言或社区流程的技术或管理主题都应该在Swift公共论坛上讨论。我们鼓励公开对话，Swift语言的活跃开发者应关注相关的论坛分类。

* 论坛分类目录和电子邮件说明在[论坛部分](#forums)。
* 所有Swift项目的源代码可以在GitHub上找到：[github.com/apple][github]。
* Swift语言的bug跟踪系统维护在[github.com/swiftlang/swift/issues][bugtracker]。

项目空间内的所有交流都应遵守Swift项目的[行为准则](/code-of-conduct)。

## 社区结构

要以连贯、清晰的视角推进Swift编程语言的发展需要强有力的领导。领导层来自社区，并与更广泛的贡献者和用户群体密切合作。社区内的角色包括：

* __[项目负责人](#project-lead)__ 从社区任命技术领导者。Apple Inc.是项目负责人，通过其代表与社区互动。
* __[核心团队](#core-team)__ 是负责Swift项目战略方向和监督的小组。
* __[代码所有者](#code-owners)__ 是负责Swift代码库特定领域的个人。
* __[提交者](/contributing/#commit-access)__ 是拥有Swift代码库提交权限的任何人。
* __[贡献者](/contributing/#contributing-code)__ 是提供补丁或帮助代码审查的任何人。
* __指导小组__
   * __[语言](#language-steering-group)__ 是推动Swift语言朝着连贯方向发展的专家小组。
   * __[平台](/platform-steering-group)__ 是使Swift语言及其工具能够在新环境中使用的专家小组。
* __工作组__
   * __[C++互操作性](/cxx-interop-workgroup)__ 是致力于添加Swift和C++之间双向互操作性支持的团队。
   * __[贡献者体验](/contributor-experience-workgroup)__ 是支持Swift项目贡献者的团队，包括在Swift论坛上的贡献。
   * __[文档](/documentation-workgroup)__ 是帮助指导Swift文档体验的团队。
   * __[服务器端Swift](/sswg)__ 是促进Swift在开发和部署服务器应用程序方面使用的团队。
   * __[网站](/website-workgroup/)__ 是帮助指导Swift.org网站发展的团队。

最重要的是，每个使用Swift的人都是我们扩展社区中的重要成员。

#### 项目负责人

[通过论坛联系](https://forums.swift.org/new-message?username=tkremenek)

Apple Inc. 是项目负责人，作为项目的仲裁者。项目负责人任命领导职位的高级人员，这些领导者来自全球Swift贡献者社区。社区领导者和代码贡献者共同努力不断改进Swift，该语言将通过每个参与者的良好工作而不断进步。

[Ted Kremenek](mailto:kremenek@apple.com)是Apple指定的代表，作为项目负责人的发言人。

#### 核心团队

[通过论坛联系](https://forums.swift.org/new-message?groupname=core-team)

核心团队为Swift社区的各个工作组和计划提供凝聚力，提供支持和战略调整。项目负责人任命核心团队成员,以带来经验、专业知识和领导力的混合,使该团队能够共同作为Swift项目和其社区的有效管理者。核心团队成员预计会随时间变化。

当前核心团队成员是:

{% assign people = site.data.core_team | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

我们感谢以下荣誉退休核心团队成员的服务:

{% assign people = site.data.core_team_emeriti | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

#### 语言指导小组

[通过论坛联系](https://forums.swift.org/new-message?groupname=language-workgroup)

语言指导小组由Swift项目负责人和核心团队认定的专家组成,这些专家具有平衡的视角和专业知识,可以审查、指导并战略性地调整语言的变化。语言指导小组审查并帮助迭代来自社区的[语言演进提案](/contributing/#evolution-process)。工作组成员帮助连贯地推动Swift语言向前发展,以创建最好的通用编程语言。语言指导小组成员预计会随时间变化。

当前语言指导小组成员是:

{% assign people = site.data.language_wg | sort: "name" %}
{% for person in people %}* {{ person.name }}
{% endfor %}

#### 代码所有者

[通过论坛联系](https://forums.swift.org/new-message?groupname=code-owners)

代码所有者是被分配到Swift项目特定领域的个人,代码质量是他们的主要责任。Swift总项目由众多子项目组成,包括Swift标准库、LLDB调试器的扩展和Swift包管理器等。每个子项目都会被分配一个代码所有者。代码所有者负责获取所有贡献的审查、收集社区反馈,并将批准的补丁整合到产品中。

任何人都可以审查代码,我们欢迎所有感兴趣的人进行代码审查。代码审查程序不由中央全局政策规定。相反,流程由每个代码所有者定义。

任何活跃且表现出价值的社区成员都可以通过在论坛上发帖提出成为代码所有者的建议,或由其他成员提名。如果其他贡献者同意,项目负责人将进行任命并将新所有者的名字添加到代码所有者文件中。这个职位完全是自愿的,可以随时辞职。

当前代码所有者列表可以在Swift源代码树根目录下的`CODE_OWNERS.txt`文件中找到。我们还维护着一个邮件组,您可以[发送电子邮件][email-owners]给所有代码所有者。

对Swift的成功而言,没有什么比强大、投入的代码所有者更重要。我们都欠他们尊重、感激之情,并应该提供我们能够给予的任何帮助。

每个贡献者都负责将自己的名字添加到项目根目录的`CONTRIBUTORS.txt`文件中并维护联系信息。如果您是在公司umbrella下做出贡献,请添加您公司的信息,而不要将自己也列为额外的版权持有人。

{% include_relative _forums.md %}

[homepage]: ./index.html "Swift.org主页"
[community]: ./community.html  "Swift.org社区概览"
[contributing_code]: /contributing/#contributing-code  "贡献代码"
[test_guide]: ./test_guide.html "编写优质Swift测试的详细指南"
[blog]: ./blog_home.html  "Swift.org工程博客"
[faq]: ./faq.html  "Swift.org常见问题解答"
[downloads]: ./downloads.html  "下载Swift工具的最新构建版本"
[forums]:  ./forums.html
[contributors]: ./CONTRIBUTORS.txt "查看所有Swift项目作者"
[owners]: ./CODE_OWNERS.txt "查看所有Swift项目代码所有者"
[license]: ./LICENSE.txt "查看Swift许可证"

[email-conduct]: mailto:conduct@swift.org  "向行为准则工作组发送电子邮件"
[email-owners]: mailto:code-owners@forums.swift.org  "向代码所有者发送电子邮件"
[email-users]: mailto:swift-users@swift.org  "向其他Swift用户发送电子邮件"
[email-devs]: mailto:swift-dev@swift.org  "向开发者讨论列表发送电子邮件"
[email-lead]: mailto:project-lead@swift.org "负责Swift.org的Apple领导者"

[github]: https://github.com/apple  "Apple在GitHub上的主页"
[repo]: git+ssh://github.com/apple "GitHub上托管的仓库链接"
[bugtracker]:  http://github.com/swiftlang/swift/issues

[swift-apple]: https://developer.apple.com/swift  "Apple开发者Swift主页"
