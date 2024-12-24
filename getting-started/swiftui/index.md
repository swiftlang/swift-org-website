---
layout: page
title: 使用 SwiftUI 构建 iOS 应用
---

> 本教程的源代码可以在 [GitHub](https://github.com/0xTim/swift-org-swiftui-tutorial) 上找到

在本教程中,你将使用 Swift 和 SwiftUI 构建一个小应用,为用户推荐有趣的新活动。在此过程中,你将了解 SwiftUI 应用的几个基本组件,包括文本、图像、按钮、形状、堆栈和程序状态。

首先,你需要从 Mac App Store [下载 Xcode](https://apps.apple.com/app/xcode/id497799835?mt=12)。它是免费的,并且包含了 Swift 和本教程所需的所有其他工具。

安装完成后启动 Xcode,然后选择"Create a new Xcode Project"。在顶部选择 iOS 选项卡,然后选择 App 模板并点击 Next。

**提示:** 虽然我们将以 iOS 16 为目标平台,但我们的代码在 macOS Ventura 及更高版本上也能很好地运行。

创建新项目时,Xcode 会要求你提供一些信息:

- Product Name 输入 "WhyNotTry"
- Organization Identifier 可以输入 com.example。在实际应用中,我们通常会在这里输入自己的域名,例如 org.swift
- Interface 确保选择 SwiftUI
- 可以取消选中 Core Data 和 Include Tests 的复选框;我们在这里不会用到它们

![新建 Xcode 项目]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/new-project.png)

点击 Next 后,Xcode 会询问你要将项目保存在哪里。你可以选择任何适合你的位置,但桌面可能是最方便的。完成后,Xcode 会为你创建新项目,然后打开 ContentView.swift 进行编辑。这是我们将编写所有代码的地方,你会看到其中已经有一些默认的 SwiftUI 代码。

![初始 SwiftUI 项目]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/initial-view.png)

Xcode 为我们创建的示例代码创建了一个名为 `ContentView` 的新视图。视图是 SwiftUI 在屏幕上表示应用用户界面的方式,我们可以在其中添加自定义布局和逻辑。

在 Xcode 的右侧,你会看到该代码运行的实时预览 - 如果你对左侧的代码进行更改,它会立即显示在预览中。如果你看不到预览,请按照[这些说明](https://developer.apple.com/documentation/swiftui/previews-in-xcode)启用它。

例如,尝试将默认的 `body` 代码替换为以下内容:

```swift
var body: some View {
    Text("Hello, SwiftUI!")
}
```

![Hello SwiftUI]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/hello-swift-ui.png)

你应该会看到预览立即更新,这使得在工作时进行快速原型设计变得非常容易。这是一个名为 `body` 的计算属性,每当 SwiftUI 想要显示我们的用户界面时都会调用它。

## 构建静态 UI

在这个应用中,我们将向用户展示他们可以尝试的新健身活动,如篮球、高尔夫和徒步旅行。为了让它看起来更有吸引力,我们将使用活动的名称和代表该活动的图标来显示每个活动,然后在背景中添加一抹颜色。

我们用户界面的主要部分将是一个显示当前推荐活动的圆圈。我们只需写 `Circle` 就可以绘制圆圈,所以将 `Text("Hello, SwiftUI!")` 视图替换为:

```swift
Circle()
```

![SwiftUI Circle]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/swiftui-circle.png)

在预览中,你会看到一个大的黑色圆圈填满了可用的屏幕宽度。这是一个开始,但还不太对 - 我们想要在里面添加一些颜色,最好在两侧添加一些空间,这样看起来就不会那么紧凑。

这两个效果都可以通过调用 `Circle` 视图的方法来实现。我们在 SwiftUI 中称这些为*视图修饰符*,因为它们修改了圆圈的外观或工作方式。在这种情况下,我们需要使用 `fill()` 修饰符来为圆圈着色,然后使用 `padding()` 修饰符在其周围添加一些空间,如下所示:

