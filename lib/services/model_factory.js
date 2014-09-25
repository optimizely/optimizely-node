'use strict';
/**
* Factory for creating simple model objects with a restful interface
*
* @author Jordan Garcia (jordan@optimizely.com)
*/
var _ = require('lodash');
// var api = require('./api');

/**
 * config options:
 * 'entity' {String} name of entity in the API, ex: 'experiments' (unique)
 * 'instance' {Function} blank named function used as instance constructor, ex: function Audience() {}
 * 'parent' {{ entity: String, key: String }} the possibly optional parent association for fetches
 * 'available' {{ entity: String, key: String }} the possible available types off of this type
 * 'fields' {Object} (optional) hash of default values of the entity when using Model.create()
 *
 * @param {Object} config for the model and extends the model object with any properties/methods
 * @return {Function} constructor
 */
function createModel(config) {
  if (!config.entity) {
    throw new Error('"entity" is required');
  }

  var InstanceConstructor = config.instance || function ModelInstance() {};

  // Mixin methods that all models have
  var BaseModel = {
    // expose the instance constructor for `(instance instanceof Model.instance) checks
    instance: InstanceConstructor,
    api : config.api,

    /**
     * Creates a new object with the config.fields as the default values
     *
     * @param {Object=} data
     * @return {Object}
     */
    create: function(data) {
      // use the supplied constructor
      // This allows a user to pass in instance: function Audience() {}
      // and have the Audience() function return an instance of Audience
      var instance = new InstanceConstructor();
      var instanceData = _.extend(
        {},
        _.cloneDeep(config.fields || {}),
        _.cloneDeep(data || {})
      );
      // populate the instance
      _.extend(instance, instanceData);
      return instance;
    },

    /**
     * Persists entity using rest API
     *
     * @param {Model} instance
     * @return {Deferred}
     */
    save: function(instance) {
      var loadData = function(data) {
        return _.extend(instance, data);
      };

      if (instance.id) {
        // do PUT save
        return this.api
          .one(config.entity, instance.id)
          .put(instance)
          .then(loadData);
      } else {
        // no id is set, do a POST
        var endpoint = this.api;
        if (config.parent) {
          endpoint.one(config.parent.entity, instance[config.parent.key]);
        }
        endpoint.all(config.entity);

        return endpoint
          .post(instance)
          .then(loadData);
      }
    },

    /**
     * Fetch and return an entity
     * @param entityId Id of Entity to fetch
     * @returns {Deferred} Resolves to fetched Model instance
     */
    fetch: function(entityId) {
      return this.api
        .one(config.entity, entityId)
        .get()
        .then(this.create);
    },

    /**
     * Fetches all the entities that match the supplied filters
     * If the model has a parent association than the parent.key must be
     * supplied.
     * @param {Object|undefined} filters (optional)
     * @return {Deferred}
     */
    fetchAll: function(filters) {
      filters = _.clone(filters || {});
      var endpoint = this.api;

      if (config.parent && !filters[config.parent.key]) {
        throw new Error("fetchAll: must supply the parent.key as a filter to fetch all entities");
      }

      if (config.parent) {
        endpoint.one(config.parent.entity, filters[config.parent.key]);
        // since the filtering is happening in the endpoint url we dont need filters
        delete filters[config.parent.key];
      }

      console.log('entity', config.entity);

      return endpoint
        .all(config.entity)
        .filter(filters)
        .get()
        .then(function(results) {
          return results.map(this.create);
        }.bind(this));
    },

    /**
     * Makes an API request to delete the instance by id
     * @param {Model} instance
     */
    remove: function(instance) {
      if (!instance.id) {
        throw new Error("remove(): `id` must be defined");
      }

      return this.api
        .one(config.entity, instance.id)
        .delete();
    },

    /**
     * Checks if the passed in object is an instance of the supplied
     * def.instance function constructor
     *
     * @param {Object} instance
     * @param {Boolean}
     */
    isInstance: function(instance) {
      return (instance instanceof this.instance);
    },

    /**
     * Deserializes API data to be used in Javascript
     * @param {Object} data
     * @return {Object}
     */
    deserialize: function(data) {
      return this.api.deserialize(config.entity, data);
    },

    /**
     * Serializes the model instance data and prepares it in a format that is
     * consumable by the API
     *
     * @param {Object} data
     * @return {Object}
     */
    serialize: function(data) {
      return this.api.serialize(config.entity, data);
    },
    printConfig: function() {
      console.log(config);
    }
  };

  return _.extend(BaseModel, config);
}

module.exports = {
  create: createModel
};
