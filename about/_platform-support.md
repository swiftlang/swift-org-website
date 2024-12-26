## 平台支持

以开源方式开发 Swift 最令人兴奋的方面之一是知道它现在可以自由移植到各种平台、设备和应用场景中。

我们的目标是为所有平台提供 Swift 的源代码兼容性，即使具体的实现机制可能因平台而异。一个主要例子是，Apple 平台包含 Objective-C 运行时，这是访问 UIKit 和 AppKit 等 Apple 平台框架所必需的。而在其他平台（如 Linux）上，没有 Objective-C 运行时，因为它并非必要。

[Swift 核心库项目](/documentation/core-libraries/) 旨在通过提供基本 Apple 框架（如 Foundation）的可移植实现来扩展 Swift 的跨平台能力，而无需依赖 Objective-C 运行时。尽管核心库目前处于开发的早期阶段，但最终将提升 Swift 代码在各个平台上的源代码兼容性。

### Apple 平台

开源的 Swift 可以在 Mac 上使用，并可以以所有的 Apple 平台作为编译目标：iOS、macOS、watchOS 和 tvOS。此外，开源 Swift 的二进制构建与 Xcode 开发工具进行了集成，包括对 Xcode 构建系统的完整支持、编辑器中的代码补全和集成调试功能，让任何人都可以在熟悉的 Cocoa 和 Cocoa Touch 开发环境中尝试最新的 Swift 功能。

### Linux

开源的 Swift 可以在 Linux 上用于构建 Swift 库和应用程序。开源二进制构建提供了 Swift 编译器和标准库、Swift REPL 和调试器（LLDB），以及 [核心库](/documentation/core-libraries/)，因此开发者可以立即开始使用 Swift 开发。

### Windows

开源的 Swift 可以在 Windows 上用于构建 Swift 库和应用程序。开源二进制构建提供 C/C++/Swift 工具链、标准库和调试器（LLDB），以及 [核心库](/documentation/core-libraries/)，因此开发者可以立即开始使用 Swift 开发。同时，发布版本中包含 SourceKit-LSP，支持开发者在自己选择的 IDE 中高效工作。

### 新平台

我们迫不及待地想与大家一起将 Swift 带到更多新的平台上。我们坚信，这门我们热爱的编程语言能够让软件变得更安全、更快速、更易于维护。我们热切期待你的加入，共同将 Swift 推广到更多计算平台上。
