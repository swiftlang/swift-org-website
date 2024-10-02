---
layout: new-layouts/blog
date: 2018-09-26 10:00:00
title: How Mirror Works
author: mikeash
---

Swift places a lot of emphasis on static typing, but it also supports rich metadata about types, which allows code to inspect and manipulate arbitrary values at runtime. This is exposed to Swift programmers through the `Mirror` API. One might wonder, how does something like `Mirror` work in a language with so much emphasis on static types? Let's take a look!


## Disclaimer

Everything here is an internal implementation detail. The code is current as of this writing, but may change. The metadata will become a fixed, reliable format when ABI stability hits, but at the moment that is still subject to change. If you're writing normal Swift code, don't rely on any of this. If you're writing code that wants to do more sophisticated reflection than what `Mirror` provides, this will give you a starting point, but you'll need to keep it up to date with changes until ABI stability. If you want to work on the `Mirror` code itself, this should give you a good idea of how it all fits together, but keep in mind that things may change.


## Interface

The `Mirror(reflecting:)` initializer accepts an arbitrary value. The resulting `Mirror` instance then provides information about that value, primarily the children it contains. A child consists of a value and an optional label. You can then use `Mirror` on the child values to traverse an entire object graph without knowing any of the types at compile time.

`Mirror` allows types to provide a custom representation by conforming to the `CustomReflectable` protocol. This is useful for types which want to present something nicer than what they would get from introspection. For example, `Array` conforms to `CustomReflectable` and exposes the elements of the array as unlabeled children. `Dictionary` uses it to expose its key/value pairs as labeled children.

For all other types, `Mirror` does some magic to come up with a list of children based on the actual contents of the value. For structs and classes, it presents the stored properties as children. For tuples, it presents the tuple elements. Enums present the enum case and associated value, if there is one.

How does that magic work? Let's find out!


## Structure

The reflection API is partially implemented in Swift and partially in C++. Swift is more suitable for implementing a Swifty interface, and makes a lot of tasks easier. The lower levels of the Swift runtime are implemented in C++, and accessing those C++ classes directly from Swift isn't possible, so a layer of C connects the two. The Swift side is implemented in [`ReflectionMirror.swift`](https://github.com/apple/swift/blob/master/stdlib/public/core/ReflectionMirror.swift), and the C++ side is in [`ReflectionMirror.mm`](https://github.com/apple/swift/blob/master/stdlib/public/runtime/ReflectionMirror.mm).

The two pieces communicate through a small set of C++ functions that are exposed to Swift. Rather than using Swift's built in C bridging, they are declared in Swift with a directive that specifies a custom symbol name, and then a C++ function with that name is carefully crafted to be directly callable from Swift. This allows the two pieces to communicate directly without worrying about what the bridging machinery will do to the values behind the scenes, but it requires knowledge of exactly how Swift passes parameters and return values. Don't try this at home unless you're working on runtime code that needs it.

For an example of this, take a look at the `_getChildCount` function in `ReflectionMirror.swift`:

~~~swift
@_silgen_name("swift_reflectionMirror_count")
internal func _getChildCount<T>(_: T, type: Any.Type) -> Int
~~~

The `@_silgen_name` attribute informs the Swift compiler to map this function to a symbol named `swift_reflectionMirror_count`, instead of the usual Swift mangling applied to `_getChildCount`. Note that the underscore at the beginning indicates that this attribute is reserved for the Standard Library. On the C++ side, the function looks like this:

