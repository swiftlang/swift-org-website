**This is a legacy document for Xcode 8 and migrating from Swift 2.**

Xcode 8.0 comes with a Swift Migrator tool that helps you migrate your project to Swift 3, or update it to work with Swift 2.3 and the new SDKs.

## Pre-Migration Preparation

To get the most effective migration, make sure that the project that you intend to migrate builds successfully, and all its tests pass, when using Xcode 7.3[.1].  
Also make sure that the project is managed under source control. This will allow you to easily review the changes that were applied via the migration assistant and to discard them and re-try the migration if needed.

If you have multiple schemes that build different independent products (or the same product for different platforms) it is important to create one scheme that builds everything in your project and for all the platforms you need, including your unit test targets. The migration assistant does a migrator "build" to gather the changes, using the scheme you have selected, so the targets that will get processed are the ones that are included in the scheme.  
To review and modify what is included in the scheme, invoke the *"Edit Scheme..."* sheet and select the *"Build"* tab from the column on the left, and make sure all your targets and their unit tests are included.

If your project depends on other open-source projects that are provided by Carthage or CocoaPods, consult the [Using Carthage/CocoaPods Projects](#using-carthagecocoapods-projects) section.

## Swift Migration Assistant 
When you open your project with Xcode 8.0 for the first time, you will be prompted via the migration assistant to do a migration pass. The assistant can also be invoked manually from the menu *Edit -> Convert -> To Current Swift Syntax...*

You can choose from two kinds of migration to perform:

- **Use Swift 2.3** Modifies your project to enable the *Use Legacy Swift* build setting and provides source changes to be able to build against the new SDKs.
- **Use Swift 3** This is recommended. You will get source changes to be able to build your project using Swift 3 and take advantage of all the new features in Xcode 8.0.

Optionally, you can move to Swift 2.3 now and invoke the migration assistant again later to update to Swift 3.

After you invoke the migration assistant and you select *"Use Swift 2.3"* or *"Use Swift 3"*, you will be presented with a list of targets to migrate. Targets that do not contain any Swift code will not be selected.

Clicking *'Next'* will bring up the *'Generate Preview'* sheet and the assistant will initiate a migration 'build' to get source changes. When this is done, you will be presented with all the changes that will be applied once you click on 'Save'.
Note that in the diff view, the original source (before conversion) is on the right and the changes are on the left. Clicking *'Save'* will apply the source changes to the original files. If you chose to move to Swift 2.3, the targets will have the *"Use Legacy Swift"* build setting set.

There may have been issues with processing the targets, that will negatively impact the migration process. Switch to the *"Report Navigator"* and select the *'Convert'* entry that was added; this is the conversion build log. Check the log for errors that may have showed up.

If you see errors about not being able to code-sign the target, try disabling code-signing from the build settings of the target.  
If you see other errors, please file a bug report at https://bugreport.apple.com and include the details.

If you need to apply any workarounds, discard the changes that you accepted from the migration assistant earlier, apply the workarounds, and invoke the assistant manually to re-try the conversion from the start.

## Swift 3 Migration Changes Overview

There have been many significant changes for Swift 3, which the migrator will help you with. You can see an overview of the Swift 3 evolution proposals here: [https://github.com/apple/swift-evolution](https://github.com/apple/swift-evolution)

Here is a brief overview of the more impactful source-breaking changes:

### API Design Guidelines

The Objective-C APIs are imported into Swift 3 according to the new [Swift API design guidelines](https://swift.org/documentation/api-design-guidelines). This affects both how the SDKs are imported and the Objective-C user frameworks. The Swift Standard Library also has many changes for adhering to the guidelines. For more details you can refer to proposal [SE-0005 - Better Translation of Objective-C APIs Into Swift](https://github.com/apple/swift-evolution/blob/main/proposals/0005-objective-c-name-translation.md).  
The migrator is lowercasing enums declared by the user, to match them with the new guidelines.

### SDK

Certain frameworks like CoreGraphics and Dispatch, and other types from Foundation, are no longer getting imported as a set of global functions and variables but as member functions and properties on the respective Swift types.
For details see proposals [SE-0044 - Import as member](https://github.com/apple/swift-evolution/blob/main/proposals/0044-import-as-member.md), [SE-0088 - Modernize libdispatch for Swift 3 naming conventions](https://github.com/apple/swift-evolution/blob/main/proposals/0088-libdispatch-for-swift3.md).

The 'NS' prefix from key Foundation types is getting removed in Swift 3, see [SE-0086 - Drop NS Prefix in Swift Foundation](https://github.com/apple/swift-evolution/blob/main/proposals/0086-drop-foundation-ns.md).

### Swift Standard Library

The Collection indexing model has changed dramatically in Swift 3, for more details see [SE-0065 - A New Model for Collections and Indices](https://github.com/apple/swift-evolution/blob/main/proposals/0065-collections-move-indices.md).
The most visible change is that indexes no longer have `successor()`, `predecessor()`, `advancedBy(_:)`, `advancedBy(_:limit:)`, or `distanceTo(_:)` methods. Instead, those operations are moved to the collection, which is now responsible for incrementing and decrementing its indices.

~~~
myIndex.successor()  =>  myCollection.index(after: myIndex)
myIndex.predecessor()  =>  myCollection.index(before: myIndex)
myIndex.advance(by: …) => myCollection.index(myIndex, offsetBy: …)
~~~

If the migrator does not know the collection responsible for the indices, it will insert an editor placeholder that you must fill with your collection.

In support of the collections changes, Range types also had some changes.  Previously `x..<y` and `x...y` produced the same type, `Range<T>`.  Now these expressions can produce one of the four types: `Range`, `CountableRange`, `ClosedRange`, `CountableClosedRange`. We split `Range` into `Range` and `ClosedRange` types to allow closed ranges that include the maximum value of the type (for example, `0...Int8.max` works now).
The plain range types and their ~Countable counterparts differ in the capabilities:

- `Range<Bound>` and `ClosedRange<Bound>` now only require `Comparable` for the bound.  This allows you to create a `Range<String>`.
- `Range` and `ClosedRange` can’t be iterated over (they are not collections anymore), since a value that is merely `Comparable` cannot be incremented.
- `CountableRange` and `CountableClosedRange` require `Strideabe` from their bound and they conform to `Collection` so that you can iterate over them.

The `..<` and `...` operators try to do the right thing and return the most capable range, so that code like `for i in 1..<10` infers a `CountableRange` and continues to work. If you have a variable that is typed as one range type, and you need to pass it to an API that accepts a different type, use the initializers on range types to convert:

~~~
var r = 0..<10 // CountableRange<Int>
Range(r) // converts to Range<Int>
~~~

### Language
- **Consistent first argument labels**  
The first argument label in functions is now considered API by default, see [SE-0046 - Establish consistent label behavior across all parameters including first labels](https://github.com/apple/swift-evolution/blob/main/proposals/0046-first-label.md).
The migrator adds underscore labels to preserve the existing APIs:

        func foo(bar: Int) => func foo(_ bar: Int)
- **Changes with handling of UnsafePointer\<T\>**  
In Swift 3, the nullability of non-object pointer types is now represented explicitly using optionals, such as `UnsafePointer<Int>?`, see [SE-0055 - Make unsafe pointer nullability explicit using Optional](https://github.com/apple/swift-evolution/blob/main/proposals/0055-optional-unsafe-pointers.md). This means that the types `UnsafePointer`, `UnsafeMutablePointer`, `AutoreleasingUnsafeMutablePointer`, `OpaquePointer`, `Selector`, and `NSZone` now represent non-nullable pointers, i.e. pointers that are never `nil`. Code working with these types may have to make several changes:

    - To set a pointer to `nil`, it must be optional. The migrator will handle some simple cases here, but in general you must decide whether your pointers should be optional just like your object references.
    - Results from C functions that return nullable pointers must be explicitly unwrapped before accessing the `pointee` property (formerly `memory`) or subscript elements. Optional chaining syntax works well here, e.g. `result?.pointee = sum`.
    - Callbacks (C functions or blocks) that take or return pointer types must match the original declaration in using or omitting `Optional`.
    - Due to compiler limitations, passing a pointer through a function that uses C variadics (such as NSLog) is not allowed. As a workaround, please use the following idiom to pass it as a pointer-sized integer value instead: `Int(bitPattern: nullablePointer)`.

- **Objective-C lightweight generic classes are now imported as generic types**  
[SE-0057 - Importing Objective-C Lightweight Generics](https://github.com/apple/swift-evolution/blob/main/proposals/0057-importing-objc-generics.md)  
Because Objective-C generics are not represented at runtime,  there are some limitations on what can be done with them in Swift:
  - If an Objective-C generic class is used in a checked `as?`, `as!`, or `is` cast, the generic parameters are not checked at runtime. The cast succeeds if the operand is an instance of the Objective-C class, regardless of parameters.

        let x = NSFoo<NSNumber>(value: NSNumber(integer: 0))
        let y: AnyObject = x
        let z = y as! NSFoo<NSString> // Succeeds

  - Swift subclasses can only inherit an Objective-C generic class if its generic parameters are fully specified.

        // Error: Can't inherit Objective-C generic class with unbound parameter T
        class SwiftFoo1<T>: NSFoo<T> { }
        // OK: Can inherit Objective-C generic class with specific parameters
        class SwiftFoo2<T>: NSFoo<NSString> { }

  - Swift can extend Objective-C generic classes, but the extensions cannot be constrained, and definitions inside the extension do not have access to the class's generic parameters.

        extension NSFoo {
          // Error: Can't access generic param T
          func foo() -> T {
            return T()
          }
        }
        
        // Error: extension can't be constrained
        extension NSFoo where T: NSString {
        }

  - Foundation container classes `NS[Mutable]Array`, `NS[Mutable]Set`, and  `NS[Mutable]Dictionary` are still imported as nongeneric classes for the time being.

- **Objective-C id is imported as as Swift Any type**  
[SE-0116 - Import Objective-C id as Swift Any type](https://github.com/apple/swift-evolution/blob/main/proposals/0116-id-as-any.md)  
Objective-C interfaces that use `id` and untyped collections will be imported into Swift as taking the `Any` type instead of `AnyObject`.

- **Changes with handling of ImplicitlyUnwrappedOptional**  
[SE-0054 - Abolish ImplicitlyUnwrappedOptional type](https://github.com/apple/swift-evolution/blob/main/proposals/0054-abolish-iuo.md)  
Variable bindings which previously had inferred type `T!` from their binding on the right-hand side will now have type `T?`. The compiler will emit an error at sites where those bound variables are used in a context that demands a non-optional type and suggest that the value be forced with the `!` operator.  
Explicitly written nested IUO types (like `[Int!]`) will have to be rewritten to use the corresponding optional type (`[Int?]`) or non-optional type (`[Int]`) depending on what's more appropriate for the context. However, most declarations with non-nested IUO type will continue to work as they did before.  
Unsugared use of the `ImplicitlyUnwrappedOptional` type will have to be replaced with the postfix `!` notation.

- **Closures are non-escaping by default**  
[SE-0103 - Make non-escaping closures the default](https://github.com/apple/swift-evolution/blob/main/proposals/0103-make-noescape-default.md)  
The default for closures was switched and they require an `@escaping` annotation if a closure argument can escape the function body.

- **UnsafeRawPointer type was introduced to enforce type safety with respect to unsafe pointer conversion.**  
[SE-0107 - UnsafeRawPointer API](https://github.com/apple/swift-evolution/blob/main/proposals/0107-unsaferawpointer.md)  
An `Unsafe[Mutable]RawPointer` type has been introduced. It replaces `Unsafe[Mutable]Pointer<Void>`. Conversion from `UnsafePointer<T>` to `UnsafePointer<U>` has been disallowed. `Unsafe[Mutable]RawPointer` provides an API for untyped memory access and an API for binding memory to a type. Binding memory allows for safe conversion between pointer types.  
For detailed instructions on how to migrate your code to the new API refer to the [UnsafeRawPointer migration guide](/migration-guide-swift3/se-0107-migrate.html).

## After Migration

While the migrator will take care of many mechanical changes for you, it is likely that you will need to make more manual changes to be able to build the project after applying the migrator changes.

You may see compiler errors that have associated fixits; while the migrator is designed to incorporate fixits that the Swift 3 compiler provides, it is a known limitation that this is not guaranteed to work 100% (particularly when you have inter-dependencies between targets) and some fixits may be missed.

Even if it compiles fine, the code that the migrator provided may not be 'ideal', for example you may see casts to 'NS' prefixed types (`url as NSRL`), that would be better if the code was restructured to use related APIs on the new `URL` value type instead.
You may also see new comments that the migrator added (`/*Migrator FIXME: ...*/`) where it provides a hint on how to convert the code better.

See [Known Migration Issues](#known-migration-issues) section, for a list of issues that you may encounter while trying to migrate your project.

## Using Carthage/CocoaPods Projects

If you are using binary Swift modules from other projects that are not built along with your project in your Xcode workspace, you can choose from one of the following migration strategies:

- **Include the source code of the project in your Xcode workspace**  
With this approach you will build and migrate the open-source project along with your own project. Use Xcode 7.3[.1] to make the necessary changes and validate that the project builds and links everything correctly. Include the other Xcode project files in your workspace and setup your scheme for building the targets that your project depends on. If you have setup framework search paths for finding the binary Swift modules inside Carthage's build folder, either remove the search paths or clean the build folder, so that you are sure that you are only using the Swift modules that are built from your Xcode workspace.

- **Wait until the upstream open-source project updates to Swift 2.3 or Swift 3**  
You can follow this workflow for migrating your project:
	- Keep your project as it is building with Xcode 7.3
	- Invoke the migration assistant and apply the source changes that are suggested for your own project only (for Swift 2.3 or Swift 3)
	- Before trying to build, modify the Carthage/CocoaPods dependency file and specify the specific tag/branch of the project that is migrated to Swift 2.3 or Swift 3; update your dependencies and try to build your project with the updated dependencies and the source changes that you got from the migrator.


## Known Migration Issues

### Swift Standard Library

- The migrator may fail to migrate uses of the indexing methods on `SetIndex` and `DictionaryIndex`.
	- Workaround: Manually migrate the indexing methods to their collection counterparts. Roughly:
		- `index.successor()` migrates to `Collection.index(after: index)`
		- `index.predecessor()` migrates to `Collection.index(before: index)`
		- `index.advancedBy(delta)` migrates to `Collection.index(index, offsetBy: delta)`
		- `index.advancedBy(delta, limit: otherIndex)` migrates to `Collection.index(index, offsetBy: delta, limitedBy: otherIndex)`
		- `index.distanceTo(otherIndex)` migrates to `Collection.distance(from: index, to: otherIndex)`
- In Swift 2.2 the `Unmanaged` type had a static method `fromOpaque(_:)` and an instance method `toOpaque()`, which converted the unmanaged reference from and to the `COpaquePointer` type. In Swift 3 these have been changed to convert from an `UnsafePointer<Void>` and to an `UnsafeMutablePointer<Void>` to match the common use of being passed as the "context pointer" for a C API. In most cases, you will be able to simply remove uses of `COpaquePointer` (now renamed to `OpaquePointer`).
- If you have any user-defined Collection types, you may see the compiler error *"‘MyCollection’ does not conform to protocol 'Collection'"*.
	- Collections are now responsible for incrementing/decrementing their indices. To make your type conform to `Collection`, implement the method `func index(after: Index) -> Index`. For a `BidirectionalCollection`, also implement `func index(before: Index) -> Index`.
	- For `RandomAccessCollection`, you should also implement `func index(_: Index, offsetBy: Int) -> Index` and `func distance(from: Index, to: Index) -> IndexDistance`.
- If you have a variable of type `Range` formed from the half-open range operator (e.g. `1..<2`) that is used as `Sequence` (e.g. in a `for-in` loop), you might see an error like **"type 'Range<Int>' does not conform to protocol 'Sequence'"**
	- The fix is to switch to `CountableRange`.
- Users may need to manually rename `Collection.Index.Distance` to `Collection.IndexDistance` (no dot)
- Users may need to manually rename the tuple element `index` to `offset` when accessing the result of `Collection.enumerated()`
- If you see an error that `Range<Index>` does not conform to protocol `Sequence` after migrating a range of indices, use the collection's `indices` property.
	- E.g. `for _ in str.startIndex..<someIndex {}` --> `for _ in str.indices[str.startIndex..<someIndex] {}`
- The initializer `Zip2Sequence(_:_:)` has been removed; use the free function `zip(_:_:)` instead.
- Using `min`/`max` inside extensions to `Collection` can cause collisions with `Collection`'s native methods; add `Swift`. before `min`/`max` to resolve the issue.
- `Selector()` should be migrated to `nil`.
- `Range<>.reversed` got removed; to simulate its functionality, users can call `<Collection>[<Range>].indices.reversed()`.
- The migrator does not rewrite generic constraints for types that don’t exist in Swift 3.&24868384
	- For example, `func foo<C: CollectionType where C.Index: BidirectionalIndexType>() {}` should migrate to `func foo<C: BidirectionalCollection>() {}` but instead it migrates to `func foo<C: Collection where C.Index: BidirectionalIndex>() {}`

### SDK

- Some protocols gained new required methods in new SDK releases. The migrator will not currently add implementations of those methods into your code.
	- Workaround: Manually add implementations for new protocol requirements.
- In Swift 3, many of Foundation's "stringly-typed" APIs have been changed to use struct "wrapper types", such as the new `Notification.Name` type. Since, it's common for notification names and other string constants to be declared globally or as static members, the best way to take advantage of these new types is usually to construct the wrapper at the point of declaration:

~~~
static let MyGreatNotification = Notification.Name("MyGreatNotification")

// Use site (no change)
NotificationCenter.default().post(name: MyController.MyGreatNotification, object: self)'
~~~

- `FileAttributeKey` is another of the "stringly-typed" APIs that have been changed to use struct "wrapper types". When such types are used with dictionaries (such as the result of `FileManager`'s `attributesOfItem(atPath:)` method), the string value will usually need to be extracted with the `rawValue` property.
	- `let mtime = try FileManager.default().attributesOfItem(atPath: "/")[FileAttributeKey.size.rawValue] as? NSNumber`
- The migrator will convert most uses of `NSURL` to the new value type `URL`. However, there are certain methods on `NSURL`, like `checkResourceIsReachableAndReturnError`, that produce errors through an out-parameter instead of using Swift's error-handling mechanism. The corresponding method on `URL`, `checkResourceIsReachable`, uses the error-handling mechanism as expected.&26613405
	- The Swift 3 migrator is conservative and will continue using the `NSURL` methods; you will need to manually update your code if you want to use the new APIs on the `URL` value type. For the common pattern of treating an error as unreachable, you can use `try?`: `let isReachable = (try? resourceURL.checkResourceIsReachable()) ?? false)`
    	- (Note that for this particular API it's recommended you switch to URL's `resourceValues(forKeys:)`, which handles the casting for you.)
	- The `port` property on `NSURL` produces an optional `NSNumber`, while the  corresponding property on `URL` is an optional `Int`. The Swift 3 migrator is conservative and will continue using the `NSURL` property; you will need to manually update your code if you want to use the new API.
- The migrator will convert most uses of `NSData` to the new value type `Data`. However, there are certain methods on `NSData` that operate on `UnsafeMutablePointer<Void>`, while the corresponding methods on `Data` use `UnsafeMutablePointer<UInt8>`. (For example, `NSData.getBytes(_:length:)` is more accepting than `Data.copyBytes(_:length:)`.) As a reminder, the in-memory layout of Swift types is not guaranteed.
	- The migrator is conservative and will continue using the `NSData` methods; you will need to manually update your code if you want to use the new APIs.
	- `NSData(contentsOfMappedFile: x)` can be changed to `Data(contentsOf: x, options: .mappedAlways)`
	- `NSData(data: x)` can be changed to `x`
- The migrator is conservative but there are some uses of `NSDate` that have better representations in Swift 3:
	- `(x as NSDate).earlierDate(y)` can be changed to `x < y ? x : y`
	- `(x as NSDate).laterDate(y)` can be changed to `x < y ? y : x`
- The migrator will not add cases to switch statements that have gained cases in newer SDKs.
	- Workaround: Add the cases manually to switch statements, adding the appropriate availability checks.
- *error: downcast from* `CALayer?` *to* `CALayer` *only unwraps optionals; did you mean to use '!'?*
	- Remove `as! CALayer` and replace with `!`
- The migrator will migrate global constants to namespaces enum cases, but may not add the appropriate `.rawValue` call when passed into functions that accept the raw value instead of the new enum type.
- Some types are now generic (e.g. `NSCache` -> `Cache<Key,Value>`, `NSMapTable` -> `MapTable<Key,Value>`).  After migrating to Swift 3 you may need to add appropriate generic parameters for them.
- If you implement an optional Objective-C protocol requirement in a subclass of a class that declares conformance, you'll see a warning, *"Instance method '...' nearly matches optional requirement '...' of protocol '...'"*
	- Workaround: Add an `@objc(objectiveC:name:)` attribute before the implementation of the optional requirement with the original Objective-C selector inside.
- Using literals as an option may now require invoking the corresponding constructor of that option, e.g.  `NSWindowStyleMask(rawValue: 8345)`.
- The migrator does not modify uses of `NSMutable*` types that have value type equivalents (e.g. `NSMutableData` -> `Data`, `NSMutableURLSession` -> `URLSession`), but most SDK functions now expect the new value types.
	- Change these to their value type equivalents, being careful to account for the change from reference to value semantics.  For a quick workaround, you can cast them at the point they are used (e.g. `as Data`), but this may cause additional copies.
- After migration to Swift 3, you may see an error like *"Extension of a generic Objective-C class cannot access the class's generic parameters at runtime"*.
	- When trying to use methods from a generic Objective-C class that have generic parameters in their signature, from inside an extension.  You can avoid this by calling the API through a variable that erases the specific type of `self` e.g.: `let typeErasedSelf = self as! MyObjCType<AnyObject>`
- When migrating functions like `Pasteboard.￼readObjects(forClasses:options:`), the migrator may aggressively rename the first argument, e.g. `NSURL.self` to `URL.self`, this causes compiler errors; to solve the issue, users can discard the migrator’s changes.
- The migrator will not change the deallocator type when migrating `NSData(bytes:length:deallocator:)`.
	- Workaround: Change the type from `(UnsafeMutablePointer<Void>, Int) -> Void` to `(UnsafeMutablePointer<Int8>, Int) -> Void`
- Certain methods have been marked unavailable for watchOS, but are still required for iOS.  If you get errors that you cannot override these unavailable methods, please enclose them in and `#if os(iOS)` block.
- Users may need to manually migrate calls to `String(contentsOfURL:usedEncoding:)` to `String(contentsOf:usedEncoding:)` which now accepts an `inout String.Encoding` instead of an `UnsafeMutablePointer` for the `usedEncoding` argument.
- After migrator’s automatic changes, some values’ types may change from `NSURL` to `URL`, leading to compiler errors of unavailable members. To solve this issue, users may need to manually add cast, in the `URL` example, something like `x as NSURL`.
- Users may want to manually simplify option sets by using inferred types, e.g. changing from `DispatchQueue.global(attributes: DispatchQueue.GlobalAttributes.qosDefault)` to `DispatchQueue.global(attributes: .qosDefault)`.
- **Dispatch**
	- The free function `dispatch_once` is no longer available in Swift.  In Swift, you can use lazily initialized globals or static properties and get the same thread-safety and called-once guarantees as `dispatch_once` provided.
	Example:

            let myGlobal = { … global contains initialization in a call to a closure … }()
            _ = myGlobal  // using myGlobal will invoke the initialization code only the first time it is used.
	- There are now specific protocols for each of the `DispatchSource` types.  You should change `dispatch_source_t` to one of these specific protocols, such as `DispatchSourceTimer`, `DispatchSourceProcess`, etc. as appropriate.
	- The Dispatch queue APIs now use the `DispatchAttributes` `OptionSet`.  If you previously used `dispatch_queue_attr_make_with_qos_class(DISPATCH_QUEUE_SERIAL, QOS_CLASS_DEFAULT, 0))`, you should now use use the option set, as in `DispatchQueue(label: name, attributes: [.serial, .qosDefault])`
	- `dispatch_get_specific` no longer takes an `UnsafeMutablePointer<Void>`, and it does not add the required argument label.
		- Workaround: Replace your `UnsafeMutablePointer<Void>` keys with `DispatchSpecificKey<T>` , and add the missing `key:` label.

###  Swift 3 Language
- The migrator may not fully migrate closures that take `ImplicitlyUnwrappedOptional`s.
	- Workaround: Promote them to use regular optionals.
- The migrator may incorrectly insert `?` after values of implicitly unwrapped optional type where `!` would be more appropriate.  This can allow a nil value to be silently propagated instead of deterministically trapping.
	- Workaround: Use `!` instead of `?` in these cases when you desire nil values to trap.
- The migrator will not migrate `if let` statements which no longer return optional.
	- Workaround: Remove the statement from the `if let` statement. If you need to keep a lexical scope, bring the binding inside a `do` statement.
- The migrator does not add leading dots to enum cases. This can cause conflicts when the migrator lowercases them.
	- Workaround: Manually add leading dots to enum cases that don't already have them.
- Properties whose name conflicts with Foundation types after removing their NS prefix will lead to module-qualified type names. For example, if there is a `var URL: NSURL`, it will be rewritten as `var URL: Foundation.URL`
	- Workaround: Rename these properties before migration, so they don't conflict. The Swift API guidelines suggest they should be lowercased.
- Enums whose raw types are String may require manual renaming to follow the new Swift naming guideline.
- The migrator may add unnecessary Swift module qualifications to SequenceType conformances, e.g. `struct MySequence: SequenceType` => `struct MySequence: Swift.Sequence`.
	- Workaround: Remove the leading `Swift.`

### Miscellaneous
- If you have multiple schemes in your project that cover different targets, you will only get notified that you need to migrate one of them.  You will need to manually select the new scheme, then run *Edit -> Convert -> To Current Swift Syntax* to migrate the remaining schemes. Or you can create a scheme that includes all the targets from your project, and have it selected before running the migration assistant.
