---
layout: new-layouts/post
published: true
date: 2025-12-11 10:00:00
title: "Swift Configuration 1.0 released"
author: [honzadvorsky]
category: "Developer Tools"
---

Every application has configuration: in environment variables, configuration files, values from remote services, command-line flags, or repositories for stored secrets like API keys. But until now, Swift developers have had to wire up each source individually, with scattered parsing logic and application code that is tightly coupled to specific configuration providers. 

[**Swift Configuration**](https://github.com/apple/swift-configuration) brings a unified, type-safe approach to this problem for Swift applications and libraries. What makes this compelling isn’t just that it reads configuration files: plenty of libraries do that. It’s the clean abstraction that it introduces between _how_ your code accesses configuration and _where_ that configuration comes from. This separation unlocks something powerful: libraries can now accept configuration without dictating the source, making them genuinely composable across different deployment environments.

With the release of Swift Configuration 1.0, the library is production-ready to serve as the common API for reading configuration across the Swift ecosystem. Since the [initial release announcement](https://forums.swift.org/t/introducing-swift-configuration/82368) in October 2025 over **40 pull requests** have been merged, and its API stability provides a foundation to unlock community integrations..

## Why it exists

Configuration management has long been a challenge across different sources and environments. Previously, configuration in Swift had to be manually stitched together from environment variables, command-line arguments, JSON files, and external systems. Swift Configuration creates a common interface for configuration, enabling you to:
- **Read configuration the same way across your codebase** using a single configuration reader API that's usable from both applications and libraries.
- **Quickly get started with a few lines of code** using simple built-in providers for environment variables, command-line arguments, JSON and YAML files. Later, when your configuration needs require a more sophisticated provider, swap it in easily, without refactoring your existing code.
- **Build and share custom configuration providers** using a public ConfigProvider protocol that anyone can implement and share. This allows domain experts to build and own integrations with external systems like secret stores and feature flagging services.

Swift Configuration excels in the Swift server ecosystem, where configuration is often read from multiple systems and tools. The library is equally useful in command-line tools, GUI applications, and libraries wherever flexible configuration management is needed.

For a step-by-step tour of an example service, from hardcoded values all the way to a flexible provider hierarchy, check out the [video of my talk](https://www.youtube.com/watch?v=I3lYW6OEyIs) from the [ServerSide.swift conference](https://www.serversideswift.info/) in London.

## Getting started

After adding a package dependency to your project, reading configuration values requires a couple of lines of code. For example:

```swift
import Configuration

let config = ConfigReader(provider: EnvironmentVariablesProvider())
let timeout = config.bool(forKey: "logging.verbose", default: false)
```

However, Swift Configuration's core strength is its ability to combine _multiple_ configuration providers into a clear, predictable hierarchy, allowing you to establish sensible defaults while providing clean override mechanisms for different deployment scenarios.

For example, if you have default configuration in JSON:

```json
{
  "http": {
    "timeout": 30
  }
}
```

And want to be able to provide an override using an environment variable:

```bash
# Environment variables:
HTTP_TIMEOUT=15
```

Sharing configuration as JSON or an environment are examples of Swift Configuration "providers". In this example, we've layered these two providers:

```swift
let config = ConfigReader(providers: [
    EnvironmentVariablesProvider(),
    try await FileProvider<JSONSnapshot>(filePath: "/etc/config.json")
])
let httpTimeout = config.int(forKey: "http.timeout", default: 60)
print(httpTimeout) // 15
```

Providers are checked in the order you specify: earlier providers override later ones, followed by your fallback defaults. This removes ambiguity about which configuration source is actually being used.

## Advanced capabilities

Beyond basic lookups, the library includes features for production environments:

* [Multiple access patterns](https://swiftpackageindex.com/apple/swift-configuration/documentation/configuration#Three-access-patterns) – choose between the synchronous, asynchronous, and watching patterns.
* [Hot reloading](https://swiftpackageindex.com/apple/swift-configuration/documentation/configuration#Hot-reloading) – apply configuration updates without restarting your service.
* [Namespacing and scoped readers](https://swiftpackageindex.com/apple/swift-configuration/documentation/configuration#Namespacing-and-scoped-readers) – organize configuration values through nesting.
* [Access logging](https://swiftpackageindex.com/apple/swift-configuration/documentation/configuration#Debugging-and-troubleshooting) – easily debug configuration issues through detailed observability.
* [Secret redaction](https://swiftpackageindex.com/apple/swift-configuration/documentation/configuration/handling-secrets-correctly) – avoid accidental exposure of sensitive configuration values.

The [documentation](https://swiftpackageindex.com/apple/swift-configuration/documentation) covers these features in detail.

## Community adoption

With 1.0, the API is now stable. Projects can depend on Swift Configuration knowing only backward-compatible changes are expected going forward. API stability allows libraries and tools to rely on Swift Configuration as a common integration point for reading configuration.

Prior to the 1.0 release, a number of ecosystem projects have begun experimenting with and adopting Swift Configuration. Here are some examples of efforts in progress:

* [**In libraries**](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configuring-libraries): Expose configuration entry points built on [`ConfigReader`](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configreader), making your library easier to integrate. Projects experimenting with Swift Configuration include:
    * [Vapor](https://github.com/vapor/vapor/pull/3403)
    * [Hummingbird](https://github.com/hummingbird-project/hummingbird/pull/743)
    * [Swift Temporal SDK](https://github.com/apple/swift-temporal-sdk)
* [**In applications**](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configuring-applications): Instantiate a [`ConfigReader`](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configreader) and pass it to your dependencies. Use any combination of [`ConfigProvider`](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configprovider) types - JSON/YAML files, environment variables, or remote systems.
    * [Peekaboo](https://github.com/steipete/Peekaboo)
    * [swiftodon](https://github.com/JonPulfer/swiftodon)
* [**By implementing custom providers**](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configprovider): Extend the ecosystem with new formats or external sources by implementing a [`ConfigProvider`](https://swiftpackageindex.com/apple/swift-configuration/main/documentation/configuration/configprovider). Examples of experimental providers:
    * [Swift Configuration TOML](https://github.com/finnvoor/swift-configuration-toml)
    * [Vault Courier](https://github.com/vault-courier/vault-courier)
    * [Swift Configuration AWS](https://github.com/SongShift/swift-configuration-aws)

Contributions and new integrations are welcome.

## Next steps

With a stable foundation in place, libraries and applications can begin finalizing their own integrations and releasing API-stable versions built on Swift Configuration.

We encourage you to continue sharing real-world experience across different deployment models and configuration patterns. Your feedback will continue to help guide future refinements of Swift Configuration.

Try integrating Swift Configuration into your applications, tools, and libraries, check out the project's [documentation](https://swiftpackageindex.com/apple/swift-configuration/documentation), and share your feedback on the [GitHub repository](https://github.com/apple/swift-configuration) through issues, pull requests, or Swift Forums discussions.

Happy configuring! ⚙️
