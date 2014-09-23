'use strict';

var optimizelyMethod = require('./OptimizelyMethod');
var utils = require('./utils');

module.exports = {
  create: optimizelyMethod({
    method : 'POST'
  }),

  list: optimizelyMethod({
    method: 'GET'
  }),

  retrieve: optimizelyMethod({
    method: 'GET',
    path: '/{id}',
    urlParams: ['id']
  }),

  update: optimizelyMethod({
    method: 'PUT',
    path: '/{id}',
    urlParams: ['id']
  }),

  del: optimizelyMethod({
    method: 'DELETE',
    path: '/{id}',
    urlParams: ['id']
  })
};
