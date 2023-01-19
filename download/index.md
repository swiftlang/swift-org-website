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


{% assign xcode_5_7_builds = site.data.builds.swift-5_7-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu1804_5_7_builds = site.data.builds.swift-5_7-branch.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_7_builds = site.data.builds.swift-5_7-branch.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_7_builds = site.data.builds.swift-5_7-branch.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_7_builds = site.data.builds.swift-5_7-branch.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_7_builds = site.data.builds.swift-5_7-branch.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_7_builds = site.data.builds.swift-5_7-branch.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_7_builds = site.data.builds.swift-5_7-branch.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_7_builds = site.data.builds.swift-5_7-branch.centos7 | sort: 'date' | reverse %}
{% assign windows10_5_7_builds = site.data.builds.swift-5_7-branch.windows10 | sort: 'date' | reverse %}

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
{% assign windows10_5_8_builds = site.data.builds.swift-5_8-branch.windows10 | sort: 'date' | reverse %}


{% assign xcode_2_2_builds = site.data.builds.swift-2_2-branch.xcode | sort: 'date' | reverse %}
{% assign ubuntu1510_2_2_builds = site.data.builds.swift-2_2-branch.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_2_2_builds = site.data.builds.swift-2_2-branch.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_2_2_release = site.data.builds.swift-2_2-release.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_2_2_release = site.data.builds.swift-2_2-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1510_2_2_1_release = site.data.builds.swift-2_2_1-release.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_2_2_1_release = site.data.builds.swift-2_2_1-release.ubuntu1404 | sort: 'date' | reverse %}
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
{% assign ubuntu1510_3_0_release = site.data.builds.swift-3_0-release.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_release = site.data.builds.swift-3_0-release.ubuntu1404 | sort: 'date' | reverse %}
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
{% assign ubuntu1604_3_0_1_release = site.data.builds.swift-3_0_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1510_3_0_1_release = site.data.builds.swift-3_0_1-release.ubuntu1510 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_1_release = site.data.builds.swift-3_0_1-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_0_2_p1_builds = site.data.builds.swift-3_0_2-preview-1.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_0_2_release = site.data.builds.swift-3_0_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_0_2_release = site.data.builds.swift-3_0_2-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_1_release = site.data.builds.swift-3_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_3_1_release = site.data.builds.swift-3_1-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_1_release = site.data.builds.swift-3_1-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_3_1_1_release = site.data.builds.swift-3_1_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_3_1_1_release = site.data.builds.swift-3_1_1-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_3_1_1_release = site.data.builds.swift-3_1_1-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_0_release = site.data.builds.swift-4_0-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_0_release = site.data.builds.swift-4_0-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_0_release = site.data.builds.swift-4_0-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_0_2_release = site.data.builds.swift-4_0_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_0_2_release = site.data.builds.swift-4_0_2-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_0_2_release = site.data.builds.swift-4_0_2-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_0_3_release = site.data.builds.swift-4_0_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_0_3_release = site.data.builds.swift-4_0_3-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_0_3_release = site.data.builds.swift-4_0_3-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_1_release = site.data.builds.swift-4_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_1_release = site.data.builds.swift-4_1-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_1_release = site.data.builds.swift-4_1-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_1_1_release = site.data.builds.swift-4_1_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_1_1_release = site.data.builds.swift-4_1_1-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_1_1_release = site.data.builds.swift-4_1_1-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_1_2_release = site.data.builds.swift-4_1_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_1_2_release = site.data.builds.swift-4_1_2-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_1_2_release = site.data.builds.swift-4_1_2-release.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_1_3_release = site.data.builds.swift-4_1_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_1_3_release = site.data.builds.swift-4_1_3-release.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_1_3_release = site.data.builds.swift-4_1_3-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign xcode_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.xcode | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1404 | sort: 'date' | reverse %}
{% assign ubuntu1604_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1610_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1610 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_convergence_builds = site.data.builds.swift-4_2-convergence.ubuntu1804 | sort: 'date' | reverse %}

