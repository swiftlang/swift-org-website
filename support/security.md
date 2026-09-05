---
layout: page
title: Swift.org security
---
## Report a security vulnerability

### How to report a security vulnerability

This document outlines security procedures and general policies for the Swift project.

The Swift project prioritizes the security of its open source projects and values the contributions of the security research community.
If you believe that you have discovered a security vulnerability in our open source software, please report it to us using the [GitHub private vulnerability feature](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/privately-reporting-a-security-vulnerability).

This can be done by navigating to the "Security" tab of the specific repository where you found the issue.

Reports should include specific software version(s) that you believe are affected; a technical description of the behavior that you observed and the behavior that you expected; the steps required to reproduce the issue; and a proof of concept or exploit.

### How these reports are handled

Our goal is to confirm all security reports. This is neither an acceptance nor a rejection of the report.
We may follow up with further questions while working through the details of your report.
We may prioritize vulnerability remediation, and resolution times may vary according to several factors, such as complexity, severity, and active maintenance of a project.

For the development of secure product and the protection of our users, the project will not disclose or discuss security issues until the investigation is complete and any necessary updates are generally available, unless required by law.
After updates are made available, reports will be published as GitHub Security Advisories.

Some projects have additional security pages with further details or aggregated findings - consult project specific documentation for details.

### Additional guidelines

Output from automated security scans or fuzzers must include additional context demonstrating the vulnerability with a proof of concept or working exploit.
Please include enough information to allow us to reproduce the issue. We will credit you in the public advisory if the report is accepted.

### Security Updates

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
