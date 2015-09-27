'use strict';

var axon = require('axon');
var socket = axon.socket('pub');

socket.bind(2000);

// Send a message to the pub socket
exports.send = function(badge){
  // individual sockets will be individual messages
  socket.send(badge);
};
// Exposing the send method from socket directly to the exports can also be
// done this way, but one would risk breaking something for not preserving
// context, so we will use the way written above.
// exports.send = socket.send;
