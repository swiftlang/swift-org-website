---
template: page
title: SSWG Incubated packages
contentTemplating: true
---

The Swift Server Workgroup ([SSWG](/sswg/)) has a [process](/sswg/incubation-process.html) which allows a project to go through incubation stages until it graduates and becomes a recommended project.

## Graduated Projects

<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Description</th>
      <th>Pitched</th>
      <th>Accepted</th>
    </tr>
  </thead>
  <tbody>
    #for(project in data.server_workgroup.projects):
    #if(project.maturity == "Graduated"):
    <tr>
      <td><a href="#(project.url)">#(project.name)</a></td>
      <td>#(project.description)</td>
      <td>#(project.pitched)</td>
      <td>#(project.accepted)</td>
    </tr>
    #endif#endfor
  </tbody>
</table>

## Incubating Projects

<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Description</th>
      <th>Pitched</th>
      <th>Accepted</th>
    </tr>
  </thead>
  <tbody>
    #for(project in data.server_workgroup.projects):
    #if(project.maturity == "Incubating"):
    <tr>
      <td><a href="#(project.url)">#(project.name)</a></td>
      <td>#(project.description)</td>
      <td>#(project.pitched)</td>
      <td>#(project.accepted)</td>
    </tr>
    #endif#endfor
  </tbody>
</table>

## Sandbox Projects

<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Description</th>
      <th>Pitched</th>
      <th>Accepted</th>
    </tr>
  </thead>
  <tbody>
    #for(project in data.server_workgroup.projects):
    #if(project.maturity == "Sandbox"):
    <tr>
      <td><a href="#(project.url)">#(project.name)</a></td>
      <td>#(project.description)</td>
      <td>#(project.pitched)</td>
      <td>#(project.accepted)</td>
    </tr>
    #endif#endfor
  </tbody>
</table>

The SSWG publishes a [package collection](/blog/package-collections/) that contains the projects incubated by the workgroup. The collection is available at `https://swiftserver.group/collection/sswg.json`.

