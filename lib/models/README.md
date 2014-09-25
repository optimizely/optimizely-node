# Javascript Models

A simple abstraction built on top of Restful API conventions

### Functionality

**Fetching a single entity by ID** 
```js
var Experiment = require('models/experiment');
Experiment.fetch(123).then(function(experiment) {
  // experiment is just a Javascript Object populated with the
  // data from the API response GET `/api/v1/experiments/123`
});
```

**Fetching a list of entities** 
```js
var Experiment = require('models/experiment');

var filters = {
  // experiment's parent is `project`, must supply project_id
  // since GET `/api/v1/experiments` is not a valid endpoint
  project_id: 4001,

  // any other supplied filters will get appending as filter query params
  status: 'Started',
};

// preforms a GET `/api/v1/projects/4001/experiments?filter=status:Started
Experiment.fetchAll(filters).then(function(experiments) {
  // experiments is an array of Javascript Objects
});
```

**Saving**
```js
var Experiment = require('models/experiment');

// helper method to create an experiment object,
// default fields can be defined in the model
var experiment = Experiment.create({
  project_id: 4001,
  description: 'My Created Experiment',
  status: 'Not Started',
});

// Preforms a POST request to /api/v1/projects/4001/experiments
Experiment.save(experiment).then(function(result) {
  // the value passed to the promise then callback is the save
  // object passed into save()

  if (experiment === result) {
    console.log("this is true");
  }

  // also any values populated by the from the backend will
  // show up on the result/experiment object
  // experiment.id is set
});
```

**Deleting**
```js
var Experiment = require('models/experiment');

Experiment.fetch(123).then(function(experiment) {
  Experiment.delete(experiment).then(function() {
    // the delete is done
  });
});
```

**Creating Model Instance and Type Checking**
```js
var Experiment = require('models/experiment');

var instance = Experiment.create({
  name: 'my name',
  status: 'Not Started',
});

// instance is simply a javascript object, but has the type Experiment
// this type can be checked using:
Experiment.isInstance(instance) // returns true
```

### Creating new models

To create new model for an endpoint you must create a new file in `js/optly/models/`.
The name of the file should be the singular entity name.

##### Example: the Audience model

A file is created at `js/optly/models/audience.js`

```js
/**
 * Audience model
 * @author Jordan Garcia (jordan@optimizely.com)
 */
define(function(require) {
  var modelFactory = require('services/model_factory');

  return modelFactory.create({
    // the entity name used in the api, ex: /api/v1/audiences/123
    entity: 'audiences',

    // the entity's parent relationship in the API
    // This is needed for things like experiments where /api/v1/experiments is not a valid endpoint
    parent: {
      entity: 'projects',
      key: 'project_id'
    },

    // must define an empty named function as the constructor
    // this allows console.log(audienceInstance) to show 'Audience'
    instance: function Audience() {},

    // optional enumerate all fields on the model instance
    // the values will be default values when using Audience.create()
    fields: {
      id: null,
      project_id: null,
      name: null,
      description: null,
      last_modified: null,
      conditions: [],
      segmentation: false
    },
  });
});
```
