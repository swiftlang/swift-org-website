---
layout: new-layouts/blog
published: true
date: 2023-09-28 11:00:00
title: Debugging Improvements in Swift 5.9
author: [adrian-prantl, augustonoronha, kastiglione]
---


Swift 5.9 introduced a number of new debugging features to the compiler and [LLDB](https://lldb.llvm.org/ "LLDB project home page") debugger.

Here are three changes that can help with your everyday debugging workflows.


### Faster variable inspection with `p` and `po`

LLDB provides the shorthand `p` command alias to inspect variables and `po` to call the debugDescription property of objects. Originally, these were aliases for the rather heavyweight `expression` and `expression -O` commands. In Swift 5.9, the `p` and `po` command aliases have been redefined to the new [`dwim-print` command](https://reviews.llvm.org/D138315 "LLVM review").

The `dwim-print` command prints values using the most user-friendly implementation. "DWIM" is an acronym for "Do What I Mean". Specifically, when printing variables, `dwim-print` will use the same implementation as `frame variable` or `v` instead of the more expensive expression evaluator.

In addition to being faster, using `p` [no longer creates persistent result variables](https://reviews.llvm.org/D145609 "LLVM review") like `$R0`, which are often unused in debugging sessions. Persistent result variables not only incur overhead but also retain any objects they contain, which can be an unexpected side effect for the program execution.

Users who want persistent results on occasion can use `expression` (or a unique prefix such as `expr`) directly instead of `p`. If you wish to enable persistent results every time, you can take advantage of LLDB's handy alias feature and put the following into the `~/.lldbinit` file:

```
command unalias p
command alias p dwim-print --persistent-result on --
```

The `dwim-print` command also gives `po` new functionality. The `po` command can now print Swift objects *even when only given a raw address*. When running `po <object-address>`, LLDB's embedded Swift compiler will automatically evaluate the expression `unsafeBitCast(<object-address>, to: AnyObject.self)` under the hood to produce the expected result.

Before Swift 5.9:
```
(lldb) po 0x00006000025c43d0
(Int) 105553155867600
```

With Swift 5.9:
```
(lldb) po 0x00006000025c43d0
<MyApp.AppDelegate: 0x6000025c43d0>
```

### Support for generic type parameters in expressions

LLDB now supports referring to generic type parameters in expression evaluation. For example, given the following code:

```swift
func use<T>(_ t: T) {
    print(t) // break here
}

use(5)
use("Hello!")
```

Running `po T.self`, when stopped in `use`, will print `Int` when coming in through the first call, and `String` in the second.

In addition to displaying the concrete type of the generic, you can use this to set conditions that look for concrete types. For example, if you add the condition `T.self == String.self` to the above breakpoint, `use` will only stop when the variable `t` is a `String`. (Note this last example only works on nightly builds of the Swift 5.9 toolchain.)

More details about the implementation of this feature can be found in the original [LLDB pull request](https://github.com/swiftlang/llvm-project/pull/5715).

### Fine-grained scope information

The Swift compiler now emits more precise lexical scopes in debug information, allowing the debugger to better distinguish between different variables, like the many variables named `x` in the following example:

```swift
func f(x: AnyObject?) {
  // function parameter `x: AnyObject?`
  guard let x else {}
  // local variable `x: AnyObject`, which shadows the function argument `x`
  ...
}
```

In Swift 5.9, the compiler now uses more accurate `ASTScope` information to generate the lexical scope hierarchy in the debug information, which results in some behavior changes in the debugger.

In the example below, the local variable `a` is not yet in scope at the call site of `getInt()` and will only be available after it has been assigned. With the debug information produced by previous versions of the Swift compiler, the debugger might have displayed uninitialized memory as the contents of `a` at the call site of `getInt()`. In Swift 5.9, the variable `a` only becomes visible after it has been initialized:

```
  1 func getInt() -> Int { return 42 }
  2
  3 func f() {
  4     let a = getInt()
                ^
  5     print(a)
  6 }

(lldb) p a
error: <EXPR>:3:1: error: cannot find 'a' in scope

(lldb) n
  3 func f() {
  4     let a = getInt()
  5     print(a)
        ^
  6 }

(lldb) p a
42
```

<!---
In fact, the Swift language's scoping rules allow some astonishing things to be done with variable bindings:

```swift
enum E<T> {
case A(T)
case B(T)
case C(String)
case D(T, T, T)
}

func f<T>(_ e: E<T>) -> String {
  switch e {
  case .A(let a), .B(let a): return "One variable \(a): T in scope"
  case .C(let a):            return "One variable \(a): String in scope"
  case .D(let a, _, let c):  return "One \(a): T and one \(c): T in scope"
  default:                   return "Only the function argument e is in scope"
  }
}
```

All of these can be correctly disambiguated by LLDB thanks to lexical scope debug information.
--->

For more details, see the [pull request](https://github.com/apple/swift/pull/64941) that introduced this change.


### Get involved

If you want to learn more about Swift debugging and LLDB, provide feedback, or contribute to the tooling itself, join us in the [LLDB section](https://forums.swift.org/c/development/lldb/13) of the Swift development forums.
