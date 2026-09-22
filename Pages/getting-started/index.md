---
template: page-wide
title: Getting Started
contentTemplating: true
---

## Installing Swift

To kickstart your journey, [install Swift](/install) to begin using it on **macOS**, **Linux**, or **Windows**. 

> Tip: To test that you have Swift installed, run `swift --version` from your shell or terminal app.

Swift comes bundled with the [Swift Package Manager (SwiftPM)](/documentation/package-manager/) that manages the distribution of Swift code. It allows easy importing of other Swift packages into your applications and libraries, making it a valuable tool for any Swift developer.

Swift is covered by the [Apache License, Version 2.0](/LICENSE.txt).

## Using Swift

<ul class="grid-level-0">
  <li class="grid-level-1">
    <h3>✨ New to Swift?</h3>
    <p class="description">
      Swift is a great first language if you are just starting your programming journey. For a brief tour of the language, check out this introductory chapter in The Swift Programming Language book.
    </p>

    <a href="https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/" class="cta-secondary">Read A Swift Tour</a>
  </li>
</ul>

---

Here are some examples of the many use cases of Swift, in case you want to jump in and start writing some code right away.

<ul class="grid-level-0 grid-layout-2-column">
  <li class="grid-level-1">
    <h3>Command-line Tool</h3>
    <p class="description">
      Learn how to create cross-platform command-line tools such as short-lived interactive programs, or long-lived daemons that run in the background.
    </p>

    <a href="/getting-started/cli-swiftpm" class="cta-secondary">Start tutorial</a>
  </li>

  <li class="grid-level-1">
    <h3>Library</h3>
    <p class="description">
      Learn how to create a cross-platform library for sharing reusable code, or modularize large code-base.
    </p>

    <a href="/getting-started/library-swiftpm" class="cta-secondary">Start tutorial</a>
  </li>

  <li class="grid-level-1">
    <h3>Web Service</h3>
    <p class="description">
      Learn how to create a web service using a web framework.
      <br><br>
      This guide requires macOS or Linux.
    </p>

    <a href="/getting-started/vapor-web-server" class="cta-secondary">Start tutorial</a>
  </li>

  <li class="grid-level-1">
    <h3>iOS and macOS Application</h3>
    <p class="description">
      Learn how to create an iOS or macOS application using SwiftUI.
      <br><br>
      This guide requires macOS and Xcode.
    </p>

    <a href="/getting-started/swiftui" class="cta-secondary">Start tutorial</a>
  </li>
</ul>

---

Looking for a language reference? [The Swift Programming Language (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/) book is available in [multiple languages](/documentation/tspl/#translations).

## Go Further

Ready to dive deeper? Here are some hand-picked resources covering various Swift features.

<ul class="grid-level-0 grid-layout-2-column">
  #for(resource in data.go_further):
  <li class="grid-level-1">
      #if(resource.thumbnail_url):
        <img class="hero" src="#(resource.thumbnail_url)"/>
      #elseif(resource.content_type == "article"):
        <img class="hero" src="/assets/images/getting-started/article-thumbnail.jpg"/>
      #endif

      <h3>
        #(resource.title)
      </h3>

      <p class="description">
        #markdown(resource.description)
      </p>

      <a href="#(resource.content_url)" class="cta-secondary#if(resource.external): external" target="_blank"#else:"#endif>
        #if(resource.content_type == "video"):
        Watch video
        #elseif(resource.content_type == "article"):
        Read article
        #elseif(resource.content_type == "book"):
        Read book
        #else:
        View resource
        #endif
      </a>
  </li>
  #endfor
</ul>

Looking for even more? In the [documentation](/documentation/) you can find resources, references, and guidelines related to the Swift project, including the [API Design Guidelines](/documentation/api-design-guidelines/).

