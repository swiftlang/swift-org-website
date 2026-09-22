import Foundation

/// Server-side syntax highlighting that reproduces Rouge's output.
///
/// Kiln's markdown renderer emits a bare `<pre><code class="language-swift">`,
/// but the site's stylesheet (`_syntax.scss`) targets the markup kramdown +
/// Rouge produce:
///
/// ```html
/// <div class="language-swift highlighter-rouge"><div class="highlight">
///   <pre class="highlight"><code><span class="kd">let</span> …</code></pre>
/// </div></div>
/// ```
///
/// So we re-highlight code blocks into that shape, using Rouge's token classes
/// (`kd` declaration keyword, `k` keyword, `kt` type, `nf` function, `s` string,
/// `c1` comment, `mi` number, `o` operator, `p` punctuation, `n` name).
///
/// This is a pragmatic lexer, not a parser: it recognises the constructs that
/// actually appear in the site's samples. Unknown languages still get the
/// wrapper markup (so layout and theming match) with their text left plain.
enum SwiftHighlighter {

    /// Wrap already-highlighted (or plain) code in Rouge's container markup.
    static func codeBlock(_ code: String, language: String = "swift") -> String {
        let trimmed = code.hasSuffix("\n") ? String(code.dropLast()) : code
        let inner = highlight(trimmed, language: language)
        return """
        <div class="language-\(HTML.escape(language)) highlighter-rouge"><div class="highlight">\
        <pre class="highlight"><code>\(inner)
        </code></pre></div></div>
        """
    }

    /// Highlight `code`, returning HTML spans. Languages we don't lex are
    /// returned escaped but unmarked.
    static func highlight(_ code: String, language: String) -> String {
        switch language.lowercased() {
        case "swift":
            var lexer = Lexer(code: code, dialect: .swift)
            return lexer.run()
        case "c", "cpp", "c++", "objc", "objective-c", "java", "proto", "protobuf", "javascript", "js", "typescript", "ts", "json", "rust", "go", "kotlin":
            var lexer = Lexer(code: code, dialect: .cLike)
            return lexer.run()
        default:
            return escapeCode(code)
        }
    }

