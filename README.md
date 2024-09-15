# Swift.org Website

## Overview

Swift.org website goals include:

1. Welcome the curious about the Swift programming language.
2. Share knowledge with the Swift users community and prospective users, including instructions for getting started with Swift as easily as possible, user guides, best practices, API documentation and feature announcements.
3. Share knowledge with the Swift contributors community and prospective contributors, including contribution guides, technical details that assist contributions, project governance and legal information.
4. Highlight community driven initiatives and technical work that have broad applicability to Swift users in all or some of its core usage domains.

See [website overview](/website) for more information about the Swift.org website goals, content governance and contribution guidelines.

If you want to contribute to the Swift.org redesign, [check here](https://hackmd.io/3Jzov14DT5iLMbBqpG2AVQ)

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
LC_ALL=en_us.UTF-8 bundle exec jekyll serve
open "http://localhost:4000"
```

### Running in Docker

First build the site with Docker Compose:

```bash
docker-compose run build
```

Then you can run the site:

```bash
docker-compose up website
```

The website will be available on `http://localhost:4000`
