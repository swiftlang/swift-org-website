# Contributing to Swift.org redesign

## Structure

To contribute to the redesign of Swift.org, use the following `new-layout` branch: https://github.com/swiftlang/swift-org-website/tree/new-layout

The folder `_layouts/new-layouts/` contains the layouts for the new theme.
To apply a new layout to a page, change the front-matter `layout` variable (e.g.: `layout: new-layouts/base`).

The folder `_includes/new-includes/`, for the new theme, contains:
* In the root, the sections of the template.
* In `/components`, the components of the template.

The folder `_data/new-data/`, is where additional data is stored.

The folder `assets/stylesheets/new-stylesheets/` contains the Scss files for the for the new theme, with main file `application.scss`.

The folder `assets/javascripts/new-javascripts/` contains the JavaScript files for the for the new website.

The folder `assets/images/new-images` contains the images for the new theme.

`main` branch will be always rebased into `new-layout` so this branch will always have all the updates made for the content and old website.

## Code

The `.editorconfig` file contains the code style for this new redesign project (There is no need to go back and change the code style for already existing files, this is only valid for new files for this specific project).

Running Prettier will fix the code to conform to the style:
```
prettier --check "**/*.{html,css,js,scss,sass}"
```

We aim to keep JavaScript usage minimal, incorporating it only to enhance the user experience. The site should function effectively without JavaScript, with its use being an optional enhancement to an already fully operational experience.

TODO: Code formatting, rules etc, should be checked automatically before commit.

## Known issues to solve

* 404 page needs to be handled on the server configuration to show a new 404.md instead of the server error: "Not Found: The requested URL was not found on this server.".
* Handle all current routes from old website in new website (have a page with the new layout or a redirect to a new route.. never leave an old route to go to 404).

## Tests

TODO

## Accessibility

We are using htmlproofer:
```
bundle exec jekyll build
bundle exec htmlproofer ./_site
```

## Compatibility

Google Chrome: Version 114 or higher (latest 128)
Apple Safari: Version 16.6 or higher (latest: 18.0)
Microsoft Edge: Version 114 or higher (latest 128)
Mozilla Firefox: Version 114 or higher (latest: 130)

Our goal is to create a **responsive website** that adapts seamlessly to different devices, while also providing a well-formatted version **optimized for printing**.

## Storybook

While running the website in localhost, you can visit [the page /storybook](127.0.0.1:4000/storybook) to see the new theme components separately from the rest of the application.

Each "component" or style "class" must be added to the `stories/` folder.

## Roadmap / Issues Tracking

Currently there is no deadline for delivery.
All tasks/issues for this project are labelled with `new-layout`.

## Metrics/Analytics

We are using the same used for the current website (might change)

## Staging

We are working on providing a staging url where we can see the look of the new template based on the `new-layout` branch.
Staging in reacheable at: https://swift-org-website.vercel.app
TODO: Merge in `new-layout` should deploy to https://swift-org-website.vercel.app

## Production

When ready to go to Production we will:
* Move content of `_layouts/new-layouts/` in `_layouts/`.
* Move content of `_includes/new-includes/` in `_includes/`.
* Move content of `_data/new-data/new-javascripts/` in `_data/`.
* Move content of `assets/stylesheets/new-stylesheets/` in `assets/stylesheets/`.
* Move content of `assets/javascripts/new-javascripts/` in `assets/javascripts/`.
* Move content of `assets/images/new-images` in `assets/images/`.
* Replace all the references of `/new-*/` with ``.
* Merge `new-layout` into `main`.

## Future

* Consideration on adding a Dark Theme (toggle is added)
* Consideration on adding a Search
* Consideration on adding a Sitemap
* Consideration on adding a tab that tells to the users that soon there will be a new design
* Consideration on adding a link to switch from the new design to the old and viceversa (for a bit)
