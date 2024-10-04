---
layout: new-layouts/base
date: 2024-03-03 12:00:00
title: Enabling Complete Concurrency Checking
---

Data-race safety in the Swift 6 language mode is designed for incremental migration. You can address data-race safety issues in your projects module-by-module, and you can enable the compiler's actor isolation and `Sendable` checking as warnings in the Swift 5 language mode, allowing you to assess your progress toward eliminating data races before turning on the Swift 6 language mode.

Complete data-race safety checking can be enabled as warnings in the Swift 5 language mode using the `-strict-concurrency` compiler flag.

## Using the Swift compiler

To enable complete concurrency checking when running `swift` or `swiftc` directly at the command line, pass `-strict-concurrency=complete`:

```
~ swift -strict-concurrency=complete main.swift
```

## Using SwiftPM

### In a SwiftPM command-line invocation

`-strict-concurrency=complete` can be passed in a Swift package manager command-line invocation using the `-Xswiftc` flag:

```
~ swift build -Xswiftc -strict-concurrency=complete
~ swift test -Xswiftc -strict-concurrency=complete
```

This can be useful to gauge the amount of concurrency warnings before adding the flag permanently in the package manifest as described in the following section.

### In a SwiftPM package manifest

To enable complete concurrency checking for a target in a Swift package using Swift 5.9 or Swift 5.10 tools, use [`SwiftSetting.enableExperimentalFeature`](https://developer.apple.com/documentation/packagedescription/swiftsetting/enableexperimentalfeature(_:_:)) in the Swift settings for the given target:

```swift
.target(
  name: "MyTarget",
  swiftSettings: [
    .enableExperimentalFeature("StrictConcurrency")
  ]
)
```

When using Swift 6.0 tools or later, use [`SwiftSetting.enableUpcomingFeature`](https://developer.apple.com/documentation/packagedescription/swiftsetting/enableupcomingfeature(_:_:)) in the Swift settings for the given target:

```swift
.target(
  name: "MyTarget",
  swiftSettings: [
    .enableUpcomingFeature("StrictConcurrency")
  ]
)
```

## Using Xcode

To enable complete concurrency checking in an Xcode project, set the "Strict Concurrency Checking" setting to "Complete" in the Xcode build settings. Alternatively, you can set `SWIFT_STRICT_CONCURRENCY` to `complete` in an xcconfig file:

```
// In a Settings.xcconfig

SWIFT_STRICT_CONCURRENCY = complete;
```
