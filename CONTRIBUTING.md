
## Overview and Governance

See [website overview](http://swift.org/website) for more information about the Swift.org website goals, content governance and contribution guidelines.

See `LICENSE.md` for legal information.


## Community Participation

Everyone is welcome to contribute to the Swift.org website in the following ways:

* Submitting pull requests to improve and correct existing content or technical infrastructure.
* Proposing broad enhancements or large scale changes to the website. Such proposals require consultation with the [website workgroup](/website-workgroup) and can be proposed as a public forum post on [Swift.org website forum](https://forums.swift.org/c/swift-website/) or privately by contacting [@swift-website-workgroup](https://forums.swift.org/new-message?groupname=swift-website-workgroup) on the Swift Forums. Example for such broad changes include:
    * Proposing new topics and content domains, or broad changes to existing ones.
    * Proposing broad changes to how content is organized in the website (information design).
    * Proposing broad changes to how the website looks (UX/UI design).
    * Proposing broad changes to the technical infrastructure that powers the website.
* Participating in design discussions
* Asking or answering questions on the forums
* Reporting or triaging bugs


## Making pull requests

See `README.md` for instructions for installing a local developer environment and testing changes.

Please open a pull request at https://github.com/apple/swift-org-website. Make sure the CI passes, and then wait for code review.

After review you may be asked to make changes. When you are ready, use the request re-review feature of github or mention the reviewers by name in a comment.


## Writing a Patch

A good patch is:

1. Concise, and contains as few changes as needed to achieve the end result.
2. Accompanied by a great commit message, using our commit message template.
3. Content or visual changes:
    1. Tested, ensuring the website displays correctly after the changes.
    2. Pull request includes screenshot of the changes to help gui the review.
4. Code changes:
    1. Tested, ensuring that any tests provided failed before the patch and pass after it.
    2. Documented, adding API documentation as needed to cover new functions and properties

### Commit Message Template

Your commit messages must follow the correct template.
The easiest way to do that is to configure Git to using the template in this repository.
To do that, `cd` to the root of the repository and run:

```
git config commit.template dev/git.commit.template
```

The default policy for taking contributions is “Squash and Merge” — because of this, the commit message format rule above applies to the pull request, rather than every commit contained within it.

### Testing changes locally

All changes to the website (technical or content) must be tested before they are merged.

To test changes locally, use the docker setup included with the project. See `README.md` for further instructions.

Pull requests are tested using CI. Such tests are triggered by posting a `@swift-ci test` comment to the PR.


## Submitting bug reports

Please you ensure to specify the following:

* Commit hash
* Contextual information (that is, what you were trying to achieve)
* Simplest possible steps to reproduce
    * The more complex the steps are, the lower the bug's priority will be.
    * A pull request with failing test case is preferred, but it's just fine to paste the test case into the issue description.
* Anything that might be relevant in your opinion, such as:
    * OS version and the output of `uname -a`
    * Network configuration

### Example

```
Commit hash: 22ec043dc9d24bb011b47ece4f9ee97ee5be2757

Context:
While trying to run the website locally using a docker image the website did not come up.

Steps to reproduce:
1. ...
2. ...
3. ...
4. ...


Operating system: Ubuntu Linux 16.04 64-bit

$ uname -a
Linux beefy.machine 4.4.0-101-generic #124-Ubuntu SMP Fri Nov 10 18:29:59 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux

My system has IPv6 disabled.
```
