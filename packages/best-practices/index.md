---
layout: page-wide
title: Package Best Practices
---

Swift Packages should follow a similar set of best practices across the ecosystem. This helps package users know what to expect when using packages and provides package authors some guidelines to follow when creating packages.

## Version Support

Swift Packages should support the latest version of Swift and the previous tro minor versions. For example, if the latest version Swift is 6.1, packages should also support Swift 6.0 and Swift 5.10. This provides a balance between keeping up with the latest language features and maintaining compatibility with older versions.

New packages that are released can target only the latest version of Swift at the time of release if they choose to do so to make use of the latest language features and improvements.

## SemVer Versioning

Swift Package Manager relies on [Semantic Versioning](https://semver.org/) to manage package versions. Packages should follow the SemVer guidelines, to ensure that dependency resolution works as expected and provides a good experience for consumers of packages.

This includes:

- Using [major, minor, and patch versioning](https://semver.org/#spec-item-2) to indicate breaking changes, new features, and bug fixes.
- Using [pre-release versions](https://semver.org/#spec-item-9) for offering early access to new features or changes that are not yet stable.
- Ensuring only breaking changes are introduced in major versions.
- Only releasing major versions when necessary, to avoid unnecessary churn in the ecosystem and provide a stable experience for package users.

## CI and Testing

Packages should include continuous integration (CI) and testing to ensure that the package works as expected across different versions of Swift and platforms. This helps catch issues early and provides confidence to package users that the package is reliable.

Swiftlang offers a number of [GitHub Actions](https://github.com/swiftlang/github-workflows) that can be used to set up CI for different Swift versions and platforms. There are also workflows for ensuring packages follow community standards and don't introduce breaking changes.