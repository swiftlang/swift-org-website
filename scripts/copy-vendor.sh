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

mkdir -p assets/js/vendor

copy_if_needed() {
  src=$1
  dest=$2

  if [ ! -f "$dest" ] || [ "$src" -nt "$dest" ]; then
    cp "$src" "$dest"
  fi
}

copy_if_needed node_modules/animejs/lib/anime.iife.min.js assets/javascripts/new-javascripts/vendor/anime.iife.min.js
