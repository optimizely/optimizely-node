'use strict';

/**
 * Api service configured to work with the Experiment API
 *
 * Largely influenced by Restangular
 *
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var apiFactory = require('./services/api_factory');
var _ = require('lodash');

module.exports = function(apiConfig) {
  return apiFactory.create(_.clone(apiConfig));
};
