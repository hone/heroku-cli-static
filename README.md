# heroku-cli-static
This is a plugin for helping with the [static buildpack](https://github.com/hone/heroku-buildpack-static). It provides a quick setup as well as an easy way to deploy.

* `heroku static:init` - will help generate a `static.json`.
* `heroku static:deploy` - deploys your app by packaging your `static.json` and the root directory.

## Install
```sh
$ heroku plugins:install heroku-cli-static
```

## Development

To start working on the plugin, follow the directions below to get it up and running. See the [Heroku DevCenter article](https://devcenter.heroku.com/articles/developing-toolbelt-plug-ins#installing-the-plugin) for more info.

```
$ git clone https://github.com/hone/heroku-cli-static
$ cd heroku-cli-static
$ npm install
$ heroku plugins:link
```
