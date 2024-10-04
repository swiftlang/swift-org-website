---
redirect_from: "/core-libraries/"
layout: new-layouts/base
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

These libraries are part of our ongoing work to extend the cross-platform capabilities of Swift.  We chose to make them part of our open source release so that we can work on them together with the community.

Writing code that provides all of this functionality from scratch would be an enormous undertaking. Therefore, we've decided to bootstrap this project by taking advantage of great work that has already been done in these areas. Specifically, we will reuse the API and as much implementation as is possible from three existing libraries: `Foundation`, `libdispatch`, and `XCTest`.

* * *

{% include_relative _foundation.md %}
{% include_relative _libdispatch.md %}
{% include_relative _xctest.md %}

* * *

As stated above, this project is in its early days. We look forward to working together with the community to create a great set of libraries that enable Swift to produce powerful software across platforms.
