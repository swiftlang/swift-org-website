// swift-tools-version:6.3
import PackageDescription

let package = Package(
    name: "swift-org-website",
    platforms: [.macOS(.v13)],
    dependencies: [
        // Local checkout carrying `kiln-changes.patch` (see ARCHITECTURE.md).
        // Switch back to the released package once that lands upstream.
        .package(name: "kiln", path: ".kiln"),
        .package(url: "https://github.com/jpsim/Yams.git", from: "5.0.0"),
        .package(url: "https://github.com/vapor-community/leaf-markdown.git", from: "4.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "SwiftOrgSite",
            dependencies: [
                .product(name: "Kiln", package: "kiln"),
                .product(name: "LeafMarkdown", package: "leaf-markdown"),
                .product(name: "Yams", package: "Yams"),
            ]
        )
    ]
)
