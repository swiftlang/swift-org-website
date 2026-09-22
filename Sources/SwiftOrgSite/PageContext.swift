import Foundation
import LeafKit

/// Per-page template values.
///
/// Jekyll's pages computed these with `{% assign %}`; Leaf has no assignment and
/// can't subscript by a variable, so a page that selects data by its own
/// identity gets it resolved here and handed to Kiln as
/// ``KilnSite/pageContext``.
struct PageContext: Sendable {
    let data: SiteData
    /// Every published post, for the blog listing.
    let posts: [Post]

    /// Roster pages: page path → the `_data` directory holding its people.
    ///
    /// Mostly the directory matches the page, but not always — `sswg` is served
    /// by `server-workgroup`, and the contributor-experience data directory
    /// carries a long-standing spelling of its own.
    static let rosterSources: [String: String] = [
        "android-workgroup/index.md": "android-workgroup",
        "build-and-packaging-workgroup/index.md": "build-and-packaging-workgroup",
        "contributor-experience-workgroup/index.md": "contributer-experience-workgroup",
        "foundation-workgroup/index.md": "foundation-workgroup",
        "language-steering-group/index.md": "language-steering-group",
        "networking-workgroup/index.md": "networking-workgroup",
        "platform-steering-group/index.md": "platform-steering-group",
        "testing-workgroup/index.md": "testing-workgroup",
        "website-workgroup/index.md": "website-workgroup",
        "sswg/index.md": "server-workgroup",
    ]

    /// Values for one page, keyed by its logical content path.
    func values(forLogicalPath logicalPath: String) -> [String: LeafData] {
        var values: [String: LeafData] = [:]
        // The three SDK guides rebuild the same `swift sdk install` command the
        // install pages show, from the current release's platform entry.
        let sdkGuides = [
            "documentation/articles/static-linux-getting-started.md": "staticLinux",
            "documentation/articles/wasm-getting-started.md": "wasm",
            "documentation/articles/swift-sdk-for-android-getting-started.md": "android",
        ]
        if let key = sdkGuides[logicalPath] {
            let install = InstallData(data: data)
            let sdk = install.releaseSDKs().dictionary?[key]?.dictionary ?? [:]
            values["sdkCommand"] = sdk["command"] ?? .string("")
            values["releaseTag"] = .string(install.tag)
            values["releaseName"] = .string(install.latestRelease["name"].string ?? "")
            values["releaseCount"] = .int(data["builds/swift_releases"].array.count)
        }

        if logicalPath == "blog/index.md" {
            values["blogIndex"] = blogListing(posts: posts, data: data)
        }
        if logicalPath == "security/index.md" {
            // `sort: "date"` — oldest first, as the page listed them.
            let cves = data["security/cve"].array
                .sorted { ($0["date"].string ?? "") < ($1["date"].string ?? "") }
            values["cveList"] = .array(cves.map(\.leafData))
        }
        if logicalPath == "index.md" {
            // The landing page slices its callouts into three pillars (3 / 2 / 1),
            // as the Liquid's `slice: 0,3`, `slice: 3,2` and `slice: 5,1` did.
            let callouts = data["new-data/landing/callouts"].array
            func pillar(_ start: Int, _ count: Int) -> LeafData {
                guard start < callouts.count else { return .array([]) }
                let slice = callouts[start..<min(start + count, callouts.count)]
                return .array(slice.enumerated().map { offset, callout in
                    var dictionary = callout.dictionary
                    let code = callout["code"].string ?? ""
                    dictionary["hasCode"] = .bool(!code.isEmpty)
                    // The component alternates sides on the 1-based index.
                    dictionary["isReversed"] = .bool((offset + 1) % 2 == 0)
                    return DataValue.dictionary(dictionary).leafData
                })
            }
            values["pillar1"] = pillar(0, 3)
            values["pillar2"] = pillar(3, 2)
            values["pillar3"] = pillar(5, 1)
        }
        if logicalPath.hasPrefix("packages/") {
            packageValues(forLogicalPath: logicalPath, into: &values)
        }
        if logicalPath.hasPrefix("install/") {
            installValues(forLogicalPath: logicalPath, into: &values)
            if let platform = InstallData.linuxPlatforms.first(where: { $0.page == logicalPath }) {
                for (key, value) in InstallData(data: data).linuxContext(for: platform) {
                    values[key] = value
                }
            }
        }
        if let source = Self.rosterSources[logicalPath] {
            // Wrapped in a dictionary because `#extend(_:context)` takes one —
            // the partial reads `people` from it.
            values["members"] = .dictionary(["people": sortedPeople(data["\(source)/members"])])
            values["emeriti"] = .dictionary(["people": sortedPeople(data["\(source)/emeriti"])])
        }
        return values
    }

