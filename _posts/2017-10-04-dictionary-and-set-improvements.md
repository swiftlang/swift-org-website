---
layout: new-layouts/blog
published: true
date: 2017-10-04 12:00:00
title: Dictionary and Set Improvements in Swift 4.0
author: natecook1000
---

In the latest release of Swift,
dictionaries and sets gain a number of new methods and initializers
that make common tasks easier than ever.
Operations like grouping, filtering, and transforming values
can now be performed in a single step,
letting you write more expressive and efficient code.

This post explores these new transformations,
using some grocery data for a market as an example.
This custom `GroceryItem` struct,
made up of a name and a department,
will serve as the data type:

~~~swift
struct GroceryItem: Hashable {
    var name: String
    var department: Department

    enum Department {
        case bakery, produce, seafood
    }

    static func ==(lhs: GroceryItem, rhs: GroceryItem) -> Bool {
        return (lhs.name, lhs.department) == (rhs.name, rhs.department)
    }

    var hashValue: Int {
        // Combine the hash values for the name and department
        return name.hashValue << 2 | department.hashValue
    }
}

// Create some groceries for our store:
let 🍎 = GroceryItem(name: "Apples", department: .produce)
let 🍌 = GroceryItem(name: "Bananas", department: .produce)
let 🥐 = GroceryItem(name: "Croissants", department: .bakery)
let 🐟 = GroceryItem(name: "Salmon", department: .seafood)
let 🍇 = GroceryItem(name: "Grapes", department: .produce)
let 🍞 = GroceryItem(name: "Bread", department: .bakery)
let 🍤 = GroceryItem(name: "Shrimp", department: .seafood)

let groceries = [🍎, 🍌, 🥐, 🐟, 🍇, 🍞, 🍤]
~~~

The examples that follow use the `groceries` array
to build and transform dictionaries with these new tools.


## Grouping Values by a Key

<img
  alt="Grouping groceries by their department"
  src="/assets/images/dictionary-blog/grouping.png"
  srcset="/assets/images/dictionary-blog/grouping_2x.png 2x"
  class="dictionary-blog" />

A new grouping initializer makes it a snap
to build a dictionary from a sequence of values,
grouped by keys computed from those values.
We'll use this new initializer to build a dictionary of groceries
grouped by their department.

To do this in earlier versions of Swift,
you used iteration to build up a dictionary from scratch.
This required type annotations, manual iteration,
and a check to see if each key already existed in the dictionary.

~~~swift
// Swift <= 3.1
var grouped: [GroceryItem.Department: [GroceryItem]] = [:]
for item in groceries {
    if grouped[item.department] != nil {
        grouped[item.department]!.append(item)
    } else {
        grouped[item.department] = [item]
    }
}
~~~

With this update to Swift,
you can use the `Dictionary(grouping:by)` initializer to create the same dictionary
with a single line of code.
Pass a closure that returns a key for each element in your array.
In the following code, the closure returns the department for each grocery item:

~~~swift
// Swift 4.0
let groceriesByDepartment = Dictionary(grouping: groceries,
                                       by: { item in item.department })
// groceriesByDepartment[.bakery] == [🥐, 🍞]
~~~

The resulting `groceriesByDepartment` dictionary
has an entry for each department in the list of groceries.
The value for each key is an array of the groceries within that department,
in the same order as the original list.
Using `.bakery` as a key in `groceriesByDepartment` gives you the array `[🥐, 🍞]`.

## Transforming a Dictionary's Values

You can transform the values of a dictionary,
while keeping the same keys,
by using the new `mapValues(_:)` method.
This code transforms the arrays of items in `groceriesByDepartment` into their counts,
creating a lookup table for the number of items in each department:

~~~swift
let departmentCounts = groceriesByDepartment.mapValues { items in items.count }
// departmentCounts[.bakery] == 2
~~~

Because the dictionary has all the same keys,
just with different values,
it can use the same internal layout as the original dictionary
and doesn't need to recompute any hash values.
This makes calling `mapValues(_:)` faster
than rebuilding the dictionary from scratch.

## Building Dictionaries from Key-Value Pairs

<img
  alt="Building a dictionary from names and values"
  src="/assets/images/dictionary-blog/uniqueKeys.png"
  srcset="/assets/images/dictionary-blog/uniqueKeys_2x.png 2x"
  class="dictionary-blog" />

You can now create dictionaries
from sequences of key-value pairs
using two different initializers:
one for when you have unique keys,
and one for when you might have keys that repeat.

If you start with a sequence of keys and a sequence of values,
you can combine them
into a single sequence of pairs
using the `zip(_:_:)` function.
For example,
this code creates a sequence of tuples
with the name of a grocery item and the item itself:

~~~swift
let zippedNames = zip(groceries.map { $0.name }, groceries)
~~~

Each element of `zippedNames` is a `(String, GroceryItem)` tuple,
the first of which is `("Apples", 🍎)`.
Because every grocery item has a unique name,
the following code successfully creates a dictionary
that uses names as keys for grocery items:

~~~swift
var groceriesByName = Dictionary(uniqueKeysWithValues: zippedNames)
// groceriesByName["Apples"] == 🍎
// groceriesByName["Kumquats"] == nil
~~~

Use the `Dictionary(uniqueKeysWithValues:)` initializer only when you're sure
that your data has unique keys.
Any duplicated keys in the sequence will trigger a runtime error.


If your data has (or might have) repeated keys,
use the new merging initializer, `Dictionary(_:uniquingKeysWith:)`.
This initializer takes a sequence of key-value pairs
along with a closure that is called whenever a key is repeated.
The *uniquing* closure takes the first and second value
that share the same key as arguments,
and can return the existing value,
the new value,
or combine them however you decide.

