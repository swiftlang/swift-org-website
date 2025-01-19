## 报告 Bug

报告 Bug 是任何人都可以帮助改进 Swift 的好方法。开源 Swift 项目使用 GitHub Issues 来跟踪 Bug。

<div class="info" markdown="1">
如果某个 Bug 只能在 Xcode 项目或 playground 中复现，
或者该 Bug 与 Apple NDA 相关，
请通过 Apple 的[问题反馈系统][apple-bugtracker]进行报告。
</div>

在创建 issue 时，请包含以下内容：

- **问题的简明描述。**
  如果是崩溃问题，请包含堆栈跟踪信息。否则，请描述您期望看到的行为以及实际观察到的行为。

- **可复现的测试用例。**
  请再次确认您的测试用例能够复现该问题。对于相对较小的示例（大约 50 行代码以内），最好直接粘贴到描述中；较大的示例可以作为附件上传。请考虑将示例精简到尽可能少的代码——更小的测试用例更容易理解，也更容易吸引贡献者关注。

- **复现问题的环境描述。**
  包括 Swift 编译器的版本、部署目标（如果明确设置）以及您的平台信息。

由于 Swift 正在积极开发中，我们会收到大量的 Bug 报告。在创建新的 issue 之前，请花点时间浏览我们[现有的 issues](https://github.com/swiftlang/swift/issues)，以减少重复报告的可能性。

<div class="warning" markdown="1">
在提交请求新语言特性的 issue 之前，请查看 [Swift 演进流程章节](#participating-in-the-swift-evolution-process)。
</div>

[bugtracker]: http://github.com/swiftlang/swift/issues
[apple-bugtracker]: https://bugreport.apple.com
[evolution-repo]: https://github.com/swiftlang/swift-evolution "GitHub 上的 Swift 演进仓库链接"
