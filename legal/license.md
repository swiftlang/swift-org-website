---
layout: new-layouts/base
title: License
---

The [Swift license](/LICENSE.txt) is based on the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.html) with a [Runtime Library Exception](#runtime-library-exception) that removes the attribution requirement when using Swift to build and distribute your own binaries. The Apache 2.0 license was chosen because it allows broad use of Swift, and is already well-understood by many potential contributors.

Copyright is held by the authors of the contributions, or the company or organization to which the individual belongs.  A list of copyright holders is maintained in the [CONTRIBUTORS.txt](/CONTRIBUTORS.txt) file on Swift.org and at the root of the repository.


### Runtime Library Exception

The Runtime Library Exception makes it clear that end users of the Swift compiler don’t have to attribute their use of Swift in their finished binary application, game, or service. End-users of the Swift language should feel unrestricted to create great software. The full text of this exception follows:

~~~~
As an exception, if you use this Software to compile your source code and
portions of this Software are embedded into the binary product as a result,
you may redistribute such product without providing attribution as would
otherwise be required by Sections 4(a), 4(b) and 4(d) of the License.
~~~~

This exception can also be found at the bottom of the [LICENSE.txt](/LICENSE.txt) file.


### Copyright and License in Source Code

All source files hosted on Swift.org must contain a comment block at the top of the file declaring the license and copyright that applies.  This text may be part of a larger header, for instance as defined in the [Contributing Code][contributing_code] section. Regardless of the header format, the wording for the license and copyright portion must be copied as follows, with the appropriate years applied:

~~~~
// This source file is part of the Swift.org open source project
//
// Copyright (c) {{site.time | date: "%Y"}} Apple Inc. and the Swift project authors
// Licensed under Apache License v2.0 with Runtime Library Exception
//
// See https://swift.org/LICENSE.txt for license information
// See https://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
~~~~
