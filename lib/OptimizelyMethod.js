'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function optimizelyMethod(schema) {
  var commandPath = schema.path || '';
  var requestMethod = (schema.method || 'GET').toUpperCase();
  var urlParams = schema.urlParams || [];

  return function() {
    var self = this;
    var args = [].slice.call(arguments);

    var cb = typeof args[args.length - 1] == 'function' && args.pop();
    var auth = args.length > urlParams.length && args[args.length - 1] ? args.pop() : null;
    var data = _.isObject(args[args.length - 1]) ? args.pop() : {};
    var urlData = this.createUrlData();

    var promise = this.createPromise(cb);

    for (var i = 0, l = urlParams.length; i < l; ++i) {
      var arg = args[0];
      var param = urlParams[i];

      if (!arg) {
        throw new Error('Optimizely: Require argument "' + urlParams[i] + '" but received "' + arg + '"');
      }

      urlData[param] = args.shift();
    }

    var requestPath = this.createFullPath(commandPath, urlData);

    self._request(requestMethod, requestPath, data, auth, function(err, resp) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(schema.transformResponseData ? schema.transformResponseData(resp) : resp);
      }
    });

    return deferred;
  };
};
