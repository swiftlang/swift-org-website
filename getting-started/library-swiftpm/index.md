---
layout: page
title: Build a library
---

{% include getting-started/_installing.md %}

## Bootstrapping

Let’s write a small application with our new Swift development environment.
To start, we’ll use SwiftPM to make a new project for us. In your terminal of choice run:

~~~bash
❯ mkdir MyLibrary
❯ cd MyLibrary
❯ swift package init --name MyLibrary --type library
~~~

This will generate a new directory called hello-swift with the following files:

~~~no-highlight
.
├── Package.swift
├── README.md
├── Sources
│   └── MyLibrary
│       └── MyLibrary.swift
└── Tests
    └── MyLibraryTests
        └── MyLibraryTests.swift
~~~

`Package.swift` is the manifest file for Swift. It’s where you keep metadata for your project, as well as dependencies.

`Sources/MyLibrary/MyLibrary.swift` is the library initial source file and where we’ll write our library code.
`Test/MyLibraryTests/MyLibraryTests.swift` is where we can write tests for our library.

In fact, SwiftPM generated a "Hello, world!" project for us, including some unit tests!
We can run the tests by running  `swift test`  in our terminal.

~~~bash
❯ swift test
Building for debugging...
[4/4] Compiling MyLibraryTests MyLibraryTests.swift
Build complete! (1.30s)
Test Suite 'All tests' started at 2023-01-12 12:05:56.127
Test Suite 'MyLibraryPackageTests.xctest' started at 2023-01-12 12:05:56.128
Test Suite 'MyLibraryTests' started at 2023-01-12 12:05:56.128
Test Case '-[MyLibraryTests.MyLibraryTests testExample]' started.
Test Case '-[MyLibraryTests.MyLibraryTests testExample]' passed (0.005 seconds).
Test Suite 'MyLibraryTests' passed at 2023-01-12 12:05:56.133.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.005 (0.005) seconds
Test Suite 'MyLibraryPackageTests.xctest' passed at 2023-01-12 12:05:56.133.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.005 (0.005) seconds
Test Suite 'All tests' passed at 2023-01-12 12:05:56.133.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.005 (0.007) seconds
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

Now lets add a unit test for this strongly typed Email API.
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

Once we save that, we can run our application with `swift run`
Assuming everything went well, we can run the tests successfully again:

~~~no-highlight
❯ swift test
Building for debugging...
[3/3] Linking swift-libraryPackageTests
Build complete! (0.84s)
Test Suite 'All tests' started at 2023-01-03 16:22:45.070
Test Suite 'swift-libraryPackageTests.xctest' started at 2023-01-03 16:22:45.071
Test Suite 'swift_libraryTests' started at 2023-01-03 16:22:45.071
Test Case '-[swift_libraryTests.swift_libraryTests testEmail]' started.
Test Case '-[swift_libraryTests.swift_libraryTests testEmail]' passed (0.005 seconds).
Test Suite 'swift_libraryTests' passed at 2023-01-03 16:22:45.076.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.005 (0.005) seconds
Test Suite 'swift-libraryPackageTests.xctest' passed at 2023-01-03 16:22:45.076.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.005 (0.005) seconds
Test Suite 'All tests' passed at 2023-01-03 16:22:45.076.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.005 (0.007) seconds
~~~
