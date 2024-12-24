## 标准库预览包

**[标准库预览包][preview-package]** 提供了对标准库新增功能的早期访问。当通过 Swift Evolution 流程接受了可以作为独立库实现的新标准库 API 时，这些 API 会以单独的包的形式发布，并被包含在预览包中。预览包作为一个统一的顶层库，目前包含以下独立包:

[preview-package]: https://github.com/apple/swift-standard-library-preview/

<table>
<tr>
    <th>包名</th>
    <th>描述</th>
</tr>
{% for package in site.data.preview_packages %}
<tr>
    <td><a href="{{ package.repo }}">{{ package.name }}</a></td>
    <td>{{ package.description }}</td>
</tr>
{% endfor %}
</table>

