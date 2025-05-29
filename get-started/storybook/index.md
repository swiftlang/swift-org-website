---
layout: new-layouts/base
title: Storybook
---

<div class="get-started">

{% include new-includes/components/get-started-hero.html content = site.data.new-data.get-started.storybook.hero  %}

{% include new-includes/components/hero-card.html test="test" image = site.data.new-data.get-started.storybook.hero-card  stand_alone = true %}

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.storybook.card-grid %}

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.storybook.card-grid-hero-card %}

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.storybook.primary-content %}

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.storybook.secondary-content %}

{% include new-includes/components/card-grid.html content = site.data.new-data.get-started.storybook.tertiary-content %}

{% include new-includes/components/full-width-text-image-column.html  content = site.data.new-data.get-started.storybook.full-width-text-image-column %}

{% include new-includes/components/full-width-text-code-column.html  content = site.data.new-data.get-started.storybook.full-width-text-code-column %}

{% include new-includes/components/full-width-text-code-column.html  content = site.data.new-data.get-started.storybook.full-width-text-code-column background = true %}

{% include new-includes/components/code-image-column.html
    content=site.data.new-data.get-started.storybook.code-image-column
%}

{% include new-includes/components/code-text-row.html
    content=site.data.new-data.get-started.storybook.code-text-row
%}

{% include new-includes/components/image-text-column.html content = site.data.new-data.get-started.storybook.image-text-column %}

{% include new-includes/components/headline-section.html content = site.data.new-data.get-started.storybook.headline-section %}

{% include new-includes/components/code-box.html content = site.data.new-data.get-started.storybook.code-box %}

{% include new-includes/components/link-columns.html  content = site.data.new-data.get-started.storybook.link-columns %}

{% include new-includes/components/os-selection.html content = site.data.new-data.get-started.storybook.interactive-tabs %}

{% include new-includes/components/code-box.html content = site.data.new-data.get-started.storybook.code-box-with-tabs with-tabs = true %}

<div class="stand-alone-link">
    <a class="link">Stand alone link</a>
</div>

</div>
