'use strict';
/**
 * Variation model
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
  return modelFactory.create(_.merge(_.clone(config), {
    entity: 'variations',

    // parent: {
    //   entity: 'experiments',
    //   key: 'experiment_id'
    // },

    instance: function Variation() {},
  }));
};
