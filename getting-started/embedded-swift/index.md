---
layout: page
title: 为微控制器构建嵌入式应用
---

> 本指南的源代码可以在 [GitHub](https://github.com/apple/swift-embedded-examples/blob/main/pico-blink-sdk/README.md) 上找到

在本教程中,我们将以 Raspberry Pi Pico 作为目标嵌入式设备来运行我们的 Swift 应用程序。如果你没有实体设备也不用担心!你仍然可以在在线模拟器中运行应用程序。

## 安装 Swift

如果你还没有安装 Swift,请先[安装 Swift](https://swift.swiftgg.team/install)。由于嵌入式 Swift 目前还处于实验阶段,仅在预览工具链中提供,因此请确保安装"开发快照"工具链(main),而不是发布工具链(6.0)。如果你使用的是 macOS 机器,需要确保已安装的工具链被选为活动状态,例如通过导出 `TOOLCHAINS` 环境变量:

```shell
$ export TOOLCHAINS=org.swift.59202405011a
```

要测试是否已安装 Swift,请在 shell 或终端应用程序中运行 `swift --version`。它应该显示"6.0-dev",表示你已安装了"开发快照"工具链。

## 安装嵌入式开发依赖

按照 [Pico 入门指南](https://datasheets.raspberrypi.com/pico/getting-started-with-pico.pdf) 安装 Raspberry Pi Pico SDK 和 Arm 嵌入式工具链。
导出三个环境变量以匹配你的设置和硬件:

```shell
$ export PICO_BOARD=pico
$ export PICO_SDK_PATH=...       # Pico SDK 的位置
$ export PICO_TOOLCHAIN_PATH=... # Arm 嵌入式工具链的位置
```

如果你使用的是支持 Wi-Fi 的 Pico W 板而不是普通的 Pico,请注意你需要稍微不同的设置,具体请参考 [Pico W 示例项目](https://github.com/apple/swift-embedded-examples/tree/main/pico-w-blink-sdk),仅指定 `PICO_BOARD=pico_w` 是不够的。

安装 [CMake 3.29](https://cmake.org/) 或更新版本。

要测试是否已安装所有必需的组件,可以在终端中运行以下命令:

```shell
$ swift --version
Apple Swift version 6.0-dev (LLVM b66077aefd3be08, Swift 84d36181a762913)
$ cmake --version
cmake version 3.29.2
$ echo $PICO_BOARD
pico
$ ls $PICO_SDK_PATH                              
CMakeLists.txt          README.md               external/               pico_sdk_version.cmake  tools/
CONTRIBUTING.md         cmake/                  lib/                    src/
LICENSE.TXT            docs/                   pico_sdk_init.cmake     test/
$ ls $PICO_TOOLCHAIN_PATH
13.2.Rel1-darwin-arm64-arm-none-eabi-manifest.txt  include/                                           share/
arm-none-eabi/                                     lib/
bin/                                               libexec/
```

## 构建一个"闪烁 LED"嵌入式应用

在嵌入式开发中,标准的"Hello, World"是一个重复闪烁 LED 的程序。让我们来构建一个。以下设置也可以在 [swift-embedded-examples](https://github.com/apple/swift-embedded-examples/blob/main/pico-blink-sdk/README.md) 中找到,但我们将在下面展示你只需要三个文件即可。
让我们创建一个新的空目录,并为基于 CMake 的项目准备一个简单的结构,该项目可以在 Pico SDK 之上使用:

```
embedded-swift-tutorial
├── BridgingHeader.h
├── CMakeLists.txt
└── Main.swift
```

Main.swift 和 BridgingHeader.h 文件最初可以包含以下基本内容:

```swift
// Main.swift
let led = UInt32(PICO_DEFAULT_LED_PIN)
gpio_init(led)
gpio_set_dir(led, /*out*/true)
while true {
  gpio_put(led, true)
  sleep_ms(250)
  gpio_put(led, false)
  sleep_ms(250)
}
```

```c
// BridgingHeader.h
#include "pico/stdlib.h"
```

要在 Pico SDK 的 CMake 支持之上构建,我们需要在 CMakeLists.txt 文件中添加更多的 CMake 逻辑:

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.29)
include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)

set(CMAKE_Swift_COMPILATION_MODE wholemodule)
set(CMAKE_Swift_COMPILER_WORKS YES)

project(blinky)
pico_sdk_init()
enable_language(Swift)

add_executable(blinky Main.swift)
set_target_properties(blinky PROPERTIES LINKER_LANGUAGE CXX)

# 清除包含 Swift 编译器不接受的 C 特定编译器标志的默认 COMPILE_OPTIONS
# 相反,将这些选项设置为仅在编译 C 代码时应用
set_target_properties(pico_standard_link PROPERTIES INTERFACE_COMPILE_OPTIONS "")
target_compile_options(pico_standard_link INTERFACE "$<$<COMPILE_LANGUAGE:C>:SHELL: -ffunction-sections -fdata-sections>")

set(SWIFT_INCLUDES)
foreach(dir ${CMAKE_C_IMPLICIT_INCLUDE_DIRECTORIES})
    string(CONCAT SWIFT_INCLUDES ${SWIFT_INCLUDES} "-Xcc ")
    string(CONCAT SWIFT_INCLUDES ${SWIFT_INCLUDES} "-I${dir} ")
endforeach()

target_compile_options(blinky PUBLIC "$<$<COMPILE_LANGUAGE:Swift>:SHELL:
        -enable-experimental-feature Embedded
        -target armv6m-none-none-eabi -Xcc -mfloat-abi=soft -Xcc -fshort-enums -Xfrontend -function-sections
        -import-bridging-header ${CMAKE_CURRENT_LIST_DIR}/BridgingHeader.h
        ${SWIFT_INCLUDES}
    >")

target_link_libraries(blinky pico_stdlib hardware_uart hardware_gpio)
pico_add_extra_outputs(blinky)
```

现在我们准备为 Pico 配置和构建这个固件。运行以下命令:

```shell
$ cmake -B build -G Ninja .    # 配置步骤
$ cmake --build build          # 构建步骤
```

构建应该成功,并以多种格式生成固件(ELF、HEX、UF2),包括一些信息转储文件(DIS、ELF.MAP):

```shell
$ ls -al build/blinky*
-rwxr-xr-x  1 kuba  staff   8.0K Jan  1 12:00 build/blinky.bin*
-rw-r--r--  1 kuba  staff   145K Jan  1 12:00 build/blinky.dis
-rwxr-xr-x  1 kuba  staff    30K Jan  1 12:00 build/blinky.elf*
-rw-r--r--  1 kuba  staff   222K Jan  1 12:00 build/blinky.elf.map
-rw-r--r--  1 kuba  staff    23K Jan  1 12:00 build/blinky.hex
-rw-r--r--  1 kuba  staff    16K Jan  1 12:00 build/blinky.uf2
```

## 在设备上运行固件

如果你有一个 Raspberry Pi Pico,我们现在要上传构建好的固件并运行它。如果你没有,可以跳到下一节,在**模拟器中运行相同的固件文件**。

通过 USB 线将 Raspberry Pi Pico 板连接到你的 Mac,并确保它处于 USB 大容量存储固件上传模式。如果你从未上传过任何固件,通常就是这种情况 - 如果 Pico 的内存中没有任何有效的固件,它会启动到固件上传模式。一旦上传了有效的固件,设备在插入后就会运行该固件。要返回固件上传模式,*在插入板子时按住 BOOTSEL 按钮*。

然后 Pico 应该会作为一个挂载的卷显示在 /Volumes 中(在这种情况下显示为 RPI-RP2):

```shell
$ ls -al /Volumes
lrwxr-xr-x   1 root  wheel     1B Jan  1 12:00 Macintosh HD@ -> /
drwx------   1 kuba  staff    16K Dec 31  1969 RPI-RP2/
```

将 UF2 文件复制到这个卷:

```shell
$ cp build/blinky.uf2 /Volumes/RPI-RP2
```

这将使 Pico 自动安装固件,重新启动,并运行固件。

绿色 LED 现在应该重复闪烁。太好了!我们的第一个嵌入式 Swift 程序正在嵌入式设备上运行!

## 在模拟器中运行固件

如果你没有实体 Pico,或者想要快速迭代,[Wokwi](https://wokwi.com/) 是一个免费的在线模拟器,可以模拟各种嵌入式微控制器,包括 Raspberry Pi Pico。它执行的是你通常会上传到实体设备的相同固件二进制文件,并逐条指令模拟。

在 Wokwi 中打开一个[新的 Pico 项目](https://wokwi.com/projects/new/pi-pico)。不要使用代码编辑器编写 C 代码,而是按 F1 并选择"上传固件并开始模拟"。然后选择我们的构建过程生成的 UF2 文件。

一旦你将 UF2 文件上传到 Wokwi,模拟就会开始,LED 应该开始重复闪烁。太好了!我们的第一个嵌入式 Swift 程序正在模拟器中运行!

## 附加内容:使用嵌入式 Swift 为你的主机操作系统构建简单程序

虽然像 macOS 和 Linux 这样的桌面操作系统不是嵌入式 Swift 的典型目标,但你**完全可以**使用嵌入式 Swift 模式为它们构建代码。这对于实验、尝试嵌入式 Swift,或者快速迭代一些不需要实体设备就能工作的代码想法很有用。

嵌入式 Swift 中最简单的程序可以就是一个普通的"Hello, World":

```swift
// HelloEmbedded.swift
print("Hello, Embedded Swift 😊")
```

构建成可执行文件可以直接调用 `swiftc` 编译器,但我们需要添加标志来启用嵌入式 Swift,以及整体模块优化。

```shell
$ swiftc HelloEmbedded.swift -o HelloEmbedded -enable-experimental-feature Embedded -wmo
```

这将生成一个普通的可执行二进制文件,但请注意它的大小非常小,而且它*实际上不依赖操作系统中的 Swift 运行时*(所有嵌入式 Swift 二进制文件都在内部携带其运行时+stdlib 依赖):

```shell
$ ls -al
-rwxr-xr-x    1 kuba  staff    18K May 16 17:19 HelloEmbedded*
-rw-r--r--    1 kuba  staff    59B May 16 17:16 HelloEmbedded.swift
$ otool -L HelloEmbedded
HelloEmbedded:
  /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1000.0.0)
```

让我们运行它:

```shell
$ ./HelloEmbedded 
Hello, Embedded Swift 😊
```

太好了!我们的第一个*主机端*嵌入式 Swift 程序正在工作!

## 下一步去哪里

- [嵌入式 Swift 愿景文档](https://github.com/swiftlang/swift-evolution/blob/main/visions/embedded-swift.md) 将为你概述嵌入式 Swift 的方法和目标,以及嵌入式 Swift 语言子集中具体包含什么。
- GitHub 上的 [嵌入式 Swift 示例项目集合](https://github.com/apple/swift-embedded-examples) 展示了 Swift 今天可以在哪些嵌入式设备上工作,这些示例也可以用作你自己项目的模板。
- [嵌入式 Swift 用户手册](https://github.com/swiftlang/swift/blob/main/docs/EmbeddedSwift/UserManual.md) 描述了如何使用嵌入式 Swift 编译模式以及如何与编译器交互。
- [工具页面](https://swift.swiftgg.team/tools/#editors) 有关于在你的编辑器中设置 Swift 集成的指南,以启用索引、自动完成、跳转到定义等功能。
- [Swift 论坛](https://forums.swift.org/) 是提问、反馈或分享你的酷项目的最佳场所。

---

> 本指南的源代码可以在 [GitHub](https://github.com/apple/swift-embedded-examples/blob/main/pico-blink-sdk/README.md) 上找到
