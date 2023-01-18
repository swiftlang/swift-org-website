---
layout: page
title: Swift Server Workgroup (SSWG)
---

The Swift Server workgroup is a steering team that promotes the use of Swift for developing and deploying server applications. The Swift Server workgroup will:

* Define and prioritize efforts that address the needs of the Swift server community
* Define and run an incubation process for these efforts to reduce duplication of effort, increase compatibility and promote best practices
* Channel feedback for Swift language features needed by the server development community to the Swift Core Team

Analogous to the [Core Team](/community#core-team) for Swift, the workgroup is responsible for providing overall technical direction and establishing the standards by which libraries and tools are proposed, developed and eventually recommended. Membership of the workgroup is contribution-based and is expected to evolve over time.

The current Swift Server workgroup consists of the following people:

* Adam Fowler ([@adam-fowler](https://github.com/adam-fowler))
* Dave Moser ([@dave-moser](https://github.com/dave-moser), Amazon)
* Franz Busch ([@FranzBusch](https://github.com/FranzBusch), Apple)
* Gwynne Raskind ([@gwynne](https://github.com/gwynne), Vapor)
* Jimmy McDermott ([@jdmcd](https://github.com/jdmcd) , Transeo)
* Kaitlin Mahar ([@kmahar](https://github.com/kmahar), MongoDB)
* Konrad Malawski ([@ktoso](https://github.com/ktoso), Apple)
* Patrick Freed ([@patrickfreed](https://github.com/patrickfreed), MongoDB)
* Simon Pilkington ([@tachyonics](https://github.com/tachyonics), Amazon)
* Tim Condon ([@0xTim](https://github.com/0xTim), Vapor)

With Tom Doron ([@tomerd](https://github.com/tomerd), Apple) representing the Swift core team.

## Communication

The Swift Server workgroup uses the [Swift Server forum](https://forums.swift.org/c/server) for general discussion.

## Community Participation

Everyone is welcome to contribute in the following ways:

* Proposing new libraries and tools to be considered
* Participating in design discussions
* Asking or answering questions on the forums
* Reporting or triaging bugs
* Submitting pull requests to the library projects for implementation or tests

These conversations will take place on the [Swift Server forum](https://forums.swift.org/c/server). Over time, the workgroup may form smaller working groups to focus on specific technology areas.

## Charter

The main goal of the Swift Server workgroup is to eventually recommend libraries and tools for server application development with Swift. The difference between this workgroup and the Swift Evolution process is that server-oriented libraries and tools that are produced as a result of workgroup efforts will exist outside of the Swift language project itself. The workgroup will work to nurture, mature and recommend projects as they move into their development and release stages.

## Voting

In various situations the SSWG shall hold a vote. These votes can happen on the phone, email, or via a voting service, when appropriate. SSWG members can either respond "agree, yes, +1", "disagree, no, -1", or "abstain". A vote passes with two-thirds vote of votes cast based on the SSWG charter. An abstain vote equals not voting at all.

## Incubation Process

The Swift Server Workgroup has a [process](https://github.com/swift-server/sswg/blob/master/process/incubation.md) which allows a project to go through incubation stages until it graduates and becomes a recommended project.

## Projects

| Project | Description | Maturity Level | Pitched | Accepted |
|---|---|---|---|---|
| [SwiftNIO](http://github.com/apple/swift-nio/) | Event-driven network application framework. | Graduated  | N/A  | 9/7/2018 |
| [SwiftLog](http://github.com/apple/swift-log/) | Logging API | Graduated | 9/10/2018 | 2/7/2019 |
| [SwiftMetrics](http://github.com/apple/swift-metrics/) | Metrics API | Graduated | 1/8/2019 | 4/4/2019 |
| [PostgresNIO](https://github.com/vapor/nio-postgres) | PostgreSQL driver | Incubating | 11/18/2018 | 5/16/2019 |
| [RediStack](https://github.com/mordil/swift-redis-nio-client) | Redis driver | Sandbox | 1/7/2019 | 6/27/2019 |
| [AsyncHTTPClient](https://github.com/swift-server/async-http-client) | HTTP client | Graduated | 4/18/2019 | 6/27/2019 |
| [APNSwift](https://github.com/swift-server-community/APNSwift) | APNS client | Incubating | 2/5/2019 | 6/27/2019 |
| [SwiftStatsdClient](https://github.com/apple/swift-statsd-client) | StatsD driver for the metrics API | Incubating | 6/2/2019 | 8/11/2019 |
| [SwiftPrometheus](https://github.com/MrLotU/SwiftPrometheus) | Prometheus driver for the metrics API | Sandbox | 11/18/2018 | 8/11/2019  |
| [gRPC Swift](https://github.com/grpc/grpc-swift) | gRPC client & server framework | Graduated | 9/30/2019 | 2/19/2020 |
| [Swift Crypto](https://github.com/apple/swift-crypto) | Open-source implementation of a substantial portion of the API of Apple CryptoKit | Incubating | 2/20/2020 | 3/4/2020 |
| [OpenAPIKit](https://github.com/mattpolzin/OpenAPIKit) | OpenAPI client | Sandbox | 1/14/2020 | 4/29/2020 |
| [MongoSwift](https://github.com/mongodb/mongo-swift-driver) | MongoDB driver | Incubating | 10/30/2019 | 5/13/2020 |
| [Swift AWS Lambda Runtime](https://github.com/swift-server/swift-aws-lambda-runtime) | Runtime library for AWS Lambda functions in Swift | Sandbox | N/A | 6/24/2020 |
| [Backtrace](https://github.com/swift-server/swift-backtrace) | Nice backtraces in production | Incubating | 5/30/19 | 7/29/2020 |
| [Service Lifecycle](https://github.com/swift-server/swift-service-lifecycle) | Lifecycle management | Incubating | N/A | 9/2/2020 |
| [Soto for AWS](https://github.com/soto-project/soto) | Third-party SDK for AWS | Incubating | 10/1/2020 | 11/12/2020 |
| [MultipartKit](https://github.com/vapor/multipart-kit) | Multipart parser and serializer with Codable support for Multipart Form Data | Incubating | 3/3/2021 | 11/11/2021 |
| [MQTT NIO](https://github.com/swift-server-community/mqtt-nio) | A Swift NIO MQTT v3.1.1 and v5.0 Client | Sandbox | 11/2/2021 | 1/19/2022 |
| [GraphQL](https://github.com/GraphQLSwift/GraphQL) | GraphQL query language implementation | Incubating | 8/22/2022 | 9/15/2022 |
| [Graphiti](https://github.com/GraphQLSwift/Graphiti) | Library for building GraphQL schemas | Incubating | 8/22/2022 | 9/15/2022 |
| [Swift Distributed Actors](https://github.com/apple/swift-distributed-actors) | Peer-to-peer cluster implementation for Swift Distributed Actors | Sandbox | 10/27/2022 | 1/3/2023 |

The SSWG publishes a [package collection](/blog/package-collections/) that contains the projects incubated by the workgroup. The collection is available at `https://swiftserver.group/collection/sswg.json`.

## Meeting Time

The SSWG meets biweekly on Wednesday at 2:00PM PT (USA Pacific). The meetings take place in the weeks with the [odd week numbers](http://www.whatweekisit.org).
