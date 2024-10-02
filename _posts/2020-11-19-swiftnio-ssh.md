---
layout: new-layouts/blog
date: 2020-11-19 9:00:00
title: Introducing SwiftNIO SSH
author: corybenfield
---

I am delighted to introduce a new open source project for the Swift Server ecosystem, [SwiftNIO SSH](https://github.com/apple/swift-nio-ssh). Distributed as a Swift package, SwiftNIO SSH is designed to enable Swift developers to interact with the SSH network protocol.

## What is SwiftNIO SSH?

SwiftNIO SSH is a programmatic implementation of SSH: that is, it is a collection of APIs that allow programmers to implement SSH-speaking endpoints. Critically, this means it is more like libssh2 than openssh. SwiftNIO SSH does not ship production-ready SSH clients and servers, but instead provides the building blocks for building this kind of client and server.

There are a number of reasons to provide a programmatic SSH implementation. One is that SSH has a unique relationship to user interactivity. Technical users are highly accustomed to interacting with SSH interactively, either to run commands on remote machines or to run interactive shells. Having the ability to programmatically respond to these requests enables interesting alternative modes of interaction. As prior art, we can point to Twisted's [Manhole](https://howto.lintel.in/how-to-run-manhole-service-in-twisted/), which uses [a programmatic SSH implementation called `conch`](https://twistedmatrix.com/trac/wiki/TwistedConch) to provide an interactive Python interpreter within a running Python server, or [ssh-chat](https://github.com/shazow/ssh-chat), a SSH server that provides a chat room instead of regular SSH shell functionality. Innovative uses can also be imagined for TCP forwarding.

Another good reason to provide programmatic SSH is that it is not uncommon for services to need to interact with other services in a way that involves running commands. While `Process` solves this for the local use-case, sometimes the commands that need to be invoked are remote. While `Process` could launch an `ssh` client as a sub-process in order to run this invocation, it can be substantially more straightforward to simply invoke SSH directly. This is [`libssh2`](https://www.libssh2.org/)'s target use-case. SwiftNIO SSH provides the equivalent of the networking and cryptographic layer of libssh2, allowing motivated users to drive SSH sessions directly from within Swift services.

## What does SwiftNIO SSH support?

SwiftNIO SSH supports SSHv2 with the following feature set:

* All session channel features, including shell and exec channel requests
* Direct and reverse TCP port forwarding
* Modern cryptographic primitives only: Ed25519 and EDCSA over the major NIST curves (P256, P384, P521) for asymmetric cryptography, AES-GCM for symmetric cryptography, x25519 for key exchange
* Password and public key user authentication
* Supports all platforms supported by SwiftNIO and Swift Crypto

## How do I use SwiftNIO SSH?

SwiftNIO SSH provides a SwiftNIO `ChannelHandler`, `NIOSSHHandler`. This handler implements the bulk of the SSH protocol. Users are not expected to generate SSH messages directly: instead, they interact with the `NIOSSHHandler` through child channels and delegates.

SSH is a multiplexed protocol: each SSH connection is subdivided into multiple bidirectional communication channels called, appropriately enough, channels. SwiftNIO SSH reflects this construction by using a "child channel" abstraction. When a peer creates a new SSH channel, SwiftNIO SSH will create a new NIO `Channel` that is used to represent all traffic on that SSH channel. Within this child `Channel` all events are strictly ordered with respect to one another: however, events in different `Channel`s may be interleaved freely by the implementation.

An active SSH connection therefore looks like this:

~~~
┌ ─ NIO Channel ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐

│   ┌───────────────────────────┐   │
    │                           │
│   │                           │   │
    │                           │
│   │                           │   │
    │       NIOSSHHandler       │──────────────────────┐
│   │                           │   │                  │
    │                           │                      │
│   │                           │   │                  │
    │                           │                      │
│   └───────────────────────────┘   │                  │
                                                       │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                  │
                                                       │
                                                       │
                                                       │
                                                       │
                                                       ▼
    ┌── SSH Child Channel ────────────────────────────────────────────────────┐
    │                                                                         │
    │   ┌───────────────────────────┐      ┌────────────────────────────┐     ├───┐
    │   │                           │      │                            │     │   │
    │   │                           │      │                            │     │   ├───┐
    │   │                           │      │                            │     │   │   │
    │   │                           │      │                            │     │   │   │
    │   │        User Handler       │      │        User Handler        │     │   │   │
    │   │                           │      │                            │     │   │   │
    │   │                           │      │                            │     │   │   │
    │   │                           │      │                            │     │   │   │
    │   │                           │      │                            │     │   │   │
    │   └───────────────────────────┘      └────────────────────────────┘     │   │   │
    │                                                                         │   │   │
    └───┬─────────────────────────────────────────────────────────────────────┘   │   │
        │                                                                         │   │
        └───┬─────────────────────────────────────────────────────────────────────┘   │
            │                                                                         │
            └─────────────────────────────────────────────────────────────────────────┘
~~~


An SSH channel is invoked with a channel type. SwiftNIO SSH supports three: `session`, `directTCPIP`, and `forwardedTCPIP`. The most common channel type is `session`, which is used to represent the invocation of a program, whether a specific named program or a shell. The other two channel types are related to TCP port forwarding, and will be discussed later.

An SSH channel operates on a single data type: `SSHChannelData`. This structure encapsulates the fact that SSH supports both regular and "extended" channel data. The regular channel data (`SSHChannelData.DataType.channel`) is used for the vast majority of core data. In `session` channels the `.channel` data type is used for standard input and standard output: the `.stdErr` data type is used for standard error. In TCP forwarding channels, the `.channel` data type is the only kind used, and represents the forwarded data.

### Channel Events

A `session` channel represents an invocation of a command. Exactly how the channel operates is communicated in a number of inbound user events. SwiftNIO SSH supports a wide range, and it covers the most important use-cases, including executing a command directly, requesting a shell, requesting a pseudo terminal, setting environment variables, and more.

### User Authentication

User authentication is a vital part of SSH. SwiftNIO SSH manages user authentication via a series of delegate protocols. These protocols are fully asynchronous, supporting use-cases that may need to read from disk in order to perform user authentication.

### Direct Port Forwarding

Direct port forwarding is port forwarding from client to server. In this mode traditionally the client will listen on a local port, and will forward inbound connections to the server. It will ask that the server forward these connections as outbound connections to a specific host and port.

These channels can be directly opened by clients by using the `.directTCPIP` channel type.

### Remote Port Forwarding and Global Requests

Remote port forwarding is a less-common situation where the client asks the server to listen on a specific address and port, and to forward all inbound connections to the client. As the client needs to request this behaviour, it does so using “global requests”, an SSH feature that enables requesting features that operate at a connection-scope.

Global requests are initiated using `NIOSSHHandler.sendGlobalRequest`, and are received and handled by way of a `GlobalRequestDelegate`. There are two global requests supported today:

* `GlobalRequest.TCPForwardingRequest.listen(host:port:)`: a request for the server to listen on a given host and port.
* `GlobalRequest.TCPForwardingRequest.cancel(host:port:)`: a request to cancel the listening on the given host and port.

Servers may be notified of and respond to these requests using a `GlobalRequestDelegate`. This delegate will be invoked any time a global request is received. Once a listener is established, inbound connections are then sent from server to client using the `.forwardedTCPIP` channel type.

## Additional Resources

Additional documentation and examples can be found on [GitHub](https://github.com/apple/swift-nio-ssh).

## Project Status

This project is currently in a pre-release state. While it’s considered to be feature complete, we’d like to give it some more time to bake in the public eye before we tag a 1.0 release. However, we do not expect any API breakage between now and that release.

## Getting Involved

If you are interested in SwiftNIO SSH, please get involved! SwiftNIO SSH is a fully open-source project, developed on [GitHub](https://github.com/apple/swift-nio-ssh). Contributions from the open source community are welcome at all times. We encourage discussion on the [Swift forums](https://forums.swift.org/c/server). For bug reports, feature requests, and pull requests, please use the GitHub repository.

We’re very excited to see what amazing things you do with SwiftNIO SSH!
