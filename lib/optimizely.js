'use strict';

/**
 * Node.js bindings for the Optimizely REST API
 *
 * @author Cheston Lee (cheston@optimizely.com)
 */

var api = require('./services/api_factory');

function Optimizely(key, oauth, version) {
  if(!(this instanceof Optimizely)) {
    return new Optimizely(key, oauth, version);
  }
    var apiObj = {
      protocol: Optimizely.DEFAULT_PROTOCOL,
      host: Optimizely.DEFAULT_HOST,
      port: Optimizely.DEFAULT_PORT,
      basePath: Optimizely.BASE_PATH,
      version: Optimizely.DEFAULT_API_VERSION,
      timeout: Optimizely.DEFAULT_TIMEOUT,
      headers: {
        'User-Agent': JSON.stringify(Optimizely.USER_AGENT)
      }
    }
    if(oauth){
      apiObj.headers['Authorization'] = 'Bearer '+key;
    }else {
      apiObj.headers['Token'] = key;
    }

    this._api = api.create(apiObj);

    this._prepResources();
}

Optimizely.DEFAULT_HOST = 'www.optimizelyapis.com';
Optimizely.DEFAULT_PORT = '443';
Optimizely.BASE_PATH = '/experiment/v1';
Optimizely.DEFAULT_PROTOCOL = 'https://';
Optimizely.DEFAULT_API_VERSION = null;

Optimizely.DEFAULT_TIMEOUT = require('http').createServer().timeout;
Optimizely.PACKAGE_VERSION = require('../package.json').version;

Optimizely.USER_AGENT = {
  bindings_version: Optimizely.PACKAGE_VERSION,
  lang: 'node',
  lang_version: process.version,
  publisher: 'optimizely'
};


Optimizely.prototype = {
  _prepResources: function() {
    if (!this._api) throw Error('Optimizely Error: API resources not ready.');

    var config = { api: this._api };
    this.projects = require('./models/project')(config);
    this.experiments = require('./models/experiment')(config);
    this.variations = require('./models/variation')(config);
    this.goals = require('./models/goal')(config);
    this.audiences = require('./models/audience')(config);
  }
};

module.exports = Optimizely;
