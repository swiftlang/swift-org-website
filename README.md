# Swift.org Website

## Overview

Swift.org website goals include:

1. Welcome the curious about the Swift programming language.
2. Share knowledge with the Swift users community and prospective users, including instructions for getting started with Swift as easily as possible, user guides, best practices, API documentation and feature announcements.
3. Share knowledge with the Swift contributors community and prospective contributors, including contribution guides, technical details that assist contributions, project governance and legal information.
4. Highlight community driven initiatives and technical work that have broad applicability to Swift users in all or some of its core usage domains.

See [website overview](/website) for more information about the Swift.org website goals, content governance and contribution guidelines.

## Technical

Swift.org uses [Jekyll](https://jekyllrb.com), a blog-aware, static site generator in Ruby.

### Running locally

Requirements

- Git
- Ruby 3.3 or higher
  _(a Ruby installation manager, such as
  [rbenv](https://github.com/sstephenson/rbenv) or
  [RVM](https://rvm.io) is recommended, but not required)_
- [Bundler](https://bundler.io/)

To run the site locally, enter the following commands into a terminal window:

```shell
git clone https://github.com/swiftlang/swift-org-website.git
cd swift-org-website
bundle install
LC_ALL=en_us.UTF-8 bundle exec jekyll serve --config _config.yml,_config_dev.yml
open "http://localhost:4000"
```

If you’d like to contribute to this project, please run Prettier before submitting your pull request to ensure consistent code style across the project.

Requirements

- [Node v18.17.1 or higher](https://nodejs.org)

```shell
npm install
```

```shell
npm run prettify
```

### Running site content checks

The site checker tool crawls the locally running development site to identify content issues like broken links, missing images, and isolated pages.

**Prerequisites:**

- Node.js v18.17.1 or higher
- Site running locally at http://localhost:4000

**Running the checker:**

```bash
# Install dependencies (if not already done)
npm install

# Start the local development server in one terminal
LC_ALL=en_us.UTF-8 bundle exec jekyll serve --config _config.yml,_config_dev.yml

# In another terminal, run the site checker
npm run site-check
```

The tool will generate:

- Console output with detected issues
- `site-check-report.json` with detailed findings

**Querying the report:**

```bash
# List all isolated pages (pages with no incoming links)
jq '.pages | to_entries | map(select(.value.isIsolated == true) | .key) | .[]' site-check-report.json

# Show incoming links for a specific page
jq '.pages["/install/macos"].incomingLinks' site-check-report.json

# Find pages with the most incoming links
jq '.pages | to_entries | map({page: .key, count: (.value.incomingLinks | length)}) | sort_by(.count) | reverse | .[0:10]' site-check-report.json

# Find which pages link to a specific page
jq '.pages | to_entries[] | select(.value.outgoingLinks.content[] == "/documentation") | .key' site-check-report.json

# List all pages with errors and their incoming links
jq '.pages | to_entries | map(select(.value.issues.error != null) | {page: .key, error: .value.issues.error, incomingLinks: .value.incomingLinks}) | .[]' site-check-report.json
```

**Configuration:**

You can customize the site check behavior using environment variables:

```bash
# Check up to 2000 pages (default: 1000)
MAX_PAGES=2000 npm run site-check

# Use a different base URL
SITE_URL=http://localhost:8080 npm run site-check

# Add delay between page requests in milliseconds (default: 50)
# Increase this if your dev server is struggling under load
CRAWL_DELAY=250 npm run site-check

# Enable external link checking (default: false, currently unused)
CHECK_EXTERNAL=true npm run site-check

# Combine multiple options
MAX_PAGES=500 CRAWL_DELAY=100 npm run site-check
```

### Running in Docker

First build the site with Docker Compose:

```bash
docker compose run build
```

Then you can run the site:

```bash
docker compose up website
```

The website will be available on `http://localhost:4000`
