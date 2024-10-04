---
layout: new-layouts/base
date: 2023-04-29 12:00:00
title: Value And Reference Types In Swift
author: [jamesdempsey]
---

Types in Swift are grouped in two categories: _value types_ and _reference types_. Each behave differently and understanding the difference is an important part of understanding Swift.

If you are new to programming or coming to Swift from another language, these concepts may be new to you.

Before looking at some code, here are two variations of the same scenario that illustrate the basic differences between how value types and reference types behave.

Imagine you are working on a document, maybe a report or a spreadsheet, and you want a friend to take a look at it. There are two common ways you might share this document with your friend:

1. You could email your friend a copy of the document.

2. If the document was in something like Google Docs or Pages for iCloud, you could email your friend a link to the document.

In both cases, your friend is able to read and make changes to your document, but there are significant differences.

When you send your friend a copy, your friend has a completely separate copy of the document. They can edit the document as much as they want, but it doesn’t affect your copy at all.

When you send your friend a link, you’re not sending the actual document. You’re sending them a URL that points to the document in the cloud. Since you both have a link to the same document, whatever changes you or your friend make will be seen by both of you.

The difference in behavior between sharing a copy of a document or sharing a link to a shared document is very much like the difference in behavior between value types and reference types.

### Value Types
In Swift, structures, enumerations, and tuples are all value types. They behave similar to sending your friend a copy of a document.

Assigning a value to a constant or variable, or passing a value into a function or method, always makes a copy of the value.

In the code below, a `struct` of type `Document` is declared with one property `text`.

A `Document` instance is created and assigned to myDoc.

When `myDoc` is assigned to the variable `friendDoc`, the original instance is copied to a new instance.

Since it is an independent instance, changing the `text` of `friendDoc` does not affect the `text` of `myDoc`.

```swift
struct Document {
  var text: String
}

var myDoc = Document(text: "Great new article")
var friendDoc = myDoc

friendDoc.text = "Blah blah blah"

print(friendDoc.text) // prints "Blah blah blah"
print(myDoc.text) // prints "Great new article"
```

When you send your friend a copy of a document, you are in complete control of when *your* copy changes. You never have to worry about your friend making some unexpected change to your copy of the document.

Similarly, with a value type, you never have to worry about some other part of your program changing the value.

### Reference Types
In Swift, classes, actors, and closures are all reference types. They behave similar to sending your friend a link to a shared document.

Assigning a reference type to a constant or variable, or passing it into a function or method, it is always a reference to a shared instance that is assigned or passed in.

The code below is identical to the example above with one small but important change. Instead of declaring a `struct` the `Document` type is now declared as a `class`.

It is a small code change, but with a significant change in behavior.

Like before a `Document` instance is created and assigned to `myDoc`.

But now, when `myDoc` is assigned to the variable friendDoc, it is a reference to the instance that is assigned.

Since it is a reference to the same instance, changing the `text` of `friendDoc` updates that shared instance including the value of `myDoc`.

```swift
class Document {
  var text: String
}

var myDoc = Document(text: "Great new article")
var friendDoc = myDoc

friendDoc.text = "Blah blah blah"

print(friendDoc.text) // prints "Blah blah blah"
print(myDoc.text) // prints "Blah blah blah"
```

When you send your friend a link to a shared document, your friend can make changes to the document without you knowing about it. You might be relying on your document staying the same.

Similarly, with a reference type, any part of your program that has a reference can make a change. Sometimes unexpected changes can lead to bugs.

### Local reasoning
In the small code example above, you can read through the code line by line and see how the same reference is assigned to two different variables and how changing a property using one variables updates the instance referred to by both variables.

Being able to look through code in a single spot and figure out what is going on is called _local reasoning_.

Now imagine a larger program where different pieces of the program all have a reference to the same thing. Your code may set a value in place and rely on that value but then somewhere else, an unrelated part of your program could change the value out from under you.

The formal name for having data that can be changed from multiple places is _shared mutable state_. Shared because it can be accessed from many places in the code, mutable because it can change a.k.a. mutate, and state as a synonym for data, as in ‘the current state of things’.

In this case, you can’t fully understand what is going on in one part of your code without understanding what might be happening at many different places in your code. You lose the ability to do local reasoning, which makes your code harder to understand and harder to debug.

One advantage of using value types is that you can be certain no other place in your program can affect the value. You can reason about the code in front of you without needing to know what else is happening elsewhere.

This makes your code easier to understand and prevents bugs from accidental or unexpected changes to shared mutable state.

### Choosing Value or Reference Types
Going back to the example of sharing a document, it can be very useful for both you and your friend to be able to see and edit the same document.

Similarly, in a program, sometimes the shared mutable state that reference types provide can be very useful. Reference types aren’t inherently bad, but as described above, they do add additional complexity and possibility for error.

In general, prefer to use structs over classes. If you don’t need the behavior of a reference type, there’s no need to take on the added complexity and pitfalls.

The article [Choosing Between Structures and Classes](https://developer.apple.com/documentation/swift/choosing-between-structures-and-classes) describes the tradeoffs in more detail.


### Composing Value Types
A common design pattern in code is _composition_ which is combining smaller elements together to create larger elements.

In Swift, you can easily compose value types together to create more complex value types.

So you could define a struct that contains some basic types like a String, an Int, a Bool, maybe an enumeration value. Since everything in the struct is a value type, the struct behaves like a value type.

You might have a type that is a more complex struct that contains an instance of the first struct and some other values. Again, since it is composed of value types, this struct is a value type.

### Collections are Value Types
But in Swift, composing value types doesn’t stop with structures and enumerations.

Although in many languages, collections such as arrays and dictionaries are reference types, in Swift the standard collections `Array`, `Dictionary` and `String` are all value types.

This means a struct can contain an array of structs, maybe a dictionary of key value pairs, a set of enums. As long as everything is composed of value types, an instance of even a complex type is treated as a value.

### Conclusion
Understanding what value types and reference types are and the differences in how they behave is an important part of learning Swift and being able to reason about your code. The choice between the two often comes down to a choice between declaring a type as a `struct` or a `class`. You can learn more about structures and class in the [Structures and Classes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures) chapter of *The Swift Programming Language*.