{% assign ubuntu1604_4_2_release = site.data.builds.swift-4_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_release = site.data.builds.swift-4_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_release = site.data.builds.swift-4_2-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_4_2_1_release = site.data.builds.swift-4_2_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_1_release = site.data.builds.swift-4_2_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_1_release = site.data.builds.swift-4_2_1-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_4_2_2_release = site.data.builds.swift-4_2_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_2_release = site.data.builds.swift-4_2_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_2_release = site.data.builds.swift-4_2_2-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_4_2_3_release = site.data.builds.swift-4_2_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_3_release = site.data.builds.swift-4_2_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_3_release = site.data.builds.swift-4_2_3-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_0_release = site.data.builds.swift-5_0-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_0_release = site.data.builds.swift-5_0-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_0_release = site.data.builds.swift-5_0-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_4_2_4_release = site.data.builds.swift-4_2_4-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_4_2_4_release = site.data.builds.swift-4_2_4-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_4_2_4_release = site.data.builds.swift-4_2_4-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_0_1_release = site.data.builds.swift-5_0_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_0_1_release = site.data.builds.swift-5_0_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_0_1_release = site.data.builds.swift-5_0_1-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_0_2_release = site.data.builds.swift-5_0_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_0_2_release = site.data.builds.swift-5_0_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_0_2_release = site.data.builds.swift-5_0_2-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_0_3_release = site.data.builds.swift-5_0_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_0_3_release = site.data.builds.swift-5_0_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_0_3_release = site.data.builds.swift-5_0_3-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_1_release = site.data.builds.swift-5_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_1_release = site.data.builds.swift-5_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_1_release = site.data.builds.swift-5_1-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_1_1_release = site.data.builds.swift-5_1_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_1_1_release = site.data.builds.swift-5_1_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_1_1_release = site.data.builds.swift-5_1_1-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_1_2_release = site.data.builds.swift-5_1_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_1_2_release = site.data.builds.swift-5_1_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_1_2_release = site.data.builds.swift-5_1_2-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_1_3_release = site.data.builds.swift-5_1_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_1_3_release = site.data.builds.swift-5_1_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_1_3_release = site.data.builds.swift-5_1_3-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_1_4_release = site.data.builds.swift-5_1_4-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_1_4_release = site.data.builds.swift-5_1_4-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_1_4_release = site.data.builds.swift-5_1_4-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_1_5_release = site.data.builds.swift-5_1_5-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_1_5_release = site.data.builds.swift-5_1_5-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu1404_5_1_5_release = site.data.builds.swift-5_1_5-release.ubuntu1404 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_2_release = site.data.builds.swift-5_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_2_release = site.data.builds.swift-5_2-release.ubuntu1804 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_2_1_release = site.data.builds.swift-5_2_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_2_1_release = site.data.builds.swift-5_2_1-release.ubuntu1804 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_2_2_release = site.data.builds.swift-5_2_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_2_2_release = site.data.builds.swift-5_2_2-release.ubuntu1804 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_2_3_release = site.data.builds.swift-5_2_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_2_3_release = site.data.builds.swift-5_2_3-release.ubuntu1804 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_2_4_release = site.data.builds.swift-5_2_4-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_2_4_release = site.data.builds.swift-5_2_4-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_2_4_release = site.data.builds.swift-5_2_4-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos8_5_2_4_release = site.data.builds.swift-5_2_4-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_2_4_release = site.data.builds.swift-5_2_4-release.amazonlinux2 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_2_5_release = site.data.builds.swift-5_2_5-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_2_5_release = site.data.builds.swift-5_2_5-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_2_5_release = site.data.builds.swift-5_2_5-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_2_5_release = site.data.builds.swift-5_2_5-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_2_5_release = site.data.builds.swift-5_2_5-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_2_5_release = site.data.builds.swift-5_2_5-release.amazonlinux2 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_3_release = site.data.builds.swift-5_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_3_release = site.data.builds.swift-5_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_3_release = site.data.builds.swift-5_3-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_3_release = site.data.builds.swift-5_3-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_3_release = site.data.builds.swift-5_3-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_3_release = site.data.builds.swift-5_3-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_3_release = site.data.builds.swift-5_3-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_3_1_release = site.data.builds.swift-5_3_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_3_1_release = site.data.builds.swift-5_3_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_3_1_release = site.data.builds.swift-5_3_1-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_3_1_release = site.data.builds.swift-5_3_1-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_3_1_release = site.data.builds.swift-5_3_1-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_3_1_release = site.data.builds.swift-5_3_1-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_3_1_release = site.data.builds.swift-5_3_1-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_3_2_release = site.data.builds.swift-5_3_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_3_2_release = site.data.builds.swift-5_3_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_3_2_release = site.data.builds.swift-5_3_2-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_3_2_release = site.data.builds.swift-5_3_2-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_3_2_release = site.data.builds.swift-5_3_2-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_3_2_release = site.data.builds.swift-5_3_2-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_3_2_release = site.data.builds.swift-5_3_2-release.windows10 | sort: 'date' | reverse %}


