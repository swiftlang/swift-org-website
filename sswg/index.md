---
layout: page
title: Swift 服务端工作组 (SSWG)
---

Swift 服务端工作组是一个指导团队，旨在推广 Swift 在开发和部署服务端应用程序方面的应用。Swift 服务端工作组将：

* 明确并优先处理 Swift 服务端社区的需求。
* 为这些工作制定并实施[孵化流程](/sswg/incubation-process.html)，以减少重复工作、提高兼容性并推广最佳实践。
* 向 Swift 核心团队反馈服务端开发社区所需的 Swift 语言特性。

与 Swift 的[核心团队](/community#core-team)类似，该工作组负责提供总体技术方向，并制定库和工具的提议、开发和最终推荐的标准。工作组的成员资格基于贡献，预计将随时间演变。

当前的 Swift 服务端工作组由以下成员组成：

{% assign people = site.data.server-workgroup.members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
  ，{{ person.affiliation }}
{% endif %}
{% if person.github %}
  （<a href="https://github.com/{{person.github}}">@{{person.github}}</a>）
{% endif %}
</li>
{% endfor %}
</ul>

我们感谢以下荣誉退休工作组成员的服务：

{% assign people = site.data.server-workgroup.emeriti | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
  ，{{ person.affiliation }}
{% endif %}
{% if person.github %}
  （<a href="https://github.com/{{person.github}}">@{{person.github}}</a>）
{% endif %}
</li>
{% endfor %}
</ul>

## 交流方式

Swift 服务端工作组使用 [Swift 服务端论坛](https://forums.swift.org/c/server)进行一般性讨论。

## 社区参与

我们欢迎所有人通过以下方式参与贡献：

* 提议新的库和工具供考虑。
* 参与设计讨论。
* 在论坛上提问或回答问题。
* 报告或分类错误。
* 向库项目提交实现或测试的拉取请求。

这些对话将在 [Swift 服务端论坛](https://forums.swift.org/c/server)上进行。随着时间推移，工作组可能会形成较小的工作小组来专注于特定的技术领域。

## 章程

Swift 服务端工作组的主要目标是最终推荐用于 Swift 服务端应用程序开发的库和工具。该工作组与 Swift 演进流程的区别在于，工作组努力产生的面向服务端的库和工具将存在于 Swift 语言项目本身之外。工作组将致力于培育、成熟并推荐项目，直至它们进入开发和发布阶段。

## 成员资格

工作组的成员资格基于贡献，预计将随时间演变。添加新成员和移除不活跃成员需要经过 SSWG 投票，并要求一致同意。每个公司最多可有两名成员，以避免代表性过重。工作组总人数上限为十人，以保持组织的高效运作。成员任期上限为 2 年，但离任成员可在任期结束时重新申请。当多个候选人竞争同一席位时，SSWG 将在所有候选人中进行投票，最终在第一轮获得最多票数的两名候选人之间进行最后一轮投票。

希望加入工作组的公司或个人应通过在 [Swift 服务端论坛](https://forums.swift.org/c/server)上发帖申请。申请人将被邀请参加下一次可用的 SSWG 会议来陈述他们的理由。

连续四次未参加工作组会议的不活跃成员将被联系以确认其是否希望留在工作组。连续缺席十次会议后，SSWG 将就是否将其从工作组中移除进行投票。

## 投票

在各种情况下，SSWG 将举行投票。这些投票可以通过电话、电子邮件或在适当时通过投票服务进行。SSWG 成员可以回复"同意、是、+1"、"不同意、否、-1"或"弃权"。根据 SSWG 章程，投票需要获得三分之二的投票支持才能通过。弃权票等同于不投票。

## 会议时间

SSWG 每两周在周三太平洋时间下午 2:00（美国太平洋时间）召开一次会议。会议在[奇数周](http://www.whatweekisit.org)举行。
