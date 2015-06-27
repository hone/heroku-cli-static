'use strict';

let fs = require('fs');
let request = require('request');
let archiver = require('archiver');
let path = require('path');
let mktmpdir = require('mktmpdir');
let cli = require('heroku-cli-util');

module.exports = function(topic, configFile) {
  return {
    topic: topic,
    command: 'deploy',
    description: 'deploy static.json and root directory',
    help: `This will deploy your static.json configuration file as well as the root folder specified of your application.

Example:

  $ heroku static:deploy
`,
    needsApp: true,
    needsAuth: true,
    run: cli.command(function(context, heroku) {
      mktmpdir(function(err, tmpDir, done) {
        if(err) throw err;

        let config = JSON.parse(fs.readFileSync(configFile));
        let tarFile = path.join(tmpDir, "source.tar.gz");
        let output = fs.createWriteStream(tarFile);
        let archive = archiver("tar", { 'gzip': true });

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
            tarStream.on('close', function() {
              done(err);
            });

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
        console.log("Packaging app");
        archive.bulk([{
          src: ['static.json', `${config.root}/**`],
          expand: true,
          dot: true,
          dest: false,
          cwd: context.cwd
        }]).finalize();
      });
    })
  };
}
