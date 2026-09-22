import Foundation
import LeafKit

/// The install pages' view model.
///
/// These are the most data-driven pages on the site: every download link is
/// derived from `_data/builds`. Jekyll computed them with chains of
/// `{% assign %}`; Leaf has neither assignment nor variable subscripting, so the
/// URLs, commands and dates are all resolved here and handed to the templates.
struct InstallData: Sendable {
    let data: SiteData

    /// The most recent entry in `_data/builds/swift_releases.yml`.
    var latestRelease: DataValue { data["builds/swift_releases"].array.last ?? .null }
    var tag: String { latestRelease["tag"].string ?? "" }
    var tagLowercased: String { tag.lowercased() }

    // MARK: - SDK boxes

    /// The three release SDK boxes (Static Linux, WebAssembly, Android).
    ///
    /// Each is the same shape: a copyable `swift sdk install` command plus
    /// download and signature links, differing only in the platform entry it
    /// reads and the path segment it downloads from.
    func releaseSDKs() -> LeafData {
        .dictionary([
            "staticLinux": releaseSDK(
                platformName: "Static SDK",
                title: "Swift SDK for Static Linux",
                segment: "static-sdk",
                artefactSuffix: "_static-linux-\(platformVersion(named: "Static SDK")).artifactbundle.tar.gz",
                instructions: "/documentation/articles/static-linux-getting-started.html"
            ),
            "wasm": releaseSDK(
                platformName: "Wasm SDK",
                title: "Swift SDK for WebAssembly",
                segment: "wasm-sdk",
                artefactSuffix: "_wasm.artifactbundle.tar.gz",
                instructions: "/documentation/articles/wasm-getting-started.html"
            ),
            "android": releaseSDK(
                platformName: "Android SDK",
                title: "Swift SDK for Android",
                segment: "android-sdk",
                artefactSuffix: "_android.artifactbundle.tar.gz",
                instructions: "/documentation/articles/swift-sdk-for-android-getting-started.html"
            ),
        ])
    }

    private func platformVersion(named name: String) -> String {
        platform(named: name)["version"].string ?? ""
    }

    private func platform(named name: String) -> DataValue {
        latestRelease["platforms"].array.first { $0["name"].string == name } ?? .null
    }

    private func releaseSDK(
        platformName: String,
        title: String,
        segment: String,
        artefactSuffix: String,
        instructions: String
    ) -> LeafData {
        let entry = platform(named: platformName)
        let base = "https://download.swift.org/\(tagLowercased)/\(segment)/\(tag)/\(tag)"
        let download = base + artefactSuffix
        return .dictionary([
            "title": .string(title),
            "command": .string("swift sdk install \(download) --checksum \(entry["checksum"].string ?? "")"),
            "download": .string(download),
            "signature": .string(download + ".sig"),
            "instructions": .string(instructions),
        ])
    }

    // MARK: - Development SDK boxes

    /// The development SDK grids (`static-linux-sdk-dev`, `wasm-sdk-dev`): the
    /// newest snapshot from `main` and from the current release branch.
    func developmentSDKs() -> LeafData {
        .dictionary([
            // Wrapped as `boxes` because `#extend(_:context)` takes a dictionary.
            "staticLinux": .dictionary(["boxes": .array([
                developmentSDK(buildsKey: "builds/development/static-sdk", branchDirectory: "development", title: "main"),
                developmentSDK(buildsKey: "builds/swift-6_4_x-branch/static-sdk", branchDirectory: "swift-6.4.x-branch", title: "release/6.4.x"),
            ])]),
            "wasm": .dictionary(["boxes": .array([
                developmentSDK(buildsKey: "builds/development/wasm-sdk", branchDirectory: "development", title: "main"),
                developmentSDK(buildsKey: "builds/swift-6_4_x-branch/wasm-sdk", branchDirectory: "swift-6.4.x-branch", title: "release/6.4.x"),
            ])]),
            "android": .dictionary(["boxes": .array([
                developmentSDK(buildsKey: "builds/development/android-sdk", branchDirectory: "development", title: "main"),
                developmentSDK(buildsKey: "builds/swift-6_4_x-branch/android-sdk", branchDirectory: "swift-6.4.x-branch", title: "release/6.4.x"),
            ])]),
        ])
    }