    /// A `code-box` context: the `_data` entry it renders, plus whether it shows
    /// the tabbed variant.
    private func codeBox(_ path: String, withTabs: Bool = false) -> LeafData {
        .dictionary(["content": data[path].leafData, "withTabs": .bool(withTabs)])
    }

    // MARK: - Install

    /// The install pages select their OS tabs — and the Linux pages their
    /// platform and version tabs — from the page's own URL, which Jekyll did by
    /// splitting `page.url`.
    private func installValues(forLogicalPath logicalPath: String, into values: inout [String: LeafData]) {
        // The install landing pages are built from `code-box` entries in
        // `_data/new-data/install`, one per section.
        if logicalPath == "install/linux/index.md" {
            values["swiftlyRelease"] = codeBox("new-data/install/linux/releases/latest-release/swiftly", withTabs: true)
            values["containerRelease"] = codeBox("new-data/install/linux/releases/latest-release/container")
            values["vscode"] = codeBox("new-data/install/windows/releases/latest-release/vscode")
            values["otherEditors"] = codeBox("new-data/install/macos/releases/latest-release/other_editors")
            values["buildAPackage"] = codeBox("new-data/install/windows/releases/latest-release/build-a-package")
            values["swiftlyDev"] = codeBox("new-data/install/linux/dev/latest-dev/swiftly", withTabs: true)
        }

        let install = InstallData(data: data)
        if logicalPath == "install/macos/index.md" {
            values["macosSwiftlyRelease"] = codeBox("new-data/install/macos/releases/latest-release/swiftly", withTabs: true)
            values["macosXcode"] = codeBox("new-data/install/macos/releases/latest-release/xcode")
            values["windowsVscode"] = codeBox("new-data/install/windows/releases/latest-release/vscode")
            values["macosOtherEditors"] = codeBox("new-data/install/macos/releases/latest-release/other_editors")
            values["windowsBuildAPackage"] = codeBox("new-data/install/windows/releases/latest-release/build-a-package")
            values["macosSwiftlyDev"] = codeBox("new-data/install/macos/dev/latest-dev/swiftly", withTabs: true)
            values["macosOlderReleases"] = install.macOSOlderReleases()
            values["macosDevSnapshots"] = install.snapshotTable(
                buildsKey: "builds/development/xcode", platformDirectory: "xcode", branchDirectory: "development")
            values["macosReleaseBranchSnapshots"] = install.snapshotTable(
                buildsKey: "builds/swift-6_4_x-branch/xcode", platformDirectory: "xcode", branchDirectory: "swift-6.4.x-branch")
            values["macosToolchain"] = .string(install.macOSReleaseToolchain)
            values["macosMainSnapshot"] = install.latestSnapshot(
                buildsKey: "builds/development/xcode", branchDirectory: "development",
                platformDirectory: "xcode", title: "main")
            values["macosBranchSnapshot"] = install.latestSnapshot(
                buildsKey: "builds/swift-6_4_x-branch/xcode", branchDirectory: "swift-6.4.x-branch",
                platformDirectory: "xcode", title: "release/6.4.x")
        }
        if logicalPath == "install/windows/index.md" {
            values["windowsWinget"] = codeBox("new-data/install/windows/releases/latest-release/winget")
            values["windowsVscode"] = codeBox("new-data/install/windows/releases/latest-release/vscode")
            values["macosOtherEditors"] = codeBox("new-data/install/macos/releases/latest-release/other_editors")
            values["windowsBuildAPackage"] = codeBox("new-data/install/windows/releases/latest-release/build-a-package")
            values["windowsInstallers"] = install.windowsInstallers()
            values["windowsOlderReleases"] = .dictionary([
                "rows": install.olderReleases(forPlatformNamed: "Windows 10"),
                "isWindows": .bool(true),
            ])
            values["windowsDevSnapshots"] = install.snapshotTable(
                buildsKey: "builds/development/windows10", platformDirectory: "windows10", branchDirectory: "development")
            values["windowsReleaseBranchSnapshots"] = install.snapshotTable(
                buildsKey: "builds/swift-6_4_x-branch/windows10", platformDirectory: "windows10", branchDirectory: "swift-6.4.x-branch")
            values["windowsDockerImage"] = .string("\(data["builds/swift_releases"].array.last?["name"].string ?? "")-windowsservercore-ltsc2022")
            for (key, buildsKey, branch, directory, title) in [
                ("windowsMainX86", "builds/development/windows10", "development", "windows10", "main"),
                ("windowsMainArm64", "builds/development/windows10-arm64", "development", "windows10-arm64", "main"),
                ("windowsBranchX86", "builds/swift-6_4_x-branch/windows10", "swift-6.4.x-branch", "windows10", "release/6.4.x"),
                ("windowsBranchArm64", "builds/swift-6_4_x-branch/windows10-arm64", "swift-6.4.x-branch", "windows10-arm64", "release/6.4.x"),
            ] {
                values[key] = install.latestSnapshot(
                    buildsKey: buildsKey, branchDirectory: branch, platformDirectory: directory, title: title)
            }
        }

        // `install/linux/ubuntu/24_04/index.md` -> ["install", "linux", "ubuntu", "24_04"]
        let parts = logicalPath
            .replacingOccurrences(of: "/index.md", with: "")
            .replacingOccurrences(of: ".md", with: "")
            .split(separator: "/")
            .map(String.init)

        let os = parts.count > 1 ? parts[1] : "macos"
        values["osTabs"] = tabNav(data["new-data/os-versions"].array, selected: os, class: "os")

        guard os == "linux" else { return }

        let platforms = data["new-data/install/linux/os-names"].array
        let selectedOS = parts.count > 2 ? parts[2] : ""
        values["linuxPlatformTabs"] = tabNav(platforms, selected: selectedOS, class: "os")

        guard let platform = platforms.first(where: { $0["slug"].string == selectedOS }) else { return }
        values["selectedPlatformName"] = .string(platform["name"].string ?? "")

        let versions = platform["versions"].array
        if !versions.isEmpty {
            // Jekyll built the selected version's slug by joining the two path
            // segments, e.g. `ubuntu` + `24_04` -> `ubuntu24_04`… which matches
            // the data's `ubuntu2404` only after the underscore is dropped.
            let selectedVersion = selectedOS + (parts.count > 3 ? parts[3] : "")
            values["linuxVersionTabs"] = tabNav(
                versions,
                selected: selectedVersion.replacingOccurrences(of: "_", with: ""),
                class: "version"
            )
        }
    }

