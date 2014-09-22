'use strict';

var http = require('http');
var https = require('https');
var path = require('path');
var Promise = require('es6-promise').Promise;

var hasOwn = {}.hasOwnProperty;

var utils = require('./utils');
var Error = require('./Error');

function OptimizelyResource(optimizely, urlData) {
  this._optimizely = optimizely;
  this._urlData = urlData || {};

  this.initialize.apply(this, arguments);
}

OptimizelyResource.prototype = {
  path: '',
  createFullPath: function(commandPath, urlData) {},
  createUrlData: function() {},
  createPromise: function(cb) {
    var promise = new Promise();

    if (cb) {
      promise.then(function(res) {
        setTimeout(function() { cb(null, res); }, 0);
      }, function(err) {
        setTimeout(function() { cb(err, null); }, 0);
      });
    }

    return promise;
  },
  _timeoutHandler: function(timeout, req, cb) {},
  _responseHandler: function(req, cb) {},
  _errorHandler: function(req, cb) {},
  _request: function(method, path, data, auth, cb) {
    var requestData = data;
    function makeRequest() {}
  }
};


