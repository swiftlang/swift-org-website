import OpenAPIURLSession
import Foundation
import Shared

enum SwiftOrgServerName: String {
    case prod
    case local
}

@main
struct Tool {
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

        print("Testing swift.org API at \(serverURL.absoluteString)...")

        let client = Client(
            serverURL: serverURL,
            transport: URLSessionTransport()
        )

        var tests: [Test] = [
            .init(
                name: "listReleases",
                work: { _ = try await client.listReleases().ok.body.json }
            ),
        ]
        for branch in Components.Schemas.KnownSourceBranch.allCases {
            for platform in Components.Schemas.KnownPlatformIdentifier.allCases {
                tests.append(
                    .init(
                        name: "listDevToolchains(\(branch.rawValue), \(platform.rawValue))",
                        work: {
                            _ = try await client.listDevToolchains(.init(
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
                        _ = try await client.listStaticSDKDevToolchains(.init(path: .init(branch: branch))).ok.body.json
                    }
                )
            )
        }
        tests.append(
            .init(
                name: "getCurrentSwiftlyRelease",
                work: {
                    _ = try await client.getCurrentSwiftlyRelease().ok.body.json
                }
            )
        )

        try await Tester.run(tests)
    }
}
