'use strict';
// jest.dontMock('../lib/services/api_factory.js');
// jest.dontMock('request-promise');
//
//TODO: AutoMock does not work with request-promise
jest.autoMockOff();

describe('API Layer test suite', function() {
  it('tests API Object creation and config definition', function() {
    var Api = require('../lib/services/api_factory');
    // var request = require('request-promise');

    var api = Api.create({});
    expect(api).toBeDefined();
    expect(api._stack).toEqual([]);
    expect(api._filter).toEqual([]);

    var config = api._config;
    expect(config.headers).toEqual({})
    expect(config.transforms.defaults).toBeDefined();
  });
});
