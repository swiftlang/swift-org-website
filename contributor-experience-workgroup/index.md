---
layout: page
title: 贡献者体验工作组
---

贡献者体验工作组为 Swift 项目（包括 Swift 论坛）的贡献者提供支持。

## 章程

贡献者体验工作组致力于：
- 通过以下方式改善为 Swift 编译器及相关开源仓库做贡献的机制和人机工程学：
  - 为 GitHub 拉取请求和问题工作流程提供指导和设定期望。
  - 维护入职文档。
  - 添加和管理 GitHub 标签。
- 通过以下方式提供支持系统并促进贡献者之间的协作：
  - Swift 导师计划。
  - 社区小组。
  - 与其他贡献者连接的协作工具和空间。

### 多样性

培养包容性社区对确保 Swift 社区的每个人都能为 Swift 项目做出贡献至关重要。贡献者体验工作组将与其他工作组合作，开辟贡献途径，降低参与 Swift 项目的门槛，为资深贡献者提供发挥领导力和专业知识的多样化机会，并促进其他工作组参与这些工作，如 Swift 导师计划。

## 成员资格
工作组成员是致力于改善贡献者体验的志愿者。如果您有兴趣加入工作组，请在 Swift 论坛上向 [@contributor-experience-workgroup](https://forums.swift.org/g/contributor-experience-workgroup) 发送消息，说明您为什么有兴趣加入以及您打算如何支持 Swift 项目的贡献者！

为了促进工作组内部的更替，每年都会进行一次参与情况检查，为成员提供退出工作组的机会，同时在 Swift 论坛上发布新成员加入的参与召集。

工作组成员由 Swift 核心团队和 Swift 项目负责人酌情任命，后者对工作组决策拥有最终决定权。

工作组的现任成员是：

{% assign people = site.data['contributer-experience-workgroup'].members | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
  ，{{ person.affiliation }}
{% endif %}
{% if person.github %}
  (<a href="https://github.com/{{person.github}}">@{{person.github}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>

我们感谢以下荣誉退休工作组成员的服务：

{% assign people = site.data['contributer-experience-workgroup'].emeriti | sort: "name" %}
<ul>
{% for person in people %}
<li>{{ person.name }}
{%- if person.affiliation -%}
  ，{{ person.affiliation }}
{% endif %}
{% if person.github %}
  (<a href="https://github.com/{{person.github}}">@{{person.github}}</a>)
{% endif %}
</li>
{% endfor %}
</ul>

## 沟通

贡献者体验工作组使用开发论坛与更广泛的 Swift 社区进行关于贡献者体验的一般讨论和问题交流。可以通过在 Swift 论坛上向 [@contributor-experience-workgroup](https://forums.swift.org/g/contributor-experience-workgroup) 发送私信来联系工作组。

## 社区参与

我们感谢每一个人的贡献，而不仅仅局限于提交拉取请求。如果您想做出贡献，可以考虑参与 Swift 论坛上的讨论、报告或分类 GitHub 问题、提供关于您自己为 Swift 项目做贡献的经验反馈、或者自愿成为 Swift 导师计划的导师。
