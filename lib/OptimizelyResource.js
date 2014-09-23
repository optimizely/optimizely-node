'use strict';

var https = require('https');
var path = require('path');
var Promise = require('es6-promise').Promise;
var _ = require('lodash');

var hasOwn = {}.hasOwnProperty;

var utils = require('./utils');
// var Error = require('./Error');

function OptimizelyResource(optimizely, urlData) {
  this._optimizely = optimizely;
  this._urlData = urlData || {};

  this.basePath = optimizely.getApiField('basePath');
  this.path = this.path;

  if (this.includeBasic) {
    this.includeBasic.forEach(function(method) {
      console.log(method);
      this[method] = OptimizelyResource.BASIC_METHODS[method];
    }, this);
  }

  this.initialize.apply(this, arguments);
}

OptimizelyResource.method = require('./OptimizelyMethod');
OptimizelyResource.BASIC_METHODS = require('./OptimizelyResource.basic');

OptimizelyResource.prototype = {
  path: '',
  initialize: function() {},
  createFullPath: function(commandPath, urlData) {
    return path.join(
      this.basePath(urlData),
      this.path(urlData),
    typeof commandPath == 'function' ?
    commandPath(urlData) : commandPath);
  },
  createUrlData: function() {
    var urlData = {};
    for (var i in this._urlData) {
      if(hasOwn.call(this._urlData, i)) {
        urlData[i] = this._urlData[i];
      }
    }
    return urlData;
  },
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
  _timeoutHandler: function(timeout, req, cb) {
    var self = this;
    return function() {
      var timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();
      cb.call(self, new Error('Request has been aborted due to timeout being reached'), null);
    };
  },
  _responseHandler: function(req, cb) {
    var self = this;
    return function(res) {
      var resp= '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        resp += chunk;
      });

      res.on('end', function() {
        try {
          resp= JSON.parse(response);
          if (resp.error) {
            var err;
            if (res.statusCode === 401) {
              err = new Error(resp.error);
            }

            return cb.call(self, err, null);
          }
        } catch(e) {
          return cb.call(self, new Error('Invalid JSON recieved from Optimizely API'), null);
        }

        cb.call(self, null, resp);
      });
    };
  },
  _errorHandler: function(req, cb) {
    var self = this;
    return function(err) {
      if (req._isAborted) {
        return;
      }

      cb.call(self, new Error('An error occurred with our connection to Optimizely'), null);
    };
  },

  _request: function(method, path, data, auth, cb) {
    var requestData = utils.stringifyRequestData(data || {});
    var self = this;

    var apiVersion = this._optimizely.getApiField('version');

    var headers = {
      'Token': auth,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': requestData.length,
      'User-Agent': 'Optimizely/v1 NodeBindings/' + this._optimizely.getConstant('PACKAGE_VERSION')
    };

    this._optimizely.getClientuserAgent(function(cua) {
      headers['X-Optimizely-Client-User-Agent'] = cua;
      makeRequest();
    });

    function makeRequest() {
      var timeout = self._optimizely.getApiField('timeout');
      // var isSecureConnection = self._optimizely.getApiField('protocol') == 'https';
      var req = https.request({
        host: self._optimizely.getApiField('host'),
        port: self._optimizely.getApiField('port'),
        path: path,
        method: method,
        headers: headers
      });

      req.setTimeout(timeout, self._timeoutHandler(timeout, req, cb));
      req.on('response', self._responseHandler(req, cb));
      req.on('error', self._errorHandler(req, cb));

      req.on('socket', function(socket) {
        socket.on('secureConnect', function() {
          req.write(requestData);
          req.end();
        });
      });
    }
  }
};

module.exports = OptimizelyResource;
