import Foundation

/// The site's JSON endpoints under `api/`.
///
/// Each is a JSON scaffold with `{{data.path}}` holes naming an entry in
/// ``SiteData``; the hole is replaced by that value encoded as JSON, and the
/// result is published verbatim at the file's path under `/api/`.
struct APIEndpoints {
    let directory: URL
    let data: SiteData

    private static let hole = try? NSRegularExpression(
        pattern: #"\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}"#
    )

    /// Render every endpoint, returning its site path and body.
    func render() throws -> [(path: String, contents: String)] {
        guard let enumerator = FileManager.default.enumerator(at: directory, includingPropertiesForKeys: nil) else {
            return []
        }
        var endpoints: [(path: String, contents: String)] = []
        while let file = enumerator.nextObject() as? URL {
            guard file.pathExtension == "json" else { continue }
            let body = try String(contentsOf: file, encoding: .utf8)
                .trimmingCharacters(in: .whitespacesAndNewlines)
            let relative = file.path.replacingOccurrences(of: directory.path + "/", with: "")
            endpoints.append((path: "/api/" + relative, contents: fill(body)))
        }
        return endpoints
    }

    /// Replace each `{{data.path}}` with that value encoded as JSON.
    private func fill(_ template: String) -> String {
        guard let hole = Self.hole else { return template }
        let matches = hole.matches(in: template, range: NSRange(template.startIndex..., in: template))
        guard !matches.isEmpty else { return template }

        var result = ""
        var cursor = template.startIndex
        for match in matches {
            guard let full = Range(match.range, in: template),
                  let pathRange = Range(match.range(at: 1), in: template)
            else { continue }
            result += template[cursor..<full.lowerBound]
            result += value(at: String(template[pathRange])).json
            cursor = full.upperBound
        }
        result += template[cursor...]
        return result
    }

    /// The value a hole names. Paths are dotted (`_data` nests by directory),
    /// except `sswg-incubation.<maturity>`, the project URLs at that maturity.
    private func value(at path: String) -> DataValue {
        let incubation = "sswg-incubation."
        guard path.hasPrefix(incubation) else {
            return data[path.replacingOccurrences(of: ".", with: "/")]
        }
        let maturity = String(path.dropFirst(incubation.count))
        let projects = data["server-workgroup/projects"].array
        let selected = maturity == "all"
            ? projects
            : projects.filter { $0["maturity"].string == maturity.capitalized }
        return .array(selected.map { $0["url"] })
    }
}
