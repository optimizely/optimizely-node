'use strict';
/**
 * Goal model
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
  return modelFactory.create(_.merge(config, {
    entity: 'goals',

    // parent: {
    //   entity: 'projects',
    //   key: 'project_id'
    // },

    instance: function Goal() {},
  }));
};