{% assign ubuntu1604_5_3_3_release = site.data.builds.swift-5_3_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_3_3_release = site.data.builds.swift-5_3_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_3_3_release = site.data.builds.swift-5_3_3-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_3_3_release = site.data.builds.swift-5_3_3-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_3_3_release = site.data.builds.swift-5_3_3-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_3_3_release = site.data.builds.swift-5_3_3-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_3_3_release = site.data.builds.swift-5_3_3-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_4_release = site.data.builds.swift-5_4-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_4_release = site.data.builds.swift-5_4-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_4_release = site.data.builds.swift-5_4-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_4_release = site.data.builds.swift-5_4-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_4_release = site.data.builds.swift-5_4-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_4_release = site.data.builds.swift-5_4-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_4_release = site.data.builds.swift-5_4-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_4_1_release = site.data.builds.swift-5_4_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_4_1_release = site.data.builds.swift-5_4_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_4_1_release = site.data.builds.swift-5_4_1-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_4_1_release = site.data.builds.swift-5_4_1-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_4_1_release = site.data.builds.swift-5_4_1-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_4_1_release = site.data.builds.swift-5_4_1-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_4_1_release = site.data.builds.swift-5_4_1-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_4_2_release = site.data.builds.swift-5_4_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_4_2_release = site.data.builds.swift-5_4_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_4_2_release = site.data.builds.swift-5_4_2-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_4_2_release = site.data.builds.swift-5_4_2-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_4_2_release = site.data.builds.swift-5_4_2-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_4_2_release = site.data.builds.swift-5_4_2-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_4_2_release = site.data.builds.swift-5_4_2-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_4_3_release = site.data.builds.swift-5_4_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_4_3_release = site.data.builds.swift-5_4_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_4_3_release = site.data.builds.swift-5_4_3-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_4_3_release = site.data.builds.swift-5_4_3-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_4_3_release = site.data.builds.swift-5_4_3-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_4_3_release = site.data.builds.swift-5_4_3-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_4_3_release = site.data.builds.swift-5_4_3-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_5_release = site.data.builds.swift-5_5-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_5_release = site.data.builds.swift-5_5-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_5_release = site.data.builds.swift-5_5-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_5_release = site.data.builds.swift-5_5-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_5_release = site.data.builds.swift-5_5-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_5_release = site.data.builds.swift-5_5-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_5_release = site.data.builds.swift-5_5-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_5_1_release = site.data.builds.swift-5_5_1-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_5_1_release = site.data.builds.swift-5_5_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_5_1_release = site.data.builds.swift-5_5_1-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_5_1_release = site.data.builds.swift-5_5_1-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_5_1_release = site.data.builds.swift-5_5_1-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_5_1_release = site.data.builds.swift-5_5_1-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_5_1_release = site.data.builds.swift-5_5_1-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_5_2_release = site.data.builds.swift-5_5_2-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_5_2_release = site.data.builds.swift-5_5_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_5_2_release = site.data.builds.swift-5_5_2-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_5_2_release = site.data.builds.swift-5_5_2-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_5_2_release = site.data.builds.swift-5_5_2-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_5_2_release = site.data.builds.swift-5_5_2-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_5_2_release = site.data.builds.swift-5_5_2-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1604_5_5_3_release = site.data.builds.swift-5_5_3-release.ubuntu1604 | sort: 'date' | reverse %}
{% assign ubuntu1804_5_5_3_release = site.data.builds.swift-5_5_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_5_3_release = site.data.builds.swift-5_5_3-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign centos7_5_5_3_release = site.data.builds.swift-5_5_3-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_5_3_release = site.data.builds.swift-5_5_3-release.centos8 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_5_3_release = site.data.builds.swift-5_5_3-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign windows10_5_5_3_release = site.data.builds.swift-5_5_3-release.windows10 | sort: 'date' | reverse %}


