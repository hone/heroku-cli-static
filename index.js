'use strict';

let pkg = require('./package.json');
let config = require("./lib/config");

exports.topics = [{
  name: config.topic,
  description: pkg.description,
}];

exports.commands = [
  require('./lib/commands/init.js'),
  require('./lib/commands/deploy.js')
];
