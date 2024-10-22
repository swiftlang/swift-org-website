---
layout: new-layouts/storybook
title: Welcome to Swift.org Storybook
atom: true
---

# Swift.org Storybook
## Classes
* [Grid](#grid)

## Components
* [Badge](#badge)
* [Banner](#banner)
* [Box](#box)
* [Code](#code)
* [Heading](#heading)
* [Link](#link)
* [Link List](#link-list)
* [Ribbon](#ribbon)
* [Section](#section)
* [Tabs](#tabs)
* [Toggle](#toggle)

---

## Classes
### Grid

{% storybook_sample title="Grid" %}
<div class="grid-1-cols">
  <div>content</div>
</div>
<div class="grid-2-cols">
  <div>content</div>
  <div>content</div>
</div>
{% endstorybook_sample %}

---

## Components
### Badge
#### Code example
{% raw %}
    {%
        include new-includes/components/badge.html
authors='lplarson'
    %}
{% endraw %}

#### attributes
{% raw %}
* authors = list of authors
--
* showabout (optional) = show the author.about
  * values: true/false
{% endraw %}

#### Render
{%
    include new-includes/components/badge.html
    authors='lplarson'
%}

---

### Banner
#### Code example
{% raw %}
{%
include new-includes/components/banner.html
text="hello world"
style="purple"
%}
{% endraw %}

#### attributes
{% raw %}
* text = text inside the banner
* style = type of banner
    * values: "purple"
{% endraw %}

#### Render
{%
    include new-includes/components/banner.html
    text="hello world"
    style="purple"
%}

---

### Box
#### Code example
{% raw %}
{%
include new-includes/components/box.html
type="code"
language="swift"
content="var number = 2"
%}
{% endraw %}

#### attributes
{% raw %}
* content = content of the box
--
* css (optional) = custom css
* image (optional) = name of image to use
    * values: "globe"
* language (optional) = language of code
* link (optional) = page to navigate
* style (optional) = predifined style to use
    * values: "orange", "white"
* target (optional) = where link should open
* type (optional) = type of box
    * values: "code"
{% endraw %}

#### Render
{% include new-includes/components/box.html
    type="code"
    language="swift"
    content="var number = 2"
%}

---

### Code
#### Code example
{% raw %}
{%
include new-includes/components/code.html
language="swift"
code="var number = 2"
%}
{% endraw %}

#### attributes
{% raw %}
* language = code language
* code = code to show
{% endraw %}

#### Render
{% include new-includes/components/code.html
    language="swift"
    code="var number = 2"
%}

---

### Heading
#### Code example
{% raw %}
{%
include new-includes/components/heading.html
title="Heading title"
text="Heading description"
%}
{% endraw %}

#### attributes
{% raw %}
* title = title to show
--
* for (optional) = inside which component
    * values: "box"
* text (optional) = text to show
{% endraw %}

#### Render
{%
    include new-includes/components/heading.html
    title="Heading title"
    text="Heading description"
%}

---

### Link
#### Code example
{% raw %}
{%
include new-includes/components/link.html
type="button"
style="orange"
text="Click Me"
%}
{% endraw %}

#### attributes
{% raw %}
* text = link's text
* url = link's url
--
* type (optional) = type of link
    * values: "button"
* style (optional) = style of link
    * values: "orange", "black"
* target (optional) = where url should open
* css (optional) = custom css
{% endraw %}

#### Render
{% include new-includes/components/link.html
    type="button"
    style="orange"
    url="#"
    text="Click Me"
%}

---

### Link List
#### Code example
{% raw %}
{%
include new-includes/components/link-list.html
items=site.data.new-data.footer-links
%}
{% endraw %}

#### attributes
{% raw %}
* items = list items
{% endraw %}

#### Render
{% include new-includes/components/link-list.html
    items=site.data.new-data.footer-links
%}

---

### Ribbon
#### Code example
{% raw %}
    <div style="position: relative;">
        {% include new-includes/components/ribbon.html text="STAGING" %}
    </div>
{% endraw %}

#### attributes
{% raw %}
* text = text of the ribbon
{% endraw %}

#### Render
<div style="position: relative; height: 180px;">
{% include new-includes/components/ribbon.html text="STAGING" %}
</div>

---

### Section
#### Code example
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

#### attributes

{% raw %}
* content = content's section
--
* style (optional) = style of section
    * values: "orange", "purple", "yellow"
{% endraw %}

#### Render
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
---
### Tabs
#### Code example
{% raw %}
{%
        include new-includes/components/tabs.html
group="1"
tabs=site.data.new-data.install.os
%}
{% endraw %}
#### attributes
{% raw %}
* tabs = list of tabs
  * name (required)
  * link (optional, only if content is missing)
  * content (optional, only if link is missing)
* group = start from 1 and increases for more groups
--
* default (optional) = default selected tab
{% endraw %}
#### Render
{% include new-includes/components/tabs.html
    group="1"
    tabs=site.data.new-data.install.os
%}
---
### Toggle
#### Code example
{% raw %}
{%
        include new-includes/components/toggle-button.html
id="my-toggle"
imgon="/assets/images/new-images/icon-close.svg"
imgoff="/assets/images/new-images/icon-menu.svg"
    %}
{% endraw %}
#### attributes
{% raw %}
* id = toggle id attribute value
* imgon = toggle image for active state
* imgoff = toggle image for non-active state
{% endraw %}
#### Render
{% include new-includes/components/toggle-button.html
    id="my-toggle"
    imgon="/assets/images/new-images/icon-close.svg"
    imgoff="/assets/images/new-images/icon-menu.svg"
%}
