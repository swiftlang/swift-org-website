import Foundation

/// Minimal helpers for assembling HTML fragments.
///
/// The data-driven parts of the site are rendered here in Swift rather than in
/// Leaf: LeafKit 1.x can't iterate the result of a tag call (`#for(x in tag())`
/// is a parse error), so anything that loops over `_data` has to produce its
/// markup before it reaches a template.
enum HTML {
    /// Escape text for use in element content or a double-quoted attribute.
    static func escape(_ text: String) -> String {
        var result = ""
        result.reserveCapacity(text.count)
        for character in text {
            switch character {
            case "&": result += "&amp;"
            case "<": result += "&lt;"
            case ">": result += "&gt;"
            case "\"": result += "&quot;"
            case "'": result += "&#39;"
            default: result.append(character)
            }
        }
        return result
    }

    /// Render `attribute="value"`, or nothing when the value is absent/empty.
    static func attribute(_ name: String, _ value: String?) -> String {
        guard let value, !value.isEmpty else { return "" }
        return " \(name)=\"\(escape(value))\""
    }

    /// A `class="…"` attribute built from the non-empty names given.
    static func classAttribute(_ names: String?...) -> String {
        let present = names.compactMap { $0 }.filter { !$0.isEmpty }
        guard !present.isEmpty else { return "" }
        return " class=\"\(escape(present.joined(separator: " ")))\""
    }
}

extension String {
    /// A URL-path-safe slug, matching Jekyll's `slugify` closely enough for the
    /// identifiers the site derives from titles (categories, tags, headings).
    var slugified: String {
        var result = ""
        var lastWasHyphen = false
        for character in self.lowercased() {
            if character.isLetter || character.isNumber {
                result.append(character)
                lastWasHyphen = false
            } else if !lastWasHyphen, !result.isEmpty {
                result.append("-")
                lastWasHyphen = true
            }
        }
        while result.hasSuffix("-") { result.removeLast() }
        return result
    }

    /// Strip HTML tags, as Liquid's `strip_html` does — tags only, leaving the
    /// surrounding whitespace alone (a post excerpt keeps its trailing newline,
    /// which shows up in the `description` meta tags).
    var strippingHTML: String {
        var result = ""
        var insideTag = false
        for character in self {
            if character == "<" { insideTag = true }
            else if character == ">" { insideTag = false }
            else if !insideTag { result.append(character) }
        }
        return result
    }

    /// Liquid's `strip_newlines`.
    var strippingNewlines: String {
        filter { !$0.isNewline }.reduce(into: "") { $0.append($1) }
    }
}

extension String {
    /// The plain text of a markdown excerpt, as Jekyll's
    /// `post.excerpt | strip_html` produced: the markdown is rendered, so link
    /// syntax collapses to its text and the typographic substitutions apply.
    var markdownExcerptText: String {
        var text = self

        // Images render as `<img>`, which `strip_html` removes entirely — alt
        // text included. Both inline and reference forms.
        text = text.replacingMatches(of: "!\\[[^\\]]*\\]\\([^)]*\\)", with: "")
        text = text.replacingMatches(of: "!\\[[^\\]]*\\]\\[[^\\]]*\\]", with: "")
        // Links keep their text, inline and reference forms alike.
        text = text.replacingMatches(of: "\\[([^\\]]*)\\]\\([^)]*\\)", with: "$1")
        text = text.replacingMatches(of: "\\[([^\\]]*)\\]\\[[^\\]]*\\]", with: "$1")
        // Shortcut reference links — `[Swift Package Manager]`, defined further
        // down the post — resolve to their text as well.
        text = text.replacingMatches(of: "\\[([^\\]\\n]+)\\](?![\\[(])", with: "$1")
        // Emphasis and inline code markers.
        text = text.replacingMatches(of: "\\*\\*([^*]+)\\*\\*", with: "$1")
        text = text.replacingMatches(of: "\\*([^*]+)\\*", with: "$1")
        text = text.replacingMatches(of: "(?<![A-Za-z0-9_])_([^_]+)_(?![A-Za-z0-9_])", with: "$1")
        // Code spans are exempt from smart punctuation — `--repl` must stay
        // `--repl` — so they are set aside while it is applied.
        var codeSpans: [String] = []
        text = text.replacingMatches(of: "`([^`]+)`", with: "\u{1}$1\u{1}")
        while let start = text.firstIndex(of: "\u{1}"),
              let end = text[text.index(after: start)...].firstIndex(of: "\u{1}") {
            codeSpans.append(String(text[text.index(after: start)..<end]))
            text.replaceSubrange(start...end, with: "\u{2}\(codeSpans.count - 1)\u{2}")
        }

        text = text.replacingOccurrences(of: "...", with: "…")
        text = text.replacingOccurrences(of: "---", with: "—")
        text = text.replacingOccurrences(of: "--", with: "–")
        text = Self.applyingSmartQuotes(to: text)

        for (index, span) in codeSpans.enumerated() {
            text = text.replacingOccurrences(of: "\u{2}\(index)\u{2}", with: span)
        }

        // Character entities the markdown source writes literally.
        for (entity, character) in [
            ("&mdash;", "—"), ("&ndash;", "–"), ("&hellip;", "…"),
            ("&nbsp;", "\u{00A0}"), ("&quot;", "\""), ("&#39;", "'"), ("&amp;", "&"),
        ] {
            text = text.replacingOccurrences(of: entity, with: character)
        }

        // Backslash escapes, last so an escaped `\[` was never read as a link.
        text = text.replacingMatches(of: "\\\\([!-/:-@\\[-`{-~])", with: "$1")

        return text.strippingHTML.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Straight quotes become typographic ones: `"` alternates open/close, and
    /// `'` is an apostrophe except at the start of a word.
    private static func applyingSmartQuotes(to text: String) -> String {
        var result = ""
        var doubleOpen = true
        var previous: Character?
        for character in text {
            switch character {
            case "\"":
                result.append(doubleOpen ? "\u{201C}" : "\u{201D}")
                doubleOpen.toggle()
            case "'":
                let startsWord = previous.map { $0.isWhitespace || $0 == "(" } ?? true
                result.append(startsWord ? "\u{2018}" : "\u{2019}")
            default:
                result.append(character)
            }
            previous = character
        }
        return result
    }

    /// Regex replace, for the small markdown clean-ups above.
    fileprivate func replacingMatches(of pattern: String, with template: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return self }
        return regex.stringByReplacingMatches(
            in: self,
            range: NSRange(startIndex..., in: self),
            withTemplate: template
        )
    }
}
