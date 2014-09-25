'use strict';

/**
 * Audience model
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
  return modelFactory.create(_.merge(config, {
    entity: 'audiences',

    // parent: {
    //   entity: 'projects',
    //   key: 'project_id'
    // },

    instance: function Audience() {},

    fields: {
      id: null,
      project_id: null,
      name: null,
      description: null,
      last_modified: null,
      conditions: [],
      segmentation: false
    },
  }));
};