    private func developmentSDK(buildsKey: String, branchDirectory: String, title: String) -> LeafData {
        let segment = buildsKey.split(separator: "/").last.map(String.init) ?? ""
        guard let build = newestBuild(key: buildsKey) else {
            return .dictionary(["title": .string(title)])
        }
        let base = "https://download.swift.org/\(branchDirectory)/\(segment)/\(build["dir"].string ?? "")"
        let download = "\(base)/\(build["download"].string ?? "")"
        return .dictionary([
            "title": .string(title),
            "date": .string(displayDate(build["date"])),
            "command": .string("swift sdk install \(download) --checksum \(build["checksum"].string ?? "")"),
            "download": .string(download),
            "signature": .string("\(base)/\(build["download_signature"].string ?? "")"),
        ])
    }

    // MARK: - Helpers

    /// Builds newest first, as `sort: 'date' | reverse` produced.
    func builds(key: String) -> [DataValue] {
        data[key].array.sorted { ($0["date"].string ?? "") > ($1["date"].string ?? "") }
    }

    func newestBuild(key: String) -> DataValue? {
        builds(key: key).first
    }

    /// A build date rendered as `February 1, 2025`.
    func displayDate(_ value: DataValue) -> String {
        guard let text = value.string?.replacingOccurrences(of: " +0000", with: "") else { return "" }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: -4 * 3600) ?? .gmt
        guard let date = Post.parseDate(text, calendar: calendar) else { return text }
        return DateFormat.display.string(from: date)
    }
}

// MARK: - Linux platforms

/// The per-page parameters each Linux install page passed to
/// `new-includes/assigns/linux-platform-builds.html`.
struct LinuxPlatform: Sendable {
    var page: String
    /// Display name, e.g. `"Ubuntu 24.04"` — also the key into a release's
    /// `platforms` list.
    var name: String
    var branchDirectory: String
    var developmentName: String
    var dockerTag: String
    var buildsKey: String
    var aarch64BuildsKey: String
    /// The release-branch snapshots shown alongside `main`, when the page has them.
    var secondName: String?
    var secondDockerTag: String?
    var secondBranchDirectory: String?
    var secondBuildsKey: String?
    var secondAarch64BuildsKey: String?

    init(
        page: String, name: String, branchDirectory: String, developmentName: String,
        dockerTag: String, buildsKey: String, aarch64BuildsKey: String,
        secondName: String? = nil, secondDockerTag: String? = nil,
        secondBranchDirectory: String? = nil, secondBuildsKey: String? = nil,
        secondAarch64BuildsKey: String? = nil
    ) {
        self.page = page
        self.name = name
        self.branchDirectory = branchDirectory
        self.developmentName = developmentName
        self.dockerTag = dockerTag
        self.buildsKey = buildsKey
        self.aarch64BuildsKey = aarch64BuildsKey
        self.secondName = secondName
        self.secondDockerTag = secondDockerTag
        self.secondBranchDirectory = secondBranchDirectory
        self.secondBuildsKey = secondBuildsKey
        self.secondAarch64BuildsKey = secondAarch64BuildsKey
    }

    /// `platform | remove: '.' | remove: ' ' | downcase` — the download-server
    /// directory for this platform, e.g. `Ubuntu 24.04` → `ubuntu2404`.
    var directoryName: String {
        name.replacingOccurrences(of: ".", with: "")
            .replacingOccurrences(of: " ", with: "")
            .lowercased()
    }

    /// `platform | remove: ' ' | downcase` — the tarball's file-name stem,
    /// which keeps the dot, e.g. `ubuntu24.04`.
    var fileName: String {
        name.replacingOccurrences(of: " ", with: "").lowercased()
    }
}

