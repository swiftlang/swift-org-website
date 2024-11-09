import OpenAPIURLSession
import Foundation
import Shared

enum DownloadSwiftOrgServerName: String {
    case prod
}

@main
struct Tool {
    static func main() async throws {
        let serverURL: URL
        if
            let name = ProcessInfo.processInfo.environment["DOWNLOADSWIFTORG_SERVER_NAME"],
            let serverName = DownloadSwiftOrgServerName(rawValue: name)
        {
            switch serverName {
            case .prod:
                serverURL = try Servers.Server1.url()
            }
        } else {
            serverURL = try Servers.Server1.url()
        }

        print("Testing download.swift.org API at \(serverURL.absoluteString)...")

        let client = Client(
            serverURL: serverURL,
            transport: URLSessionTransport(),
            middlewares: [
                Issue847WorkaroundMiddleware(),
            ]
        )

        let tests: [Test] = [
            .init(
                name: "listProposals",
                work: { _ = try await client.listProposals().ok.body.json }
            ),
        ]
        try await Tester.run(tests)
    }
}
