---
layout: new-layouts/base
title: Active Signing Keys
---

{% assign all_keys_file = 'all-keys.asc' %}
{% assign automatic_signing_key_file = 'automatic-signing-key-4.asc' %}
{% assign automatic_signing_key_file_3 = 'automatic-signing-key-3.asc' %}
{% assign automatic_signing_key_file_2 = 'automatic-signing-key-2.asc' %}
{% assign automatic_signing_key_file_1 = 'automatic-signing-key-1.asc' %}

The Swift project uses one set of keys for snapshot builds, and separate keys for
every official release.  We are using 4096-bit RSA keys.

The following keys are being used to sign toolchain packages:

* `Swift Automatic Signing Key #4 <swift-infrastructure@forums.swift.org>`

  Download
  : <https://swift.org/keys/{{ automatic_signing_key_file }}>

  Fingerprint
  : `E813 C892 820A 6FA1 3755  B268 F167 DF1A CF9C E069`

  Long ID
  : `F167DF1ACF9CE069`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        'E813 C892 820A 6FA1 3755  B268 F167 DF1A CF9C E069'
  ~~~

  Or

   ~~~ shell
  $ wget -q -O - https://swift.org/keys/{{ automatic_signing_key_file }} | \
    gpg --import -
  ~~~


 * `Swift 5.x Release Signing Key <swift-infrastructure@swift.org>`

  Download
  : <https://swift.org/keys/release-key-swift-5.x.asc>

  Fingerprint
  : `A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561`

  Long ID
  : `925CC1CCED3D1561`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/release-key-swift-5.x.asc | \
    gpg --import -
  ~~~


 * `Swift 6.x Release Signing Key <swift-infrastructure@forums.swift.org>`

  Download
  : <https://swift.org/keys/release-key-swift-6.x.asc>

  Fingerprint
  : `52BB 7E3D E28A 71BE 22EC 05FF EF80 A866 B47A 981F`

  Long ID
  : `EF80A866B47A981F`

  To import the key, run:

  ~~~ shell
  $ gpg --keyserver hkp://keyserver.ubuntu.com \
        --recv-keys \
        '52BB 7E3D E28A 71BE 22EC 05FF EF80 A866 B47A 981F'
  ~~~

  Or:

  ~~~ shell
  $ wget -q -O - https://swift.org/keys/release-key-swift-6.x.asc | \
    gpg --import -
  ~~~
