## Standard Library Preview Package

The **[Standard Library Preview package][preview-package]** provides
early access to new additions to the standard library. When new standard
library APIs that can be implemented as a standalone library are accepted
through the Swift Evolution process, they are published as individual
packages and included in the preview package, which acts as an umbrella
library. The preview package currently includes the following individual
packages:

[preview-package]: https://github.com/apple/swift-standard-library-preview/

<table>
<tr>
    <th>Package</th>
    <th>Description</th>
</tr>
{% for package in site.data.preview_packages %}
<tr>
    <td><a href="{{ package.repo }}">{{ package.name }}</a></td>
    <td>{{ package.description }}</td>
</tr>
{% endfor %}
</table>

