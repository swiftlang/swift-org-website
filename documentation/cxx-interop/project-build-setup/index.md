---
layout: new-layouts/base
title: Setting Up Mixed-Language Swift and C++ Projects
official_url: https://swift.org/documentation/cxx-interop/project-build-setup/
redirect_from:
- /documentation/cxx-interop/project-build-setup.html
---

Swift [supports](/documentation/cxx-interop/) bidirectional interoperability with C++.
This page
describes how to set up a mixed-language Swift and C++ project using one of the
supported IDEs or build systems:

- [Swift Package Manager](#mixing-swift-and-c-using-swift-package-manager)
- [Xcode](#mixing-swift-and-c-using-xcode)

It also describes how
[other build systems](#mixing-swift-and-c-using-other-build-systems) can
enable C++ interoperability by describing how to use C++ interoperability
when invoking Swift compiler directly.

## Mixing Swift and C++ Using Swift Package Manager

The [Swift Package Manager](/documentation/package-manager/) allows Swift code to use
C++ APIs in Swift.

> Swift Package Manager does not yet provide support for
using Swift APIs in C++.

### Enabling C++ Interoperability in a Package Target

A specific target in a Swift package must enable C++ interoperability in
order to be able to import and use C++ APIs in Swift.
The `interoperabilityMode` Swift build setting is used to enable C++
interoperability for a target. For example, the following package
manifest shows how to enable C++ interoperability for a library target:

```swift
let package = Package(
    name: "LibraryThatUsesCxx",
    products: [
        .library(
            name: "libraryUsesCxx",
            targets: ["libraryUsesCxx"])
    ],
    targets: [
        .target(
            name: "libraryUsesCxx",
            swiftSettings: [.interoperabilityMode(.Cxx)])
    ]
)
```

### Importing Headers from a C++ Package Target

Swift imports C++ headers using [Clang modules](/documentation/cxx-interop#importing-c-into-swift).
Swift Package Manager can generate a
[module map file](/documentation/cxx-interop#creating-a-clang-module)
automatically for a C++ target that contains an **umbrella** header. The
generated module map file allows a Swift target that depends on such C++
target to import the C++ headers from such target.

The umbrella header must contain a list of `#include` directives
that include the target's other public C++ headers.
The supported C++ types and functions
declared in the headers listed in the umbrella header can be used
in Swift, once the Clang module represented by the generated module map is imported
into Swift.

The umbrella header used by the C++ target must:
- Use the name of the C++ target (with an additional extension) as its file name
- Be located in the target's public headers directory

The `include` subdirectory
is the target's default public headers directory.
The `publicHeadersPath` property can be used to specify
an alternative path for target's public headers.



For example, the following Swift package builds a Swift command line tool that
uses a C++ library:

```swift
let package = Package(
    name: "CommandLineSwiftToolUsesCxx",
    products: [
        .library(
            name: "cxxLibrary",
            targets: ["cxxLibrary"]),
        .executable(
            name: "swiftCLITool",
            targets: ["swiftCLITool"])
    ],
    targets: [
        .target(
            name: "cxxLibrary"),
        .executableTarget(
            name: "swiftCLITool",
            dependencies: ["cxxLibrary"],
            swiftSettings: [.interoperabilityMode(.Cxx)])
    ]
)
```

Swift Package Manager will automatically generate a module map for the C++
library in this package, as it can find an umbrella header in the sources:

```shell
Sources
├── swiftCLITool
└── cxxLibrary
    ├── include
    │   ├── cxxLibrary.h   [This is the umbrella header]
    │   └── classImpl.h
    ├── cxxLibrary.cpp
    └── classImpl.cpp
```

The umbrella header `cxxLibrary.h` contains some declarations and also
includes the other headers in the C++ target:

```c++
// Header file `cxxLibrary.h`
#pragma once

#include <classImpl.h>
```

The Swift code in the `swiftCLITool` can import `cxxLibrary` directly:

```swift
import cxxLibrary
```

All of the supported C++ APIs declared in the `classImpl.h` header file
will then be available in Swift.

### Vending Packages That Enable C++ Interoperability

Enabling C++ interoperability for a Swift Package Manager target will
need other targets that depend on such target to enable C++ interoperability
as well.

Enabling C++ interoperability is a breaking change for an existing package,
and so it must be done only in a new major [semver](https://semver.org) version.
Please bump up the package's major version when you enable C++
interoperability!

If you’d like to vend a package with a target that enables C++ interoperability,
we recommend that you:

- Clearly communicate to clients that they have to enable C++
  interoperability when depending on targets from such package.
- Clearly communicate to clients that your package relies on an unreleased
  version of Swift that is still in development.

## Mixing Swift and C++ Using Xcode

[Xcode 15](https://developer.apple.com/xcode/resources/) supports
mixed-language Swift and C++ projects. This section describes
how to use C++ APIs from Swift and Swift APIs from C++ in Xcode.

Check out the
["Mix Swift and C++"](https://developer.apple.com/videos/play/wwdc2023/10172/) WWDC session
for more details on how to use C++ interoperability in Xcode.
The following two sample Xcode projects are available for download as well:

- [Mix Swift and C++ within a single framework target](https://developer.apple.com/documentation/swift/mixingswiftandc++inanxcodeproject)
- [Use C++ APIs from Swift and Swift APIs from C++ across multiple targets](https://developer.apple.com/documentation/swift/usingc++apisinswiftandswiftapisinc++)

### Enabling C++ Interoperability in Xcode

The "C++ and Objective-C interoperability" Xcode build setting
can be set to "C++ / Objective-C++" to enable C++ interoperability
for a specific build target. Enabling C++ interoperability allows you to:

- Mix Swift and C++ in the same target.
- Use C++ and Objective-C++ APIs from imported framework targets.
- Use framework's public Swift APIs from C++ or
  Objective-C++ code in another target.

### Mixing Swift and C++ in the Same Xcode Target

Xcode allows you to mix Swift and C++ or
Objective-C++ within the same framework or App target.

Supported C++ types and functions declared in a **public** header of a framework
target can be used from Swift code in the same target.
App targets must use a bridging header to
make the target's C++ types and functions available to Swift code in
the same App target.
The Swift code in the App target can use such C++ APIs once an
`#include` directive that includes the App target's C++ header that declares
these APIs is added to the bridging header.

The exposed **public** Swift APIs of a framework or an App target
can also be used from the C++ or Objective-C++ implementation
files in the same target,
by including the generated header that's automatically generated by Xcode.
For example, a C++ source file can access the Swift APIs from the same
framework or App target named *Fibonacci* by including the following generated
header:

```c++
// FibonacciCxx.cpp [Fibonacci target]

#include <Fibonacci/Fibonacci-Swift.h>

// You can now use the exposed Swift APIs from Fibonacci.
```


### Using C++ APIs of Imported Framework Target

The supported C++ functions and types declared in a **public** C++ header of
an Xcode framework target can be used from Swift code in other targets.
The target that wants to use C++ APIs from another framework target must add
the framework to its list of dependencies. A Swift source file in such
target can then import the framework and use the C++ APIs in Swift.

For example, the public C++ APIs of the
*ForestLib* framework can be used from a Swift source file in
the *ForestViewer* App target once the Swift file imports the *ForestLib*
framework:

```swift
// TreeView.swift [ForestViewer App target]

import ForestLib

// You can now use the supported C++ APIs from ForestLib.
```

### Using Swift APIs of Imported Framework Target

The supported and exposed **public** Swift APIs of an Xcode framework
target can be used from C++ and Objective-C++ code in other targets.
The target that wants to use Swift APIs from another framework target must add
the framework to its list of dependencies. A C++ or an Objective-C++ source
file in such target can then include the framework's generated header and
use the Swift APIs in C++ or Objective-C++.

For example, the public exposed Swift APIs of the
*StorageProvider* framework can be used from an Objective-C++ source file
in the *SafeStorage* App target once the Objective-C++
source file includes the following generated header:

```swift
// StorageAccess.mm [SafeStorage App target]

#include <StorageProvider/StorageProvider-Swift.h>

// You can now use the exposed Swift APIs from StorageProvider.
```

## Mixing Swift and C++ Using Other Build Systems

This section describes how to enable and use C++ interoperability
when invoking the Swift compiler directly. This allows other
build systems to configure a mixed-language Swift and C++ project.

### Enabling C++ Interoperability in the Swift Compiler

The **`-cxx-interoperability-mode=`** build flag is used to enable C++
interoperability in the Swift compiler. It receives the interoperability
compatibility version
as its value. The only supported value right now is `default`. The `default`
value implies that the interoperability
  compatibility version used by Swift matches the Swift language version.

### Importing a C++ Clang Module When Invoking Compiler Directly

The following build flag allows Swift to find the C++ headers:

- **`-I <path>`**: This flag tells Swift that it should look for imports
  in the directory specified by the given path.
  This path should contain a `module.modulemap` file when you want to import
  a C++ Clang module into Swift.

The `-Xcc` flag is used to pass additional C++ build settings to the
C++ Clang compiler embedded in the Swift compiler. For example, you can use
Clang's `-std=` flag to import C++ headers that require C++20 into Swift:

```shell
swiftc ... -Xcc -std=c++20 ...
```

Putting it all together, the following Swift compiler invocation lets you
compile a Swift file that imports a Clang module whose module map file is
located in the `include` directory:

```shell
swiftc main.swift -cxx-interoperability-mode=default -I include -o main
```

### Generating C++ Header with Exposed Swift APIs

The `-emit-clang-header-path` Swift frontend flag can be used to emit a
generated header when exposing Swift APIs to C++ when building Swift code
in a build system that doesn't provide automatic support for generating
a header file with exposed APIs.

The following Swift compiler invocation emits a generated header file
for the `SwiftModule` module that consists of two source files,
`a.swift` and `b.swift`:

```shell
swiftc -frontend -typecheck \
       /sources/a.swift /sources/b.swift -module-name SwiftModule \
       -cxx-interoperability-mode=default \
       -emit-clang-header-path SwiftModule-Swift.h
```
