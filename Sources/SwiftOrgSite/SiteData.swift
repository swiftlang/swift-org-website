import Foundation
import Yams

/// A decoded YAML/JSON value from the site's `_data` tree.
///
/// Jekyll exposes `_data/**` to templates as `site.data.<path>`; Kiln has no
/// equivalent, so we load the same tree ourselves and hand it to the component
/// renderers. Values stay dynamic (rather than being decoded into concrete
/// types) because the data is authored as free-form YAML and shapes vary widely
/// between files.
indirect enum DataValue: Sendable {
    case string(String)
    case int(Int)
    case double(Double)
    case bool(Bool)
    case array([DataValue])
    case dictionary([String: DataValue])
    case null

    // MARK: Scalar accessors

    /// The value as a string, converting numbers and booleans. `nil` for
    /// containers and null, so `if let` reads as "is there a usable value here".
    var string: String? {
        switch self {
        case .string(let value): return value
        case .int(let value): return String(value)
        case .double(let value): return String(value)
        case .bool(let value): return value ? "true" : "false"
        case .array, .dictionary, .null: return nil
        }
    }

    var int: Int? {
        switch self {
        case .int(let value): return value
        case .double(let value): return Int(value)
        case .string(let value): return Int(value)
        default: return nil
        }
    }

    var bool: Bool? {
        switch self {
        case .bool(let value): return value
        case .string(let value): return ["true", "yes", "1"].contains(value.lowercased())
        default: return nil
        }
    }

    /// The value as an array. A single scalar reads as a one-element array, which
    /// matches how the Jekyll templates treat fields that are sometimes a list
    /// and sometimes a lone value.
    var array: [DataValue] {
        switch self {
        case .array(let values): return values
        case .null: return []
        default: return [self]
        }
    }

    var dictionary: [String: DataValue] {
        if case .dictionary(let values) = self { return values }
        return [:]
    }

    var isEmpty: Bool {
        switch self {
        case .null: return true
        case .string(let value): return value.isEmpty
        case .array(let values): return values.isEmpty
        case .dictionary(let values): return values.isEmpty
        default: return false
        }
    }

    // MARK: Traversal

    /// Look up a child by key; `.null` when absent, so chained lookups never trap.
    subscript(key: String) -> DataValue {
        if case .dictionary(let values) = self { return values[key] ?? .null }
        return .null
    }

    subscript(index: Int) -> DataValue {
        let values = array
        guard values.indices.contains(index) else { return .null }
        return values[index]
    }

    /// Look up a nested value with a slash- or dot-separated path, e.g.
    /// `"new-data/landing/callouts"` — the same address Jekyll writes as
    /// `site.data.new-data.landing.callouts`. Numeric components index arrays.
    func path(_ path: String) -> DataValue {
        var current = self
        for component in path.split(whereSeparator: { $0 == "/" || $0 == "." }) {
            if let index = Int(component) {
                current = current[index]
            } else {
                current = current[String(component)]
            }
            if case .null = current { return .null }
        }
        return current
    }
}

extension DataValue {
    /// Build a `DataValue` from the `Any` graph Yams produces.
    init(yaml value: Any?) {
        switch value {
        case nil, is NSNull:
            self = .null
        case let value as String:
            self = .string(value)
        case let value as Bool:
            self = .bool(value)
        case let value as Int:
            self = .int(value)
        case let value as Double:
            self = .double(value)
        case let value as Date:
            // Yams parses unquoted ISO-ish scalars as dates. Normalise back to
            // the authored form: date-only when the scalar carried no time,
            // otherwise date and time — the difference matters both for the JSON
            // endpoints and for ordering posts published on the same day.
            // A YAML timestamp carries no offset, which the spec defines as UTC —
            // so the marker is kept, because a value YAML *didn't* recognise as a
            // timestamp (`11:30`, no seconds) stays a string and is read in the
            // site's timezone instead. Midnight means the scalar was date-only.
            let formatted = SiteData.yamlDateFormatter.string(from: value)
            if formatted.hasSuffix(" 00:00:00") {
                self = .string(String(formatted.dropLast(9)))
            } else {
                self = .string(formatted + " +0000")
            }
        case let value as [Any?]:
            self = .array(value.map { DataValue(yaml: $0) })
        case let value as [AnyHashable: Any?]:
            var result: [String: DataValue] = [:]
            for (key, child) in value {
                result[String(describing: key)] = DataValue(yaml: child)
            }
            self = .dictionary(result)
        default:
            self = .string(String(describing: value!))
        }
    }
}

