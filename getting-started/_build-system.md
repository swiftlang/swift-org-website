## 使用包管理器

Swift包管理器提供了一个基于约定的系统，用于构建库和可执行文件，以及在不同包之间共享代码。

以下示例假设你已经在路径中添加了`swift`命令;
更多信息请参见[安装说明](#installing-swift)。
一旦可用，你就可以调用包管理器工具：`swift package`、`swift run`、`swift build`和`swift test`。

~~~ shell
$ swift package --help
概述: 对Swift包执行操作
...
~~~

### 创建包

要创建一个新的Swift包，首先创建并进入一个名为`Hello`的目录：

~~~ shell
$ mkdir Hello
$ cd Hello
~~~

每个包必须在其根目录下有一个名为`Package.swift`的清单文件。
你可以使用以下命令创建一个名为`Hello`的最小包：

~~~ shell
$ swift package init
~~~

默认情况下，init命令将创建一个库包目录结构：

~~~ shell
├── Package.swift
├── README.md
├── Sources
│   └── Hello
│       └── Hello.swift
└── Tests
    ├── HelloTests
    │   └── HelloTests.swift
    └── LinuxMain.swift
~~~

你可以使用`swift build`来构建包。这将下载、解析和编译清单文件`Package.swift`中提到的依赖项。

~~~ shell
$ swift build
编译Swift模块 'Hello' (1个源文件)
~~~

要运行包的测试，使用：`swift test`

~~~ shell
$ swift test
编译Swift模块 'HelloTests' (1个源文件)
链接 ./.build/x86_64-apple-macosx10.10/debug/HelloPackageTests.xctest/Contents/MacOS/HelloPackageTests
测试套件 'All tests' 开始于 2016-08-29 08:00:31.453
测试套件 'HelloPackageTests.xctest' 开始于 2016-08-29 08:00:31.454
测试套件 'HelloTests' 开始于 2016-08-29 08:00:31.454
测试用例 '-[HelloTests.HelloTests testExample]' 开始。
测试用例 '-[HelloTests.HelloTests testExample]' 通过 (0.001 秒)。
测试套件 'HelloTests' 通过，时间 2016-08-29 08:00:31.455。
	 执行了1个测试，0个失败 (0个意外) 用时0.001 (0.001) 秒
测试套件 'HelloPackageTests.xctest' 通过，时间 2016-08-29 08:00:31.455。
	 执行了1个测试，0个失败 (0个意外) 用时0.001 (0.001) 秒
测试套件 'All tests' 通过，时间 2016-08-29 08:00:31.455。
	 执行了1个测试，0个失败 (0个意外) 用时0.001 (0.002) 秒
~~~

### 构建可执行文件

如果目标包含名为`main.swift`的文件，则该目标被视为可执行文件。
包管理器将把该文件编译成二进制可执行文件。

在这个例子中，
这个包将生成一个名为`Hello`的可执行文件，
输出"Hello, world!"。

首先创建并进入一个名为`Hello`的目录：

~~~ shell
$ mkdir Hello
$ cd Hello
~~~

现在使用可执行文件类型运行swift package的init命令：

~~~ shell
$ swift package init --type executable
~~~

使用`swift run`命令来构建和运行可执行文件：

~~~ shell
$ swift run Hello
编译Swift模块 'Hello' (1个源文件)
链接 ./.build/x86_64-apple-macosx10.10/debug/Hello
Hello, world!
~~~

注意：由于这个包中只有一个可执行文件，我们可以在`swift run`命令中省略可执行文件名。

你也可以通过运行`swift build`命令来编译包，然后从.build目录运行二进制文件：

~~~ shell
$ swift build
编译Swift模块 'Hello' (1个源文件)
链接 ./.build/x86_64-apple-macosx10.10/debug/Hello

$ .build/x86_64-apple-macosx10.10/debug/Hello
Hello, world!
~~~

作为下一步，让我们在一个新的源文件中定义一个新的`sayHello(name:)`函数，
并让可执行文件调用它，而不是直接调用`print(_:)`。

### 使用多个源文件

在`Sources/Hello`目录中创建一个名为`Greeter.swift`的新文件，
并输入以下代码：

~~~ swift
func sayHello(name: String) {
    print("Hello, \(name)!")
}
~~~

`sayHello(name:)`函数接受一个`String`参数，
并在打印"Hello"问候语时，用函数参数替换"World"一词。

现在，再次打开`main.swift`，并用以下代码替换现有内容：

~~~ swift
if CommandLine.arguments.count != 2 {
    print("用法: hello NAME")
} else {
    let name = CommandLine.arguments[1]
    sayHello(name: name)
}
~~~

现在`main.swift`不再使用硬编码的名称，
而是从命令行参数中读取。
并且不是直接调用`print(_:)`，
`main.swift`现在调用`sayHello(name:)`方法。
因为该方法是`Hello`模块的一部分，
所以不需要`import`语句。

运行`swift run`并试用新版本的`Hello`：

~~~ shell
$ swift run Hello `whoami`
~~~

* * *

> 要了解Swift包管理器，
> 包括如何构建模块、导入依赖项和映射系统库，
> 请参见网站的[Swift包管理器](/documentation/package-manager)部分。

> 要了解更多关于包插件的信息，请参见[插件入门指南](https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/Plugins.md#getting-started-with-plugins)。
