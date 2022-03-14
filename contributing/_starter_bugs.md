## Starter Bugs

"Starter" bugs are bugs and features that are intended to be accessible for developers new to working on Swift, or even new to compiler development. Starter bugs should be mostly self-contained within a single subsystem, not require excessive refactoring or deep debugging. Rather, they should encourage new developers to dip their toes in some part of Swift, learn more about it, and make a real contribution.

The current list of starter bugs is [maintained in the bug tracker][starter-bugs].

{% comment %}
    // TODO: This is content I'd like to migrate into Jira behind a "starter" label of some sort. For now:

* Swift Intermediate Language (SIL) round-tripping: make sure that the SIL parser can parse what the SIL printer prints. This is a great project for getting a feel for SIL and how it's used, and making it round-trippable has huge benefits for anyone working on the Swift compiler.
* Warning control: [Clang](http://clang.llvm.org) has a great scheme for placing warnings into specific warning groups, allowing one to control (from the command line) which warnings are emitted by the compiler or are treated as errors. Swift needs that!
{% endcomment %}

[starter-bugs]: /FIXME
