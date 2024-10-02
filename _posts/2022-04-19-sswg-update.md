---
layout: new-layouts/blog
published: true
date: 2022-04-25 11:00:00
title: SSWG 2021 Annual Update
author: 0xTim
---

Since the last update from the SSWG, the Swift on Server ecosystem has continued to grow and expand.

To start, the SSWG is very happy to welcome three new members:

* Adam Fowler
* Fabian Fett (Apple)
* Patrick Freed (MongoDB)

Adam, Fabian and Patrick officially joined the SSWG on September 3rd. Fabian replaced Johannes Weiss who has completed a three year stint on the SSWG. We are extremely grateful for all he's done in that time.

Let’s recap the SSWG goals from last year and look forward to what’s to come.

### Swift Concurrency

Swift 5.5 [was released](/blog/swift-5.5-released/) in the fall of 2021 and introduced a new concurrency model for Swift. This will have far reaching impacts for Swift on the server, making code significantly easier to read and maintain, and introduce new possibilities with language features such as distributed actors.

Fully migrating to the new concurrency model is a long process. Many libraries and APIs will need to adopt `async`/`await` as well as `Sendable` checking as we progress toward Swift 6.

The SSWG [published the concurrency adoption guidelines](https://github.com/swift-server/guides/blob/main/docs/concurrency-adoption-guidelines.md) for library and application developers and there a lot of great examples of code simplification as developers migrate to the new concurrency model.

Significant progress has been made in the Swift on the server ecosystem in adopting `async`/`await`. Frameworks like [Vapor](https://github.com/vapor/vapor), [Smoke](https://github.com/amzn/smoke-framework) and [Hummingbird](https://github.com/hummingbird-project/hummingbird) have added `async`/`await` APIs. Many other packages and libraries such as the [MongoDB driver](https://github.com/mongodb/mongo-swift-driver/) and [AsyncHTTPClient](https://github.com/swift-server/async-http-client) have also added new `async`/`await` APIs.

The SSWG expect concurrency to be a strong theme for 2022 as `Sendable` checking is adopted and existing libraries start to migrate to use new features like `AsyncSequence`. There are some low-level packages that still need to adopt new APIs, notably [SwiftLog](https://github.com/apple/swift-log) and [SwiftDistributedTracing](https://github.com/apple/swift-distributed-tracing), but these should be completed soon. The SSWG believes that the majority of libraries and frameworks should in time become `async`/`await` only and not use or expose `EventLoopFuture`s to users.

### Tooling

Tooling was another focus for the SSWG in 2021 and saw significant new releases to make developers’ lives easier.

First, there was a focus to establish more streamlined ways to install Swift on non-Apple platforms. RPM/Deb packages are the de facto standard for installation on Linux and [the call for community contribution](https://forums.swift.org/t/rpm-and-debs-for-swift-call-for-the-community/49117) was well received. There are now [installer scripts](https://github.com/apple/swift-installer-scripts) for building toolchain packages for multiple platforms and these have been adopted using community repositories to allow easy installation on a number of Linux distributions.

Toward the end of the year, [a new Swift for VSCode extension was announced](https://forums.swift.org/t/introducing-swift-for-visual-studio-code/54246) to make working with Swift on VSCode a seamless experience. Thanks to the hard-work from Adam Fowler and Steven Van Impe, this extension enables Swift development in VSCode as well as related tools like GitHub Codespaces with very little setup.

Next, new Swift GitHub Actions have been created by the community to make building and testing Swift code with GitHub Actions easy. These are being migrated to a [new GitHub organization](https://github.com/swift-actions) led by the community for collaboration. This is an ongoing project and the SSWG is looking forward to seeing how the community adopts it.

Finally, the increase of ARM-based machines for both development and deployment has provided new opportunities for those wanting to use different architectures. Swift 5.6 provides toolchains for ARM Linux as well as multi-platform Docker images with ARM support. We've started to add information to the guides for cross-compilation of applications and will continue to refine them as more people start building Swift applications for ARM. This allows a great experience for working with Swift in Docker and makes deploying to ARM servers (like AWS Graviton) possible.

### Documentation

The SSWG have added a large amount of documentation across SSWG projects, incubated projects, and the server guides. These are a valuable source of information providing technical deep dives and explanations for everything from deploying Swift applications to analyzing performance. However, there is a significant issue with discoverability and this will be a focus for 2022.

### Ecosystem

Due to the pandemic and the late publishing of last year's update, only one extra library was added to the SSWG incubation, [MultiPartKit](https://github.com/vapor/multipart-kit). This was accepted at the Incubating level.

In accordance with the SSWG's [Graduation Criteria](https://github.com/swift-server/sswg/blob/main/process/incubation.md#graduation-criteria), the maturity levels are reviewed at a regular cadence. The SSWG is happy to announce that in the last review a number of packages have been voted into a higher maturity level:

* [SwiftMetrics](http://github.com/apple/swift-metrics/) (from incubating to graduated)
* [SwiftStatsdClient](https://github.com/apple/swift-statsd-client), (from sandbox to incubating)
* [SwiftPrometheus](https://github.com/MrLotU/SwiftPrometheus), (from sandbox to incubating)
* [gRPC Swift](https://github.com/grpc/grpc-swift), (from incubating to graduated)
* [MongoSwift](https://github.com/mongodb/mongo-swift-driver), (from sandbox to incubating)
* [Swift Service Lifecycle](https://github.com/swift-server/swift-service-lifecycle), (from sandbox to incubating)
* [Soto for AWS](https://github.com/soto-project/soto), (from sandbox to incubating)

The current list of incubated packages can be found under the Projects section on the [SSWG web page](/sswg/).

Outside of the incubation process, the ecosystem continues to grow. Amazon Web Services [announced a new Swift SDK](https://aws.amazon.com/blogs/developer/announcing-new-aws-sdk-for-swift-alpha-release/) and it's great to see established players releasing first-party Swift libraries.

The evolution of Swift also provides a number of opportunities to provide unique experiences for writing Swift for the server. One large effort is the ongoing work into [Distributed Actors](/blog/distributed-actors/), which is a new, exciting avenue for Swift that few other mainstream languages currently have.

## Goals for 2022

The SSWG believe 2022 will be an exciting year for Swift on the server as the new concurrency work continues to make Swift a stand out language for the server. The top level goals for 2022 include:

* Continued focus on growing the ecosystem
* Continuing the concurrency journey
* Expanding the tooling
* Improving build times
* Increasing Adoption of Server-Side Swift

### Continued focus on growing the ecosystem

While the last couple of years have seen a significant improvement in the range of packages available for the Swift on server ecosystem, growing the ecosystem continues to be a focus for the SSWG. The SSWG is interested in libraries supporting popular server-side components like Kafka, Cassandra and RabbitMQ. If you're interested in writing a driver for these or any other tool or package you think would be useful to the Swift on server ecosystem, you are encouraged to [submit a pitch](https://forums.swift.org/t/about-the-pitches-category/16866).

### Continuing the concurrency journey

Adopting Swift's new concurrency model will continue to be a focus for the SSWG in 2022 as it will be transformative for the ecosystem. The initial focus will be on getting logging and tracing over the line and using the new concurrency features and then encouraging the adoption of these updates in packages and libraries.

If you build and maintain libraries for the server, you are encouraged to adopt Swift's new concurrency model and provide `async`/`await` APIs for your users.

### Expanding the tooling

Tooling has evolved significantly over the last 12 months and will continue to be a key aim with more push for improvements. With increased focus on using alternative IDEs, projects like SourceKitLSP should see more use and adoption and therefore more improvements and bug fixes. Some old bugs have already been fixed recently thanks to the focus from the Swift for Visual Studio Code extension. The community is encouraged to build plugins for more IDEs as this will only be good for server-side Swift.

Swift 5.6 also introduces Swift Package Plugins, which will open another avenue of tooling possibilities, including automatically generating documentation using DocC, running linters and code formatters, or even running other build tools for generating CSS and JS applications. It also enables code generation which will be useful to gRPC, Smoke, and the AWS SDKs. The SSWG will be keeping an eye on this to see where effort can be directed to make the biggest impact.

Next, another aim is to continue to improve the experience for installing Swift. As previously mentioned, you can already install Swift using RPM and .deb packages. However, some people want to easily manage multiple versions of Swift and easily install a particular version. Other languages have tools for this, such as rustup for Rust. The SSWG has started to build a Swift toolchain installer, provisionally called Swiftly, to achieve similar functionality and there will be more updates on this in the near future.

Finally, the SSWG will be looking at encouraging Swift adoption in some popular generic tools such as Dependabot and Sentry. Swift on the server has reached a good level of maturity and it would be great to see these tools add support for Swift.

### Improving build times

As frameworks and applications get more complex and language features are added, build times can suffer. This is less of an issue when building locally for development as you can take advantage of incremental builds but building applications for deployment usually requires a fresh build. Some applications are hitting limits with services like Heroku.

Improving build times will take efforts on a number of fronts. The Swift compiler continues to make improvements and library developers should ensure their code is as efficient as possible with the ecosystem ensuring it provides the necessary pieces to avoid duplication.

One area of focus is the use of [SwiftCrypto](https://github.com/apple/swift-crypto). Currently, SwiftCrypto has a limited set of cryptography operations it supports. This means any library that needs something out of scope needs to either add a dependency on OpenSSL or vend their own copy of another library like BoringSSL.

SwiftCrypto now includes a CryptoExtras module to provide additional APIs for common server requirements, such as RSA. This allows libraries like Vapor's JWTKit to solely depend on SwiftCrypto and not vend their own BoringSSL library, reducing the amount of code that needs to be compiled.

Other areas the SSWG can support are caching in SwiftPM and ensure tools like the recently announced GitHub Action support this.

### Increasing Adoption of Server-Side Swift

Finally, a big focus for the SSWG this year will be on improving how Swift is showcased on the server. It is being used extensively but not as much is done as can be to showcase this and to make it easy for people to adopt.

The first aim is to improve the discoverability of Swift on the server. There are a lot of [good guides and documentation](https://github.com/swift-server/guides) available but they aren’t coherently collated. Encouraging the adoption of DocC and linking to the SSWG guides from different documentation should make this easier to discover, both for users and search engines. If there are features missing that would be helpful, the SSWG can help direct effort to plug these gaps.

The SSWG is also going to be launching an in-depth survey on Swift on the server to find out more about the people who use it and the people who don't. The working group members all use Swift to write server applications day-to-day but there may be gaps and missing tools that the group don't know about. The survey should help provide some data to work out where to direct effort. Keep an eye out for this survey announcement.

Last but not least, the SSWG want to improve the messaging for using Swift on the server. This encompasses showcasing it in production applications, highlighting success stories, and providing concrete examples of why it should be used. Examples include how `async`/`await` makes writing code much easier, how Swift helps reduce run-time bugs, and showing concrete performance benefits compared to other languages. If you would like to share your story with our community, please reach out to either the working group in the forums or send a [draft pitch to `@swift-website-workgroup`](https://forums.swift.org/new-message?groupname=swift-website-workgroup). There'll be more to announce on this front in the coming months.
