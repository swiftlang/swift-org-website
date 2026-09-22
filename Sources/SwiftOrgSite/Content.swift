import Foundation
import Yams

/// A source document read from the Jekyll tree: its front matter and body.
struct SourceDocument: Sendable {
    /// Path relative to the repository root, e.g. `install/macos/index.md`.
    var sourcePath: String
    var frontMatter: DataValue
    var body: String

    var title: String? { frontMatter["title"].string }
    var layout: String? { frontMatter["layout"].string }

    /// Whether the document still contains Liquid this port hasn't replaced.
    /// Such pages need a hand-written Leaf template or a Swift renderer; until
    /// they have one they'd emit raw `{% … %}` into the page.
    var containsLiquid: Bool {
        body.contains("{%") || body.contains("{{")
    }

    /// Jekyll's `page.excerpt`: the first block of the body, used for meta
    /// descriptions and cards. Leading blank lines are skipped, so a post whose
    /// body opens with them still gets its first paragraph.
    var excerpt: String {
        let separator = frontMatter["excerpt_separator"].string ?? "\n\n"
        // Leading blank lines are skipped, but the newline that ends the first
        // block is kept — Jekyll's excerpt includes it, and it shows up in the
        // `description` meta tags.
        var text = body
        while let first = text.first, first.isNewline || first == " " { text.removeFirst() }
        if let range = text.range(of: separator) {
            return String(text[text.startIndex..<range.lowerBound]) + "\n"
        }
        return text
    }

    /// Parse front matter, tolerating the duplicate keys Jekyll's YAML parser
    /// accepts (last one wins) but Yams rejects outright.
    private static func loadFrontMatter(_ yaml: String) -> Any? {
        if let loaded = try? Yams.load(yaml: yaml) { return loaded }

        var seen: [String: Int] = [:]
        var lines = yaml.components(separatedBy: "\n")
        for (index, line) in lines.enumerated() {
            guard let colon = line.firstIndex(of: ":"),
                  line.first?.isWhitespace == false
            else { continue }
            let key = String(line[line.startIndex..<colon])
            if let earlier = seen[key] { lines[earlier] = "" }
            seen[key] = index
        }
        return try? Yams.load(yaml: lines.filter { !$0.isEmpty }.joined(separator: "\n"))
    }

    /// Split a file into front matter and body.
    init?(sourcePath: String, contents: String) {
        self.sourcePath = sourcePath
        guard contents.hasPrefix("---") else {
            self.frontMatter = .dictionary([:])
            self.body = contents
            return
        }
        // Find the closing delimiter on its own line.
        let lines = contents.components(separatedBy: "\n")
        guard let closing = lines.dropFirst().firstIndex(where: { $0.trimmingCharacters(in: .whitespaces) == "---" }) else {
            self.frontMatter = .dictionary([:])
            self.body = contents
            return
        }
        let yaml = lines[1..<closing].joined(separator: "\n")
        self.body = lines[(closing + 1)...].joined(separator: "\n")
        self.frontMatter = DataValue(yaml: Self.loadFrontMatter(yaml))
    }
}

/// A blog post from `_posts/`.
struct Post: Sendable {
    var slug: String
    var title: String
    var date: Date
    /// Author usernames, resolved against `_data/authors.yml`.
    var authors: [String]
    var category: String
    var excerpt: String
    var description: String?
    var featuredImage: DataValue
    var featuredImageDark: DataValue
    var body: String
    var about: String?

    /// `/blog/<slug>/`, matching the Jekyll permalink `/blog/:title/`.
    var url: String { "/blog/\(slug)/" }
    /// The staged content path Kiln builds this from.
    var contentPath: String { "blog/\(slug).md" }

