import Foundation

/// Everything that runs over Kiln's output to finish the port: syntax
/// highlighting, Jekyll's redirect and `.html` page URLs, the Atom feed, and the
/// site's `assets/` tree.
struct PostProcessor {
    let outputDirectory: URL
    let siteRoot: URL
    let siteURL: String

    // MARK: - Redirects and aliases

    /// Write the meta-refresh pages `jekyll-redirect-from` generates.
    func writeRedirects(_ redirects: [(from: String, to: String)]) throws {
        for redirect in redirects {
            try writeRedirectPage(at: redirect.from, to: redirect.to)
        }
    }

    /// Jekyll publishes non-index pages at `…/name.html`; Kiln publishes them at
    /// `…/name/`. Copy each page to its `.html` URL so existing links keep
    /// working (the site links to `.html` URLs throughout, e.g. from the footer).
    func writeHTMLAliases(_ urls: [String]) throws {
        for url in urls {
            let pretty = String(url.dropLast(".html".count)) + "/index.html"
            let source = outputDirectory.appendingPathComponent(pretty)
            guard FileManager.default.fileExists(atPath: source.path) else { continue }
            let destination = outputDirectory.appendingPathComponent(url)
            try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
            if FileManager.default.fileExists(atPath: destination.path) {
                try FileManager.default.removeItem(at: destination)
            }
            try FileManager.default.copyItem(at: source, to: destination)
        }
    }

    private func writeRedirectPage(at path: String, to destination: String) throws {
        var relative = path
        if relative.hasPrefix("/") { relative.removeFirst() }
        if relative.isEmpty { return }
        if relative.hasSuffix("/") { relative += "index.html" }
        else if !relative.hasSuffix(".html") { relative += "/index.html" }

        let target = destination.hasPrefix("http") ? destination : siteURL + destination
        let html = """
        <!DOCTYPE html>
        <html lang="en-US">
          <meta charset="utf-8" />
          <title>Redirecting…</title>
          <link rel="canonical" href="\(HTML.escape(target))" />
          <meta http-equiv="refresh" content="0; url=\(HTML.escape(target))" />
          <meta name="robots" content="noindex" />
          <h1>Redirecting…</h1>
          <a href="\(HTML.escape(target))">Click here if you are not redirected.</a>
        </html>
        """
        let file = outputDirectory.appendingPathComponent(relative)
        try FileManager.default.createDirectory(at: file.deletingLastPathComponent(), withIntermediateDirectories: true)
        // Never clobber a real page with a redirect stub.
        guard !FileManager.default.fileExists(atPath: file.path) else { return }
        try html.write(to: file, atomically: true, encoding: .utf8)
    }

    /// Write the files published verbatim at a fixed path (`.well-known`).
    func writeVerbatimFiles(_ files: [(path: String, contents: String)]) throws {
        for file in files {
            var relative = file.path
            if relative.hasPrefix("/") { relative.removeFirst() }
            let destination = outputDirectory.appendingPathComponent(relative)
            try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
            try file.contents.write(to: destination, atomically: true, encoding: .utf8)
        }
    }

    // MARK: - Feeds

    /// The Atom feed at `/atom.xml`, matching the Jekyll template: the 20 most
    /// recent posts, newest first, with full rendered content.
    func writeAtomFeed(posts: [Post], authors: DataValue, siteTitle: String, buildTime: Date) throws {
        let recent = posts.sorted(by: Post.isOrderedBefore).reversed().prefix(20)
        var xml = """
        <?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title type="text" xml:lang="en">\(HTML.escape(siteTitle))</title>
          <link type="application/atom+xml" href="\(siteURL)/atom.xml" rel="self"/>
          <link type="text/html" href="" rel="alternate"/>
          <updated>\(DateFormat.xmlSchema.string(from: buildTime))</updated>
          <id>tag:swift.org,2015-12-03:Swift</id>

        """
        for post in recent {
            // Re-read the rendered page so the feed carries the same HTML the
            // site serves (Jekyll's feed uses `post.content`).
            let renderedPath = outputDirectory.appendingPathComponent("blog/\(post.slug)/index.html")
            let content = (try? String(contentsOf: renderedPath, encoding: .utf8)).flatMap(Self.articleBody) ?? post.body
            xml += "  <entry>\n"
            xml += "    <title>\(Self.xmlEscape(post.title))</title>\n"
            // The feed carries display names; posts reference authors by the
            // username that keys `Data/authors.yml`.
            let names = post.authors.isEmpty
                ? ["Swift.org"]
                : post.authors.map { authors[$0]["name"].string ?? "Swift.org" }
            for name in names {
                xml += "    <author><name>\(Self.xmlEscape(name))</name></author>\n"
            }
            xml += "    <link href=\"\(siteURL)\(post.url)\"/>\n"
            xml += "    <updated>\(DateFormat.xmlSchema.string(from: post.date))</updated>\n"
            xml += "    <id>\(siteURL)\(post.url)</id>\n"
            xml += "    <content type=\"html\">\(Self.xmlEscapeContent(content))</content>\n"
            xml += "  </entry>\n"
        }
        xml += "</feed>\n"
        try xml.write(to: outputDirectory.appendingPathComponent("atom.xml"), atomically: true, encoding: .utf8)
    }