extension InstallData {
    /// Every Linux install page, with the parameters its Jekyll page passed in.
    static let linuxPlatforms: [LinuxPlatform] = [
        LinuxPlatform(page: "install/linux/amazonlinux/2023/index.md", name: "Amazon Linux 2023",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-amazonlinux2023",
                      buildsKey: "builds/development/amazonlinux2023", aarch64BuildsKey: "builds/development/amazonlinux2023-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-amazonlinux2023",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/amazonlinux2023",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/amazonlinux2023-aarch64"),
        LinuxPlatform(page: "install/linux/debian/12/index.md", name: "Debian 12",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-debian-12",
                      buildsKey: "builds/development/debian12", aarch64BuildsKey: "builds/development/debian12-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-debian12",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/debian12",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/debian12-aarch64"),
        LinuxPlatform(page: "install/linux/debian/13/index.md", name: "Debian 13",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-debian-13",
                      buildsKey: "builds/development/debian13", aarch64BuildsKey: "builds/development/debian13-aarch64"),
        LinuxPlatform(page: "install/linux/fedora/41/index.md", name: "Fedora 41",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-fedora-41",
                      buildsKey: "builds/development/fedora41", aarch64BuildsKey: "builds/development/fedora41-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-fedora41",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/fedora41",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/fedora41-aarch64"),
        LinuxPlatform(page: "install/linux/ubi/9/index.md", name: "ubi 9",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-rhel-ubi9",
                      buildsKey: "builds/development/ubi9", aarch64BuildsKey: "builds/development/ubi9-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-rhel-ubi9",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/ubi9",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/ubi9-aarch64"),
        LinuxPlatform(page: "install/linux/ubi/10/index.md", name: "ubi 10",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-rhel-ubi10",
                      buildsKey: "builds/development/ubi10", aarch64BuildsKey: "builds/development/ubi10-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-rhel-ubi10",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/ubi10",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/ubi10-aarch64"),
        LinuxPlatform(page: "install/linux/ubuntu/22_04/index.md", name: "Ubuntu 22.04",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-jammy",
                      buildsKey: "builds/development/ubuntu2204", aarch64BuildsKey: "builds/development/ubuntu2204-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-jammy",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/ubuntu2204",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/ubuntu2204-aarch64"),
        LinuxPlatform(page: "install/linux/ubuntu/24_04/index.md", name: "Ubuntu 24.04",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-noble",
                      buildsKey: "builds/development/ubuntu2404", aarch64BuildsKey: "builds/development/ubuntu2404-aarch64",
                      secondName: "release/6.4.x", secondDockerTag: "nightly-6.4.x-noble",
                      secondBranchDirectory: "swift-6.4.x-branch",
                      secondBuildsKey: "builds/swift-6_4_x-branch/ubuntu2404",
                      secondAarch64BuildsKey: "builds/swift-6_4_x-branch/ubuntu2404-aarch64"),
        LinuxPlatform(page: "install/linux/ubuntu/26_04/index.md", name: "Ubuntu 26.04",
                      branchDirectory: "development", developmentName: "main", dockerTag: "nightly-resolute",
                      buildsKey: "builds/development/ubuntu2604", aarch64BuildsKey: "builds/development/ubuntu2604-aarch64"),
    ]
}

// MARK: - Per-page Linux context

extension InstallData {
    /// Everything `linux-releases.html` needed, for one platform.
    func linuxContext(for platform: LinuxPlatform) -> [String: LeafData] {
        var values: [String: LeafData] = [
            "platformName": .string(platform.name),
            "devBranches": .array(developmentBranches(for: platform)),
        ]
        if let release = releaseBox(for: platform) {
            values["release"] = release
        }
        values["olderReleases"] = .dictionary([
            "rows": olderReleases(forPlatformNamed: platform.name),
            "isWindows": .bool(false),
        ])
        return values
    }