/// The site's `_data` directory, loaded once and addressed by path.
///
/// Mirrors Jekyll's convention: `_data/builds/swift_releases.yml` is reachable
/// as `data.path("builds/swift_releases")`, and directories nest.
struct SiteData: Sendable {
    let root: DataValue

    static let yamlDateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(identifier: "UTC")
        // Includes the time: Yams turns `date: 2015-12-03 12:01:01` into a
        // `Date`, and dropping the time would collapse the ordering of posts
        // published on the same day.
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        return formatter
    }()

    /// Recursively load every YAML/JSON file under `directory`.
    init(directory: URL) throws {
        self.root = try Self.load(directory: directory)
    }

    private static func load(directory: URL) throws -> DataValue {
        let fileManager = FileManager.default
        guard let entries = try? fileManager.contentsOfDirectory(
            at: directory,
            includingPropertiesForKeys: [.isDirectoryKey],
            options: [.skipsHiddenFiles]
        ) else { return .dictionary([:]) }

        var result: [String: DataValue] = [:]
        for entry in entries.sorted(by: { $0.lastPathComponent < $1.lastPathComponent }) {
            let isDirectory = (try? entry.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) ?? false
            if isDirectory {
                result[entry.lastPathComponent] = try load(directory: entry)
                continue
            }
            let ext = entry.pathExtension.lowercased()
            guard ["yml", "yaml", "json"].contains(ext) else { continue }
            let text = try String(contentsOf: entry, encoding: .utf8)
            let name = entry.deletingPathExtension().lastPathComponent
            result[name] = DataValue(yaml: try Yams.load(yaml: text))
        }
        return .dictionary(result)
    }

    /// Look up a value by its Jekyll-style data path.
    func path(_ path: String) -> DataValue { root.path(path) }

    subscript(path: String) -> DataValue { root.path(path) }
}

// MARK: - Leaf

import LeafKit

extension DataValue {
    /// The value as `LeafData`, so templates can iterate `_data` directly.
    var leafData: LeafData {
        switch self {
        case .string(let value): return .string(value)
        case .int(let value): return .int(value)
        case .double(let value): return .double(value)
        case .bool(let value): return .bool(value)
        case .null: return .trueNil
        case .array(let values): return .array(values.map(\.leafData))
        case .dictionary(let values):
            return .dictionary(values.reduce(into: [:]) { result, entry in
                result[DataValue.leafKey(entry.key)] = entry.value.leafData
            })
        }
    }

    /// Leaf parses `.` as path separators and `-` as an operator, so a key like
    /// `new-data` is exposed as `new_data`.
    static func leafKey(_ key: String) -> String {
        String(key.map { $0 == "-" ? "_" : $0 })
    }

    /// The same tree, with every node also reachable as `{ "content": node }`.
    ///
    /// The page components take their data as a `content` key
    /// (`#extend("partials/components/card-grid", boxed.a.b)`), and Leaf's
    /// `#extend(_:context)` needs a dictionary. Pre-wrapping every node means a
    /// page can point a component straight at its data with no per-page context.
    var boxedLeafData: LeafData {
        guard case .dictionary(let children) = self else { return leafData }
        var result: [String: LeafData] = ["content": leafData]
        for (key, child) in children {
            let name = DataValue.leafKey(key)
            // A data key literally called `content` would shadow the wrapper;
            // the site has none, and this keeps the rule obvious if one appears.
            if name == "content" { continue }
            result[name] = child.boxedLeafData
        }
        return .dictionary(result)
    }
}

extension DataValue {
    /// The value as JSON, matching Liquid's `jsonify`.
    var json: String {
        switch self {
        case .null: return "null"
        case .bool(let flag): return flag ? "true" : "false"
        case .int(let value): return String(value)
        case .double(let value): return String(value)
        case .string(let text):
            var escaped = ""
            for character in text {
                switch character {
                case "\"": escaped += "\\\""
                case "\\": escaped += "\\\\"
                case "\n": escaped += "\\n"
                case "\r": escaped += "\\r"
                case "\t": escaped += "\\t"
                default:
                    if let ascii = character.asciiValue, ascii < 0x20 {
                        escaped += String(format: "\\u%04x", Int(ascii))
                    } else {
                        escaped.append(character)
                    }
                }
            }
            return "\"\(escaped)\""
        case .array(let items):
            return "[" + items.map(\.json).joined(separator: ",") + "]"
        case .dictionary(let values):
            return "{" + values.keys.sorted().map { "\"\($0)\":\(values[$0]!.json)" }.joined(separator: ",") + "}"
        }
    }
}