```swift
Circle()
    .fill(.blue)
    .padding()
```

![带有颜色和内边距的 SwiftUI 圆圈]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/swiftui-circle-color.png)

`.blue` 颜色是几个内置选项之一,如 `.red`、`.white` 和 `.green`。这些都是外观感知的,这意味着它们会根据设备是处于深色模式还是浅色模式而略有不同。

在这个蓝色圆圈上,我们将放置一个显示我们推荐活动的图标。iOS 带有数千个免费图标,称为 *SF Symbols*,你可以[下载免费应用](https://developer.apple.com/sf-symbols/)来查看所有选项。这些图标都有多种粗细可供选择,可以平滑地放大或缩小,而且许多图标还可以着色。

在这里,我们想要一些简单漂亮的东西:我们只想在圆圈上放置一个图标。这意味着使用另一个名为 `overlay()` 的修饰符,它将一个视图放在另一个视图上。将你的代码修改为:

```swift
Circle()
    .fill(.blue)
    .padding()
    .overlay(
        Image(systemName: "figure.archery")
    )
```

![带有图标的 SwiftUI 圆圈]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/swiftui-circle-icon.png)

你应该会看到一个小的黑色射箭图标覆盖在我们的大蓝色圆圈上 - 这是正确的想法,但看起来不太好。

我们真正想要的是射箭图标要大得多,而且在背景上更加醒目。为此,我们需要另外两个修饰符:`font()` 来控制图标的大小,以及 `foregroundColor()` 来改变其颜色。是的,我们使用字体修饰符来控制图标的大小 - 像这样的 SF Symbols 会自动随着我们的文本缩放,这使它们非常灵活。

将你的 `Image` 代码调整为:

```swift
Image(systemName: "figure.archery")
    .font(.system(size: 144))
    .foregroundColor(.white)
```

![调整大小的 SwiftUI 圆圈图标]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/swiftui-circle-icon-sized.png)

**提示:** 那个 `font()` 修饰符请求一个 144 点的系统字体,这在所有设备上都很大。

现在应该看起来好多了。

接下来,让我们在图像下方添加一些文本,以便用户清楚地知道这是什么建议。你已经见过 `Text` 视图和 `font()` 修饰符了,所以你可以在 `Circle` 代码下方添加这段代码:

```swift
Text("Archery!")
    .font(.title)
```

我们使用 SwiftUI 的内置动态类型大小之一 `.title`,而不是使用固定的字体大小。这意味着字体会根据用户的设置而增大或缩小,这通常是个好主意。

如果一切顺利,你的代码应该是这样的:

```swift
var body: some View {
    Circle()
        .fill(.blue)
        .padding()
        .overlay(
            Image(systemName: "figure.archery")
                .font(.system(size: 144))
                .foregroundColor(.white)
        )

    Text("Archery!")
        .font(.title)
}
```

![带标题文本的圆圈]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/circle-with-title.png)

然而,你在 Xcode 的预览中看到的可能与你预期的不符:你会看到与之前相同的图标,但没有文本。这是怎么回事?

问题在于我们告诉了 SwiftUI 我们的用户界面将有两个视图 - 圆圈和一些文本 - 但我们没有告诉它如何排列它们。我们是想要它们并排吗?一个在另一个上面?还是其他某种布局?

我们可以选择,但我认为这里垂直布局会看起来更好。在 SwiftUI 中,我们使用一个名为 `VStack` 的新视图类型来实现这一点,它被放置在我们当前代码的*周围*,像这样:

```swift
VStack {
    Circle()
        .fill(.blue)
        .padding()
        .overlay(
            Image(systemName: "figure.archery")
                .font(.system(size: 144))
                .foregroundColor(.white)
        )

    Text("Archery!")
        .font(.title)
}
```

现在你应该看到你之前期望的布局:我们的射箭图标在"Archery!"文本的上方。

![VStack 中带标题文本的圆圈]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/circle-with-title-vstack.png)

