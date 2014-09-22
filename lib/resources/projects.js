'use strict';

var OptimizelyResource = require('../OptimizelyResource');
var optimizelyMethod = OptimizelyResource.method;

module.exports = OptimizelyResource.extend({
  path: 'projects',
  includeBasic: [
    'read', 'create', 'list', 'update', 'delete'
  ]
});
