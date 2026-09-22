import Foundation

/// Swift ports of the site's data-driven Liquid includes (`_includes/**`).
///
/// Each function takes the loaded `_data` tree plus the current page URL (for
/// active-link state) and returns an HTML fragment. Templates reach them through
/// the `#component(…)` Leaf tag; the purely static includes (the logo, the
/// colour-scheme toggle) stay in Leaf as partials.
struct Components: Sendable {
    let data: SiteData
    let posts: [Post]

    // MARK: - Authors

    /// `_includes/authors.html` — the byline block shared by posts and pages.
    ///
    /// `usernames` are keys into `_data/authors.yml`; an unknown key renders
    /// nothing, matching the Liquid's `{% if author.name %}` guard.
    func authors(_ usernames: [String], compact: Bool = false, fullwidth: Bool = false, about pageAbout: String? = nil) -> String {
        let registry = data["authors"]
        var html = "<div\(HTML.classAttribute("authors", compact ? "compact" : nil, fullwidth ? "fullwidth" : nil))>"
        for username in usernames {
            let author = registry[username]
            guard let name = author["name"].string, !name.isEmpty else { continue }

            let imageURL: String
            if let gravatar = author["gravatar"].string, !gravatar.isEmpty {
                imageURL = "https://www.gravatar.com/avatar/\(gravatar)?s=64&d=mp"
            } else if let github = author["github"].string, !github.isEmpty {
                imageURL = "https://www.github.com/\(github).png?size=64"
            } else {
                imageURL = "https://www.gravatar.com/avatar/dummy?s=64&d=mp&f=y"
            }

            let about = author["about"].string ?? ""
            let nameMarkup: String
            if let github = author["github"].string, !github.isEmpty {
                nameMarkup = """
                <a href="https://github.com/\(HTML.escape(github))/" rel="nofollow" \
                title="\(HTML.escape(name)) (@\(HTML.escape(github))) on GitHub">\(HTML.escape(name))</a>
                """
            } else {
                nameMarkup = HTML.escape(name)
            }

            html += """
            <div class="author">
            <div class="byline">
            <img src="\(HTML.escape(imageURL))" alt="\(HTML.escape(name))" title="\(HTML.escape(compact ? about : ""))" />
            <span class="author">\(nameMarkup)</span>
            </div>
            """
            if !compact {
                // The Liquid prefers the page's own `about:` over the author's.
                let resolved = (pageAbout?.isEmpty == false ? pageAbout : nil) ?? (about.isEmpty ? nil : about)
                if let resolved {
                    html += #"<div class="about">\#(HTML.escape(resolved))</div>"#
                }
            }
            html += "</div>"
        }
        return html + "</div>"
    }

    // MARK: - Cards

    /// `_includes/new-includes/components/content-card.html`
    func contentCard(title: String, url: String, excerpt: String, date: Date?, cta: String = "Read more") -> String {
        var html = #"<div class="content-card">"#
        html += #"<span class="content-card-title title-4">\#(HTML.escape(title))</span>"#
        if let date {
            html += """
            <time class="content-card-date body" pubdate datetime="\(DateFormat.xmlSchema.string(from: date))">\
            \(DateFormat.display.string(from: date))</time>
            """
        }
        html += #"<p class="content-card-excerpt body">\#(HTML.escape(excerpt.strippingHTML))</p>"#
        html += #"<a class="content-card-cta body" href="\#(HTML.escape(url))">\#(HTML.escape(cta))</a>"#
        return html + "</div>"
    }

    /// `_includes/new-includes/components/callout.html` — the alternating
    /// text/code blocks that make up the home page's three "pillar" sections.
    func callout(_ callout: DataValue, index: Int) -> String {
        let code = callout["code"].string
        let hasCode = !(code ?? "").isEmpty
        // The Liquid alternates sides on even indices (`index | modulo: 2 == 0`).
        let isReversed = index % 2 == 0

        var html = "<div\(HTML.classAttribute("callout", isReversed ? "reverse" : nil, hasCode ? "with-code" : nil))>"
        html += #"<div class="text">"#
        if let title = callout["title"].string, !title.isEmpty {
            html += #"<h3 class="callout-title title-1">\#(HTML.escape(title))</h3>"#
        }
        if let subtitle = callout["subtitle"].string, !subtitle.isEmpty {
            html += #"<p class="callout-subtitle title-2">\#(HTML.escape(subtitle))</p>"#
        }
        if let text = callout["text"].string, !text.isEmpty {
            html += #"<p class="callout-text body">\#(HTML.escape(text))</p>"#
        }
        html += "</div>"

        if let code, hasCode {
            html += #"<div class="code">\#(CodeBlock.render(code))</div>"#
        }

        let links = callout["links"].array
        if !links.isEmpty {
            html += #"<div class="links">"#
            for link in links {
                html += #"<a href="\#(HTML.escape(link["link"].string ?? ""))">\#(HTML.escape(link["text"].string ?? ""))</a>"#
            }
            html += "</div>"
        }
        return html + "</div>"
    }
}

/// Date formats the Jekyll templates use, reproduced exactly.
enum DateFormat {
    /// `date_to_xmlschema` — the `datetime` attribute and Atom feed timestamps.
    static let xmlSchema: DateFormatter = formatter("yyyy-MM-dd'T'HH:mm:ssXXXXX")
    /// `date: "%B %-d, %Y"` — e.g. `February 1, 2025`.
    static let display: DateFormatter = formatter("MMMM d, yyyy")

    private static func formatter(_ format: String) -> DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        // Jekyll renders in the site's configured zone (America/Lower_Princes,
        // a fixed UTC-4 with no DST), so dates never shift between builds.
        formatter.timeZone = TimeZone(secondsFromGMT: -4 * 3600)
        formatter.dateFormat = format
        return formatter
    }
}
