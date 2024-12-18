### Tabs

{% storybook_sample title="Tabs" %}
{% raw %}
{%
  include new-includes/components/tabs.html
  group="1"
  tabs=site.data.new-data.install.os
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `tabs`: list of tabs
  - `name` (required)
  - `link` (optional, only if content is missing)
  - `content` (optional, only if link is missing)
- `group`: start from 1 and increases for more groups
- `default` (optional): default selected tab

---
