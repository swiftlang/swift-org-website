---
layout: page
title: SSWG 孵化流程
---

## 概述

正如[服务器页面](/documentation/server)所述，Swift 服务器工作组（SSWG）的目标是为 Swift 服务器应用程序开发创建一个强大、健康的生态系统。实现这一目标的途径之一是鼓励开发高质量、维护良好的库和工具，让社区能够安心使用。

SSWG 与 Swift 演进流程的区别在于，工作组努力产出的面向服务器的库和工具将存在于 Swift 语言项目之外，并且分布在不同的代码库中。

苹果和 Vapor 的团队都有工程师将积极参与此类库和工具的开发，我们也希望看到社区加入这项工作。为此，工作组定义并启动了一个孵化流程，让*任何人*都可以提出想法、建议、开发和贡献此类库和工具。

孵化流程旨在帮助培育和成熟项目，确保标准化、质量和长期可持续性。它还致力于提高那些能为 SSWG 使命增添价值的想法、实验或其他早期工作的可见度。
以下文档详细说明了这个孵化流程。
SSWG [指导小组](/documentation/server/)的角色类似于 Swift 核心团队，将根据社区的反馈，对推进提案/建议通过孵化流程做出最终决定。
就像 Swift 演进流程一样，任何人都可以提出想法和建议，成为 SSWG 指导小组的成员绝对不是必需条件。

## 流程

孵化包括以下阶段：**构想**、**提案**、**开发**和**推荐**。
开发阶段是孵化的主要阶段。
SSWG 将维护一个公开的"Swift 服务器生态系统"索引页面，列出所有推荐的工具和库，以及处于孵化流程中的项目及其各自的孵化级别。

### 构想

构想是对新库或工具想法的介绍。
它们也可以介绍对现有工具的新功能或更改的想法。
构想用于收集社区反馈，并在编写代码之前帮助确定项目的确切范围。
它们应该展示如何与 SSWG 改进服务器端 Swift 的目标保持一致。
构想通过在 Swift 服务器论坛区创建新主题来提交。

### 提案

要将构想转入提案阶段，必须得到至少两名 SSWG 成员的支持。
提议的代码范围需要与获得支持的构想紧密一致，并且需要根据下面定义的 SSWG 毕业标准进行审查。

