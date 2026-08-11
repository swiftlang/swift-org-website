{{ include.editor_name }} provides tasks as a way to run external tools. See the
[Integrate with External Tools via Tasks](https://code.visualstudio.com/docs/editor/tasks)
documentation to learn more.

The Swift extension provides some built-in tasks that you can use to build your project via
the Swift Package Manager. You can also configure custom tasks by creating a
`tasks.json` file in the root folder of your project. For example, this
`tasks.json` builds your Swift targets in release mode:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "swift",
      "label": "Swift Build All - Release",
      "detail": "swift build --build-tests",
      "args": ["build", "--build-tests", "-c", "release"],
      "env": {},
      "cwd": "${workspaceFolder}",
      "group": "build"
    }
  ]
}
```

The above task is configured to be in the `build` group. This means it will
appear in the `run build tasks` menu that can be opened with ⇧⌘B
on macOS or `Ctrl + Shift + B` on other platforms:

![Run build task menu](/assets/images/getting-started-with-vscode-swift/tasks/build-tasks.png)

Any errors that occur during a build appear in the editor as diagnostics
alongside those provided by SourceKit-LSP. Running another build task clears the
diagnostics from the previous build task.
