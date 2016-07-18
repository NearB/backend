'use strict';

const rp = require('request-promise');

class Find {

  constructor() {
    this._baseUrl = "http://" + process.env.PROXY_HOST + ":" + process.env.find_PORT;
    console.log("BASE URL: ", this._baseUrl);
  }

  _resource(path) {
    console.log("Resource: " + this._baseUrl + '/' + path);
    return {
      uri: this._baseUrl + '/' + path,
      json: true
    }
  }

  status() {
    return new Promise((resolve, reject) => {
      rp(this._resource('status'))
        .then(result => {
          console.log(result);
          resolve(result)
        })
        .catch(err => {
          console.log(err);
          reject(err)
        });
    });
  }

  learn(trackingInfo) {
    console.log("LEARN");
    console.log(trackingInfo);
    let request = this._resource('learn');
    request.body = trackingInfo;
    request.method = 'POST';

    return new Promise((resolve, reject) => {
      rp(request)
        .then(result => {
          console.log(result);
          resolve(result)
        })
        .catch(err => {
          console.log(err);
          reject(err)
        });
    });
  }
}

module.exports = Find;
