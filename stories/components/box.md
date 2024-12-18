### Box

{% storybook_sample title="Box" %}
{% raw %}
{%
  include new-includes/components/box.html
  content="This is a box"
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `content`: content of the box
- `css` (optional): custom css
- `image` (optional): name of image to use
  - values: "globe"
- `language` (optional): language of code
- `link` (optional): page to navigate
- `style` (optional): predefined style to use
  - values: "orange", "white"
- `target` (optional): where link should open
- `type` (optional): type of box
  - values: "code"

---
