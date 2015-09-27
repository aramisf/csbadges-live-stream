'use strict';

var _ = require('underscore');
var model = require('../models/badges');

// Send badges to model to be saved
exports.save = function (req, res, next) {
  // receiving the badges from the request. Remember that javascript does not
  // copy req.body, it actually stores a reference of req.body in badges, so
  // when you pass badges to the model, model may change it, and the next
  // middleware that tries to access req.body, will access a probable mutated
  // one. So here we use (for the first time) the underscore.
  //var badges = req.body;
  var badges = _.clone(req.body); // now we have an unreferenced copy of req.body

  // Sending the model the responsability to save received badges. The anonymous
  // function that follows will report any errors that might occur.
  model.save(badges, function (err) {

    if (err)
      // when you call 'return' in a middleware, the execution stops at that
      // point: no further middleware is executed, no back propagation happens
      // as well.
      // After this point, because you didn't call 'next', the garbage collector
      // knows the execution stops after the response ends and cleans up all the
      // memory used by this execution chain.
      return res.json(503, {  // sending also an optional status code
        error: true
      });

    // if there is no err, continues with execution
    next();

    // but don't think of it as procedural execution, it is not. Its
    // assynchronous, so the line above sends the execution flow ahead, but the
    // following line will be executed in sequence, not waiting for the next()
    // call to come back. Here we are allowing redis to work in background.
    model.trim();
  });
};

// Send badges to pub/sub socket in model
exports.send = function (req, res, next) {

  var badges = _.clone(req.body);

  model.send(badges, function (err, data) {
    // same as save method on this controller
    if (err) return res.json(503, { error: true });
    res.json(200, {error: null});
  });

  // if you don't call next here, the program won't go any further, unless the
  // current function is the last one in the calling array.
  next();
};

// Note that this one does not need to call next, because it is the last one in
// the array (of the get route (in app.js))
exports.get = function (req, res) {
  model.get(function (err, data) {
    if (err) return res.json(503, { error: true });
    res.json(200, data);
  });
};
