---
layout: page
title: Foundation 工作组
---

Foundation 工作组负责管理 Swift Foundation 项目。Foundation 提供了许多应用程序常用的基础功能层。它包含了数字、数据、URL 和日期等基本类型，以及任务管理、文件系统访问、本地化等功能。

Foundation 工作组将：

* 为 Foundation 的发展方向设定高层次目标
* 审查社区 API 提案，优先考虑符合项目目标的提案
* 制定管理 Foundation 及其相关项目贡献的流程
* 向 Swift 核心团队反馈 Swift 社区的需求

Foundation 工作组的现任成员包括：

{% assign people = site.data['foundation-workgroup'].members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
，{{ person.affiliation }}
{% endif %}
{% if person.handle %}
（<a href="https://forums.swift.org/new-message?username={{person.handle}}">@{{person.handle}}</a>）
{% endif %}
</li>
{% endfor %}
</ul>


## 章程

Foundation 项目的目标是提供最好的基础数据类型和国际化功能，并使其对所有 Swift 开发者可用。它利用语言中新增的特性，使库和应用程序开发者能够自信地构建更高层次的 API。

这种信心的重要来源之一是采用[以社区为中心的 API 审查流程](https://github.com/swiftlang/swift-foundation/blob/main/Evolution.md)。Foundation 工作组负责监督这个流程，并与 Swift 项目、苹果平台和其他平台的发展密切协调。工作组成员审查并与贡献者合作完善 API 提案，在 [Github Issues](https://github.com/swiftlang/swift-foundation/issues) 上分类处理错误和功能请求，并通过拉取请求和论坛帖子提供反馈以整合变更。工作组成员还会关注 Swift 生态系统中的新趋势，并讨论如何使库与语言保持一致。

工作组每季度召开一次会议，并在审查期结束时召开会议以接受或退回需要修改的提案。

### 演进流程

Foundation 工作组遵循[Foundation GitHub 仓库](https://github.com/swiftlang/swift-foundation/blob/main/Evolution.md)中记录的演进流程。

### 成员资格

Foundation 工作组成员按照上述章程为 Foundation 项目提供管理。工作组成员由具有不同背景的 Swift 社区成员组成。

核心团队还会选择工作组中的一名成员担任主席。主席对工作组没有特殊权力，但他们负责确保工作组顺利运作，包括：

* 组织和主持定期会议。
* 确保工作组与社区进行有效沟通。
* 在需要向核心团队提出问题时，协调工作组代表与核心团队之间的会议。

工作组成员将尽可能独立通过共识做出决定，并在就重要决定达成共识遇到特殊挑战时向核心团队提出问题。

## 沟通

Foundation 工作组通过[论坛](https://forums.swift.org/c/related-projects/foundation/99)与更广泛的 Swift 社区进行一般性讨论。

也可以通过在 Swift 论坛上向 [@foundation-workgroup](https://forums.swift.org/new-message?groupname=foundation-workgroup) 发送消息与工作组进行私下联系。

## 社区参与

Foundation 欢迎来自社区的贡献，包括错误修复、测试、文档和对新平台的移植。请查看 [`CONTRIBUTING`](https://github.com/apple/swift-foundation/blob/main/CONTRIBUTING.md) 文档了解更多信息，包括在 Foundation 中接受社区贡献新 API 的流程。我们也非常欢迎您在上述社区 API 审批流程和演进流程中提供评论和审查。

与代码无关的一般性主题讨论在[论坛](https://forums.swift.org/c/related-projects/foundation/99)上进行。您也可以通过向 [@foundation-workgroup](https://forums.swift.org/new-message?groupname=foundation-workgroup) 发送消息来联系工作组。主席会在定期工作组会议期间向工作组提交未解决的问题和主题列表。工作组将决定这些问题的处理方案。 

