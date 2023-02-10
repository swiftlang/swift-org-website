## Good First Sssues

Good first issues are bugs, ideas, and tasks that are intended to be accessible
for developers new to working on the Swift project, or even new to the concepts
behind a particular subproject, such as the Swift compiler.
Good first issues are decorated with a correponding label and can be found by
visiting `github.com/apple/<repository>/contribute`. They are expected to be
mostly self-contained within a single subsystem, not require excessive
refactoring or deep debugging. Rather, they should encourage new developers to
dip their toes in some part of Swift, learn more about it, and make a real
contribution.

{% comment %}
    // TODO: This is content I'd like to migrate into Jira behind a "starter" label of some sort. For now:

* Swift Intermediate Language (SIL) round-tripping: make sure that the SIL parser can parse what the SIL printer prints. This is a great project for getting a feel for SIL and how it's used, and making it round-trippable has huge benefits for anyone working on the Swift compiler.
* Warning control: [Clang](http://clang.llvm.org) has a great scheme for placing warnings into specific warning groups, allowing one to control (from the command line) which warnings are emitted by the compiler or are treated as errors. Swift needs that!
{% endcomment %}
