'use strict';

let fs = require('fs');
let request = require('request');
let archiver = require('archiver');
let path = require('path');
let mktmpdir = require('mktmpdir');
let cli = require('heroku-cli-util');
let config = require('../config');

function deployCommand(context, heroku) {
  mktmpdir(function(err, tmpDir, done) {
    if(err) throw err;

    let configContents = JSON.parse(fs.readFileSync(config.configFile));
    let tarFile = path.join(tmpDir, "source.tar.gz");
    let output = fs.createWriteStream(tarFile);
    let archive = archiver("tar", { 'gzip': true });
    let root = configContents.root || "public_html"

    archive.on('finish', function(err) {
      heroku.post(`/apps/${context.app}/sources`).then(onSources);
      
      function onSources(source) {
        let fileSize = fs.statSync(tarFile).size;
        let requestOptions = {
          url: source.source_blob.put_url,
          method: 'PUT',
          headers: {
            'Content-Type': '',
            'Content-Length': fileSize
          }
        };
        let tarStream = fs.createReadStream(tarFile);
      
        tarStream.on('close', done.bind(null));

        let req = request(requestOptions, function(err, response, body) {
          let requestOptions = {
            path: `/apps/${context.app}/builds`,
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.heroku+json; version=3.streaming-build-output'
            },
            parseJSON: true,
            body: {
              "source_blob": {
                "url": source.source_blob.get_url,
                "version": ''
              }
            }
          };

          console.log("Creating build");
          heroku.request(requestOptions).then(function(build) {
            request.get(build.output_stream_url).pipe(process.stdout);
          });
        });

        console.log("Uploading app");
        tarStream.pipe(req);
      }
    });

    archive.pipe(output);
    console.log(`Packaging app: static.json + ${root} dir`);
    archive.bulk([{
      src: ['static.json', `${root}/**`],
      expand: true,
      dot: true,
      dest: false,
      cwd: context.cwd
    }]).finalize();
  });
}

module.exports = {
  topic: config.topic,
  command: 'deploy',
  needsApp: true,
  needsAuth: true,
  run: cli.command(deployCommand),
  description: 'deploy static.json and root directory',
  help: `This will deploy your static.json configuration file as well as the root folder specified of your application.

ample:

$ heroku static:deploy
`
};
