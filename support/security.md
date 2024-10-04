---
layout: new-layouts/base
title: Swift.org security
---

## Security Process

For the protection of our community, Swift.org doesn't disclose, discuss, or confirm security issues until our investigation is complete and any necessary updates are generally available.

Recent security updates are listed in the [Security Updates](#security-updates) section below.

Swift.org security documents reference vulnerabilities by [CVE-ID](https://www.cve.org/About/Overview) when possible.

### Reporting a security or privacy vulnerability

If you believe you have discovered a security or privacy vulnerability in a Swift.org project, please report it to us.
We welcome reports from everyone, including security researchers, developers, and users.

To report a security or privacy vulnerability, please send an email to [cve@forums.swift.org](mailto:cve@forums.swift.org) that includes:

* The specific project and software version(s) which you believe are affected.
* A description of the behavior you observed as well as the behavior that you expected.
* A numbered list of steps required to reproduce the issue and/or a video demonstration, if the steps may be hard to follow.

Please use [Swift.org's CVE PGP key](/keys/cve-signing-key-1.asc) to encrypt sensitive information that you send by email.

You'll receive an email reply from Swift.org to acknowledge that we received your report, and we’ll contact you if we need more information.

### How Swift.org handles these reports

For the protection of our community, Swift.org doesn't disclose, discuss, or confirm security issues until our investigation is complete and any necessary updates are generally available.

Swift.org uses security advisories and our security-announce mailing list to publish information about security fixes in our projects and to publicly credit people or organizations that have reported security issues to us.

## Security Updates

{% assign cve_list = site.data.security.cve | sort: "date" %}

<ul>
  {% for cve in cve_list %}
  <li>
    <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name={{ cve.id }}">{{ cve.id }}</a>
    <p>
    {{ cve.description }}
    </p>
  </li>
  {% endfor %}
</ul>
