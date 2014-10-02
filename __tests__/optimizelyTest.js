'use strict';

jest.autoMockOff();

describe('optimizely', function() {
  var utils = require('./testUtils');

  it('creates an optimizley object with key', function() {
    var optly = require('../lib/optimizely')(utils.getUserOptimizelyKey());
    expect(optly).toBeDefined();
    expect(optly._api._config.headers['Token']).toBe(utils.getUserOptimizelyKey());
  });

  it('create Optimizely instance and test for model existence', function() {
    var optly = require('../lib/optimizely')(utils.getUserOptimizelyKey());
    var resources = ['projects', 'goals', 'variations', 'audiences', 'experiments'];

    resources.forEach(function(resource) {
      expect(typeof optly[resource]).toBe('object');
      expect(typeof optly[resource].instance).toBe('function');
    });
  });

  it('getClientUserAgent returns legit UA', function() {
    var optly = require('../lib/optimizely')(utils.getUserOptimizelyKey());
    var uaObj = JSON.parse(optly._api._config.headers['User-Agent']);
    expect(typeof uaObj).toBe('object');
    expect(uaObj.lang).toBe('node');
    expect(uaObj.publisher).toBe('optimizely');
  });
});