{% assign ubuntu1804_5_6_release = site.data.builds.swift-5_6-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_6_release = site.data.builds.swift-5_6-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_6_release = site.data.builds.swift-5_6-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_6_release = site.data.builds.swift-5_6-release.centos7 | sort: 'date' | reverse %}
{% assign centos8_5_6_release = site.data.builds.swift-5_6-release.centos8 | sort: 'date' | reverse %}
{% assign centos8_aarch64_5_6_release = site.data.builds.swift-5_6-release.centos8-aarch64 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_6_release = site.data.builds.swift-5_6-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_6_release = site.data.builds.swift-5_6-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_6_release = site.data.builds.swift-5_6-release.windows10 | sort: 'date' | reverse %}


{% assign ubuntu1804_5_6_1_release = site.data.builds.swift-5_6_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_6_1_release = site.data.builds.swift-5_6_1-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_6_1_release = site.data.builds.swift-5_6_1-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_6_1_release = site.data.builds.swift-5_6_1-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_6_1_release = site.data.builds.swift-5_6_1-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_6_1_release = site.data.builds.swift-5_6_1-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_6_1_release = site.data.builds.swift-5_6_1-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1804_5_6_2_release = site.data.builds.swift-5_6_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_6_2_release = site.data.builds.swift-5_6_2-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_6_2_release = site.data.builds.swift-5_6_2-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_6_2_release = site.data.builds.swift-5_6_2-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_6_2_release = site.data.builds.swift-5_6_2-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_6_2_release = site.data.builds.swift-5_6_2-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_6_2_release = site.data.builds.swift-5_6_2-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1804_5_6_3_release = site.data.builds.swift-5_6_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_6_3_release = site.data.builds.swift-5_6_3-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_6_3_release = site.data.builds.swift-5_6_3-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_6_3_release = site.data.builds.swift-5_6_3-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_6_3_release = site.data.builds.swift-5_6_3-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_6_3_release = site.data.builds.swift-5_6_3-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_6_3_release = site.data.builds.swift-5_6_3-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1804_5_7_release = site.data.builds.swift-5_7-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_7_release = site.data.builds.swift-5_7-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_7_release = site.data.builds.swift-5_7-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_7_release = site.data.builds.swift-5_7-release.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_7_release = site.data.builds.swift-5_7-release.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_7_release = site.data.builds.swift-5_7-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_7_release = site.data.builds.swift-5_7-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_7_release = site.data.builds.swift-5_7-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_7_release = site.data.builds.swift-5_7-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1804_5_7_1_release = site.data.builds.swift-5_7_1-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_7_1_release = site.data.builds.swift-5_7_1-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_7_1_release = site.data.builds.swift-5_7_1-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_7_1_release = site.data.builds.swift-5_7_1-release.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_7_1_release = site.data.builds.swift-5_7_1-release.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_7_1_release = site.data.builds.swift-5_7_1-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_7_1_release = site.data.builds.swift-5_7_1-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_7_1_release = site.data.builds.swift-5_7_1-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_7_1_release = site.data.builds.swift-5_7_1-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1804_5_7_2_release = site.data.builds.swift-5_7_2-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_7_2_release = site.data.builds.swift-5_7_2-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_7_2_release = site.data.builds.swift-5_7_2-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_7_2_release = site.data.builds.swift-5_7_2-release.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_7_2_release = site.data.builds.swift-5_7_2-release.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_7_2_release = site.data.builds.swift-5_7_2-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_7_2_release = site.data.builds.swift-5_7_2-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_7_2_release = site.data.builds.swift-5_7_2-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_7_2_release = site.data.builds.swift-5_7_2-release.windows10 | sort: 'date' | reverse %}

