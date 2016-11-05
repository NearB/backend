'use strict';

const rp = require('request-promise');

class Find {

  constructor() {
    this._baseUrl = 'http://' + process.env.PROXY_HOST + ':' + process.env.find_PORT;
    console.log('BASE URL: ', this._baseUrl);
  }

  _resource(path) {
    console.log('Resource: ' + this._baseUrl + '/' + path);
    return {
      uri: this._baseUrl + '/' + path,
      json: true
    };
  }

  _requestPromise(request){
    return new Promise((resolve, reject) => {
      rp(request)
        .then(result => {
          console.log(result);
          resolve(result);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  status() {
    return new Promise((resolve, reject) => {
      rp(this._resource('status'))
        .then(result => {
          console.log(result);
          resolve(result);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  listLocations(groupName) {
    let request = this._resource('location');
    request.method = 'GET';
    request.qs = {
        group: groupName
    };

    return this._requestPromise(request);
  }

  learn(trackingInfo) {
    let request = this._resource('learn');
    request.body = trackingInfo;
    request.method = 'POST';

    return this._requestPromise(request);
  }

  track(trackingInfo) {
    let request = this._resource('track');
    request.body = trackingInfo;
    request.method = 'POST';

    return this._requestPromise(request);
  }

  deleteLocation(group, name) {
    let request = this._resource('locations');
    request.qs = {
      group: group,
      names: name
    };
    request.method = 'DELETE';

    return this._requestPromise(request);
  }

  deleteUser(group, username) {
    let request = this._resource('username');
    request.qs = {
      group: group,
      names: username
    };
    request.method = 'DELETE';

    return this._requestPromise(request);
  }

}

module.exports = Find;
