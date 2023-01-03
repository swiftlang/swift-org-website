---
layout: page
title: Build a library
---

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small application with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
❯ mkdir swift-library
❯ cd swift-library
❯ swift package init --name swift-library --type library
~~~

This will generate a new directory called hello-swift with the following files:

~~~no-highlight
.
├── Package.swift
├── README.md
├── Sources
│   └── swift-library
│       └── swift_library.swift
└── Tests
    └── swift-libraryTests
        └── swift_libraryTests.swift
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as dependencies.

`Sources/swift-library/swift-library.swift` is the library initial source file and where we’ll write our library code.
`Test/swift-libraryTests/swift-libraryTests.swift` is where we can write tests for our library.

In fact, SwiftPM generated a "Hello, world!" project for us, including some unit tests!
We can run the tests by running  `swift test`  in our terminal.

~~~bash
❯ swift test
[3/3] Linking swift-libraryPackageTests
Test Suite 'All tests' started at 2023-01-03 10:57:52.659
Test Suite 'swift-libraryPackageTests.xctest' started at 2023-01-03 10:57:52.660
Test Suite 'swift_libraryTests' started at 2023-01-03 10:57:52.660
Test Case '-[swift_libraryTests.swift_libraryTests testExample]' started.
Test Case '-[swift_libraryTests.swift_libraryTests testExample]' passed (0.003 seconds).
Test Suite 'swift_libraryTests' passed at 2023-01-03 10:57:52.664.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.003 (0.004) seconds
Test Suite 'swift-libraryPackageTests.xctest' passed at 2023-01-03 10:57:52.664.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.003 (0.004) seconds
Test Suite 'All tests' passed at 2023-01-03 10:57:52.664.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.003 (0.005) seconds
~~~
