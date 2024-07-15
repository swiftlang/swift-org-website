---
layout: page
title: SSWG Incubated packages
---

The Swift Server Workgroup ([SSWG](/sswg/)) has a [process](/sswg/incubation-process.html) which allows a project to go through incubation stages until it graduates and becomes a recommended project.

<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Description</th>
      <th>Maturity Level</th>
      <th>Pitched</th>
      <th>Accepted</th>
    </tr>
  </thead>
  <tbody>
    {% for project in site.data.server-workgroup.projects %}
    <tr>
      <td><a href="{{ project.url }}">{{ project.name }}</a></td>
      <td>{{ project.description }}</td>
      <td>{{ project.maturity }}</td>
      <td>{{ project.pitched }}</td>
      <td>{{ project.accepted }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

The SSWG publishes a [package collection](/blog/package-collections/) that contains the projects incubated by the workgroup. The collection is available at `https://swiftserver.group/collection/sswg.json`.

