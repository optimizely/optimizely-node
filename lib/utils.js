'use strict';

var querystring = require('querystring');
var _ = require('lodash');

var hasOwn = {}.hasOwnProperty;
var toString = {}.toString;

var utils = module.exports = {

  createRequestData: function(data, prefix) {
    var output = [];

    for(var i in data) {
      if(hasOwn.call(data, i)) {
        var key = prefix ? prefix + "[" + i + "]" : i;
        var value = data[i];
        output.push(typeof value === "object" ? this.createRequestData(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }

    return output.join('&');
  }
};
