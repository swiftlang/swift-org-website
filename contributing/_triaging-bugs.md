## Triaging Bugs

Reporting bugs is an important part of improving software.
Nearly as important is triaging those bugs
to ensure that they are reproducible, small, and unique.

There are a number of things you can do to help triage bugs
in the [bug tracker][bugtracker].

- **Reproduce bugs**.
  For a bug to be actionable,
  it needs to be reproducible.
  If you can't reproduce the bug,
  try to figure out why.
  Get in touch with the submitter if you need more information.

- **Reduce bugs**.
  Once a bug can be reproduced,
  reduce it to the smallest amount of code possible.
  Reasoning about a sample that reproduces a bug in just a few lines of Swift code
  is easier than reasoning about a longer sample.

- **Eliminate duplicate bugs**.
  If two bug reports refer to the same underlying problem,
  mark the newer one as a duplicate of the older one.
  Doing so allows others to work more effectively.

[bugtracker]: https://github.com/apple/swift/issues
