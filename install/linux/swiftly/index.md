---
layout: page
title: Getting Started with Swiftly on Linux
---


Download swiftly for [Linux (Intel)](https://download.swift.org/swiftly/linux/swiftly-{{ site.data.builds.swiftly_release.version }}-x86_64.tar.gz), or [Linux (ARM)](https://download.swift.org/swiftly/linux/swiftly-{{ site.data.builds.swiftly_release.version }}-aarch64.tar.gz).


```
curl -O "https://download.swift.org/swiftly/linux/swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz"
```


You can verify the integrity of the archive using the PGP signature. This will download the signature, install the swift.org signatures into your keychain, and verify the signature.


```
curl --compressed https://www.swift.org/keys/all-keys.asc | gpg --import -
curl -O "https://download.swift.org/swiftly/linux/swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz.sig"
gpg --verify swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz.sig swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz
```


Extract the archive.


```
tar -zxf swiftly-{{ site.data.builds.swiftly_release.version }}-$(uname -m).tar.gz
```


Run the following command in your terminal, to configure swiftly for your account, and automatically download the latest swift toolchain.


```
./swiftly init
```


Note: You can set the SWIFTLY_HOME_DIR and SWIFTLY_BIN_DIR environment variables to customize your install location.


Your current shell may need some additional steps to update your session. Follow the guidance at the end of the installation for a smooth install experience, such as sourcing the environment file, and rehashing your shell's PATH.


There can be certain packages that need to be installed on your system so that the Swift toolchain can function. The swiftly initialization routine will show you how to install any missing packages.


Now that swiftly and swift are installed, you can access the `swift` command from the latest Swift release:


```
swift --version
--
Swift version {{ site.data.builds.swift_releases.last.name }} (swift-{{ site.data.builds.swift_releases.last.name }}-RELEASE)
