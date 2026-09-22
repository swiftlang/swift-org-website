import Foundation

/// Converts the Jekyll source tree into the flat `Content/` directory Kiln
/// builds from.
///
/// Nothing in the original tree is modified: each page is read, its front matter
/// is rewritten into the keys Kiln understands (`template:` instead of
/// `layout:`), and the result is written into a staging directory. Posts move
/// from `_posts/YYYY-MM-DD-slug.md` to `blog/slug.md` so Kiln's path-derived
/// URLs land on Jekyll's `/blog/:title/` permalink.
struct ContentConverter {
    /// The repository root, which is also the site root.
    let siteRoot: URL
    let stagingDirectory: URL
    let data: SiteData
    /// The blog posts.
    let postsDirectory: URL
    /// Leaf-native page sources for pages that have been migrated off Liquid.
    ///
    /// A page here shadows the Jekyll file at the same relative path. Every page
    /// now has one, so this is the site's real content; the Jekyll tree is only
    /// still read for `_posts` bodies and the pages' front matter.
    let migratedPagesDirectory: URL

    /// Result of a staging run.
    struct Staged {
        var posts: [Post] = []
        /// Content-relative paths of every staged page, e.g. `install/macos/index.md`.
        var pagePaths: [String] = []
        /// Pages whose Liquid could not be rendered, with the reason.
        var liquidFailures: [String] = []
        /// `redirect_from` sources → destination URL, for the redirect pass.
        var redirects: [(from: String, to: String)] = []
        /// Pages whose Jekyll URL ended in `.html`; the build writes an alias so
        /// both the original and the pretty URL resolve.
        var htmlAliases: [String] = []
        /// Files published byte-for-byte at a fixed path (the `.well-known` records).
        var verbatimFiles: [(path: String, contents: String)] = []
        /// Pages served from `Pages/` — migrated off Liquid onto Leaf.
        var migratedPages: [String] = []
        /// Pages whose body still contains Liquid and so still needs the
        /// interpreter. The migration is done when this is empty.
        var pagesNeedingLiquid: [String] = []
    }

    /// Jekyll layouts mapped onto the Leaf template that replaces them.
    static let layoutTemplates: [String: String] = [
        "page": "page",
        "page-wide": "page-wide",
        "default": "default",
        "base": "default",
        "new-layouts/post": "post",
        "new-layouts/base": "bare",
    ]

    /// Pages that need a bespoke Leaf template rather than the generic wrapper
    /// for their layout. Keyed by source path.
    static let customTemplates: [String: String] = [:]

    func stage() throws -> Staged {
        let fileManager = FileManager.default
        if fileManager.fileExists(atPath: stagingDirectory.path) {
            try fileManager.removeItem(at: stagingDirectory)
        }
        try fileManager.createDirectory(at: stagingDirectory, withIntermediateDirectories: true)

        var staged = Staged()
        try stageWellKnown(into: &staged)
        // Posts are parsed before anything is rendered: `site.posts` and
        // `site.categories` have to exist before a page's Liquid runs.
        let posts = try loadPosts()
        staged.posts = posts

        try writePosts(posts, into: &staged)
        try stagePages(into: &staged)
        try stageGeneratedPackagePages(into: &staged)
        return staged
    }

    // MARK: - Posts

    private func loadPosts() throws -> [Post] {
        let files = try FileManager.default.contentsOfDirectory(atPath: postsDirectory.path)
            .filter { $0.hasSuffix(".md") }
            .sorted()

        var posts: [Post] = []
        for file in files {
            let contents = try String(contentsOf: postsDirectory.appendingPathComponent(file), encoding: .utf8)
            guard let document = SourceDocument(sourcePath: "_posts/\(file)", contents: contents),
                  let post = Post(document: document, fileName: file)
            else { continue }
            posts.append(post)
        }
        // Oldest first, matching Jekyll's `page.previous` / `page.next` ordering.
        posts.sort(by: Post.isOrderedBefore)
        return posts
    }

