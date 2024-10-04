---
layout: new-layouts/base
title: Expired Signing Keys
---

* `Swift Automatic Signing Key #3 <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/{{ automatic_signing_key_file_3 }}>

  Fingerprint
  : `8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA`

  Long ID
  : `FAF6989E1BC16FEA`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        '8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/{{ automatic_signing_key_file_3 }} | \
    gpg --import -
  ~~~


* `Swift Automatic Signing Key #2 <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/{{ automatic_signing_key_file_2 }}>

  Fingerprint
  : `8513 444E 2DA3 6B7C 1659  AF4D 7638 F1FB 2B2B 08C4`

  Long ID
  : `7638F1FB2B2B08C4`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        '8513 444E 2DA3 6B7C 1659  AF4D 7638 F1FB 2B2B 08C4'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/{{ automatic_signing_key_file_2 }} | \
    gpg --import -
  ~~~


* `Swift Automatic Signing Key #1 <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/{{ automatic_signing_key_file_1 }}>

  Fingerprint
  : `7463 A81A 4B2E EA1B 551F  FBCF D441 C977 412B 37AD`

  Long ID
  : `D441C977412B37AD`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        '7463 A81A 4B2E EA1B 551F  FBCF D441 C977 412B 37AD'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/{{ automatic_signing_key_file_1 }} | \
    gpg --import -
  ~~~


* `Swift 2.2 Release Signing Key <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/release-key-swift-2.2.asc>

  Fingerprint
  : `1BE1 E29A 084C B305 F397  D62A 9F59 7F4D 21A5 6D5F`

  Long ID
  : `9F597F4D21A56D5F`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        '1BE1 E29A 084C B305 F397  D62A 9F59 7F4D 21A5 6D5F'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/release-key-swift-2.2.asc | \
    gpg --import -
  ~~~

* `Swift 3.x Release Signing Key <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/release-key-swift-3.x.asc>

  Fingerprint
  : `A3BA FD35 56A5 9079 C068  94BD 63BC 1CFE 91D3 06C6`

  Long ID
  : `63BC1CFE91D306C6`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        'A3BA FD35 56A5 9079 C068  94BD 63BC 1CFE 91D3 06C6'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/release-key-swift-3.x.asc | \
    gpg --import -
  ~~~

* `Swift 4.x Release Signing Key <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/release-key-swift-4.x.asc>

  Fingerprint
  : `5E4D F843 FB06 5D7F 7E24  FBA2 EF54 30F0 71E1 B235`

  Long ID
  : `EF5430F071E1B235`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        '5E4D F843 FB06 5D7F 7E24  FBA2 EF54 30F0 71E1 B235'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/release-key-swift-4.x.asc | \
    gpg --import -
  ~~~
