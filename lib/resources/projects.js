'use strict';
var _ = require('lodash');

var OptimizelyResource = require('../OptimizelyResource');

module.exports = OptimizelyResource.extend({
  path: 'projects',
  includeBasic: [
    'read', 'create', 'list', 'update', 'delete'
  ]
});
