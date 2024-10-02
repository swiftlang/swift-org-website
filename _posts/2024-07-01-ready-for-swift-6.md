---
layout: new-layouts/blog
published: true
date: 2024-07-01 09:00:00
title: Plotting a Path to a Package Ecosystem without Data Race Errors
author: [daveverwer, svenaschmidt]
---

Swift 6 introduces [compile-time data race safety checking](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/dataracesafety) for any code that [opts in to use the Swift 6 language mode](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/swift6mode). While individual modules can adopt this mode incrementally and independently of their dependencies, the full benefit of runtime data race safety is only realized when all modules have opted in. Therefore, the quick adoption of Swift 6 language mode across the ecosystem of open-source packages will play a key role in advancing data race safety across the entire Swift ecosystem.

Data races can lead to crashes, inconsistent behaviour, and performance issues in apps so the sooner apps and their dependencies can adopt the Swift 6 language mode and opt in to these checks, the better!

## Tracking Swift 6 Readiness and Progress

The Swift Package Index’s new [Ready for Swift 6](https://swiftpackageindex.com/ready-for-swift-6) page tracks progress toward data race safety across the entire package ecosystem. While packages can opt in to Swift 6 language mode at their convenience, this page shows the number of packages that would pass those checks if all strict concurrency checks were enabled for all packages.

The Swift Package Index has been running these checks using Swift 6 nightly toolchains since early May, and there has already been a steady reduction in the [number of packages with data race errors](https://swiftpackageindex.com/ready-for-swift-6#total-zero-errors). For the past week, the Swift Package Index build machines have been running fresh builds with the advantage of platform SDKs with more `Sendable` conformance, bringing the total percentage of packages with zero data race errors to over 43%! That's a really great start for being only one week into the Swift 6 beta process.

![Chart showing the number of packages with no data race errors increasing over time from May this year](/assets/images/ready-for-swift-6-blog/packages-with-no-data-race-errors.png)

Over time, successful adoption of Swift 6 language mode in the package ecosystem will come from two directions. First, as more packages opt into these checks, package authors will fix potential data races highlighted by the compiler, increasing compatibility and reducing errors. Second, compiler iterations will refine data race checking and consolidate error diagnostics.

## Data Race Safety Indicators

When evaluating a package, it is helpful to know if that package has any reported data race safety issues. To assist with this, the Swift Package Index now displays a “Safe from data races” label alongside other package metadata when packages compile with zero errors [using `complete` strict concurrency checks](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/completechecking).

![Package metadata shown on the Swift Package Index showing that the package has no data race errors](/assets/images/ready-for-swift-6-blog/package-showing-safe-from-data-races.png)

### Compatibility vs Data Race Safety

During the transition to Swift 6, you will likely see packages that show a green checkmark against Swift 6 in Swift Package Index’s platform and Swift version compatibility matrix while also showing that the package has data race safety errors:

![A Swift Package Index compatibility matrix showing a green checkmark against Swift 6 compatibility](/assets/images/ready-for-swift-6-blog/package-compatibility-with-swift-6.png)

When compiling packages to check compatibility with Swift 6, the Swift Package Index uses whichever language mode the package author specifies. A package can be compatible with Swift 6 before it adopts the Swift 6 language mode and strict concurrency checks and the matrix only ever shows compatibility. Whether you adopt a package with potential data race safety issues is yours to make, but if the compatibility matrix shows a green checkmark, you can.

## Call to Action: Adopt the Swift 6 Language Mode

Compile-time data race safety is a major advance for the Swift language, eliminating an entire class of potential concurrency bugs and elevating your code's safety and maintainability. Every module that migrates to Swift 6 contributes to the community-wide transition to bring data race safety to the Swift software ecosystem. You can help by [updating your own packages](https://www.swift.org/migration/), and you can follow the broader ecosystem's progress on the [Ready for Swift 6 page on the Swift Package Index](https://swiftpackageindex.com/ready-for-swift-6).
