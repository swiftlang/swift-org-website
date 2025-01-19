---
layout: page
title: 项目创意
---

本页面包含了我们希望在 GSoC 2018 期间开发的潜在项目创意列表。如果你想申请成为 GSoC 学生，请按照以下两个步骤开始：

1. 浏览本页面并找出你感兴趣的项目创意。
2. 查看[开发论坛](https://forums.swift.org/c/development)以便与潜在的导师建立联系。

## 潜在项目

### 模糊/压力测试工具

**描述**

用 Swift 代码构建一个工具，该工具使用 libSyntax 来解析/变异 Swift 项目，以发现与解析器、类型检查器、SIL 生成、代码补全、重构操作以及 sourcekitd 的光标信息功能相关的潜在问题。该项目的目标是对编译器管道和 sourcekitd 进行压力测试，通过导致无效代码的变异来捕获崩溃或挂起，并在随机位置调用代码补全和重构等功能。

**预期成果/收益/交付物**

测试并改进编译器管道和 sourcekitd 基础设施的健壮性。

**所需技能**

* Swift（熟悉）

**潜在导师**

Nathan Hawes

**预期难度**

中等

### 基于 libSyntax 的缩进机制

**描述**

用基于 libSyntax 的新机制替换现有的 Swift 缩进机制。该项目的一部分工作还包括解决现有缩进结果不理想的情况。

**预期成果/收益/交付物**

一个更加健壮且易于维护的 Swift 缩进机制，以及改进的缩进效果。

**所需技能**

* C++

**潜在导师**

Xi Ge

**预期难度**

中等

### Swift 编译器与外部工具的集成

**描述**

添加一个编译器选项，提供编译器需要执行和通信的外部工具的路径。通信可以通过 stdin/stdout 使用 JSON 格式完成。编译器应该传递编译器参数和当前编译源文件的 libSyntax 树，允许工具返回自定义诊断信息，编译器将这些信息与其他编译器诊断信息一起包含在内。

**预期成果/收益/交付物**

在构建操作期间为自定义代码检查工具、格式化工具或其他工具的开发和集成提供便捷机制。

**所需技能**

* C++
* Swift（熟悉）

**潜在导师**

Rintaro Ishizaki

**预期难度**

简单

### libSyntax 与编译器管道其余部分的集成

**描述**

该项目旨在集成 libSyntax 树并在编译器管道的其余部分（类型检查器、诊断等）中使用它。这将涉及：
- 让解析器只生成 libSyntax 树
- 从 libSyntax 树派生 AST 节点，并让 AST 节点指向 libSyntax 节点以获取源信息
- 应该能够向编译器提供序列化的 libSyntax 树，并在无需解析代码的情况下进行类型检查和代码生成功能。

**预期成果/收益/交付物**

一个健壮的架构，能够清晰地将解析功能与编译器管道的其余部分分离，并为实现增量重解析的未来工作奠定基础。

**所需技能**

* C++
* 编译器管道基础知识

**潜在导师**

Rintaro Ishizaki

**预期难度**

困难

### SwiftPM：为 Linux 自动生成 `LinuxMain.swift` 文件

**描述**

Swift 包作者需要在 `LinuxMain.swift` 文件中列出他们的测试用例才能在 Linux 上运行测试。这是因为在 Linux 上（目前）无法在运行时获取方法列表。但是，我们可以使用 `SourceKit` 找到测试方法，然后在构建过程中自动生成这个文件。

该项目将涉及：
- 在 SwiftPM 中添加为 `SourceKit` 生成编译器参数的功能
- 为 SourceKit 的 C API 编写（最小）Swift 绑定
- 编写一个使用 `SourceKit` 生成 `LinuxMain.swift` 文件的工具
- 将上述工具集成到 SwiftPM 构建过程中

**预期成果/收益/交付物**

在 Linux 上作为 SwiftPM 构建过程的一部分自动生成 `LinuxMain.swift` 文件。

**所需技能**

* Swift
* C/C++
* 构建过程知识会有帮助但不是必需的

**潜在导师**

Ankit Aggarwal

**预期难度**

中等

### SwiftPM：构建一个工具来建议包的下一个语义化版本标签

**描述**

SwiftPM 遵循[语义化版本](https://semver.org/)进行依赖管理。包作者很容易发布一个违反语义化版本约定的新版本。一个能够建议包下一个版本的工具对包开发者来说将非常有用。这可以通过比较最后发布版本的公共 API 和当前 API 状态来实现。`SourceKit` 提供了生成 Swift 模块接口的选项。我们应该能够利用这一点来构建这个工具。可能需要为 `SourceKit` 添加新功能。

**预期成果/收益/交付物**

SwiftPM 应该有一个命令来建议下一个语义化版本标签。例如：

$ swift package next-version --after 1.4.3
由于以下 API 更改，下一个标签应该是 2.0.0：
+ public func foo() -> Int
- public func foo() -> String

**所需技能**

* Swift
* C/C++

**潜在导师**

Ankit Aggarwal

**预期难度**

困难

### SwiftPM：改进命令行状态报告

**描述**

SwiftPM 是一组执行多个有趣任务的命令行工具，例如依赖解析、编译、测试。这些任务的进度/状态报告方式目前比较单调和串行。使用基于终端的动画（可能还有表情符号！）来改进状态报告将为包开发者带来愉悦的体验。例如，可以看看 buck 是如何报告编译进度的：https://buckbuild.com/static/buck-build-15fps.gif

**预期成果/收益/交付物**

swift package resolve、swift build 和 swift test 应该有改进的命令行输出。

**所需技能**

* Swift
* 终端/Shell

**潜在导师**

Ankit Aggarwal

**预期难度**

中等

### SwiftPM：机械式编辑 `Package.swift` 清单文件

**描述**

Swift 包使用 `Package.swift` 清单文件来声明包规范。需要手动编辑该文件以修改依赖项、目标、产品等。如果包开发者可以使用命令行执行这些操作将会非常好。例如，添加新目标需要创建新目录、源文件和在 `Package.swift` 中添加条目。如果我们可以机械式地编辑清单文件，我们就可以自动化这些操作，使过程变得更加简单。这将需要使用 `SourceKit` 来确定新条目应该插入 `Package.swift` 的光标位置。

**预期成果/收益/交付物**

SwiftPM 具有机械式编辑 `Package.swift` 清单文件的能力。

**所需技能**

* Swift
* C/C++

**潜在导师**

* Ankit Aggarwal

**预期难度**

困难
