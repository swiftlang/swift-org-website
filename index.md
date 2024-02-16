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

<ul class="use-cases">
  <li>
    <h3>Apple Platforms</h3>
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

    <a href="/documentation/server" class="cta-secondary">Learn more</a>
  </li>
</ul>

## Community

{% assign events = site.data.events | where_exp:"event", "event.date > site.time" %}
<ul class="community {% unless events.size > 0 %}connect-only{% endunless %}" markdown="1">
  <li>
    <h3>Connect</h3>
    <p>Stay up-to-date with the latest in the Swift community.</p>
    <div class="link-grid">
      <ul>
        <li>
          <a href="/blog/">
            <img src="/assets/images/icon-swift.svg" /><span>Visit the Swift.org blog</span>
          </a>
        </li>
        <li>
          <a href="https://forums.swift.org">
            <img src="/assets/images/icon-swift.svg" /><span>Visit the Swift forums</span>
          </a>
        </li>
        <li>
          <a href="https://twitter.com/swiftlang" class="link-external">
            <img src="/assets/images/icon-x.svg" class="with-invert" /><span>Follow @swiftlang on X</span>
          </a>
        </li>
      </ul>
    </div>
  </li>
  {% if events.size > 0 %}
    <li>
      <h3>Events</h3>
      <p>Check the upcoming Swift related events.</p>
      <ul class="event-list">
        {%- for event in events %}
          <li>
            <h4>
              <a href="#">{{ event.name }}</a>
            </h4>
            <time pubdate datetime="{{ event.date | date_to_xmlschema }}">
              {{ event.date | date: "%B %-d, %Y" }}
            </time>
            <p>{{ event.description }}</p>
          </li>
        {% endfor %}
      </ul>
    </li>
  {% endif %}
</ul>

## Getting Involved

Everyone is welcome to contribute to Swift. Contributing doesn’t just mean writing code or submitting pull request — there are many different ways for you to get involved, including answering questions on the forums, reporting or triaging bugs, and participating in the Swift evolution process.

No matter how you want to get involved, we ask that you first learn what’s expected of anyone who participates in the project by reading the [Community Overview](/community/). If you’re contributing code, you should also know how to build and run Swift from the repository, as described in [Source Code](/documentation/source-code/).

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

<script>
  var featuredSnippets = document.querySelectorAll('.featured-snippet');
  var visibleSnippet = document.querySelector('.featured-snippet.visible');
  var randomIndex = Math.floor(Math.random() * featuredSnippets.length);

  visibleSnippet?.classList.remove('visible');
  featuredSnippets[randomIndex]?.classList.add('visible');
</script>
