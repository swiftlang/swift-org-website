---
layout: page
title: Build a Command-line Tool
---

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small application with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
❯ mkdir hello-swift
❯ cd hello-swift
❯ swift package init --name hello-swift --type executable
~~~

This will generate a new directory called hello-swift with the following files:

~~~no-highlight
.
├── Package.swift
├── README.md
├── Sources
│   └── hello-swift
│       └── main.swift
└── Tests
    └── hello-swiftTests
        └── hello_swiftTests.swift  
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as dependencies.

`Sources/hello-swift/main.swift` is the application entry point and where we’ll write our application code.
`Test/hello-swiftTests/hello_swiftTests.swift` is where we can write tests for our application.

In fact, SwiftPM generated a "Hello, world!" project for us!
We can run this program by running  `swift run`  in our terminal.

~~~bash
❯ swift run
[3/3] Linking hello-swift
Hello, world!
~~~

## Adding dependencies

Let’s add a dependency to our application.
You can find interesting libraries on [Swift Package Index](https://swiftpackageindex.com), the unofficial package index for Swift.

[TODO: actually make this library available publicly]

In this project, we’ll use a package called [swift-figlet](https://github.com/tomerd/swift-figlet).
To do so, we add the following information to our `Package.swift` file:

~~~swift
import PackageDescription

let package = Package(
    name: "hello-swift",
    dependencies: [
       .package(name: "figlet", url: "https://github.com/tomerd/swift-figlet.git", .branch("master")),
    ],
    targets: [
        .target(
            name: "hello-swift",
            dependencies: ["figlet"]),
        .testTarget(
            name: "hello-swiftTests",
            dependencies: ["hello-swift"]),
    ]
)
~~~

Running `swift build`  will instruct SwimPM to install the new dependency and then proceed to build the code.

Running this command also created a new file for us, `Package.resolved`.
This file is a snapshot of the exact versions of the dependencies we are using locally.

To use this dependency, we can open `main.swift`, remove everything that’s in there (it’s just an example), and add this line to it:

~~~swift
import Figlet
~~~

This line means that we can now use the `Figlet` module that the `swift-figlet` package exports for us.


## A small application

Now let’s write a small application with our new dependency. In our  `main.swift`, add the following code:

```swift
import Figlet // from the previous step

let figlet = Figlet()
figlet.say("Hello, Swift!")
```

Once we save that, we can run our application with `swift run`
Assuming everything went well, you should see your application print this to the screen:

~~~no-highlight
 _   _      _ _          ____          _  __ _   _
| | | | ___| | | ___    / ___|_      _(_)/ _| |_| |
| |_| |/ _ \ | |/ _ \   \___ \ \ /\ / / | |_| __| |
|  _  |  __/ | | (_) |   ___) \ V  V /| |  _| |_|_|
|_| |_|\___|_|_|\___( ) |____/ \_/\_/ |_|_|  \__(_)
                   |/
~~~
