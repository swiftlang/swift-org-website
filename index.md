---
layout: new-layouts/base
title: Welcome to Swift.org
atom: true
---

{% capture code-snippet %}
    {% assign random_snippet = site.data.featured_snippets | sample %}
    {% include new-includes/components/box.html
        type="code"
        language="swift"
        content=random_snippet
        css="overflow-x:scroll"
    %}
{% endcapture %}
{% capture claim-section %}
<div class="grid-2-cols">
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>

        {% include new-includes/components/link.html
            type="button"
            style="orange"
            text="Get Started"
        %}
    </div>
    <div>
        {{ code-snippet }}
    </div>
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=claim-section
%}

{% capture banner-section %}
<div class="grid-1-col">
    {% include new-includes/components/banner.html
        style="purple"
        text="Get ready for the Swift 6 language mode with the <a href=\"#\">official migration guide</a>"
    %}
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=banner-section
%}

{% capture fast-safe-expressive-section %}
<div class="grid-3-cols">
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=fast-safe-expressive-section
    style="orange"
%}

{% capture use-cases-section %}
<div class="grid-3-cols">
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
</div>
{% endcapture %}
{% include new-includes/components/heading.html
    title="USE CASES"
%}
{% include new-includes/components/section.html
    content=use-cases-section
%}

{% include new-includes/components/heading.html
    title="PACKAGE ECOSYSTEM"
    text="The Swift package ecosystem has thousands of packages to help you with all kinds of tasks across your projects."
%}
{% capture packages-section %}
<div class="grid-1-col">
    {% include new-includes/components/link.html
        type="button"
        style="black"
        text="Explore More Packages"
        css="max-width: 500px; margin: 0 auto"
    %}
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=packages-section
    style="yellow"
%}

{% capture community-section %}
<div class="grid-2-cols">
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=community-section
%}

{% capture community-section %}
<div class="grid-2-cols">
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=community-section
%}

{% capture case-studies-section %}
<div class="grid-2-cols">
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h2>
            Fast, modern, safe, and a joy to write.
        </h2>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
</div>
{% endcapture %}
{% include new-includes/components/heading.html
    title="CASE STUDIES"
%}
{% include new-includes/components/section.html
    content=case-studies-section
%}

{% capture links-section %}
<div class="grid-4-cols">
    <div>
        adsadsads
    </div>
    <div>
        adsadsads
    </div>
    <div>
        adsadsads
    </div>
    <div>
        adsadsads
    </div>
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=links-section
%}