    /// Rouge escapes only `&`, `<` and `>` inside a code block — quotes and
    /// apostrophes stay literal.
    static func escapeCode(_ text: String) -> String {
        text.replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    // MARK: - Lexer

    private enum Dialect {
        case swift
        case cLike
    }

    /// Swift's declaration modifiers and declaration introducers (Rouge: `kd`).
    private static let declarationKeywords: Set<String> = [
        "associatedtype", "class", "deinit", "enum", "extension", "func", "import", "init",
        "inout", "internal", "let", "open", "operator", "private", "protocol", "public",
        "static", "struct", "subscript", "typealias", "var", "fileprivate", "actor", "macro",
        "package", "final", "required", "convenience", "dynamic", "override", "weak", "unowned",
        "mutating", "nonmutating", "lazy", "indirect", "optional", "nonisolated", "distributed",
        "borrowing", "consuming", "sending", "each", "some", "any",
    ]

    /// Control flow and expression keywords (Rouge: `k`).
    private static let keywords: Set<String> = [
        "break", "case", "continue", "default", "defer", "do", "else", "fallthrough", "for",
        "guard", "if", "in", "repeat", "return", "switch", "where", "while", "throw", "catch",
        "try", "async", "await", "throws", "rethrows", "is", "as", "typeof", "new", "delete",
        "sizeof", "namespace", "using", "template", "typename", "const", "constexpr",
        "service", "rpc", "returns", "message", "syntax", "package",
    ]

    /// Literal keywords (Rouge: `kc`, styled with `k` in this theme).
    private static let literalKeywords: Set<String> = ["true", "false", "nil", "null", "none"]

    /// Contextual pseudo-variables (Rouge: `bp`).
    private static let builtins: Set<String> = ["self", "Self", "super", "this"]

    /// Primitive/lowercase type names that Rouge still marks as types (`kt`).
    private static let primitiveTypes: Set<String> = [
        "int", "int32", "int64", "uint", "uint32", "uint64", "float", "double", "bool",
        "char", "void", "string", "bytes", "long", "short", "unsigned", "signed", "auto",
    ]

    private struct Lexer {
        let characters: [Character]
        let dialect: Dialect
        var index = 0
        var output = ""

        init(code: String, dialect: Dialect) {
            self.characters = Array(code)
            self.dialect = dialect
            self.output.reserveCapacity(code.count * 2)
        }

        mutating func run() -> String {
            while index < characters.count {
                let character = characters[index]

                if character == "/", peek(1) == "/" { consumeLineComment(); continue }
                if character == "/", peek(1) == "*" { consumeBlockComment(); continue }
                if character == "#", dialect == .cLike { consumeLineComment(); continue }
                if character == "\"" { consumeString(); continue }
                if character == "@" { consumeAttribute(); continue }
                if character.isNumber { consumeNumber(); continue }
                if character.isLetter || character == "_" { consumeIdentifier(); continue }
                if character.isWhitespace { output.append(character); index += 1; continue }
                consumeSymbol()
            }
            return output
        }

        // MARK: Helpers

        private func peek(_ offset: Int) -> Character? {
            let target = index + offset
            return characters.indices.contains(target) ? characters[target] : nil
        }

        private mutating func emit(_ text: String, _ cssClass: String?) {
            guard let cssClass else { output += SwiftHighlighter.escapeCode(text); return }
            output += #"<span class="\#(cssClass)">\#(SwiftHighlighter.escapeCode(text))</span>"#
        }

        /// Consume while `predicate` holds, returning the consumed text.
        private mutating func take(while predicate: (Character) -> Bool) -> String {
            var text = ""
            while index < characters.count, predicate(characters[index]) {
                text.append(characters[index])
                index += 1
            }
            return text
        }

        // MARK: Token consumers

        private mutating func consumeLineComment() {
            let text = take { $0 != "\n" }
            emit(text, "c1")
        }

        private mutating func consumeBlockComment() {
            var text = ""
            while index < characters.count {
                if characters[index] == "*", peek(1) == "/" {
                    text += "*/"
                    index += 2
                    break
                }
                text.append(characters[index])
                index += 1
            }
            emit(text, "cm")
        }

        /// Strings, splitting out escape sequences (`se`) the way Rouge does.
        private mutating func consumeString() {
            var buffer = "\""
            index += 1
            while index < characters.count {
                let character = characters[index]
                if character == "\\", let next = peek(1) {
                    emit(buffer, "s")
                    emit("\\\(next)", "se")
                    buffer = ""
                    index += 2
                    continue
                }
                buffer.append(character)
                index += 1
                if character == "\"" { break }
                if character == "\n" { break }
            }
            if !buffer.isEmpty { emit(buffer, "s") }
        }

        /// `@available`, `@MainActor` — Rouge marks the whole run as a keyword.
        private mutating func consumeAttribute() {
            var text = "@"
            index += 1
            text += take { $0.isLetter || $0.isNumber || $0 == "_" }
            emit(text, "kd")
        }

        private mutating func consumeNumber() {
            let text = take { $0.isNumber || $0 == "." || $0 == "_" || $0 == "x" || $0 == "b" || $0 == "o" || ($0.isHexDigit && $0.isLetter) }
            emit(text, text.contains(".") ? "mf" : "mi")
        }

        private mutating func consumeIdentifier() {
            let word = take { $0.isLetter || $0.isNumber || $0 == "_" }

            if builtins.contains(word) { emit(word, "bp"); return }
            if literalKeywords.contains(word) { emit(word, "kc"); return }
            if declarationKeywords.contains(word) {
                emit(word, "kd")
                // `func name` / `class Name` — Rouge tags the declared name.
                consumeDeclaredName(after: word)
                return
            }
            if keywords.contains(word) { emit(word, "k"); return }
            if primitiveTypes.contains(word.lowercased()), dialect == .cLike { emit(word, "kt"); return }

            if dialect == .swift, isArgumentLabel() {
                emit(word, "nv")
                return
            }

            // A capitalised identifier is a type; one followed by `(` is a call.
            let isCall = nextNonSpaceIsOpenParenthesis()
            if let first = word.first, first.isUppercase {
                emit(word, isCall ? "nf" : (dialect == .swift ? "kt" : "n"))
            } else {
                emit(word, isCall ? "nf" : "n")
            }
        }

        /// After `func`/`class`/`struct`/… tag the introduced name: `nf` for a
        /// function, `nc` for a type.
        private mutating func consumeDeclaredName(after keyword: String) {
            let bindingIntroducers: Set<String> = ["let", "var"]
            if bindingIntroducers.contains(keyword) {
                let spaces = take { $0 == " " || $0 == "\t" }
                guard !spaces.isEmpty else { return }
                output += spaces
                guard index < characters.count, characters[index].isLetter || characters[index] == "_" else { return }
                let name = take { $0.isLetter || $0.isNumber || $0 == "_" }
                emit(name, "nv")
                return
            }

            let functionIntroducers: Set<String> = ["func", "rpc"]
            let typeIntroducers: Set<String> = ["class", "struct", "enum", "protocol", "extension", "actor", "typealias", "associatedtype", "message"]
            guard functionIntroducers.contains(keyword) || typeIntroducers.contains(keyword) else { return }

            let spaces = take { $0 == " " || $0 == "\t" }
            guard !spaces.isEmpty else { return }
            output += spaces
            guard index < characters.count, characters[index].isLetter || characters[index] == "_" else { return }
            let name = take { $0.isLetter || $0.isNumber || $0 == "_" }
            if functionIntroducers.contains(keyword) {
                emit(name, "nf")
            } else {
                emit(name, dialect == .swift ? "kt" : "nc")
            }
        }

        /// Whether the identifier just consumed is an argument label: it is
        /// followed by `:`, and the token before it opened or continued an
        /// argument list.
        private func isArgumentLabel() -> Bool {
            var lookahead = index
            while characters.indices.contains(lookahead), characters[lookahead] == " " { lookahead += 1 }
            guard characters.indices.contains(lookahead), characters[lookahead] == ":" else { return false }
            // `::` and `?:` are not labels.
            let next = lookahead + 1
            if characters.indices.contains(next), characters[next] == ":" { return false }

            var scan = index - 1
            // Skip back over the identifier itself.
            while scan >= 0, characters[scan].isLetter || characters[scan].isNumber || characters[scan] == "_" { scan -= 1 }
            while scan >= 0, characters[scan] == " " || characters[scan] == "\n" { scan -= 1 }
            guard scan >= 0 else { return false }
            return characters[scan] == "(" || characters[scan] == ","
        }

        private func nextNonSpaceIsOpenParenthesis() -> Bool {
            var lookahead = index
            while characters.indices.contains(lookahead), characters[lookahead] == " " { lookahead += 1 }
            return characters.indices.contains(lookahead) && characters[lookahead] == "("
        }

        /// Rouge treats `.` as an operator, not punctuation.
        private static let punctuation: Set<Character> = ["(", ")", "[", "]", "{", "}", ",", ";", ":"]

        private mutating func consumeSymbol() {
            let character = characters[index]
            if Self.punctuation.contains(character) {
                // A run of punctuation is one span, as Rouge emits it (`()`).
                let text = take { Self.punctuation.contains($0) }
                emit(text, "p")
                return
            }
            let operators: Set<Character> = ["-", "+", "*", "/", "=", "<", ">", "!", "&", "|", "^", "~", "?", "%"]
            if operators.contains(character) {
                let text = take { operators.contains($0) }
                emit(text, "o")
                return
            }
            index += 1
            emit(String(character), "o")
        }
    }
}
