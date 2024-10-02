---
layout: new-layouts/blog
published: true
date: 2024-04-03 10:00:00
title: "Get Started with Embedded Swift on ARM and RISC-V Microcontrollers"
author: [kubamracek]
---

We're pleased to introduce a [repository of example projects](https://github.com/apple/swift-embedded-examples) that demonstrate how Embedded Swift can be used to develop software on a range of microcontrollers.

Swift is a scalable language, great for writing desktop and mobile apps, server backends, and system software. And as you [may have seen](https://www.swift.org/blog/byte-sized-swift-tiny-games-playdate/), thanks to a new, experimental compilation mode, you can use Swift to target embedded environments like ARM and RISC-V microcontrollers as well, popular for building professional and hobbyist electronics projects such as IoT devices.

Microcontrollers are constrained environments where not all of Swift’s features are appropriate. The new Embedded Swift compilation mode turns off certain language features like runtime reflection, ABI stability, and existentials, to produce standalone binaries suitable for firmware. Despite turning off some language features, the Embedded Swift subset still feels very close to the “full” Swift that developers love, and makes it easy to continue writing idiomatic, easy-to-read Swift code. You can dive into the details in the formally accepted [Embedded Swift Vision Document](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md), and try it out in the [nightly downloadable toolchains](https://www.swift.org/download/#snapshots).

The Swift community has already started publishing [several](https://forums.swift.org/t/embedded-swift-on-the-raspberry-pi-pico-rp2040-without-the-pico-sdk/69338) [fascinating](https://forums.swift.org/t/rp2040mmio-a-hardware-access-layer-for-the-rp2040/69513/1) [projects](https://forums.swift.org/t/byte-sized-swift-building-tiny-games-for-the-playdate/70615) built with this language mode, and we thought it would be useful to publish a collection of sample projects at [**swift-embedded-examples**](https://github.com/apple/swift-embedded-examples).

<div align="center" style="padding: 0 0 20px 0;"><i>
<img src="/assets/images/embedded-examples/boards.jpg" alt="Swift on STM32F746, Raspberry Pi Pico, nRF52840, and ESP32C6">
<br />
Swift on STM32F746, Raspberry Pi Pico, nRF52840, and ESP32C6
</i></div>

This repository is meant to be a showcase of the wide applicability of Embedded Swift. The examples are targeting different microcontrollers where Swift can be easily used, including STM32 boards, the Raspberry Pi Pico, Nordic Semiconductor boards, and even RISC-V ESP32 boards. The examples also cover different build systems and integration options, such as building fully standalone Swift code and bridging existing SDKs from board vendors to Swift.

We encourage anyone interested to try out the examples and help us grow the repository. We are looking for community contributions to cover more microcontroller boards, different build systems, and usage of simple peripherals.

## Try It Out

If you'd like to try out the existing example projects, visit the repository at [**swift-embedded-examples**](https://github.com/apple/swift-embedded-examples). It contains a catalog of examples along with instructions on how to build and run each of them.

To use these examples, be sure to install the latest [development snapshot toolchain](https://www.swift.org/download/#snapshots). As an experimental mode, Embedded Swift is not yet available in release versions of Swift.

If you have any questions or want to share your experiences and ideas, please reach out on the [Swift Forums](https://forums.swift.org/t/embedded-swift-example-projects-for-arm-and-risc-v-microcontrollers/71066). Your feedback will help bring Embedded Swift into a future release.
