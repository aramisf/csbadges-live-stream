'use strict';

var redis = require('redis');
var client = redis.createClient();

// This makes clear to me what event oriented programming looks like: you are
// creating a handler, attaching it to an error handler. That event handling
// goes inside the reference that is returned to whatever includes this module.
client.on('error', function(err){
  throw err;
});

module.exports = client;