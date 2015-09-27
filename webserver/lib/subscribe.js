'use strict';

var axon = require('axon');
var socket = axon.socket('sub');

socket.connect(2000); // same port on pubsup/lib/broadcast.js

// Binds socket on error event.
socket.on('err', function(err){
  throw err;
});

module.exports = socket;