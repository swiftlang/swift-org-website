## Installation via Tarball

0. Install required dependencies:

{% include linux/table.html %}

0. Download the latest binary release ([{{ site.data.builds.swift_releases.last.name }}](/download/#releases)).

   The `swift-<VERSION>-<PLATFORM>.tar.gz` file is the toolchain itself.
   The `.sig` file is the digital signature.

0. If you are downloading Swift packages **for the first time**, import the PGP
   keys into your keyring:

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

   or:

   ~~~ shell
   $ wget -q -O - https://swift.org/keys/{{ all_keys_file }} | \
     gpg --import -
   ~~~

   Skip this step if you have imported the keys in the past.

0. Verify the PGP signature.

   The `.tar.gz` archives for Linux are signed using GnuPG
   with one of the keys of the Swift open source project.
   Everyone is strongly encouraged to verify the signatures
   before using the software.

   First, refresh the keys to download new key revocation certificates,
   if any are available:

   ~~~ shell
   $ gpg --keyserver hkp://keyserver.ubuntu.com --refresh-keys Swift
   ~~~

   Then, use the signature file to verify that the archive is intact:

   ~~~ shell
   $ gpg --verify swift-<VERSION>-<PLATFORM>.tar.gz.sig
   ...
   gpg: Good signature from "Swift Automatic Signing Key #4 <swift-infrastructure@forums.swift.org>"
   ~~~

   If `gpg` fails to verify because you don't have the public key (`gpg: Can't
   check signature: No public key`), please follow the instructions in
   [Active Signing Keys](#active-signing-keys) below to
   import the keys into your keyring.

   You might see a warning:

   ~~~ shell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ~~~

   This warning means that there is no path in the Web of Trust between this
   key and you.  The warning is harmless as long as you have followed the steps
   above to retrieve the key from a trusted source.

   <div class="warning" markdown="1">
   If `gpg` fails to verify and reports "BAD signature",
   do not use the downloaded toolchain.
   Instead, please email <swift-infrastructure@forums.swift.org>
   with as much detail as possible,
   so that we can investigate the problem.
   </div>

0. Extract the archive with the following command:

   ~~~ shell
   $ tar xzf swift-<VERSION>-<PLATFORM>.tar.gz
   ~~~

   This creates a `usr/` directory in the location of the archive.

0. Add the Swift toolchain to your path as follows:

   ~~~ shell
   $ export PATH=/path/to/usr/bin:"${PATH}"
   ~~~

   You can now execute the `swift` command to run the REPL or build Swift projects.
