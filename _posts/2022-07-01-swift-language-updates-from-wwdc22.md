---
layout: new-layouts/blog
published: true
date: 2022-07-06 08:00:00
title: "Swift language announcements from WWDC22"
author: [fbernutz, hishnash, natpanferova]
---

![Sketchnote summary for Swift language announcements from WWDC22 blog post](/assets/images/swift-language-updates-from-wwdc22-blog/wwdc22-swift-updates-sketch-thumbnail.jpeg)

> See the [sketchnote in full resolution](/assets/images/swift-language-updates-from-wwdc22-blog/wwdc22-swift-updates-sketch.jpeg)

Swift has evolved significantly during the past year, and we've seen two large updates to the language. [Swift 5.6](https://www.swift.org/swift-evolution/#?version=5.6) was released in March 2022 and introduced major improvements to the type system, concurrency model and Swift ecosystem. It laid the groundwork for further updates in [Swift 5.7](https://www.swift.org/swift-evolution/#?version=5.7), which is included in [beta versions of Xcode 14](https://developer.apple.com/download/applications/) and available on the [Swift.org downloads page](/download/#swift-57-development).

Many Swift updates were rightfully celebrated during WWDC22, with sessions focusing on language changes, tooling improvements, additions to Swift packages and more. The [
What's new in Swift](https://developer.apple.com/videos/play/wwdc2022/110354/) video provides a great overview of Swift news for the past year. In this post we would like to share our highlights about the Swift ecosystem from WWDC.

## Community initiatives

The community around the Swift language is growing, and the great initiatives introduced earlier are expanding and getting more widespread support. New workgroups have been announced that will be focusing on specific areas in the Swift ecosystem. The [Swift website workgroup](/website-workgroup/) is guiding the evolution of the [Swift.org](/) website, the [Swift and C++ interoperability group](https://forums.swift.org/t/swift-and-c-interoperability-workgroup-announcement/54998) is working on advancing the interoperability support between the two languages, and the [Swift language workgroup](/blog/language-workgroup/) is overseeing the language and standard library. The [Swift Mentorship Program](/mentorship/), announced in 2021, has been extended for another year and includes additional topics, such as DocC, C++ interoperability and the Swift website. It's worth mentioning that [the Swift.org website is now open source](/blog/website-open-source/) and ready for community contributions.

Speaking of open source, the [Swift-DocC](https://github.com/swiftlang/swift-docc) compiler for Swift frameworks and packages announced last year is now open source too, and has some great improvements. It added support for app projects as well as support for Objective-C and C API documentation. We definitely recommend checking out the [What's new in Swift-DocC](https://developer.apple.com/videos/play/wwdc2022/110368/) session to learn more.

## Swift packages

We've seen important updates to the [Swift Package Manager](https://github.com/swiftlang/swift-package-manager), including support for module disambiguation, the ability to define build tool plugins and custom command plugins, as well as security and performance improvements.

Starting from Swift 5.6, Swift Package Manager performs trust on first use (TOFU) validation. The fingerprint of a package is recorded when the package is first downloaded and subsequent downloads will report an error if the fingerprint is different. This change is great for better security of packages.

In Swift 5.7, Swift Package Manager gained an exciting improvement, that will help us avoid problems with using multiple packages with the same name in our projects. It now lets us name modules from outside the packages that define them, and add module aliases.

With the new `PackagePlugin` API, we can define custom plugins to generate source code or automate release tasks. The [
Create Swift Package plugins](https://developer.apple.com/videos/play/wwdc2022/110401/) session teaches us how to write such plugins in Swift.

## Language updates

This year we've seen some great additions to the Swift language that include a whole spectrum of changes, from smaller syntax improvements to larger generics and concurrency updates.

This post highlights some of the Swift updates that caught our attention this WWDC. For the code samples in the following sections, we took inspiration from the [Bird of the Year](https://www.birdoftheyear.org.nz/) competition in Aotearoa New Zealand. After all, given who the winner of Bird of the Year 2021 was (it was a bat 🤫), some additional type safety for contestants couldn't hurt.

### Quality of life improvements

One small but really nice improvement in Swift 5.7 is the shorthand syntax for optional unwrapping with `if let`, `guard let` and `while let`. We can drop the right-hand side to get the unwrapped optional with the same name as the original.

```swift
var startDate: Date?

if let startDate {
    print("""
    Bird of the Year competition \
    starts on \(startDate.formatted())
    """)
}
```

Another change that will improve our code is type inference support for complex closures with multiple statements. We no longer need to specify the return type manually if our closure contains `if else`, `do catch` or any other control flow statements.

```swift
let participants = ["Kororā", "Weka", "Pekapeka-tou-roa"]

let introductions = participants.map {
    if $0.hasPrefix("Pekapeka") {
        return "\($0) is a mammal"
    } else {
        return "\($0) is a bird"
    }
}
```

### String processing

Swift 5.7 features huge updates for string processing with the introduction of regex literals and the [RegexBuilder](https://developer.apple.com/documentation/RegexBuilder) library, paired with matching methods and strongly typed captures.

We can name our matches and easily extract them from the final result.

```swift
let intent = "I vote for Pūkeko and Kea"

let regex = /I vote for (?<bird1>.+?) and (?<bird2>.+?)/

if let votes = try? regex.wholeMatch(in: intent) {
    print("Your first choice is \(votes.bird1)")
    print("Your second choice is \(votes.bird2)")
}
```

And with RegexBuilder, we can construct our regex search with a SwiftUI-style language, that can make it more readable and unlock more powerful capabilities.

```swift
let word = OneOrMore(.word)
let regex = Regex {
    "I vote for "
    Capture { word }
    " and "
    Capture { word }
}

if let votes = try? regex.wholeMatch(in: intent) {
    let (_, bird1, bird2) = votes.output
    print("Your first choice is \(bird1)")
    print("Your second choice is \(bird2)")
}
```

There are two informative sessions about the new string processing APIs: [Meet Swift Regex](https://developer.apple.com/videos/play/wwdc2022/110357/) and [Swift Regex: Beyond the basics](https://developer.apple.com/videos/play/wwdc2022/110358/).

### Generics and protocols

There are many improvements to Swift protocols and generics this year. Protocols now support primary associated types. We can specify it in angle brackets next to the protocol name, and it should be the type that is used more often than others at the call site.

```swift
protocol Contestant<Habitat> {
    associatedtype Habitat: Territory
    associatedtype Food

    var home: Habitat { get set }
    var favoriteFood: Food { get set }
    var name: String { get }
}
```

Using the angle brackets syntax, we can then constrain the primary associated type to a specific type.

```swift
func fundReforestation<Animal: Contestant<Forest>>(for animal: Animal) {
    scheduleTreePlanting(in: animal.home)
}
```

It's also becoming easier to write generic methods and functions thanks to the new ability to use `some` with parameter types. If a generic parameter is only used in one place, we can specify the protocol together with `some` keyword for its type, without the need to set a generic constraint on the function.

```swift
func fundConservationEfforts(for animal: some Contestant) {
    establishProtectedAreas(in: animal.home)
    startIntensiveMonitoring(of: animal)
}
```

We can even use `some` with parameters, that have primary associated type constraints, so we can rewrite our previous example for `fundReforestation()` function in a cleaner way.

```swift
func fundReforestation(for animal: some Contestant<Forest>) {
    scheduleTreePlanting(in: animal.home)
}
```

There have also been a ton of improvements for existential types in Swift. We can now use the `any` keyword to mark places where existential types are used, and we no longer have the constraints we had before for using existential types with `Self` or `associatedtype` requirements. We can put them into a collection, use an existential type to constrain a variable or use it as a parameter type.

For example, we can make an array of contestants, which we wouldn't be able to do before, because `Contestant` protocol in our example has associated types.

```swift
let contestants: [any Contestant] = [
    brownKiwi, ruru, whio
]

for contestant in contestants {
    fundConservationEfforts(for: contestant)
}
```

Knowing that previous constraints for existential types are gone, we can audit our existing code for type-erasing wrappers and check if we can reimplement them using existential types now.

To find out more about generics in Swift 5.7, make sure to check out the [Embrace Swift generics](https://developer.apple.com/videos/play/wwdc2022/110352/) session. And to learn how to design advanced abstractions using protocols, watch [Design protocol interfaces in Swift](https://developer.apple.com/videos/play/wwdc2022/110353/).

### Concurrency

Concurrency updates this year build upon last year's changes and focus on data race safety. We even have new opt-in safety checks in Xcode to help us identify potential issues.

Swift actors, introduced last year, help us write thread-safe code by isolating access to their properties. New distributed actors this year take the notion of actor isolation further and make it simpler to develop distributed systems. The open source [Distributed Actors](https://github.com/apple/swift-distributed-actors/) library provides a complete solution for building server-side clustered distributed systems in Swift. The [Meet distributed actors in Swift](https://developer.apple.com/videos/play/wwdc2022/110356/) video goes into more detail on using actors when working with distributed systems and apps.

We also have a new Swift package [Async Algorithms](https://github.com/apple/swift-async-algorithms), that provides ready solutions for working with `AsyncSequence`. It includes algorithms that could be tricky to implement on our own such as `debounce`, `throttle`, `merge`, and `zip`. These algorithms help us to work with values over time.

```swift
let kiwiFinder = KiwiFinder()
let counter = Counter()

for try await (i, kiwi) in zip(counter, kiwiFinder) {
    print("Kiwi number \(i) is a \(kiwi.name)")
}
```

Another great addition in Swift is the new standard way of interacting with time, which includes three distinct components: clock, instant and duration. These new APIs integrate nicely with concurrent tasks.

```swift
func announceWinner(_ winner: some Contestant) async throws {
    print("Building suspense...")

    try await Task.sleep(
        until: .now + .seconds(10),
        tolerance: .seconds(1),
        clock: .suspending
    )

    print("The winner is \(winner.name)!")
}
```

To learn more about the Async Algorithms package and to discover the best practices for using the Swift `Clock` type to work with values over time, check out the [Meet Swift Async Algorithms](https://developer.apple.com/videos/play/wwdc2022/110355/) WWDC session.

Concurrency support in Swift received many other major upgrades this year, such as optimizations for improved performance, actor prioritization and built-in priority-inversion avoidance. Instruments now has a new Swift Concurrency template that helps us to investigate performance issues. The [Visualize and optimize Swift concurrency](https://developer.apple.com/videos/play/wwdc2022/110350/) talk discusses common issues we might encounter in our apps and shows how to use Instruments to find and resolve performance problems.

There are so many more great updates that it's impossible to cover them all. We are getting faster builds in Xcode thanks to parallelization, faster type checking for function signatures with protocols and `where` clauses, optimizations for run-time protocol conformance checking and more. With reduced standard library size, Swift can run in a variety of environments, and with streamlined toolchain distribution for Linux, many more of us can enjoy using Swift on our favorite platforms.

We are really looking forward to exploring all of these new features further and to using them in our projects.
