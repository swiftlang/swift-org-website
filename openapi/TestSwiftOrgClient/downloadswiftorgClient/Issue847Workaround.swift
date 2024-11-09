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
