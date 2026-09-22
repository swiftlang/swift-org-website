import Foundation
import Kiln

// The Swift.org website, built with Kiln.
//
// The Jekyll tree is left untouched: this program reads it, stages a Kiln
// `Content/` directory next to itself, and renders the site through a custom
// theme (`Theme/`) that reproduces the existing layouts.
//
// Three things Jekyll does that Kiln doesn't, handled here:
//   * `_data/**` — loaded by `SiteData` and rendered into HTML by `Components`,
//     reached from templates through the `#component(…)` tag.
//   * Rouge syntax highlighting — re-applied over Kiln's `<pre><code>` output in
//     `PostProcessor` so the existing `_syntax.scss` styles it.
//   * `jekyll-redirect-from` and Jekyll's `.html` page URLs — both emitted as
//     small redirect/alias pages after the build.

// The repository root: the package and the site are the same thing.
let siteRoot = URL(fileURLWithPath: #filePath)
    .deletingLastPathComponent()  // SwiftOrgSite
    .deletingLastPathComponent()  // Sources
    .deletingLastPathComponent()  // the repository

// The staged content is a build artefact: keeping it under `.build` keeps it
// out of `kiln serve`'s file watcher, which would otherwise see each build
// rewrite it and rebuild again.
let contentDirectory = siteRoot.appendingPathComponent(".build/content")

// Jekyll's `site.time`: one timestamp for the whole build, stamped on every
// page's `article:modified_time` and on the feed's `<updated>`.
let buildTime = Date()
let outputDirectory = siteRoot.appendingPathComponent("site")
let themeDirectory = siteRoot.appendingPathComponent("Theme")

// MARK: - Load the Jekyll data tree

print("Loading _data …")
let siteData = try SiteData(directory: siteRoot.appendingPathComponent("Data"))

// MARK: - Stage content

print("Staging content …")
let converter = ContentConverter(
    siteRoot: siteRoot,
    stagingDirectory: contentDirectory,
    data: siteData,
    postsDirectory: siteRoot.appendingPathComponent("Posts"),
    migratedPagesDirectory: siteRoot.appendingPathComponent("Pages")
)
let staged = try converter.stage()
print("  \(staged.posts.count) posts, \(staged.pagePaths.count) pages")
let stillLiquid = Set(staged.pagesNeedingLiquid.filter { !$0.hasPrefix("_layouts/") })
print("  \(staged.migratedPages.count) migrated to Leaf, \(stillLiquid.count) still need Liquid")
if ProcessInfo.processInfo.environment["LIST_LIQUID"] != nil {
    for path in stillLiquid.sorted() { print("     - \(path)") }
}

let components = Components(data: siteData, posts: staged.posts)
let componentTag = ComponentTag(components: components)

// MARK: - Site configuration

// Every page is "unlisted": the site's navigation is authored in `_data` and
// rendered by the header/footer components, not by Kiln's navigation tree.
let unlisted = (staged.pagePaths + staged.posts.map(\.contentPath))
    .filter { $0 != "index.md" }
    .map { UnlistedPage(Post.title(forContentPath: $0), $0) }

let site = KilnSite(
    name: "Swift.org",
    url: "https://swift.org",
    author: "Apple Inc.",
    description: "Swift is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns.",
    image: "apple-touch-icon-180x180.png",
    twitterSite: "@SwiftLang",
    copyright: "Copyright © \(Calendar.current.component(.year, from: buildTime)) Apple Inc. All rights reserved.",
    theme: .custom(directory: themeDirectory.path),
    // The site ships its own compiled stylesheet and scripts from `assets/`;
    // Kiln's own theme assets are unused.
    languages: [Language(.english, isDefault: true)],
    // Rouge-compatible markup for fenced code blocks. Doing this in the markdown
    // renderer — rather than over the finished HTML — means `<pre><code>` that
    // came from a data file is left exactly as authored, as Jekyll left it.
    markdown: MarkdownExtensions(
        codeRenderer: { code, language in
            SwiftHighlighter.codeBlock(code, language: language ?? "plaintext")
        }
    ),
    // `llms.txt` mirrors a navigation tree this site doesn't have.
    llmsText: false,
    // The whole `_data` tree, so templates can loop over it the way the Jekyll
    // ones looped over `site.data` (hyphens become underscores — see `leafKey`).
    unlistedPages: unlisted,
    extraContext: [
        "data": siteData.root.leafData,
        // The same tree pre-wrapped for the page components — see `boxedLeafData`.
        "boxed": siteData.root.boxedLeafData,
        // `use-case/index.md` loops over data that `_data` never defined, so
        // Jekyll rendered those sections empty. Leaf's `#for` needs the key to
        // exist, so the same emptiness is declared explicitly.
        "missingData": .dictionary([
            "useCaseHeroBoxes": .array([]),
            "frameworksPackages": .dictionary(["featured": .array([]), "others": .array([])]),
        ]),
        // Leaf has no `last` accessor on arrays, so the current release the
        // header shows is resolved here.
        "latestRelease": .string(siteData["builds/swift_releases"].array.last?["name"].string ?? ""),
        "swiftlyVersion": .string(siteData["builds/swiftly_release/version"].string ?? ""),
        // `site.time`, which the post layout emits as `article:modified_time`.
        "buildTime": .string(DateFormat.xmlSchema.string(from: buildTime)),
        // The SDK download boxes are the same on every install page.
        "releaseSDKs": InstallData(data: siteData).releaseSDKs(),
        "devSDKs": InstallData(data: siteData).developmentSDKs(),
    ],
    // Per-page values for pages that have migrated to Leaf: Leaf has no
    // assignment and can't subscript by a variable, so anything a page selects
    // by its own identity is resolved here.
    pageContext: { [pageContext = PageContext(data: siteData, posts: staged.posts)] path in
        pageContext.values(forLogicalPath: path)
    },
    navigation: {
        Page("Swift Programming Language", "index.md")
    }
)

// MARK: - Build

print("Building site into \(outputDirectory.path) …")
try await Kiln.build(
    site,
    contentDirectory: contentDirectory,
    outputDirectory: outputDirectory,
    // The Jekyll site links to many pages this port hasn't staged yet, and to
    // externally-hosted docs; broken links are reported by `make check` instead.
    linkChecking: .off,
    leafTags: ["component": componentTag, "startsWith": StartsWithTag(), "currentYear": CurrentYearTag(), "swiftCode": SwiftCodeTag(), "stripHTML": StripHTMLTag()]
)

// MARK: - Post-processing

let postProcessor = PostProcessor(
    outputDirectory: outputDirectory,
    siteRoot: siteRoot,
    siteURL: site.url
)
print("Matching Jekyll markup …")
let reshaped = try postProcessor.matchJekyllMarkup()
print("  \(reshaped) pages")

print("Writing redirects and aliases …")
try postProcessor.writeRedirects(staged.redirects)
try postProcessor.writeHTMLAliases(staged.htmlAliases)
try postProcessor.writeVerbatimFiles(staged.verbatimFiles)

print("Writing API endpoints …")
let endpoints = try APIEndpoints(directory: siteRoot.appendingPathComponent("API"), data: siteData).render()
try postProcessor.writeVerbatimFiles(endpoints)
print("  \(endpoints.count) endpoints")

print("Writing feeds …")
try postProcessor.writeAtomFeed(posts: staged.posts, authors: siteData["authors"], siteTitle: site.name, buildTime: buildTime)

print("Linking assets …")
try postProcessor.linkAssets()
try postProcessor.copyStaticFiles(from: siteRoot.appendingPathComponent("Static"))

print("Compiling stylesheets …")
let stylesheets = Stylesheets(siteRoot: siteRoot, outputDirectory: outputDirectory)
for path in try stylesheets.compile() { print("  assets/stylesheets/\(path)") }

if !staged.liquidFailures.isEmpty {
    print("\n⚠️  \(staged.liquidFailures.count) Liquid problems:")
    for failure in staged.liquidFailures { print("     - \(failure)") }
}

print("\nDone. Serve with: kiln serve")
