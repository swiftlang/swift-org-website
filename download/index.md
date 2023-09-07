---
layout: page
title: Download Swift
---

{% assign xcode_development_builds = site.data.builds.development.xcode | sort: 'date' | reverse %}
{% assign ubuntu1510_development_builds = site.data.builds.development.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_development_builds = site.data.builds.development.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_development_builds = site.data.builds.development.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_development_builds = site.data.builds.development.ubuntu1610 | sort: 'date' | reverse %}
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

{% assign xcode_5_8_builds = site.data.builds.swift-5_8-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu1804_5_8_builds = site.data.builds.swift-5_8-branch.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_8_builds = site.data.builds.swift-5_8-branch.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_8_builds = site.data.builds.swift-5_8-branch.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_8_builds = site.data.builds.swift-5_8-branch.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_8_builds = site.data.builds.swift-5_8-branch.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_8_builds = site.data.builds.swift-5_8-branch.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_8_builds = site.data.builds.swift-5_8-branch.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_8_builds = site.data.builds.swift-5_8-branch.centos7 | sort: 'date' | reverse %}
{% assign ubi9_5_8_builds = site.data.builds.swift-5_8-branch.ubi9 | sort: 'date' | reverse %}
{% assign ubi9_aarch64_5_8_builds = site.data.builds.swift-5_8-branch.ubi9-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_8_builds = site.data.builds.swift-5_8-branch.windows10 | sort: 'date' | reverse %}

{% assign xcode_5_9_builds = site.data.builds.swift-5_9-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu1804_5_9_builds = site.data.builds.swift-5_9-branch.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_9_builds = site.data.builds.swift-5_9-branch.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_9_builds = site.data.builds.swift-5_9-branch.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_9_builds = site.data.builds.swift-5_9-branch.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_9_builds = site.data.builds.swift-5_9-branch.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_9_builds = site.data.builds.swift-5_9-branch.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_9_builds = site.data.builds.swift-5_9-branch.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_9_builds = site.data.builds.swift-5_9-branch.centos7 | sort: 'date' | reverse %}
{% assign ubi9_5_9_builds = site.data.builds.swift-5_9-branch.ubi9 | sort: 'date' | reverse %}
{% assign ubi9_aarch64_5_9_builds = site.data.builds.swift-5_9-branch.ubi9-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_9_builds = site.data.builds.swift-5_9-branch.windows10 | sort: 'date' | reverse %}


{% assign xcode_2_2_builds = site.data.builds.swift-2_2-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu1510_2_2_builds = site.data.builds.swift-2_2-branch.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_2_2_builds = site.data.builds.swift-2_2-branch.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1510_3_0_p1_builds = site.data.builds.swift-3_0-preview-1.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_p1_builds = site.data.builds.swift-3_0-preview-1.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_p2_builds = site.data.builds.swift-3_0-preview-2.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_p2_builds = site.data.builds.swift-3_0-preview-2.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_p3_builds = site.data.builds.swift-3_0-preview-3.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_p3_builds = site.data.builds.swift-3_0-preview-3.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_p4_builds = site.data.builds.swift-3_0-preview-4.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_p4_builds = site.data.builds.swift-3_0-preview-4.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_p5_builds = site.data.builds.swift-3_0-preview-5.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_p5_builds = site.data.builds.swift-3_0-preview-5.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_p6_builds = site.data.builds.swift-3_0-preview-6.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_p6_builds = site.data.builds.swift-3_0-preview-6.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1510_3_0_gmc_builds = site.data.builds.swift-3_0-GM-CANDIDATE.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_gmc_builds = site.data.builds.swift-3_0-GM-CANDIDATE.ubuntu1404 | sort: 'date' | reverse %}


