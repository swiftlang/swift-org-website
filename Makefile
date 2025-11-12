# Makefile for managing the Swift website with the container app

.PHONY: help build run-build website stop clean

help:
	@echo "Usage:"
	@echo "  make build    Build the swift-website-builder container image"
	@echo "  make run-build  Build the Jekyll website"
	@echo "  make website  Run the Jekyll development server"
	@echo "  make stop     Stop the running website container"
	@echo "  make clean    Stop the container and remove the build output"

# Build the primary container image
build:
	container build --tag swift-website-builder --file Dockerfile .

# Run a one-off Jekyll build
run-build:
	@mkdir -p ./.output
	container run --rm \
	  -v "$(CURDIR)":/srv/jekyll \
	  -v "$(CURDIR)/.output":/output \
	  swift-website-builder \
	  /bin/bash -cl "bundle check && bundle exec jekyll build --source /srv/jekyll --destination /output"

# Run the development web server
website:
	@mkdir -p ./.output
	container run -d --rm --name swift-website \
	  -p 4000:4000 \
	  -v "$(CURDIR)":/srv/jekyll \
	  -v "$(CURDIR)/.output":/output \
	  swift-website-builder \
	  /bin/bash -cl "bundle check && bundle exec jekyll serve --source /srv/jekyll --destination /output --host 0.0.0.0 --watch"
	@echo "Website is running at http://localhost:4000"

# Stop the development server
stop:
	container stop swift-website

# Clean up build artifacts
clean: stop
	@echo "Removing .output directory..."
	@rm -rf ./.output
