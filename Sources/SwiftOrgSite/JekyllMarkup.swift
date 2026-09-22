import Foundation

// MARK: - Jekyll markup parity

extension PostProcessor {
    /// The permalink icon `_plugins/convert-header.rb` appends to headings,
    /// copied verbatim so the rendered markup matches.
    static let headingAnchorSVG = #"""
    <?xml version="1.0" encoding="utf-8"?> <svg width="18px" height="18px" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="m 11.58824,9.823529 q 0,-0.294117 -0.20589,-0.499999 L 9.85294,7.794118 q -0.20588,-0.205883 -0.5,-0.205883 -0.30882,0 -0.52941,0.235295 0.0221,0.02206 0.13971,0.136029 0.11764,0.113971 0.15808,0.158088 0.0404,0.04412 0.1103,0.139706 0.0698,0.09559 0.0956,0.1875 0.0257,0.09191 0.0257,0.202206 0,0.294117 -0.20588,0.5 -0.20588,0.205882 -0.5,0.205882 -0.1103,0 -0.20221,-0.02573 Q 8.35293,9.301471 8.25733,9.231621 8.16173,9.161771 8.11763,9.121327 8.07353,9.080887 7.95954,8.963238 7.84557,8.845591 7.82351,8.823533 7.58086,9.051474 7.58086,9.360297 q 0,0.294118 0.20588,0.5 l 1.51471,1.522059 q 0.19853,0.19853 0.5,0.19853 0.29412,0 0.5,-0.191177 l 1.08088,-1.073529 q 0.20589,-0.205883 0.20589,-0.492648 z M 6.41912,4.639706 q 0,-0.294118 -0.20588,-0.5 L 4.69853,2.617647 q -0.20588,-0.205882 -0.5,-0.205882 -0.28677,0 -0.5,0.198529 L 2.61765,3.683823 q -0.20589,0.205883 -0.20589,0.492648 0,0.294117 0.20589,0.499999 l 1.52941,1.529412 q 0.19853,0.19853 0.5,0.19853 0.30882,0 0.52941,-0.227942 Q 5.15437,6.15441 5.03676,6.040441 4.91912,5.92647 4.87868,5.882353 4.83828,5.838233 4.76838,5.742647 q -0.0698,-0.09559 -0.0956,-0.1875 -0.0257,-0.09191 -0.0257,-0.202206 0,-0.294117 0.20588,-0.5 0.20588,-0.205882 0.5,-0.205882 0.1103,0 0.20221,0.02573 0.0919,0.02573 0.1875,0.09559 0.0956,0.06985 0.1397,0.110294 0.0441,0.04044 0.15809,0.158089 Q 6.15443,5.154409 6.17649,5.176467 6.41914,4.948526 6.41914,4.639703 z M 13,9.823529 q 0,0.882353 -0.625,1.492647 l -1.08088,1.07353 Q 10.68382,13 9.80147,13 q -0.88971,0 -1.5,-0.625 L 6.78676,10.852941 Q 6.17647,10.242647 6.17647,9.360294 q 0,-0.904412 0.64706,-1.536764 L 6.17647,7.176471 Q 5.54412,7.82353 4.64706,7.82353 q -0.88235,0 -1.5,-0.617648 L 1.617647,5.676471 Q 1,5.058824 1,4.176471 1,3.294118 1.625,2.683824 L 2.70588,1.610294 Q 3.31618,1 4.19853,1 q 0.88971,0 1.5,0.625 l 1.51471,1.522059 q 0.61029,0.610294 0.61029,1.492647 0,0.904412 -0.64706,1.536764 L 7.82353,6.823529 Q 8.45588,6.17647 9.35294,6.17647 q 0.88235,0 1.5,0.617648 l 1.52941,1.529411 Q 13,8.941176 13,9.823529 z"/></svg>
    """#

    /// Reshape Kiln's markdown output into the markup kramdown produced, so the
    /// site's existing stylesheet applies unchanged:
    ///
    /// * headings gain `class="header-with-anchor"` and the permalink icon
    ///   (`_plugins/convert-header.rb`), except headings that already contain a
    ///   link — the plugin skips those;
    /// * inline `<code>` gains kramdown's `language-plaintext highlighter-rouge`
    ///   classes;
    ///
    /// Runs before the highlighting pass, which introduces `<pre>` markup of its
    /// own that these rules must not touch.
    ///
    /// Returns the number of files changed.
    func matchJekyllMarkup() throws -> Int {
        var changed = 0
        for file in try htmlFiles() {
            let html = try String(contentsOf: file, encoding: .utf8)
            let rewritten = Self.addAndroidTrademark(Self.markInlineCode(Self.addHeadingAnchors(html)))
            guard rewritten != html else { continue }
            try rewritten.write(to: file, atomically: true, encoding: .utf8)
            changed += 1
        }
        return changed
    }

    /// Jekyll's footer carried `{% if content contains "android" %}`, so the
    /// Android trademark line shows only on pages whose own content mentions
    /// Android. A Leaf partial can't see the rendered body, so it goes here,
    /// where the whole page is in hand.
    static func addAndroidTrademark(_ html: String) -> String {
        let marker = "<div class=\"copyright\">"
        guard let copyright = html.range(of: marker),
              html[html.startIndex..<copyright.lowerBound].contains("android")
        else { return html }

        let appleTrademark = "Swift and the Swift logo are trademarks of Apple Inc.\n          </p>"
        guard let end = html.range(of: appleTrademark, range: copyright.upperBound..<html.endIndex) else {
            return html
        }
        return html.replacingCharacters(
            in: end,
            with: appleTrademark + "\n          <p>Android is a trademark of Google LLC.</p>")
    }

    /// Replace Kiln's `<a class="headerlink">#</a>` with the Jekyll anchor.
    static func addHeadingAnchors(_ html: String) -> String {
        var result = html
        for level in 1...6 {
            let pattern = "<h\(level) id=\"([^\"]*)\">(.*?)<a class=\"headerlink\"[^>]*>#</a></h\(level)>"
            guard let regex = try? NSRegularExpression(pattern: pattern, options: [.dotMatchesLineSeparators]) else {
                continue
            }
            let matches = regex.matches(in: result, range: NSRange(result.startIndex..., in: result))
            guard !matches.isEmpty else { continue }

            var rebuilt = ""
            var cursor = result.startIndex
            for match in matches {
                guard let full = Range(match.range, in: result),
                      let idRange = Range(match.range(at: 1), in: result),
                      let textRange = Range(match.range(at: 2), in: result)
                else { continue }
                rebuilt += result[cursor..<full.lowerBound]
                let id = String(result[idRange])
                let text = String(result[textRange])
                if text.contains("<a ") {
                    // The plugin leaves headings that already contain a link alone.
                    rebuilt += "<h\(level) id=\"\(id)\">\(text)</h\(level)>"
                } else {
                    rebuilt += "<h\(level) id=\"\(id)\" class=\"header-with-anchor\">\(text) "
                    rebuilt += "<a title=\"Permalink for \(text) section\" href=\"#\(id)\">\n"
                    rebuilt += "            \(headingAnchorSVG)\n"
                    rebuilt += "          </a></h\(level)>"
                }
                cursor = full.upperBound
            }
            rebuilt += result[cursor...]
            result = rebuilt
        }
        return result
    }

    /// kramdown tags inline code with a language class; Kiln emits a bare tag.
    ///
    /// Only *inline* code is tagged — a `<code>` opening a fenced block sits
    /// inside `<pre>`, and stays bare there as it does in the Jekyll output.
    static func markInlineCode(_ html: String) -> String {
        // Any `<code>` opening a `<pre>` is a block, not inline — including the
        // ones `#swiftCode(...)` has already highlighted, which carry their own
        // `<pre class="highlight">`.
        let sentinel = "\u{0}PRECODE\u{0}"
        guard let preCode = try? NSRegularExpression(pattern: "(<pre[^>]*>)<code>") else { return html }
        let protected = preCode.stringByReplacingMatches(
            in: html,
            range: NSRange(html.startIndex..., in: html),
            withTemplate: "$1\(sentinel)"
        )
        return protected
            .replacingOccurrences(of: "<code>", with: "<code class=\"language-plaintext highlighter-rouge\">")
            .replacingOccurrences(of: sentinel, with: "<code>")
    }

}