{% assign ubuntu1510_3_0_1_p1_builds = site.data.builds.swift-3_0_1-preview-1.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_1_p1_builds = site.data.builds.swift-3_0_1-preview-1.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_0_1_p1_builds = site.data.builds.swift-3_0_1-preview-1.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_1_p2_builds = site.data.builds.swift-3_0_1-preview-2.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_1_p2_builds = site.data.builds.swift-3_0_1-preview-2.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_0_1_p2_builds = site.data.builds.swift-3_0_1-preview-2.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_1_p3_builds = site.data.builds.swift-3_0_1-preview-3.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_1_p3_builds = site.data.builds.swift-3_0_1-preview-3.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_0_1_p3_builds = site.data.builds.swift-3_0_1-preview-3.ubuntu1604 | sort: 'date' | reverse %}

{% assign ubuntu1510_3_0_1_gmc_builds = site.data.builds.swift-3_0_1-GM-CANDIDATE.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_1_gmc_builds = site.data.builds.swift-3_0_1-GM-CANDIDATE.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_0_1_gmc_builds = site.data.builds.swift-3_0_1-GM-CANDIDATE.ubuntu1604 | sort: 'date' | reverse %}

{% assign ubuntu1604_3_0_2_p1_builds = site.data.builds.swift-3_0_2-preview-1.ubuntu1604 | sort: 'date' | reverse %}

{% assign xcode_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.xcode | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1804 | sort: 'date' | reverse %}


{% assign ubuntu1804_5_8_1_release = site.data.builds.swift-5_8_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_8_1_release = site.data.builds.swift-5_8_1-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_8_1_release = site.data.builds.swift-5_8_1-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_8_1_release = site.data.builds.swift-5_8_1-release.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_8_1_release = site.data.builds.swift-5_8_1-release.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign ubi9_5_8_1_release = site.data.builds.swift-5_8_1-release.ubi9 | sort: 'date' | reverse %}
{% assign ubi9_aarch64_5_8_1_release = site.data.builds.swift-5_8_1-release.ubi9-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_8_1_release = site.data.builds.swift-5_8_1-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_8_1_release = site.data.builds.swift-5_8_1-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_8_1_release = site.data.builds.swift-5_8_1-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_8_1_release = site.data.builds.swift-5_8_1-release.windows10 | sort: 'date' | reverse %}

## Releases

