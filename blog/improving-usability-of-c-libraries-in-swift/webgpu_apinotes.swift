#! swift -enable-bare-slash-regex

//===----------------------------------------------------------------------===//
//
// This source file is part of the Swift.org open source project
//
// Copyright (c) 2025 Apple Inc. and the Swift.org project authors
// Licensed under Apache License v2.0
//
// See LICENSE.txt for license information
// See CONTRIBUTORS.txt for the list of Swift.org project authors
//
// SPDX-License-Identifier: Apache-2.0
//
//===----------------------------------------------------------------------===//

/**
 * Script to process the common [WebGPU header](https://github.com/webgpu-native/webgpu-headers)
 * to produce a Swift-compatible "API notes" file that makes the use of WebGPU
 * C API easier and safer in Swift.
 *
 * The resulting API notes file improves the Swift view of the WebGPU C API
 * in the following ways:
 *
 *   - WebGPU's reference-counted "object" types (like WGPUInstance)
 *     are imported as Swift classes. Swift will automatically handle
 *     the reference counting, making calls to the appropriate
 *     wgpu*AddRef and wgpu*Release functions.
 *   - WebGPU functions that operate on a particular object type are imported
 *     as members of the corresponding class. For example,
 *     wgpuInstanceCreateSurface will become WGPUInstance.createSurface().
 *   - WebGPU "Get" functions that retrieve a single value are imported as
 *     computed properties. For example, wgpuBufferGetMapState becomes a
 *     property WGPUBuffer.mapState.
 *   - WebGPU's enum types are imported as Swift enum types, with each
 *     enumerator being imported as a case.
 *   - WebGPU's flag set types are imported as Swift structs that act as
 *     option sets, with each option as a static member of the type.
 *
 * Usage:
 *   swift -enable-bare-slash-regex apinotes.swift < webgpu.h > WebGPU.apinotes
 *
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2024 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
 */

extension StringProtocol {
  // Replace a leading "WGPU" with "wgpu" in the given string.
  var lowercaseWebGPUPrefix: String {
    if starts(with: "WGPU") {
      return "wgpu" + String(dropFirst(4))
    }

    return String(self)
  }

  // Replace a leading "wgpu" with "WGPU" in the given string.
  var uppercaseWebGPUPrefix: String {
    if starts(with: "wgpu") {
      return "WGPU" + String(dropFirst(4))
    }

    return String(self)
  }

  /// Return this string with the initialism lowercased.
  var lowercasingInitialism: String {
    var numUppercased = 0
    for c in self {
      if c.isUppercase {
	numUppercased += 1
      }
    }
    
    return String(prefix(numUppercased)).lowercased() + String(dropFirst(numUppercased))
  }
}

extension String {
  /// Whether a type with this name requires a nullability annotation.
  func typeRequiresNullability(importedTypes: Set<String>) -> Bool {
    if contains("*") {
      return true
    }

    if importedTypes.contains(self) {
      return true
    }

    return false
  }
}

/// A function parameter in the webgpu header.
struct Parameter {
  var type: String
  var name: String
  var nullable: Bool

  /// The name that the parameter should have in Swift.
  ///
  /// This function applies some simple heuristics to deal with poor
  /// or missing names in webgpu.h.
  var swiftName: String {
    if name.count < 2 {
      return "_"
    }

    return name
  }

  func requiresNullability(importedTypes: Set<String>) -> Bool {
    nullable || type.typeRequiresNullability(importedTypes: importedTypes)
  }
}

/// A function in the webgpu header
struct Function {
  var name: String
  var resultType: String
  var returnsRetained: Bool
  var nullableResult: Bool
  var parameters: [Parameter]

  /// If this is a method of a type, the name of that type.
  var enclosingType: String? {
    guard let selfParameter = parameters.first,
        name.starts(with: selfParameter.type.lowercaseWebGPUPrefix) else {
      return nil
    }

    return selfParameter.type
  }

  /// If this function should have a special Swift name, produce that name.
  ///
  /// This function applies various heuristics to map WebGPU functions
  /// to their appropriate Swift spellings.
  func swiftName(importedTypes: Set<String>) -> String? {
    // Special cases
    switch name {
    case "wgpuCreateInstance": return "WGPUInstanceImpl.init(descriptor:)"
    default: break
    }
    
    guard let selfType = enclosingType, importedTypes.contains(selfType) else {
      return nil
    }

    let unprefixedName = name.dropFirst(selfType.count)
    
    // If this has the shape of a getter, map it to a property getter.
    let baseName: String
    var namePrefix: String?
    if parameters.count == 1 && unprefixedName.starts(with: "Get") && resultType != "void" {
      baseName = unprefixedName.dropFirst(3).lowercasingInitialism
      namePrefix = "getter:"
    } else {
      baseName = unprefixedName.lowercasingInitialism
      namePrefix = nil
    }
    
    let parameterNameString = "self:" + parameters.dropFirst().map { $0.swiftName + ":" }.joined()
    return "\(namePrefix ?? "")\(selfType)Impl.\(baseName)(\(parameterNameString))"
  }

  /// Whether we should annotate this function.
  func shouldAnnotate(importedTypes: Set<String>) -> Bool {
    returnsRetained || swiftName(importedTypes: importedTypes) != nil ||
    nullableResult || resultType.typeRequiresNullability(importedTypes: importedTypes) || 
    parameters.contains { 
      $0.requiresNullability(importedTypes: importedTypes) 
    }
  }
}

