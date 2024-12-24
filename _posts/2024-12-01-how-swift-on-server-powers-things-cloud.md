---
layout: post
published: true
date: 2024-12-01 10:00:00
title: How Swift on Server powers Things Cloud
author: [vrylko, wjainek]
---

At Cultured Code, we’ve recently completed a major transition: our Things Cloud service now runs entirely on Swift. After a year in production, Swift on Server has proven to be reliable, performant, and remarkably well-suited to our needs.

*Note: This article is an adaptation of [our recent talk](https://youtu.be/oJArLZIQF8w?si=hLr6g5MmYH3-5K1c) at the Server-Side Swift Conference.*

<img
  alt="Things logo"
  src="/assets/images/how-swift-on-server-powers-things-cloud-blog/things-logo.png"
  width="160" height="160"
  style="max-width: 80%; width: 160px; height: auto; margin: 0 auto; display: block;"
/>

[Things](https://culturedcode.com/things/) is our delightful personal task manager, available on all Apple platforms, with two Apple Design Awards to its name. At Cultured Code, we deeply care about a great user experience in every part of the product.

This commitment extends to our backend. [Things Cloud](https://culturedcode.com/things/cloud/) silently synchronizes to-dos across devices, serving as the backbone of the app’s seamless experience. The system’s correctness is ensured by a rigorous theoretical foundation, which is inspired by operational transformations and Git’s internals. After twelve years in production, Things Cloud has proven to be reliable and robust, and has earned our users’ trust. Yet, even as the conceptual foundations held strong, the technology stack fell behind.

<div style="margin: 2em auto;">
  <img
    alt="Things Cloud synchronizes to-dos across different devices."
    src="/assets/images/how-swift-on-server-powers-things-cloud-blog/things-cloud-with-devices.png"
    width="840" height="473"
    style="max-width: 100%; width: 100%; height: auto; margin: 0 auto; display: block;"
  />
  <div style="text-align: center; font-style: italic; margin-top: 1em;">Things Cloud synchronizes to-dos across different devices.</div>
</div>


## Why we switched to Swift

Our legacy Things Cloud was built on Python 2 and Google App Engine. While stable, the backend suffered from a growing list of limitations. Slow response times impacted the user experience, high memory usage drove up infrastructure costs, and Python’s lack of static typing made every change risky. For our push notification system to be fast, we even had to develop a custom C-based service. As these issues accumulated and several deprecations loomed, we decided to take action.

Rewrites are usually a last resort, but in our case it was the only path forward. We explored a range of options like Java, Python 3, Go, and even C++. But Swift, already integral for our client apps, had great potential and a unique set of benefits: it promised excellent performance, predictable memory management through ARC, an expressive type system for reliability and maintainability, and seamless interoperability with C and C++.

While we had concerns that Swift on Server wasn’t as mature as other ecosystems, both Apple and the open-source community had shown strong commitment to its evolution. Swift had reliably compiled on Linux for a long time, the Swift Server Workgroup had coordinated the server efforts since 2016, the SwiftNIO library gave us confidence in the foundational capabilities, and Vapor provided all the tools to get us up and running quickly.

Convinced by these benefits, and the prospect that it could work out well, we embarked on the rewrite. It took us three years to completely rebuild Things Cloud. We’ve been using it internally for the past two years, and it has now been live in production for almost a year.


## What the new backend looks like

We’ll outline the core components of our new backend, highlighting the Swift packages we use. We’ve found that these components work well together, resulting in a reliable and stable system. We hope this serves as a valuable reference point for anyone considering a similar transition to Swift.

<div style="margin: 2em auto;">
  <img
    alt="Overview of our new Swift-based backend."
    src="/assets/images/how-swift-on-server-powers-things-cloud-blog/new-backend-overview.png"
    width="840" height="525"
    style="max-width: 100%; width: 100%; height: auto; margin: auto; display: block;"
  />
  <div style="text-align: center; font-style: italic; margin-top: 1em;">Overview of our new Swift-based backend.</div>
</div>

Code
- Our **Swift 5.10** codebase has around 30k lines of code. It produces a binary of 60 MB, and builds in ten minutes.
- It uses **Vapor** as an HTTP web framework, which uses **SwiftNIO** as its underlying network application framework.
- We compile a single “monolith” binary from our Swift source code, but use it to run multiple services, each configured by passing different parameters at runtime.
- We use **Xcode** for its robust suite of tools for development, debugging, and testing. It provides us with a familiar and consistent experience across both server and client environments.

Deployment
- **AWS** hosts our entire platform, and is entirely managed by **Terraform**, an infrastructure as code tool.
- We use a continuous integration pipeline to automate tests and build our Swift code into a **Docker** image. This is then deployed in a **Kubernetes** cluster alongside other components.
- The **HAProxy** load balancer is used to route client traffic to the appropriate Swift service in the cluster.

Storage
- Persistent data is stored in **Amazon Aurora MySQL**, a relational database, which we connect to with **MySQLKit**.
- To keep the database small, we’re offloading less-used data to **S3**, which we access via the **Soto** package.
- More ephemeral data, such as push notifications and caches, is stored in **Redis**, an in-memory key-value database, which we access via **RediStack**.

Other Services
- The **APNSwift** package is used to communicate with the Apple Push Notification service.
- **AWS Lambda**, a serverless compute service, powers our **Mail to Things** feature. This process is written in Python 3 due to its mature libraries for the processing of incoming emails. The results are passed to Swift using **Amazon Simple Queue Service**.

Monitoring
- We take the resilience of Things Cloud seriously and go to great lengths to ensure it.
- In Swift, we generate JSON logs using our own logger. To produce metrics, we’re using the **Swift Prometheus**.
- We use **Amazon CloudWatch** to store and analyze logs and metrics. It triggers Incidents, which reach the responsible engineer via **PagerDuty**.
- To test how well our backend can recover from transient errors, we employ **chaos testing**. Each day, our self-written chaos agent performs random disruptive actions such as terminating a Swift service or restarting the database. We then verify that the system recovers as expected.


## How the new backend performs

We aimed to confirm the performance and stability of the new backend well before it reached users. So during development, we deployed the new system alongside the legacy one. While the legacy system continued to handle all requests, they were also copied over to the new system, allowing it to fully process them with its own logic and database.

This approach allowed us to develop the new system under real-world conditions without risking the user experience. Gradually gaining confidence in its robustness and reliability, we were able to deploy a hardened system from day one.

Today, after a full year in production, Swift on Server has delivered on its promise. It’s fast and memory-efficient. Our Kubernetes cluster consists of four instances (each with two virtual CPUs and 8 GB of memory), and handles traffic peaking at around 500 requests per second. Compared to the legacy system, this setup has led to a more than threefold reduction in compute costs, while response times have shortened dramatically.

<div style="margin: 2em auto;">
  <img
    alt="Comparison between our legacy backend and new Swift-based one."
    src="/assets/images/how-swift-on-server-powers-things-cloud-blog/performance-comparison.png"
    width="540" height="270"
    style="max-width: 100%; width: 540px; height: auto; margin: auto; display: block;"
  />
  <div style="text-align: center; font-style: italic; margin-top: 1em;">Comparison between our legacy backend and new Swift-based one.</div>
</div>

Swift’s performance also allowed us to replace our legacy C-based push notification service with one implemented in Swift, significantly simplifying our code base and operations.


## Where we’ll go

Swift on Server turned out to be a great choice for us. It delivered on everything we had hoped for: We’re now using a modern and expressive programming language, the code runs and performs well, and the Swift ecosystem provides all the integrations we need. With a year of production use, we haven’t encountered a single operational issue.

We encourage other teams to evaluate Swift on Server for their projects. We opted for a full rewrite, but the gradual adoption of Swift is also an interesting option, even more so with the recently announced effort around Java interoperability.

As for us, we consider our backend to be in the best shape it’s ever been and we’re excited about the new features we can build on this solid foundation.
