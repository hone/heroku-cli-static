'use strict';

let pkg = require('./package.json');

const TOPIC = 'static';
const CONFIG_FILE = 'static.json';

exports.topic = {
  name: TOPIC,
  description: pkg.description,
};

exports.commands = [
  require('./lib/commands/init.js')(TOPIC, CONFIG_FILE),
  require('./lib/commands/deploy.js')(TOPIC, CONFIG_FILE)
];