For example,
the following code converts an array of `(String, String)` tuples
into a dictionary by using `Dictionary(_:uniquingKeysWith:)`.
Note that `"dog"` is the key in two of the key-value pairs.

~~~swift
let pairs = [("dog", "🐕"), ("cat", "🐱"), ("dog", "🐶"), ("bunny", "🐰")]
let petmoji = Dictionary(pairs,
                         uniquingKeysWith: { (old, new) in new })
// petmoji["cat"] == "🐱"
// petmoji["dog"] == "🐶"
~~~

When the second key-value pair with the key `"dog"` is reached,
the uniquing closure is called with the old and new values (`"🐕"` and `"🐶"`).
Because the closure always returns its second parameter,
the result has `"🐶"` as the value for the `"dog"` key.

## Selecting Certain Entries

Dictionaries now have a `filter(_:)` method that returns a dictionary,
not just an array of key-value pairs,
like in earlier versions of Swift.
Pass a closure that takes a key-value pair as its argument
and returns `true` if that pair should be in the result.

~~~swift
func isOutOfStock(_ item: GroceryItem) -> Bool {
    // Looks up `item` in inventory
}

let outOfStock = groceriesByName.filter { (_, item) in isOutOfStock(item) }
// outOfStock["Croissants"] == 🥐
// outOfStock["Apples"] == nil
~~~

This code calls an `isOutOfStock(_:)` function on each item,
keeping only the grocery items that are out of stock.

## Using Default Values

Dictionaries now have a second key-based subscript
that makes it easier to get and update values.
The following code defines a simple shopping cart,
implemented as a dictionary of items and their counts:

~~~swift
// Begin with a single banana
var cart = [🍌: 1]
~~~

Because some keys may not have corresponding values in the dictionary,
when you use a key to look up a value, the result is optional.

~~~swift
// One banana:
cart[🍌]    // Optional(1)
// But no shrimp:
cart[🍤]    // nil
~~~

Instead of using the nil coalescing operator (`??`)
to turn optional values into the actual count you need,
you can now subscript a dictionary with a key and a `default` parameter.
If the key is found,
its value is returned and the default is ignored.
If the key isn't found,
the subscript returns the default value you provided.

~~~swift
// Still one banana:
cart[🍌, default: 0]    // 1
// And zero shrimp:
cart[🍤, default: 0]    // 0
~~~

You can even modify a value through the new subscript,
simplifying the code needed to add new items to the cart.

~~~swift
for item in [🍌, 🍌, 🍞] {
    cart[item, default: 0] += 1
}
~~~

When this loop processes each banana (`🍌`),
the current value is retrieved, incremented,
and stored back into the dictionary.
When it's time to add the loaf of bread (`🍞`),
the dictionary doesn't find the key,
and instead returns the *default value* (`0`).
After that value is incremented,
the dictionary adds the new key-value pair.

At the end of the loop, `cart` is `[🍌: 3, 🍞: 1]`.

## Merging Two Dictionaries into One

In addition to easier incremental changes,
dictionaries now make it simpler to make changes in bulk,
with methods that merge one dictionary into another.

<img
  alt="Merging two carts together"
  src="/assets/images/dictionary-blog/merging.png"
  srcset="/assets/images/dictionary-blog/merging_2x.png 2x"
  class="dictionary-blog" />

To merge the contents of `cart` and another dictionary,
you can use the mutating `merge(_:uniquingKeysWith:)` method.
The uniquing closure that you pass works the same way
as in the `Dictionary(_:uniquingKeysWith:)` initializer:
It's called whenever there are two values with the same key,
and returns one, the other, or a combination of the values.

In this example,
passing the addition operator as the `uniquingKeysWith` parameter
adds together any counts for matching keys,
so the updated cart has the correct total for each item:

~~~swift
let otherCart = [🍌: 2, 🍇: 3]
cart.merge(otherCart, uniquingKeysWith: +)
// cart == [🍌: 5, 🍇: 3, 🍞: 1]
~~~

To create a new dictionary
with the merged contents instead of merging in place,
use the nonmutating `merging(_:uniquingKeysWith:)` method.

## And That's Not All…

There are a few more additions we haven't covered.
Dictionaries now have custom `keys` and `values` collections with new capabilities.
The `keys` collection maintains fast key lookup,
while the mutable `values` collection lets you modify values in place.

Like dictionaries,
sets gain a new `filter(_:)` method that returns a set of the same type,
instead of an array like in earlier versions of Swift.
And finally,
both sets and dictionaries now expose their current capacity
and add a `reserveCapacity(_:)` method.
With these additions you can see and control the size of their internal storage.

Other than the custom `keys` and `values` collections,
all these changes are available in Swift 3.2.
Even if you haven't yet switched to using Swift 4.0,
you can start taking advantage of these improvements today!

You can find more information about all these new capabilities
in the [Dictionary][] and [Set][] documentation,
or read more about the rationale behind the additions
in the Swift Evolution proposals for the
[custom `keys` and `values` collections][SE-0154] and
[other dictionary and set enhancements][SE-0165].

[Dictionary]: https://developer.apple.com/documentation/swift/dictionary
[Set]: https://developer.apple.com/documentation/swift/set
[SE-0165]: https://github.com/swiftlang/swift-evolution/blob/master/proposals/0165-dict.md
[SE-0154]: https://github.com/swiftlang/swift-evolution/blob/master/proposals/0154-dictionary-key-and-value-collections.md

<style type="text/css">
img.dictionary-blog {
    float: right;
    padding: 10px;
}
pre {
    clear: right;
}
@media only screen and (max-width: 480px) {
    img.dictionary-blog {
        float: none;
        padding: 0;
        width: 100%;
        margin: 1em 0 0;
    }
}
</style>
