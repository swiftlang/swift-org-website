---
layout: page
title: SSWG 孵化项目
---

Swift 服务器工作组（[SSWG](/sswg/））有一个[流程](/sswg/incubation-process.html)，允许项目经过孵化阶段，直到毕业成为推荐项目。

## 已毕业项目

<table>
  <thead>
    <tr>
      <th>项目</th>
      <th>描述</th>
      <th>提议时间</th>
      <th>接受时间</th>
    </tr>
  </thead>
  <tbody>
    {% for project in site.data.server-workgroup.projects %}
    {% if project.maturity != "Graduated" %}
      {% continue %}
    {% endif %}
    <tr>
      <td><a href="{{ project.url }}">{{ project.name }}</a></td>
      <td>{{ project.description }}</td>
      <td>{{ project.pitched }}</td>
      <td>{{ project.accepted }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

## 孵化中项目

<table>
  <thead>
    <tr>
      <th>项目</th>
      <th>描述</th>
      <th>提议时间</th>
      <th>接受时间</th>
    </tr>
  </thead>
  <tbody>
    {% for project in site.data.server-workgroup.projects %}
    {% if project.maturity != "Incubating" %}
      {% continue %}
    {% endif %}
    <tr>
      <td><a href="{{ project.url }}">{{ project.name }}</a></td>
      <td>{{ project.description }}</td>
      <td>{{ project.pitched }}</td>
      <td>{{ project.accepted }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

## 沙盒项目

<table>
  <thead>
    <tr>
      <th>项目</th>
      <th>描述</th>
      <th>提议时间</th>
      <th>接受时间</th>
    </tr>
  </thead>
  <tbody>
    {% for project in site.data.server-workgroup.projects %}
    {% if project.maturity != "Sandbox" %}
      {% continue %}
    {% endif %}
    <tr>
      <td><a href="{{ project.url }}">{{ project.name }}</a></td>
      <td>{{ project.description }}</td>
      <td>{{ project.pitched }}</td>
      <td>{{ project.accepted }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

SSWG 发布了一个[软件包集合](/blog/package-collections/)，其中包含工作组孵化的项目。该集合可在 `https://swiftserver.group/collection/sswg.json` 获取。

