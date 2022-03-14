## Xcode Playground Support

Swift developers can approach the language in many different ways. In
addition to the traditional command-line compiler and interactive REPL
one of the earliest experiences for many developers was through the
introduction of playgrounds in Xcode. Prior to Swift 3.0 and Xcode 8
this was only possible with the version of Swift included with Xcode.
The Xcode Playground Support project enables building a Swift toolchain
that includes everything necessary to integrate with the Xcode 8
playground experience. Playground Support will be included in
corresponding snapshots. Download a snapshot, install it, and select the
toolchain to work with the latest Swift features in Xcode playgrounds.

The project builds two frameworks:

* **PlaygroundSupport.** This framework defines API that may be
explicitly referred to by playground code to communicate with Xcode. For
example: this is typical for playgrounds that identify a particular
view to display live for animation or interaction, and when playgrounds
automatically move between pages when defined criteria are met.

* **PlaygroundLogger.** This project is used implicitly to record values
of interest on a line-by-line basis and communicate them to Xcode. Calls
are automatically injected into playground code so no explicit reference
is required.
