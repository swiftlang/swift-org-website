The Swift extension automatically detects your installed Swift toolchain.
However, it also provides a command called `Swift: Select Toolchain...` which
can be used to select between toolchains if you have multiple installed.

<div class="warning" markdown="1">
This is an advanced feature used to configure {{ include.editor_name }} with a toolchain other
than the default on your machine. It is recommended to use `xcode-select` on
macOS or `swiftly` on Linux to switch between toolchains globally.
</div>

You may be prompted to select where to configure this new path. Your options are
to:

- Save it in User Settings
- Save it in Workspace Settings

Keep in mind that Workspace Settings take precedence over User Settings:

![Settings selection](/assets/images/getting-started-with-vscode-swift/toolchain-selection/configuration.png)

The Swift extension will then prompt you to reload the extension in order to
pick up the new toolchain. You must do so, otherwise the extension will not
function correctly.{% if include.reload_image %}

![Reload {{ include.editor_name }} warning]({{ include.reload_image }})
{% endif %}
