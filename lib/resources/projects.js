'use strict';
var _ = require('lodash');

var OptimizelyResource = require('../OptimizelyResource');
var optimizelyMethod = OptimizelyResource.method;

var Projects = _.create(OptimizelyResource, {
  path: 'projects',
  includeBasic: [
    'read', 'create', 'list', 'update', 'delete'
  ]
});
console.log(Projects);

module.exports = Projects;