~~~swift
SWIFT_CC(swift) SWIFT_RUNTIME_STDLIB_INTERFACE
intptr_t swift_reflectionMirror_count(OpaqueValue *value,
                                      const Metadata *type,
                                      const Metadata *T) {
~~~

`SWIFT_CC(swift)` tells the compiler that this function uses the Swift calling convention rather than the C/C++ convention. `SWIFT_RUNTIME_STDLIB_INTERFACE` marks this as a function that's part of the interface to the Swift side of things, and has the effect of marking it as `extern "C"` which avoids C++ name mangling and ensures that this function will have the symbol name that the Swift side expects. The C++ parameters are carefully arranged to match how Swift will call this function based on the Swift declaration. When Swift code calls `_getChildCount`, the C++ function is invoked with `value` containing a pointer to the Swift value, `type` containing the value of the type parameter, and `T` containing the type corresponding to the generic `<T>`.

The full interface between the Swift and C++ parts of `Mirror` consists of these functions:

~~~swift
@_silgen_name("swift_reflectionMirror_normalizedType")
internal func _getNormalizedType<T>(_: T, type: Any.Type) -> Any.Type

@_silgen_name("swift_reflectionMirror_count")
internal func _getChildCount<T>(_: T, type: Any.Type) -> Int

internal typealias NameFreeFunc = @convention(c) (UnsafePointer<CChar>?) -> Void

@_silgen_name("swift_reflectionMirror_subscript")
internal func _getChild<T>(
  of: T,
  type: Any.Type,
  index: Int,
  outName: UnsafeMutablePointer<UnsafePointer<CChar>?>,
  outFreeFunc: UnsafeMutablePointer<NameFreeFunc?>
) -> Any

// Returns 'c' (class), 'e' (enum), 's' (struct), 't' (tuple), or '\0' (none)
@_silgen_name("swift_reflectionMirror_displayStyle")
internal func _getDisplayStyle<T>(_: T) -> CChar

@_silgen_name("swift_reflectionMirror_quickLookObject")
internal func _getQuickLookObject<T>(_: T) -> AnyObject?

@_silgen_name("_swift_stdlib_NSObject_isKindOfClass")
internal func _isImpl(_ object: AnyObject, kindOf: AnyObject) -> Bool
~~~


## Dynamic Dispatch Done Weird

There isn't a single universal way to fetch the info we want from any type. Tuples, structs, classes, and enums all need different code for many of these tasks, such as looking up the number of children. There are further subtleties, such as different treatment for Swift and Objective-C classes.

All of these functions will need code that dispatches to different implementations based on what kind of type is being examined. This sounds a lot like dynamic dispatch of methods, except that the choice of which implementation to call is more complicated than checking the class of the object the method is being used on. The reflection code attempts to simplify matters by using C++ dynamic dispatch with an abstract base class that contains a C++ version of the above interface, and a bunch of subclasses covering all the various cases. A single function maps a Swift type to an instance of one of those C++ classes. Calling a method on that instance then dispatches to the appropriate implementation.

The mapping function is called `call` and its declaration looks like this:

~~~cpp
template<typename F>
auto call(OpaqueValue *passedValue, const Metadata *T, const Metadata *passedType,
          const F &f) -> decltype(f(nullptr))
~~~

`passedValue` is a pointer to the actual Swift value that was passed in. `T` is the static type of that value, which corresponds to the generic parameter `<T>` on the Swift side. `passedType` is a type that's explicitly passed in by the Swift side and used for the actual reflection step. (This type will be different from the actual runtime type of the object when working with a superclass `Mirror` for an instance of a subclass.) Finally, the `f` parameter is something that will be called, passing in a reference to the implementation object that this function looks up. This function then returns whatever `f` returns when called, to make it easier for users to get values back out.

The implementation of `call` isn't too exciting. It's mostly a big `switch` statement with some extra code to handle special cases. The important thing is that it will end up calling `f` with an instance of a subclass of `ReflectionMirrorImpl`, which will then call a method on that instance to get the real work done.

Here is `ReflectionMirrorImpl`, which is the interface everything goes through:

~~~cpp
struct ReflectionMirrorImpl {
  const Metadata *type;
  OpaqueValue *value;

  virtual char displayStyle() = 0;
  virtual intptr_t count() = 0;
  virtual AnyReturn subscript(intptr_t index, const char **outName,
                              void (**outFreeFunc)(const char *)) = 0;
  virtual const char *enumCaseName() { return nullptr; }

#if SWIFT_OBJC_INTEROP
  virtual id quickLookObject() { return nil; }
#endif

  virtual ~ReflectionMirrorImpl() {}
};
~~~

The functions which serve as the interface between the Swift and C++ components then use `call` to invoke the corresponding method. For example, here's what `swift_reflectionMirror_count` looks like:

~~~cpp
SWIFT_CC(swift) SWIFT_RUNTIME_STDLIB_INTERFACE
intptr_t swift_reflectionMirror_count(OpaqueValue *value,
                                      const Metadata *type,
                                      const Metadata *T) {
  return call(value, T, type, [](ReflectionMirrorImpl *impl) {
    return impl->count();
  });
}
~~~

## Tuple Reflection

Let's start out with tuple reflection, which is probably the simplest one that still does some work. It starts off by returning a display style of `'t'` to indicate that it's a tuple:

~~~cpp
struct TupleImpl : ReflectionMirrorImpl {
  char displayStyle() {
    return 't';
  }
~~~

Using a hardcoded constant like this is unusual, but given that there is exactly one place in C++ and one place in Swift that references this value, and that they're not using bridging to communicate, it's a reasonable choice.

Next is the `count` method. At this point we know that `type` is actually a `TupleTypeMetadata *` rather than just a `Metadata *`. `TupleTypeMetadata` has a `NumElements` field which holds the number of elements in the tuple, and we're done:

~~~cpp
  intptr_t count() {
    auto *Tuple = static_cast<const TupleTypeMetadata *>(type);
    return Tuple->NumElements;
  }
~~~

The `subscript` method takes a bit more work. It starts out with the same `static_cast`:

~~~cpp
  AnyReturn subscript(intptr_t i, const char **outName,
                      void (**outFreeFunc)(const char *)) {
    auto *Tuple = static_cast<const TupleTypeMetadata *>(type);
~~~

Next, a bounds check to ensure the caller isn't asking for an index this tuple can't contain:

~~~cpp
    if (i < 0 || (size_t)i > Tuple->NumElements)
      swift::crash("Swift mirror subscript bounds check failure");
~~~

Subscript has two jobs: it retrieves the value and the corresponding name. For a struct or class, the name is the stored property's name. For a tuple, the name is either the tuple label for that element, or a numeric indicator like `.0` if there is no label.

Labels are stored in a space-separated list in the `Labels` field of the metadata. This code tracks down the `i`th string in that list:

~~~cpp
    // Determine whether there is a label.
    bool hasLabel = false;
    if (const char *labels = Tuple->Labels) {
      const char *space = strchr(labels, ' ');
      for (intptr_t j = 0; j != i && space; ++j) {
        labels = space + 1;
        space = strchr(labels, ' ');
      }

      // If we have a label, create it.
      if (labels && space && labels != space) {
        *outName = strndup(labels, space - labels);
        hasLabel = true;
      }
    }
~~~

If there is no label, generate an appropriate numeric name:

~~~cpp
    if (!hasLabel) {
      // The name is the stringized element number '.0'.
      char *str;
      asprintf(&str, ".%" PRIdPTR, i);
      *outName = str;
    }
~~~

Because we're working at the intersection of Swift and C++, we don't get nice things like automatic memory management. Swift has ARC and C++ has RAII, but the two don't get along. The `outFreeFunc` allows the C++ code to provide a function to the caller which it will use to free the returned name. The label needs to be freed with `free`, so this code sets the value of `*outFreeFunc` accordingly:

~~~cpp
    *outFreeFunc = [](const char *str) { free(const_cast<char *>(str)); };
~~~

That takes care of the name. Surprisingly, the value is simpler to retrieve. The `Tuple` metadata contains a function that returns information about the element at a given index:

~~~cpp
    auto &elt = Tuple->getElement(i);
~~~

`elt` contains an offset which can be applied to the tuple value to get a pointer to the element value:

~~~cpp
    auto *bytes = reinterpret_cast<const char *>(value);
    auto *eltData = reinterpret_cast<const OpaqueValue *>(bytes + elt.Offset);
~~~

`elt` also contains the element's type. With the type and the pointer to the value, it's possible to construct a new `Any` containing that value. The type contains function pointers for allocating and initializing storage containing a value of the given type. This code uses those functions to copy the value into the `Any`, then returns the `Any` to the caller:

~~~cpp
    Any result;

    result.Type = elt.Type;
    auto *opaqueValueAddr = result.Type->allocateBoxForExistentialIn(&result.Buffer);
    result.Type->vw_initializeWithCopy(opaqueValueAddr,
                                       const_cast<OpaqueValue *>(eltData));

    return AnyReturn(result);
  }
};
~~~

That's it for tuples.


## swift_getFieldAt

Looking up the elements in structs, classes, and enums is currently quite complex. Much of this complexity is due to the lack of a direct reference between these types and the field descriptors which contain the information about a type's fields. A helper function called `swift_getFieldAt` searches for the appropriate field descriptor for a given type. This whole function should go away once we add that direct reference, but in the meantime it provides an interesting look at how the runtime code is able to use the language's metadata to look up type information.

The function prototype looks like this:

~~~cpp
void swift::_swift_getFieldAt(
    const Metadata *base, unsigned index,
    std::function<void(llvm::StringRef name, FieldType fieldInfo)>
        callback) {
~~~

It takes the type to examine and the field index to look up. It also takes a callback which will be invoked with the info that it looked up.

The first task is to get the type context descriptor for this type, which contains additional information about the type which will be used later:

~~~cpp
  auto *baseDesc = base->getTypeContextDescriptor();
  if (!baseDesc)
    return;
~~~

The work is divided into two parts. First, it looks up the type's field descriptor. The field descriptor contains all of the info about the fields of the type. Once the field descriptor is available, this function can look up the necessary information from the descriptor.

Looking up the information from the descriptor is wrapped up in a helper called `getFieldAt` which the other code calls from various places in its search for the appropriate field descriptor. Let's start with the search. It starts off by getting a demangler, which is used to turn mangled type names into actual type references:

~~~cpp
  auto dem = getDemanglerForRuntimeTypeResolution();
~~~
It also has a cache to speed up multiple searches:

~~~cpp
  auto &cache = FieldCache.get();
~~~

If the cache already has the field descriptor, call `getFieldAt` with it:

~~~cpp
  if (auto Value = cache.FieldCache.find(base)) {
    getFieldAt(*Value->getDescription());
    return;
  }
~~~

To make the search code simpler, there's a helper which takes a `FieldDescriptor` and checks whether it's the one being searched for. If the descriptor matches, it puts the descriptor in the cache, calls `getFieldAt`, and returns success to the caller. Matching is complex, but essentially boils down to comparing the mangled names:

~~~cpp
  auto isRequestedDescriptor = [&](const FieldDescriptor &descriptor) {
    assert(descriptor.hasMangledTypeName());
    auto mangledName = descriptor.getMangledTypeName(0);

    if (!_contextDescriptorMatchesMangling(baseDesc,
                                           dem.demangleType(mangledName)))
      return false;

    cache.FieldCache.getOrInsert(base, &descriptor);
    getFieldAt(descriptor);
    return true;
  };
~~~

Field descriptors can be registered at runtime or baked into a binary at build time. These two loops search all known field descriptors for a match:

~~~cpp
  for (auto &section : cache.DynamicSections.snapshot()) {
    for (const auto *descriptor : section) {
      if (isRequestedDescriptor(*descriptor))
        return;
    }
  }

  for (const auto &section : cache.StaticSections.snapshot()) {
    for (auto &descriptor : section) {
      if (isRequestedDescriptor(descriptor))
        return;
    }
  }
~~~

In the event that no match is found, log a warning and invoke the callback with an empty tuple just to give it something:

~~~cpp
  auto typeName = swift_getTypeName(base, /*qualified*/ true);
  warning(0, "SWIFT RUNTIME BUG: unable to find field metadata for type '%*s'\n",
             (int)typeName.length, typeName.data);
  callback("unknown",
           FieldType()
             .withType(TypeInfo(&METADATA_SYM(EMPTY_TUPLE_MANGLING), {}))
             .withIndirect(false)
             .withWeak(false));
}
~~~

That takes care of the search for a field descriptor. The `getFieldAt` helper transforms the field descriptor into the name and field type that gets passed to the callback. It starts out by getting the requested field record out of the field descriptor:

~~~cpp
  auto getFieldAt = [&](const FieldDescriptor &descriptor) {
    auto &field = descriptor.getFields()[index];
~~~

The name is directly accessible from the record:

~~~cpp
    auto name = field.getFieldName(0);
~~~

If the field is actually an enum case, it may not have a type. Check for that early and invoke the callback accordingly:

~~~cpp
    if (!field.hasMangledTypeName()) {
      callback(name, FieldType().withIndirect(field.isIndirectCase()));
      return;
    }
~~~

The field record stores the field type as a mangled name. The callback expects a pointer to metadata, so the mangled name has to be resolved to an actual type. The function `_getTypeByMangledName` handles most of that work, but requires the caller to resolve any generic arguments used by the type. Doing that requires pulling out all of the generic contexts that the type is nested in:

~~~cpp
    std::vector<const ContextDescriptor *> descriptorPath;
    {
      const auto *parent = reinterpret_cast<
                              const ContextDescriptor *>(baseDesc);
      while (parent) {
        if (parent->isGeneric())
          descriptorPath.push_back(parent);

        parent = parent->Parent.get();
      }
    }
~~~

Now get the mangled name and fetch the type, passing in a lambda that resolves generic arguments:

~~~cpp
    auto typeName = field.getMangledTypeName(0);

    auto typeInfo = _getTypeByMangledName(
        typeName,
        [&](unsigned depth, unsigned index) -> const Metadata * {
~~~

If the requested depth is beyond the size of the descriptor path, fail:

~~~cpp
          if (depth >= descriptorPath.size())
            return nullptr;
~~~

Otherwise, fetch the generic argument from the type that contains the field. This requires converting the index and depth into a single flat index, which is done by walking up the descriptor path and adding the number of generic parameters at each stage until the given depth is reached:

~~~cpp
          unsigned currentDepth = 0;
          unsigned flatIndex = index;
          const ContextDescriptor *currentContext = descriptorPath.back();

          for (const auto *context : llvm::reverse(descriptorPath)) {
            if (currentDepth >= depth)
              break;

            flatIndex += context->getNumGenericParams();
            currentContext = context;
            ++currentDepth;
          }
~~~

If the index is beyond the generic parameters available at the given depth, fail:

~~~cpp
          if (index >= currentContext->getNumGenericParams())
            return nullptr;
~~~

Otherwise fetch the appropriate generic argument from the base type:

~~~cpp
          return base->getGenericArgs()[flatIndex];
        });
~~~

Like before, if the type couldn't be found, use an empty tuple:

~~~cpp
    if (typeInfo == nullptr) {
      typeInfo = TypeInfo(&METADATA_SYM(EMPTY_TUPLE_MANGLING), {});
      warning(0, "SWIFT RUNTIME BUG: unable to demangle type of field '%*s'. "
                 "mangled type name is '%*s'\n",
                 (int)name.size(), name.data(),
                 (int)typeName.size(), typeName.data());
    }
~~~

Then invoke the callback with whatever was found:

~~~cpp
    callback(name, FieldType()
                       .withType(typeInfo)
                       .withIndirect(field.isIndirectCase())
                       .withWeak(typeInfo.isWeak()));

  };
~~~

That's `swift_getFieldAt`. With that helper available, let's take a look at the other reflection implementations.

## Structs

The implementation for structs is similar, but a little more complex. There are struct types which don't support reflection at all, looking up the name and offset in a struct takes more effort, and structs can contain weak references which the reflection code needs to be able to extract.

First is a helper method to check whether the struct can be reflected at all. This is stored in a flag that's accessible through the struct metadata. Similar to the above code with tuples, we know at this point that `type` is really a `StructMetadata *`, so we can cast freely:

~~~cpp
struct StructImpl : ReflectionMirrorImpl {
  bool isReflectable() {
    const auto *Struct = static_cast<const StructMetadata *>(type);
    const auto &Description = Struct->getDescription();
    return Description->getTypeContextDescriptorFlags().isReflectable();
  }
~~~

The display style for a struct is `'s'`:

~~~cpp
  char displayStyle() {
    return 's';
  }
~~~

The child count is the number of fields as reported by the metadata, or `0` if this type isn't actually reflectable:

~~~cpp
  intptr_t count() {
    if (!isReflectable()) {
      return 0;
    }

    auto *Struct = static_cast<const StructMetadata *>(type);
    return Struct->getDescription()->NumFields;
  }
~~~

Like before, the `subscript` method is the complicated part. It starts off similarly, doing a bounds check and looking up the offset:

~~~cpp
  AnyReturn subscript(intptr_t i, const char **outName,
                      void (**outFreeFunc)(const char *)) {
    auto *Struct = static_cast<const StructMetadata *>(type);

    if (i < 0 || (size_t)i > Struct->getDescription()->NumFields)
      swift::crash("Swift mirror subscript bounds check failure");

    // Load the offset from its respective vector.
    auto fieldOffset = Struct->getFieldOffsets()[i];
~~~

Getting the type info for a struct field is a bit more involved. That work is passed off to the `_swift_getFieldAt` helper function:

~~~cpp
    Any result;

    _swift_getFieldAt(type, i, [&](llvm::StringRef name, FieldType fieldInfo) {
~~~

Once it has the field info, things proceed similarly to the tuple code. Fill out the name and compute a pointer to the field's storage:

~~~cpp
      *outName = name.data();
      *outFreeFunc = nullptr;

      auto *bytes = reinterpret_cast<char*>(value);
      auto *fieldData = reinterpret_cast<OpaqueValue *>(bytes + fieldOffset);
~~~

There's an extra step to copy the field's value into the `Any` return value to handle weak references. The `loadSpecialReferenceStorage` function handles those. If it doesn't load the value then the value has normal storage, and the value can be copied into the return value normally:

~~~cpp
      bool didLoad = loadSpecialReferenceStorage(fieldData, fieldInfo, &result);
      if (!didLoad) {
        result.Type = fieldInfo.getType();
        auto *opaqueValueAddr = result.Type->allocateBoxForExistentialIn(&result.Buffer);
        result.Type->vw_initializeWithCopy(opaqueValueAddr,
                                           const_cast<OpaqueValue *>(fieldData));
      }
    });

    return AnyReturn(result);
  }
};
~~~

That takes care of structs.


## Classes

Classes are similar to structs, and the code in `ClassImpl` is almost the same. There are two notable differences due to Objective-C interop. One is that it has an implementation of `quickLookObject` which invokes the Objective-C `debugQuickLookObject` method:

~~~cpp
#if SWIFT_OBJC_INTEROP
id quickLookObject() {
  id object = [*reinterpret_cast<const id *>(value) retain];
  if ([object respondsToSelector:@selector(debugQuickLookObject)]) {
    id quickLookObject = [object debugQuickLookObject];
    [quickLookObject retain];
    [object release];
    return quickLookObject;
  }

  return object;
}
#endif
~~~

The other is that the field offset has to be obtained from the Objective-C runtime if the class has an Objective-C superclass:

~~~cpp
  uintptr_t fieldOffset;
  if (usesNativeSwiftReferenceCounting(Clas)) {
    fieldOffset = Clas->getFieldOffsets()[i];
  } else {
#if SWIFT_OBJC_INTEROP
    Ivar *ivars = class_copyIvarList((Class)Clas, nullptr);
    fieldOffset = ivar_getOffset(ivars[i]);
    free(ivars);
#else
    swift::crash("Object appears to be Objective-C, but no runtime.");
#endif
  }
~~~


## Enums

Enums are a bit different. `Mirror` considers an enum instance to have at most one child, which has the enum case name as its label and the associated value as its value. Cases with no associated value have no children. For example:

~~~cpp
enum Foo {
  case bar
  case baz(Int)
  case quux(String, String)
}
~~~

When mirror is used on a value of `Foo`, it will show no children for `Foo.bar`, one child with an `Int` value for a `Foo.baz`, and one child with a `(String, String)` value for a `Foo.quux`. While a value of a class or struct always contains the same fields and thus the same child labels and types, different enum cases of the same type do not. Associated values can also be `indirect`, which requires special handling.

There are four key pieces of information needed to reflect an `enum` value: the case name, the tag (a numeric representation of which enum case the value stores), the payload type, and whether the payload is indirect. The `getInfo` method fetches all of these values:

~~~cpp
const char *getInfo(unsigned *tagPtr = nullptr,
                    const Metadata **payloadTypePtr = nullptr,
                    bool *indirectPtr = nullptr) {
~~~

The tag is retrieved by querying the metadata directly:

~~~cpp
  unsigned tag = type->vw_getEnumTag(value);
~~~

The other info is retrieved using `_swift_getFieldAt`. It takes the tag as the "field index" and provides the appropriate info:

~~~cpp
  const Metadata *payloadType = nullptr;
  bool indirect = false;

  const char *caseName = nullptr;
  _swift_getFieldAt(type, tag, [&](llvm::StringRef name, FieldType info) {
    caseName = name.data();
    payloadType = info.getType();
    indirect = info.isIndirect();
  });
~~~

All of these values are then returned to the caller:

~~~cpp
  if (tagPtr)
    *tagPtr = tag;
  if (payloadTypePtr)
    *payloadTypePtr = payloadType;
  if (indirectPtr)
    *indirectPtr = indirect;

  return caseName;
}
~~~

(You might wonder: why is the case name the one that's returned directly, while the other three are returned through pointers? Why not return the tag, or the payload type? The answer is: I don't really know, it seemed like a good idea at the time.)

The `count` method can then use `getInfo` to retrieve the payload type, and return `0` or `1` if the payload type is `null` or not:

~~~cpp
intptr_t count() {
  if (!isReflectable()) {
    return 0;
  }

  const Metadata *payloadType;
  getInfo(nullptr, &payloadType, nullptr);
  return (payloadType != nullptr) ? 1 : 0;
}
~~~

The `subscript` method starts out by getting all info about the value:

~~~cpp
AnyReturn subscript(intptr_t i, const char **outName,
                    void (**outFreeFunc)(const char *)) {
  unsigned tag;
  const Metadata *payloadType;
  bool indirect;

  auto *caseName = getInfo(&tag, &payloadType, &indirect);
~~~

Actually copying the value takes a bit more work. In order to handle indirect values, the whole process goes through an extra box:

~~~cpp
  const Metadata *boxType = (indirect ? &METADATA_SYM(Bo).base : payloadType);
  BoxPair pair = swift_allocBox(boxType);
~~~

Because of the way enum extraction works, there's no way to cleanly copy the value out. The only operation available is to *destructively* extract the payload value. To make a copy and leave the original intact, destructively extract it, then put it back in:

~~~cpp
  type->vw_destructiveProjectEnumData(const_cast<OpaqueValue *>(value));
  boxType->vw_initializeWithCopy(pair.buffer, const_cast<OpaqueValue *>(value));
  type->vw_destructiveInjectEnumTag(const_cast<OpaqueValue *>(value), tag);

  value = pair.buffer;
~~~

In the indirect case, the real data has to be pulled out of the box:

~~~cpp
  if (indirect) {
    const HeapObject *owner = *reinterpret_cast<HeapObject * const *>(value);
    value = swift_projectBox(const_cast<HeapObject *>(owner));
  }
~~~
Everything is now in place. The child's label is set to be the case name:

~~~cpp
  *outName = caseName;
  *outFreeFunc = nullptr;
~~~

The now-familiar pattern is used to return the payload as an `Any`:

~~~cpp
  Any result;

  result.Type = payloadType;
  auto *opaqueValueAddr = result.Type->allocateBoxForExistentialIn(&result.Buffer);
  result.Type->vw_initializeWithCopy(opaqueValueAddr,
                                     const_cast<OpaqueValue *>(value));

  swift_release(pair.object);
  return AnyReturn(result);
}
~~~

## Miscellaneous Kinds

There are three more implementations in this file, all of which do almost nothing. `ObjCClassImpl` handles Objective-C classes. It doesn't even attempt to return any children for these, because Objective-C allows too much leeway with the contents of ivars. Objective-C classes are allowed to do things like keep a dangling pointer sitting around forever, with some separate logic telling the implementation not to touch the value. Attempting to return such a value as a `Mirror`'s child would violate Swift's memory safety guarantees. There's no way to reliably tell if the value in question is doing such a thing, so this code avoids it entirely.

`MetatypeImpl` handles metatypes. If you use `Mirror` on an actual type, such as `Mirror(reflecting: String.self)`, this is what's used. There could conceivably be some useful information to provide here, but at the moment it doesn't even try, and just returns nothing. Similarly, `OpaqueImpl` handles opaque types and returns nothing.


## Swift Interface

On the Swift side of things, `Mirror` calls the interface functions implemented in C++ to retrieve the information it needs, then presents it in a friendlier form. This is done in an initializer on `Mirror`:

~~~swift
internal init(internalReflecting subject: Any,
            subjectType: Any.Type? = nil,
            customAncestor: Mirror? = nil)
{
~~~

The `subjectType` is the type that will be used to reflect the `subject` value. This is typically the value's runtime type, but it will be a superclass if the caller uses `superclassMirror` to walk up the class hierarchy. If the caller didn't pass in a `subjectType`, this code asks the C++ code to grab the type of `subject`:

~~~swift
  let subjectType = subjectType ?? _getNormalizedType(subject, type: type(of: subject))
~~~

Then it constructs the `children` by getting the number of children, and creating a collection that lazily fetches each individual child:

~~~swift
  let childCount = _getChildCount(subject, type: subjectType)
  let children = (0 ..< childCount).lazy.map({
    getChild(of: subject, type: subjectType, index: $0)
  })
  self.children = Children(children)
~~~

The `getChild` function is a small wrapper around the C++ `_getChild` function which transforms the C string containing the label name into a Swift `String`.

`Mirror` has a `superclassMirror` property which returns a `Mirror` that inspects the properties of the next class up the class hierarchy. Internally, it has a `_makeSuperclassMirror` property which stores a closure that can construct the superclass `Mirror` on demand. That closure starts by getting the superclass of `subjectType`. Non-class types and classes with no superclasses can't have a superclass mirror, so they get `nil`:

~~~swift
  self._makeSuperclassMirror = {
    guard let subjectClass = subjectType as? AnyClass,
          let superclass = _getSuperclass(subjectClass) else {
      return nil
    }
~~~

The caller can specify a custom ancestor representation, which is a `Mirror` instance that can be directly returned as the superclass mirror:

~~~swift
    if let customAncestor = customAncestor {
      if superclass == customAncestor.subjectType {
        return customAncestor
      }
      if customAncestor._defaultDescendantRepresentation == .suppressed {
        return customAncestor
      }
    }
~~~

Otherwise, return a new `Mirror` for the same value but using the `superclass` as the `subjectType`:

~~~swift
    return Mirror(internalReflecting: subject,
                  subjectType: superclass,
                  customAncestor: customAncestor)
  }
~~~

Finally, it fetches and decodes the display style, and sets up `Mirror`'s remaining properties:

~~~swift
    let rawDisplayStyle = _getDisplayStyle(subject)
    switch UnicodeScalar(Int(rawDisplayStyle)) {
    case "c": self.displayStyle = .class
    case "e": self.displayStyle = .enum
    case "s": self.displayStyle = .struct
    case "t": self.displayStyle = .tuple
    case "\0": self.displayStyle = nil
    default: preconditionFailure("Unknown raw display style '\(rawDisplayStyle)'")
    }

    self.subjectType = subjectType
    self._defaultDescendantRepresentation = .generated
  }
~~~


## Conclusion

Swift's rich type metadata exists mostly behind the scenes, supporting things like protocol conformance lookup and generic type resolution. Some of it is exposed to the user with the `Mirror` type, allowing runtime inspection of arbitrary values. It might seem weird and mysterious at first, given the statically typed nature of Swift, but it's really a straightforward application of the information already available. This tour of the implementation should help dispel that mystery and give you insight into what's going on when you use `Mirror`.
