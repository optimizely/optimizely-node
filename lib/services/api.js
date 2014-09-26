'use strict';

/**
 * Api service configured to work with the Experiment API
 *
 * Largely influenced by Restangular
 *
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var apiFactory = require('./api_factory');
var _ = require('lodash');

module.exports = function(apiConfig) {
  return apiFactory.create(_.merge(_.clone(apiConfig), {
    transforms: {
      'projects': {
         // serialize: JSON.stringify,
        serialize: function(data) {},
        deserialize: JSON.parse
      },
      'audiences': {
         // serialize: JSON.stringify,
        serialize: function(data) {},
        deserialize: JSON.parse
      },
      'experiments': {
         // serialize: JSON.stringify,
        serialize: function(data) {},
        deserialize: JSON.parse
      },
      'goals': {
         // serialize: JSON.stringify,
        serialize: function(data) {},
        deserialize: JSON.parse
      },
      'variations': {
         // serialize: JSON.stringify,
        serialize: function(data) {},
        deserialize: JSON.parse
      },
    }
  }));
};
