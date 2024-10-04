---
layout: new-layouts/base
title: SSWG - Security requirements for packages on the index
---

## SSWG security requirements for packages on the index

This information is intended for package authors who have packages incubated by the SSWG and listed on the package index or are looking into pitching/proposing their package to be listed. If instead you found (or have heard of) a security vulnerability you’d like to report, please have a look over [here](/sswg/security/contributor-found-vulnerability.html).

---

Packages that are incubated by the SSWG and are listed on the [SSWG's package index](server/#projects) are required to follow the following guidelines around security.

Where security vulnerabilities are involved, it is key to ensure that somebody who discovers a vulnerability in your package can quickly find information on how to report it. As the package author, you know best where to put important information about your software. Bear in mind that many of your users will see your repository's readme file (usually `README.md`) first. So make sure to link to your security policy from there.

A file named `SECURITY.md` in the root of your repository is the recommended place to put your full security policy. It is also worth noting that some vendors (like GitHub) automatically discover and promote `SECURITY.md` which make the relevant information even easier to find for your users.

Project authors are also encouraged to make use of their source control system security features (for example: [GitHub's "Security Advisories"](https://docs.github.com/en/github/managing-security-vulnerabilities/about-github-security-advisories) and [GitLab's "Confidential Issues"](https://docs.gitlab.com/ee/user/project/issues/confidential_issues.html)) to manage the vulnerabilities and inform their users.

#### The key requirements are:

- In your security policy (usually `SECURITY.md`), describe as easily and precisely as possible how the security process of your package works. This includes where and how to report as well as expected timelines for a fix.
- Make sure your security policy is easy to find. For example by naming it `SECURITY.md` and linking to it from your main readme file.
- List a clear point of contact (e.g. an email address) for security vulnerability reports in your security policy.
- The point of contact for security vulnerabilities should be private. That means it is only accessible to you and your maintainers, and in particular that it is _not_ publicly accessible on the internet. It is also good practice to describe exactly who can access the information alongside the point of contact.
- The goal is to make it as easy as possible for a user to report a security vulnerability to you. Try to remove all ambiguity and difficulty from reporting vulnerabilities. In many cases you will rely on somebody's spare time to report vulnerabilities.
