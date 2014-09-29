'use strict';

jest.autoMockOff();

describe('optimizely', function() {
  var utils = require('./testUtils');
  var optimizely = require('../lib/optimizely')(utils.getUserOptimizelyKey());

  it('creates an optimizley object with key', function() {
    expect(optimizely).toBeDefined();
  });

  pit('getClientUserAgent returns legit UA', function() {
    return optimizely.getClientUserAgent().then(function(ua) {
      var uaObj = JSON.parse(ua);
      console.log(uaObj.uname);
      expect(uaObj).toBeDefined();
      expect(uaObj.uname).toBeDefined();
      // expect(ua).toMatch(//);
    }, function(err) {
      expect(err).toBeFalsy();
    });
  });
});
