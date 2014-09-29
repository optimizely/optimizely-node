'use strict';

module.exports = {
  getUserOptimizelyKey: function() {
    return process.env.OPTIMIZELY_TEST_API_KEY || 'abcdefjijklmnopqrstuv:123456';
  }
};
