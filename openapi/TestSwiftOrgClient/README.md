# Test Swift.org client

This simple Swift package contains a Swift HTTP Client that can be used to test the Swift.org API.

It is generated from the OpenAPI document of Swift.org and generated using Swift OpenAPI Generator.

## Usage

You can run it either against the Swift.org API or against a locally running API.

By default, the tool runs against the Swift.org API.

Run against production using:
```
SWIFTORG_SERVER_NAME=prod swift run
```

Run against a locally running server using:
```
SWIFTORG_SERVER_NAME=local swift run
```

The exact server URLs are defined in the OpenAPI document.

If the tool detects a deserialization error, possibly because the OpenAPI document does not correctly parse the returned data, it will exit with a non-zero exit code.

If all test cases run successfully, the tool exits with 0.

Sample output:

```
% SWIFTORG_SERVER_NAME=prod swift run
Testing SwiftOrg API at https://www.swift.org/api/v1...
✅ listReleases
✅ listDevToolchains(main, amazonlinux2)
✅ listDevToolchains(main, centos7)
✅ listDevToolchains(main, macos)
✅ listDevToolchains(main, ubi9)
✅ listDevToolchains(main, ubuntu2004)
✅ listDevToolchains(main, ubuntu2204)
✅ listDevToolchains(main, windows10)
✅ listDevToolchains(6.0, amazonlinux2)
✅ listDevToolchains(6.0, centos7)
✅ listDevToolchains(6.0, macos)
✅ listDevToolchains(6.0, ubi9)
✅ listDevToolchains(6.0, ubuntu2004)
✅ listDevToolchains(6.0, ubuntu2204)
✅ listDevToolchains(6.0, windows10)
✅ listStaticSDKDevToolchains(main)
✅ listStaticSDKDevToolchains(6.0)
```