    /// The stable-release box: container tag and per-architecture tarballs.
    /// Absent when the current release doesn't ship this platform, which is what
    /// the Liquid's `{% if platform %}` guarded.
    private func releaseBox(for platform: LinuxPlatform) -> LeafData? {
        let platforms = latestRelease["platforms"].array
        // The Liquid matched on the download directory first, then the name.
        guard let entry = platforms.first(where: { $0["dir"].string == platform.directoryName })
                ?? platforms.first(where: { $0["name"].string == platform.name })
        else { return nil }

        let tarballs: [LeafData] = entry["archs"].array.compactMap { arch in
            guard let arch = arch.string else { return nil }
            // Only non-x86_64 architectures carry a suffix.
            let suffix = arch == "x86_64" ? "" : "-\(arch)"
            let base = "https://download.swift.org/\(tagLowercased)/\(platform.directoryName)\(suffix)/\(tag)/\(tag)-\(platform.fileName)\(suffix).tar.gz"
            return .dictionary([
                "arch": .string(arch),
                "download": .string(base),
                "signature": .string(base + ".sig"),
            ])
        }

        return .dictionary([
            "dockerImage": .string(entry["docker"].string ?? ""),
            "tarballs": .array(tarballs),
        ])
    }

    /// The development-snapshot boxes: `main`, and the release branch when the
    /// page has one. Each carries its newest build plus the older ones the
    /// "Previous Snapshots" table lists.
    private func developmentBranches(for platform: LinuxPlatform) -> [LeafData] {
        var branches: [LeafData] = [
            developmentBranch(
                title: platform.developmentName,
                branchDirectory: platform.branchDirectory,
                buildsKey: platform.buildsKey,
                aarch64BuildsKey: platform.aarch64BuildsKey,
                dockerTag: platform.dockerTag,
                directoryName: platform.directoryName
            )
        ]
        if let secondName = platform.secondName,
           let secondBranch = platform.secondBranchDirectory,
           let secondBuilds = platform.secondBuildsKey {
            branches.append(developmentBranch(
                title: secondName,
                branchDirectory: secondBranch,
                buildsKey: secondBuilds,
                aarch64BuildsKey: platform.secondAarch64BuildsKey ?? "",
                dockerTag: platform.secondDockerTag ?? "",
                directoryName: platform.directoryName
            ))
        }
        return branches
    }

    private func developmentBranch(
        title: String,
        branchDirectory: String,
        buildsKey: String,
        aarch64BuildsKey: String,
        dockerTag: String,
        directoryName: String
    ) -> LeafData {
        let x86 = builds(key: buildsKey)
        let aarch64 = builds(key: aarch64BuildsKey)

        func links(_ build: DataValue?, suffix: String) -> LeafData {
            guard let build else { return .trueNil }
            let base = "https://download.swift.org/\(branchDirectory)/\(directoryName)\(suffix)/\(build["dir"].string ?? "")"
            return .dictionary([
                "download": .string("\(base)/\(build["download"].string ?? "")"),
                "signature": .string("\(base)/\(build["download_signature"].string ?? "")"),
            ])
        }

        return .dictionary([
            "title": .string(title),
            "date": .string(displayDate(x86.first?["date"] ?? .null)),
            "dockerTag": .string(dockerTag),
            "x86": links(x86.first, suffix: ""),
            "aarch64": links(aarch64.first, suffix: "-aarch64"),
            // `_older_snapshots.md`: skip the newest, then list the next ten.
            "olderSnapshots": .array(x86.dropFirst().prefix(10).map { build in
                let base = "https://download.swift.org/\(branchDirectory)/\(directoryName)/\(build["dir"].string ?? "")"
                var entry: [String: LeafData] = [
                    "date": .string(displayDate(build["date"])),
                    "download": .string("\(base)/\(build["download"].string ?? "")"),
                ]
                if let signature = build["download_signature"].string {
                    entry["signature"] = .string("\(base)/\(signature)")
                }
                if let debug = build["debug_info"].string {
                    entry["debugInfo"] = .string("\(base)/\(debug)")
                    if let debugSignature = build["debug_info_signature"].string {
                        entry["debugInfoSignature"] = .string("\(base)/\(debugSignature)")
                    }
                }
                return .dictionary(entry)
            }),
        ])
    }
}

