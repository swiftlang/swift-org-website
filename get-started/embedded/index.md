---
layout: new-layouts/base
title: Embedded
---

<div class="get-started">

<!-- Hero -->

{% include new-includes/components/get-started-hero.html content = site.data.new-data.get-started.embedded.hero %}

<!-- Runs on many embedded platforms -->

<style>
.card-grid p { margin-bottom: 20px; }
</style>
{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.embedded.card-grid %}

<!-- Explore example projects -->

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.embedded.primary-content %}

<!-- Dive into Embedded Swift -->

{% include new-includes/components/headline-section.html content = site.data.new-data.get-started.embedded.headline-section %}

<!-- Read the blog -->

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.embedded.blogposts %}

<!-- Ergonomic and performant -->

{% include new-includes/components/full-width-text-image-column.html content = site.data.new-data.get-started.embedded.full-width-text-image-column %}

<!-- Squeeze into the smallest places -->

{% include new-includes/components/code-image-column.html content=site.data.new-data.get-started.embedded.code-image-column %}

<!-- Resources -->

{% include new-includes/components/link-columns.html content = site.data.new-data.get-started.embedded.link-columns %}

</div>
