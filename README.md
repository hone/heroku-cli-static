# heroku-cli-static
This is a plugin for helping with the [static buildpack](https://github.com/hone/heroku-buildpack-static). It provides a quick setup as well as an easy way to deploy.

* `heroku static:init` - will help generate a `static.json`.
* `heroku static:deploy` - deploys your app by packaging your `static.json` and the root directory.

## Install
```sh
$ heroku plugins:install https://github.com/hone/heroku-cli-static
```
