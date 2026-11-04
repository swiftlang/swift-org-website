---
redirect_from: "server/guides/deploying/heruko"
layout: page
title: Deploying to Heroku
---

Heroku is a popular all-in-one hosting solution.

For your Heroku application, you only need to select a virtual operating system ([stack](#stack-selection)) and preinstalled software packages ([buildpack](#buildpack-selection)). After installing Heroku's CLI tools, you can use standard git commands to push your code to Heroku, where it will be built from source and deployed.

You can learn more at [heroku.com](https://heroku.com/).

## Sign-Up

You'll need a Heroku account. If you don't have one, please sign up [here](https://signup.heroku.com/).

## CLI Setup

Make sure that you've installed the Heroku CLI tools.

### Homebrew Installation

```bash
brew tap heroku/brew && brew install heroku
```

### Other Install Options

See alternative install options [here](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli).

### Login

Once you've installed the CLI, log in with the following command:

```bash
heroku login
```

…and follow the prompts.

## Application Setup

Visit [the Heroku dashboard](https://dashboard.heroku.com/) to access your account, and create a new application from the dropdown in the upper right hand corner. Heroku will ask a few questions such as region and application name, just follow their prompts.

### Example Project Creation

For this guide, we're going to be hosting Swift NIO's example HTTP server – you can apply these concepts to your own project. Let's start by cloning NIO:

```bash
git clone https://github.com/apple/swift-nio
```

Make sure to make our newly cloned directory the working directory:


```bash
cd swift-nio
```

By default, Heroku deploys the **main** branch. Always make sure all changes are checked into this branch before pushing.

#### Connecting to Heroku

Connect your app with Heroku (*replace with your app's name*):

```bash
heroku git:remote -a your-apps-name-here
```

### Stack Selection

The Swift buildpack used below supports the Heroku-24 stack, which is based on Ubuntu 24.04:

```bash
heroku stack:set heroku-24 -a your-apps-name-here
```

Currently available stacks are listed [here](https://devcenter.heroku.com/articles/stack).

### Buildpack Selection

Set the buildpack to teach Heroku how to deal with Swift. The [Vapor Community buildpack](https://github.com/vapor-community/heroku-buildpack) is a good buildpack for *any* Swift project. It doesn't install Vapor, and it doesn't have any Vapor-specific setup.

```bash
heroku buildpacks:set vapor/vapor
```

### Swift Version Selection

The buildpack installs the latest release of Swift by default. To pin a specific version, create a **.swift-version** file in the project root directory:

```bash
echo "6.4" > .swift-version
```

This creates **.swift-version** with `6.4` as its contents. The buildpack uses [swiftly](/install/linux/swiftly/) to install Swift, so any version that swiftly accepts, such as `6.4` or `6.4.0`, works here.

### Procfile Creation

Heroku uses a **Procfile** to know how to launch and run your app. This includes the executable name and any arguments necessary. You'll see `$PORT` below, this allows Heroku to assign a specific port when it launches the app.

```bash
web: NIOHTTP1Server 0.0.0.0 $PORT
```

You can use this command in terminal to set the file


```bash
echo "web: NIOHTTP1Server 0.0.0.0 $PORT" > Procfile
```

The contents of this file may vary depending on your server framework. For Vapor apps, the default Procfile content is the following:

```bash
web: Run serve --env production --hostname 0.0.0.0 --port $PORT
```

### Wrap-Up

Now that we have added the `.swift-version` and `Procfile` files, make sure these are committed on `main` to be included in your deployment:

```bash
git add .swift-version Procfile
git commit -am "Add Swift version file and Procfile"
```

## Deployment to Heroku

When you're ready to deploy, run this from the terminal:

```bash
git push heroku main
```

This will take significantly longer than regular git operations as Heroku will build your project incl. all dependencies from scratch, verify and deploy it.

More information can be found on [here](https://devcenter.heroku.com/articles/git#deploy-your-code).
