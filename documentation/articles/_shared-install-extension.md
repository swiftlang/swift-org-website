1. First, install Swift. If you do not already have Swift installed on your system, see the
   [Getting Started Guide on Swift.org](/getting-started/).
2. Download and install [{{ include.editor_name }}]({{ include.editor_download_link }}).
3. Install the Swift extension from the [{{ include.marketplace_name }}]({{ include.marketplace_link }}){% if include.marketplace_extra_text %} {{ include.marketplace_extra_text }}{% else %} or directly from within the {{ include.editor_name }} extensions pane{% endif %}.
   {% if include.installation_image %}
   ![Swift Extension Installation]({{ include.installation_image }})
   {% endif %}
4. (Optional) Complete the onboarding steps. The extension includes steps on how to install Swift, and set up your development environment. Open the Command Palette (⇧⌘P on Mac; `Ctrl + Shift + P` otherwise) and type in `Welcome: Open Welcome Walkthrough`, then select `Getting started with Swift`.
   {% if include.walkthrough_image %}
   ![Swift welcome page]({{ include.walkthrough_image }})
   {% endif %}
