'use strict';

let pkg = require('./package.json');

const TOPIC = 'static';

exports.topic = {
  name: TOPIC,
  description: pkg.description,
};

exports.commands = [
  require('./lib/commands/init.js')(TOPIC)
];
