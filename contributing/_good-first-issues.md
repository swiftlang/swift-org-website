## Good First Issues

Good first issues are bugs, ideas, and tasks that are intended to be accessible
for contributors that are new to working on the Swift project, and even new to
the patterns and concepts behind subprojects such as the Swift compiler.
Good first issues are decorated with a corresponding label and are most easily
found by visiting `github.com/apple/<repository>/contribute`, e.g.
[github.com/apple/swiftlang/contribute](https://github.com/swiftlang/swift/contribute)
for the main Swift repository.
They are expected to be low-priority and of modest scope, and not require
excessive refactoring, research, or debugging — rather, they should encourage
newcomers to dip their toes in some part of Swift, learn more about it, and
make a real contribution.

Anyone with [commit access](#code-merger) and insight into a particular area
is welcome and encouraged to pin down or think up good first issues.

{% comment %}
    // TODO: This is content I'd like to migrate into Jira behind a "starter" label of some sort. For now:

* Swift Intermediate Language (SIL) round-tripping: make sure that the SIL parser can parse what the SIL printer prints. This is a great project for getting a feel for SIL and how it's used, and making it round-trippable has huge benefits for anyone working on the Swift compiler.
* Warning control: [Clang](http://clang.llvm.org) has a great scheme for placing warnings into specific warning groups, allowing one to control (from the command line) which warnings are emitted by the compiler or are treated as errors. Swift needs that!
{% endcomment %}
