---
layout: new-layouts/blog
published: true
date: 2017-04-24 13:01:01
title: Swift Source Compatibility Test Suite Now Available
author: lplarson
---

We are pleased to announce the release of a new [Swift source compatibility test
suite](https://github.com/swiftlang/swift-source-compat-suite) as part of the effort
to maintain source compatibility in future Swift releases.

The source compatibility test suite is community driven, meaning open source
project owners can submit their projects for inclusion in the suite.
Instructions for adding open source projects to the test suite can be found in
the [Swift Source Compatibility](/documentation/source-compatibility) section on Swift.org.

[Swift's continuous integration system](https://ci.swift.org) periodically
builds projects included in the suite against development versions of Swift to
catch source compatibility regressions as soon as possible.

Swift compiler developers can now use Swift's pull request testing system
to test their changes against the source compatibility test suite, helping
catch source compatibility regressions before they are merged.

The goal is to have a strong source compatibility test suite containing
thousands of projects. We look forward to project owners helping to achieve
this goal by including their open source Swift projects in the test suite.
