---
layout: new-layouts/blog
published: true
date: 2022-06-21 10:00:00
title: "Exploring Swift: Property wrappers in the wild"
author: [tingbecker, twostraws]
---

Property wrappers were [introduced in Swift 5.1](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md) as a way to make it easier to reuse common programming patterns, but since then they have grown to work with local context, function and closure parameters, and more. We’re lucky enough to have lots of creators in our community creating apps with property wrappers then writing about their experiences, and we’d like to share a few of our favorites with you here.

![Erica Sadun on stage giving a talk on property wrappers](/assets/images/property-wrappers-blog/erica.png){: style="float: left; margin-right: 1em; max-width: 50%"}
In [her talk on property wrappers](https://www.youtube.com/watch?v=ctNMf_qVXPg) from dotSwift 2020, [Erica Sadun](https://github.com/erica) teaches us why property wrappers help us specify behavior contracts at the point of declaration rather than the point of use. Erica has been one of the most active participants in the Swift Evolution process – we really appreciate her work! Another great talk comes from [Stewart Lynch](https://github.com/StewartLynch), who demonstrates how both wrapped values and projected values are useful when working with property wrappers, showing in detail how we could use them in both UIKit and SwiftUI – [you can find it here](https://www.youtube.com/watch?v=AXfSE2ET8c8).

We have lots of great articles on the topic too: [Sarun Wongpatcharapakorn](https://github.com/sarunw) shows [how to initialize property wrappers](https://sarunw.com/posts/what-is-property-wrappers-in-swift) and how projected values work, you can read advice from [Antoine van der Lee](https://github.com/AvdLee) on how [property wrappers remove boilerplate code](https://www.avanderlee.com/swift/property-wrappers/) by replacing repeated work with a custom property wrapper, and [Rudrank Riyam](https://github.com/rudrankriyam) walks us through [creating a wrapper to track device orientation](https://rudrank.blog/orientation-property-wrapper-in-swiftui) – you can really see how efficient property wrappers are at simplifying our code.

If you want to go further, you’ll like this article from [Donny Wals](https://github.com/donnywals), where he shares his knowledge on [writing custom property wrappers for SwiftUI](https://www.donnywals.com/writing-custom-property-wrappers-for-swiftui/) using the `DynamicProperty` protocol. If you follow Donny’s guide, you’ll see how property wrappers let us get fantastically concise code like this:

```swift
struct ContentView: View {
    @Setting(\.onboardingCompleted) var didOnboard

    var body: some View {
        Text("Onboarding completed: \(didOnboard ? "Yes" : "No")")

        Button("Complete onboarding") {
            didOnboard = true
        }
    }
}
```

There are also lots of packages available to support property wrappers in our projects, including [ValidatedPropertyKit](https://github.com/SvenTiigi/ValidatedPropertyKit) from [Sven Tiigi](https://github.com/SvenTiigi/), which checks that strings match a certain regular expressions, sequences have a certain number of elements, and numbers lie within a particular range; and [Burritos](https://github.com/guillermomuntaner/Burritos) from [Guillermo Muntaner](https://github.com/guillermomuntaner), which is a whole library of example property wrappers you can utilize in your projects, including `@Clamping`, `@Expirable`, `@Trimmed` and many more.

What are *your* favorite uses of property wrappers? [Send us a tweet @swiftlang and let us know!](https://twitter.com/swiftlang)