    /// XML escaping for the feed: the Jekyll template interpolated titles and
    /// author names directly, so only the characters XML actually requires are
    /// escaped — an apostrophe stays an apostrophe.
    private static func xmlEscape(_ text: String) -> String {
        text.replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    /// Liquid's `xml_escape`, which the feed applied to each post's HTML — the
    /// same five entities, with `&apos;` for an apostrophe.
    private static func xmlEscapeContent(_ text: String) -> String {
        xmlEscape(text)
            .replacingOccurrences(of: "\"", with: "&quot;")
            .replacingOccurrences(of: "'", with: "&apos;")
    }

    /// Pull the post body out of a rendered page for the feed.
    private static func articleBody(_ html: String) -> String? {
        guard let start = html.range(of: "<div class=\"details\">"),
              let end = html.range(of: "<hr />", range: start.upperBound..<html.endIndex)
        else { return nil }
        return String(html[start.upperBound..<end.lowerBound])
    }

    // MARK: - Assets

    /// Publish the repository's `assets/` tree and root-level static files.
    ///
    /// `assets/` is ~79 MB, so its static subdirectories are symlinked rather
    /// than copied — the build stays fast and a static server resolves through
    /// them. `assets/stylesheets` is left alone: it holds the freshly compiled
    /// CSS, which must be a real directory. A deploy that needs a self-contained
    /// tree can dereference the links (`cp -RL`).
    func linkAssets() throws {
        let fileManager = FileManager.default
        let source = siteRoot.appendingPathComponent("assets")
        let destination = outputDirectory.appendingPathComponent("assets")
        try fileManager.createDirectory(at: destination, withIntermediateDirectories: true)

        for name in try fileManager.contentsOfDirectory(atPath: source.path) {
            // Compiled by `Stylesheets`; never link over it.
            guard name != "stylesheets", !name.hasPrefix(".") else { continue }
            let link = destination.appendingPathComponent(name)
            if fileManager.fileExists(atPath: link.path) || (try? link.checkResourceIsReachable()) == true {
                try? fileManager.removeItem(at: link)
            }
            try fileManager.createSymbolicLink(at: link, withDestinationURL: source.appendingPathComponent(name))
        }

        // Icons, robots.txt and the licences live at the site root in Jekyll.
        let rootFiles = try fileManager.contentsOfDirectory(atPath: siteRoot.path).filter { name in
            name.hasSuffix(".png") || name.hasSuffix(".ico") || name == "robots.txt"
                || name == "LICENSE.txt" || name == "CC-BY-4.0.txt"
        }
        for name in rootFiles {
            let target = outputDirectory.appendingPathComponent(name)
            if fileManager.fileExists(atPath: target.path) { continue }
            try fileManager.copyItem(at: siteRoot.appendingPathComponent(name), to: target)
        }
    }

    /// Copy `Static/` into the site root.
    ///
    /// Jekyll published any file without front matter verbatim; the only such
    /// files left are the OpenAPI spec and its viewer.
    func copyStaticFiles(from directory: URL) throws {
        let fileManager = FileManager.default
        guard let enumerator = fileManager.enumerator(at: directory, includingPropertiesForKeys: [.isRegularFileKey]) else {
            return
        }
        while let item = enumerator.nextObject() as? URL {
            guard (try? item.resourceValues(forKeys: [.isRegularFileKey]).isRegularFile) == true else { continue }
            let relative = item.path.replacingOccurrences(of: directory.path + "/", with: "")
            let destination = outputDirectory.appendingPathComponent(relative)
            try fileManager.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
            if fileManager.fileExists(atPath: destination.path) { try fileManager.removeItem(at: destination) }
            try fileManager.copyItem(at: item, to: destination)
        }
    }

    // MARK: - Helpers

    func htmlFiles() throws -> [URL] {
        guard let enumerator = FileManager.default.enumerator(
            at: outputDirectory,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
        ) else { return [] }
        var files: [URL] = []
        while let item = enumerator.nextObject() as? URL {
            if item.pathExtension.lowercased() == "html" { files.append(item) }
        }
        return files
    }
}
