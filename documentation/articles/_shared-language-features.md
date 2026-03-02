The Swift extension uses [SourceKit-LSP](https://github.com/swiftlang/sourcekit-lsp)
to power language features. SourceKit-LSP provides the following features in the
editor. Use these links to see the documentation for each topic:

- [Code completion](https://code.visualstudio.com/docs/editor/intellisense)
- [Go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
- [Find all references](https://code.visualstudio.com/Docs/editor/editingevolved#_peek)
- [Rename refactoring](https://code.visualstudio.com/docs/editor/refactoring#_rename-symbol)
- [Diagnostics](https://code.visualstudio.com/docs/editor/editingevolved#_errors-warnings)
- [Quick Fixes](https://code.visualstudio.com/docs/editor/editingevolved#_code-action)

SourceKit-LSP also provides code actions to automate common tasks.{% if include.code_actions_intro %} {{ include.code_actions_intro }}{% endif %}{% if include.code_actions_examples %} {{ include.code_actions_examples }}{% endif %}

{% if include.code_actions_image %}
![Package swift actions]({{ include.code_actions_image }})
{% endif %}

Code actions can include:

- Adding targets to your `Package.swift`
- Converting JSON to protocols
- Adding documentation to your functions

<div class="warning" markdown="1">
Prior to Swift 6.1 you must perform a `swift build` command on your project either
on the command line or using a task in {{ include.editor_name }} before language features can be used.
This populates the index in SourceKit-LSP.
</div>
