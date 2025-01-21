// swift-tools-version: 6.0
import PackageDescription

let clientNames: [String] = [
    "swiftorgClient",
    "downloadswiftorgClient",
]

let package = Package(
    name: "TestSwiftOrgClient",
    platforms: [
        .macOS(.v13),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-openapi-runtime", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "Shared",
            path: "Shared"
        )
    ] + clientNames.map { name in
        .executableTarget(
            name: name,
            dependencies: [
                "Shared",
                .product(name: "OpenAPIRuntime", package: "swift-openapi-runtime"),
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
            ],
            path: name,
            plugins: [
                .plugin(name: "OpenAPIGenerator", package: "swift-openapi-generator"),
            ]
        )
    }
)
