---
layout: new-layouts/blog
published: true
date: 2024-03-07 10:30:00
title: Iterate Over Parameter Packs in Swift 6.0
author: [simanerush]
---

Parameter packs, introduced in Swift 5.9, make it possible to write generics that abstract over the number of arguments. This eliminates the need to have overloaded copies of the same generic function for one argument, two arguments, three arguments, and so on.
With Swift 6.0, pack iteration makes it easier than ever to work with parameter packs.
This post will show you how to make the best use of pack iteration.

## Parameter Packs Recap

First, let's review parameter packs. Consider the following code:

```swift
let areEqual = (1, true, "hello") == (1, false, "hello")
print(areEqual)
// false
```

The above code simply compares two tuples. However, this code wouldn't work if the tuples contained 7 elements!

The Swift standard library provided comparison operators for tuples up to only 6 elements for a long time:

```swift
func == (lhs: (), rhs: ()) -> Bool

func == <A, B>(lhs: (A, B), rhs: (A, B)) -> Bool where A: Equatable, B: Equatable

func == <A, B, C>(lhs: (A, B, C), rhs: (A, B, C)) -> Bool where A: Equatable, B: Equatable, C: Equatable

// and so on, up to 6-element tuples
```
In each of the generic functions above, every element of the input tuple has to have its type declared in the generic parameter list of the function.
Thus, we need to add a new element to the generic parameter list any time we want to support a larger tuple size.
Because of this, the artificial limit of 6-element tuples was imposed.

Parameter packs added the ability to abstract a function over a variable number of type parameters.
This means that we can lift the 6-element limit using an `==` operator written like this:

```swift
func == <each Element: Equatable>(lhs: (repeat each Element), rhs: (repeat each Element)) -> Bool
```

Let's break down the types we see in the above signature:

- Note `each Element` in the list of generic parameters. The `each` keyword indicates that `Element` is a *type parameter pack*, meaning that it can accept any number of generic arguments. Just like with non-pack (*scalar*) generic parameters, we can declare a conformance requirement on the type parameter pack. In this case, we require each `Element` type to conform to the `Equatable` protocol.
- This function takes in two tuples, `lhs` and `rhs`, as arguments. In both cases, the tuple's element type is `repeat each Element`. This is called the *pack expansion type*, which consists of a `repeat` keyword followed by a *repetition pattern*, which has to contain a pack reference. In our case, the repetition pattern is `each Element`.
- At the call site, the user provides *value parameter packs* for each tuple that will be substituted into their corresponding type parameter packs. At runtime, the repetition pattern will be repeated for each element in the substituted pack.

With the tuple equality operator implemented using parameter packs, let's look at the call site again to understand these concepts better.

```swift
let areEqual = (1, true, "hello") == (1, false, "hello")
print(areEqual)
// false
```

The call to `==` substitutes the type pack `{Int, Bool, String}` for the `Element` type pack. Note that both `lhs` and `rhs` have the same type.
Finally, the function `==` is called with value packs `{1, true, "hello"}` for the value pack of the `lhs` tuple and `{1, false, "hello"}` for the value pack of the `rhs` tuple.

## Why Pack Iteration?

The example with the new signature of the tuple comparison operator looks great, but how do we actually use the values of the `lhs` and `rhs` tuples inside the body of the function?
Feel free to take a moment to think about this.

It turns out that there is just no concise way of implementing the function prior to Swift 6.0.
One solution involves creating a local function that compares a pair of elements from the two tuples, and then using pack expansion to call that function for every pair of elements, like this:

```swift
struct NotEqual: Error {}

func == <each Element: Equatable>(lhs: (repeat each Element), rhs: (repeat each Element)) -> Bool {
  // Local throwing function for operating over each element of a pack expansion.
  func isEqual<T: Equatable>(_ left: T, _ right: T) throws {
    if left == right {
      return
    }

    throw NotEqual()
  }

  // Do-catch statement for returning false as soon as two tuple elements are not equal.
  do {
    repeat try isEqual(each lhs, each rhs)
  } catch {
    return false
  }

  return true
}
```

The above code doesn't look great, right? To simply check a condition for each pair of elements, we need to declare a local function `isEqual`, that just compares the given elements.
However, this is not enough to make the function return early since the local `isEqual` function will still be called on every pair of elements in the parameter packs `lhs` and `rhs` when expanding them.
Because of this, `isEqual` has to be marked `throws` and throw an error once a pair of mismatched elements is found.
Then, we catch the error in a `catch` block to return `false`.

## Introducing Pack Iteration

Swift 6.0 greatly simplifies this task with the introduction of pack iteration using the familiar `for`-`in` loop syntax.

More specifically, with pack iteration, the body of the `==` tuple comparison operator simplifies down to a simple `for`-`in repeat` loop:

