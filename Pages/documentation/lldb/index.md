---
template: page
title: REPL and Debugger
redirect_from: /lldb/
---

The Swift.org community makes use of the
[LLDB debugger](https://github.com/swiftlang/llvm-project/tree/next/lldb) to provide a
rich REPL as well as the debugging environment for the Swift Language.
Swift is tightly coupled to the version of the  Swift compiler embedded in the
debugger.  Tight integration of compiler and debugger enables accurate
inspection of Swift types as well as full-featured expression
evaluation in the context of a rapidly evolving language.

However, because of this tight integration, developers *must* use a
matched pair of compiler and debugger built using the same sources.
Debugging using any other version of LLDB can lead to unpredictable
results.

### Why Combine the REPL and Debugger?

Several motivating factors contributed to the decision to use the
Swift debugger as a foundation for the Swift REPL.

* **Integrated debugging.** The most obvious benefit is that the Swift
  REPL is also a full-featured debugger. It's trivial to declare a
  function, set a breakpoint in it, and then call it.  When execution
  stops at a breakpoint the full feature set of the debugger is
  immediately available.

  ~~~ text
    1> func answer() -> Int {
    2.     return 42
    3. }
    4> :b 2
    4> answer()
  Execution stopped at breakpoint.  Enter LLDB commands to investigate (type help for assistance.)
     1   	  func answer() -> Int {
  -> 2   	      return 42
     3   	  }
  ~~~

* **Recovering from failure.** Fatal errors in Swift normally result in
  immediate termination of a process, which makes sense for programmer
  errors in production code but are undesirable in an interactive
  context. The Swift REPL supports investigating failures with the full
  debugger or unwinding for immediate recovery.

  ~~~ text
    1> ["One", "Two"][2]
  fatal error: Array index out of range
  Execution interrupted. Enter Swift code to recover and continue.
  Enter LLDB commands to investigate (type :help for assistance.)
  ~~~

* **Robust expression evaluation.** Supporting the full range of REPL
  scenarios in the debugger set a high bar for the expression
  evaluator.  As a result, expressions in the debugger have access to
  the full range of language features in Swift and can freely declare
  any valid language construct.

* **Consistent result formatting.** The strategy used for textually
  representing values in the REPL is shared by the debugger, ensuring
  consistent output even for user-defined types.

## Xcode Playground Support

Swift developers can approach the language in many different ways. In
addition to the traditional command-line compiler and interactive REPL
one of the earliest experiences for many developers was through the
introduction of playgrounds in Xcode. Prior to Swift 3.0 and Xcode 8
this was only possible with the version of Swift included with Xcode.
The Xcode Playground Support project enables building a Swift toolchain
that includes everything necessary to integrate with the Xcode 8
playground experience. Playground Support will be included in
corresponding snapshots. Download a snapshot, install it, and select the
toolchain to work with the latest Swift features in Xcode playgrounds.

The project builds two frameworks:

* **PlaygroundSupport.** This framework defines API that may be
explicitly referred to by playground code to communicate with Xcode. For
example: this is typical for playgrounds that identify a particular
view to display live for animation or interaction, and when playgrounds
automatically move between pages when defined criteria are met.

* **PlaygroundLogger.** This project is used implicitly to record values
of interest on a line-by-line basis and communicate them to Xcode. Calls
are automatically injected into playground code so no explicit reference
is required.


[coding_conventions]: https://llvm.org/docs/CodingStandards.html
[llvm-bugs]: https://bugs.llvm.org/ "LLVM Bug Tracker"
