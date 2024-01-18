---
redirect_from: "server/guides/deploying/heruko"
layout: page
title: Deploying to Heroku
---

## What is Heroku

Heroku is a popular all in one hosting solution, you can find more at heroku.com

## Signing Up

You'll need a heroku account, if you don't have one, please sign up here: [https://signup.heroku.com/](https://signup.heroku.com/)

## Installing CLI

Make sure that you've installed the heroku cli tool.

### HomeBrew

```bash
brew install heroku/brew/heroku
```

### Other Install Options

See alternative install options here: [https://devcenter.heroku.com/articles/heroku-cli#download-and-install](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).

### Logging in

Once you've installed the CLI, login with the following:

```bash
heroku login
```

### Create an application

Visit dashboard.heroku.com to access your account, and create a new application from the drop down in the upper right hand corner. Heroku will ask a few questions such as region and application name, just follow their prompts.

### Project

Today we're going to be hosting Swift NIO's example http server, you can apply these concepts to your own project. Let's start by cloning NIO

```bash

git clone https://github.com/apple/swift-nio
```

Make sure to make our newly cloned directory the working directory


```bash
cd swift-nio
```

By default, Heroku deploys the **master** branch. Always make sure all changes are checked into this branch before pushing.

#### Connect with Heroku

Connect your app with Heroku (replace with your app's name).

```bash
$ heroku git:remote -a your-apps-name-here
```

### Set Stack

As of 13 September 2018, Heroku’s default stack is Heroku 18, we need it to be 16 for swift projects.

```bash
heroku stack:set heroku-16 -a your-apps-name-here
```

### Set Buildpack

Set the buildpack to teach Heroku how to deal with swift, the vapor-communnity buildpack is a good buildpack for *any swift project*. It doesn't install vapor, and it doesn't have any vapor specific setup.


```bash
heroku buildpacks:set vapor/vapor
```

### Swift version file

The buildpack we added looks for a **.swift-version** file to know which version of swift to use.

```bash
echo "5.2" > .swift-version
```

This creates **.swift-version** with `5.2` as its contents.


### Procfile

Heroku uses the **Procfile** to know how to run your app. This includes the executable name and any arguments necessary. You'll see `$PORT` below, this allows heroku to assign a specific port when it launches the app.

```
web: NIOHTTP1Server 0.0.0.0 $PORT
```

You can use this command in terminal to set the file


```bash
echo "web: NIOHTTP1Server 0.0.0.0 $PORT" > Procfile
```

### Commit changes

We have now added the `.swift-version` file, and the `Procfile`, make sure these are committed into master or Heroku will not find them.

### Deploying to Heroku

You're ready to deploy, run this from the terminal. It may take a while to build, this is normal.

```none
git push heroku master
```
