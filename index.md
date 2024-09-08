---
layout: new-layouts/base
title: Welcome to Swift.org
hideTitle: true
atom: true
---

<div class="callout" markdown="1">
  <h1 class="preamble">Swift is a <strong>general-purpose</strong> programming language that’s <strong>approachable</strong> for newcomers and <strong>powerful</strong> for experts. <span>It is <strong>fast</strong>, <strong>modern</strong>, <strong>safe</strong>, and a <strong>joy</strong> to write.</span></h1>

{% for snippet in site.data.featured_snippets %}
```swift
{{ snippet -}}
```
{: class="featured-snippet {% if forloop.first %}visible{% endif %}" }
{% endfor %}
</div>

<div class="banner primary">
  <p>Get ready for the Swift 6 language mode with the <a href="https://www.swift.org/migration/">official migration guide</a></p>
</div>

<div class="link-grid">
  <ul>
    <li>
      <a href="/install">
        <div class="flex-container">
          <div class="latest-release-container">
          <span>
            {{ site.data.builds.swift_releases.last.name }}
          </span>
          </div>
          Latest release
        </div>
      </a>
    </li>

    <li>
      <a href="/getting-started">
        <img src="/assets/images/landing-page/signs.svg" />
        Get started
      </a>
    </li>

    <li>
      <a href="/documentation">
        <img src="/assets/images/landing-page/book.svg" />
        Read the docs
      </a>
    </li>

    <li>
      <a href="/packages">
        <img src="/assets/images/landing-page/box.svg" />
        Explore packages
      </a>
    </li>
  </ul>
</div>

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
  - [Follow @swiftlang on X (formerly Twitter)](https://twitter.com/swiftlang){:target="_blank" class="link-external"}
</div>

<script>
  var featuredSnippets = document.querySelectorAll('.featured-snippet');
  var visibleSnippet = document.querySelector('.featured-snippet.visible');
  var randomIndex = Math.floor(Math.random() * featuredSnippets.length);

  visibleSnippet?.classList.remove('visible');
  featuredSnippets[randomIndex]?.classList.add('visible');
</script>
=======