    /// A `tab-nav` context: the tabs with the active one marked.
    private func tabNav(_ tabs: [DataValue], selected: String, class className: String) -> LeafData {
        let entries: [LeafData] = tabs.map { tab in
            var dictionary = tab.dictionary
            let slug = (tab["slug"].string ?? "").lowercased()
            dictionary["isSelected"] = .bool(slug == selected.lowercased())
            return DataValue.dictionary(dictionary).leafData
        }
        return .dictionary(["tabs": .array(entries), "class": .string(className)])
    }

    // MARK: - Packages

    /// The package pages are generated one per category and one per month of the
    /// Community Showcase archive, so each selects its slice of
    /// `_data/packages` by its own path.
    private func packageValues(forLogicalPath logicalPath: String, into values: inout [String: LeafData]) {
        let name = logicalPath
            .replacingOccurrences(of: "packages/", with: "")
            .replacingOccurrences(of: ".md", with: "")

        // `packages/showcase-<month>-<year>.md`
        if name.hasPrefix("showcase-"), name.contains("-") {
            let parts = name.dropFirst("showcase-".count).split(separator: "-")
            if parts.count == 2, let month = showcaseMonth(slug: String(parts[0]), year: String(parts[1])) {
                values["month"] = month
            }
            return
        }

        // The archive index, shared by the showcase category page.
        values["showcaseYears"] = showcaseYears()

        // `packages/<category>.md`
        if let category = data["packages/packages/categories"].array
            .first(where: { $0["slug"].string == name }) {
            var dictionary = category.dictionary
            // Leaf can't compare inside a condition, so the one branch the
            // template needs is resolved here.
            dictionary["isShowcase"] = .bool(name == "showcase")
            values["category"] = DataValue.dictionary(dictionary).leafData
        }
    }

    /// The archive years, newest first, with each month's page URL resolved.
    private func showcaseYears() -> LeafData {
        let years = data["packages/showcase-history/years"].array
        return .array(years.enumerated().map { index, year in
            let yearValue = year["year"].string ?? ""
            let months: [LeafData] = year["months"].array.map { month in
                var dictionary = month.dictionary
                dictionary["url"] = .string("/packages/showcase-\(month["slug"].string ?? "")-\(yearValue).html")
                return DataValue.dictionary(dictionary).leafData
            }
            return .dictionary([
                "year": .string(yearValue),
                "isFirst": .bool(index == 0),
                "months": .array(months),
            ])
        })
    }

