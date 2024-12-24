## 标准库预览包

**[标准库预览包][preview-package]**为标准库的新增功能提供早期访问。当通过 Swift Evolution 流程接受了可以作为独立库实现的新标准库 API 时，这些 API 会作为单独的包发布，并包含在预览包中。预览包作为一个统一的程序库，目前包含以下独立包：

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

