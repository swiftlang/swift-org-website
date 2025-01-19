## 新手友好议题

新手友好议题是指那些适合 Swift 项目新手，甚至是对 Swift 编译器等子项目的模式和概念还不熟悉的贡献者参与的 bug、想法和任务。新手友好议题会标注相应的标签，最简单的查找方式是访问 `github.com/apple/<仓库名>/contribute`，例如 Swift 主仓库的地址是 [github.com/apple/swiftlang/contribute](https://github.com/swiftlang/swift/contribute)。这些议题通常优先级较低，范围适中，不需要过多的重构、研究或调试——相反，它们旨在鼓励新人接触 Swift 的某个部分，了解更多相关知识，并做出实际贡献。

任何拥有[提交权限](#commit-access)且对特定领域有深入了解的人都欢迎并鼓励去确定或构思新手友好议题。

{% comment %}
    // TODO: 这些内容我想迁移到 Jira 中并使用"starter"标签进行标记。目前暂时保留：

* Swift 中间语言（SIL）往返转换：确保 SIL 解析器能够解析 SIL 打印器输出的内容。这是一个很好的项目，可以帮助理解 SIL 及其用途，而且使其能够往返转换对于在 Swift 编译器上工作的任何人都有巨大好处。
* 警告控制：[Clang](http://clang.llvm.org) 有一个很好的方案，可以将警告放入特定的警告组中，允许用户从命令行控制编译器发出哪些警告或将哪些警告视为错误。Swift 也需要这样的功能！
{% endcomment %}
