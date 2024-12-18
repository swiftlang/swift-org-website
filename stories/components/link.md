### Link

{% storybook_sample title="Link" %}
{% raw %}
{%
  include new-includes/components/link.html
  type="button"
  style="orange"
  url="#"
  text="Click Me"
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `text`: link's text
- `url`: link's url
- `type` (optional): type of link
  - values: "button"
- `style` (optional): style of link
  - values: "orange", "black"
- `target` (optional): where url should open
- `css` (optional): custom css

---
