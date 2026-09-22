import Foundation

/// Compiles the site's Sass.
///
/// Jekyll compiled `assets/stylesheets/**.scss` through its own Sass converter;
/// Kiln copies assets verbatim, so the two entry points are compiled here by
/// shelling out to `sass` (the same Dart Sass the `.scss` sources target).
///
/// Both entry points carry Jekyll front matter (`layout: source`, which prepends
/// a licence header); it's stripped before compiling.
struct Stylesheets {
    let siteRoot: URL
    let outputDirectory: URL

    /// Entry point → output path, relative to `assets/stylesheets`.
    static let entryPoints: [(source: String, output: String)] = [
        ("application.scss", "application.css"),
        ("new-stylesheets/application.scss", "new-stylesheets/application.css"),
    ]

    static let licenceHeader = """
    /* This source file is part of the Swift.org open source project
     *
     * Copyright (c) 2014 - present Apple Inc. and the Swift project authors
     * Licensed under Apache License v2.0 with Runtime Library Exception
     *
     * See http://swift.org/LICENSE.txt for license information
     * See http://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
     */

    """

    /// Compile both stylesheets into the output tree. Returns the paths written.
    @discardableResult
    func compile() throws -> [String] {
        let stylesheetRoot = siteRoot.appendingPathComponent("assets/stylesheets")
        let destinationRoot = outputDirectory.appendingPathComponent("assets/stylesheets")
        let fileManager = FileManager.default

        // Sass needs the sources without front matter; stage them in a temporary
        // mirror so the repository is never modified.
        let staging = fileManager.temporaryDirectory
            .appendingPathComponent("swift-org-sass-\(ProcessInfo.processInfo.processIdentifier)")
        if fileManager.fileExists(atPath: staging.path) { try fileManager.removeItem(at: staging) }
        try fileManager.copyItem(at: stylesheetRoot, to: staging)
        defer { try? fileManager.removeItem(at: staging) }

        for entry in Self.entryPoints {
            let file = staging.appendingPathComponent(entry.source)
            let contents = try String(contentsOf: file, encoding: .utf8)
            try Self.strippingFrontMatter(contents).write(to: file, atomically: true, encoding: .utf8)
        }

        var written: [String] = []
        for entry in Self.entryPoints {
            let destination = destinationRoot.appendingPathComponent(entry.output)
            try fileManager.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)

            // Compile straight to the destination so `sass` can write the
            // source map beside it, as Jekyll's converter did.
            try Self.runSass(
                input: staging.appendingPathComponent(entry.source),
                output: destination,
                loadPath: staging
            )
            let css = try String(contentsOf: destination, encoding: .utf8)
            try (Self.licenceHeader + css).write(to: destination, atomically: true, encoding: .utf8)
            written.append(entry.output)
        }

        // Hand-written CSS that isn't compiled (the DocC pages' stylesheets).
        let plainCSS = stylesheetRoot.appendingPathComponent("docc")
        if fileManager.fileExists(atPath: plainCSS.path) {
            let destination = destinationRoot.appendingPathComponent("docc")
            if fileManager.fileExists(atPath: destination.path) { try fileManager.removeItem(at: destination) }
            try fileManager.copyItem(at: plainCSS, to: destination)
        }
        return written
    }

    /// Drop a Jekyll front-matter block from the head of a file.
    static func strippingFrontMatter(_ contents: String) -> String {
        guard contents.hasPrefix("---") else { return contents }
        let lines = contents.components(separatedBy: "\n")
        guard let closing = lines.dropFirst().firstIndex(where: { $0.trimmingCharacters(in: .whitespaces) == "---" }) else {
            return contents
        }
        return lines[(closing + 1)...].joined(separator: "\n")
    }

    private static func runSass(input: URL, output: URL, loadPath: URL) throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
        process.arguments = [
            "sass",
            // Jekyll published source maps alongside the CSS.
            "--source-map",
            "--style=compressed",
            "--quiet",
            "--load-path=\(loadPath.path)",
            "\(input.path):\(output.path)",
        ]
        let stdout = Pipe()
        let stderr = Pipe()
        process.standardOutput = stdout
        process.standardError = stderr
        try process.run()

        _ = stdout.fileHandleForReading.readDataToEndOfFile()
        let errorData = stderr.fileHandleForReading.readDataToEndOfFile()
        process.waitUntilExit()

        guard process.terminationStatus == 0 else {
            let message = String(data: errorData, encoding: .utf8) ?? "unknown sass error"
            throw StylesheetError.sassFailed(input.lastPathComponent, message)
        }
    }
}

enum StylesheetError: Error, CustomStringConvertible {
    case sassFailed(String, String)

    var description: String {
        switch self {
        case .sassFailed(let file, let message):
            return "sass failed compiling \(file):\n\(message)"
        }
    }
}
