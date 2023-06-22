---
layout: default
title: Welcome to Swift.org
atom: true
---

# Welcome to Swift.org

Swift is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns.

{% for snippet in site.data.featured_snippets %}
```swift
{{ snippet -}}
```
{: class="featured-snippet {% if forloop.first %}visible{% endif %}" }
{% endfor %}

<div class="link-grid" markdown="1">
  <ul>
    <li>
      <a href="/blog/swift-5.8-released">
        <div class="flex-container">
          <div class="latest-release-container">
          <span>
            5.8
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
  </ul>
</div>

## Why Swift?

<ul class="why-swift-list">
  <li>
    <h3>Safe</h3>
    <p>
      Swift prioritizes safety and clarity, ensuring that code behaves in a safe manner while also promoting clear and concise programming practices.
    </p>
  </li>
  <li>
    <h3>Fast</h3>
    <p>
      Swift aims to replace C-based languages (C, C++, and Objective-C) and match their performance, while maintaining consistency and predictability.
    </p>
  </li>
  <li>
    <h3>Expressive</h3>
    <p>
      Swift builds upon decades of advancements in computer science, providing a modern syntax that is a joy to use.
    </p>
  </li>
</ul>

<div class="links links-list-nostyle" markdown="1">
  - [Learn more about Swift](/about)
</div>

## Use cases

<ul class="use-cases">
  <li>
    <h3>Apple platforms</h3>
    <p>
      Swift is a powerful and intuitive programming language optimized when running on iOS, macOS, and other Apple platforms.
      <br><br>
      Apple offers a wide variety of frameworks and APIs that make applications developed for these platforms unique and fun.
    </p>  
    <a href="https://developer.apple.com/swift/resources/" class="cta-secondary">Learn more</a>
  </li>
  <li>
    <h3>Cross-platform Command-line</h3>
    <p>
      Writing Swift is interactive and fun, the syntax is concise yet expressive.
      Swift code is safe by design and produces software that runs lightning-fast.
      <br><br>
      SwiftArgumentParser and Swift's growing package ecosystem make developing cross-platform command-line tools a breeze.
    </p>

    <a href="/getting-started/cli-swiftpm" class="cta-secondary">Learn more</a>
  </li>
  <li>
    <h3>Server and Networking</h3>
    <p>
      Swift's small memory footprint, quick startup time, and deterministic performance make it a great choice for server and other networked applications.
      <br><br>
      SwiftNIO and Swift's dynamic server ecosystem bring joy to developing networked applications.
    </p>

    <a href="/server" class="cta-secondary">Learn more</a>
  </li>
</ul>

## Getting involved

Everyone is welcome to contribute to Swift. Contributing doesn’t just mean submitting pull requests—there are many different ways for you to get involved, including answering questions on the forums, reporting or triaging bugs, and participating in the Swift evolution process.

No matter how you want to get involved, we ask that you first learn what’s expected of anyone who participates in the project by reading the [Community Overview](/community/). If you’re contributing code, you should also know how to build and run Swift from the repository, as described in [Source Code](/source-code/).

<ul class="getting-involved">
  <li>
    <h3>Design</h3>
    <p>
      Help shape the future of Swift by participating in <em>the Swift evolution process</em>.
    </p>
    <a href="/contributing/#swift-evolution" class="cta-secondary">Learn more</a>
  </li>
  <li>
    <h3>Code</h3>
    <p>
      Contribute to the Swift compiler, standard library, and other core components of the project.
    </p>
    <a href="/contributing/#contributing-code" class="cta-secondary">Learn more</a>
  </li>
  <li>
    <h3>Troubleshoot</h3>
    <p>
      Help improve the quality of Swift by reporting and triaging bugs.
    </p>
    <a href="/contributing/#triaging-bugs" class="cta-secondary">Learn more</a>
  </li>
</ul>

## What's new

Stay up-to-date with the latest in the Swift community.

<div class="links links-list-nostyle" markdown="1">
  - [Visit the Swift.org blog](/blog/)
  - [Visit the Swift forums](https://forums.swift.org)
  - [Follow @Swiftlang on Twitter](https://twitter.com/swiftlang){:target="_blank" class="link-external"}
</div>

<script>
  var featuredSnippets = document.querySelectorAll('.featured-snippet');
  var visibleSnippet = document.querySelector('.featured-snippet.visible');
  var randomIndex = Math.floor(Math.random() * featuredSnippets.length);

  visibleSnippet?.classList.remove('visible');
  featuredSnippets[randomIndex]?.classList.add('visible');
</script>
