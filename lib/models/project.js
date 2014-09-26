'use strict';
/**
 * Project model
 * @author Jordan Garcia (jordan@optimizely.com)
 * @author Cheston Lee (cheston@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
    return modelFactory.create(_.merge(_.clone(config), {
      entity: 'projects',

      instance: function Project() {},

      editable: [
        'ip_filter',
        'include_jquery',
        'project_name',
        'project_status'
      ]
    }));
};
