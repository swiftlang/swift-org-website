---
layout: new-layouts/post
published: true
date: 2025-11-07 10:00:00
title: "GSoC 2025 Showcase: Extending Swift-Java Interoperability"
author: [mads, ktoso]
category: "Community"
---

This is the second post in our series showcasing the Swift community’s participation in [Google Summer of Code](https://summerofcode.withgoogle.com) 2025. Learn more about the projects and work accomplished:

- [Bringing Swiftly support to VS Code](/blog/gsoc-2025-showcase-swiftly-support-in-vscode/)
- Extending Swift-Java Interoperability (this post)
- [Improved code completion for Swift](/blog/gsoc-2025-showcase-code-completion/)
- [Improved console output for Swift Testing](/blog/gsoc-2025-showcase-swift-testing-output/)

Each GSoC contributor has shared a writeup about their project and experience in the program on the Swift forums. Today’s featured project improved interoperability between Swift and Java, contributed by Mads Odgaard. Mads recently presented on this project at the Server-Side Swift conference: [Expanding Swift/Java Interoperability](https://www.youtube.com/watch?v=tOH6V1IvTAc), and you may have noticed it in action in the recent Swift.org blog post: [Announcing the Swift SDK for Android](https://www.swift.org/blog/nightly-swift-sdk-for-android/)!

To learn more, you can read the [full post on the Swift forums](https://forums.swift.org/t/gsoc-2025-new-jni-mode-added-to-swift-java-jextract-tool/81858).

---

## JNI mode for SwiftJava interoperability jextract tool

My name is Mads and I am excited to share with you what I have been working on for Swift/Java interoperability over the summer with my mentor Konrad Malawski for Google Summer of Code 2025.

# Overview

The [swift-java](https://github.com/swiftlang/swift-java) interoperability library provides the `swift-java jextract` tool, which automatically generates Java sources that are used to call Swift code from Java. Previously, this tool only worked using the [Foreign Function and Memory API (FFM)](https://docs.oracle.com/en/java/javase/21/core/foreign-function-and-memory-api.html), which requires JDK 22+, making it unavailable on platforms such as Android. The goal of this project was to extend the jextract tool, such that it is able to generate Java sources using JNI instead of FFM and thereby allowing more platforms to utilize Swift/Java interoperability. 

I am very glad to report that we have succeeded in that goal, supporting even more features than initially planned! Our initial goal was to achieve feature parity with the FFM mode, but the new JNI mode also supports additional Swift language features such as enums and protocols!

With the outcome of this project, you can now run the following command to automatically generate Java wrappers for your Swift library using JNI, therefore opening up the possibility of using it on platforms such as Android.  

```bash
swift-java jextract --swift-module MySwiftLibrary \
  --mode jni \
  --input-swift Sources/MySwiftLibrary \
  --output-java out/java \
  --output-swift out/swift   
```

# How does it work?

Each Swift class/struct is extracted as a single Java `class`. Functions and variables are generated as Java methods, that internally calls down to a native method that is implemented in Swift using `@_cdecl`. Take a look at the following example:

```swift  
public class MySwiftClass {
  public let x: Int64
  public init(x: Int64) {
    self.x = x
  }

  public func printMe() {
    print(“\(self.x)”);
  }
}
```

It is roughly generated to the equivalent Java `class`:  

```java  
public final class MySwiftClass implements JNISwiftInstance {
  public static  MySwiftClass init(long x, long y, SwiftArena swiftArena$) {
    return MySwiftClass.wrapMemoryAddressUnsafe(MySwiftClass.$init(x, y), swiftArena$);
  }
  
  public  long getX() {
    return MySwiftClass.$getX(this.$memoryAddress());
  }

  public  void printMe() {
    MySwiftClass.$printMe(this.$memoryAddress());
  }

  private static native long $init(long x, long y);
  private static native long $getX(long self);
  private static native void $printMe(long self);
}
```
We also generate additional Swift thunks that actually implement the `native` methods and call the underlying Swift methods.

You can learn more about how the memory allocation and management works [in the full version of this post on the Swift forums](https://forums.swift.org/t/gsoc-2025-new-jni-mode-added-to-swift-java-jextract-tool/81858)!

An interesting aspect of an interoperability library such as `swift-java` is the memory management between the two sides, in this case the JVM and Swift. The FFM mode uses the FFM APIs around `MemorySegment` to allocate and manage native memory. We are not so lucky in JNI. In older Java versions there are different ways of allocating memory, such as `Unsafe` or `ByteBuffer.allocateDirect()`. We could have decided to use these and allocate memory on the Java side, like FFM, but instead we decided to move the responsibility to Swift, which allocates the memory instead. This had some nice upsides, as we did not have to handle the complexity of witness tables like FFM mode does.

> For more info on memory in FFM, I strongly recommend watching Konrad’s talk [try! Swift Tokyo 2025 \- Foreign Function and Memory APIs and Swift/Java interoperability](https://www.youtube.com/watch?v=vgtzhTOhEbs)

The most obvious place we need to allocate memory is when we initialize a wrapped Swift `class`. Take a look at the following generated code for a Swift initializer:  
```java  
public static  MySwiftClass init(SwiftArena swiftArena$) {
  return MySwiftClass.wrapMemoryAddressUnsafe(MySwiftClass.$init(), swiftArena$);
}
private static native long $init();
```
Here we see that we are calling a native method `$init` which returns a `long`. This value is a pointer to the Swift instance in the memory space of Swift. It is passed to `wrapMemoryAddressUnsafe`, which is basically just storing the pointer in a local field and registering the wrapper to the `SwiftArena`.

`SwiftArena` is a type that is used to ensure we eventually deallocate the memory when the Java wrapper is no longer needed. There exists two implements of this:

1. `SwiftArena.ofConfined()`: returns a confined arena which is used with *try-with-resource*, to deallocate all instances at the end of some scope.  
2. `SwiftArena.ofAuto()`: returns an arena that deallocates instances once the garbage-collector has decided to do so.

This concept also exists in the FFM mode, and I recommend watching [Konrad’s talk at 
try! Swift Tokyo 2025](https://www.youtube.com/watch?v=vgtzhTOhEbs) to learn more!

If we take a look at the native implementation of `$init` in Swift, we see how we allocate and initialize the memory:  
```swift  
// Generated code, not something you would write

@_cdecl("Java_com_example_swift_MySwiftClass__00024init__JJ")
func Java_com_example_swift_MySwiftClass__00024init__JJ(environment: UnsafeMutablePointer<JNIEnv?>!, thisClass: jclass, x: jlong, y: jlong) -> jlong {
  let result$ = UnsafeMutablePointer<MySwiftClass>.allocate(capacity: 1)
  result$.initialize(to: MySwiftClass.init(x: Int64(fromJNI: x, in: environment!), y: Int64(fromJNI: y, in: environment!)))
  let resultBits$ = Int64(Int(bitPattern: result$))
  return resultBits$.getJNIValue(in: environment!)
}
```
We are basically allocating memory for a single instance of `MySwiftClass`, initializing it to a new instance and returning the memory address of the pointer. It is the same approach for `struct` as well!

# My experience with GSoC

Google Summer of Code was an awesome experience for me! I got to work with my favorite language on a library that is very relevant! A HUGE thanks to my mentor Konrad Malawski, who provided invaluable guidance, was always available for questions and allowed me to experiment and take ownership of the work!

I would definitely recommend GSoC to anyone interested, it is a great way to engage with the open-source community, develop your skills and work with some talented people! My number one advice would be to never be afraid of asking what might seem to be embarrassing questions, they might actually turn out to be great questions and lead to useful discussions and solutions.
