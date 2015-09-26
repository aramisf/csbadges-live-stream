'use strict';

var redis = require('../lib/redis');

// Saves badges to database
// badges:    Array
// callback:  Function
exports.save = function (badges, callback) {

  if (!badges.length) return callback(null, null); // null for the error and the data

  // making an assynchronous recursion:
  var badge = badges.pop(); // removes the last badge from array

  // Using redis to push data into a list, called 'badges', that data must be in
  // string format, because redis cannot take in objects, so we use
  // JSON.stringify. On errors the anonymous function will be called, returning
  // the error and a null value for the data.
  redis.lpush('badges', JSON.stringify(badge), function(err){
    if (err) return callback(err, null);

    // Now for the assynchronous recursion. The catch here is to be able to stop
    // the recursion when there are no more badges in the array. That means we
    // have to check if there are badges in the badges array.
    exports.save(badges, callback);
  })
};