    private func writePosts(_ posts: [Post], into staged: inout Staged) throws {
        for (index, post) in posts.enumerated() {
            var frontMatter: [String: String] = [
                "title": post.title,
                "template": "post",
                "date": DateFormat.xmlSchema.string(from: post.date),
                "displayDate": DateFormat.display.string(from: post.date),
                "category": post.category,
                "authors": post.authors.joined(separator: ","),
                "description": (post.description ?? post.excerpt).markdownExcerptText,
            ]
            if let url = post.featuredImage["url"].string {
                frontMatter["featuredImage"] = url
                frontMatter["featuredImageAlt"] = post.featuredImage["alt"].string ?? ""
            }
            if let url = post.featuredImageDark["url"].string {
                frontMatter["featuredImageDark"] = url
                frontMatter["featuredImageDarkAlt"] = post.featuredImageDark["alt"].string ?? ""
            }
            if let about = post.about { frontMatter["about"] = about }
            // Previous/next are resolved here rather than in a template: Kiln's
            // nav ordering doesn't know about the blog's date ordering.
            if index > 0 {
                frontMatter["previousTitle"] = posts[index - 1].title
                frontMatter["previousURL"] = posts[index - 1].url
                frontMatter["previousExcerpt"] = posts[index - 1].excerpt.markdownExcerptText
                frontMatter["previousDate"] = DateFormat.display.string(from: posts[index - 1].date)
            }
            if index < posts.count - 1 {
                frontMatter["nextTitle"] = posts[index + 1].title
                frontMatter["nextURL"] = posts[index + 1].url
                frontMatter["nextExcerpt"] = posts[index + 1].excerpt.markdownExcerptText
                frontMatter["nextDate"] = DateFormat.display.string(from: posts[index + 1].date)
            }
            try write(frontMatter: frontMatter, body: post.body, to: post.contentPath)
        }
    }

    /// `_config.yml` lists `.well-known` under `include:`. Its files are records
    /// served verbatim (a `type: text/plain` DID), not pages, so they are
    /// written at their `permalink` with the front matter stripped.
    private func stageWellKnown(into staged: inout Staged) throws {
        let directory = siteRoot.appendingPathComponent(".well-known")
        guard let files = try? FileManager.default.contentsOfDirectory(atPath: directory.path) else { return }
        for file in files where !file.hasPrefix(".") {
            let contents = try String(contentsOf: directory.appendingPathComponent(file), encoding: .utf8)
            guard let document = SourceDocument(sourcePath: ".well-known/\(file)", contents: contents),
                  let permalink = document.frontMatter["permalink"].string
            else { continue }
            staged.verbatimFiles.append((path: permalink, contents: document.body.trimmingCharacters(in: .whitespacesAndNewlines)))
        }
    }

    // MARK: - Generated pages

    /// The pages `_plugins/packages.rb` synthesises: one per package category,
    /// and one per month of the community showcase archive. Both are thin
    /// wrappers around a Leaf template, so they carry no body of their own.
    private func stageGeneratedPackagePages(into staged: inout Staged) throws {
        var generated: [(path: String, title: String, template: String)] = []

        for category in data["packages/packages/categories"].array {
            guard let slug = category["slug"].string, let name = category["name"].string else { continue }
            generated.append((
                path: "packages/\(slug).md",
                title: name,
                template: "package-category"
            ))
        }

        for year in data["packages/showcase-history/years"].array {
            guard let yearValue = year["year"].string else { continue }
            for month in year["months"].array {
                guard let slug = month["slug"].string, let name = month["month"].string else { continue }
                generated.append((
                    path: "packages/showcase-\(slug)-\(yearValue).md",
                    title: "Community Showcase: \(name) \(yearValue)",
                    template: "package-showcase-month"
                ))
            }
        }

        for page in generated {
            // These render through Leaf, not Liquid: the body is a single
            // `#extend`, and `PageContext` supplies the category or month.
            try write(
                frontMatter: [
                    "template": page.template,
                    "title": page.title,
                    "sourcePath": page.path,
                ],
                body: "",
                to: page.path
            )
            staged.migratedPages.append(page.path)
            staged.pagePaths.append(page.path)
            staged.htmlAliases.append("/" + page.path.replacingOccurrences(of: ".md", with: ".html"))
        }
    }

