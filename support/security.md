---
layout: page
title: Swift.org 安全
---

## 安全流程

为了保护我们的社区，在调查完成且必要的更新普遍可用之前，Swift.org 不会披露、讨论或确认安全问题。

最近的安全更新列在下方的[安全更新](#security-updates)部分。

Swift.org 的安全文档在可能的情况下会通过 [CVE-ID](https://www.cve.org/About/Overview) 来引用漏洞。

### 报告安全或隐私漏洞

如果您认为在 Swift.org 项目中发现了安全或隐私漏洞，请向我们报告。
我们欢迎来自所有人的报告，包括安全研究人员、开发者和用户。

要报告安全或隐私漏洞，请发送电子邮件至 [cve@forums.swift.org](mailto:cve@forums.swift.org)，内容包括：

* 您认为受影响的具体项目和软件版本。
* 对您观察到的行为以及您预期行为的描述。
* 重现该问题所需步骤的编号列表，以及/或视频演示（如果这些步骤可能难以理解）。

请使用 [Swift.org 的 CVE PGP 密钥](/keys/cve-signing-key-1.asc)来加密您通过电子邮件发送的敏感信息。

您会收到来自 Swift.org 的电子邮件回复，确认我们已收到您的报告，如果我们需要更多信息，我们会与您联系。

### Swift.org 如何处理这些报告

为了保护我们的社区，在调查完成且必要的更新普遍可用之前，Swift.org 不会披露、讨论或确认安全问题。

Swift.org 使用安全公告和我们的安全公告邮件列表来发布有关我们项目中安全修复的信息，并公开感谢向我们报告安全问题的个人或组织。

## 安全更新

{% assign cve_list = site.data.security.cve | sort: "date" %}

<ul>
  {% for cve in cve_list %}
  <li>
    <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name={{ cve.id }}">{{ cve.id }}</a>
    <p>
    {{ cve.description }}
    </p>
  </li>
  {% endfor %}
</ul>