{% assign ubuntu1804_5_7_3_release = site.data.builds.swift-5_7_3-release.ubuntu1804 | sort: 'date' | reverse %}
{% assign ubuntu2004_5_7_3_release = site.data.builds.swift-5_7_3-release.ubuntu2004 | sort: 'date' | reverse %}
{% assign ubuntu2004_aarch64_5_7_3_release = site.data.builds.swift-5_7_3-release.ubuntu2004-aarch64 | sort: 'date' | reverse %}
{% assign ubuntu2204_5_7_3_release = site.data.builds.swift-5_7_3-release.ubuntu2204 | sort: 'date' | reverse %}
{% assign ubuntu2204_aarch64_5_7_3_release = site.data.builds.swift-5_7_3-release.ubuntu2204-aarch64 | sort: 'date' | reverse %}
{% assign centos7_5_7_3_release = site.data.builds.swift-5_7_3-release.centos7 | sort: 'date' | reverse %}
{% assign amazonlinux2_5_7_3_release = site.data.builds.swift-5_7_3-release.amazonlinux2 | sort: 'date' | reverse %}
{% assign amazonlinux2_aarch64_5_7_3_release = site.data.builds.swift-5_7_3-release.amazonlinux2-aarch64 | sort: 'date' | reverse %}
{% assign windows10_5_7_3_release = site.data.builds.swift-5_7_3-release.windows10 | sort: 'date' | reverse %}


## Releases

### Swift 5.7.3

