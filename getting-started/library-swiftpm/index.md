---
layout: new-layouts/base
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

~~~bash
$ swift test
Building for debugging...
[5/5] Linking MyLibraryPackageTests
Build complete! (7.91s)
Test Suite 'All tests' started at 2023-08-29 18:59:31.328
Test Suite 'MyLibraryPackageTests.xctest' started at 2023-08-29 18:59:31.329
Test Suite 'MyLibraryTests' started at 2023-08-29 18:59:31.329
Test Case '-[MyLibraryTests.MyLibraryTests testExample]' started.
Test Case '-[MyLibraryTests.MyLibraryTests testExample]' passed (0.001 seconds).
Test Suite 'MyLibraryTests' passed at 2023-08-29 18:59:31.330.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.001 (0.001) seconds
Test Suite 'MyLibraryPackageTests.xctest' passed at 2023-08-29 18:59:31.330.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.001 (0.001) seconds
Test Suite 'All tests' passed at 2023-08-29 18:59:31.330.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.001 (0.002) seconds
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
@testable import MyLibrary
import XCTest

final class MyLibraryTests: XCTestCase {
  func testEmail() throws {
    let email = try Email("john.appleseed@apple.com")
    XCTAssertEqual(email.description, "john.appleseed@apple.com")

    XCTAssertThrowsError(try Email("invalid"))
  }
}
~~~

Once we save that, we can run the tests again:

~~~no-highlight
❯ swift test
Building for debugging...
[5/5] Linking MyLibraryPackageTests
Build complete! (3.09s)
Test Suite 'All tests' started at 2023-08-29 19:01:08.640
Test Suite 'MyLibraryPackageTests.xctest' started at 2023-08-29 19:01:08.641
Test Suite 'MyLibraryTests' started at 2023-08-29 19:01:08.641
Test Case '-[MyLibraryTests.MyLibraryTests testEmail]' started.
Test Case '-[MyLibraryTests.MyLibraryTests testEmail]' passed (0.002 seconds).
Test Suite 'MyLibraryTests' passed at 2023-08-29 19:01:08.643.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.002 (0.002) seconds
Test Suite 'MyLibraryPackageTests.xctest' passed at 2023-08-29 19:01:08.643.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.002 (0.002) seconds
Test Suite 'All tests' passed at 2023-08-29 19:01:08.643.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.002 (0.003) seconds
~~~

---

> The source code for this guide can be found [on GitHub](https://github.com/apple/swift-getting-started-package-library)
