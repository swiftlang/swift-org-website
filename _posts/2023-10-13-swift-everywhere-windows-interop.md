---
layout: new-layouts/blog
published: true
date: 2023-10-13 10:00:00
title: "Swift Everywhere: Using Interoperability to Build on Windows"
author: [compnerd]
---

*This post was originally published at [Speaking in Swift by The Browser Company](https://speakinginswift.substack.com/p/interoperability-swifts-super-power) under the title "Interoperability: Swift's Super Power".*

***

Swift’s deliberate design choices over the years has resulted in a language that showcases how flexibility and compatibility does not need to come at the cost of usability. One of these design choices was Swift’s focus on native interoperability with other languages. The flexibility that this enables makes it a joy to build rich, native experiences in Swift across a variety of environments.

Traditionally when two languages need to interoperate, the function calls at the boundary between the two languages, also known as the Foreign Function Interface (FFI), will go through C using a library like libffi. This approach has some drawbacks such as incurred runtime performance costs and possibly extra boilerplate code. Instead, Swift embeds a copy of clang, the C and C++ compiler, which is able to directly translate between the languages avoiding penalties in code size and runtime performance. This level of interoperability composes wonderfully with existing systems and enables building complex software atop existing C libraries.

## The Windows API

When building native rich, native applications, one important use-case of interoperability is the ability to invoke platform-specific APIs. The Windows API surface reflects its extensive history; the requirement to maintain backwards compatibility has resulted in the accretion of APIs of different shapes. As such, a significant portion of the API is old and low-level enough to be defined in C.

Since Swift uses clang rather than libffi to access C functions and data types, the Swift compiler uses a feature of clang known as (header) modules. Clang modules bundle a set of declarations together, identifying which declarations belong to a particular library, what other modules it may depend on, and what language the declarations are for. This is done by introducing an auxiliary file named `module.modulemap` which contains the definition of the module.

As such, to access the Windows APIs, we must modularize the Windows SDK into one or more clang modules. Fortunately this is not just a theoretical idea. The Swift toolchain contains a module definition for the Windows SDK in the form of the `WinSDK` clang module. To further refine these definitions, a Swift module overlays the clang definitions to provide more Swift friendly definitions in some cases. This exposes the C API surface area of the Windows SDK, and although does not contain all the more modern APIs, enables us to build a variety of command line and GUI apps on Windows.

![A screenshot of a GUI application written using Swift/Win32, showing various standard controls](/assets/images/windows-interoperability-blog/swift-win32-gui-app.webp){:style="max-width: 100%; height: auto; width: unset; margin: auto auto; display: block;"}
*A GUI application using Swift/Win32, which provides a layer of Swift syntactic conveniences for older, C-based Windows UI APIs.*

Modern APIs aren’t exposed using just C, however, and there are large portions of the Windows SDK which are exposed as C++. Realising there is a vast software ecosystem of C++ code that Swift developers may want access to, Swift 5.9 has introduced support for extending its language level interoperability to C++. Although virtual methods and copyable types are not yet available, as Swift’s C++ interoperability matures, the native platform API surface available to Swift will also grow to include the majority of the C++ APIs in the Windows SDK.

This C++ Interop enables a new set of libraries, beyond just the platform APIs, to become available to Swift.  This allows Swift code to also take advantage of a variety of high-performance, cross-platform libraries written over decades by the C++ community. Firebase, for example, is a commonly used cloud computing service and is used in many modern products, including The Browser Company's browser, Arc. Although there is a Swift SDK for Firebase, it is limited to the Apple platforms and is based on Objective-C. However, there is also a cross-platform C++ SDK available. Now with C++ Interop, it is possible to expose this C++ SDK to Swift clients. Such a bridge is being built up with [swift-firebase](https://github.com/compnerd/swift-firebase). Taking advantage of these C++ libraries cross-platform Swift software that would be difficult to build otherwise.


## Component Object Model (COM)

While libraries are one mechanism for sharing code, they are not the only approach. Another style of code sharing is possible via inter-process communication (IPC), which allows two separate applications to communicate with each other and expose functionality to each other. One implementation of this technique that is prevalent on Windows is known as COM (Component Object Model).

Microsoft explored this idea at a higher level in 1990, evolving DDE (Dynamic Data Exchange) into "Object Linking and Embedding" or OLE. The approach was to enable sharing of custom document handlers which could be embedded into new applications without having to rewrite parsers and renders for the formats. To share the implementation of applications across processes, an application could implement well-defined interfaces (e.g. `IOleObject`) that could be consumed by other processes. Eventually, OLE would evolve into what would become to be known as the Component Object Model, or COM.

COM's design was flexible and powerful, and resulted in it being adopted as a common design pattern across a multitude of environments. CoreFoundation adopted it for its plugin model. CFLite, and various forks thereof, brought an implementation of COM to Linux. XPCOM (Cross-Platform Component Object Model) is similar to COM and would gain popularity through Mozilla's extensive usage, as would Open Office’s UNO technology. The model even found its way into driver development with the IOKit framework using a COM based model for kernel drivers.

At COM's core is the idea of defining interfaces (which is normally done in the Interface Definition Language or IDL) that expose functionality to either through a library in the same address space or another process through IPC. Interfaces are identified by globally unique Interface IDs, and all inherit from a base interface called `IUnknown`. `IUnknown` exposes the two fundamental operations of COM:

 1. object lifetime management
 2. access to the object’s functionality

Similar to Swift, object lifetime management is implemented through reference counting, exposed in COM via the `AddRef` and `Release` methods. Access to the object’s functionality is implemented via the `QueryInterface` method, allowing consumers to dynamically request for the object’s functionality. Because consumers dynamically query for a specific COM interface, we cannot statically identify the operations at build time. But the cost is limited to a couple of pointer indirections, similar to C++’s virtual methods, which gives COM a negligible performance overhead.

## COM Support in Swift with C Interop

COM provides not only an interface for working with software dynamically but is also an Application Binary Interface, or ABI, which means it defines how parameters are passed and function calls are arranged. If we want to communicate with COM interfaces from Swift, we need to ensure that we conform to these ABI requirements. Given that the lingua franca for FFI is C, the ABI for COM can be expressed in C. So, as a first step, what does `IUnknown` look like in C?

```c
typedef struct IUnknownVtbl {
  ULONG (STDMETHODCALLTYPE *AddRef)(IUnknown *pUnk);
  ULONG (STDMETHODCALLTYPE *Release)(IUnknown *pUnk);
  HRESULT (STDMETHODCALLTYPE *QueryInterface)(IUnknown *pUnk, REFIID riid, void **ppvObject);
} IUnknownVtbl;

struct IUnknown {
    const struct IUnknownVtbl *lpVtbl;
} IUnknown;
```

If we were to describe this in Swift, we would expect this to be a protocol with a few constraints:

```swift
// typealias IID = WinSDK._GUID

public typealias REFIID = UnsafePointer<IID>

public protocol IUnknown: class {
  class var IID: IID { get }

  func AddRef() -> ULONG
  func Release() -> ULONG
  func QueryInterface(_ riid: REFIID, _ ppvObject: UnsafeMutablePointer<UnsafeMutableRawPointer?>?) -> HRESULT
}

extension IUnknown {
  func QueryInterface<Interface: IUnknown>() throws -> Interface? { … }
}
```

The `: class` on the protocol declaration adds a class-constraint on the protocol, indicating that any conforming type must be a class in Swift. The astute reader would spot the semantic parallels between `IUnknown` and class-constrained types in Swift. `class` types in Swift employ reference counting through ARC, and COM does the same through MRC (manual reference counting), which explains the `AddRef` and `Release` methods. That leaves the `QueryInterface` method which is responsible for dynamically querying the COM Interface, which maps to Swift’s casting operation. As it is not possible to provide a custom cast operation for a type in Swift, the `QueryInterface()` method is a funny spelling for the as keyword. This shows that, conceptually, `IUnknown` is just another way to say “I have a class type in Swift that is implemented somewhere else”!

Since COM concepts bridge so neatly to Swift, we can now build a bridge between COM and Swift. The associated code is available at [Swift/COM](https://github.com/compnerd/swift-com) and demonstrates the viability of interfacing with COM interfaces. As an example, Windows provides 3D acceleration through the DirectX APIs, which are exposed as a set of C++ and COM interfaces. [DXSample](https://github.com/compnerd/DXSample) uses the COM bridged interfaces to implement a 3D accelerated cube replete with shaders to demonstrate that this bridging is possible to accomplish and use in real world scenarios.

Interfaces provide a definition of how you interact with some foreign type, one that may even be implemented in a different language. When using an interface implemented by someone else, such as a DirectX type, we receive a raw pointer to `IUnknown`. The raw pointer representation of the COM interface is cumbersome to use. Wrapping the pointer to abstract the indirection makes COM more approachable.

```swift
open class ID3D12Object: IUnknown {
  public override class var IID: IID { IID_ID3D12Object }

  public func SetName(_ Name: String) throws {
    _ = try perform(as: WinSDK.ID3D12Object.self) { pThis in
      try CHECKED(pThis.pointee.lpVtbl.pointee.SetName(pThis, $0))
    }
  }
  …
}
```

It is also possible to implement a COM interface in Swift, providing a Swift implementation that can be called from C/C++ code even, although this support is nascent and will evolve with Swift’s C++ interoperability support. As COM has a strict ABI, once the object is constructed properly, it can easily be passed across the language boundary and, as such, a Swift type can easily be passed to any COM client.


## COM Support in Swift with C++ Interop

The evolving C++ interop in Swift makes bridging COM to Swift simpler. The interface model in COM is very similar to classes in C++. A COM interface maps directly to a C++ class, and each function on a COM interface maps to a virtual method on the C++ type. For Windows APIs exposed as COM types, such as the DirectX APIs, the COM interfaces are primarily exposed as C++ classes with some optionality to get a C representation of the interface for bridging into other languages. As Swift’s C++ interoperability support improves, it will be possible to import COM interfaces as C++ classes which bridge naturally to Swift types. This reduces the boilerplate we saw above when bridging to COM through C. As of this writing, Swift’s C++ interop support for virtual method dispatch is under development and will soon be able to simplify COM access.

Swift’s work on C++ interoperability has helped our efforts to bridge Swift with COM in other ways as well, adding support for reference-counted foreign types in Swift with the `SWIFT_SHARED_REFERENCE` annotation. Because COM provides a reference counted interface, we can attribute COM interfaces with `SWIFT_SHARED_REFERENCE` to take advantage of ARC while importing types and get memory management for free, avoiding a class of memory safety issues.


## Improving Swift Language Support for COM

Due to the current limitations with C++ interop, we must fallback to the common denominator for interop - C - when trying to bridge COM interfaces. When implementing wrapper types to work with COM interfaces, we notice that it requires a significant amount of boilerplate code. One of Swift’s goals is to have clear, expressive code and this certainly takes away from that. An idea that merits a proper evolution proposal is extending the Swift language to support COM better through annotations. Imagine being able to declare a type as being accessible to COM by simply annotating it with an attribute as the follows:

```swift
@COM(IID: IID_ICustomInterface, CLSID: CLSID_CustomInterface)
open class CCustomInterface: ICustomInterface {
  override open func QueryInterface<Interface: IUnknown>() throws -> Interface? {
    switch riid.pointee {
    case IID_ICustomInterface, IID_IUnknown:
      return Unmanaged<Self>.passRetained(self)
    default:
      return nil
    }
  }
  …
}
```

Swift macros could help alleviate some of this boilerplate, but in order to truly bridge the Swift type into COM, the object layout needs to be considered. Because COM is an ABI, how the object is represented in memory must be identical to that dictated by COM. Controlling the object layout impacts ABI and is not something that would be possible with macros alone. One way we could implement this COM attribute at the language level would be to add a tear-off entry to the object that would conform to the ABI requirements for COM as part of the Swift object layout (with an opt-in) enabling more transparent bridging to the system without having to manually re-construct the vtable.

Swift’s ongoing distributed actors work also aligns well with COM. Distributed COM (DCOM) allows for network transparency with COM objects and enables building robust distributed systems. Distributed actors do not mandate the wire format, which means that we could even re-use the standard wire protocol for DCOM (DCE/RPC). This would allow for native Swift applications on Windows to easily scale from command line applications to large scale distributed systems.


## Interoperability on Windows

Swift’s arsenal of interoperability tools makes it a potent language for building rich, native applications and libraries on existing platforms, and provides a great alternative to C and C++ with its improved memory safety and ergonomics. On Windows particularly, the interoperability features allow us to gain access to a very large set of the system's API. Best of all, since COM is used outside of the Windows ecosystem, improvements to Swift’s integration with Windows system APIs, such as the native COM bridging described above, would also help other platforms! New features such as C++ Interoperability, macros, and distributed actors are opening up a whole new set of opportunities for applications to be written in a more portable fashion.

This foray into Windows and our exploration of Swift's approach to interoperability has given us a good foundation on how Swift’s interoperability tools allow us to build cross-platform applications that can access platform APIs.
