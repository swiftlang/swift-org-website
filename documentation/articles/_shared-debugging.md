{% if include.editor_intro %}
{{ include.editor_intro }}
{% else %}
{{ include.editor_name }} provides a rich debugging experience. See the
[Debugging](https://code.visualstudio.com/docs/editor/debugging) documentation for
more information.
{% endif %}

The Swift extension relies on the
[LLDB DAP extension]({{ include.lldb_dap_link }}) to enable
debugging support.

By default, the extension creates a launch configuration for each executable
target in your Swift package. You may configure these yourself by adding a
`launch.json` file to the root folder of your project. For example, this
`launch.json` launches a Swift executable with custom arguments:

```json
{
  "configurations": [
    {
      "type": "swift",
      "name": "Debug swift-executable",
      "request": "launch",
      "args": ["--hello", "world"],
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/.build/debug/swift-executable",
      "preLaunchTask": "swift: Build Debug swift-executable"
    }
  ]
}
```

You can launch a debugging session via the Debug view in {{ include.editor_name }}.

1. Select the launch configuration you wish to debug.
2. Click on the green play button to launch a debugging session.

The executable will be launched and you can set breakpoints in
your Swift code that will be hit as code executes.

The screenshot below shows an example of debugging a Hello World program. It
is paused on a breakpoint and you can see that the Debug View shows the values
of variables in scope. You can also hover over identifiers in the editor to see
their variable values:

![Debugging]({{ include.debugging_image }})
