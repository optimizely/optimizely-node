'use strict';
/**
 * Project model
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
    return modelFactory.create(_.merge(config, {
        entity: 'projects',

        // parent: {
        //   entity: 'accounts',
        //   key: 'account_id'
        // },
        // available: {},

        instance: function Project() {}
        })
    );
};
