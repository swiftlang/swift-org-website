---
layout: page
title: Swift.org 网站工作组（SWWG）
---

有关 Swift.org 网站目标、内容管理和贡献指南的更多信息，请参阅[网站概述](/website)。

Swift 网站工作组是一个指导团队，帮助引导 Swift.org 网站的发展。Swift 网站工作组将：

* 制定一套管理 Swift.org 网站贡献的流程。
* 积极指导 Swift.org 网站的开发和贡献。
* 确定并优先处理满足 Swift 社区需求的 Swift.org 网站相关工作。
* 向 Swift 核心团队传达 Swift 社区的需求反馈。

与 Swift 的[核心团队](/community#core-team)类似，工作组负责建立流程和标准，用于提议并最终整合对 Swift.org 网站的更改。

当前网站工作组由以下成员组成：

{% assign people = site.data.website-workgroup.members | sort: "name" %}
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

{% assign people = site.data.website-workgroup.emeriti | sort: "name" %}
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

## 章程

Swift 网站工作组的主要目标是制定一套管理 Swift.org 网站贡献的流程，并根据上述网站目标积极指导贡献者。

为此，工作组成员审查对网站的更改提案（无论是在拉取请求中还是在工作组正式沟通渠道中发布的想法），并提供反馈，以努力以符合网站目标的方式整合这些更改。

工作组成员还可以发起项目，以改进 Swift.org 网站的不同方面，包括其内容、信息设计、用户体验和界面设计以及技术基础设施。
例如，工作组的初始目标之一是启动建设一个新网站，该网站使用 Swift 构建，并采用不同的信息和用户体验/界面设计。

Swift 网站工作组的成员由 Swift 核心团队和 Swift 项目负责人酌情任命，后者对工作组的决策拥有最终决定权。

## 成员资格

Swift 网站工作组的成员由 Swift 项目核心团队根据其专业知识和对社区的贡献任命。
工作组的成员资格基于贡献，预计会随时间演变。
添加新成员和移除不活跃成员需要工作组投票，并要求一致同意。
工作组的投票结果随后需要得到 Swift 核心团队的批准。

希望加入工作组的个人应通过在 Swift 论坛上私下联系 [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) 来表达他们的兴趣。
申请将在下一次可用的工作组会议上进行审查。

为保持团队规模适中以确保效率，成员总数上限为十人。

成员任期上限为 2 年，但离任成员可在任期结束时重新申请。
当多个候选人竞争同一席位时，工作组将对所有候选人进行投票，最后在第一轮获得最多票数的两名候选人之间进行最终投票。

连续 3 个月不参与活动的不活跃成员将被联系以确认其是否希望留在团队中。
如果 6 个月内没有活动，工作组将就将其从团队中移除进行投票。

## 投票

在各种情况下，工作组应举行投票。这些投票可以通过电话、电子邮件或在适当时通过投票服务进行。工作组成员可以回复"同意、是、+1"、"不同意、否、-1"或"弃权"。根据工作组章程，投票需要获得三分之二的投票支持才能通过。弃权票等同于不投票。

## 沟通

Swift 网站工作组使用 [Swift.org 网站论坛](https://forums.swift.org/c/swift-website/)进行一般讨论。
也可以通过在 Swift 论坛上向 [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) 发送消息进行私下联系。
