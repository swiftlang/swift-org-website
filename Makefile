# Build and serve the Swift website.
#
# The site is a Swift package rendered with Kiln:
# https://github.com/brokenhandsio/kiln

.PHONY: help build serve clean

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
