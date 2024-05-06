---
layout: page
title: macOS Installation Options
---

Installing Swift on macOS offers a compelling environment for developing native applications for Apple platforms, benefiting from tight integration with Xcode, Swift Playgrounds, and the broader Apple ecosystem. By exploring these examples and resources, you can investigate the inner workings of the Swift programming language, make modifications, deepen your understanding, and contribute to the language's evolution. 

## Installation using Xcode

To start using Swift, follow these steps to install Xcode on macOS:

1. Download the [current version of Xcode](https://itunes.apple.com/app/xcode/id497799835) which contains the latest Swift release.
2. Once the download is complete, open the downloaded package.
3. Follow the on-screen instructions to install Swift on your macOS system.
4. After the installation is complete, you can verify the installation by opening Terminal and running the following command:
```
$ swift —version
```

This command will display the installed version of Swift on your macOS system. You can now start using Swift for development on your Mac.

## Installation using Swift.org package installer

If you want a more customized development experience for working in a specific version of Swift, you have the option to use a package installer. 

While Xcode already includes a release of Swift that is supported by Apple, you can experiment with a version that is still in development by downloading one of the packages from the [download](/download) page. 

To submit to the App Store you must build your app using the version of Swift that comes included within Xcode.

Xcode is not required to run the package installer or use an installed
toolchain. However, when Xcode is not installed, the functionality of the Swift
Package Manager may be limited due to some [outstanding issues](https://github.com/apple/swift-package-manager/issues/4396).

Follow the instructions below to stay up-to-date with the latest features and improvements in Swift, and tailor your development environment to your specific needs.

1. Download the latest Swift release
   ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases))
   or development [snapshot](/download/#snapshots) package.
   Make sure that your system meets the aforementioned requirements for
   this package.

2. Run the package installer,
   which will install an Xcode toolchain into
   `/Library/Developer/Toolchains/`.

   An Xcode toolchain (`.xctoolchain`) includes a copy of the compiler, LLDB,
   and other related tools needed to provide a cohesive development experience
   for working in a specific version of Swift.

* To select the installed toolchain in Xcode, navigate to `Xcode > Toolchains`.

  Xcode uses the selected toolchain for building Swift code, debugging, and
  even code completion and syntax coloring. You'll see a new toolchain
  indicator in Xcode's toolbar when Xcode is using an installed toolchain.
  Select the default toolchain to go back to Xcode's built-in tools.

* Selecting a toolchain in Xcode affects the IDE only. To use the installed
  toolchain with
  * `xcrun`, pass the `--toolchain swift` option. For example:

    ~~~ shell
    xcrun --toolchain swift swift --version
    ~~~

  * `xcodebuild`, pass the `-toolchain swift` option.

  Alternatively, you may select the toolchain on the command line by exporting
  the `TOOLCHAINS` environment variable as follows:

  ~~~ shell
  export TOOLCHAINS=$(plutil -extract CFBundleIdentifier raw /Library/Developer/Toolchains/<toolchain name>.xctoolchain/Info.plist)
  ~~~


### Code Signing on macOS

The macOS `.pkg` files are digitally signed
by the developer ID of the Swift open-source project
to allow verification that they have not been tampered with.
All binaries in the package are signed as well.

The Swift toolchain installer on macOS
should display a lock icon on the right side of the title bar.
Clicking the lock brings up detailed information about the signature.
The signature should be produced by
`Developer ID Installer: Swift Open Source (V9AUD2URP3)`.

<div class="warning" markdown="1">
If the lock is not displayed
or the signature is not produced by the Swift open-source developer ID,
do not proceed with the installation.
Instead, quit the installer
and email <swift-infrastructure@forums.swift.org>
with as much detail as possible,
so that we can investigate the problem.
</div>

## Install tools

Although Swift is primarily used for app development, it can also be used for server-side programming, command-line tool development, and more. Follow these basic configuration steps and use the tools outlined below.

### Basic configuration

A basic configuration is essential for setting up your development environment, ensuring proper project structure, and preparing your workflow for smooth app development. Here are the general steps:

1. Set up your workspace: Create a new folder for your project or open an existing Swift project folder in [Visual Studio Code](#visual-studio-code).
2. Configure Swift development tools: You may need to [download and install Xcode](https://itunes.apple.com/app/xcode/id497799835) on your macOS for Swift development. Make sure your Swift toolchain is properly set up. 
3. Create a new Swift file: To create a new Swift file, open **Xcode** > go to the **File** menu > click **New File** > and **Save** it with the **.swift** extension.
4. Write your Swift code: Start coding your Swift program in the editor.
5. Run your Swift code: To run your Swift code, you can use a Swift compiler like [Swift REPL](#swift-repl) (Read-Eval-Print Loop) or Xcode’s build and run feature as explained below.
6. Debugging: Utilize the debugging features in Visual Studio Code to troubleshoot issues in your Swift code.

### Visual Studio Code

Visual Studio Code (VSCode) provides a versatile environment for writing and running Swift code, whether it's for application development, scripting, or learning the language. Follow these steps to install the Visual Studio Code editor: 

1. Go to the [Visual Studio Code](https://code.visualstudio.com/) website and download the installer for macOS.
2. Run the installer and follow the on-screen instructions to complete the installation process.
3. Once installed, launch Visual Studio Code.
4. You can use the **Swift extension** with VSCode as explained below.

### Swift extension

The Swift extension provides support for writing Swift code within the editor. It offers features such as syntax highlighting, code formatting, code completion, debugging, and integration with the Swift Language Server.

Installing Swift extension in VSCode:
1. Open Visual Studio Code.
2. Go to the **Extensions** view by clicking on the square icon on the sidebar.
3. Search for **Swift** in the **Extensions** view search box.
4. Look for the Swift extensions by **Swift Language** and click on the **Install** button.
5. Wait for the installation to complete.

### Swift REPL

Swift REPL is useful for quickly testing and experimenting with Swift code snippets, trying out new language features, and interactively exploring the language. It provides a convenient way to write and execute Swift code without creating a full project or using a separate integrated development environment (IDE).

To run Swift REPL, follow these steps:
1. Open your Terminal on macOS.
2. Type `swift` and press **Enter** to launch the Swift REPL.
3. You should see a prompt `1>` where you can enter Swift code snippets line by line which are evaluated immediately.
4. You can then start typing Swift code directly into the REPL prompt and press **Enter** to see the output of the code.
5. To exit the Swift REPL, type `:q` and press **Enter**.

### Xcode’s build-and-run feature

Xcode's build-and-run feature helps compile and execute Swift projects, especially for iOS, macOS, watchOS, and tvOS app development. It provides a comprehensive development environment with tools for coding, testing, debugging, and running your Swift applications.

To use Xcode's build-and-run feature to compile and execute Swift code in a project, follow these steps:
1. Launch Xcode on your macOS system.
2. Create a New Project or Open an Existing Project:

    a. To create a new project, go to **File** > **New** > **Project** and select the appropriate template for your Swift project.
    
    b. To open an existing project, go to **File** > **Open** and navigate to the location of your Xcode project file (ending with `.xcodeproj` or `.xcworkspace`).
    
3. Write or Open Swift Code: In Xcode, you can write or open your Swift code files within the project's workspace.
4. Build the Project: To build your project, go to **Product** > **Build**. This step compiles all the source code files in your project.
5. Run the Project: After a successful build, you can run the project by going to **Product** > **Run**.
6. Monitor the Output: Xcode will compile your Swift code and run the application. You can monitor the build progress and see the output, including any errors or warnings in the console area.
7. Debugging: Xcode provides powerful debugging tools to help you identify and fix problems. You can set breakpoints, inspect variables, and step through your code with the debugger.
8. Stop Execution: To stop the execution of your Swift project, click the **Stop** button in Xcode.

### Server-side programming and command-line tool development

**Swift Package Manager (SwiftPM)** - [Swift Package Manager](https://www.swift.org/documentation/package-manager/) is a command-line tool for managing the distribution of Swift code. It is integrated with the Swift compiler and allows you to easily add dependencies and build Swift packages. SwiftPM is commonly used for managing dependencies in Swift server-side projects and command-line tools.

**Vapor** - [Vapor](https://www.swift.org/getting-started/vapor-web-server/) is a popular server-side Swift framework that provides tools and libraries for building web servers and APIs in Swift. It offers features like routing, middleware, and template engines, making it easier to develop server-side applications in Swift.

**Hummingbird** - [Hummingbird](https://swiftpackageindex.com/hummingbird-project/hummingbird) is also a server-side Swift framework that provides a variety of tools and libraries to streamline the development process. 

**Command-line tools** - You can build a [command line tool](https://www.swift.org/getting-started/cli-swiftpm/) or use [Xcode](https://itunes.apple.com/app/xcode/id497799835), or any text editor to write Swift scripts. Compile and run Swift scripts directly in the Terminal using the swiftc command. Swift scripts are useful for automating tasks, processing data, or creating utilities on the command line. 

**Docker and Swift images** - You can run Swift applications within [Docker containers](https://www.swift.org/install/linux/) using [Swift Docker images](https://hub.docker.com/_/swift/). Docker provides a way to package, distribute, and run Swift applications consistently across different environments.

## Build your first app

To start creating apps, let’s first clone the Swift repository. Then, we’ll explore examples using Swift with Xcode, Swift Playgrounds, and Vapor. 

To clone the official Swift repository from GitHub, follow these steps:

1. Open Terminal on your Mac.
2. Navigate to the directory where you want to clone the Swift repository. You can use the `cd` command to change directories. For example:
```
$ cd ~/Documents
```

3. Clone the Swift repository using the following command:
```
$ git clone https://github.com/apple/swift.git
```

4. Once the cloning process is complete, you will have a local copy of the Swift repository on your machine.
5. Navigate into the `swift` directory that was created and explore the source code and project files related to the Swift programming language.

### Swift with Xcode

1. Open Xcode

    a. Launch Xcode on your Mac.

    b. Go to **File** > **Open** and navigate to the directory where you cloned the Swift repository.

    c. Choose the `swift` directory that was created during the cloning process and click **Open**.

2. Explore the Swift Source Code

    a. Once you have the Swift repository open in Xcode, you can browse through the source code, view files, and search for specific components.
    
    b. You can also build and run individual parts of the Swift project within Xcode for experimentation or learning purposes.
    
3. Follow the [Getting started with Xcode](https://developer.apple.com/videos/play/wwdc2019/404/) tutorial to learn how to develop a working SwiftUI app.

### Swift Playgrounds

Swift Playgrounds offers an environment where you can explore and learn application development at your own pace, making it an ideal starting point for beginners. Follow the [Build an iOS app with SwiftUI tutorial](https://www.swift.org/getting-started/swiftui/) to create your first app in Swift Playgrounds.

### Swift with Vapor

If you're looking to build a web service using the Vapor framework, you can follow the [Build a Web Service with Vapor instructions](https://www.swift.org/getting-started/vapor-web-server/) to create a new project, set up routes, and send and receive JSON. These steps will help you get started on creating a powerful and efficient web service that can handle your application's needs.

## What's next

Here are some additional resources to help you learn, practice, and improve your skills in Swift programming. Whether you are new to Swift or looking to deepen your expertise, utilizing these resources can be beneficial in mastering the language and becoming a proficient Swift developer. 

* [Swift tour](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/)
* [Develop in Swift](https://developer.apple.com/tutorials/develop-in-swift/)
* [Swift Programming Language (5.10)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
* [Swift reference guide](https://www.swift.org/documentation/)
* [Swift Standard Library](https://developer.apple.com/documentation/swift/swift_standard_library/)
* [Swift UI tutorials](https://developer.apple.com/tutorials/swiftui) 
* [WWDC videos](https://developer.apple.com/videos/swift/)
