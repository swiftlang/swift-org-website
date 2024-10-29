import OpenAPIURLSession
import Foundation

enum SwiftOrgServerName: String {
    case prod
    case local
}

@main
struct Tool {
    struct Test: Sendable {
        var name: String
        var work: @Sendable (Client) async throws -> Void
    }

    static func main() async throws {
        let serverURL: URL
        if
            let name = ProcessInfo.processInfo.environment["SWIFTORG_SERVER_NAME"],
            let serverName = SwiftOrgServerName(rawValue: name)
        {
            switch serverName {
            case .prod:
                serverURL = try Servers.Server1.url()
            case .local:
                serverURL = try Servers.Server2.url()
            }
        } else {
            serverURL = try Servers.Server1.url()
        }

        print("Testing SwiftOrg API at \(serverURL.absoluteString)...")

        let client = Client(
            serverURL: serverURL,
            transport: URLSessionTransport()
        )

        var tests: [Tool.Test] = [
            .init(
                name: "listReleases",
                work: { _ = try await $0.listReleases().ok.body.json }
            ),
        ]
        for branch in Components.Schemas.KnownSourceBranch.allCases {
            for platform in Components.Schemas.KnownPlatformIdentifier.allCases {
                tests.append(
                    .init(
                        name: "listDevToolchains(\(branch.rawValue), \(platform.rawValue))",
                        work: {
                            _ = try await $0.listDevToolchains(.init(
                                path: .init(
                                    branch: branch,
                                    platform: platform
                                )
                            )).ok.body.json
                        }
                    )
                )
            }
        }
        for branch in Components.Schemas.KnownSourceBranch.allCases {
            tests.append(
                .init(
                    name: "listStaticSDKDevToolchains(\(branch.rawValue))",
                    work: {
                        _ = try await $0.listStaticSDKDevToolchains(.init(path: .init(branch: branch))).ok.body.json
                    }
                )
            )
        }

        var results: [(String, Error?)] = []
        func runTest(_ test: Test) async {
            do {
                try await test.work(client)
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
