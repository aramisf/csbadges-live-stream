// js pragmas ;)
'use strict';

// Loading an express instance inside var 'app'
var express = require('express');
var app = express();
var badges = require('./controllers/badges'); // code encapsulation for some Middleware


// Middleware: the place where all requests pass through before going to the
// routes.
//
// This one expects post requests to have content in JSON format. If there is
// JSON data, then it will be parsed by the .json() method of the express
// module.
app.use(express.json());

// --- /Middleware


// Routes:
//
// Defining a route to '/'. The anonymous function passed to post() method on app
// (an express instance), receives two parameters, the request and the response.

// This was the first attempt, just to show the app working.
// app.post('/', function(req, res) {
//
//   // The send() method on the res(ponse) parameter obviously sends a response to
//   // the client, but this comment is here because this is app is a tutorial.
//   res.send('hello world');
// });

// Here we start to work with real middleware:
app.post('/', badges.save, badges.send, function(req, res){

  // sending a response to warn when it finishes
  res.send('\ndone\n\n');
});
// --- /Routes


// Set a listening port to our app:
app.listen(2015);

