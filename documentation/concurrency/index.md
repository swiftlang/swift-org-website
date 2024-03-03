---
layout: page
date: 2024-03-03 12:00:00
title: Enabling Complete Concurrency Checking
---

Data-race safety in the Swift 6 language mode is designed for incremental migration. You can address data-race safety issues in your projects module-by-module, and you can enable the compiler's actor isolation and `Sendable` checking as warnings in the Swift 5 language mode, allowing you to assess your progress toward eliminating data races before turning on the Swift 6 language mode.

Complete data-race safety checking can be enabled as warnings in the Swift 5 language mode using the `-strict-concurrency` compiler flag.

## At the command line

To enable complete concurrency checking when running `swift` or `swiftc` directly at the command line, pass `-strict-concurrency=complete`:

```
~ swift -strict-concurrency=complete main.swift
```

## In a Swift package manifest

To enable complete concurrency checking for a target in a Swift package using Swift 5.9 or Swift 5.10 tools, use [`SwiftSetting.enableExperimentalFeature`](https://developer.apple.com/documentation/packagedescription/swiftsetting/enableexperimentalfeature(_:_:)) in the Swift settings for the given target:

```swift
swiftSettings: [.enableExperimentalFeature("StrictConcurrency")]
```

When using Swift 6.0 tools or later, use [`SwiftSetting.enableUpcomingFeature`](https://developer.apple.com/documentation/packagedescription/swiftsetting/enableupcomingfeature(_:_:)) in the Swift settings for the given target:

```swift
swiftSettings: [.enableUpcomingFeature("StrictConcurrency")]
```

## In Xcode

To enable complete concurrency checking in an Xcode project, set the "Swift Strict Concurrency" setting to "Complete" in the Xcode build settings. Alternatively, you can set `SWIFT_STRICT_CONCURRENCY` to `complete` in an xcconfig file:

```
// In a Settings.xcconfig

SWIFT_STRICT_CONCURRENCY = complete;
```
