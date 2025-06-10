#!/bin/bash
##===----------------------------------------------------------------------===##
##
## This source file is part of the Swift.org open source project
##
## Copyright (c) 2025 Apple Inc. and the Swift.org project authors
## Licensed under Apache License v2.0
##
## See LICENSE.txt for license information
## See CONTRIBUTORS.txt for the list of Swift.org project authors
##
## SPDX-License-Identifier: Apache-2.0
##
##===----------------------------------------------------------------------===##

prettier --write \
  "assets/{javascripts/new-javascripts,stylesheets/new-stylesheets}/**/*.{js,scss}" \
  "_layouts/new-layouts/**/*.html" \
  "_includes/new-includes/**/*.html" \
  "install/**/*.{html,md}" \
  "get-started/**/*.md" \
  "use-case/**/*.md" \
  "index.md"