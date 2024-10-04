---
layout: new-layouts/base
title: Download Swift
---

{% assign xcode_development_builds = site.data.builds.development.xcode | sort: 'date' | reverse %}
{% assign ubuntu1804_development_builds = site.data.builds.development.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_development_builds = site.data.builds.development.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_development_builds = site.data.builds.development.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_development_builds = site.data.builds.development.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_development_builds = site.data.builds.development.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign centos7_development_builds = site.data.builds.development.centos7 | sort: 'date' | reverse %}
{% assign centos8_development_builds = site.data.builds.development.centos8 | sort: 'date' | reverse %}
{% assign centos8_aarch64_development_builds = site.data.builds.development.centos8-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_development_builds = site.data.builds.development.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_development_builds = site.data.builds.development.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_development_builds = site.data.builds.development.windows10 | sort: 'date' | reverse %}
{% assign ubi9_development_builds = site.data.builds.development.ubi9 | sort: 'date' | reverse %}
{% assign ubi9_aarch64_development_builds = site.data.builds.development.ubi9-aarch64 | sort: 'date' | reverse %}

{% assign xcode_5_10_builds = site.data.builds.swift-5_10-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu1804_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2310_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2310 | sort: 'date' | reverse %}
{% assign ubuntu2310_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2310-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2404_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2404 | sort: 'date' | reverse %}
{% assign ubuntu2404_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.ubuntu2404-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_10_builds = site.data.builds.swift-5_10-branch.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_10_builds = site.data.builds.swift-5_10-branch.centos7 | sort: 'date' | reverse %}
{% assign ubi9_5_10_builds = site.data.builds.swift-5_10-branch.ubi9 | sort: 'date' | reverse %}
{% assign ubi9_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.ubi9-aarch64 | sort: 'date' | reverse %}
{% assign debian12_5_10_builds = site.data.builds.swift-5_10-branch.debian12 | sort: 'date' | reverse %}
{% assign debian12_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.debian12-aarch64 | sort: 'date' | reverse %}
{% assign fedora39_5_10_builds = site.data.builds.swift-5_10-branch.fedora39 | sort: 'date' | reverse %}
{% assign fedora39_aarch64_5_10_builds = site.data.builds.swift-5_10-branch.fedora39-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_10_builds = site.data.builds.swift-5_10-branch.windows10 | sort: 'date' | reverse %}

{% assign xcode_6_0_builds = site.data.builds.swift-6_0-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu2004_6_0_builds = site.data.builds.swift-6_0-branch.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_6_0_builds = site.data.builds.swift-6_0-branch.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_6_0_builds = site.data.builds.swift-6_0-branch.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_6_0_builds = site.data.builds.swift-6_0-branch.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_6_0_builds = site.data.builds.swift-6_0-branch.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_6_0_builds = site.data.builds.swift-6_0-branch.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign centos7_6_0_builds = site.data.builds.swift-6_0-branch.centos7 | sort: 'date' | reverse %}
{% assign ubi9_6_0_builds = site.data.builds.swift-6_0-branch.ubi9 | sort: 'date' | reverse %}
{% assign ubi9_aarch64_6_0_builds = site.data.builds.swift-6_0-branch.ubi9-aarch64 | sort: 'date' | reverse %}
{% assign windows10_6_0_builds = site.data.builds.swift-6_0-branch.windows10 | sort: 'date' | reverse %}

{% assign swift_5_9_1_release_build = site.data.builds.swift_releases | where: 'name', '5.9.1' | first %}
{% assign swift_5_9_1_release_date_string = swift_5_9_1_release_build.date | date: '%Y-%m-%d' %}


## Releases

