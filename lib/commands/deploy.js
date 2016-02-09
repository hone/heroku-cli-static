'use strict';

let fs = require('mz/fs');
let Bluebird = require('bluebird');
let mktmpdir = Bluebird.promisify(require("mktmpdir"));
let archiver = require('archiver');
let cli = require('heroku-cli-util');
let config = require('../config');
let upload = require('../upload');

let paths = {};

const ROOT_DEFAULT = 'public_html';

function deployCommand(context, heroku) {

  mktmpdir().spread(function(tmpDir, done) {
    paths.tar = `${tmpDir}/source.tar.gz`;

    return fs.readFile(config.configFile).then(JSON.parse);
  }).then(function(config) {
    paths.root = config.root || ROOT_DEFAULT;

    let archive = archiver('tar', { gzip: true })

    archive.on('finish', upload.bind(null, heroku, context, paths))
    archive.pipe(fs.createWriteStream(paths.tar))
    archive.bulk([{
      src: ['static.json', `${paths.root}/**`],
      expand: true,
      dot: true,
      dest: false,
      cwd: context.cwd
    }])
    archive.finalize();
  }).catch(function(err){
    console.log(err, 'error')
  });
}

module.exports = {
  topic: config.topic,
  command: 'deploy',
  needsApp: true,
  needsAuth: true,
  run: cli.command(deployCommand),
  description: 'deploy static.json and root directory',
  help: `This will deploy your static.json configuration file as well as the root folder specified.

Example:

$ heroku static:deploy
`
};
