---
redirect_from: "/source-compatibility/"
layout: new-layouts/base
title: Swift Source Compatibility
---

Source compatibility is a strong goal for future Swift releases. To aid in this
goal, a community owned source compatibility test suite serves to regression
test changes to the compiler against a (gradually increasing) corpus of Swift
source code. Projects added to this test suite are periodically built against
the latest development versions of Swift as part of [Swift's continuous
integration system](https://ci.swift.org), allowing Swift compiler developers to
understand the compatibility impact their changes have on real-world Swift
projects.

## Current List of Projects

<ul>
 {% for project in site.data.source-compatibility.projects %}
   <li><a href="{{project.url}}">{{ project.path }}</a></li>
 {% endfor %}
</ul>

## Adding Projects

The Swift source compatibility test suite is community driven, meaning that open
source Swift project owners are encouraged to submit their projects that meet
the acceptance criteria for inclusion in the test suite. Projects added to the
suite serve as general source compatibility tests and are afforded greater
protection against unintentional source breakage in future Swift releases.

### Acceptance Criteria

To be accepted into the Swift source compatibility test suite, a project must:

1. Target Linux, macOS, or iOS/tvOS/watchOS device
2. Be an *Xcode* or *Swift Package Manager* project (Carthage and CocoaPods are currently unsupported but are being explored to be supported in the future)
3. Support building on either Linux or macOS
4. Be contained in a publicly accessible Git repository
5. Maintain a project branch that builds against the current Swift GM version compatibility mode
   and passes any unit tests
6. Have maintainers who will commit to resolve issues in a timely manner
7. Be compatible with the latest GM/Beta versions of *Xcode* and *swiftpm*
8. Add value not already included in the suite
9. Be licensed with one of the following permissive licenses:
	* BSD
	* MIT
	* Apache License, version 2.0
	* Eclipse Public License
	* Mozilla Public License (MPL) 1.1
	* MPL 2.0
	* CDDL

Note: Linux compatibility testing in continuous integration is not available
yet, but Linux projects are being accepted now.

### Adding a Project

To add a project meeting the acceptance criteria to the suite, perform the
following steps:

1. Ensure the project builds successfully at a chosen commit against
   the current Swift GM version.
2. Create a pull request against the [source compatibility suite
   repository](https://github.com/swiftlang/swift-source-compat-suite),
   modifying **projects.json** to include a reference to the project being added
   to the test suite.

The project index is a JSON file that contains a list of repositories containing
Xcode and/or Swift Package Manager target actions.

To add a new Swift Package Manager project, use the following template:

~~~json
{
  "repository": "Git",
  "url": "https://github.com/example/project.git",
  "path": "project",
  "branch": "main",
  "maintainer": "email@example.com",
  "compatibility": {
    "3.0": {
      "commit": "195cd8cde2bb717242b3081f9c367ccd0a2f0121"
    }
  },
  "platforms": [
    "Darwin"
  ],
  "actions": [
    {
      "action": "BuildSwiftPackage",
      "configuration": "release"
    },
    {
      "action": "TestSwiftPackage"
    }
  ]
}
~~~

The `commit` field specifies a commit hash to pin the repository to. It's
contained inside a `compatibility` field which specifies the version of Swift
the commit is known to compile against. Multiple commits compatible with
different versions of Swift can be specified.

The `platforms` field specifies the platforms that can be used to build the
project. Linux and Darwin can currently be specified.

If tests aren't supported, remove the test action entry.

To add a new Swift Xcode workspace, use the following template:

~~~json
{
  "repository": "Git",
  "url": "https://github.com/example/project.git",
  "path": "project",
  "branch": "main",
  "maintainer": "email@example.com",
  "compatibility": {
    "3.0": {
      "commit": "195cd8cde2bb717242b3081f9c367ccd0a2f0121"
    }
  },
  "platforms": [
    "Darwin"
  ],
  "actions": [
    {
      "action": "BuildXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project OSX",
      "destination": "platform=macOS",
      "configuration": "Release"
    },
    {
      "action": "BuildXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project iOS",
      "destination": "generic/platform=iOS",
      "configuration": "Release"
    },
    {
      "action": "BuildXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project tvOS",
      "destination": "generic/platform=tvOS",
      "configuration": "Release"
    },
    {
      "action": "BuildXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project watchOS",
      "destination": "generic/platform=watchOS",
      "configuration": "Release"
    },
    {
      "action": "TestXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project OSX",
      "destination": "platform=macOS"
    },
    {
      "action": "TestXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project iOS",
      "destination": "platform=iOS Simulator,name=iPhone 7"
    },
    {
      "action": "TestXcodeWorkspaceScheme",
      "workspace": "project.xcworkspace",
      "scheme": "project tvOS",
      "destination": "platform=tvOS Simulator,name=Apple TV 1080p"
    }
  ]
}
~~~

To add a new Swift Xcode project, use the following template:

~~~json
{
  "repository": "Git",
  "url": "https://github.com/example/project.git",
  "path": "project",
  "branch": "main",
  "maintainer": "email@example.com",
  "compatibility": {
    "3.0": {
      "commit": "195cd8cde2bb717242b3081f9c367ccd0a2f0121"
    }
  },
  "platforms": [
    "Darwin"
  ],
  "actions": [
    {
      "action": "BuildXcodeProjectTarget",
      "project": "project.xcodeproj",
      "target": "project",
      "destination": "generic/platform=iOS",
      "configuration": "Release"
    }
  ]
}
~~~

After adding a new project to the index, ensure it builds successfully at the
pinned commits against the specified versions of Swift. In the examples,
the commits are specified as being compatible with Swift 3.0, which is included
in Xcode 8.0.

~~~bash
# Select Xcode 8.0 GM
sudo xcode-select -s /Applications/Xcode.app
# Build project at pinned commit against selected Xcode
./check project-path-field
~~~

On Linux, you can build against the Swift 3.0 release toolchain:

~~~bash
curl -O https://download.swift.org/swift-3.0-release/ubuntu1510/swift-3.0-RELEASE/swift-3.0-RELEASE-ubuntu15.10.tar.gz
tar xzvf swift-3.0-RELEASE-ubuntu15.10.tar.gz
./check project-path-field --swiftc swift-3.0-RELEASE-ubuntu15.10/usr/bin/swiftc
~~~

## Maintaining Projects

In the event that Swift introduces a change that breaks source compatibility
with a project (e.g., a compiler bug fix that fixes wrong behavior in the
compiler), project maintainers are expected to update their projects and submit
a new pull request with the updated commit hash within two weeks of being
notified. Otherwise, unmaintained projects may be removed from the project
index.

## Pull Request Testing

Pull request testing against the Swift source compatibility suite can be
executed by commenting with `@swift-ci Please test source compatibility` in a
Swift pull request.

## Building Projects

To build all projects against a specified Swift compiler locally, use the
`runner.py` utility as shown below.

~~~bash
./runner.py --swift-branch main --projects projects.json --swift-version 3 --include-actions 'action.startswith("Build")' --swiftc path/to/swiftc
~~~

Use the `--include-repos` flag to build a specific project.

~~~bash
./runner.py --swift-branch main --projects projects.json --swift-version 3 --include-actions 'action.startswith("Build")' --include-repos 'path == "Alamofire"' --swiftc path/to/swiftc
~~~

By default, build output is redirected to per-action `.log` files in the current
working directory. To change this behavior to output build results to standard
out, use the `--verbose` flag.
