---
layout: post
published: true
date: 2025-02-21 10:00:00
title: How Swift's server support powers Things Cloud
author: [vrylko, wjainek]
---

You might be familiar with [Things](https://culturedcode.com/things/), a delightful personal task manager that has won two Apple Design Awards and is available across Apple devices including iPhone, iPad, Mac, Apple Watch, and Apple Vision Pro. At Cultured Code, the team behind Things, we care about a great user experience across every aspect of the product. This extends to our server back end, and after a rewrite our Things Cloud service has transitioned entirely to Swift. Over the past year in production, Swift has consistently proven to be reliable, performant, and remarkably well-suited for our server-side need.

<img
  alt="Things logo"
  src="/assets/images/how-swifts-server-support-powers-things-cloud/things-logo.png"
  width="160" height="160"
  style="max-width: 80%; width: 160px; height: auto; margin: 0 auto; display: block;"
/>

[Things Cloud](https://culturedcode.com/things/cloud/) serves as the backbone of the app’s experience, silently synchronizing to-dos across devices. The robustness of this work is ensured by a rigorous theoretical foundation, inspired by operational transformations and Git’s internals. After twelve years in production, Things Cloud has earned our users’ trust in its reliability. But despite the enduring strength of the architecture itself, the technology stack lagged behind.

<div style="margin: 2em auto;">
  <img
    alt="Things Cloud synchronizes to-dos across different devices."
    src="/assets/images/how-swifts-server-support-powers-things-cloud/things-cloud-with-devices.png"
    width="840" height="473"
    style="max-width: 100%; width: 100%; height: auto; margin: 0 auto; display: block;"
  />
  <div style="text-align: center; font-size: smaller; margin-top: 1em;">Things Cloud synchronizes to-dos across different devices.</div>
</div>

## Switching to Swift

Our legacy Things Cloud service was built on Python 2 and Google App Engine. While it was stable, it suffered from a growing list of limitations. In particular, slow response times impacted the user experience, high memory usage drove up infrastructure costs, and Python’s lack of static typing made every change risky. For our push notification system to be fast, we even had to develop a custom C-based service. As these issues accumulated and several deprecations loomed, we realized we needed a change.

A full rewrite is usually a last resort, but in our case, it was the only viable path for Things Cloud. We explored various programming languages including Java, Python 3, Go, and even C++. However, Swift – which was already a core part of our client apps – stood out for its potential and unique benefits. Swift promised excellent performance, predictable memory management through [ARC](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/), an expressive type system for reliability and maintainability, and seamless interoperability with C and C++.

While we initially had concerns that Swift's server support wasn’t as mature as that found in other ecosystems, both Apple and the open-source community had shown strong commitment to its evolution. Swift had reliably compiled on Linux for a long time; the Swift Server workgroup had coordinated server efforts since 2016; the [SwiftNIO library](https://github.com/apple/swift-nio) gave us confidence in the foundational capabilities, and [Vapor](https://vapor.codes) provided all the tools to get us up and running quickly.

Convinced by these benefits and the opportunity to use the same language for client and server development, we embarked on a three-year journey to rewrite Things Cloud. We’ve been using it internally for the past two years, and it has now been live in production for over a year.

## The new Swift-based service architecture

We’ll outline the core components of our new service architecture, highlighting the Swift packages we use. We’ve found that these components work well together to provide reliability and stability, and we believe this serves as a valuable reference point for others considering a similar transition to Swift.

<div style="margin: 2em auto;">
  <img
    alt="Overview of our new Swift-based service architecture."
    src="/assets/images/how-swifts-server-support-powers-things-cloud/new-backend-overview.png"
    width="840" height="525"
    style="max-width: 100%; width: 100%; height: auto; margin: auto; display: block;"
  />
  <div style="text-align: center; font-size: smaller; margin-top: 1em;">Overview of our new Swift-based service architecture.</div>
</div>

### Code

- Our **Swift** server codebase has around 30,000 lines of code. It produces a binary of 60 MB, and builds in ten minutes.
- It uses **Vapor** as an HTTP web framework, which uses **SwiftNIO** as its underlying network application framework.
- We compile a single “monolith” binary from our Swift source code, but use it to run multiple services, each configured by passing different parameters at runtime.
- We use **Xcode** for its robust suite of tools for development, debugging, and testing. It provides us with a familiar and consistent experience across both server and client environments.

### Deployment

- **AWS** hosts our entire platform, and is entirely managed by **Terraform**, an infrastructure as code tool.
- We use a continuous integration pipeline to automate tests and build our Swift code into a **Docker** image. This is then deployed in a **Kubernetes** cluster alongside other components.
- The **HAProxy** load balancer is used to route client traffic to the appropriate Swift service in the cluster.

### Storage

- Persistent data is stored in **Amazon Aurora MySQL**, a relational database, which we connect to with **MySQLKit**.
- To keep the database small, we’re offloading less-used data to **S3**, which we access via the **Soto** package.
- More ephemeral data, such as push notifications and caches, is stored in **Redis**, an in-memory key-value database, which we access via **RediStack**.

### Other Services

- The **APNSwift** package is used to communicate with the Apple Push Notification service.
- **AWS Lambda**, a serverless compute service, powers our **Mail to Things** feature. This process is written in Python 3 due to its mature libraries for the processing of incoming emails. The results are passed to Swift using **Amazon Simple Queue Service**.

### Monitoring

- We take the resilience of Things Cloud seriously and go to great lengths to ensure it.
- In Swift, we generate JSON logs using our own logger. To produce metrics, we’re using the **Swift Prometheus**.
- We use **Amazon CloudWatch** to store and analyze logs and metrics. It triggers Incidents, which reach the responsible engineer via **PagerDuty**.
- To test how well our service can recover from transient errors, we employ **chaos testing**. Each day, our self-written chaos agent performs random disruptive actions such as terminating a Swift service or restarting the database. We then verify that the system recovers as expected.

## Results

We wanted to thoroughly test the performance and stability of the new Swift service architecture before it was deployed in production. So during the development phase, we deployed the new system alongside the existing legacy system. While the legacy system continued to be the operational service for all requests, the new system also processed them independently using its own logic and database.

This approach enabled us to develop and test the new system under real-world conditions without any risk to the user experience. Thanks to the confidence we built in the new system's robustness and reliability through evaluating it with production workloads, we were able to deploy a hardened system from the very beginning.

Now, with over a full year in production, we're pleased to report that Swift has fulfilled its promise for server-side development. It’s fast and memory-efficient. Our Kubernetes cluster comprises four instances, each with two virtual CPUs and 8 GB of memory, and has handled traffic peaks of up to 500 requests per second. Compared to the legacy system, this setup has led to a more than threefold reduction in compute costs, while response times have shortened dramatically.

<div style="margin: 2em auto;">
  <img
    alt="Comparison between our legacy service and new Swift-based one."
    src="/assets/images/how-swifts-server-support-powers-things-cloud/performance-comparison.png"
    width="540" height="270"
    style="max-width: 100%; width: 540px; height: auto; margin: auto; display: block;"
  />
  <div style="text-align: center; font-size: smaller; margin-top: 1em;">Comparison between our legacy service and new Swift-based one.</div>
</div>

And one extra win: Swift’s outstanding performance allowed us to replace our custom C-based push notification service with a Swift-based one; this significantly simplified our codebase and operations.

## Conclusions

Swift turned out to be a great choice for server usage. It delivered on everything we had hoped for: We’re now using a modern and expressive programming language, the code runs and performs well, and the Swift ecosystem provides all the integrations we need. With a year of production use, we haven’t encountered a single operational issue.

For more information on our journey and experiences, you might enjoy [our recent talk](https://youtu.be/oJArLZIQF8w?si=hLr6g5MmYH3-5K1c) at the [ServerSide.Swift](https://www.serversideswift.info) conference.

We encourage other teams to consider using Swift for server-oriented projects. While we chose to undergo a complete rewrite, the gradual adoption of Swift is also an intriguing option, especially considering the recently announced initiative aimed at [enhancing Java interoperability](https://github.com/swiftlang/swift-java).

As for us, we believe our server architecture is in its best shape ever, and we’re thrilled about the new features we can build upon this solid foundation.