// MARK: - Previous releases

extension InstallData {
    /// The "Previous Releases" table (`_includes/install/_older-releases.md` and
    /// `_old-release.html`), for one platform.
    ///
    /// The Liquid wrote `| offset: 1`, but `offset` is a for-loop parameter in
    /// Liquid, not a filter — it passed the array through untouched. So the
    /// table is every release, newest first, minus the current one (shown
    /// above), down to the oldest.
    func olderReleases(forPlatformNamed platformName: String) -> LeafData {
        let releases = data["builds/swift_releases"].array
        guard releases.count > 2 else { return .array([]) }
        let listed = releases.reversed().dropFirst()

        let rows: [LeafData] = listed.compactMap { release in
            guard let entry = release["platforms"].array.first(where: { $0["name"].string == platformName })
            else { return nil }
            return releaseRow(release: release, platform: entry)
        }
        return .array(rows)
    }

    private func releaseRow(release: DataValue, platform: DataValue) -> LeafData {
        let isWindows = platform["platform"].string == "Windows"
        let packageExtension = isWindows ? "exe" : "tar.gz"
        let tag = release["tag"].string ?? ""
        let tagLowercased = tag.lowercased()

        // Windows releases from 5.9.1 onward stopped shipping a signature, and
        // older ones carry a footnote marker.
        let signingCutoff = data["builds/swift_releases"].array
            .first { $0["name"].string == "5.9.1" }?["date"].string ?? ""
        let releaseDate = release["date"].string ?? ""
        let isPreSigningCutoff = isWindows && releaseDate < signingCutoff

        let architectures: [LeafData] = platform["archs"].array.compactMap { value in
            guard let arch = value.string else { return nil }
            var directory = platform["dir"].string
                ?? platform["name"].string?
                    .replacingOccurrences(of: ".", with: "")
                    .replacingOccurrences(of: " ", with: "")
                    .lowercased()
                ?? ""
            var fileName = platform["dir"].string
                ?? platform["name"].string?
                    .replacingOccurrences(of: " ", with: "")
                    .lowercased()
                ?? ""
            if arch != "x86_64" {
                directory += "-\(arch)"
                fileName += "-\(arch)"
            }
            let base = "https://download.swift.org/\(tagLowercased)/\(directory)/\(tag)/\(tag)-\(fileName).\(packageExtension)"
            var entry: [String: LeafData] = ["arch": .string(arch), "download": .string(base)]
            if !(isWindows && releaseDate >= signingCutoff) {
                entry["signature"] = .string(base + ".sig")
            }
            return .dictionary(entry)
        }

        var row: [String: LeafData] = [
            "name": .string(release["name"].string ?? ""),
            "date": .string(displayDate(release["date"])),
            "footnote": .bool(isPreSigningCutoff),
            "archs": .array(architectures),
            "isWindows": .bool(isWindows),
        ]
        if let docker = platform["docker"].string {
            row["docker"] = .string(docker)
        }
        if !isWindows,
           let staticSDK = release["platforms"].array.first(where: { $0["name"].string == "Static SDK" }) {
            row["staticSDKCommand"] = .string(
                "swift sdk install https://download.swift.org/\(tagLowercased)/static-sdk/\(tag)/\(tag)_static-linux-0.0.1.artifactbundle.tar.gz --checksum \(staticSDK["checksum"].string ?? "")"
            )
        }
        return .dictionary(row)
    }
}

// MARK: - macOS and Windows tables