这好多了!

为了完成我们对这个用户界面的第一次尝试,我们可以在顶部添加一个标题。我们已经有一个允许我们将视图一个接一个垂直放置的 `VStack`,但我不想把标题也放在里面,因为稍后我们会为屏幕的那部分添加一些动画。

幸运的是,SwiftUI 允许我们自由嵌套堆栈,这意味着我们可以将一个 `VStack` 放在另一个 `VStack` 内部,以获得我们想要的确切行为。所以,将你的代码改为:

```swift
VStack {
    Text("Why not try…")
        .font(.largeTitle.bold())

    VStack {
        Circle()
            .fill(.blue)
            .padding()
            .overlay(
                Image(systemName: "figure.archery")
                    .font(.system(size: 144))
                    .foregroundColor(.white)
            )

        Text("Archery!")
            .font(.title)
    }
}
```

这使得新文本具有大标题字体,并且使其变粗,使其作为我们屏幕的真正标题更加突出。

![添加了 Why Not Try 标题]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/why-not-try-title.png)

现在我们有两个 `VStack` 视图:一个内部的,包含圆圈和"Archery!"文本,以及一个外部的,在内部 `VStack` 周围添加标题。当我们稍后添加动画时,这将非常有帮助!

## 让它活起来

尽管射箭很有趣,但这个应用真正需要的是为用户随机推荐一项活动,而不是总是显示同样的内容。这意味着我们需要向视图添加两个新属性:一个用于存储可能的活动数组,另一个用于显示当前推荐的活动。

SF Symbols 有很多有趣的活动可供选择,所以我挑选了一些在这里效果很好的。我们的 `ContentView` 结构已经有一个包含 SwiftUI 代码的 `body` 属性,但我们想在外面添加新的属性。所以,将你的代码改为:

```swift
struct ContentView: View {
    var activities = ["Archery", "Baseball", "Basketball", "Bowling", "Boxing", "Cricket", "Curling", "Fencing", "Golf", "Hiking", "Lacrosse", "Rugby", "Squash"]

    var selected = "Archery"

    var body: some View {
        // ...
    }
}
```

**重要:** 注意 `activities` 和 `selected` 属性是在结构*内部* - 这意味着它们属于 `ContentView`,而不是仅仅是我们程序中的自由浮动变量。

这创建了一个各种活动名称的数组,并选择射箭作为默认值。现在我们可以使用字符串插值在我们的 UI 中使用选定的活动 - 我们可以直接在字符串中放置 `selected` 变量。

对于活动名称,这很简单:

```swift
Text("\(selected)!")
    .font(.title)
```

对于图像来说这稍微复杂一些,因为我们需要在前面加上 `figure.` 然后将活动名称小写 - 我们需要 `figure.archery` 而不是 `figure.Archery`,否则 SF Symbol 将无法加载。

所以,将你的 `Image` 代码改为:

```swift
Image(systemName: "figure.\(selected.lowercased())")
```

这些更改意味着我们的 UI 将显示 `selected` 属性设置的任何内容,所以如果你在该属性中放置一个新字符串,你可以看到它全部更改:

```swift
var selected = "Baseball"
```

![显示棒球]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/baseball.png)

当然,我们希望它能*动态*改变,而不是每次都要编辑代码,所以我们要在内部 `VStack` 下面添加一个按钮,每次按下它时都会改变选定的活动。这仍然在外部 `VStack` 内,这意味着它将排列在标题和活动图标的下方。

现在添加这段代码:

```swift
Button("Try again") {
    // 改变活动
}
.buttonStyle(.borderedProminent)
```

![再试一次按钮]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/try-again-button.png)

所以,你的结构应该是这样的:

```swift
VStack {
    // "Why not try…" 文本

    // 带有图标和活动名称的内部 VStack

    // 新的按钮代码
}
```

新的按钮代码做了三件事:

