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
                                    branch: .init(value1: branch),
                                    platform: .init(value1: platform)
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
                        _ = try await client.listStaticSDKDevToolchains(.init(path: .init(branch: .init(value1: branch)))).ok.body.json
                    }
                )
            )
        }
        for branch in Components.Schemas.KnownSourceBranch.allCases {
            tests.append(
                .init(
                    name: "listWasmSDKDevToolchains(\(branch.rawValue))",
                    work: {
                        _ = try await client.listWasmSDKDevToolchains(.init(path: .init(branch: .init(value1: branch)))).ok.body.json
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
        for level in Components.Schemas.SSWGIncubationFilter.allCases {
            tests.append(
                .init(
                    name: "listSSWGIncubatedPackages(\(level.rawValue))",
                    work: {
                        _ = try await client.listSSWGIncubatedPackages(.init(path: .init(filter: level))).ok.body.json
                    }
                )
            )
        }

        try await Tester.run(tests)
    }
}