提案通过创建 PR 添加提案文档到[提案目录](https://github.com/swift-server/sswg/tree/main/proposals)来提交给 SSWG。提案遵循[模板](https://github.com/swift-server/sswg/blob/main/proposals/0000-template.md)并包含以下信息：

* 名称（在 SSWG 中必须唯一）
* 描述（功能、价值、起源和历史）
* 与 SSWG 使命的一致性声明
* 首选初始成熟度级别（参见 SSWG 毕业标准）
* 初始提交者（项目工作时长）
* 源代码链接（默认为 GitHub）
* 外部依赖（包括许可证）
* 发布方法和机制
* 许可证（默认为 Apache 2）
* 问题追踪器（默认为 GitHub）
* 通信渠道（slack、irc、邮件列表）
* 网站（可选）
* 社交媒体账号（可选）
* 社区规模和任何现有赞助（可选）

提案 PR 提交后，SSWG 将在其两周一次的会议中指定一名审查管理员。
审查管理员的职责包括：

* 审查 PR
  * 验证结构和语言。
  * 确保实现到位。
* 更新 PR
  * 分配编号。
  * 指定审查管理员。
  * 将状态设置为"活跃审查 + 审查日期范围"
* 获得 PR 作者的批准以合并上述更改并进行合并。
* 在[服务器提案区](https://forums.swift.org/c/server/proposals)发布论坛帖子，征求社区反馈。
* 关注论坛主题的行为或离题问题，确保作者参与其中。
* 审查期结束后，以书面形式向 SSWG 总结关键要点。

SSWG 每两周对待定提案进行投票，目标是每月至少对两个提案进行投票。

投票后，审查管理员将：
1. 在审查主题中宣布投票结果。
1. 根据投票结果更新提案状态。
1. 关闭审查主题。

### 毕业标准

每个 SSWG 项目都有一个相关的成熟度级别：**沙盒**、**孵化中**或**已毕业**。
提案应说明其首选的初始成熟度级别，SSWG 将投票决定实际级别。

项目被接受为孵化中或已毕业需要**超级多数**（三分之二）支持。
如果没有超级多数的票数支持进入已毕业级别，那么支持已毕业的票数将重新计算为支持进入孵化中级别的票数。
如果没有超级多数的票数支持进入孵化中级别，那么所有票数都将重新计算为进入沙盒级别的**赞助**。
如果赞助者少于两个，提案将被拒绝。

#### 沙盒级别

要被接受为沙盒级别，项目必须满足下面详述的 [SSWG 最低要求](#minimal-requirements)，并得到至少两名 SSWG 赞助者的支持。

早期采用者应该格外谨慎对待早期阶段的项目。
虽然沙盒项目可以安全尝试，但预计有些项目可能会失败，永远不会进入下一个成熟度级别。
不保证生产就绪性、用户或专业级别的支持。
因此，用户必须运用自己的判断。

#### 孵化中级别

要被接受为孵化中级别，项目必须满足沙盒级别要求，并且：

* 记录至少有两个独立的最终用户在生产环境中成功使用，这些用户在 SSWG 判断中具有足够的质量和范围。
* 必须有 2 个以上的维护者和/或提交者。在这种情况下，提交者是被授予代码库写入权限并积极编写代码以添加新功能和修复任何错误和安全问题的个人。维护者是拥有代码库写入权限并积极审查和管理项目社区其他成员贡献的个人。在所有情况下，代码在发布前都应该由至少一个其他人审查。
* 包必须有多个具有管理员访问权限的人。这是为了避免失去对任何包的访问权限。对于托管在 GitHub 和 GitLab 上的包，包必须位于至少有两个管理员的组织中。如果你不想为包创建组织，可以将它们托管在 [Swift Server Community](https://github.com/swift-server-community) 组织中。
* 展示持续的提交流和合并的贡献，或及时解决的问题，或类似的活动指标。
* 获得 SSWG 超级多数投票支持进入孵化阶段。

#### 已毕业级别

要被接受为已毕业级别，项目必须满足下面详述的 [SSWG 毕业要求](#graduation-requirements)，并且：

* 记录至少有三个独立的最终用户在生产环境中成功使用，这些用户在 SSWG 判断中具有足够的质量和范围。
* 有来自至少两个组织的提交者和维护者（如上定义）。
* 获得 SSWG 超级多数投票支持进入毕业阶段。

## 流程图

![流程图](/assets/images/sswg/incubation.png)

### 生态系统索引

所有项目及其各自的级别都将在 [Swift 服务器生态系统索引](/documentation/server/#projects)中列出。
如果有多个项目解决特定问题（例如，两个类似的数据库驱动程序），它们将按受欢迎程度排序。
对于关键构建块（如日志记录或度量 API），SSWG 保留定义单一解决方案的权利，因为生态系统的一致性具有关键性质。

建议被接受到任何成熟度级别的项目在其项目的 README 中列出成熟度级别，并使用适当的徽章，定义如下：

[![sswg:sandbox](https://img.shields.io/badge/sswg-sandbox-lightgrey.svg)](https://swift.org/sswg/incubation-process.html#sandbox-level){: style="display: inline-block; width: 94px; height: 20px"}
[![sswg:incubating](https://img.shields.io/badge/sswg-incubating-blue.svg)](https://swift.org/sswg/incubation-process.html#incubating-level){: style="display: inline-block; width: 104px; height: 20px"}
[![sswg:graduated](https://img.shields.io/badge/sswg-graduated-green.svg)](https://swift.org/sswg/incubation-process.html#graduated-level){: style="display: inline-block; width: 104px; height: 20px"}

SSWG 将每 6 个月召开一次会议审查所有项目，并保留降级、归档或删除不再满足最低要求的项目的权利。
例如，一个已毕业的项目不再定期更新或未能及时解决安全问题。同样，SSWG 保留删除或归档不再收到更新的构想和提案的权利。

Swift 服务器生态系统索引页面的更改将由 SSWG 通过 Swift 服务器论坛公布。

## 最低要求

* 一般要求
  * 与服务器端 Swift 特别相关
  * 公开访问的源代码由 github.com 或类似的 SCM 管理
    * 根据 [Swift 的指南](https://forums.swift.org/t/moving-default-branch-to-main/38515)，首选使用 `main` 作为默认分支名称
  * 采用 [Swift 行为准则](/community/#code-of-conduct)
* 生态系统
  * 使用 SwiftPM
  * 与关键的 SSWG 生态系统构建块集成，例如日志记录和度量 API、用于 IO 的 SwiftNIO
* 长期可持续性
  * 必须来自拥有多个公共仓库（或类似经验指标）的团队
  * SSWG 应该在紧急情况下有权访问/授权已毕业的仓库
  * 采用 [SSWG 安全最佳实践](/sswg/security/)
* 测试、CI 和发布
  * 有 Linux 单元测试
  * CI 设置，包括测试 PR 和主分支
  * 遵循语义化版本控制，至少发布一个预发布版本（例如 0.1.0、1.0.0-beta.1）或正式版本（例如 1.0.0）
* 许可证
  * Apache 2、MIT 或 BSD（推荐 Apache 2）
* 约定和风格
  * 采用 [Swift API 设计指南](/documentation/api-design-guidelines/)
  * 在适用时遵循 [SSWG 技术最佳实践](#technical-best-practices)。
  * 优先采用代码格式化工具并将其集成到 CI 中

## 毕业要求

* [最低要求](#minimal-requirements)
* 具有稳定的 API（没有待定/计划的破坏性 API 更改），至少发布一个主要版本（例如 1.0.0）
* 在 30 天内支持新的 GA 版本的 Swift
* 为 Swift.org 推荐的最新两个 Swift 版本设置 CI
* 为至少一个 Swift.org 推荐的 Linux 发行版设置 CI
* 为库或工具支持的每个平台设置 CI
* 同时具有 macOS 和 Linux 的单元测试
* 在适当时使用 Swift.org docker 镜像
* 记录发布方法
* 记录至少一个先前主要版本的支持策略
* 明确定义项目治理和提交者流程，最好分别在 GOVERNANCE.md 文件和 OWNERS.md 文件中说明
* 包括至少主要仓库的采用者列表，最好在 ADOPTERS.md 文件中说明或在项目网站上显示徽标
* 可选地，有一个[开发者原创证书](https://developercertificate.org)或[贡献者许可协议](https://en.wikipedia.org/wiki/Contributor_License_Agreement)

## 安全

请遵循[安全](/sswg/security)部分中列出的指导。

## 技术最佳实践

* 在适当的情况下，优先使用原生 Swift 而不是 C 包装
* 并发/IO
  * 除非不可能（阻塞的 C 库等），包应该是非阻塞的（带有异步 API）
  * 应该尽可能少地（最好不要）包装 NIO。直接暴露 NIO 类型将大大有助于使包兼容。
  * 阻塞代码应该包装在 [NIOThreadPool](https://swiftpackageindex.com/apple/swift-nio/2.48.0/documentation/nioposix/niothreadpool) 中（如 Vapor 的 SQLite 包）
* 仅将强制解包和强制尝试用作前提条件，即程序员认为不可能或程序员错误的条件。所有强制尝试/解包都应该附带说明原因的注释
* 除非与 C 交互，否则不使用 `*Unsafe*`
  * 当绝对必要时，可以接受使用 `*Unsafe*` 构造的例外情况，但需要适当记录原因。
  * 当以这种方式使用 `*Unsafe*` 时，预期会为 Swift、SwiftNIO 或其他有问题的库中的根本原因附带增强请求票据。
* 避免使用 `fatalError` 处理错误情况，而是设计 `throws` 或返回 `Result` 的 API。

## 变更管理

对孵化流程的更改必须记录并公开发布，并遵循语义版本控制模式：

* 主要版本：代表方法或工作流程的深层更改
* 次要版本：概念或命名法的小改动。

导致版本升级的更新需要 SSWG 的超级多数投票。修复错别字或格式等琐碎的更改不需要版本升级。

## 资源和参考

- [孵化的包](/sswg/incubated-packages.html)
* [Swift 演进](https://www.swift.org/swift-evolution/)
* [CNCF 项目生命周期和流程](https://github.com/cncf/toc/tree/main/process)
* [Apache 孵化器](https://incubator.apache.org)
