---
redirect_from: "/monthly-non-darwin-release/"
layout: page
title: Monthly Non-Darwin Swift Releases
---

The release manager will announce the merge window for each monthly release. This merge window will remain open for about three weeks, after which it will close. Immediately following the merge window close, release managers have one week to finalize the release which will then be published on swift.org. All the relevant dates will be communicated upfront in the announcement on Swift Forums.

Once the merge window is open, everybody can open a pull request against the release branch announced in the forum post. To keep the process smooth and lightweight, the release manager will only consider pull requests that

* are bug fixes,
* have already been merged to `main`,
* pass all the unit tests on release branch, and
* contain at least one unit test exercising the changed code.

We expect most bug fixes to be small corrections, so creating the pull request might be a matter of creating a branch followed by `git cherry-pick -x FIX-COMMIT-FROM-MAIN-SHA`. We do realize not all backports will be a conflict-free cherry picks but we hope the community works together to deliver the most pressing bug fixes in a timely manner. The changes for the dot release must be only focus on non-darwin platforms only.


## Pull Requests for Release Branch

In order for a pull request to be considered for inclusion in the release branch after it has been cut, the pull request must have:


* A title starting with a designation containing the release version number of the target branch.
* [This](https://github.com/swiftlang/.github/blob/main/PULL_REQUEST_TEMPLATE/release.md?plain=1) form filled out in its description. An item that is not applicable may be left blank or completed with an indication thereof, but must not be omitted altogether.

To switch to this template when drafting a pull request in a [swiftlang](https://github.com/swiftlang) repository in a browser, append the `template=release.md` query parameter to the current URL and refresh. For example:

```
-https://github.com/swiftlang/swift/compare/main...my-branch?quick_pull=1
+https://github.com/swiftlang/swift/compare/main...my-branch?quick_pull=1&template=release.md
```

**All changes** going on the release branch **must go through pull requests** that are accepted by the corresponding release manager.

If you think there's an important bug fix that should go into the next dot release, but you don’t have the ability to fix it in time, please use the Swift Forums to rally for help. The Swift community includes a bunch of folks ready to assist, and sometimes raising attention on a bug is all that’s needed to get it fixed. As always, please remember that most of the community is not working on Swift full time, so be kind.

Similarly, if you have opened a pull request, you might want to assign the release manager on the Github pull request so they can have a look straight away. The release managers will merge patches throughout the whole merge window. Once the merge window closes however, no further pull requests will be considered until the next merge window opens.