    // MARK: - Pages

    private func stagePages(into staged: inout Staged) throws {
        let fileManager = FileManager.default
        guard let enumerator = fileManager.enumerator(
            at: migratedPagesDirectory,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
        ) else { return }

        while let item = enumerator.nextObject() as? URL {
            guard item.pathExtension.lowercased() == "md" else { continue }
            let relativePath = item.path.replacingOccurrences(of: migratedPagesDirectory.path + "/", with: "")
            let contents = try String(contentsOf: item, encoding: .utf8)
            guard let document = SourceDocument(sourcePath: relativePath, contents: contents) else { continue }
            try stage(page: document, into: &staged)
        }
        staged.pagePaths.sort()
        staged.liquidFailures.sort()
    }

    private func stage(page document: SourceDocument, into staged: inout Staged) throws {
        let source = document.sourcePath

        // `redirect_from` aliases point at this page's own URL, whether or not
        // the page itself then redirects onward. Jekyll accepts either a YAML
        // list or a lone value, so take both: a list that silently read as no
        // aliases would drop the redirects without a word.
        let aliases = document.frontMatter["redirect_from"].array
            .flatMap { ($0.string ?? "").split(separator: ",") }
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
        for alias in aliases {
            staged.redirects.append((from: alias, to: Self.jekyllURL(for: source)))
        }

        // A `redirect_to` page renders nothing but a redirect.
        if let destination = document.frontMatter["redirect_to"].string {
            staged.redirects.append((from: Self.jekyllURL(for: source), to: destination))
            return
        }

        try stageMigrated(document, originalPath: source, into: &staged)
    }

    /// Stage one page: the body is Leaf and markdown, written through
    /// untouched, with content templating switched on when it asks for it.
    private func stageMigrated(_ document: SourceDocument, originalPath: String, into staged: inout Staged) throws {
        // Content templating is opt-in per page. A prose page must leave it off:
        // Swift samples contain `#available(`, `#selector(`, `#Predicate(` and
        // friends, which Leaf would parse as tags.
        var frontMatter: [String: String] = [
            "template": document.frontMatter["template"].string ?? "page",
            "sourcePath": originalPath,
        ]
        if document.frontMatter["contentTemplating"].bool == true {
            frontMatter["contentTemplating"] = "true"
        }
        for key in ["title", "description", "hideTitle", "about", "authors", "platformID", "blogIndex", "official_url"] {
            if let value = document.frontMatter[key].string, !value.isEmpty {
                frontMatter[key] = value
            }
        }
        // A migrated body is Leaf, but its *output* still goes through markdown,
        // so indented markup would be read as a code block just the same.
        let body = Self.dedentingHTMLLines(document.body)
        // Anything left over means the page was only half converted.
        if body.contains("{%") || body.contains("{{") {
            staged.liquidFailures.append("\(originalPath): migrated page still contains Liquid")
        }

        let contentPath = Self.contentPath(for: originalPath, permalink: document.frontMatter["permalink"].string)
        try write(frontMatter: frontMatter, body: body, to: contentPath)
        staged.pagePaths.append(contentPath)
        staged.migratedPages.append(originalPath)

        let url = Self.jekyllURL(for: originalPath)
        if url.hasSuffix(".html") { staged.htmlAliases.append(url) }
    }

