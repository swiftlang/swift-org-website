Xcode 10.2 comes with a Swift Migrator tool that helps you migrate your project to Swift 5.

> For the previous release's Migration Guide, see [Migrating to Swift 4.2](/migration-guide-swift4.2).

## Pre-Migration Preparation

Make sure that the project that you intend to migrate builds successfully in Swift 4 or Swift 4.2 mode, and all its tests pass. You may need to resolve errors initially due to compiler changes.

It's highly recommended to have your project managed under source control. This will allow you to easily review the changes that were applied via the migration assistant and to discard them and re-try the migration if needed.

You decide when and if you'd like to migrate on a per-target basis when it makes sense for your project. While migrating to Swift 5 is definitely encouraged, it's not an all-or-nothing process, as Swift 4, 4.2, and 5 targets can coexist and link together.

The migration assistant does a *migrator build* to gather the changes, using the scheme you have selected, so the targets that will get processed are the ones that are included in the scheme. To review and modify what is included in the scheme, invoke the *Edit Scheme...* sheet and select the *Build* tab from the column on the left, and make sure all your targets and their unit tests are included.

> If your project depends on other open-source projects that are provided by Carthage or CocoaPods, consult the [Using Carthage/CocoaPods Projects](#using-carthagecocoapods-projects) section.

## Swift Migration Assistant

When you open your project with Xcode 10.2 for the first time, you will see a migration opportunity item in the Issue Navigator: click it to activate a sheet asking you if you'd like to migrate. You can be reminded later or invoke the Migrator manually from the menu *Edit -> Convert -> To Current Swift Syntax...*

You will be presented with a list of targets to migrate. Targets that do not contain any Swift code will not be selected.

Clicking *Next* will bring up the *Generate Preview* sheet and the assistant will initiate a *migration build* to get source changes. When this is done, you will be presented with all the changes that will be applied once you click on 'Save'. This will also change the *Swift Language Version* build setting for the migrated targets to *Swift 5*.

There may have been issues with processing the targets that will negatively impact the migration process. Switch to the *Report Navigator* and select the *Convert* entry that was added; this is the conversion build log. Check the log for errors that may have showed up.

If you see errors about not being able to code-sign the target, try disabling code-signing from the build settings of the target. If you see other errors, please [file a bug report](https://bugreport.apple.com) and include the details. You are strongly encouraged to attach a project that illustrates the faulty migration if possible.

## Swift 5 Migration Changes Overview

Swift 5 has minimal impact to code compiled with 4.2 version. Here's what you may encounter on your own code:

### Compiler

* A compiler error `add () to forward @autoclosure parameter` with a fix-it to add `()` (form a call) to correctly forward argument function originated from `@autoclosure` parameter to function parameter itself marked as `@autoclosure`. This change was the result of addressing [SR-5719](https://bugs.swift.org/browse/SR-5719).
	* The migrator applies this fix-it automatically.
* Type nullability mismatch errors due to: [SE-0230 Flatten nested optional](https://github.com/apple/swift-evolution/blob/main/proposals/0230-flatten-optional-try.md)
	* The migrator will make a local change to wrap the `try?` expression and add a cast to preserve the type as it was in the Swift 4.2 version, so the code can still compile. However this change is not ideal and defeats the purpose of the proposal which is to eliminate the need to handle the nested optionals produced from `try?` in Swift 4.2. It is recommended to remove the cast and make the necessary manual changes later in the code in the body of the function, or even in the signature of the function itself, if necessary. Such changes are too intrusive for the migrator to perform automatically.
* Compiler warnings `switch must be exhaustive`, due to [SE-0192](https://github.com/apple/swift-evolution/blob/main/proposals/0192-non-exhaustive-enums.md).
	* n Swift 5 mode, switches over enums, declared in Objective-C or coming from system frameworks, are required to handle “unknown cases”, i.e. cases that might be added in the future, or that may be defined “privately” in an Objective-C implementation file. (Formally, Objective-C allows storing any value in an enum as long as it fits in the underlying type.) These “unknown cases” can be handled by using the new `@unknown` defaultcase, which still provides warnings if any known cases are omitted from the switch. They can also be handled using a normal default.
	* If you’ve defined your own enum in Objective-C and you don’t need clients to handle unknown cases, you can use the `NS_CLOSED_ENUM` macro instead of `NS_ENUM`. The Swift compiler will recognize this and not require switches to have a default case.
	* In Swift 4 and 4.2 modes, `@unknown` default may still be used. If it is omitted and an unknown value is passed into the switch, the program will trap at run time (the same behavior as with Xcode 10.1).

### Swift Standard Library

* Compiler warnings `'index(of:)' is deprecated: renamed to 'firstIndex(of:)'` and `'index(where:)' is deprecated: renamed to 'firstIndex(where:)`
	* The migrator performs the necessary changes.

### SDK

The source compatibility changes for the SDK between 4.2 and 5 modes are minimal and they were necessary to improve the correctness of the APIs.

* A few APIs from AppKit changed their types to return `Any` or `AnyObject` instead of `NSBindingSelectionMarker`.
* AVFoundation, CloudKit, and GameKit have a few properties whose return type became nullable
	* The migrator will add `!` to references of such properties to preserve existing behavior as it was in the Swift 4.2 version and keep the code compiling.

### Migrating from Swift 4

If you are migrating from Swift 4 code, also see the migration changes overview from last year's migrator from [Migrating to Swift 4.2](/migration-guide-swift4.2/#swift-42-migration-changes-overview).

## After Migration

While the migrator will take care of many mechanical changes for you, it is possible that you may need to make more manual changes to be able to build the project after applying the migrator changes.

Even if it compiles fine, the code that the migrator provided may not be ideal. Use your best judgement and check that the changes are appropriate for your project.

## Using Carthage/CocoaPods Projects

Here are some important points to consider when migrating a project with external dependencies using package managers like the Swift Package Manager, Carthage or CocoaPods.

* It is recommended to use source dependencies rather than binary Swift modules, because modules generated by different Xcode versions are not compatible with each other. Or make sure to get distributions that were built using Xcode 10.2.
* Make sure your source dependencies build successfully in Swift 4/4.2 mode as well as your own targets.
* If you have setup framework search paths for finding the binary Swift modules inside Carthage's build folder, either remove the search paths or clean the build folder, so that you are sure that you are only using the Swift modules that are built from your Xcode workspace.
* It is not necessary to migrate your source dependencies as long as they can build in Swift 4/4.2 mode.

## Miscellaneous

* If you have multiple schemes in your project that cover different targets, you will only get notified that you need to migrate one of them.  You will need to manually select the new scheme, then run *Edit -> Convert -> To Current Swift Syntax* to migrate the remaining schemes. Or you can create a scheme that includes all the targets from your project, and have it selected before running the migration assistant.
