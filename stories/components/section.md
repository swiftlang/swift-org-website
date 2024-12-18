### Section

{% storybook_sample title="Section" %}
{% raw %}
{% capture test-section %}
<div class="grid-2-cols">
  <div>
    Left Content
  </div>
  <div>
    Right Content
  </div>
</div>
{% endcapture %}

{%
  include new-includes/components/section.html
  style="orange"
  content=test-section
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `content`: content's section
- `style` (optional): style of section
  - values: "orange", "purple", "yellow"

---
