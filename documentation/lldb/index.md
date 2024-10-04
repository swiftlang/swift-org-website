---
redirect_from: "/lldb/"
layout: new-layouts/base
title: REPL and Debugger
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

{% include_relative _playground-support.md %}

[coding_conventions]: https://llvm.org/docs/CodingStandards.html
[llvm-bugs]: https://bugs.llvm.org/ "LLVM Bug Tracker"
