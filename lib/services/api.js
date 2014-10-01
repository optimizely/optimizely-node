'use strict';

/**
 * Api service configured to work with the Experiment API
 *
 * Largely influenced by Restangular
 *
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var apiFactory = require('./services/api_factory');

module.exports = function(apiConfig) {
  return apiFactory.create(apiConfig);
};
