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

import OpenAPIRuntime
import HTTPTypes
import Foundation

// Workaround for issue: https://github.com/swiftlang/swift-org-website/issues/847
struct Issue847WorkaroundMiddleware: ClientMiddleware {
    func intercept(
        _ request: HTTPRequest,
        body: HTTPBody?,
        baseURL: URL,
        operationID: String,
        next: (HTTPRequest, HTTPBody?, URL) async throws -> (HTTPResponse, HTTPBody?)
    ) async throws -> (HTTPResponse, HTTPBody?) {
        var (response, responseBody) = try await next(request, body, baseURL)
        guard
            operationID == "listProposals" &&
            response.status.code == 200 &&
            response.headerFields[.contentType] == "application/octet-stream"
        else {
            return (response, responseBody)
        }
        response.headerFields[.contentType] = "application/json"
        return (response, responseBody)
    }
}
