---
layout: page
title: Mix Swift and C++
official_url: https://swift.org/documentation/cxx-interop/
redirect_from: 
- /documentation/cxx-interop.html
---
<!-- {% comment %}
The width of <pre> elements on this page is carefully regulated, so we
can afford to drop the scrollbar boxes.
{% endcomment %} -->
<style>
article pre {
    overflow: visible;
}
</style>

<!-- {% comment %}
Define some variables that help us build expanding detail sections
without too much boilerplate.  We use checkboxes instead of
<details>...</details> because it allows us to:

  * Write CSS ensuring that details aren't hidden when printing.
  * Add a button that expands or collapses all sections at once.
{% endcomment %} -->
{% capture expand %}{::nomarkdown}
<input type="checkbox" class="detail">
{:/nomarkdown}{% endcapture %}
{% assign detail = '<div class="more" markdown="1">' %}
{% assign enddetail = '</div>' %}

<div class="info screenonly" markdown="1">
To facilitate use as a quick reference, the details of many guidelines
can be expanded individually. Details are never hidden when this page
is printed.
<input type="button" id="toggle" value="Expand all details now" onClick="show_or_hide_all()" />
</div>

## Table of Contents
{:.no_toc}

* TOC
{:toc}

## Use C++ APIs from Swift

This section describes how C++ code gets imported into Swift. It then dives into details of how to use C++ APIs from Swift, including APIs from the C++ standard library.

## Use Swift APIs from C++

This section describes how APIs in a Swift module
get exposed to C++. It then goes into details of how to use Swift APIs from C++.