    /// One month of the archive.
    private func showcaseMonth(slug: String, year: String) -> LeafData? {
        for entry in data["packages/showcase-history/years"].array where entry["year"].string == year {
            for month in entry["months"].array where month["slug"].string == slug {
                return month.leafData
            }
        }
        return nil
    }

    /// A roster sorted by name, as `sort: "name"` did.
    private func sortedPeople(_ value: DataValue) -> LeafData {
        let people = value.array.sorted { ($0["name"].string ?? "") < ($1["name"].string ?? "") }
        return .array(people.map(\.leafData))
    }
}

// MARK: - Blog listing

extension PageContext {
    /// The blog index's data, in the shape Kiln's own `blogListing` uses — a
    /// heading, cards, and the data the page's client-side filter reads.
    ///
    /// Swift.org groups posts by a single `category` rather than by tags: the
    /// hero is the newest post in the first configured category, and each
    /// remaining category contributes its newest post.
    func blogListing(posts: [Post], data: SiteData) -> LeafData {
        let pageData = data["new-data/blog/page-data"]
        let titles = pageData["category_titles"].array.compactMap { $0.string }
        let newestFirst = posts.sorted(by: Post.isOrderedBefore).reversed().map { $0 }

        func newest(inCategory category: String) -> Post? {
            newestFirst.first { $0.category == category }
        }

        var listing: [String: LeafData] = [
            "headline": .string(pageData["headline"].string ?? ""),
            "readMore": .string(pageData["read-more"].string ?? "Read more"),
            "categoryTitles": .array(titles.map { .string($0) }),
            "postsJSON": .string(Self.postsJSON(newestFirst)),
        ]

        if let first = titles.first, let hero = newest(inCategory: first) {
            var card: [String: LeafData] = [
                "category": .string(first),
                "title": .string(hero.title),
                "url": .string(hero.url),
                "date": .string(DateFormat.display.string(from: hero.date)),
                "isoDate": .string(DateFormat.xmlSchema.string(from: hero.date)),
                "excerpt": .string((hero.description ?? hero.excerpt).markdownExcerptText),
            ]
            if let image = hero.featuredImage["url"].string {
                card["image"] = .string(image)
                card["imageAlt"] = .string(hero.featuredImage["alt"].string ?? "")
            }
            if let dark = hero.featuredImageDark["url"].string {
                card["imageDark"] = .string(dark)
                card["imageDarkAlt"] = .string(hero.featuredImageDark["alt"].string ?? "")
            }
            listing["hero"] = .dictionary(card)
        }

        let readMore = pageData["read-more"].string ?? "Read more"
        listing["categories"] = .array(titles.dropFirst().compactMap { title in
            guard let post = newest(inCategory: title) else { return nil }
            return .dictionary([
                "title": .string(title),
                "post": .dictionary([
                    "title": .string(post.title),
                    "url": .string(post.url),
                    "date": .string(DateFormat.display.string(from: post.date)),
                    "isoDate": .string(DateFormat.xmlSchema.string(from: post.date)),
                    "excerpt": .string(post.excerpt.markdownExcerptText),
                    "cta": .string(readMore),
                ]),
            ])
        })
        return .dictionary(listing)
    }

    /// The `#post-data` payload `blog.js` filters on.
    private static func postsJSON(_ posts: [Post]) -> String {
        func quoted(_ text: String) -> String {
            var escaped = ""
            for character in text {
                switch character {
                case "\"": escaped += "\\\""
                case "\\": escaped += "\\\\"
                case "\n", "\r": break
                case "\t": escaped += "\\t"
                default:
                    if character.asciiValue.map({ $0 < 0x20 }) == true { continue }
                    escaped.append(character)
                }
            }
            return "\"\(escaped)\""
        }

        let entries = posts.map { post -> String in
            var fields = [
                // Jekyll's `post.id` is the permalink without its trailing slash.
                "\"id\": \(quoted(String(post.url.dropLast())))",
                "\"title\": \(quoted(HTML.escape(post.title)))",
                "\"categories\": [\(quoted(post.category))]",
                "\"url\": \(quoted(post.url))",
                "\"date\": \(quoted(DateFormat.display.string(from: post.date)))",
                "\"excerpt\": \(quoted(HTML.escape(post.excerpt.markdownExcerptText.strippingNewlines)))",
            ]
            if let image = post.featuredImage["url"].string {
                fields.append("\"image-url\": \(quoted(image))")
                fields.append("\"image-alt\": \(quoted(post.featuredImage["alt"].string ?? ""))")
            }
            return "{\(fields.joined(separator: ", "))}"
        }
        return "[\(entries.joined(separator: ","))]"
    }
}
