import Foundation
import LeafKit

/// `#startsWith(value, prefix)` — Leaf has no string-prefix test, and the header
/// marks its Install item active for every `/install/**` URL.
struct StartsWithTag: LeafTag {
    func render(_ ctx: LeafContext) throws -> LeafData {
        guard ctx.parameters.count == 2,
              let value = ctx.parameters[0].string,
              let prefix = ctx.parameters[1].string
        else { return .bool(false) }
        return .bool(value.hasPrefix(prefix))
    }
}

/// `#currentYear()` — the footer's copyright line.
struct CurrentYearTag: LeafTag {
    func render(_ ctx: LeafContext) throws -> LeafData {
        .int(Calendar.current.component(.year, from: Date()))
    }
}

/// `#swiftCode(source)` — a highlighted Swift code block.
///
/// Several components embedded their sample as a kramdown `~~~swift` fence
/// inside `<div markdown="1">`. Leaf has no markdown pass over its own output,
/// so the block is rendered here, in the same Rouge-compatible markup the rest
/// of the site uses.
struct SwiftCodeTag: UnsafeUnescapedLeafTag {
    func render(_ ctx: LeafContext) throws -> LeafData {
        guard let source = ctx.parameters.first?.string, !source.isEmpty else { return .string("") }
        return .string(CodeBlock.render(source, language: "swift"))
    }
}

/// `#stripHTML(value)` — Liquid's `strip_html`, which the content card applied
/// to its excerpt. Leaf escapes by default, so without this a card's markup
/// would show as literal text instead of being removed.
struct StripHTMLTag: LeafTag {
    func render(_ ctx: LeafContext) throws -> LeafData {
        .string((ctx.parameters.first?.string ?? "").strippingHTML)
    }
}
