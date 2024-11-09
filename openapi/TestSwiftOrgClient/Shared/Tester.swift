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