// Regular expressions to match particular entities in the generated webgpu.h.

// Enum definitions, marked by WGPU_ENUM_ATTRIBUTE.
let enumMatcher = /} (?<name>\w+?) WGPU_ENUM_ATTRIBUTE/

// Flag set definitions.
let flagSetMatcher = /typedef WGPUFlags (?<name>\w+?);/

// Global constant definitions.
let globalConstantMatcher = /static const (?<type>\w+?) (?<typename>\w+?)_(?<name>\w+?) =/

// Object definitions, marked by WGPU_OBJECT_ATTRIBUTE.
let objectMatcher = /typedef struct (?<implName>\w+?)\* (?<name>\w+?) WGPU_OBJECT_ATTRIBUTE;/

// Function declarations, marked by WGPU_FUNCTION_ATTRIBUTE
let functionMatcher = /WGPU_EXPORT (?<nullableResult>WGPU_NULLABLE ?)?(?<resultType>\w+?) (?<name>\w+?)\((?<parameters>.*\)?) WGPU_FUNCTION_ATTRIBUTE;/
let parameterMatcher = /((?<nullable>WGPU_NULLABLE ?)?(?<type>[^),]+?)) (?<name>\w+?)[),]/

// Extract information about the various declarations in the header.
var enums: Set<String> = []
var flagSets: Set<String> = []
var objectTypes: Set<String> = []
var functions: [Function] = []
var globalConstants: [(typename: String, name: String)] = []

var nextReturnsRetained = false
while let line = readLine() {
  if line.contains("This value is @ref ReturnedWithOwnership") {
    nextReturnsRetained = true
    continue
  }

  if let matchedEnum = line.firstMatch(of: enumMatcher) {
    enums.insert(String(matchedEnum.name))
    nextReturnsRetained = false
    continue
  }

  if let matchedFlagSet = line.firstMatch(of: flagSetMatcher) {
    flagSets.insert(String(matchedFlagSet.name))
    nextReturnsRetained = false
    continue
  }

  if let matchedGlobalConstant = line.firstMatch(of: globalConstantMatcher) {
    if matchedGlobalConstant.type == matchedGlobalConstant.typename {
      globalConstants.append(
        (typename: String(matchedGlobalConstant.type),
	  name: String(matchedGlobalConstant.name))
      )
    }
    continue
  }

  if let matchedObject = line.firstMatch(of: objectMatcher) {
    assert(matchedObject.implName == matchedObject.name + "Impl")
    objectTypes.insert(String(matchedObject.name))
    nextReturnsRetained = false
    continue
  }

  if let matchedFunction = line.firstMatch(of: functionMatcher) {
    let parameters = matchedFunction.parameters.matches(of: parameterMatcher).map { match in
      Parameter(
        type: String(match.type),
        name: String(match.name),
        nullable: match.nullable != nil,
      )
    }

    functions.append(Function(
      name: String(matchedFunction.name),
      resultType: String(matchedFunction.resultType),
      returnsRetained: nextReturnsRetained,
      nullableResult: matchedFunction.nullableResult != nil,
      parameters: parameters
    ))

    nextReturnsRetained = false
    continue
  }
}

// APINotes YAML header
print("""
  ---
  Name: WebGPU
  """)

// All "tags" (structs, enums, etc.).
print("Tags:")

// WebGPU enum types import as Swift enums.
for enumName in enums.sorted() {
  print("""
    - Name: \(enumName)
      EnumExtensibility: closed
    """)
}

// WebGPU object types import as Swift foreign reference types.
for objectTypeName in objectTypes.sorted() {
  let methodPrefix = objectTypeName.lowercaseWebGPUPrefix
  print("""
    - Name: \(objectTypeName)Impl
      SwiftImportAs: reference
      SwiftReleaseOp: \(methodPrefix)Release
      SwiftRetainOp: \(methodPrefix)AddRef
    """)
}

// All typedefs (option sets, etc.).
print("Typedefs:")
for flagSetName in flagSets.sorted() {
  print("""
    - Name: \(flagSetName)
      SwiftWrapper: struct
    """)
}

// Functions can be imported as methods, properties, or initializers.
print("""
  Functions:
  """)
for function in functions.sorted(by: { $0.name < $1.name }) {
  guard function.shouldAnnotate(importedTypes: objectTypes) else {
    continue
  }

  print("""
    - Name: \(function.name)
    """)
  if let swiftName = function.swiftName(importedTypes: objectTypes) {
    print("""
        SwiftName: \(swiftName)
      """)
  }
  if function.returnsRetained {
    print("""
        SwiftReturnOwnership: retained
      """)
  }
  if function.nullableResult {
    print("""
        ResultType: "\(function.resultType) _Nullable"
      """)
  }
  if function.parameters.contains(where: { $0.requiresNullability(importedTypes: objectTypes) }) {
    print("""
          Parameters:
        """)
    for (index, param) in function.parameters.enumerated() {
      guard param.requiresNullability(importedTypes: objectTypes) else { continue }

      print("""
            - Position: \(index)
              Type: "\(param.type) \(param.nullable ? "_Nullable" : "_Nonnull")"
        """)
    }
  }
}

// Globals can be imported as static properties, if we know the type.
print("""
  Globals:
  """)
for (typename, name) in globalConstants {
  guard flagSets.contains(typename) else { continue }

  print("""
    - Name: \(typename)_\(name)
      SwiftName: \(typename).\(name.lowercasingInitialism)
    """)
}
