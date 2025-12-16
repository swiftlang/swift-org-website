---
layout: new-layouts/post
published: true
date: 2025-11-14 17:15:00
title: "GSoC 2025 Showcase: Improved Console Output for Swift Testing"
author: [kelvin, ktoso]
category: "Community"
---

The Swift community participated in [Google Summer of Code](https://summerofcode.withgoogle.com) 2025, and we've recently been showcasing all of the projects and work accomplished here on the Swift blog. You can learn more by following these convenient links:

- [Bringing Swiftly support to VS Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/)
- [Extending Swift-Java Interoperability](/blog/gsoc-2025-showcase-swift-java/)
- [Improved code completion for Swift](/blog/gsoc-2025-showcase-code-completion/)
- Improved console output for Swift Testing (this post)

Each GSoC contributor has shared a writeup about their project and experience in the program. The fourth and last post in this year's series, contributed by Kelvin Bui, improved the console output that is printed when running tests implemented with Swift Testing.

To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-improved-console-output-for-swift-testing/82060).

---

## Improved Console Output for Swift Testing 

Hello everyone! My name is Kelvin Bui, and I'm excited to share my GSoC 2025 project, where I worked on improving the console output for the Swift Testing framework with my mentor, Stuart Montgomery.

### Overview

This summer, as part of Google Summer of Code 2025, I had the incredible opportunity to work on [improving the console output for the Swift Testing framework](https://www.swift.org/gsoc2025/). The primary goal was to transform the existing static log into a modern, clear, and highly useful tool for developers. The main achievement of this project is the design and implementation of a new, two-phase console reporter, with a primary focus on delivering a comprehensive **Hierarchical Summary** and **Detailed Failure Report**. It also leverages serialization to allow emitting output from a separate supervisor process, in alignment with future project directions.

### Problem & Motivation

The default console output for `swift test` was functional but presented several challenges for developers working on large and complex projects:

* **Difficulty Locating Failures:** In large test suites, critical failure messages were often lost in a long stream of success outputs, making it hard to quickly assess the health of a test run.
* **Lack of Structure:** The flat log format made it difficult to understand the relationship between tests and their parent suites, especially in projects with many nested modules.

Our vision was to solve these problems by creating an advanced console reporter that is both informative and intuitive.

### Key Technical Achievements

**Hierarchical Test Display:**

* A clear, indented tree structure that visualizes the relationship between suites and tests.
* An "issues as sub-nodes" model for displaying rich failure context directly within the hierarchy.
* An "out-dented" suite summary line that cleanly concludes each suite's output.

**Serialization-Based Architecture:**

* A future-proof design that processes `ABI.EncodedEvent` objects, preparing the reporter for an out-of-process harness architecture.
* Logic to build an in-memory representation of the test plan by consuming initial test discovery events and then looking up test details by ID for subsequent events.

**Rich Failure Reporting:**

* A dedicated `FAILED TEST DETAILS` section that provides comprehensive information for each failure, including the fully qualified test name, a detailed error message, and the exact source location (`file:line`).

### Visuals: Before & After

The Advanced Console Output Recorder fundamentally transforms how developers interact with test results. By introducing a visual hierarchy and detailed contextual information, it elevates the diagnostic experience from a flat, hard-to-parse log into a structured, scannable report.

**Current Console Output:**
![Current Console Output](/assets/images/gsoc-25/testing-output-1.jpg)

Prior to this project, the default `swift test` output presented a linear, undifferentiated stream of events. While functional, this format lacked visual cues, making it challenging to quickly identify test relationships, pinpoint failures within large suites, or understand the overall structure of a test run. The absence of clear demarcation between test suites and individual tests often led to slower debugging cycles and increased cognitive load for developers.

**New Hierarchical Summary:**
![New Hierarchical Test Results](/assets/images/gsoc-25/testing-output-2.jpg)

The new recorder introduces a rich, hierarchical display that immediately brings order and clarity to test output. Using Unicode box-drawing characters (with ASCII fallback), it clearly visualizes the nested structure of test modules, suites, and individual tests. This not only makes the test results significantly easier to read and navigate but also provides crucial context around failed tests, displaying detailed issue descriptions directly within their respective hierarchical nodes. This transformation dramatically improves the developer experience by offering instant insights into test organization and failure points.

![Failed Tests Showcase](/assets/images/gsoc-25/testing-output-3.jpg)

### Challenges & Lessons Learned

**Technical lessons:**

* Designing for serialization & ABI: Refactoring to consume ABI.EncodedEvent taught me the value of decoupling - moving from in-process object graphs to a serialized event stream increases robustness and enables harness-style execution. It also exposed careful trade-offs: serialization simplifies process boundaries but requires stable encoding contracts and more explicit discovery/lookup logic for test metadata.
* Building a thread-safe collector for results required balancing lock granularity and throughput. The adopted strategy (a single lock per event bucket, plus careful mutation patterns) simplifies correctness while keeping contention low for typical test workloads.
* Cross-platform fallbacks: Supporting ASCII fallback for line-drawing characters taught me to design for the weakest terminal capability first, then progressively enhance for modern terminals. Testing across Windows/Linux/macOS terminals and non-interactive CI runners uncovered many small but critical edge cases (line-wrapping, width detection fallbacks).
* Deciding what to show inline vs. in a details section is a UX trade-off; too much inline detail makes the tree noisy, and too little hides useful context. The two-tier approach (short inline message + full details section) balances these needs.

**Collaboration & process lessons:**

* Presenting to the workgroup matters: Early live presentation to the Swift Testing workgroup exposed design assumptions quickly and gave direction that influenced major architectural choices.
* Iterative, small PRs win: Breaking work into digestible PRs (skeleton → ABI pivot → UI features) made reviews actionable and reduced reviewer fatigue.
* Incorporating targeted reviewer comments (e.g., ABI pivot) showed the importance of documenting design decisions (why we choose serialization, how the tree is constructed), which speeds later onboarding and review cycles.

**Personal growth:**

I learned how to accept and act on high-quality feedback from senior engineers, and how to reframe technical trade-offs as testable hypotheses. The project sharpened my ability to move from mockups to production code while keeping maintainability and cross-platform compatibility as first-class concerns.

### Acknowledgements

I'd like to express my deepest gratitude to my mentor, Stuart Montgomery, for his exceptional guidance, patience, and technical insights throughout this entire project. His mentorship has been invaluable.

I'd also like to thank Jonathan Grynspan for his crucial, in-depth architectural feedback, which significantly improved the project's long-term viability. Thank you as well to **[Swift Testing Workgroup](https://www.swift.org/testing-workgroup/)**, and all the other members of the Swift community who provided thoughtful feedback on the forums. This project would not have been possible without your collective expertise and support.