### Swift {{ site.data.builds.swift_releases.last.name }}
Date: {{ site.data.builds.swift_releases.last.date | date: '%B %-d, %Y' }}<br>
Tag: [{{site.data.builds.swift_releases.last.tag}}](https://github.com/swiftlang/swift/releases/tag/{{ site.data.builds.swift_releases.last.tag }})

{% include_relative _build-release.html release=site.data.builds.swift_releases.last %}

<details class="download">
  <summary>Older Releases</summary>
{% assign releases = site.data.builds.swift_releases | offset:1  %}
{% for release in releases reversed %}
{% unless forloop.first %}
	<h3>Swift {{ release.name }}</h3>
	Date: {{ release.date | date: '%B %-d, %Y' }}<br>
	Tag: <a href="https://github.com/swiftlang/swift/releases/tag/{{ release.tag }}">{{ release.tag }}</a>

	{% include_relative _build-release.html release=release %}
{% endunless %}

{% endfor %}

</details>



## Snapshots

### Trunk Development (main)

Development snapshots are prebuilt binaries
that are automatically created from mainline development branches.
These snapshots are not official releases.
They have gone through automated unit testing,
but they have not gone through the full testing that is performed for official releases.

<table id="latest-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Download</th>
            <th class="date">Date</th>
            <th class="arch-tag">Architecture</th>
            <th class="docker-tag">Docker Tag</th>
        </tr>
    </thead>
    <tbody>
        {% include_relative _build-snapshot.html platform="Apple Platforms" build=xcode_development_builds.first name="Xcode" platform_dir="xcode" branch_dir="development" arch="Universal" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu1804_development_builds.first name="Ubuntu 18.04" docker_tag="nightly-bionic" platform_dir="ubuntu1804" branch_dir="development" arch="x86_64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2004_development_builds.first build_2=ubuntu2004_aarch64_development_builds.first name="Ubuntu 20.04" docker_tag="nightly-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2204_development_builds.first build_2=ubuntu2204_aarch64_development_builds.first name="Ubuntu 22.04" docker_tag="nightly-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=centos7_development_builds.first name="CentOS 7" docker_tag="nightly-centos7" platform_dir="centos7" branch_dir="development" arch="x86_64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=amazonlinux2_development_builds.first build_2=amazonlinux2_aarch64_development_builds.first name="Amazon Linux 2" docker_tag="nightly-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubi9_development_builds.first build_2=ubi9_aarch64_development_builds.first name="Red Hat Universal Base Image 9" docker_tag="Coming Soon" platform_dir="ubi9" platform_dir_2="ubi9-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Windows" build=windows10_development_builds.first name="Windows 10" platform_dir="windows10" branch_dir="development" arch="x86_64" %}
    </tbody>
</table>

{% assign windows10_development_build_date_string = windows10_development_builds.first.date | date: '%Y-%m-%d' %}
{% if windows10_development_build_date_string < swift_5_9_1_release_date_string %}
<sup>1</sup> This Swift Windows 10 development snapshot is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>
{% endif %}

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-development-snapshots.md %}
</details>


### Swift 6.0 Development

Swift 6.0 snapshots are prebuilt binaries
that are automatically created from `release/6.0` branch.
These snapshots are not official releases.
They have gone through automated unit testing,
but they have not gone through the full testing that is performed for official releases.

<table id="latest-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Download</th>
            <th class="date">Date</th>
            <th class="arch-tag">Architecture</th>
            <th class="docker-tag">Docker Tag</th>
        </tr>
    </thead>
    <tbody>
        {% include_relative _build-snapshot.html platform="Apple Platforms" build=xcode_6_0_builds.first name="Xcode" platform_dir="xcode" branch_dir="swift-6.0-branch" arch="Universal" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2004_6_0_builds.first build_2=ubuntu2004_aarch64_6_0_builds.first name="Ubuntu 20.04" docker_tag="nightly-6.0-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="swift-6.0-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2204_6_0_builds.first build_2=ubuntu2204_aarch64_6_0_builds.first name="Ubuntu 22.04" docker_tag="nightly-6.0-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="swift-6.0-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=centos7_6_0_builds.first name="CentOS 7" docker_tag="nightly-6.0-centos7" platform_dir="centos7" branch_dir="swift-6.0-branch" arch="x86_64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=amazonlinux2_6_0_builds.first build_2=amazonlinux2_aarch64_6_0_builds.first name="Amazon Linux 2" docker_tag="nightly-6.0-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="swift-6.0-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubi9_6_0_builds.first build_2=ubi9_aarch64_6_0_builds.first name="Red Hat Universal Base Image 9" docker_tag="nightly-6.0-rhel-ubi9" platform_dir="ubi9" platform_dir_2="ubi9-aarch64" branch_dir="swift-6.0-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Windows" build=windows10_6_0_builds.first name="Windows 10" platform_dir="windows10" branch_dir="swift-6.0-branch" arch="x86_64" %}
    </tbody>
</table>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-6_0-snapshots.md %}
</details>


### Swift 5.10 Development

Swift 5.10 snapshots are prebuilt binaries
that are automatically created from `release/5.10` branch.
These snapshots are not official releases.
They have gone through automated unit testing,
but they have not gone through the full testing that is performed for official releases.

<table id="latest-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Download</th>
            <th class="date">Date</th>
            <th class="arch-tag">Architecture</th>
            <th class="docker-tag">Docker Tag</th>
        </tr>
    </thead>
    <tbody>
        {% include_relative _build-snapshot.html platform="Apple Platforms" build=xcode_5_10_builds.first name="Xcode" platform_dir="xcode" branch_dir="swift-5.10-branch" arch="Universal" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu1804_5_10_builds.first name="Ubuntu 18.04" docker_tag="nightly-5.10-bionic" platform_dir="ubuntu1804" branch_dir="swift-5.10-branch" arch="x86_64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2004_5_10_builds.first build_2=ubuntu2004_aarch64_5_10_builds.first name="Ubuntu 20.04" docker_tag="nightly-5.10-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2204_5_10_builds.first build_2=ubuntu2204_aarch64_5_10_builds.first name="Ubuntu 22.04" docker_tag="nightly-5.10-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2310_5_10_builds.first build_2=ubuntu2310_aarch64_5_10_builds.first name="Ubuntu 23.10" docker_tag="Coming Soon" platform_dir="ubuntu2310" platform_dir_2="ubuntu2310-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubuntu2404_5_10_builds.first build_2=ubuntu2404_aarch64_5_10_builds.first name="Ubuntu 24.04" docker_tag="Coming Soon" platform_dir="ubuntu2404" platform_dir_2="ubuntu2404-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=centos7_5_10_builds.first name="CentOS 7" docker_tag="nightly-5.10-centos7" platform_dir="centos7" branch_dir="swift-5.10-branch" arch="x86_64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=amazonlinux2_5_10_builds.first build_2=amazonlinux2_aarch64_5_10_builds.first name="Amazon Linux 2" docker_tag="nightly-5.10-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=ubi9_5_10_builds.first build_2=ubi9_aarch64_5_10_builds.first name="Red Hat Universal Base Image 9" docker_tag="nightly-5.10-rhel-ubi9" platform_dir="ubi9" platform_dir_2="ubi9-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=debian12_5_10_builds.first build_2=debian12_aarch64_5_10_builds.first name="Debian 12" docker_tag="Coming Soon" platform_dir="debian12" platform_dir_2="debian12-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Linux" build=fedora39_5_10_builds.first build_2=fedora39_aarch64_5_10_builds.first name="Fedora 39" docker_tag="Coming Soon" platform_dir="fedora39" platform_dir_2="fedora39-aarch64" branch_dir="swift-5.10-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-snapshot.html platform="Windows" build=windows10_5_10_builds.first name="Windows 10" platform_dir="windows10" branch_dir="swift-5.10-branch" arch="x86_64" %}
    </tbody>
</table>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-5_10-snapshots.md %}
</details>


{% include getting-started/_installing.md %}

Swift is covered by the Swift License at [swift.org/LICENSE.txt](/LICENSE.txt).