```swift
func == <each Element: Equatable>(lhs: (repeat each Element), rhs: (repeat each Element)) -> Bool {

  for (left, right) in repeat (each lhs, each rhs) {
    guard left == right else { return false }
  }
  return true
}
```

In the above code, we are able to utilize the `for`-`in` loop capability to iterate over the tuples pairwise.

Note that when iterating over packs, we use the new `for`-`in repeat` syntax, followed by a value parameter pack that we are iterating over.
At every iteration, the loop binds each element of the value parameter pack to a local variable.
This means that in this case, the i<sup>th</sup> element of `lhs` will be bound to a local variable `left` on the i<sup>th</sup> iteration.
In the body of the loop, you can use the local variable as you normally would.
In our case, we compare each pair of elements and return `false` once we find a pair where `left != right`, using a familiar `guard` statement.
And, of course, we no longer need to throw any errors as we had to before!

## Using Pack Iteration
Let's now explore more ways you can utilize pack iteration in your Swift code with some examples.

First, consider a situation where you need to write a function to check that all arrays in a given value parameter pack are empty:

```swift
func allEmpty<each T>(_ array: repeat [each T]) -> Bool {
  for a in repeat each array {
    guard a.isEmpty else { return false }
  }

  return true
}
```

The above function is generic over a type parameter pack `each T` and takes in a value parameter pack `array`, the type of which is declared using `repeat [each T]` pack expansion, where `[each T]` is the repetition pattern.
At the call site, it is repeated for each element in the substituted pack, resulting in values expanding into a list of array literals.

On each iteration of the `for`-`in repeat` loop, an element of the value parameter pack `array` is bound to a local variable `a`.
Note that with pack iteration, elements of the value pack are evaluated on demand, meaning that we are able to return out of the function early without examining all arrays of the value pack.
In this case, we utilize the `guard` statement.

Here is how you might use the `allEmpty` function:

```swift
print(allEmpty(["One", "Two"], [1], [true, false], []))
// False
```

Now, let's see an example of advanced usage of parameter packs that is greatly simplified by pack iteration.
First, let's declare the following protocol:

```swift
protocol ValueProducer {
  associatedtype Value: Codable
  func evaluate() -> Value
}
```

The above protocol `ValueProducer` requires the `evaluate()` method that's return type is the associated type `Value` that conforms to `Codable` protocol.

Suppose you get a parameter pack of values of type `Result<ValueProducer, Error>`, and you need to iterate only over the `success` elements and call the `evaluate()` method on its value.
Also, suppose you need to save the result of each call into an array.
Pack iteration makes this task super easy!

```swift
func evaluateAll<each V: ValueProducer, each E: Error>(result: repeat Result<each V, each E>) -> [any Codable] {
  var evaluated: [any Codable] = []
  for case .success(let valueProducer) in repeat each result {
    evaluated.append(valueProducer.evaluate())
  }

  return evaluated
}
```

Let's first note the signature of the `evaluateAll` function. In the generic parameter list, it declares two type parameter packs: `each V: ValueProducer`, and `each E: Error`.
Every element of the pack `each V`  has to conform to the protocol `ValueProducer` declared above, and every element of the pack `each E` has to conform to the `Error` protocol.
The function takes in a single argument `result` with a pack expansion type `repeat Result<each V, each E>`.
This means that the pattern `Result<each V, each E>` will be repeated for every element of packs `each V` and `each E` at runtime.

To implement the body of the function, we first initialize the `evaluated` array.
Next, note how we can use the `for case` pattern to execute the loop's body only for the `success` case of the `Result` enum.
We can grab the `valueProducer` variable, which will contain a value of the `ValueProducer` type.
We can now append the result of the call to the `evaluate()` method to our `evaluated` array, which we finally return.

Here's how you might use this function:

```swift
struct IntProducer: ValueProducer {

  let contained: Int

  init(_ contained: Int) {
    self.contained = contained
  }

  func evaluate() -> Int {
    return self.contained
  }
}

struct BoolProducer: ValueProducer {

  let contained: Bool

  init(_ contained: Bool) {
    self.contained = contained
  }

  func evaluate() -> Bool {
    return self.contained
  }
}

struct SomeError: Error {}

print(evaluateAll(result:
                    Result<SomeValueProducer, SomeError>.success(SomeValueProducer(5)),
                    Result<SomeValueProducer, SomeError>.failure(SomeError()),
                    Result<BoolProducer, SomeError>.success(BoolProducer(true))))

// [5, true]
```

## Summary

We are excited to bring pack iteration to Swift 6.0!
As seen in this article, pack iteration makes interacting with value parameter packs significantly more straightforward, making such an advanced feature more accessible and intuitive to incorporate into your Swift code.
