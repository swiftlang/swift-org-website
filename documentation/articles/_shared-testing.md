The Swift extension automatically renders buttons to run tests. The extension supports [XCTest](https://developer.apple.com/documentation/xctest) as well as
[Swift Testing](https://swiftpackageindex.com/swiftlang/swift-testing/main/documentation/testing).
{% if include.run_tests_image %}
![Testing]({{ include.run_tests_image }})
{% endif %}
{{ include.editor_name }} provides a Test Explorer view in the {{ include.sidebar_position }} which can
be used:

- To navigate to tests
- To run tests
- To Debug tests

As you write tests they are automatically added to the Test Explorer.{% if include.test_explorer_extra %} {{ include.test_explorer_extra }}{% endif %}
{% if include.test_explorer_image %}
![Test Explorer]({{ include.test_explorer_image }})
{% endif %}
To debug a test:

1. Set a breakpoint
2. Run the test, suite, or entire test target with the `Debug Test` profile.

The `Run Test with Coverage` profile instruments the code under test and opens a
code coverage report when the test run completes. As you browse covered files,
line numbers that were executed during a test appear green, and those that were
missed appear red. Hovering over a line number shows how many times covered
lines were executed. Line execution counts can be shown or hidden using the
`Test: Show Inline Coverage` command.

Swift Testing tests annotated with
[tags](https://swiftpackageindex.com/swiftlang/swift-testing/main/documentation/testing/addingtags)
can be filtered in the Test Explorer using `@TestTarget:tagName`. You can then
run or debug the filtered list of tests.

<div class="warning" markdown="1">
The Swift extension does not support running Swift Testing tests in Swift 5.10 or earlier.
</div>
