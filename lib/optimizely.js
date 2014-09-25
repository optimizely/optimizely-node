'use strict';

var exec = require('child_process').exec;
var api = require('./services/api');
var _ = require('lodash');

function Optimizely(key, version) {
  if(!(this instanceof Optimizely)) {
    return new Optimizely(key, version);
  }

  this._api = api({
    protocol: Optimizely.DEFAULT_PROTOCOL,
    host: Optimizely.DEFAULT_HOST,
    port: Optimizely.DEFAULT_PORT,
    basePath: Optimizely.BASE_PATH,
    version: Optimizely.DEFAULT_API_VERSION,
    timeout: Optimizely.DEFAULT_TIMEOUT,
    apiToken: key
  });

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
  publisher: 'optimizely',
  uname: null
};

Optimizely.USER_AGENT_SERIALIZED = null;

Optimizely.prototype = {
  setHost: function(host, port, protocol) {
    this._setApiField('host', host);
    if(port) this.setPort(port);
    if(protocol) this.setProtocol(protocol);
  },

  setPort: function(port) {
    this._setApiField('port', port);
  },

  setProtocol: function(protocol) {
    this._setApiField('protocol', protocol);
  },

  setApiVersion: function(version) {
    if (version) {
      this._setApiField('version', version);
    }
  },

  setApiKey: function(key) {
    if(key) {
      // this._setApiField('auth', 'Basic ' + new Buffer(key + ':').toString('base64'));
      this._setApiField('auth', key);
    }
  },

  setTimeout: function(timeout) {
    this._setApiField('timeout', timeout == null ? Optimizely.DEFAULT_TIMEOUT : timeout);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getConstant: function(c) {
    return Optimizely[c];
  },

  //TODO: Why a CB?
  getClientUserAgent: function(cb) {
    if (Optimizely.USER_AGENT_SERIALIZED) {
      return cb(Optimizely.USER_AGENT_SERIALIZED);
    }
    exec('uname -a', function(err, uname) {
      Optimizely.USER_AGENT.uname = uname || 'UNKNOWN';
      Optimizely.USER_AGENT_SERIALIZED = JSON.stringify(Optimizely.USER_AGENT);
      cb(Optimizely.USER_AGENT_SERIALIZED);
    });
  },

  _prepResources: function() {
    var config = { api: this._api };

    this.projects = require('./models/project')(config);
    this.experiments = require('./models/experiment')(config);
    this.variations = require('./models/variation')(config);
    this.goals = require('./models/goal')(config);
    this.audiences = require('./models/audience')(config);
  }
};

module.exports = Optimizely;
