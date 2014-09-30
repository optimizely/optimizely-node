'use strict';

/**
 * Node.js bindings for the Optimizely REST API
 *
 * @author Cheston Lee (cheston@optimizely.com)
 */

var exec = require('child_process').exec;
var Promise = require('es6-promise').Promise;
var api = require('./services/api');

function Optimizely(key, version) {
  if(!(this instanceof Optimizely)) {
    return new Optimizely(key, version);
  }

  return new Promise(function(resolve, reject) {
      this.getClientUserAgent().then(function(ua) {
      this._api = api({
        protocol: Optimizely.DEFAULT_PROTOCOL,
        host: Optimizely.DEFAULT_HOST,
        port: Optimizely.DEFAULT_PORT,
        basePath: Optimizely.BASE_PATH,
        version: Optimizely.DEFAULT_API_VERSION,
        timeout: Optimizely.DEFAULT_TIMEOUT,
        headers: {
          'Token': key,
          'User-Agent': ua
        }
      });

      this._prepResources();
      resolve(this);
    }.bind(this));
  }.bind(this));
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
  publisher: 'optimizely',
  uname: null
};

Optimizely.USER_AGENT_SERIALIZED = null;

Optimizely.prototype = {
  /**
   * Provide a full UserAgent for the client in order to better
   * debug & track.
   *
   * @return Promise
   */
  getClientUserAgent: function() {
    return new Promise(function(resolve, reject) {
      if (Optimizely.USER_AGENT_SERIALIZED) {
        resolve(Optimizely.USER_AGENT_SERIALIZED);
      }

      exec('uname -a', function(err, uname) {
        if (err) reject(err);

        Optimizely.USER_AGENT.uname = uname || 'UNKNOWN';
        Optimizely.USER_AGENT_SERIALIZED = JSON.stringify(Optimizely.USER_AGENT);
        resolve(Optimizely.USER_AGENT_SERIALIZED);
      });
    });
  },

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