1. 我们通过传入一个标题来创建 `Button`,该标题将显示为按钮的标签。
2. `// 改变活动` 注释是按下按钮时将运行的代码。
3. `buttonStyle()` 修饰符告诉 SwiftUI 我们希望这个按钮突出显示,所以你会看到它出现在一个带有白色文本的蓝色矩形中。

仅仅有一个注释作为按钮的动作并不是很有趣 - 我们真正想要的是让它从 `activities` 数组中设置一个随机元素到 `selected`。我们可以通过调用数组上的 `randomElement()` 方法来从数组中选择一个随机元素,所以用这个替换注释:

```swift
selected = activities.randomElement()
```

这段代码*看起来*是对的,但实际上会导致编译器错误。我们告诉 Swift 从数组中选择一个随机元素并将其放入 `selected` 属性中,但 Swift 无法确定数组中是否有任何内容 - 它可能是空的,在这种情况下就没有随机元素可以返回。

![随机元素错误]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/random-element-error.png)

Swift 将这些称为*可选值*:`randomElement()` 不会返回一个普通的字符串,它会返回一个*可选*字符串。这意味着字符串可能不存在,所以将其分配给 `selected` 属性是不安全的。

尽管我们知道数组永远不会为空 - 它*总是*会有活动在里面 - 我们可以给 Swift 一个合理的默认值,以防将来数组恰好为空,像这样:

```swift
selected = activities.randomElement() ?? "Archery"
```

这部分修复了我们的代码,但 Xcode 仍然会显示一个错误。现在的问题是 SwiftUI 不喜欢我们在没有警告的情况下直接在视图结构中更改程序的状态 - 它希望我们提前标记所有可变状态,这样它就知道要注意变化。

这是通过在任何将要改变的视图属性前写 `@State` 来完成的,像这样:

```swift
@State var selected = "Baseball"
```

这被称为*属性包装器*,意味着它用一些额外的逻辑包装了我们的 `selected` 属性。`@State` 属性包装器允许我们自由地更改视图状态,但它也会自动监视其属性的变化,以确保用户界面保持最新的值。

这修复了我们代码中的两个错误,所以你现在可以按 Cmd+R 在 iOS 模拟器中构建和运行你的应用。它默认会推荐棒球,但每次你按"Try again"时你都会看到它改变。

<img class="device-aspect-ratio" src="{{site.url}}/assets/images/getting-started-guides/swiftui-ios/running-in-simulator.png" alt="在模拟器中运行应用">

## 添加一些润色

在我们完成这个项目之前,让我们再添加一些调整来使它变得更好。

首先,一个简单的:Apple 建议本地视图状态始终标记为 `private` 访问控制。在较大的项目中,这意味着你不会意外地编写从另一个视图读取一个视图的本地状态的代码,这有助于使你的代码更容易理解。

这意味着要这样修改 `selected` 属性:

```swift
@State private var selected = "Baseball"
```

第二,与其总是显示蓝色背景,我们可以每次都选择一个随机颜色。这需要两个步骤,首先是添加一个包含我们想要选择的所有颜色的新属性 - 将其放在 `activities` 属性旁边:

```swift
var colors: [Color] = [.blue, .cyan, .gray, .green, .indigo, .mint, .orange, .pink, .purple, .red]
```

现在我们可以将圆圈的 `fill()` 修饰符改为在该数组上使用 `randomElement()`,如果数组恰好为空则使用 `.blue`:

```swift
Circle()
    .fill(colors.randomElement() ?? .blue)
```

第三,我们可以通过在活动 `VStack` 和"Try again"按钮之间添加一个新的 SwiftUI 视图 `Spacer` 来分隔它们。这是一个自动扩展的灵活空间,这意味着它会将我们的活动图标推到屏幕顶部,将按钮推到底部。

在它们之间插入它,像这样:

```swift
VStack {
    // 当前 Circle/Text 代码
}

Spacer()

Button("Try again") {
    // ...
}
```

