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

```liquid
{% raw %}
{%
  include new-includes/components/badge.html
  authors='lplarson'
%}
{% endraw %}
```

#### Attributes

- `authors`: list of authors
- `show_about` (optional): show the author.about
  - values: `true`/`false`

{% storybook_sample title="Badge" hide_code="true" %}
{%
  include new-includes/components/badge.html
  authors='lplarson'
%}
{% endstorybook_sample %}

---

### Banner

```liquid
{% raw %}
{%
  include new-includes/components/banner.html
  text="hello world"
  style="purple"
%}
{% endraw %}
```

#### Attributes

- `text`: text inside the banner
- `style`: type of banner
  - values: `purple`

{% storybook_sample title="Banner" hide_code="true" %}
{%
  include new-includes/components/banner.html
  text="hello world"
  style="purple"
%}
{% endstorybook_sample %}

---

### Box

```liquid
{% raw %}
{%
  include new-includes/components/box.html
  content="This is a box"
%}
{% endraw %}
```

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

{% storybook_sample title="Box" hide_code="true" %}
{%
  include new-includes/components/box.html
  content="This is a box"
%}
{% endstorybook_sample %}

---

### Code

```liquid
{% raw %}
{%
  include new-includes/components/code.html
  language="swift"
code="var number = 2"
%}
{% endraw %}
```

#### Attributes

- `language`: code language
- `code`: code to show

{% storybook_sample title="Code" hide_code="true" %}
{%
  include new-includes/components/code.html
  language="swift"
  code="var number = 2"
%}
{% endstorybook_sample %}

---

### Heading

```liquid
{% raw %}
{%
  include new-includes/components/heading.html
  title="Heading title"
  text="Heading description"
%}
{% endraw %}
```

#### Attributes

- `title`: title to show
- `for` (optional): inside which component
  - values: "box"
- `text` (optional): text to show

{% storybook_sample title="Heading" hide_code="true" %}
{%
  include new-includes/components/heading.html
  title="Heading title"
  text="Heading description"
%}
{% endstorybook_sample %}

---

### Link

```liquid
{% raw %}
{%
  include new-includes/components/link.html
  type="button"
  style="orange"
  text="Click Me"
%}
{% endraw %}
```

#### Attributes

- `text`: link's text
- `url`: link's url
- `type` (optional): type of link
  - values: "button"
- `style` (optional): style of link
  - values: "orange", "black"
- `target` (optional): where url should open
- `css` (optional): custom css

{% storybook_sample title="Link" hide_code="true" %}
{%
  include new-includes/components/link.html
  type="button"
  style="orange"
  url="#"
  text="Click Me"
%}
{% endstorybook_sample %}

---

### Link List

```liquid
{% raw %}
{%
  include new-includes/components/link-list.html
  items=site.data.new-data.footer-links
%}
{% endraw %}
```

#### Attributes

- `items`: list items

{% storybook_sample title="Link List" hide_code="true" %}
{%
  include new-includes/components/link-list.html
  items=site.data.new-data.footer-links
%}
{% endstorybook_sample %}

---

### Ribbon

```liquid
{% raw %}
{%
  include new-includes/components/ribbon.html
  text="STAGING"
%}
{% endraw %}
```

#### Attributes

- `text`: text of the ribbon

{% storybook_sample title="Ribbon" hide_code="true" %}

<div style="position: relative; height: 180px;">
{%
  include new-includes/components/ribbon.html
  text="STAGING"
%}
</div>
{% endstorybook_sample %}

---

### Section

```liquid
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
```

#### Attributes

- `content`: content's section
- `style` (optional): style of section
  - values: "orange", "purple", "yellow"  

{% storybook_sample title="Section" hide_code="true" %}
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
{% endstorybook_sample %}

---

### Tabs

```liquid
{% raw %}
{%
  include new-includes/components/tabs.html
  group="1"
  tabs=site.data.new-data.install.os
%}
{% endraw %}
```

#### Attributes

- `tabs`: list of tabs
  - `name` (required)
  - `link` (optional, only if content is missing)
  - `content` (optional, only if link is missing)
- `group`: start from 1 and increases for more groups
- `default` (optional): default selected tab

{% storybook_sample title="Tabs" hide_code="true" %}
{%
  include new-includes/components/tabs.html
  group="1"
    tabs=site.data.new-data.install.os
%}
{% endstorybook_sample %}

---

### Toggle

```liquid
{% raw %}
{%
  include new-includes/components/toggle-button.html
  id="my-toggle"
  img_on="/assets/images/new-images/icon-close.svg"
  img_off="/assets/images/new-images/icon-menu.svg"
%}
{% endraw %}
```

#### Attributes

- `id`: toggle id attribute value
- `img_on`: toggle image for active state
- `img_off`: toggle image for non-active state

{% storybook_sample title="Toggle" hide_code="true" %}
{%
  include new-includes/components/toggle-button.html
  id="my-toggle"
  img_on="/assets/images/new-images/icon-close.svg"
  img_off="/assets/images/new-images/icon-menu.svg"
%}
{% endstorybook_sample %}
