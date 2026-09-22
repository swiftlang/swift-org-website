import Foundation

/// The container markup for a fenced code block.
///
/// Kiln's markdown renderer emits a bare `<pre><code class="language-swift">`,
/// but the site's stylesheet (`_syntax.scss`), the copy-to-clipboard button in
/// `application.js` and the print rules all target the shape kramdown produced:
///
/// ```html
/// <div class="language-swift highlighter-rouge"><div class="highlight">
///   <pre class="highlight"><code class="language-swift">let …</code></pre>
/// </div></div>
/// ```
///
/// The tokens inside are added in the browser by highlight.js, which reads the
/// language from the class on `<code>`. Nothing is highlighted here, so a
/// language the site uses but highlight.js doesn't know simply stays plain.
enum CodeBlock {

    /// Wrap `code` in the container markup, tagged for highlight.js.
    static func render(_ code: String, language: String = "swift") -> String {
        let trimmed = code.hasSuffix("\n") ? String(code.dropLast()) : code
        let name = HTML.escape(language)
        return """
        <div class="language-\(name) highlighter-rouge"><div class="highlight">\
        <pre class="highlight"><code class="language-\(name)">\(escape(trimmed))
        </code></pre></div></div>
        """
    }

    /// Only `&`, `<` and `>` need escaping inside a code block; quotes and
    /// apostrophes stay literal, as kramdown left them.
    static func escape(_ text: String) -> String {
        text.replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }
}
