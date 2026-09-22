# Build and serve the Swift website.
#
# The site is a Swift package rendered with Kiln:
# https://github.com/brokenhandsio/kiln

.PHONY: help build serve clean highlight-bundle

help:
	@echo "Usage:"
	@echo "  make build    Build the website into ./site"
	@echo "  make serve    Serve it at http://localhost:4000, rebuilding on changes"
	@echo "  make clean    Remove the build output"

# `kiln build` runs this package's executable, which renders the site.
build:
	kiln build

# `kiln serve` builds, serves, and rebuilds whenever a source file changes.
serve:
	kiln serve --port 4000

clean:
	rm -rf site .build

# Rebuild the vendored highlight.js bundle (upstream "common" build plus the
# grammars the site uses beyond it). Run after bumping HLJS_VERSION.
HLJS_VERSION ?= 11.9.0
HLJS_EXTRA_LANGUAGES := cmake dockerfile dos lisp powershell protobuf
HLJS_BUNDLE := assets/javascripts/new-javascripts/vendor/highlight.min.js

.PHONY: highlight-bundle
highlight-bundle:
	@base=https://cdnjs.cloudflare.com/ajax/libs/highlight.js/$(HLJS_VERSION); \
	tmp=$$(mktemp -d); \
	{ \
	  printf '/*! Highlight.js $(HLJS_VERSION) bundle for Swift.org.\n'; \
	  printf ' *  The upstream "common" build plus the extra grammars the site uses.\n'; \
	  printf ' *  Regenerate with `make highlight-bundle` — do not edit by hand.\n'; \
	  printf ' */\n'; \
	  curl -sSfL $$base/highlight.min.js; printf '\n'; \
	  for l in $(HLJS_EXTRA_LANGUAGES); do curl -sSfL $$base/languages/$$l.min.js; printf '\n'; done; \
	} > $$tmp/highlight.min.js && mv $$tmp/highlight.min.js $(HLJS_BUNDLE); \
	rm -rf $$tmp; \
	echo "wrote $(HLJS_BUNDLE)"
