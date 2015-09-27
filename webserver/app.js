'use strict';

var express = require('express');
var app = express();

// Socket.io ways to build connection
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// the socket that will be used to subscribe to pub/sub server
var subSocket = require('./lib/subscribe');

// badges model:
var badges = require('./models/badges');


var port = 3000;

// Server stuff
server.listen(port, function(){
  console.log("Server listening on port %d", port);
});


// Express stuff
// Serve static assets out of public
app.use(express.static('public'));

app.get('/', function(req, res){
  // Q: Why to do that, if we already told express to use .static('public')?
  // A: To make sure that 'public/index.html' is served, instead of a /index.html
  // that might exist. This one is the one that will be seen. One may not hit
  // index.html file out of static.
  res.sendfile('./public/index.html');
});

// Binds to 'connection' events
io.sockets.on('connection', function(socket) {
  badges.get(function(err, data) {
    if (err) return;
    // We can't use the format like data.forEach(data.map(JSON.parse)) because
    // it is necessary to emit an event.
    data.forEach(function(badge){
      socket.emit('badge', badge);
    })
  });
});


subSocket.on('message', function(message){
  // when emitting an event from the io level like this, that message is broadcasted
  // across all sockets
  io.sockets.emit('badge', message);
});
