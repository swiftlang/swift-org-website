---
layout: page
title: 构建一个库
---

> 本指南的源代码可以在 [GitHub](https://github.com/apple/swift-getting-started-package-library) 上找到

{% include getting-started/_installing.md %}

## 初始化项目

让我们用我们的新 Swift 开发环境编写一个小型库。
首先，我们将使用 SwiftPM 为我们创建一个新项目。在你选择的终端中运行:

~~~bash
$ mkdir MyLibrary
$ cd MyLibrary
$ swift package init --name MyLibrary --type library
~~~

这将生成一个名为 _MyLibrary_ 的新目录，包含以下文件:

~~~no-highlight
.
├── Package.swift
├── Sources
│   └── MyLibrary
│       └── MyLibrary.swift
└── Tests
    └── MyLibraryTests
        └── MyLibraryTests.swift
~~~

`Package.swift` 是 Swift 的清单文件。它用于保存项目的元数据和依赖项。

`Sources/MyLibrary/MyLibrary.swift` 是库的初始源文件，我们将在这里编写库代码。
`Test/MyLibraryTests/MyLibraryTests.swift` 是我们可以为库编写测试的地方。

实际上，SwiftPM 为我们生成了一个"Hello, world!"项目，包括一些单元测试！
我们可以在终端中运行 `swift test` 来运行测试。

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

## 一个小型库

现在让我们编写一个小型库。
用以下代码替换 `MyLibrary.swift` 中的示例内容：

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

现在让我们为这个强类型的 Email API 添加一个单元测试。
用以下代码替换 `MyLibraryTests.swift` 中的示例内容：

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

保存后，我们可以再次运行测试：

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

> 本指南的源代码可以在 [GitHub](https://github.com/apple/swift-getting-started-package-library) 上找到