    /// Strip leading indentation from markup lines.
    ///
    /// Jekyll's kramdown passes an HTML block through whatever its indentation;
    /// CommonMark treats four or more leading spaces as an indented *code*
    /// block, so an include that indents its markup renders as source text.
    ///
    /// Only markup is dedented — a line opening a tag, and the continuation
    /// lines of a tag whose attributes wrap. Prose keeps its indentation, so
    /// nested markdown lists and genuine indented code are untouched, and the
    /// contents of `<pre>` are left exactly as they are.
    static func dedentingHTMLLines(_ html: String) -> String {
        var insideFence = false
        var insidePre = false
        var insideTag = false
        var output: [String] = []

        for line in html.components(separatedBy: "\n") {
            let trimmed = line.trimmingCharacters(in: .whitespaces)

            if trimmed.hasPrefix("```") || trimmed.hasPrefix("~~~") {
                insideFence.toggle()
                output.append(line)
                continue
            }
            if insideFence {
                output.append(line)
                continue
            }
            if insidePre {
                output.append(line)
                if trimmed.contains("</pre>") { insidePre = false }
                continue
            }

            if insideTag {
                // A tag whose attributes wrap is joined back onto one line: an
                // inline tag like `<a>` only starts a CommonMark HTML block when
                // the whole tag sits on a single line, otherwise the markup is
                // escaped into a paragraph.
                let joined = output.isEmpty ? trimmed : output.removeLast() + " " + trimmed
                output.append(joined)
                insideTag = Self.endsInsideTag(trimmed, startingInsideTag: true)
                if trimmed.contains("<pre"), !trimmed.contains("</pre>") { insidePre = true }
                continue
            }

            output.append(trimmed.hasPrefix("<") ? trimmed : line)
            insideTag = Self.endsInsideTag(trimmed, startingInsideTag: false)
            if trimmed.contains("<pre"), !trimmed.contains("</pre>") { insidePre = true }
        }
        return output.joined(separator: "\n")
    }

    /// Whether a line leaves an HTML tag unterminated.
    private static func endsInsideTag(_ line: String, startingInsideTag: Bool) -> Bool {
        var open = startingInsideTag
        for character in line {
            if character == "<" { open = true }
            if character == ">" { open = false }
        }
        return open
    }

    // MARK: - Path mapping

    /// The URL Jekyll would publish this source path at.
    ///
    /// Jekyll's default page permalink keeps the path and swaps the extension
    /// for `.html`; an `index` file becomes the directory URL.
    static func jekyllURL(for sourcePath: String) -> String {
        var path = sourcePath
        for ext in [".md", ".html"] where path.hasSuffix(ext) {
            path.removeLast(ext.count)
        }
        if path == "index" { return "/" }
        if path.hasSuffix("/index") {
            path.removeLast("index".count)
            return "/" + path
        }
        return "/" + path + ".html"
    }

    /// Where the page is staged so Kiln's path-derived URL matches Jekyll's.
    ///
    /// `a/b/index.md` keeps its shape (`/a/b/`). A non-index page like
    /// `sswg/incubated-packages.md` published at `/sswg/incubated-packages.html`
    /// is staged unchanged — Kiln serves it at `/sswg/incubated-packages/` and
    /// the build writes a `.html` alias next to it.
    static func contentPath(for sourcePath: String, permalink: String?) -> String {
        if let permalink, !permalink.isEmpty {
            var path = permalink
            if path.hasPrefix("/") { path.removeFirst() }
            if path.hasSuffix(".html") { path.removeLast(".html".count) }
            if path.hasSuffix("/") { path += "index" }
            if path.isEmpty { path = "index" }
            return path + ".md"
        }
        var path = sourcePath
        if path.hasSuffix(".html") {
            path.removeLast(".html".count)
            path += ".md"
        }
        return path
    }

    // MARK: - Writing

    private func write(frontMatter: [String: String], body: String, to contentPath: String) throws {
        var yaml = "---\n"
        for key in frontMatter.keys.sorted() {
            guard let value = frontMatter[key], !value.isEmpty else { continue }
            yaml += "\(key): \(Self.yamlScalar(value))\n"
        }
        yaml += "---\n"

        let destination = stagingDirectory.appendingPathComponent(contentPath)
        try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
        try (yaml + body).write(to: destination, atomically: true, encoding: .utf8)
    }

    /// Quote a scalar so punctuation-heavy values survive YAML. Newlines are
    /// escaped rather than flattened — a post's excerpt keeps its line breaks,
    /// which show up in the `description` meta tags.
    static func yamlScalar(_ value: String) -> String {
        let escaped = value
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
        return "\"\(escaped)\""
    }
}
