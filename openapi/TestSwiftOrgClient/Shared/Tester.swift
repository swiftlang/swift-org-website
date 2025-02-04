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

import Foundation

package struct Test: Sendable {
    package var name: String
    package var work: @Sendable () async throws -> Void
    
    package init(name: String, work: @Sendable @escaping () async throws -> Void) {
        self.name = name
        self.work = work
    }
}

package struct Tester {
    package static func run(_ tests: [Test]) async throws {
        var results: [(String, Error?)] = []
        func runTest(_ test: Test) async {
            do {
                try await test.work()
                results.append((test.name, nil))
                print("✅ \(test.name)")
            } catch {
                results.append((test.name, error))
                print("❌ \(test.name): \(String(describing: error))")
            }
        }
        for test in tests {
            await runTest(test)
        }
        let failed = results.contains(where: { $0.1 != nil })
        exit(failed ? 1 : 0)
    }
}
