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
  },
  protoExtend: function(sub) {
    var Super = this;
    var Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function() {
      Super.apply(this, arguments);
    };
    Constructor.prototype = Object.create(Super.prototype);
    for (var i in sub) {
      if (hasOwn.call(sub, i)) {
        Constructor.prototype[i] = sub[i];
      }
    }
    for (i in Super) {
      if (hasOwn.call(Super, i)) {
        Constructor[i] = Super[i];
      }
    }
    return Constructor;
  }
};
