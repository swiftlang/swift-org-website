---
layout: new-layouts/blog
published: true
date: 2015-12-03 12:01:01
title: Swift 3 API Design Guidelines
---

The design of commonly-used libraries has a large impact on the
overall feel of a programming language. Great libraries feel like an
extension of the language itself, and consistency across libraries
elevates the overall development experience. To aid in the
construction of great Swift libraries, one of the major [goals for
Swift 3][swift-3-goals] is to define a set of API design guidelines
and to apply those design guidelines consistently.

The effort to define the Swift API Design Guidelines involves several
 major pieces that, together, are intended to provide a more cohesive
 feel to Swift development. Those major pieces are:

* **Swift API Design Guidelines**: The actual API design guidelines
  are under active development. The latest draft of [Swift API
  Design Guidelines][swift-api-guidelines] is available.

* **Swift Standard Library**: The entire Swift standard library is
  being reviewed and updated to follow the Swift API design
  guidelines. The actual work is being performed on the
  [swift-3-api-guidelines branch][swift-stdlib-update] of the Swift
  repository.

* **Imported Objective-C APIs**: The translation of Objective-C APIs
  into Swift is being updated to make Objective-C APIs better match
  the Swift API design guidelines, using a variety of heuristics. The
  [Better Translation of Objective-C APIs into Swift][clang-importer-proposal]
  proposal describes how this transformation
  is done. Because this approach naturally involves a number of
  heuristics, we track its effects on the Cocoa and Cocoa Touch
  frameworks, as well as Swift code using those frameworks. The [Swift
  3 API Design Guidelines Review][swift-3-api-guidelines-repo]
  repository provides a way to see how
  this automatic translation affects Swift code that uses Cocoa and
  Cocoa Touch. Specific Objective-C APIs that translate poorly into
  Swift will then be annotated (for example, with `NS_SWIFT_NAME`) to improve
  the resulting Swift code. While this change primarily impacts Apple
  platforms (where Swift uses the Objective-C runtime), it also has a
  direct impact on the cross-platform [Swift core
  libraries][core-libraries] that provide the same APIs as Objective-C
  frameworks.

* **Swift Guideline Checking**: Existing Swift code has been written
  to follow a variety of different coding styles, including the [Objective-C
  Coding Guidelines for Cocoa][objc-cocoa-guidelines]. By leveraging
  the heuristics used to import Objective-C APIs, the Swift compiler
  can (optionally!) check for common API design patterns that don't
  meet the Swift API Design Guidelines and suggest improvements.

* **Swift 2 to Swift 3 Migrator**: The updates to the Swift standard
  library and the imported Objective-C APIs are source-breaking
  changes. This effort will involve the creation of a migrator to
  update Swift 2 code to use the Swift 3 APIs.

All of these major pieces are under active development. If you're
interested in following along, check out the [Swift API design
guidelines][swift-api-guidelines], the [Swift standard library
changes][swift-stdlib-update], the [Objective-C API importer
changes][clang-importer-proposal] proposal and corresponding [review
repository][swift-3-api-guidelines-repo], then join the discussion on
the [swift-evolution mailing
list](/community/#swift-evolution).

[swift-3-goals]: https://github.com/swiftlang/swift-evolution/blob/master/README.md  "Swift 3 goals"
[swift-api-guidelines]: /documentation/api-design-guidelines/  "Swift API Design Guidelines"
[swift-stdlib-update]: https://github.com/apple/swift/tree/swift-3-api-guidelines  "Swift 3 Standard Library updates"
[clang-importer-proposal]: https://github.com/swiftlang/swift-evolution/blob/master/proposals/0005-objective-c-name-translation.md  "Better Translation of Objective-C APIs into Swift proposal"
[swift-3-api-guidelines-repo]: https://github.com/apple/swift-3-api-guidelines-review  "Swift 3 API Design Guidelines review repository"
[objc-cocoa-guidelines]: https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/CodingGuidelines/CodingGuidelines.html  "Objective-C Coding Guidelines for Cocoa"
[swift-evolution]: /contributing/#evolution-process  "Swift evolution process"
[core-libraries]: /documentation/core-libraries  "Swift core libraries"
