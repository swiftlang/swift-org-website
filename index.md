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
        text="Get ready for the Swift 6 language mode with the <a href=\"https://www.swift.org/migration/documentation/migrationguide\">official migration guide</a>"
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

<<<<<<< HEAD
## Use Cases

<ul class="grid-level-0 grid-layout-use-cases">
  <li class="grid-level-1">
    <h3>Apple Platforms</h3>
    <p>
      Swift is a powerful and intuitive programming language optimized when running on iOS, macOS, and other Apple platforms.
      <br><br>
      Apple offers a wide variety of frameworks and APIs that make applications developed for these platforms unique and fun.
    </p>
    <a href="https://developer.apple.com/swift/resources/" class="cta-secondary">Learn more</a>
  </li>
  <li class="grid-level-1">
    <h3>Cross-platform Command-line</h3>
    <p>
      Writing Swift is interactive and fun, the syntax is concise yet expressive.
      Swift code is safe by design and produces software that runs lightning-fast.
      <br><br>
      SwiftArgumentParser and Swift's growing package ecosystem make developing cross-platform command-line tools a breeze.
    </p>

    <a href="/getting-started/cli-swiftpm" class="cta-secondary">Learn more</a>
  </li>
  <li class="grid-level-1">
    <h3>Server and Networking</h3>
    <p>
      Swift's small memory footprint, quick startup time, and deterministic performance make it a great choice for server and other networked applications.
      <br><br>
      SwiftNIO and Swift's dynamic server ecosystem bring joy to developing networked applications.
    </p>

    <a href="/documentation/server" class="cta-secondary">Learn more</a>
  </li>
</ul>

## Getting Involved

Everyone is welcome to contribute to Swift. Contributing doesn’t just mean writing code or submitting pull request — there are many different ways for you to get involved, including answering questions on the forums, reporting or triaging bugs, and participating in the Swift evolution process.

No matter how you want to get involved, we ask that you first learn what’s expected of anyone who participates in the project by reading the [Community Overview](/community/). If you’re contributing code, you should also know how to build and run Swift from the repository, as described in [Source Code](/documentation/source-code/).

<ul class="grid-level-0 grid-layout-3-column">
  <li class="grid-level-1">
    <h3>Design</h3>
    <p>
      Help shape the future of Swift by participating in <em>the Swift evolution process</em>.
    </p>
    <a href="/contributing/#swift-evolution" class="cta-secondary">Learn more</a>
  </li>
  <li class="grid-level-1">
    <h3>Code</h3>
    <p>
      Contribute to the Swift compiler, standard library, and other core components of the project.
    </p>
    <a href="/contributing/#contributing-code" class="cta-secondary">Learn more</a>
  </li>
  <li class="grid-level-1">
    <h3>Troubleshoot</h3>
    <p>
      Help improve the quality of Swift by reporting and triaging bugs.
    </p>
    <a href="/contributing/#triaging-bugs" class="cta-secondary">Learn more</a>
  </li>
</ul>

## What's New

Stay up-to-date with the latest in the Swift community.

<div class="links links-list-nostyle" markdown="1">
  - [Visit the Swift.org blog](/blog/)
  - [Visit the Swift forums](https://forums.swift.org)
  - [Follow @swiftlang on X (formerly Twitter)](https://x.com/swiftlang){:target="_blank" class="link-external"}
  - [Follow @swift.org on Bluesky](https://bsky.app/profile/swift.org){:target="_blank" class="link-external"}
  - [Follow @swiftlang on Mastodon](https://mastodon.social/@swiftlang){:target="_blank" class="link-external"}
=======
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
>>>>>>> 0b42ad6c (Add initial Storybook)
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
