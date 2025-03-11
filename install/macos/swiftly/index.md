---
layout: page
title: Getting Started with Swiftly on macOS
---

On macOS you can run download the pkg:
```
curl -O https://download.swift.org/swiftly/darwin/swiftly-{{ site.data.builds.swiftly_release.version }}.pkg
```

Run the pkg installer from the command-line like this:
```
installer -pkg swiftly-{{ site.data.builds.swiftly_release.version }}.pkg -target CurrentUserHomeDirectory
```

Now run swiftly init to finish the installation:
```
/usr/local/bin/swiftly init
```
Swiftly will install itself and download the latest available Swift toolchain. Follow the prompts for any additional steps. Once everything is done you can begin using swift.
```
$ swift --version


Swift version 6.0.3 (swift-6.0.3-RELEASE)
...


$ swift build        # Build with the latest (6.0.3) toolchain
```

You can install (and use) another release toolchain:
```
$ swiftly install --use 5.10


$ swift --version


Swift version 5.10.1 (swift-5.10.1-RELEASE)
...


$ swift build    # Build with the 5.10.1 toolchain
```

Quickly test your package with the latest nightly snapshot to prepare for the next release:
```
$ swiftly install main-snapshot
$ swiftly run swift test +main-snapshot   # Run "swift test" with the main-snapshot toolchain
$ swift build                             # Continue to build with my usual toolchain
```

Uninstall this toolchain after you’re finished with it:
```
$ swiftly uninstall main-snapshot
```

[Learn more about Swiftly](https://www.swift.org/swiftly/documentation/swiftlydocs)