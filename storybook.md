---
layout: new-layouts/storybook
title: Welcome to Swift.org Storybook
atom: true
---

<br />

# Swift.org Storybook

* [Box](#box)

<br />

---

## Box

<br />

### Code example

<br />

{% raw %}
{%

        include new-includes/components/box.html

        type="code"

        language="swift"

        content="var number = 2"

%}
{% endraw %}

<br />

### attributes

<br />

{% raw %}

* content = content of the box

--

* css (optional) = custom css

* image (optional) = path to image to use in box

* language (optional) = language of code

* link (optional) = page to navigate

* style (optional) = predifined style to use
    * values: "orange", "white"

* target (optional) = where link should open

* type (optional) = type of box
   * values: "code"

{% endraw %}

<br />

### Render

<br />

{% include new-includes/components/box.html
    type="code"
    language="swift"
    content="var number = 2"
%}

---
