# Swift.org Website

## Overview

Swift.org website goals include:

1. Welcome the curious about the Swift programming language.
2. Share knowledge with the Swift users community and prospective users, including instructions for getting started with Swift as easily as possible, user guides, best practices, API documentation and feature announcements.
3. Share knowledge with the Swift contributors community and prospective contributors, including contribution guides, technical details that assist contributions, project governance and legal information.
4. Highlight community driven initiatives and technical work that have broad applicability to Swift users in all or some of its core usage domains.

See [website overview](/website) for more information about the Swift.org website goals, content governance and contribution guidelines.

## Technical

Swift.org is built with [Kiln](https://github.com/brokenhandsio/kiln), a static
site generator written in Swift.

The repository *is* the site — a Swift package rendered by Kiln:

| Directory | Contents |
| --- | --- |
| `Pages/` | Every page — markdown, with [Leaf](https://docs.vapor.codes/leaf/overview/) where a page is data-driven |
| `Posts/` | The blog posts |
| `Data/` | The YAML behind the navigation, installers and package lists |
| `Theme/` | Leaf templates and partials |
| `Static/` | Files published verbatim (signing keys, the OpenAPI spec) |
| `API/` | The JSON endpoints under `/api/` |
| `Sources/` | The build program |
| `assets/` | Stylesheets (`.scss`), scripts and images |

### Running locally

Requirements
- Git
- Swift 6.3 or higher
- The [Kiln](https://github.com/brokenhandsio/kiln) CLI:
  ```shell
  brew install brokenhandsio/tap/kiln
  ```
- [Dart Sass](https://sass-lang.com/install) on your `PATH`, for the stylesheets:
  ```shell
  brew install sass/sass/sass
  ```

To run the site locally:

```shell
git clone https://github.com/swiftlang/swift-org-website.git
cd swift-org-website
make serve
open "http://localhost:4000"
```

`make serve` runs `kiln serve`, which builds the site, serves it, and rebuilds
whenever you change a page, a template or a data file — just reload the browser.

You can also drive Kiln directly from the package:

```shell
kiln serve                 # build, serve on :8080, rebuild on changes
kiln serve --port 4000     # ...on a different port
kiln serve --no-watch      # build and serve once
kiln build                 # build into ./site without serving
```

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for how the site is put together.

If you’d like to contribute to this project, please run Prettier before submitting your pull request to ensure consistent code style across the project.

Requirements
- [Node v18.17.1 or higher](https://nodejs.org)

```shell
npm install
```

```shell
npm run prettify
```

### Running with Apple Container

On macOS 26 and later, you can use the [Apple Container](https://github.com/apple/container) tool to host and run the website.

First install and run `container`:

```shell
brew install container
brew services start container
```

Then build and run the site:

```shell
make build
make website
```

The website will be available at `http://localhost:4000`

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
