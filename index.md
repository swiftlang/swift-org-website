---
layout: page-wide
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
  <p>Get ready for the Swift 6 language mode with the
  <a href="https://www.swift.org/migration/">official migration guide</a></p>
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
      <a href="https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/">
        <img src="/assets/images/landing-page/signs.svg" />
        Language tour
      </a>
    </li>

    <li>
      <a href="/documentation">
        <img src="/assets/images/landing-page/book.svg" />
        Documentation
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

## Getting Started with Swift

<p>
  Swift runs on most modern operating systems, including macOS, Windows, Linux,
  iOS, Android and embedded devices. It's a versatile language for many
  different scenarios:
</p>

<ul class="grid-level-0 grid-layout-use-cases">
  <li class="grid-level-1 selectable">
   <a href="/getting-started/swiftui">
    <div class="heading">
        <img src="/assets/images/landing-page/phone.svg" alt="">
        <h3>Mobile Apps</h3>
      </div>
      <p>
        Swift is the primary language for building polished, unique apps for
        iOS, watchOS, visionOS, and other Apple platforms.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/cli-swiftpm">
      <div class="heading">
        <img src="/assets/images/landing-page/terminal.svg" alt="">
        <h3>Command Line Tools</h3>
      </div>
      <p>
        With modern foundation libraries, argument parsing, and easy access to
        C-based system calls, developing cross-platform command-line tools
        with Swift is a breeze.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/vapor-web-server">
      <div class="heading">
        <img src="/assets/images/landing-page/server.svg" alt="">
        <h3>Web Services</h3>
      </div>
      <p>
        Swift's small memory footprint, quick startup time, and deterministic
        performance make it a great choice for server and other networked
        applications.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/library-swiftpm">
      <div class="heading">
        <img src="/assets/images/landing-page/package.svg" alt="">
        <h3>Library Packages</h3>
      </div>
      <p>
        Swift offers a robust package ecosystem for creating and sharing
        high-performance, well-maintained libraries of code that integrates
        with other systems.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/cloud/">
      <div class="heading">
        <img src="/assets/images/landing-page/cloud.svg" alt="">
        <h3>Cloud</h3>
      </div>
      <p>
        Swift has broad support for cloud development across serverless
        functions, containers, and hosted services.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/desktop/">
    <div class="heading">  
      <img src="/assets/images/landing-page/desktop.svg" alt="">
    <h3>Desktop Apps</h3>
    </div>
      <p>
        With first-class support for macOS, as well as language bindings for
        GNOME and Windows, it's easy to build an app for any major desktop
        environment with Swift.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/ai-ml">
      <div class="heading">
        <img src="/assets/images/landing-page/ai.svg" alt="">
        <h3>Machine Learning & AI</h3>
      </div>
      <p>
        With specialized frameworks like MLX for machine learning, Swift is a
        great language for developing research and experimentation.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/embedded-swift/">
      <div class="heading">
        <img src="/assets/images/landing-page/chip.svg" alt="">
        <h3>Embedded</h3>
      </div>
      <p>
        Swift targets embedded ARM and RISC-V boards with the tightest memory
        constraints, from the Raspberry Pi Pico to ESP32 boards.
      </p>
    </a>
  </li>
  <li class="grid-level-1 selectable">
    <a href="/getting-started/games/">
    <div class="heading">
      <img src="/assets/images/landing-page/controller.svg" alt="">
      <h3>Games</h3>
    </div>
      <p>
        From integration with the Godot game engine to Apple's powerful Metal
        framework, Swift provides the horsepower to enable amazing games.
      </p>
    </a>
  </li>
</ul>

Regardless of how you're using Swift, you'll find [lots of resources for learning Swift](https://developer.apple.com/swift/pathway/), whether you're taking your first steps into code or are a seasoned developer switching from another language. We also have comprehensive [Swift resources for educators](https://education.apple.com/learning-center/T021340A-en_US).

## Make Connections

Everyone is welcome to participate in improving Swift. There are many different ways to get involved: you can host or attend a Swift event; you can post or answer questions on the forums; and you can play a role in Swift's development.

<ul class="grid-level-0 grid-layout-3-column">
  <li class="grid-level-1">
    <h3>Forums</h3>
    <p>
      Share your thoughts and questions and help others in the Swift Forums.
    </p>
    <a href="https://forums.swift.org/" class="cta-secondary">Learn more</a>
  </li>
  <li class="grid-level-1">
    <h3>Events and Meetups</h3>
    <p>
      Meet up with others who are interested in Swift development at an event near you.
    </p>
    <a href="https://dev.events/ios" class="cta-secondary">Learn more</a>
  </li>
    <li class="grid-level-1">
    <h3>Contribute</h3>
    <p>
      Help shape Swift by contributing to the Swift compiler and other core components of the project.
    </p>
    <a href="/contributing/" class="cta-secondary">Learn more</a>
  </li>
</ul>

<script>
  var featuredSnippets = document.querySelectorAll('.featured-snippet');
  var visibleSnippet = document.querySelector('.featured-snippet.visible');
  var randomIndex = Math.floor(Math.random() * featuredSnippets.length);

  visibleSnippet?.classList.remove('visible');
  featuredSnippets[randomIndex]?.classList.add('visible');
</script>
