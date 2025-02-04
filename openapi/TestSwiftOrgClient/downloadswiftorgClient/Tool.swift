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
