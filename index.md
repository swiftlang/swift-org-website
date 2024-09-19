---
layout: new-layouts/base
title: Welcome to Swift.org
label: homepage
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
    <div class="claim">
        <h1>
            Fast, modern, safe, and a joy to write.
        </h1>
        <p class="text">
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
        <img src="/assets/images/new-images/icon-fast.png" />
        <h3>
            Fast
        </h3>
        <p>
            Swift aims to replace C-based languages and match their performance, while maintaining consistency and predictability.
        </p>
    </div>
    <div>
        <img src="/assets/images/new-images/icon-safe.png" />
        <h3>
            Safe
        </h3>
        <p>
            Swift prioritizes safety and clarity, ensuring that code behaves in a safe manner while also promoting good practices.
        </p>
    </div>
    <div>
        <img src="/assets/images/new-images/icon-expressive.png" />
        <h3>
            Expressive
        </h3>
        <p>
            Swift builds upon decades of advancements in computer science, providing a modern syntax that is a joy to use.
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
    {% capture content %}
<div>
    <h3>Server & <br /> Networking</h3>
    <p>
        Small memory footprint, quick startup time, and deterministic performance.
    </p>
</div>
    {% endcapture %}
    {% include new-includes/components/box.html
        content=content
        link="#"
        image="globe"
    %}

    <div>
        <h3>
            Apple <br /> Platforms
        </h3>
        <p>
            Optimized when running on iOS, macOS, and other Apple platforms.
        </p>
    </div>
    <div>
        <h3>
            Cross-platform <br /> Command-line
        </h3>
        <p>
            Produces software that runs lightning-fast on all supported platforms.
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
        <div>
            <h3>
                Announcing Swift Homomorphic Encryption
            </h3>
            <p>
                We’re excited to announce a new open source Swift package for homomorphic encryption in Swift: swift-homomorphic-encryption.
            </p>
        </div>
        <div>
            <h3>
                Announcing Swift Homomorphic Encryption
            </h3>
            <p>
                We’re excited to announce a new open source Swift package for homomorphic encryption in Swift: swift-homomorphic-encryption.
            </p>
        </div>
    </div>
    <div>
        <div>
            <h3>
                Announcing Swift Homomorphic Encryption
            </h3>
            <p>
                We’re excited to announce a new open source Swift package for homomorphic encryption in Swift: swift-homomorphic-encryption.
            </p>
        </div>
        <div>
            <h3>
                Announcing Swift Homomorphic Encryption
            </h3>
            <p>
                We’re excited to announce a new open source Swift package for homomorphic encryption in Swift: swift-homomorphic-encryption.
            </p>
        </div>
    </div>
</div>
{% endcapture %}
{% include new-includes/components/section.html
    content=community-section
%}

{% capture community-section %}
<div class="grid-2-cols">
    <div>
        <h3>
            Fast, modern, safe, and a joy to write.
        </h3>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h3>
            Fast, modern, safe, and a joy to write.
        </h3>
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
        <h3>
            Fast, modern, safe, and a joy to write.
        </h3>
        <p>
            Swift is a general-purpose programming language that’s approachable for newcomers and powerful for experts.
        </p>
    </div>
    <div>
        <h3>
            Fast, modern, safe, and a joy to write.
        </h3>
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
