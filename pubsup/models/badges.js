'use strict';

var redis = require('../lib/redis');
var broadcast = require('../lib/broadcast');

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

// Trims down the redis list.
exports.trim = function () {
  // Removes the last of 10 elements.
  redis.ltrim('badges', 0,9);
};

// Send out badges to the broadcaster
// badges:    Array
// callback:  Function
exports.send = function (badges, callback) {
  // iterates through each badge on badges, calling broadcast.send on each one
  badges.forEach(broadcast.send);

  // returns 2 nulls, because a tipical callback in node, returns error and data
  // so we are representing those with null
  callback(null, null);
};

// Get badges from redis
// callback: Function
exports.get = function (callback) {
  redis.lrange('badges', 0, -1, function (err, data){
    // returns the error with no data
    if (err) return callback(err,null);

    // // interpreting the array of strings coming from redis into an array of objects
    // data = data.map(JSON.parse);

    // // returns no errors, with formatted data
    // callback(null, data);

    // both lines above made one. This will return the data back into our controller
    callback(null, data.map(JSON.parse));
  })
};
