# Optimizely node.js bindings

## Installation

`npm install optimizely`

## Documentation

Documentation is available at http://developers.optimizely.com/rest/

## API Overview

Resources are accessible via the `optimizely` instance:

```js
var optimizely = require('optimizely')(' your api key ')
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
