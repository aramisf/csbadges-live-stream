'use strict';

var request = require('request');

// Get badges from the pub sub server
// callback: Function
exports.get = function(callback){
  request('http://localhost:2015/badges', function(err, request, body) {
    // instead of saying 'if (err)', we can short circuit the callback like this:
    callback(err, JSON.parse(body));
  });
};