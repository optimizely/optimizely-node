'use strict';

jest.autoMockOff();

describe('optimizely', function() {
  var utils = require('./testUtils');

  pit('creates an optimizley object with key', function() {
    require('../lib/optimizely')(utils.getUserOptimizelyKey()).then(function(optly) {
      expect(optly).toBeDefined();
      expect(optly._api._config.headers['Token']).toBe(utils.getUserOptimizelyKey());
    });
  });

  pit('create Optimizely instance and test for model existence', function() {
    require('../lib/optimizely')(utils.getUserOptimizelyKey()).then(function(optly) {
      var resources = ['projects', 'goals', 'variations', 'audiences', 'experiments'];

      resources.forEach(function(resource) {
        expect(typeof optly[resource]).toBe('object');
        expect(typeof optly[resource].instance).toBe('function');
      });
    });
  });

  pit('getClientUserAgent returns legit UA', function() {
    require('../lib/optimizely')(utils.getUserOptimizelyKey()).then(function(optly) {
      var uaObj = JSON.parse(optly._api._config.headers['User-Agent']);
      expect(typeof uaObj).toBe('object');
      expect(uaObj.uname).toBeDefined();
    }, function(err) {
      expect(err).toBeFalsy();
    });
  });
});
