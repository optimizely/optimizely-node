'use strict';
/**
 * Factory for generating API instances
 *
 * @author Cheston Lee (cheston@optimizely.com)
 * @author Jordan Garcia (jordan@optimizely.com)
 */
var request = require('request-promise');
var _ = require('lodash');

/**
 * Config Options
 * config.headers {Object}
 * config.baseUrl {String}
 * config.transforms {Object.<{ serialize: function, deserialize: function}>}
 *
 * @constructor
 * @param {Object} config
 */
function Api(config) {
  // config
  this._config = config || {};
  this._config.transforms = _.merge(this._config.transforms || {},{
    defaults: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  });

  this._config.headers = this._config.headers || {};

  // stack of [('one' | 'all'), <noun>, <id?>]
  // ex [['all', 'experiments'] or ['one', 'projects', 4001]]
  this._stack = [];

  /**
   * Array of filters to apply to URL
   * ex: /api/v1/projects/4001/experiments?filter=status:Started&filter=project_id:55
   * @var Array.<{field: string, value: string}>
   */
  this._filter = [];
}

/**
 * Class level method to make an ajax request
 * Exists at class level for ease of testability
 *
 * Opts:
 * 'data' {Object}
 * 'method' {String} 'GET', 'PUT', 'POST', 'DELETE'
 * 'url' {String}
 *
 * @param {Object} opts
 * @param {Object=} headers
 * @return {Promise}
 */
Api.request = function(opts, headers) {
  if (!opts.method || !opts.url) {
    throw new Error("Must supply `opts.type` and `opts.url` to Api.request(opts)");
  }

  var requestOpts = {
    method: opts.method,
    url: opts.url,
    encoding: 'utf8'
  };

  if (!headers.Token) {
    throw new Error('Optimizely: Request requires API Token, found none.');
  }

  if (opts.data) {
    headers['content-type'] = 'application/json';
    requestOpts.body = opts.data;

    requestOpts.dataType = 'json';
  }

  requestOpts.headers = headers;
  return request(requestOpts).promise();
};

/**
 * Appends '/{noun}/{id}' to the endpoint
 * @param {string} noun
 * @param {number} id
 * @return {Api}
 */
Api.prototype.one = function(noun, id) {
  this._stack.push(['one', noun, id]);
  return this;
};

/**
 * Appends '/{noun}' to the endpoint
 * @param {string} noun
 * @return {Api}
 */
Api.prototype.all = function(noun) {
  this._stack.push(['all', noun]);
  return this;
};

/**
 * Adds property to filter
 *
 * @param {String|Object} keyOrObject single key (to associate with val) or object of key/value pairs
 * @param {String=} val Value to match against
 * @return {Api}
 */
Api.prototype.filter = function(keyOrObject, val) {
  if (this._getMode() !== 'all') {
    throw new Error("ApiService Error: .filter() must be called in 'all' mode");
  }

  var filters = keyOrObject;
  if (typeof keyOrObject === 'string') {
    filters = {};
    // use 'true' if no value is provided
    filters[keyOrObject] = val;
  }

  _.each(filters, function(val, key) {
    this._filter.push([key, val]);
  }.bind(this));

  return this;
};

/**
 * Serializes instance data based on configured transforms on the entity
 *
 * @param {String} entity ex 'audiences'
 * @param {Object} data
 * @return {Object} serialized data
 */
Api.prototype.serialize = function(entity, data) {
  data = _.cloneDeep(data);
  if (this._config.transforms[entity]) {
    return this._config.transforms[entity].serialize(data);
  } else {
    return this._config.transforms.defaults.serialize(data);
  }
};

/**
 * Serializes instance data based on configured transforms the entity
 *
 * @param {String} entity ex 'audiences'
 * @param {Object} data
 * @return {Object} deserialized data
 */
