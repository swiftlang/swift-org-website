---
redirect_from: "/core-libraries/"
layout: page
title: Swift Core Libraries
---

The Swift Core Libraries project provides higher-level functionality than the
Swift standard library. These libraries provide powerful tools that developers
can depend upon across all the platforms that Swift supports. The Core Libraries
have a goal of providing stable and useful features in the following key areas:

* Commonly needed types, including data, URLs, character sets, and specialized collections
* Unit testing
* Networking primitives
* Scheduling and execution of work, including threads, queues, and notifications
* Persistence, including property lists, archives, JSON parsing, and XML parsing
* Support for dates, times, and calendrical calculations
* Abstraction of OS-specific behavior
* Interaction with the file system
* Internationalization, including date and number formatting and language-specific resources
* User preferences


### Project Status

The core libraries are developed in the open together with the community. On Apple platforms they're provided by the operating system and Xcode; on other platforms they're included in the Swift toolchain. They consist of four libraries: `Foundation`, `libdispatch`, and `XCTest`, which provide APIs familiar from Apple platforms, and `Swift Testing`, a testing library designed from the ground up for Swift.

* * *

{% include_relative _foundation.md %}
{% include_relative _libdispatch.md %}
{% include_relative _swift-testing.md %}
{% include_relative _xctest.md %}

* * *