### Swift {{ site.data.builds.swift_releases.last.name }}  
Date: {{ site.data.builds.swift_releases.last.date | date: '%B %-d, %Y' }}<br>
Tag: [{{site.data.builds.swift_releases.last.tag}}](https://github.com/apple/swift/releases/tag/{{ site.data.builds.swift_releases.last.tag }})

{% include_relative _build-platform.html platform=site.data.builds.swift_releases.last %}

<details class="download">
  <summary>Older Releases</summary>
{% assign releases = site.data.builds.swift_releases | offset:1  %}
{% for release in releases reversed %}
{% unless forloop.first %}
	<h3>Swift {{ release.name }}</h3>
	Date: {{ release.date | date: '%B %-d, %Y' }}<br>
	Tag: <a href="https://github.com/apple/swift/releases/tag/{{ release.tag }}">{{ release.tag }}</a>

	{% include_relative _build-platform.html platform=release %}
{% endunless %}

{% endfor %}

</details>



## Snapshots

### Trunk Development (main)

Development Snapshots are prebuilt binaries
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
        {% include_relative _build-arch.html platform="Apple Platforms" build=xcode_development_builds.first name="Xcode" platform_dir="xcode" branch_dir="development" arch="Universal" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu1804_development_builds.first name="Ubuntu 18.04" docker_tag="nightly-bionic" platform_dir="ubuntu1804" branch_dir="development" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2004_development_builds.first build_2=ubuntu2004_aarch64_development_builds.first name="Ubuntu 20.04" docker_tag="nightly-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2204_development_builds.first build_2=ubuntu2204_aarch64_development_builds.first name="Ubuntu 22.04" docker_tag="nightly-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=centos7_development_builds.first name="CentOS 7" docker_tag="nightly-centos7" platform_dir="centos7" branch_dir="development" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=amazonlinux2_development_builds.first build_2=amazonlinux2_aarch64_development_builds.first name="Amazon Linux 2" docker_tag="nightly-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubi9_development_builds.first build_2=ubi9_aarch64_development_builds.first name="Red Hat Universal Base Image 9" docker_tag="Coming Soon" platform_dir="ubi9" platform_dir_2="ubi9-aarch64" branch_dir="development" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="windows" build=windows10_development_builds.first name="Windows 10" platform_dir="windows10" branch_dir="development" arch="x86_64" %}
    </tbody>
</table>

<sup>1</sup> Swift Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-development-snapshots.md %}
</details>

### Swift 5.9 Development

Swift 5.9 Snapshots are prebuilt binaries
that are automatically created from `release/5.9` branch.
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
        {% include_relative _build-arch.html platform="Apple Platforms" build=xcode_5_9_builds.first name="Xcode" platform_dir="xcode" branch_dir="swift-5.9-branch" arch="Universal" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu1804_5_9_builds.first name="Ubuntu 18.04" docker_tag="nightly-5.9-bionic" platform_dir="ubuntu1804" branch_dir="swift-5.9-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2004_5_9_builds.first build_2=ubuntu2004_aarch64_5_9_builds.first name="Ubuntu 20.04" docker_tag="nightly-5.9-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="swift-5.9-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2204_5_9_builds.first build_2=ubuntu2204_aarch64_5_9_builds.first name="Ubuntu 22.04" docker_tag="nightly-5.9-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="swift-5.9-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=centos7_5_9_builds.first name="CentOS 7" docker_tag="nightly-5.9-centos7" platform_dir="centos7" branch_dir="swift-5.9-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=amazonlinux2_5_9_builds.first build_2=amazonlinux2_aarch64_5_9_builds.first name="Amazon Linux 2" docker_tag="nightly-5.9-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="swift-5.9-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubi9_5_9_builds.first build_2=ubi9_aarch64_5_9_builds.first name="Red Hat Universal Base Image 9" docker_tag="nightly-5.9-rhel-ubi9" platform_dir="ubi9" platform_dir_2="ubi9-aarch64" branch_dir="swift-5.9-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="windows" build=windows10_5_9_builds.first name="Windows 10" platform_dir="windows10" branch_dir="swift-5.9-branch" arch="x86_64" %}
    </tbody>
</table>

<sup>1</sup> Swift Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-5_9-snapshots.md %}
</details>


### Swift 5.8 Development

Swift 5.8 Snapshots are prebuilt binaries
that are automatically created from `release/5.8` branch.
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
        {% include_relative _build-arch.html platform="Apple Platforms" build=xcode_5_8_builds.first name="Xcode" platform_dir="xcode" branch_dir="swift-5.8-branch" arch="Universal" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu1804_5_8_builds.first name="Ubuntu 18.04" docker_tag="nightly-5.8-bionic" platform_dir="ubuntu1804" branch_dir="swift-5.8-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2004_5_8_builds.first build_2=ubuntu2004_aarch64_5_8_builds.first name="Ubuntu 20.04" docker_tag="nightly-5.8-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="swift-5.8-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2204_5_8_builds.first build_2=ubuntu2204_aarch64_5_8_builds.first name="Ubuntu 22.04" docker_tag="nightly-5.8-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="swift-5.8-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=centos7_5_8_builds.first name="CentOS 7" docker_tag="nightly-5.8-centos7" platform_dir="centos7" branch_dir="swift-5.8-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=amazonlinux2_5_8_builds.first build_2=amazonlinux2_aarch64_5_8_builds.first name="Amazon Linux 2" docker_tag="nightly-5.8-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="swift-5.8-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubi9_5_8_builds.first build_2=ubi9_aarch64_5_8_builds.first name="Red Hat Universal Base Image 9" docker_tag="Coming Soon" platform_dir="ubi9" platform_dir_2="ubi9-aarch64" branch_dir="swift-5.8-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="windows" build=windows10_5_8_builds.first name="Windows 10" platform_dir="windows10" branch_dir="swift-5.8-branch" arch="x86_64" %}
    </tbody>
</table>

<sup>1</sup> Swift Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-5_8-snapshots.md %}
</details>

{% include getting-started/_installing.md %}

Swift is covered by the Swift License at [swift.org/LICENSE.txt](/LICENSE.txt).

