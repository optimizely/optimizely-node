'use strict';
/**
 * Variation model
 * @author Jordan Garcia (jordan@optimizely.com)
 * @author Cheston Lee (cheston@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
  return modelFactory.create(_.merge(_.clone(config), {
    entity: 'variations',

    parent: {
      entity: 'experiments',
      key: 'experiment_id'
    },

    instance: function Variation() {},

    editable: [
      'audience_ids',
      'activation_mode',
      'description',
      'edit_url',
      'status',
      'custom_css',
      'custom_js',
      'percentage_included',
      'url_conditions'
    ]
  }));
};
