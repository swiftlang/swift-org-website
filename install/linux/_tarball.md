## Installation via Tarball

0. Install required dependencies:

{% include linux/table.html %}

0. Download the latest binary release ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases)).

   The `swift-<VERSION>-<PLATFORM>.tar.gz` file is the toolchain itself.
   The `.sig` file is the digital signature.

0. If you are downloading Swift packages **for the first time**, use one of the following commands to import the Pretty Good Privacy (PGP) keys into your keyring. *You can skip this step if you have imported the keys in the past.*

{% assign all_keys_file = 'all-keys.asc' %}
{% assign automatic_signing_key_file = 'automatic-signing-key-4.asc' %}
{% assign automatic_signing_key_file_3 = 'automatic-signing-key-3.asc' %}
{% assign automatic_signing_key_file_2 = 'automatic-signing-key-2.asc' %}
{% assign automatic_signing_key_file_1 = 'automatic-signing-key-1.asc' %}

   ~~~ shell
   $ gpg --keyserver hkp://keyserver.ubuntu.com \
         --recv-keys \
         '7463 A81A 4B2E EA1B 551F  FBCF D441 C977 412B 37AD' \
         '1BE1 E29A 084C B305 F397  D62A 9F59 7F4D 21A5 6D5F' \
         'A3BA FD35 56A5 9079 C068  94BD 63BC 1CFE 91D3 06C6' \
         '5E4D F843 FB06 5D7F 7E24  FBA2 EF54 30F0 71E1 B235' \
         '8513 444E 2DA3 6B7C 1659  AF4D 7638 F1FB 2B2B 08C4' \
         'A62A E125 BBBF BB96 A6E0  42EC 925C C1CC ED3D 1561' \
         '8A74 9566 2C3C D4AE 18D9  5637 FAF6 989E 1BC1 6FEA' \
         'E813 C892 820A 6FA1 3755  B268 F167 DF1A CF9C E069'
   ~~~

   Or use this command:

   ~~~ shell
   $ wget -q -O - https://swift.org/keys/{{ all_keys_file }} | \
     gpg --import -
   ~~~

0. Verify the PGP signature to ensure the authenticity and integrity of the key or keyring.

   The `.tar.gz` archives for Linux are signed using GNU Privacy Guard (GPG)
   with one of the keys of the Swift open source project.
   We strongly encouraged you to verify the signatures
   before using the software by following these steps:

   a: Run the following command to refresh the keys to download new key revocation certificates (if available):

   ~~~ shell
   $ gpg --keyserver hkp://keyserver.ubuntu.com --refresh-keys Swift
   ~~~

   b: Use the signature file to verify the archive is intact by running this command:

   ~~~ shell
   $ gpg --verify swift-<VERSION>-<PLATFORM>.tar.gz.sig
   ...
   gpg: Good signature from "Swift Automatic Signing Key #4 <swift-infrastructure@forums.swift.org>"
   ~~~

   <div class="warning" markdown="1">
If you get the error `gpg: Can't check signature: No public key` while using `gpg` to verify a signature, you need to import the required keys into your keyring. Follow the instructions in the [Active Signing Keys](https://www.swift.org/install/windows/#active-signing-keys) documentation to do this. After importing the keys, you should be able to verify the signature without any issues.
    </div>

   If you get the following warning message that states there is no path in the Web of Trust between the key and you, it means there is no established trust between the two. However, this warning can be safely ignored if you followed the necessary steps to retrieve the key from a trusted source. By doing so, you can ensure that the key is authentic and secure for your use.

   ~~~ shell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ~~~


   <div class="warning" markdown="1">
   If `gpg` fails to verify and reports a *BAD signature* error,
   **do not** use the downloaded toolchain.
   Instead, send an email to <swift-infrastructure@forums.swift.org>
   with all the relevant details of the error. Our team will investigate the problem and provide you with a solution as soon as possible.
   </div>

0. To create a `usr/` directory in the location of the archive, extract the archive using the following command:

   ~~~ shell
   $ tar xzf swift-<VERSION>-<PLATFORM>.tar.gz
   ~~~

0. Add the Swift toolchain to your path by running this command:

   ~~~ shell
   $ export PATH=/path/to/usr/bin:"${PATH}"
   ~~~

   You can now execute the `swift` command to run the REPL or build Swift projects.

### Active Signing Keys

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


### Expired Signing Keys

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
  
