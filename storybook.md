---
layout: new-layouts/storybook
title: Welcome to Swift.org Storybook
atom: true
---

# Swift.org Storybook

**Classes**

- [Grid](#grid)

**Components**

- [Badge](#badge)
- [Banner](#banner)
- [Box](#box)
- [Code](#code)
- [Heading](#heading)
- [Link](#link)
- [Link List](#link-list)
- [Ribbon](#ribbon)
- [Section](#section)
- [Tabs](#tabs)
- [Toggle](#toggle)

---

## Classes

---

### Grid

{% storybook_sample title="Grid" %}
<div class="grid-1-cols">
  <div class="sample-box">content</div>
</div>
<div class="grid-2-cols">
  <div class="sample-box">content</div>
  <div class="sample-box">content</div>
</div>
<div class="grid-3-cols">
  <div class="sample-box">content</div>
  <div class="sample-box">content</div>
  <div class="sample-box">content</div>
</div>
<div class="grid-4-cols">
  <div class="sample-box">content</div>
  <div class="sample-box">content</div>
  <div class="sample-box">content</div>
  <div class="sample-box">content</div>
</div>
{% endstorybook_sample %}

---

## Components

---

### Badge

{% storybook_sample title="Badge" %}
{% raw %}
{%
  include new-includes/components/badge.html
  authors='lplarson'
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `authors`: list of authors
- `show_about` (optional): show the author.about
  - values: `true`/`false`

---

### Banner

{% storybook_sample title="Banner" %}
{% raw %}
{%
  include new-includes/components/banner.html
  text="hello world"
  style="purple"
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `text`: text inside the banner
- `style`: type of banner
  - values: `purple`

---

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

### Code

{% storybook_sample title="Code" %}
{% raw %}
{%
  include new-includes/components/code.html
  language="swift"
  code="var number = 2"
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `language`: code language
- `code`: code to show

---

### Heading

{% storybook_sample title="Heading" %}
{% raw %}
{%
  include new-includes/components/heading.html
  title="Heading title"
  text="Heading description"
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `title`: title to show
- `for` (optional): inside which component
  - values: "box"
- `text` (optional): text to show

---

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

### Link List

{% storybook_sample title="Link List" %}
{% raw %}
{%
  include new-includes/components/link-list.html
  items=site.data.new-data.footer-links
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `items`: list items

---

### Ribbon

{% storybook_sample title="Ribbon" %}
{% raw %}
<div style="position: relative; height: 180px; background-color: #f0f0f0; overflow: hidden;">
{%
  include new-includes/components/ribbon.html
  text="STAGING"
%}
</div>
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `text`: text of the ribbon

---

### Section

{% storybook_sample title="Section" %}
{% raw %}
{% capture test-section %}
<div class="grid-2-cols">
  <div>
    Right Content
  </div>
  <div>
    Left Content
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

### Toggle

{% storybook_sample title="Toggle" %}
{% raw %}
{%
  include new-includes/components/toggle-button.html
  id="my-toggle"
  img_on="/assets/images/new-images/icon-close.svg"
  img_off="/assets/images/new-images/icon-menu.svg"
%}
{% endraw %}
{% endstorybook_sample %}

#### Attributes

- `id`: toggle id attribute value
- `img_on`: toggle image for active state
- `img_off`: toggle image for non-active state