Date: January 18, 2023<br>
Tag: [swift-5.7.3-RELEASE](https://github.com/apple/swift/releases/tag/swift-5.7.3-RELEASE)

<table id="latest-builds" class="downloads">
    <thead>
        <tr>
            <th class="download">Platform</th>
            <th class="arch-tag">Architecture</th>
            <th class="docker-tag">Docker Tag</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="download">
                <span class="release">
                    <a href="https://itunes.apple.com/app/xcode/id497799835" title="Download" download>Xcode 14.2</a><sup> 1</sup>
                </span>
            </td>
            <td class="toolchain">
                <span class="download">
                    <a href="https://download.swift.org/swift-5.7.3-release/xcode/swift-5.7.3-RELEASE/swift-5.7.3-RELEASE-osx.pkg" title="Download" download>Universal</a>
                    <a href="https://download.swift.org/swift-5.7.3-release/xcode/swift-5.7.3-RELEASE/swift-5.7.3-RELEASE-osx-symbols.pkg" title="Debugging Symbols" class="signature">Debugging Symbols</a>
                </span>
            </td>
            <td class="docker-tag">Unavailable</td>
        </tr>
        {% include_relative _release_build_arch.html platform="Linux" build=ubuntu1804_5_7_3_release.first platform_dir="ubuntu1804" name="Ubuntu 18.04" branch_dir="swift-5.7.3-release" arch="x86_64"%}
		{% include_relative _release_build_arch.html platform="Linux" build=ubuntu2004_5_7_3_release.first platform_dir="ubuntu2004" name="Ubuntu 20.04" branch_dir="swift-5.7.3-release" arch="x86_64"
        arch_2="aarch64" platform_dir_2="ubuntu2004-aarch64" build_2=ubuntu2004_aarch64_5_7_3_release.first%}
        {% include_relative _release_build_arch.html platform="Linux" build=ubuntu2204_5_7_3_release.first platform_dir="ubuntu2204" name="Ubuntu 22.04" branch_dir="swift-5.7.3-release" arch="x86_64"
        arch_2="aarch64" platform_dir_2="ubuntu2204-aarch64" build_2=ubuntu2204_aarch64_5_7_3_release.first%}
        {% include_relative _release_build_arch.html platform="Linux" build=centos7_5_7_3_release.first platform_dir="centos7" name="CentOS 7" branch_dir="swift-5.7.3-release" arch="x86_64" %}
        {% include_relative _release_build_arch.html platform="Linux" build=amazonlinux2_5_7_3_release.first platform_dir="amazonlinux2" name="Amazon Linux 2" branch_dir="swift-5.7.3-release" arch="x86_64"
        arch_2="aarch64" platform_dir_2="amazonlinux2-aarch64" build_2=amazonlinux2_aarch64_5_7_3_release.first%}
        {% include_relative _release_build_arch.html platform="Windows" build=windows10_5_7_3_release.first platform_dir="windows10" name="Windows 10" branch_dir="swift-5.7.3-release" arch="x86_64" %}
    </tbody>
</table>

### RPM
<div class="warning" markdown="1">
Swift 5.7.2 RPMs for Amazon Linux 2 and CentOS 7 for **experimental use only**. Please provide your [feedback](https://github.com/apple/swift/issues).
</div>


Use the instructions below for RPM installation:

**Amazon Linux 2**

```bash
$ curl https://download.swift.org/experimental-use-only/repo/amazonlinux/releases/2/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo
$ amazon-linux-extras install epel
$ yum install swiftlang
```

**CentOS 7**

```bash
$ curl https://download.swift.org/experimental-use-only/repo/centos/releases/7/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo
$ yum install epel-release
$ yum install swiftlang
```


<sup>1</sup> Swift 5.7.3 contains Linux and Windows changes only, Swift 5.7.2 is available as part of Xcode 14.2.<br>
<sup>2</sup> Swift 5.7.3 Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>


{% include_relative _older-releases.md %}


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
        {% include_relative _build-arch.html platform="Linux" build=ubi9_development_builds.first name="Universal Base Image 9" docker_tag="Coming Soon" platform_dir="ubi9" branch_dir="development" arch="x86_64" %}
        {% include_relative _build-arch.html platform="windows" build=windows10_development_builds.first name="Windows 10" platform_dir="windows10" branch_dir="development" arch="x86_64" %}
    </tbody>
</table>

<sup>1</sup> Swift Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-development-snapshots.md %}
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
        {% include_relative _build-arch.html platform="Linux" build=ubi9_5_8_builds.first name="Universal Base Image 9" docker_tag="Coming Soon" platform_dir="ubi9" branch_dir="swift-5.8-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="windows" build=windows10_5_8_builds.first name="Windows 10" platform_dir="windows10" branch_dir="swift-5.8-branch" arch="x86_64" %}
    </tbody>
</table>

<sup>1</sup> Swift Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-5_8-snapshots.md %}
</details>


### Swift 5.7 Development

Swift 5.7 Snapshots are prebuilt binaries
that are automatically created from `release/5.7` branch.
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
        {% include_relative _build-arch.html platform="Apple Platforms" build=xcode_5_7_builds.first name="Xcode" platform_dir="xcode" branch_dir="swift-5.7-branch" arch="Universal" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu1804_5_7_builds.first name="Ubuntu 18.04" docker_tag="nightly-5.7-bionic" platform_dir="ubuntu1804" branch_dir="swift-5.7-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2004_5_7_builds.first build_2=ubuntu2004_aarch64_5_7_builds.first name="Ubuntu 20.04" docker_tag="nightly-5.7-focal" platform_dir="ubuntu2004" platform_dir_2="ubuntu2004-aarch64" branch_dir="swift-5.7-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=ubuntu2204_5_7_builds.first build_2=ubuntu2204_aarch64_5_7_builds.first name="Ubuntu 22.04" docker_tag="nightly-5.7-jammy" platform_dir="ubuntu2204" platform_dir_2="ubuntu2204-aarch64" branch_dir="swift-5.7-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="Linux" build=centos7_5_7_builds.first name="CentOS 7" docker_tag="nightly-5.7-centos7" platform_dir="centos7" branch_dir="swift-5.7-branch" arch="x86_64" %}
        {% include_relative _build-arch.html platform="Linux" build=amazonlinux2_5_7_builds.first build_2=amazonlinux2_aarch64_5_7_builds.first name="Amazon Linux 2" docker_tag="nightly-5.7-amazonlinux2" platform_dir="amazonlinux2" platform_dir_2="amazonlinux2-aarch64" branch_dir="swift-5.7-branch" arch="x86_64" arch_2="aarch64" %}
        {% include_relative _build-arch.html platform="windows" build=windows10_5_7_builds.first name="Windows 10" platform_dir="windows10" branch_dir="swift-5.7-branch" arch="x86_64" %}
    </tbody>
</table>

<sup>1</sup> Swift Windows 10 toolchain is provided by [Saleem Abdulrasool](https://github.com/compnerd). Saleem is the platform champion for the Windows port of Swift and this is an official build from the Swift project. <br><br>

<details class="download">
  <summary>Older Snapshots</summary>
  {% include_relative _older-5_7-snapshots.md %}
</details>


Swift is covered by the Swift License at [swift.org/LICENSE.txt](/LICENSE.txt).

## Using Downloads

{% include_relative _apple-platforms.md %}
{% include_relative _linux.md %}
{% include_relative _windows.md %}
{% include_relative _docker.md %}
