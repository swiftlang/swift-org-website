## Foundation

Foundation 框架定义了几乎所有应用程序所需的基础功能层。它提供了基本的类，并引入了若干概念，定义了语言或运行时未提供的功能。它的设计目标包括：

* 提供一小组基本的实用类。
* 通过引入一致的约定，简化软件开发。
* 支持国际化和本地化，使软件能够服务于全球用户。
* 提供一定程度的操作系统独立性，以增强可移植性。

关于 Foundation 框架的更多信息，请参考 [Apple 的文档](https://developer.apple.com/reference/foundation)。
Swift.org 版本的 Foundation 使用与 Apple 实现相同的底层库（例如 ICU 和 CoreFoundation），但它已完全独立于 Objective-C 运行时构建。
因此，它是对相同 API 的一次重要重新实现，采用纯 Swift 代码并构建在这些共同的底层库之上。
关于这项工作的更多信息，请访问我们的 [GitHub 项目页面](http://www.github.com/swiftlang/swift-corelibs-foundation)。