import Foundation
import LeafKit

/// The `#component("name", …)` Leaf tag: the bridge from templates to the Swift
/// component renderers in ``Components``.
///
/// LeafKit 1.x can't iterate a tag's result (`#for(x in tag())` fails to parse),
/// so every fragment built from `_data` is rendered to HTML here and emitted
/// with `#unsafeHTML(component(…))`.
///
/// The tag reads the current page's URL out of the render context, so components
/// can mark the active navigation item without it being passed in.
struct ComponentTag: LeafTag {
    let components: Components

    func render(_ ctx: LeafContext) throws -> LeafData {
        let arguments = ctx.parameters.compactMap { $0.string }
        guard let name = arguments.first else { return .string("") }
        let rest = Array(arguments.dropFirst())

        let page = ctx.data["page"]?.dictionary ?? [:]
        let frontMatter = page["frontMatter"]?.dictionary ?? [:]
        func field(_ key: String) -> String? {
            let value = frontMatter[key]?.string
            return (value?.isEmpty == false) ? value : nil
        }

        switch name {




        case "authors":
            // Authors come from the staged front matter as a comma-separated list.
            let usernames = (field("authors") ?? "").split(separator: ",").map { String($0).trimmingCharacters(in: .whitespaces) }
            guard !usernames.isEmpty else { return .string("") }
            let compact = rest.contains("compact") || (rest.contains("auto-compact") && usernames.count > 1)
            return .string(components.authors(
                usernames,
                compact: compact,
                fullwidth: rest.contains("fullwidth"),
                about: field("about")
            ))

        case "post-navigation":
            return .string(postNavigation(field: field))


        case "post-authors-footer":
            // The post layout repeats the full (non-compact) author block below
            // the article when a post has more than one author.
            let usernames = (field("authors") ?? "").split(separator: ",").map { String($0).trimmingCharacters(in: .whitespaces) }
            guard usernames.count > 1 else { return .string("") }
            return .string("<hr /><h2>Authors</h2>" + components.authors(usernames, about: field("about")))

        default:
            // An unknown component is a template bug; make it visible in the
            // output rather than silently rendering nothing.
            return .string("<!-- unknown component: \(HTML.escape(name)) -->")
        }
    }

    /// The "Continue Reading" cards at the foot of a post, built from the
    /// previous/next fields the converter resolved.
    private func postNavigation(field: (String) -> String?) -> String {
        var cards: [String] = []
        for prefix in ["previous", "next"] {
            guard let title = field("\(prefix)Title"), let url = field("\(prefix)URL") else { continue }
            cards.append("<li>" + components.contentCard(
                title: title,
                url: url,
                excerpt: field("\(prefix)Excerpt") ?? "",
                date: field("\(prefix)Date").flatMap { DateFormat.display.date(from: $0) }
            ) + "</li>")
        }
        guard !cards.isEmpty else { return "" }
        return """
        <nav class="section card-grid"><div class="content">
        <ul class="content-card-grid">\(cards.joined())</ul>
        </div></nav>
        """
    }
}
