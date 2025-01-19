---
layout: page
title: 许可证
---

[Swift 许可证](/LICENSE.txt)基于[Apache 2.0 许可证](https://www.apache.org/licenses/LICENSE-2.0.html)，并附带[运行时库例外条款](#runtime-library-exception)，该条款在使用 Swift 构建和分发您自己的二进制文件时免除了署名要求。选择 Apache 2.0 许可证是因为它允许广泛使用 Swift，并且许多潜在的贡献者已经很熟悉这个许可证。

版权归贡献者个人所有，或归贡献者所属的公司或组织所有。版权持有者名单保存在 Swift.org 网站的 [CONTRIBUTORS.txt](/CONTRIBUTORS.txt) 文件中，以及代码仓库的根目录下。


### 运行时库例外条款

运行时库例外条款明确指出，Swift 编译器的最终用户在其完成的二进制应用程序、游戏或服务中使用 Swift 时，无需注明归属。Swift 语言的最终用户应该可以无限制地创造出优秀的软件。以下是该例外条款的完整文本：

~~~~
作为一个例外，如果您使用本软件编译您的源代码，且本软件的部分内容作为结果被嵌入到二进制产品中，
您可以在不提供许可证第 4(a)、4(b) 和 4(d) 条款所要求的署名的情况下重新分发该产品。
~~~~

这个例外条款也可以在 [LICENSE.txt](/LICENSE.txt) 文件的底部找到。


### 源代码中的版权和许可证

所有托管在 Swift.org 上的源文件必须在文件顶部包含一个注释块，声明适用的许可证和版权。这段文本可以是更大的文件头的一部分，例如在[贡献代码][contributing_code]部分中定义的那样。无论采用何种文件头格式，许可证和版权部分的措辞必须按如下方式复制，并使用适当的年份：

~~~~
// 本源文件是 Swift.org 开源项目的一部分
//
// 版权所有 (c) {{site.time | date: "%Y"}} Apple Inc. 与 Swift 项目作者
// 基于 Apache 许可证 2.0 版本授权，并附带运行时库例外条款
//
// 查看 https://swift.org/LICENSE.txt 获取许可证信息
// 查看 https://swift.org/CONTRIBUTORS.txt 获取 Swift 项目作者列表
~~~~