Api.prototype.deserialize = function(entity, data) {
  data = _.cloneDeep(data);
  if (this._config.transforms[entity]) {
    return this._config.transforms[entity].deserialize(data);
  } else {
    return this._config.transforms.defaults.deserialize(data);
  }
  return data;
};

/**
 * Make POST request to current endpoint
 * @param {Object} data
 * @return {Promise}
 */
Api.prototype.post = function(data) {
  if (this._getMode() !== 'all') {
    throw new Error("ApiService Error: .post() must be called in 'all' mode");
  }

  var entity = this._getEntity();

  var opts = {
    method: 'POST',
    data: this.serialize(entity, data),
    url: this._getUrl()
  };

  return Api.request(opts, this._config.headers).then(function(response) {
    this.reset();
    return this.deserialize(entity, response);
  }.bind(this));
};

/**
 * Update with data
 * @param {Object} data
 * @return {Promise}
 */
Api.prototype.put = function(data) {
  if (this._getMode() !== 'one') {
    throw new Error("ApiService Error: .put() must be called in 'one' mode");
  }

  var entity = this._getEntity();

  var opts = {
    method: 'PUT',
    data: this.serialize(entity, data),
    url: this._getUrl()
  };

  return Api.request(opts, this._config.headers).then(function(response) {
    this.reset();
    return this.deserialize(entity, response);
  }.bind(this));
};

Api.prototype.reset = function() {
  this._stack = [];
  this._filters = [];
};

/**
 * Performs a GET request to the current endpoint the isntance
 * is set to.
 *
 * @return {Promise}
 */
Api.prototype.get = function() {
  var opts = {
    method: 'GET',
    url: this._getUrl()
  };

  // create a serialize function to pass to pipe
  var deserialize = this.deserialize.bind(this, this._getEntity());
  // var mode = this._getMode();
  var reset = this.reset.bind(this);

  return Api.request(opts, this._config.headers).then(function(results) {
    reset();

    //TODO: Not sure why we make this differentiation
    // if (mode === 'one') {
      return deserialize(results);
    // } else if (mode === 'all') {
    //   return results.map(deserialize);
    // }
  }, console.error);
};

/**
 * Performs a DELETE request to the current endpoint
 *
 * @return {Promise}
 */
Api.prototype.delete = function() {
  // TODO(jordan): should .delete() be callable after .all()
  if (this._getMode() !== 'one') {
    throw new Error("Optimizely: .delete() must be called in 'one' mode");
  }

  var opts = {
    method: 'DELETE',
    url: this._getUrl()
  };

  return Api.request(opts, this._config.headers).then(this.reset);
};

/**
 * Builds the url from this._stack
 * @private
 */
Api.prototype._getUrl = function() {
  var url = this._config.protocol + this._config.host + this._config.basePath || '';
  var filters = [];

  url = this._stack.reduce(function(memo, item) {
    var mode = item[0]; // 'one' or 'all'
    memo += '/' + item[1]; // noun
    if (mode === 'one') {
      memo += '/' + item[2]; // id
    }
    return memo;
  }, url);

  if (this._filter.length > 0) {
    url += '?';
    filters = this._filter.map(function(tuple) {
      return 'filter=' + tuple[0] + ':' + tuple[1];
    });
    url += filters.join('&');
  }

  return url + '/';
};

/**
 * Gets the entity of the url
 * @private
 */
Api.prototype._getEntity = function() {
  return this._stack[this._stack.length - 1][1];
};

/**
 * Gets the mode of the request ('one' | 'all')
 * @private
 */
Api.prototype._getMode = function() {
  return this._stack[this._stack.length - 1][0];
};

module.exports = {
  // expose the Api constructor
  Api: Api,
  // the create function used to make an api instance
  /**
   * @param {{
   *    headers: object,
   *    baseUrl: string,
   *    transforms: {
   *      <string>: {
   *        serialize: function,
   *        deserialize: function 
   *      }
   *    }
   * }} config
   */
  create: function(config) {
    return new Api(config);
  }
};