extension InstallData {
    /// The macOS "Previous Releases" table, which lists the Xcode toolchain and
    /// its debugging symbols rather than per-architecture tarballs.
    func macOSOlderReleases() -> LeafData {
        let releases = data["builds/swift_releases"].array
        guard releases.count > 2 else { return .dictionary(["rows": .array([])]) }

        let rows: [LeafData] = releases.reversed().dropFirst().map { release in
            let tag = release["tag"].string ?? ""
            let base = "https://download.swift.org/\(tag.lowercased())/xcode/\(tag)/\(tag)"
            var row: [String: LeafData] = [
                "name": .string(release["name"].string ?? ""),
                "date": .string(displayDate(release["date"])),
                "toolchain": .string("\(base)-osx.pkg"),
                "symbols": .string("\(base)-osx-symbols.pkg"),
            ]
            if let staticSDK = release["platforms"].array.first(where: { $0["name"].string == "Static SDK" }) {
                row["staticSDKCommand"] = .string(
                    "swift sdk install https://download.swift.org/\(tag.lowercased())/static-sdk/\(tag)/\(tag)_static-linux-\(staticSDK["version"].string ?? "").artifactbundle.tar.gz --checksum \(staticSDK["checksum"].string ?? "")"
                )
            }
            return .dictionary(row)
        }
        return .dictionary(["rows": .array(rows)])
    }

    /// A "Previous Snapshots" table for any platform directory — the same shape
    /// the Linux pages use, so it reuses `partials/install/older-snapshots`.
    func snapshotTable(buildsKey: String, platformDirectory: String, branchDirectory: String) -> LeafData {
        let entries: [LeafData] = builds(key: buildsKey).dropFirst().prefix(10).map { build in
            let base = "https://download.swift.org/\(branchDirectory)/\(platformDirectory)/\(build["dir"].string ?? "")"
            var entry: [String: LeafData] = [
                "date": .string(displayDate(build["date"])),
                "download": .string("\(base)/\(build["download"].string ?? "")"),
            ]
            if let signature = build["download_signature"].string {
                entry["signature"] = .string("\(base)/\(signature)")
            }
            if let debug = build["debug_info"].string {
                entry["debugInfo"] = .string("\(base)/\(debug)")
                if let debugSignature = build["debug_info_signature"].string {
                    entry["debugInfoSignature"] = .string("\(base)/\(debugSignature)")
                }
            }
            return .dictionary(entry)
        }
        return .dictionary(["olderSnapshots": .array(entries)])
    }

    /// The current release's Windows installers, one per architecture.
    func windowsInstallers() -> LeafData {
        let entry = latestRelease["platforms"].array.first { $0["name"].string == "Windows 10" } ?? .null
        let installers: [LeafData] = entry["archs"].array.compactMap { value in
            guard let arch = value.string else { return nil }
            let suffix = arch == "x86_64" ? "" : "-\(arch)"
            return .dictionary([
                "arch": .string(arch),
                "download": .string("https://download.swift.org/\(tagLowercased)/windows10\(suffix)/\(tag)/\(tag)-windows10\(suffix).exe"),
            ])
        }
        return .array(installers)
    }
}

// MARK: - Latest-snapshot boxes

extension InstallData {
    /// The newest snapshot for a toolchain directory, with its download and
    /// debugging-symbols links — the box each platform page shows above its
    /// "Previous Snapshots" table.
    func latestSnapshot(buildsKey: String, branchDirectory: String, platformDirectory: String, title: String) -> LeafData {
        guard let build = newestBuild(key: buildsKey) else { return .dictionary(["title": .string(title)]) }
        let base = "https://download.swift.org/\(branchDirectory)/\(platformDirectory)/\(build["dir"].string ?? "")"
        var entry: [String: LeafData] = [
            "title": .string(title),
            "date": .string(displayDate(build["date"])),
            "download": .string("\(base)/\(build["download"].string ?? "")"),
        ]
        if let debug = build["debug_info"].string {
            entry["debugInfo"] = .string("\(base)/\(debug)")
        }
        return .dictionary(entry)
    }

    /// The current release's macOS toolchain installer.
    var macOSReleaseToolchain: String {
        "https://download.swift.org/\(tagLowercased)/xcode/\(tag)/\(tag)-osx.pkg"
    }
}
