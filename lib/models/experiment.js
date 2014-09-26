'use strict';

/**
 * Experiment model
 * @author Jordan Garcia (jordan@optimizely.com)
 * @author Cheston Lee (cheston@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
  return modelFactory.create(_.merge(_.clone(config), {
    entity: 'experiments',

    parent: {
      entity: 'projects',
      key: 'project_id'
    },

    instance: function Experiment() {},

    // TODO(jordan): fill out the field
    //fields: {},
  }));
};