    /// Parse `_posts/YYYY-MM-DD-slug.md`. Returns `nil` for unpublished posts
    /// and for files whose name doesn't carry a date.
    init?(document: SourceDocument, fileName: String) {
        // `published: false` hides a post from the build, as in Jekyll.
        if document.frontMatter["published"].bool == false { return nil }

        let base = fileName.hasSuffix(".md") ? String(fileName.dropLast(3)) : fileName
        let parts = base.split(separator: "-", maxSplits: 3, omittingEmptySubsequences: false)
        guard parts.count == 4,
              let year = Int(parts[0]), let month = Int(parts[1]), let day = Int(parts[2])
        else { return nil }
        self.slug = String(parts[3])

        // Jekyll takes the date from front matter when present — it overrides
        // the filename entirely, not just the time of day — and falls back to
        // the date encoded in the filename otherwise.
        // A front-matter date carries no offset, and Jekyll reads it as UTC
        // before rendering in the site's timezone — so a post timestamped
        // `02:00` shows the previous day. The filename fallback is a plain local
        // date, so it is read in the site timezone instead.
        var utc = Calendar(identifier: .gregorian)
        utc.timeZone = .gmt
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: -4 * 3600) ?? .gmt
        let rawDate = document.frontMatter["date"].string
        // A value YAML recognised as a timestamp is UTC and carries the marker
        // `SiteData` appended; anything else — a date-only scalar, or a time
        // without seconds, which YAML leaves as a string — is site-local.
        let dateCalendar = (rawDate?.hasSuffix(" +0000") == true) ? utc : calendar
        if let raw = rawDate, let parsed = Post.parseDate(raw, calendar: dateCalendar) {
            self.date = parsed
        } else {
            var components = DateComponents()
            components.year = year
            components.month = month
            components.day = day
            guard let fallback = calendar.date(from: components) else { return nil }
            self.date = fallback
        }

        self.title = document.frontMatter["title"].string ?? self.slug
        self.authors = document.frontMatter["author"].array.compactMap { $0.string }
        self.category = document.frontMatter["category"].string ?? ""
        self.excerpt = document.excerpt
        self.description = document.frontMatter["description"].string
        self.featuredImage = document.frontMatter["featured-image"]
        self.featuredImageDark = document.frontMatter["featured-image-dark"]
        self.about = document.frontMatter["about"].string
        self.body = document.body
    }

    /// Parse a Jekyll `date:` value — `2025-02-01`, `2025-02-01 6:00:00`, or the
    /// `yyyy-MM-dd HH:mm:ss` form `SiteData` normalises a YAML timestamp into.
    /// Interpreted in the site's timezone, as Jekyll does.
    static func parseDate(_ raw: String, calendar: Calendar) -> Date? {
        let pieces = raw.replacingOccurrences(of: " +0000", with: "").split(separator: " ")
        let dateParts = pieces[0].split(separator: "-").compactMap { Int($0) }
        guard dateParts.count == 3 else { return nil }

        var components = DateComponents()
        components.year = dateParts[0]
        components.month = dateParts[1]
        components.day = dateParts[2]
        if pieces.count > 1 {
            let time = pieces[1].split(separator: ":").compactMap { Int($0) }
            components.hour = time.count > 0 ? time[0] : 0
            components.minute = time.count > 1 ? time[1] : 0
            components.second = time.count > 2 ? time[2] : 0
        }
        return calendar.date(from: components)
    }
}

extension Post {
    /// Jekyll's post ordering: by date, and for posts sharing a date by their
    /// file path — which, since the date prefix is then equal, comes down to the
    /// slug. Oldest first; `site.posts` is this reversed.
    static func isOrderedBefore(_ left: Post, _ right: Post) -> Bool {
        if left.date != right.date { return left.date < right.date }
        return left.slug < right.slug
    }

    /// A fallback display title derived from a staged content path, used for the
    /// `UnlistedPage` entries (Kiln only shows it when a page has neither
    /// `title:` front matter nor a leading heading).
    static func title(forContentPath path: String) -> String {
        var name = path
        if name.hasSuffix(".md") { name.removeLast(3) }
        if name.hasSuffix("/index") { name.removeLast("/index".count) }
        let last = name.split(separator: "/").last.map(String.init) ?? name
        return last
            .split(whereSeparator: { $0 == "-" || $0 == "_" })
            .map { $0.prefix(1).uppercased() + $0.dropFirst() }
            .joined(separator: " ")
    }
}
