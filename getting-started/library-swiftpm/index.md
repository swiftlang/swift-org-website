---
layout: page
title: Build a library
---

> The source code for this guide can be found [on GitHub](https://github.com/apple/swift-getting-started-package-library)

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small library with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
$ mkdir MyLibrary
$ cd MyLibrary
$ swift package init --name MyLibrary --type library
~~~

This will generate a new directory called _MyLibrary_ with the following files:

~~~no-highlight
.
├── Package.swift
├── Sources
│   └── MyLibrary
│       └── MyLibrary.swift
└── Tests
    └── MyLibraryTests
        └── MyLibraryTests.swift
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as its dependencies.

`Sources/MyLibrary/MyLibrary.swift` is the library initial source file and where we’ll write our library code.
`Test/MyLibraryTests/MyLibraryTests.swift` is where we can write tests for our library.

In fact, SwiftPM generated a "Hello, world!" project for us, including some unit tests!
We can run the tests by running  `swift test`  in our terminal.

~~~no-highlight
$ swift test
Building for debugging...
[5/5] Linking MyLibraryPackageTests
Build complete! (7.91s)
Test Suite 'All tests' started at 2025-08-01 14:02:39.232.
Test Suite 'All tests' passed at 2025-08-01 14:02:39.233.
   Executed 0 tests, with 0 failures (0 unexpected) in 0.000 (0.001) seconds
◇ Test run started.
↳ Testing Library Version: 6.1 (43b6f88e2f2712e)
↳ Target Platform: arm64-apple-macosx
◇ Test example() started.
✔ Test example() passed after 0.001 seconds.
✔ Test run with 1 test passed after 0.001 seconds.
~~~

## A small library

Now let’s write a small library.
Replace the example content of `MyLibrary.swift` with the following code:

~~~swift
import Foundation

struct Email: CustomStringConvertible {
  var description: String

  public init(_ emailString: String) throws {
    let regex = #"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}"#
    guard let _ = emailString.range(of: regex, options: .regularExpression) else {
      throw InvalidEmailError(email: emailString)
    }
    self.description = emailString
  }
}

private struct InvalidEmailError: Error {
  let email: String
}
~~~

Now let's add a unit test for this strongly typed Email API.
Replace the example content of `MyLibraryTests.swift` with the following code:

~~~swift
import Testing
@testable import MyLibrary

struct MyLibraryTests {
  @Test func email() throws {
    let email = try Email("john.appleseed@apple.com")
    #expect(email.description == "john.appleseed@apple.com")

    #expect(throws: (any Error).self) {
      try Email("invalid")
    }
  }
}
~~~

Once we save that, we can run the tests again:

~~~no-highlight
$ swift test
Building for debugging...
[5/5] Linking MyLibraryPackageTests
Build complete! (3.09s)
Test Suite 'All tests' started at 2025-08-01 14:24:32.687.
Test Suite 'All tests' passed at 2025-08-01 14:24:32.689.
   Executed 0 tests, with 0 failures (0 unexpected) in 0.000 (0.001) seconds
◇ Test run started.
↳ Testing Library Version: 6.1 (43b6f88e2f2712e)
↳ Target Platform: arm64-apple-macosx
◇ Suite MyLibraryTests started.
◇ Test email() started.
✔ Test email() passed after 0.001 seconds.
✔ Suite MyLibraryTests passed after 0.001 seconds.
✔ Test run with 1 test passed after 0.001 seconds.
~~~

---

> The source code for this guide can be found [on GitHub](https://github.com/apple/swift-getting-started-package-library).
