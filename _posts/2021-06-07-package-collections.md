---
layout: new-layouts/blog
date: 2021-06-07 9:00:00
title: Package Collections
author: tomerd
---

In Swift 5.5, the Swift Package Manager adds support for package collections — bite size curated lists of packages that make it easy to discover, share and adopt packages.

> At the time of this article’s publication, Swift 5.5 is available as a preview both from [Swift.org](http://swift.org/) and in the Xcode 13 seeds.  Swift 5.5 will be released officially later this year.

The goal of package collections is to improve two key aspects of the package ecosystem:

1. Discovering great packages
2. Deciding which package is the best fit for a particular engineering task

Package collections embrace and promote the concept of curation. Instead of browsing through long lists of web search results, package collections narrow the selection to a small list of packages from curators you trust. Package collections serve many use cases: For example, we envision communities of Swift developers publishing collections that reflect great packages produced and used by those communities to tackle everyday tasks. Educators can also use package collections to aggregate a set of packages to go along with course materials. Enterprises can use package collections to narrow the decision space for their internal engineering teams, focusing on a trusted set of vetted packages.


### Using a collection

Package collections are trivial to use.  You can add it using the new `package-collection add` option from the SwiftPM command line:

~~~console
$ swift package-collection add https://swiftserver.group/collection/sswg.json
Added "Swift Server Workgroup Collection" to your package collections.
~~~

Xcode 13 (available as a preview) also includes support for package collections using a new package collection configuration screen.


### Collections are available today!

There are new package collections already available today, and we expect others to emerge from the Swift community.

**Swift Server Workgroup**

[The Swift Server Workgroup](/sswg/) (part of the Swift project) has published a package collection that contains the packages incubated by the workgroup. The SSWG collection is available at:


>  https://swiftserver.group/collection/sswg.json


**SwiftPackageIndex.com**

The team behind [Swift Package Index](https://swiftpackageindex.com) website created the first implementation of dynamically generated package collections. The website allows you to download collections containing all packages created by a package owner.
More information can be found on the website's [collection page](https://swiftpackageindex.com/package-collections).

**Apple’s OSS Swift packages**

Apple has already published a package collection which includes some of the exciting Swift packages published by Apple including [Swift Argument Parser](https://github.com/apple/swift-argument-parser), [Swift Algorithms](https://github.com/apple/swift-algorithms) and [SwiftNIO](https://github.com/apple/swift-nio).
Apple’s collection is available at:


> https://developer.apple.com/swift/packages/collections/apple.json


Xcode 13 comes pre-configured to use the Apple package collection.  Users of Xcode can immediately try it out!


### Rolling your own collection

Package collections are simple JSON documents. As JSON files, they are easy to publish and share. You can post them to the web (or a file server), share the link, or share the JSON file directly with others.

**Creating the collection**

The recommended way is to use the new [package collection generator](https://github.com/swiftlang/swift-package-collection-generator/tree/main/Sources/PackageCollectionGenerator) tool.  The tool takes a list of package URLs and generates a more complete metadata set for them by parsing the packages manifest file and obtaining metadata from the SCM system where possible.

Given the following `packages.json`

~~~swift
{
  "name": "My Collection",
  "packages": [
    {
      "url": "https://github.com/user/package.git"
    }
  ]
}
~~~

Running the following command:

~~~console
$ package-collection-generate packages.json collection.json
~~~

Will generate a collection JSON file looks like this:

~~~json
{
  "formatVersion": "1.0",
  "name": "My Collection",
  "generatedAt": "2021-06-01T21:28:28Z",
  "packages": [
    {
      "url": "https://github.com/user/package.git",
      "versions": [
        {
          "version": "1.0.0",
          "defaultToolsVersion": "5.1.0",
          "manifests": {
            "5.1.0": {
              "packageName": "MyPackage",
              "products": [
                {
                  "name": "MyProduct",
                  "targets": ["MyTarget"],
                  "type": { "library": ["automatic"] }
                }
              ],
              "targets": [
                {
                  "name": "MyTarget"
                }
              ],
              "toolsVersion": "5.1.0"
            }
          }
        }
      ]
    }
  ]
}
~~~

It’s that easy!

**Signing the collection**

When generating package collections, they can be signed to establish authenticity and protect their integrity. Signing the collection is optional and users can use non-signed collections, but will be prompted for confirmation before doing so.

The recommended way to sign a collection is to use the [package collection signer](https://github.com/swiftlang/swift-package-collection-generator/tree/main/Sources/PackageCollectionSigner) tool which uses a code-signing certificate to sign the collection with.

For example, using the `collection.json` we created in the previous step as input with a code-signing certificate and its private key, running the following command will create a signed version of the collection as the  `collection-signed.json` file, having the signature embedded in the output file itself.

~~~console
$ package-collection-sign \
    collection.json \
    collection-signed.json \
    /certs/private.pem \
    /certs/signing.cer
~~~

You can find more detailed information about generating and signing collections on [SwiftPM’s documentation on the subject](https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageCollections.md).

Once your collection is ready, you can choose how to distribute it. For sharing with students or a small group of collaborators, emailing the collection as an attachment could suffice. Blog authors may choose to host it on their web server and share a link. A large development team may decide to push it to their SCM system and access it from there.


### Telling others about your collections!

If you’ve created a generally useful collection and want to share it with the wider Swift community, the [community showcase](https://forums.swift.org/c/community-showcase/66) area of the Swift forums is an excellent way to let people know about it.
