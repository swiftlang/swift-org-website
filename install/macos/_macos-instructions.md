# Install tools and instructions for macOS

Although Swift is primarily used for app development, it can also be used for server-side programming, command-line tool and non-app development, and more. Follow these basic configuration steps and use the tools outlined below.

## Basic configuration

A basic configuration is essential for setting up your development environment, ensuring proper project structure, and preparing your workflow for smooth app development. Here are the general steps:

1. Set up your workspace: Create a new folder for your project or open an existing Swift project folder in [anchor](#visual-studio-code)Visual Studio Code.
2. Configure Swift development tools: You may need to [download and install Xcode](https://itunes.apple.com/app/xcode/id497799835) on your macOS for Swift development. Make sure your Swift toolchain is properly set up. 
3. Create a new Swift file: To create a new Swift file, open **Xcode** > go to the **File** menu > click **New File** > and **Save** it with the **.swift** extension.
4. Write your Swift code: Start coding your Swift program in the editor.
5. Run your Swift code: To run your Swift code, you can use a Swift compiler like [anchor](#swift-repl)Swift REPL (Read-Eval-Print Loop) or the [anchor](#xcode-build-and-run-feature)Xcode’s build-and-run feature as explained below.
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

### Xcode build-and-run feature

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

## Build your first app

To start creating apps, let’s first clone the Swift repository. Then, we’ll explore examples using Swift with Xcode and Vapor. 

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