如果你添加多个间隔器,它们会平均分配空间。如果你尝试在"Why not try…"文本之前放置第二个间隔器,你就会明白我的意思 - SwiftUI 将在文本上方和活动名称下方创建相等的空间。

![带间隔器的视图]({{site.url}}/assets/images/getting-started-guides/swiftui-ios/spacers.png)

第四,如果活动之间的变化更平滑会更好,我们可以通过动画来实现这一点。在 SwiftUI 中,这是通过将我们想要动画的更改包装在对 `withAnimation()` 函数的调用中来完成的,像这样:

```swift
Button("Try again") {
    withAnimation {
        selected = activities.randomElement() ?? "Archery"
    }
}
.buttonStyle(.borderedProminent)
```

这将使我们的按钮按压以温和的淡入淡出效果在活动之间移动。如果你愿意,你可以通过将你想要的动画传递给 `withAnimation()` 调用来自定义该动画,像这样:

```swift
withAnimation(.easeInOut(duration: 1)) {
    // ...
}
```

这是一个改进,但我们可以做得更好!

淡入淡出发生是因为 SwiftUI 看到背景颜色、图标和文本在改变,所以它移除旧视图并用新视图替换它。早些时候我让你创建一个内部 `VStack` 来容纳这三个视图,现在你可以看到原因了:我们要告诉 SwiftUI 这些视图可以被识别为一个单一的组,并且该组的标识符可以随时间改变。

要实现这一点,我们需要首先在我们的视图中定义更多的程序状态。这将是我们内部 `VStack` 的标识符,因为它会在我们的程序运行时改变,我们将使用 `@State`。在 `selected` 旁边添加这个属性:

```swift
@State private var id = 1
```

**提示:** 这是更多的本地视图状态,所以最好用 `private` 标记它。

接下来,我们可以告诉 SwiftUI 每次按下我们的按钮时都改变该标识符,像这样:

```swift
Button("Try again") {
    withAnimation(.easeInOut(duration: 1)) {
        selected = activities.randomElement() ?? "Archery"
        id += 1
    }
}
.buttonStyle(.borderedProminent)
```

最后,我们可以使用 SwiftUI 的 `id()` 修饰符将该标识符附加到整个内部 `VStack` 上,这意味着当标识符改变时 SwiftUI 应该将整个 `VStack` 视为新的。这将使它动画显示旧 `VStack` 被移除和新 `VStack` 被添加,而不是仅仅是其中的单个视图。更好的是,我们可以使用 `transition()` 修饰符控制该添加和移除转换的发生方式,它有各种内置的转换供我们使用。

所以,将这两个修饰符添加到内部 `VStack`,告诉 SwiftUI 使用我们的 `id` 属性识别整个组,并用滑动动画其添加和移除转换:

```swift
.transition(.slide)
.id(id)
```

最后一次按 Cmd+R 运行你的应用,你应该会看到按下"Try Again"现在会平滑地将旧活动动画移出屏幕,并用新活动替换它。如果你重复按下"Try Again",它甚至会重叠动画!

<video class="device-aspect-ratio" autoplay loop muted>
  <source src="{{site.url}}/assets/videos/getting-started-guides/swiftui-app/demo.mp4" type="video/mp4">
</video>

## 接下来去哪里?

在本教程中,我们介绍了很多 SwiftUI 的基础知识,包括文本、图像、按钮、堆栈、动画,甚至使用 `@State` 来标记随时间变化的值。SwiftUI 能做的远不止这些,如果需要的话,可以用来构建复杂的跨平台应用。

如果你想继续学习 SwiftUI,有很多免费资源可用。例如,[Apple 发布了各种各样的教程](https://developer.apple.com/tutorials/swiftui),涵盖基本主题、绘图和动画、应用设计等。我们也会在 Swift.org 上发布一些其他流行教程的链接 - 我们是一个庞大而热情的社区,很高兴有你的加入!

> 本教程的源代码可以在 [GitHub](https://github.com/0xTim/swift-org-swiftui-tutorial) 上找到
