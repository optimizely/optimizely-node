# Optimizely node.js bindings

## Installation

`npm install optimizely-node`

## Documentation

Documentation is available at http://developers.optimizely.com/rest/

## API Overview

Resources are accessible via the `optimizely` instance:

```js
var optimizely = require('optimizely-node')(' your api key ')
// optimizely.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource will return a promise, so you don't have to pass a callback.

```js
optimizely.projects.fetch('<project_id>').then(function(projectData) {
  //Do things with project data
}, function(err) {
  //Handle errors
});
```

## Available Objects & Methods


* projects
  * `fetch(id)`
  * `fetchAll()`
  * `create(params)`
  * `save(instance)`
* experiments
  * `fetch(id)`
  * `fetchAll()`
  * `create(params)`
  * `save(instance)`
  * `delete(instance)`
* goals
  * `fetch(id)`
  * `fetchAll()`
  * `create(params)`
  * `save(instance)`
  * `delete(instance)`
* audiences
  * `fetch(id)`
  * `fetchAll()`
  * `create(params)`
  * `save(instance)`
  * `delete(instance)`
* variations
  * `fetch(id)`
  * `fetchAll()`
  * `create(params)`
  * `save(instance)`
  * `delete(instance)`

