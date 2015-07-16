'use strict';

let Promise = require('bluebird');
let fs = require('fs');
let request = require('request');

module.exports = upload

function upload(heroku, context, paths) {
  heroku.post(`/apps/${context.app}/sources`).then(function(source) {
    let requestOptions = {
      url: source.source_blob.put_url,
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': fs.statSync(paths.tar).size
      }
    };

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
    })

    fs.createReadStream(paths.tar).pipe(req);

    console.log('Uploading app');
  })
}