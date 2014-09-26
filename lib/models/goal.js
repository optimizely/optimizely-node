'use strict';
/**
 * Goal model
 * @author Jordan Garcia (jordan@optimizely.com)
 * @author Cheston Lee (cheston@optimizely.com)
 */
var modelFactory = require('../services/model_factory');
var _ = require('lodash');

module.exports = function(config) {
  return modelFactory.create(_.merge(_.clone(config), {
    entity: 'goals',

    parent: {
      entity: 'projects',
      key: 'project_id'
    },

    instance: function Goal() {},

    fields: {
      "metric": null,
      "is_editable": false,
      "target_to_experiments": null,
      "revenue_tracking_amount": null,
      "id": 860850647,
      "target_urls": [],
      "title": "Add to cart clicks",
      "preview_user_agent": "",
      "event": null,
      "url_match_types": [],
      "element_id": "",
      "project_id": 547944643,
      "goal_type": 0,
      "deleted": false,
      "experiment_ids": [],
      "selector": null,
      "multi_event": false,
      "created": "2014-04-20T18:20:10.991600Z",
      "target_url_match_types": [],
      "revenue_tracking": false,
      "preview_url": null,
      "addable": false,
      "urls": []
    },
    editable: [
      'addable',
      'experiment_ids',
      'goal_type',
      'selector',
      'target_to_experiments',
      'target_urls',
      'target_url_match_types',
      'title',
      'urls',
      'url_match_types'
    ]
  }));
};
