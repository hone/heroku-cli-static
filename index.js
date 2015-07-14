'use strict';

let pkg = require('./package.json');
let config = require("./lib/config");

exports.topic = {
  name: config.TOPIC,
  description: pkg.description,
};

exports.commands = [
  require('./lib/commands/init.js'),
  require('./lib/commands/deploy.js')
];
