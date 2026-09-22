# Swift.org on Kiln

The Swift.org website, built with [Kiln](https://github.com/brokenhandsio/kiln),
a static site generator written in Swift.

The repository *is* the site: a Swift package that stages a Kiln content
directory from the sources below and renders it through the Leaf theme in
`Theme/`.

| Directory | Contents |
| --- | --- |
| `Pages/` | Every page: markdown, with Leaf where a page is data-driven |
| `Posts/` | The 172 blog posts |
| `Data/` | The YAML behind navigation, installers and package lists |
| `Theme/` | Leaf templates and partials |
| `Static/` | Files published verbatim (signing keys, the OpenAPI spec) |
| `API/` | The JSON endpoints under `/api/`, as `{{data.path}}` scaffolds |
| `Sources/` | The build program |

`assets/` and `.well-known/` sit alongside them at the root.

```bash
kiln serve      # build, serve on :8080, rebuild on changes
kiln build      # build into ./site
```

`kiln` runs this package's executable and serves its output. `swift run
SwiftOrgSite` does the build on its own if you'd rather skip the CLI.

Building needs [Dart Sass](https://sass-lang.com/install) on your `PATH` — the
stylesheets are still the site's original `.scss` sources.

## How it maps onto Kiln

The Jekyll site it replaces mapped across as:

| Jekyll | Here |
| --- | --- |
| `_layouts/new-layouts/base.html` | `Theme/templates/base.leaf` |
| `_layouts/{page,page-wide,post}` | `Theme/templates/*.leaf` |
| `_includes/**/header`, `footer` | `Theme/templates/partials/*.leaf`, looping over `_data` |
| `_data/**/*.yml` | `Data/` → `SiteData` → `KilnSite.extraContext` as `data.*` |
| `_posts/YYYY-MM-DD-slug.md` | `Posts/`, staged as `blog/slug.md` → `/blog/slug/` |
| Rouge syntax highlighting | `SwiftHighlighter` (post-processing pass) |
| `jekyll-redirect-from` | `PostProcessor.writeRedirects` |
| `_plugins/convert-header.rb` | `PostProcessor.addHeadingAnchors` |
| `_plugins/packages.rb` | `ContentConverter.stageGeneratedPackagePages` |
| Sass via Jekyll | `Stylesheets` (shells out to `sass`) |

## Kiln changes this needs

Swift.org is data-driven: 7.1 MB of `_data` YAML drives the navigation, install
tables, release lists, workgroup rosters and package catalogue. Rendering that in
Leaf needs the data in the template context, and Kiln's `RenderContext` exposes a
closed set of keys.

`kiln-changes.patch` carries four additions, all in `.kiln/`:

| Addition | Why |
| --- | --- |
| `KilnSite.extraContext: [String: LeafData]` | Site-wide data in the template context, so `#for(item in data.…)` works. The same mechanism Kiln already uses for `blogListing`. |
| `KilnSite.pageContext: (String) -> [String: LeafData]` | Leaf has no assignment and can't subscript by a variable, so anything a page selects by its own identity (its package category, its Linux platform) is resolved in Swift. Replaces Jekyll's `{% assign %}`. |
| `KilnSite.contentTemplating` + front-matter `contentTemplating:` | Renders a page's markdown body as Leaf *before* the markdown pass — exactly where Jekyll ran Liquid — so prose pages can call partials. Opt-in per page, because a body containing `#if(...)` (any Swift code sample) would otherwise parse as Leaf. |
| `#markdown("…")` Leaf tag | Renders a markdown string inside a template, using Kiln's own `MarkdownRenderer` so the markup matches page content. Replaces Liquid's `markdownify`. |

Content templating needed one supporting type, `InMemoryLeafSource`: `LeafRenderer`
only resolves templates by path, so a page body is stored under a per-page key and
rendered through the normal pipeline.

`Package.swift` currently points at the patched checkout in `.kiln/`, so both the
site and the `kiln` CLI have to be built from it:

```bash
cd .kiln && swift build -c release --product kiln
```

Once the change lands upstream, switch `Package.swift` back to the released
package and install the CLI with `brew install brokenhandsio/tap/kiln`.

**No LeafKit fork is needed.** Two alternatives were ruled out: a custom `#for`
tag is impossible (a `LeafTag` returns `LeafData` and `LeafSerializer` is
internal, so a tag cannot serialise its own body), and teaching `#for` to accept a
tag call would mean changing `Syntax.Loop.array` from a `String` to a resolvable
expression inside a shared Vapor dependency. Leaf's lack of assignment is handled
by `pageContext` instead.

## Migration state

**Complete.** Every page renders from Leaf; no Liquid remains anywhere in the
build, and the interpreter that once drove it has been deleted.

```
172 posts, 170 pages
170 migrated to Leaf, 0 still need Liquid
82 API endpoints
```

`Pages/` is the site's content: one file per page, holding its markdown, its Leaf
where the page is data-driven, and the front matter that decides its URL,
template and redirects. The Jekyll tree has been deleted.

### Verified against production `swift.org`

| Check | Result |
| --- | --- |
| Sitemap coverage | **473/473 URLs resolve** |
| Install download links | 150/150 Ubuntu, 236/236 macOS, 102/102 Windows |
| Blog index `#post-data` (172 posts) | **byte-identical** |
| `/api/v1/install/releases.json` | **byte-identical** |
| Liquid or Leaf leaking into output | none |
| Markup escaped into prose | none |
| `<head>` on the home page and content pages | **0 differing tags** |
| `<head>` on a post | 1 tag: `article:modified_time` (a build timestamp) |
| Atom feed: title, id, updated, authors, links | identical for all 20 entries |
| Atom feed: entry content | identical apart from whitespace and highlighter tokens |

Leaf escapes `#(…)` by default where Liquid's `{{ }}` emitted raw HTML, so any
template slot holding markup from a data file uses `#unsafeHTML(…)` — that is the
faithful port, not a shortcut.

Syntax highlighting reproduces Rouge's markup and classes closely but not
exactly — a Swift block is ~95% token-identical, differing on lexer details
(argument labels, operator grouping). The classes are the same, so colours match.

## Two authoring rules

Both follow from content templating running *before* the markdown pass:

1. **A page whose body is pure markup should be a template**, not content with
   `contentTemplating: true`. Markup that reaches the markdown parser is subject
   to CommonMark's rules — four spaces of indentation makes a code block, and a
   blank line ends an HTML block mid-way. The landing page and the package pages
   are templates for exactly this reason.
2. **`contentTemplating` is opt-in per page.** Leaf parses `#name(`, and Swift
   samples are full of `#available(`, `#selector(` and `#Predicate(`. Only turn
   it on for a prose page that actually calls a partial.

## Liquid

`Sources/SwiftOrgSite/Liquid` is a small Liquid interpreter covering the subset
the site uses (measured across every page, include and layout: 19 tags, 22
filters). It renders the page bodies and the intermediate Jekyll layouts that
have no Leaf counterpart.

It exists because 98 content pages and 44 includes are Liquid, and interpreting
them once is both smaller and more faithful than hand-porting each. The header
and footer show the destination: they now loop over `_data` in Leaf directly, and
the Liquid path is what remains to be converted page family by page family.

## Known gaps

- Content pages still render through the Liquid interpreter rather than Leaf.
- `ContentConverter.dedentingHTMLLines` reconciles kramdown's HTML handling with
  CommonMark's (indentation and wrapped inline tags). Pages converted to Leaf
  templates won't need it.
- Syntax highlighting is a pragmatic lexer, not Rouge: Swift blocks are ~95%
  token-identical and other languages less so. Same classes, same colours.
