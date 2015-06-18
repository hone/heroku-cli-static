'use strict';

let fs = require('fs');
let stringify = require('json-stringify-safe');
let inquirer = require('inquirer');
let questions = require('../questions');

const CONFIG_FILE = 'static.json';

module.exports = function(topic) {
  return {
    topic: topic,
    command: 'init',
    description: 'generate skeleton for static app',
    help: `This utility will walk you through creating a static.json file. It only covers the most common items, and tries to guess sane defaults.

Example:

  $ heroku static:init
`,
    run: function (context) {
      let file = fs.openSync(CONFIG_FILE, 'w');

      inquirer.prompt(questions, function(answers) {
        if (answers.error_page === '') delete answers.error_page

        let prettyJson = stringify(answers, null, 2)
        fs.writeSync(file, prettyJson);
        fs.closeSync(file);
        console.log(prettyJson);
      });
    }
  };
}
