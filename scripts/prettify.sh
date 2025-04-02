#!/bin/bash

prettier --write \
  "assets/{javascripts/new-javascripts,stylesheets/new-stylesheets}/**/*.{js,scss}" \
  "_layouts/new-layouts/**/*.html" \
  "_includes/new-includes/**/*.html" \
  "install/**/*.{html,md}" \
  "get-started/**/*.md" \
  "use-case/**/*.md" \
  "index.md"